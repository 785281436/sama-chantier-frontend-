import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(form.email, form.password)
    if (res.success) { toast.success('Bienvenue !'); navigate('/') }
    else setError(res.message)
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">🏗️</div>
        <h1>Connexion</h1>
        <p className="auth-sub">Accédez à votre espace Sama Chantier</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" placeholder="exemple@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <p className="auth-switch">Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
      </div>
    </div>
  )
}