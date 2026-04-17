import { useState } from 'react'
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
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

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
        </div>
      </div>
    </div>
  )
}