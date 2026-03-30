import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { FiCheckCircle, FiClock } from 'react-icons/fi'

export default function PaymentReturnPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    api.get(`/orders/${orderId}`)
      .then(r => setOrder(r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <div className="page-wrapper"><div className="container"><div className="spinner" style={{ marginTop: '4rem' }} /></div></div>

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 520, textAlign: 'center', padding: '3rem 1rem' }}>
        {!orderId && <p>Paramètre de commande manquant.</p>}
        {orderId && !order && <p>Impossible de charger la commande. Connectez-vous si besoin.</p>}
        {order && (
          <>
            {order.isPaid ? (
              <>
                <FiCheckCircle size={56} color="var(--success)" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Paiement confirmé</h1>
                <p style={{ color: 'var(--gray)', margin: '1rem 0' }}>
                  Merci ! Votre commande #{String(order._id).slice(-8).toUpperCase()} est enregistrée comme payée.
                </p>
              </>
            ) : (
              <>
                <FiClock size={56} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Paiement en cours de traitement</h1>
                <p style={{ color: 'var(--gray)', margin: '1rem 0' }}>
                  Si vous avez payé, la confirmation peut prendre quelques instants. Vous recevrez un e-mail une fois le paiement validé.
                </p>
              </>
            )}
            <Link to={`/mes-commandes/${order._id}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>Voir la commande</Link>
          </>
        )}
        <Link to="/" className="btn btn-outline" style={{ marginTop: '0.75rem', display: 'inline-block' }}>Accueil</Link>
      </div>
    </div>
  )
}
