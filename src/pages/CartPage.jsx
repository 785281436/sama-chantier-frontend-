import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const navigate = useNavigate()
  const deliveryFee = total > 50000 ? 0 : 2000
  const grandTotal  = total + deliveryFee

  if (items.length === 0) return (
    <div className="page-wrapper">
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <FiShoppingBag size={64} color="var(--gray)" />
        <h2 style={{ margin: '1rem 0 0.5rem', fontWeight: 800 }}>Votre panier est vide</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Découvrez notre catalogue !</p>
        <Link to="/catalogue" className="btn btn-primary btn-lg">Voir le catalogue</Link>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 className="section-title">Mon panier ({items.length})</h1>
          <button className="btn btn-outline btn-sm" onClick={clearCart}>Vider</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
          {/* Articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                <img src={item.images?.[0] || 'https://placehold.co/80x80?text=?'} alt={item.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>{item.name}</p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{item.price?.toLocaleString('fr-FR')} FCFA / {item.unit}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1.5px solid var(--border)', borderRadius: 6 }}>
                  <button onClick={() => updateQty(item._id, item.quantity - 1)} style={{ padding: '0.35rem 0.6rem', background: 'var(--gray-light)', border: 'none', cursor: 'pointer' }}><FiMinus size={13} /></button>
                  <span style={{ padding: '0 0.5rem', fontWeight: 700 }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)} style={{ padding: '0.35rem 0.6rem', background: 'var(--gray-light)', border: 'none', cursor: 'pointer' }}><FiPlus size={13} /></button>
                </div>
                <p style={{ fontWeight: 800, color: 'var(--primary)', minWidth: 110, textAlign: 'right' }}>
                  {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                </p>
                <button onClick={() => removeItem(item._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Résumé */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1.2rem' }}>Récapitulatif</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Sous-total</span><span>{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Livraison</span>
                <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                  {deliveryFee === 0 ? 'Gratuite 🎉' : `${deliveryFee.toLocaleString('fr-FR')} FCFA`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', borderTop: '2px solid var(--border)', paddingTop: '0.8rem' }}>
                <span>Total</span><span>{grandTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/commande')}>
              Commander <FiArrowRight />
            </button>
            <Link to="/catalogue" className="btn btn-outline btn-full" style={{ marginTop: '0.7rem' }}>
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}