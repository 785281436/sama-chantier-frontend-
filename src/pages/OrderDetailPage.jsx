import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiPhone } from 'react-icons/fi'
import api from '../utils/api'

const STATUS_STEPS = ['en_attente','confirme','en_livraison','livre']
const STATUS_FR    = { en_attente:'En attente', confirme:'Confirmé', en_livraison:'En livraison', livre:'Livré', annule:'Annulé' }

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />
  if (!order)  return <div className="container" style={{ padding: '3rem 0', color: 'var(--gray)' }}>Commande introuvable.</div>

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/mes-commandes" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <FiArrowLeft /> Mes commandes
        </Link>
        <h1 className="section-title">Commande #{order._id.slice(-8).toUpperCase()}</h1>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* Suivi */}
        {order.status !== 'annule' && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1.2rem' }}>Suivi</h2>
            <div style={{ display: 'flex' }}>
              {STATUS_STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: i <= currentStep ? 'var(--primary)' : 'var(--border)', color: i <= currentStep ? '#fff' : 'var(--gray)', margin: '0 auto 0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ position: 'absolute', top: 16, left: '60%', right: '-40%', height: 2, background: i < currentStep ? 'var(--primary)' : 'var(--border)' }} />
                  )}
                  <span style={{ fontSize: '0.78rem', color: i <= currentStep ? 'var(--primary)' : 'var(--gray)', fontWeight: i === currentStep ? 700 : 400 }}>
                    {STATUS_FR[s]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Articles</h2>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.7rem 0', borderBottom: '1px solid var(--border)' }}>
              <img src={item.image || 'https://placehold.co/60x60?text=?'} alt={item.name}
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700 }}>{item.name}</p>
                <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Qté : {item.quantity} × {item.price?.toLocaleString('fr-FR')} FCFA</p>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{(item.price * item.quantity)?.toLocaleString('fr-FR')} FCFA</span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span>Sous-total</span><span>{order.subtotal?.toLocaleString('fr-FR')} FCFA</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span>Livraison</span><span>{order.deliveryFee === 0 ? 'Gratuite' : `${order.deliveryFee?.toLocaleString('fr-FR')} FCFA`}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
              <span>Total</span><span>{order.total?.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>

        {/* Livraison & paiement */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.7rem' }}>Livraison</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray)', fontSize: '0.9rem' }}>
              <FiMapPin size={13} />{order.shippingAddress?.address}, {order.shippingAddress?.city}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              <FiPhone size={13} />{order.shippingAddress?.phone}
            </p>
          </div>
          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.7rem' }}>Paiement</h3>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Mode : <strong>{order.paymentMethod?.replace('_', ' ')}</strong></p>
            <p style={{ color: order.isPaid ? 'var(--success)' : 'var(--warning)', fontWeight: 700, marginTop: '0.3rem', fontSize: '0.9rem' }}>
              {order.isPaid ? '✅ Payé' : '⏳ En attente'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}