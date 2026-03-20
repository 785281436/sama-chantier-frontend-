/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../utils/api'

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/workers?limit=50')
      .then(r => setWorkers(r.data.workers || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const verify = async (id) => {
    try {
      await api.put(`/workers/${id}/verify`)
      setWorkers(prev => prev.map(w => w._id === id ? { ...w, isVerified: true } : w))
      toast.success('Ouvrier vérifié !')
    } catch (_) { toast.error('Erreur') }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <Link to="/admin" className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
          <FiArrowLeft /> Dashboard
        </Link>
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Gestion des ouvriers</h1>

        {loading ? <div className="spinner" /> : (
          <div className="card" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--gray)', marginBottom: '1rem', fontSize: '0.88rem' }}>{workers.length} ouvrier(s)</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Nom','Spécialité','Ville','Tarif/jour','Note','Vérifié','Action'].map(h => (
                      <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: 'var(--gray)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.7rem 0.8rem', fontWeight: 700 }}>{w.user?.name || '—'}</td>
                      <td style={{ padding: '0.7rem 0.8rem' }}><span className="badge badge-primary">{w.specialty}</span></td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>{w.city}</td>
                      <td style={{ padding: '0.7rem 0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {w.dailyRate ? `${w.dailyRate.toLocaleString('fr-FR')} F` : '—'}
                      </td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>⭐ {w.ratings?.toFixed(1) || '0.0'}</td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>
                        {w.isVerified
                          ? <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><FiCheckCircle size={14} /> Vérifié</span>
                          : <span style={{ color: 'var(--warning)' }}>En attente</span>
                        }
                      </td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>
                        {!w.isVerified && (
                          <button className="btn btn-primary btn-sm" onClick={() => verify(w._id)}>
                            <FiCheckCircle size={13} /> Vérifier
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {workers.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray)' }}>Aucun ouvrier</td></tr>
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