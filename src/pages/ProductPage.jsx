/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiShoppingCart, FiStar, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [qty, setQty]         = useState(1)
  const [loading, setLoading] = useState(true)
  const [myReview, setMyReview] = useState({ rating: 5, comment: '' })
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const [p, r] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`),
        ])
        setProduct(p.data)
        setReviews(r.data)
        setImgIndex(0)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [id])

  const handleAdd = () => {
    addItem(product, qty)
    toast.success(`${qty}x ${product.name} ajouté au panier`)
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Connectez-vous pour laisser un avis')
    try {
      const { data } = await api.post('/reviews', { targetType: 'product', productId: id, ...myReview })
      setReviews(r => [data, ...r])
      toast.success('Avis publié !')
      setMyReview({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />
  if (!product) return <div className="container" style={{ padding: '3rem 0' }}>Produit introuvable.</div>

  const images = product.images?.filter(Boolean).length ? product.images.filter(Boolean) : ['https://placehold.co/500x400?text=Produit']
  const mainSrc = images[Math.min(imgIndex, images.length - 1)]

  return (
    <div className="page-wrapper">
      <div className="container">
        <Link to="/catalogue" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <FiArrowLeft /> Retour au catalogue
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--gray-light)' }}>
              <img
                src={mainSrc}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: images.length > 1 ? 'pointer' : 'default' }}
                onError={e => { e.target.src = 'https://placehold.co/500x400?text=Image' }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    style={{
                      padding: 0,
                      border: i === imgIndex ? '2px solid var(--primary)' : '2px solid var(--border)',
                      borderRadius: 8,
                      width: 64,
                      height: 64,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'var(--gray-light)',
                    }}
                  >
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://placehold.co/64?text=×' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <span className="badge badge-primary">{product.category}</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {[1,2,3,4,5].map(s => <FiStar key={s} size={16} fill={s <= Math.round(product.ratings) ? '#FBBF24' : 'none'} color="#FBBF24" />)}
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.ratings?.toFixed(1)}</span>
              <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>({product.numReviews} avis)</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
              {product.price?.toLocaleString('fr-FR')} FCFA
              <small style={{ fontSize: '0.9rem', color: 'var(--gray)', fontWeight: 400 }}> / {product.unit}</small>
            </div>
            <p style={{ color: 'var(--gray)', lineHeight: 1.7 }}>{product.description}</p>
            <p style={{ fontSize: '0.9rem' }}>
              <strong>Stock : </strong>
              <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                {product.stock > 0 ? `${product.stock} disponible(s)` : 'Rupture de stock'}
              </span>
            </p>

            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 6 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0.5rem 0.8rem', background: 'var(--gray-light)', border: 'none', cursor: 'pointer' }}><FiMinus /></button>
                  <span style={{ padding: '0 1rem', fontWeight: 700 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '0.5rem 0.8rem', background: 'var(--gray-light)', border: 'none', cursor: 'pointer' }}><FiPlus /></button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleAdd}>
                  <FiShoppingCart /> Ajouter au panier
                </button>
              </div>
            )}
          </div>
        </div>

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
            <textarea className="form-control" rows={3} placeholder="Votre avis sur ce produit…"
              value={myReview.comment} onChange={e => setMyReview(r => ({ ...r, comment: e.target.value }))}
              required style={{ marginBottom: '0.8rem' }} />
            <button className="btn btn-primary" type="submit">Publier</button>
          </form>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {reviews.length === 0 && <p style={{ color: 'var(--gray)' }}>Aucun avis pour ce produit.</p>}
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