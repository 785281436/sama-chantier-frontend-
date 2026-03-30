import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiMessageCircle, FiFileText } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🏗️</span>
          <span>Sama <strong>Chantier</strong></span>
        </Link>

        <nav className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Accueil</NavLink>
          <NavLink to="/catalogue" onClick={() => setMenuOpen(false)}>Catalogue</NavLink>
          <NavLink to="/ouvriers" onClick={() => setMenuOpen(false)}>Ouvriers</NavLink>
        </nav>

        <div className="navbar__actions">
          <Link to="/panier" className="navbar__cart">
            <FiShoppingCart size={22} />
            {count > 0 && <span className="navbar__cart-badge">{count}</span>}
          </Link>

          {user ? (
            <div className="navbar__user" onMouseLeave={() => setDropOpen(false)}>
              <button className="navbar__avatar" onClick={() => setDropOpen(!dropOpen)}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} />
                  : <span>{user.name[0].toUpperCase()}</span>}
              </button>
              {dropOpen && (
                <div className="navbar__dropdown">
                  <p className="navbar__dropdown-name">{user.name}</p>
                  <Link to="/profil" onClick={() => setDropOpen(false)}><FiUser /> Mon profil</Link>
                  <Link to="/mes-commandes" onClick={() => setDropOpen(false)}><FiSettings /> Mes commandes</Link>
                  <Link to="/devis" onClick={() => setDropOpen(false)}><FiFileText /> Devis</Link>
                  <Link to="/messages" onClick={() => setDropOpen(false)}><FiMessageCircle /> Messages</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropOpen(false)}><FiSettings /> Administration</Link>
                  )}
                  <button onClick={handleLogout}><FiLogOut /> Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Connexion</Link>
          )}

          <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  )
}