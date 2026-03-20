import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'client' })
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Mot de passe : 6 caractères minimum')
    const res = await register(form)
    if (res.success) { toast.success('Compte créé !'); navigate('/') }
    else setError(res.message)
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">🏗️</div>
        <h1>Créer un compte</h1>
        <p className="auth-sub">Rejoignez la communauté Sama Chantier</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input className="form-control" placeholder="Prénom Nom" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" placeholder="exemple@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input className="form-control" placeholder="+221 77 000 00 00" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input className="form-control" type="password" placeholder="Min. 6 caractères" value={form.password} onChange={set('password')} required />
          </div>
          <div className="form-group">
            <label>Je suis</label>
            <div className="auth-roles">
              {['client', 'worker'].map(r => (
                <label key={r} className={`role-option ${form.role === r ? 'active' : ''}`}>
                  <input type="radio" name="role" value={r} checked={form.role === r} onChange={set('role')} />
                  {r === 'client' ? '🏠 Client' : '👷 Ouvrier'}
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>
        <p className="auth-switch">Déjà un compte ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  )
}