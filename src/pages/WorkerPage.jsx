/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiStar, FiMapPin, FiPhone, FiCheckCircle, FiArrowLeft, FiBriefcase, FiMail, FiImage } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function WorkerPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [worker, setWorker]   = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [myReview, setMyReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    const load = async () => {
      try {
        const [w, r] = await Promise.all([
          api.get(`/workers/${id}`),
          api.get(`/reviews/worker/${id}`),
        ])
        setWorker(w.data)
        setReviews(r.data)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [id])

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Connectez-vous pour laisser un avis')
    try {
      const { data } = await api.post('/reviews', { targetType: 'worker', workerId: id, ...myReview })
      setReviews(r => [data, ...r])
      toast.success('Avis publié !')
      setMyReview({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />
  if (!worker) return <div className="container" style={{ padding: '3rem 0' }}>Ouvrier introuvable.</div>

  const u = worker.user || {}

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 860 }}>
        <Link to="/ouvriers" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <FiArrowLeft /> Retour
        </Link>

        {/* Profil */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 700, flexShrink: 0 }}>
              {u.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{u.name}</h1>
                {worker.isVerified && <span style={{ color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.85rem' }}><FiCheckCircle /> Vérifié</span>}
                <span className={`badge ${worker.availability ? 'badge-success' : 'badge-error'}`}>
                  {worker.availability ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <p style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>{worker.specialty}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--gray)', fontSize: '0.88rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiMapPin size={13} />{worker.city}</span>
                {u.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiPhone size={13} />{u.phone}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiBriefcase size={13} />{worker.experience} ans d'exp.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '0.5rem' }}>
                {[1,2,3,4,5].map(s => <FiStar key={s} size={15} fill={s <= Math.round(worker.ratings) ? '#FBBF24' : 'none'} color="#FBBF24" />)}
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{worker.ratings?.toFixed(1)}</span>
                <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>({worker.numReviews} avis · {worker.completedJobs} missions)</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {worker.dailyRate && (
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {worker.dailyRate.toLocaleString('fr-FR')} FCFA
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray)', fontWeight: 400 }}>par jour</div>
                </div>
              )}
              {u.phone && (
                <a href={`tel:${u.phone}`} className="btn btn-primary" style={{ marginTop: '0.8rem' }}>
                  <FiPhone /> Contacter
                </a>
              )}
              {user && u._id && String(user._id) !== String(u._id) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.6rem' }}>
                  <Link to={`/devis?worker=${id}`} className="btn btn-outline btn-sm">Demander un devis</Link>
                  <Link to={`/messages?to=${u._id}`} className="btn btn-outline btn-sm"><FiMail style={{ verticalAlign: 'middle' }} /> Écrire</Link>
                </div>
              )}
            </div>
          </div>
          {worker.bio && (
            <p style={{ marginTop: '1.2rem', color: 'var(--gray)', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              {worker.bio}
            </p>
          )}
          {worker.skills?.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {worker.skills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
            </div>
          )}
        </div>

        {worker.portfolio?.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiImage /> Réalisations (portfolio)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
              {worker.portfolio.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '1', background: 'var(--gray-light)' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Avis */}
        <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Avis ({reviews.length})</h2>
        {user && (
          <form className="card" style={{ padding: '1.2rem', marginBottom: '1.2rem' }} onSubmit={submitReview}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.8rem' }}>Laisser un avis</h3>
            <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.8rem' }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setMyReview(r => ({ ...r, rating: s }))}>
                  <FiStar size={22} fill={s <= myReview.rating ? '#FBBF24' : 'none'} color="#FBBF24" />
                </button>
              ))}
            </div>
            <textarea className="form-control" rows={3} placeholder="Votre expérience…"
              value={myReview.comment} onChange={e => setMyReview(r => ({ ...r, comment: e.target.value }))}
              required style={{ marginBottom: '0.8rem' }} />
            <button className="btn btn-primary" type="submit">Publier</button>
          </form>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {reviews.length === 0 && <p style={{ color: 'var(--gray)' }}>Aucun avis pour cet ouvrier.</p>}
          {reviews.map(r => (
            <div key={r._id} className="card" style={{ padding: '1rem 1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <strong>{r.user?.name || 'Anonyme'}</strong>
                <div style={{ display: 'flex' }}>{[1,2,3,4,5].map(s => <FiStar key={s} size={13} fill={s <= r.rating ? '#FBBF24' : 'none'} color="#FBBF24" />)}</div>
                <span style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <p style={{ color: 'var(--gray)', fontSize: '0.92rem' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}