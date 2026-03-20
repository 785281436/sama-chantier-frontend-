import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiEye } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../utils/api'

const STATUS_OPTIONS = ['en_attente','confirme','en_livraison','livre','annule']
const STATUS_FR  = { en_attente:'En attente', confirme:'Confirmé', en_livraison:'En livraison', livre:'Livré', annule:'Annulé' }
const STATUS_CLS = { en_attente:'badge-warning', confirme:'badge-primary', en_livraison:'badge-primary', livre:'badge-success', annule:'badge-error' }

export default function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
      toast.success('Statut mis à jour !')
    // eslint-disable-next-line no-unused-vars
    } catch (_) { toast.error('Erreur') }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <Link to="/admin" className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
          <FiArrowLeft /> Dashboard
        </Link>
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Gestion des commandes</h1>

        {loading ? <div className="spinner" /> : (
          <div className="card" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--gray)', marginBottom: '1rem', fontSize: '0.88rem' }}>{orders.length} commande(s)</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['ID','Client','Total','Paiement','Statut','Date','Action'].map(h => (
                      <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: 'var(--gray)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: 'var(--primary)' }}>#{o._id.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>{o.user?.name || '—'}</td>
                      <td style={{ padding: '0.7rem 0.8rem', fontWeight: 700 }}>{o.total?.toLocaleString('fr-FR')} F</td>
                      <td style={{ padding: '0.7rem 0.8rem', textTransform: 'capitalize' }}>{o.paymentMethod?.replace('_',' ')}</td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>
                        <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                          style={{ padding: '0.3rem 0.5rem', borderRadius: 6, border: '1.5px solid var(--border)', fontSize: '0.82rem', cursor: 'pointer' }}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_FR[s]}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '0.7rem 0.8rem', color: 'var(--gray)' }}>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>
                        <Link to={`/mes-commandes/${o._id}`} className="btn btn-outline btn-sm"><FiEye size={13} /></Link>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray)' }}>Aucune commande</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}