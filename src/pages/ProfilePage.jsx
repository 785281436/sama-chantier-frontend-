import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../utils/api'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    address: user?.address || '', city: user?.city || '', newPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [workerProfile, setWorkerProfile] = useState(null)
  const [portfolioUrls, setPortfolioUrls] = useState('')
  const [savingPortfolio, setSavingPortfolio] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (user?.role !== 'worker') return
    api.get('/workers/me')
      .then(r => {
        setWorkerProfile(r.data)
        setPortfolioUrls((r.data.portfolio || []).join('\n'))
      })
      .catch(() => setWorkerProfile(null))
  }, [user?.role])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const body = { name: form.name, phone: form.phone, address: form.address, city: form.city }
      if (form.newPassword) body.password = form.newPassword
      const { data } = await api.put('/auth/profile', body)
      updateUser(data)
      toast.success('Profil mis à jour !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
    setLoading(false)
  }

  const savePortfolio = async (e) => {
    e.preventDefault()
    if (!workerProfile?._id) return
    setSavingPortfolio(true)
    try {
      const portfolio = portfolioUrls.split(/\n/).map(s => s.trim()).filter(Boolean)
      const { data } = await api.put(`/workers/${workerProfile._id}`, { portfolio })
      setWorkerProfile(data)
      toast.success('Portfolio mis à jour')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
    setSavingPortfolio(false)
  }

  const uploadPortfolioImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !workerProfile?._id) return
    const fd = new FormData()
    fd.append('image', file)
    try {
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const url = data.url || data.secure_url
      if (url) {
        setPortfolioUrls(prev => (prev ? `${prev}\n${url}` : url))
        toast.success('Image ajoutée (enregistrez le portfolio)')
      }
    } catch {
      toast.error('Échec upload')
    }
    e.target.value = ''
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 className="section-title">Mon profil</h1>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontWeight: 800 }}>{user?.name}</h2>
              <p style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
                {user?.email} · <span className="badge badge-primary">{user?.role}</span>
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom complet</label>
              <input className="form-control" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input className="form-control" value={form.phone} onChange={set('phone')} placeholder="+221 77 000 00 00" />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input className="form-control" value={form.address} onChange={set('address')} />
            </div>
            <div className="form-group">
              <label>Ville</label>
              <input className="form-control" value={form.city} onChange={set('city')} placeholder="Dakar" />
            </div>
            <hr style={{ margin: '1.2rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
            <div className="form-group">
              <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
              <input className="form-control" type="password" value={form.newPassword} onChange={set('newPassword')} placeholder="Nouveau mot de passe" />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Mise à jour…' : 'Sauvegarder'}
            </button>
          </form>

          {user?.role === 'worker' && workerProfile && (
            <form onSubmit={savePortfolio} style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Portfolio chantiers</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                Une URL par ligne (images Cloudinary ou liens publics). Vous pouvez aussi envoyer une image :
              </p>
              <input type="file" accept="image/*" onChange={uploadPortfolioImage} style={{ marginBottom: '0.75rem' }} />
              <textarea
                className="form-control"
                rows={5}
                placeholder="https://…"
                value={portfolioUrls}
                onChange={e => setPortfolioUrls(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.75rem' }} disabled={savingPortfolio}>
                {savingPortfolio ? 'Enregistrement…' : 'Enregistrer le portfolio'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}