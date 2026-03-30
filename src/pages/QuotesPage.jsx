import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiSend } from 'react-icons/fi'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const STATUS_FR = {
  demande: 'En attente de réponse',
  devis_envoye: 'Devis reçu',
  accepte: 'Accepté',
  refuse: 'Refusé',
  annule: 'Annulé',
}

export default function QuotesPage() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const workerIdParam = params.get('worker')

  const [asClient, setAsClient] = useState([])
  const [asWorker, setAsWorker] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    workerId: workerIdParam || '',
    title: '',
    description: '',
  })
  const [workerReply, setWorkerReply] = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/quotes/mine')
      setAsClient(data.asClient || [])
      setAsWorker(data.asWorker || [])
    } catch {
      toast.error('Impossible de charger les devis')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (workerIdParam) setForm(f => ({ ...f, workerId: workerIdParam }))
  }, [workerIdParam])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.workerId || !form.title.trim()) return toast.error('Remplissez les champs')
    try {
      await api.post('/quotes', {
        workerId: form.workerId,
        title: form.title,
        description: form.description,
      })
      toast.success('Demande envoyée')
      setForm({ workerId: '', title: '', description: '' })
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
  }

  const sendQuote = async (id) => {
    const r = workerReply[id] || {}
    if (r.amount == null || r.amount === '') return toast.error('Indiquez un montant')
    try {
      await api.put(`/quotes/${id}`, {
        proposedAmount: Number(r.amount),
        workerMessage: r.msg || '',
        status: 'devis_envoye',
      })
      toast.success('Devis envoyé au client')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
  }

  const clientAction = async (id, status) => {
    try {
      await api.put(`/quotes/${id}`, { status })
      toast.success('Mis à jour')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
  }

  if (!user) return null

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/ouvriers" className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
          <FiArrowLeft /> Ouvriers
        </Link>
        <h1 className="section-title">Mes devis</h1>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Nouvelle demande</h2>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div className="form-group">
              <label>ID profil ouvrier</label>
              <input
                className="form-control"
                placeholder="Collez l’ID depuis l’URL du profil ouvrier"
                value={form.workerId}
                onChange={e => setForm(f => ({ ...f, workerId: e.target.value }))}
                required
              />
              <small style={{ color: 'var(--gray)' }}>Ex. : /ouvriers/<strong>65abc…</strong></small>
            </div>
            <div className="form-group">
              <label>Titre du projet</label>
              <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary"><FiSend /> Envoyer la demande</button>
          </form>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Mes demandes (client)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
              {asClient.length === 0 && <p style={{ color: 'var(--gray)' }}>Aucune demande.</p>}
              {asClient.map(q => (
                <div key={q._id} className="card" style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <strong>{q.title}</strong>
                    <span className="badge badge-primary">{STATUS_FR[q.status]}</span>
                  </div>
                  <p style={{ color: 'var(--gray)', margin: '0.5rem 0', fontSize: '0.9rem' }}>{q.description}</p>
                  <p style={{ fontSize: '0.88rem' }}>
                    Artisan : {q.worker?.user?.name || '—'} · {q.worker?.specialty}
                  </p>
                  {q.proposedAmount != null && q.status === 'devis_envoye' && (
                    <p style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>
                      Montant proposé : {q.proposedAmount.toLocaleString('fr-FR')} FCFA
                    </p>
                  )}
                  {q.workerMessage && <p style={{ fontSize: '0.88rem', marginTop: '0.4rem' }}>Message : {q.workerMessage}</p>}
                  {q.status === 'devis_envoye' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => clientAction(q._id, 'accepte')}>Accepter</button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => clientAction(q._id, 'refuse')}>Refuser</button>
                    </div>
                  )}
                  {['demande', 'devis_envoye'].includes(q.status) && (
                    <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => clientAction(q._id, 'annule')}>Annuler</button>
                  )}
                </div>
              ))}
            </div>

            {asWorker.length > 0 && (
              <>
                <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Demandes reçues (artisan)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {asWorker.map(q => (
                    <div key={q._id} className="card" style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <strong>{q.title}</strong>
                        <span className="badge badge-primary">{STATUS_FR[q.status]}</span>
                      </div>
                      <p style={{ color: 'var(--gray)', margin: '0.5rem 0' }}>{q.description}</p>
                      <p style={{ fontSize: '0.88rem' }}>Client : {q.client?.name} · {q.client?.phone || q.client?.email}</p>
                      {q.status === 'demande' && (
                        <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 320 }}>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Montant (FCFA)"
                            value={workerReply[q._id]?.amount ?? ''}
                            onChange={e => setWorkerReply(r => ({ ...r, [q._id]: { ...r[q._id], amount: e.target.value } }))}
                          />
                          <textarea
                            className="form-control"
                            rows={2}
                            placeholder="Message au client"
                            value={workerReply[q._id]?.msg ?? ''}
                            onChange={e => setWorkerReply(r => ({ ...r, [q._id]: { ...r[q._id], msg: e.target.value } }))}
                          />
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => sendQuote(q._id)}>Envoyer le devis</button>
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => api.put(`/quotes/${q._id}`, { status: 'refuse' }).then(() => { toast.success('Refusé'); load() })}>Refuser</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
