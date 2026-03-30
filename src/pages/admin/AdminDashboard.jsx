import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiUsers, FiShoppingBag, FiTrendingUp, FiTool } from 'react-icons/fi'
import api from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/stats')
      .then(r => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Utilisateurs', value: stats.users, icon: FiUsers, color: '#3B82F6', to: null },
    { label: 'Produits', value: stats.products, icon: FiPackage, color: '#10B981', to: '/admin/produits' },
    { label: 'Ouvriers', value: stats.workers, icon: FiTool, color: '#8B5CF6', to: '/admin/ouvriers' },
    { label: 'Commandes', value: stats.orders, icon: FiShoppingBag, color: '#F59E0B', to: '/admin/commandes' },
    { label: 'En attente', value: stats.pendingOrders, icon: FiShoppingBag, color: '#EF4444', to: '/admin/commandes' },
    { label: 'CA (hors annulées)', value: `${(stats.revenue || 0).toLocaleString('fr-FR')} FCFA`, icon: FiTrendingUp, color: 'var(--primary)', to: '/admin/commandes' },
  ] : []

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Tableau de bord</h1>

        {loading ? <div className="spinner" /> : !stats ? (
          <p style={{ color: 'var(--gray)' }}>Impossible de charger les statistiques.</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {cards.map(c => {
                const Inner = (
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                      <c.icon size={22} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--gray)', margin: 0 }}>{c.label}</p>
                      <p style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>{c.value}</p>
                    </div>
                  </div>
                )
                return c.to ? <Link key={c.label} to={c.to} style={{ color: 'inherit' }}>{Inner}</Link> : <div key={c.label}>{Inner}</div>
              })}
            </div>

            <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Commandes récentes</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--gray-light)' }}>
                    {['Client', 'Total', 'Statut', 'Date'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentOrders || []).map(o => (
                    <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.65rem 1rem' }}>{o.user?.name || '—'}</td>
                      <td style={{ padding: '0.65rem 1rem', fontWeight: 700 }}>{o.total?.toLocaleString('fr-FR')} FCFA</td>
                      <td style={{ padding: '0.65rem 1rem' }}><span className="badge badge-primary">{o.status}</span></td>
                      <td style={{ padding: '0.65rem 1rem', color: 'var(--gray)' }}>
                        {new Date(o.createdAt).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                <p style={{ padding: '1.5rem', color: 'var(--gray)', margin: 0 }}>Aucune commande.</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to="/admin/produits" className="btn btn-primary">Gérer les produits</Link>
              <Link to="/admin/commandes" className="btn btn-outline">Gérer les commandes</Link>
              <Link to="/admin/ouvriers" className="btn btn-outline">Gérer les ouvriers</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
