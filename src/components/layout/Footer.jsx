import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__logo">🏗️ Sama <strong>Chantier</strong></div>
          <p className="footer__desc">La plateforme BTP du Sénégal. Achetez vos matériaux et trouvez des ouvriers qualifiés en quelques clics.</p>
          <div className="footer__contact">
            <span><FiMapPin size={14} /> Dakar, Sénégal</span>
            <span><FiPhone size={14} /> +221 77 000 00 00</span>
            <span><FiMail size={14} /> contact@samachantier.sn</span>
          </div>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/ouvriers">Ouvriers</Link></li>
            <li><Link to="/panier">Panier</Link></li>
          </ul>
        </div>
        <div>
          <h4>Catégories</h4>
          <ul>
            <li><Link to="/catalogue?category=carreaux">Carreaux</Link></li>
            <li><Link to="/catalogue?category=ciment">Ciment</Link></li>
            <li><Link to="/catalogue?category=peinture">Peinture</Link></li>
            <li><Link to="/catalogue?category=plomberie">Plomberie</Link></li>
          </ul>
        </div>
        <div>
          <h4>Paiement accepté</h4>
          <div className="footer__payments">
            <span className="payment-badge">💳 Wave</span>
            <span className="payment-badge">📱 Orange Money</span>
            <span className="payment-badge">💵 Cash</span>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Sama Chantier — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  )
}