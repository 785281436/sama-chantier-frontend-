import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from '../utils/api'

const PaymentReturn = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const [status, setStatus] = useState('loading')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (orderId) {
      checkPaymentStatus()
    }
  }, [orderId])

  const checkPaymentStatus = async () => {
    try {
      const { data } = await axios.get(`/orders/${orderId}`)
      setOrder(data)
      setStatus(data.isPaid ? 'success' : 'pending')
    } catch (error) {
      setStatus('error')
    }
  }

  if (status === 'loading') return <div>Vérification du paiement...</div>
  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>✅ Paiement réussi !</h1>
        <p>Merci pour votre commande #{orderId.slice(-8)}</p>
        <Link to="/mes-commandes">Voir mes commandes</Link>
      </div>
    )
  }
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>❌ Paiement en attente</h1>
      <p>Votre commande est enregistrée. Vous serez notifié dès confirmation.</p>
      <Link to="/mes-commandes">Voir mes commandes</Link>
    </div>
  )
}

export default PaymentReturn