import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiTruck, FiShield, FiHeadphones, FiArrowRight } from 'react-icons/fi'
import api from '../utils/api'
import ProductCard from '../components/common/ProductCard'
import TopWorkersSection from '../components/common/TopWorkersSection'
import './HomePage.css'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get('/products/featured')
      setFeaturedProducts(data)
    } catch (error) {
      console.error('Erreur chargement produits:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="homepage">
      {/* ========== HERO BANNER ========== */}
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">BIENVENUE CHEZ <span>SAMA CHANTIER</span></h1>
          <p className="hero-subtitle">
            Votre partenaire de confiance pour tous vos projets de construction et de rénovation
          </p>
          <div className="hero-buttons">
            <Link to="/catalogue" className="btn-hero-primary">
              Découvrir nos produits <FiArrowRight />
            </Link>
            <Link to="/ouvriers" className="btn-hero-secondary">
              Trouver un ouvrier
            </Link>
          </div>
        </div>
      </section>

      {/* ========== STATS / AVANTAGES ========== */}
      <section className="advantages">
        <div className="container">
          <div className="advantages-grid">
            <div className="advantage-card">
              <FiTruck className="advantage-icon" />
              <h3>Livraison rapide</h3>
              <p>Partout au Sénégal sous 48h</p>
            </div>
            <div className="advantage-card">
              <FiShield className="advantage-icon" />
              <h3>Qualité garantie</h3>
              <p>Produits certifiés et normes respectées</p>
            </div>
            <div className="advantage-card">
              <FiHeadphones className="advantage-icon" />
              <h3>Support 24/7</h3>
              <p>Une équipe à votre écoute</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRODUITS EN VEDETTE ========== */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>📦 Nos produits phares</h2>
            <p>Des matériaux de qualité pour tous vos chantiers</p>
            <Link to="/catalogue" className="view-all">
              Voir tout le catalogue <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="loading-spinner">Chargement des produits...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== CATÉGORIES POPULAIRES ========== */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>🏗️ Catégories populaires</h2>
            <p>Ce que nos clients recherchent le plus</p>
          </div>
          <div className="categories-grid">
            <Link to="/catalogue?category=carrelage" className="category-card carrelage">
              <span>Carrelage & Sols</span>
            </Link>
            <Link to="/catalogue?category=ciment" className="category-card ciment">
              <span>Ciment & Mortier</span>
            </Link>
            <Link to="/catalogue?category=peinture" className="category-card peinture">
              <span>Peinture & Revêtements</span>
            </Link>
            <Link to="/catalogue?category=outillage" className="category-card outillage">
              <span>Outillage & Matériel</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TOP WORKERS SECTION ========== */}
      <TopWorkersSection />

      {/* ========== CTA FINAL ========== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Vous avez un projet de construction ?</h2>
            <p>Commandez vos matériaux en ligne et trouvez les meilleurs ouvriers près de chez vous</p>
            <Link to="/catalogue" className="btn-cta">
              Commander maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage