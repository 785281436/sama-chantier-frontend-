/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiMapPin, FiStar, FiCheckCircle } from 'react-icons/fi'
import api from '../utils/api'

const SPECIALTIES = [
  { value: 'macon',       label: 'Maçon' },
  { value: 'carreleur',   label: 'Carreleur' },
  { value: 'plombier',    label: 'Plombier' },
  { value: 'electricien', label: 'Électricien' },
  { value: 'peintre',     label: 'Peintre' },
  { value: 'menuisier',   label: 'Menuisier' },
  { value: 'soudeur',     label: 'Soudeur' },
  { value: 'autre',       label: 'Autre' },
]

const CITIES = ['Dakar','Thiès','Saint-Louis','Ziguinchor','Kaolack','Mbour']

export default function WorkersPage() {
  const [workers, setWorkers]   = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [keyword, setKeyword]   = useState('')
  const [filters, setFilters]   = useState({
    specialty: '', city: '', available: ''
  })
  const searchDebounce = useRef(null)

  const load = async (f, kw = '') => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (f.specialty)  q.set('specialty', f.specialty)
      if (f.city)       q.set('city', f.city)
      if (f.available)  q.set('available', f.available)
      if (kw)           q.set('keyword', kw)
      q.set('limit', 50)
      const { data } = await api.get(`/workers?${q}`)
      setWorkers(data.workers || [])
      setTotal(data.total || 0)
    // eslint-disable-next-line no-empty
    } catch (_) {}
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load(filters) }, [])

  const apply = (overrides = {}) => {
    const f = { ...filters, ...overrides }
    setFilters(f)
    load(f, keyword)
  }

  const reset = () => {
    setFilters({ specialty: '', city: '', available: '' })
    setKeyword('')
    load({ specialty: '', city: '', available: '' }, '')
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title">Ouvriers qualifiés</h1>
        <p className="section-subtitle">
          {total} artisan{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}
        </p>

        {/* Recherche par nom */}
        <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
          <FiSearch style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Rechercher par nom…"
            value={keyword}
            onChange={e => {
              const v = e.target.value
              setKeyword(v)
              clearTimeout(searchDebounce.current)
              searchDebounce.current = setTimeout(() => load(filters, v), 350)
            }}
          />
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>

          {/* Spécialités */}
          <select className="form-control" style={{ maxWidth: 180 }}
            value={filters.specialty}
            onChange={e => apply({ specialty: e.target.value })}>
            <option value="">Toutes spécialités</option>
            {SPECIALTIES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Villes */}
          <select className="form-control" style={{ maxWidth: 150 }}
            value={filters.city}
            onChange={e => apply({ city: e.target.value })}>
            <option value="">Toutes villes</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Disponibilité */}
          <select className="form-control" style={{ maxWidth: 160 }}
            value={filters.available}
            onChange={e => apply({ available: e.target.value })}>
            <option value="">Disponibilité</option>
            <option value="true">Disponible</option>
            <option value="false">Indisponible</option>
          </select>

          <button className="btn btn-outline btn-sm" onClick={reset}>
            Réinitialiser
          </button>
        </div>

        {/* Pills spécialités */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`cat-pill ${!filters.specialty ? 'active' : ''}`}
            onClick={() => apply({ specialty: '' })}>
            Tous
          </button>
          {SPECIALTIES.map(s => (
            <button
              key={s.value}
              className={`cat-pill ${filters.specialty === s.value ? 'active' : ''}`}
              onClick={() => apply({ specialty: s.value })}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Liste ouvriers */}
        {loading ? <div className="spinner" /> : workers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
            <p>Aucun ouvrier trouvé.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={reset}>
              Voir tous les ouvriers
            </button>
          </div>
        ) : (
          <div className="grid-4">
            {workers.map(w => {
              const u = w.user || {}
              return (
                <Link key={w._id} to={`/ouvriers/${w._id}`} className="card"
                  style={{ padding: '1.2rem', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {u.name}
                        {w.isVerified && <FiCheckCircle size={13} color="#3B82F6" />}
                      </p>
                      <span className="badge badge-primary">
                        {SPECIALTIES.find(s => s.value === w.specialty)?.label || w.specialty}
                      </span>
                    </div>
                  </div>

                  {/* Infos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--gray)', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FiMapPin size={13} />{w.city}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FiStar size={13} fill="#FBBF24" color="#FBBF24" />
                      {w.ratings?.toFixed(1) || '0.0'} ({w.numReviews} avis)
                    </span>
                    <span>{w.experience} ans d'expérience</span>
                    {w.dailyRate && (
                      <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.95rem' }}>
                        {w.dailyRate.toLocaleString('fr-FR')} FCFA/jour
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span className={`badge ${w.availability ? 'badge-success' : 'badge-error'}`}>
                      {w.availability ? '✅ Disponible' : '❌ Indisponible'}
                    </span>
                    <span className="btn btn-outline btn-sm">Voir profil</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}