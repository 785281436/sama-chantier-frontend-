import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiCheckCircle } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import api from '../utils/api'

const PAYMENT_METHODS = [
  { key: 'wave',         label: '💳 Wave' },
  { key: 'orange_money', label: '📱 Orange Money' },
  { key: 'free_money',   label: '📲 Free Money' },
  { key: 'cash',         label: '💵 Paiement à la livraison' },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate  = useNavigate()
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [form, setForm] = useState({ address: '', city: 'Dakar', phone: '', notes: '', paymentMethod: 'wave' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const deliveryFee = total > 50000 ? 0 : 2000

  const placeOrder = async () => {
    if (!form.address || !form.phone) return toast.error('Remplissez tous les champs')
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: { address: form.address, city: form.city, phone: form.phone },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      })
      setOrderId(data._id)
      clearCart()
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande')
    }
    setLoading(false)
  }

  if (step === 3) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="card" style={{ maxWidth: 480, margin: '4rem auto', padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <FiCheckCircle size={64} color="var(--success)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Commande confirmée ! 🎉</h2>
          <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>Notre équipe vous contactera sous peu.</p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigate(`/mes-commandes/${orderId}`)}>Voir ma commande</button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Retour à l'accueil</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title">Finaliser la commande</h1>

        {/* Steps indicator */}
        <div style={{ display: 'flex', marginBottom: '2rem' }}>
          {['Livraison','Paiement','Confirmation'].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '0.8rem', background: step === i + 1 ? 'var(--primary-light)' : step > i + 1 ? '#d1fae5' : 'var(--gray-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, color: step === i + 1 ? 'var(--primary)' : step > i + 1 ? 'var(--success)' : 'var(--gray)' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: step === i + 1 ? 'var(--primary)' : step > i + 1 ? 'var(--success)' : 'var(--gray)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
                {step > i + 1 ? '✓' : i + 1}
              </span>
              {s}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          <div className="card" style={{ padding: '1.8rem' }}>
            {step === 1 && (
              <>
                <h2 style={{ fontWeight: 800, marginBottom: '1.2rem' }}>Adresse de livraison</h2>
                <div className="form-group"><label>Adresse *</label><input className="form-control" placeholder="N° rue, quartier…" value={form.address} onChange={set('address')} required /></div>
                <div className="form-group">
                  <label>Ville *</label>
                  <select className="form-control" value={form.city} onChange={set('city')}>
                    {['Dakar','Thiès','Saint-Louis','Ziguinchor','Kaolack','Mbour'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Téléphone *</label><input className="form-control" placeholder="+221 77 000 00 00" value={form.phone} onChange={set('phone')} required /></div>
                <div className="form-group"><label>Instructions (optionnel)</label><textarea className="form-control" rows={2} value={form.notes} onChange={set('notes')} /></div>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} disabled={!form.address || !form.phone}>Continuer</button>
              </>
            )}
            {step === 2 && (
              <>
                <h2 style={{ fontWeight: 800, marginBottom: '1.2rem' }}>Mode de paiement</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.key} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.85rem 1rem', border: `1.5px solid ${form.paymentMethod === m.key ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: form.paymentMethod === m.key ? 'var(--primary-light)' : '#fff', fontWeight: form.paymentMethod === m.key ? 700 : 500 }}>
                      <input type="radio" name="pay" value={m.key} checked={form.paymentMethod === m.key} onChange={set('paymentMethod')} style={{ display: 'none' }} />
                      {m.label}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Retour</button>
                  <button className="btn btn-primary btn-lg" onClick={placeOrder} disabled={loading}>
                    {loading ? 'Traitement…' : `Confirmer — ${(total + deliveryFee).toLocaleString('fr-FR')} FCFA`}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Résumé */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Votre commande</h2>
            {items.map(i => (
              <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.35rem 0' }}>
                <span>{i.name} ×{i.quantity}</span>
                <span>{(i.price * i.quantity).toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.7rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}><span>Livraison</span><span>{deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString('fr-FR')} FCFA`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--primary)' }}><span>Total</span><span>{(total + deliveryFee).toLocaleString('fr-FR')} FCFA</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}