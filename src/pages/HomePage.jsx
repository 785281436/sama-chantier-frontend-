/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag, FiUsers, FiTruck, FiShield } from 'react-icons/fi'
import api from '../utils/api'
import ProductCard from '../components/common/ProductCard'
import './HomePage.css'

const CATEGORIES = [
  { key: 'carreaux',    label: 'Carreaux',    icon: '🪟' },
  { key: 'ciment',      label: 'Ciment',      icon: '🏗️' },
  { key: 'peinture',    label: 'Peinture',    icon: '🎨' },
  { key: 'fer',         label: 'Fer / Métal', icon: '⚙️' },
  { key: 'plomberie',   label: 'Plomberie',   icon: '🚿' },
  { key: 'electricite', label: 'Électricité', icon: '⚡' },
  { key: 'bois',        label: 'Bois',        icon: '🪵' },
  { key: 'outillage',   label: 'Outillage',   icon: '🔧' },
]

const WHY = [
  { icon: <FiShoppingBag size={28} />, title: 'Catalogue complet',  desc: 'Des milliers de matériaux BTP disponibles en ligne, livrés partout au Sénégal.' },
  { icon: <FiUsers size={28} />,       title: 'Ouvriers vérifiés',  desc: 'Trouvez des artisans qualifiés et notés par la communauté.' },
  { icon: <FiTruck size={28} />,       title: 'Livraison rapide',   desc: 'Livraison gratuite dès 50 000 FCFA. Suivi en temps réel.' },
  { icon: <FiShield size={28} />,      title: 'Paiement sécurisé',  desc: 'Wave, Orange Money, Free Money ou espèces. Transactions protégées.' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
   
  const [workers, setWorkers]   = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [p, w] = await Promise.all([
          api.get('/products/featured'),
          api.get('/workers?limit=4'),
        ])
        setFeatured(p.data)
        setWorkers(w.data.workers || [])
      // eslint-disable-next-line no-empty
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    window.location.href = `/catalogue?keyword=${search}`
  }

  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>Construisez au <span className="hero__accent">Sénégal</span> sans complexité 🏗️</h1>
            <p>Achetez vos matériaux BTP en ligne et trouvez des ouvriers qualifiés — tout en un seul endroit.</p>
            <form className="hero__search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Rechercher carreaux, ciment, maçon…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Rechercher</button>
            </form>
            <div className="hero__cta">
              <Link to="/catalogue" className="btn btn-primary btn-lg">Voir le catalogue <FiArrowRight /></Link>
              <Link to="/ouvriers"  className="btn btn-outline btn-lg">Trouver un ouvrier</Link>
            </div>
          </div>
          <div className="hero__image">
            <div className="hero__img-block">
              <span>🏗️</span>
              <div className="hero__stat">              <strong>500+</strong><span>Produits</span></div>
              <div className="hero__stat hero__stat--2"><strong>200+</strong><span>Ouvriers</span></div>
              <div className="hero__stat hero__stat--3"><strong>4,8 ⭐</strong><span>Note moy.</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Catégories ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Nos catégories</h2>
          <p className="section-subtitle">Tous les matériaux dont vous avez besoin</p>
          <div className="home__categories">
            {CATEGORIES.map(c => (
              <Link key={c.key} to={`/catalogue?category=${c.key}`} className="home__cat-card">
                <span className="home__cat-icon">{c.icon}</span>
                <span>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produits en vedette ── */}
      <section className="section" style={{ background: 'var(--gray-light)', padding: '3rem 0' }}>
        <div className="container">
          <div className="home__section-head">
            <div>
              <h2 className="section-title">Produits en vedette</h2>
              <p className="section-subtitle">Les meilleures offres du moment</p>
            </div>
            <Link to="/catalogue" className="btn btn-outline">Voir tout <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : featured.length === 0 ? (
            <div className="home__empty">
              <p>Aucun produit pour le moment — revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid-4">
              {featured.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Pourquoi nous ── */}
      <section className="section home__why">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Pourquoi Sama Chantier ?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>La plateforme BTP pensée pour le marché sénégalais</p>
          <div className="grid-4" style={{ marginTop: '2rem' }}>
            {WHY.map((w, i) => (
              <div key={i} className="home__why-card card">
                <div className="home__why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner ouvriers ── */}
      <section className="home__banner">
        <div className="container home__banner-inner">
          <div>
            <h2>Vous êtes un ouvrier qualifié ?</h2>
            <p>Rejoignez notre réseau et trouvez des chantiers près de chez vous.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            Créer mon profil <FiArrowRight />
          </Link>
        </div>
      </section>

    </div>
  )
}