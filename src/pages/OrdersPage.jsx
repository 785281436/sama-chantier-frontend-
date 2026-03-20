import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiEye } from 'react-icons/fi'
import api from '../utils/api'

const STATUS = {
  en_attente:   { label: 'En attente',   cls: 'badge-warning' },
  confirme:     { label: 'Confirmé',     cls: 'badge-primary' },
  en_livraison: { label: 'En livraison', cls: 'badge-primary' },
  livre:        { label: 'Livré',        cls: 'badge-success' },
  annule:       { label: 'Annulé',       cls: 'badge-error'   },
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/mine')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" style={{ marginTop: '4rem' }} />

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title">Mes commandes</h1>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>Aucune commande pour le moment.</p>
            <Link to="/catalogue" className="btn btn-primary">Commencer mes achats</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(o => {
              const s = STATUS[o.status] || { label: o.status, cls: 'badge-gray' }
              return (
                <div key={o._id} className="card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700 }}>Commande #{o._id.slice(-8).toUpperCase()}</p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                      {new Date(o.createdAt).toLocaleDateString('fr-FR')} · {o.items?.length} article{o.items?.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`badge ${s.cls}`}>{s.label}</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', minWidth: 120, textAlign: 'right' }}>
                    {o.total?.toLocaleString('fr-FR')} FCFA
                  </span>
                  <Link to={`/mes-commandes/${o._id}`} className="btn btn-outline btn-sm">
                    <FiEye /> Détails
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}