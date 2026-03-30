import { Link } from 'react-router-dom'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} ajouté au panier`)
  }

  return (
    <Link to={`/produits/${product._id}`} className="product-card card">
      <div className="product-card__img">
        <img
          src={product.images?.[0] || 'https://placehold.co/300x200?text=Produit'}
          alt={product.name}
          loading="lazy"
          onError={e => { e.target.src = 'https://placehold.co/300x200?text=Produit' }}
        />
        {product.stock === 0 && <span className="product-card__out">Rupture</span>}
        {product.featured && <span className="product-card__featured">⭐ Vedette</span>}
      </div>
      <div className="product-card__body">
        <span className="badge badge-primary product-card__cat">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <FiStar size={13} fill="#FBBF24" color="#FBBF24" />
          <span>{product.ratings?.toFixed(1) || '0.0'}</span>
          <span className="product-card__reviews">({product.numReviews} avis)</span>
        </div>
        <div className="product-card__footer">
          <div className="product-card__price">
            {product.price.toLocaleString('fr-FR')} <small>FCFA/{product.unit}</small>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={product.stock === 0}>
            <FiShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  )
}