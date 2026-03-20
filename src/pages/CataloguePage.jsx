/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import api from '../utils/api'
import './CataloguePage.css'

const CATEGORIES = ['carreaux','ciment','peinture','fer','bois','plomberie','electricite','outillage','autre']

export default function CataloguePage() {
  const [params] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal]       = useState(0)
  const [pages, setPages]       = useState(1)
  const [loading, setLoading]   = useState(true)
  const [filters, setFilters]   = useState({
    keyword:  params.get('keyword')  || '',
    category: params.get('category') || '',
    minPrice: '', maxPrice: '', page: 1,
  })

  const load = async (f) => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (f.keyword)  q.set('keyword', f.keyword)
      if (f.category) q.set('category', f.category)
      if (f.minPrice) q.set('minPrice', f.minPrice)
      if (f.maxPrice) q.set('maxPrice', f.maxPrice)
      q.set('page', f.page)
      q.set('limit', 12)
      const { data } = await api.get(`/products?${q}`)
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    // eslint-disable-next-line no-empty
    } catch (_) {}
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load(filters) }, [])

  const apply = (overrides = {}) => {
    const f = { ...filters, ...overrides, page: 1 }
    setFilters(f)
    load(f)
  }

  const reset = () => {
    const f = { keyword: '', category: '', minPrice: '', maxPrice: '', page: 1 }
    setFilters(f)
    load(f)
  }

  return (
    <div className="catalogue page-wrapper">
      <div className="container">
        <div className="catalogue__head">
          <div>
            <h1 className="section-title">Catalogue</h1>
            <p className="section-subtitle">{total} produit{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Recherche */}
        <div className="catalogue__search">
          <FiSearch className="catalogue__search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit…"
            value={filters.keyword}
            onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && apply()}
          />
          {filters.keyword && (
            <button onClick={() => apply({ keyword: '' })}><FiX /></button>
          )}
        </div>

        {/* Catégories */}
        <div className="catalogue__cats">
          <button className={`cat-pill ${!filters.category ? 'active' : ''}`} onClick={() => apply({ category: '' })}>Tous</button>
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-pill ${filters.category === c ? 'active' : ''}`} onClick={() => apply({ category: c })}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Filtres prix */}
        <div className="catalogue__price-row">
          <input type="number" placeholder="Prix min" value={filters.minPrice} className="form-control"
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} style={{ maxWidth: 140 }} />
          <span>—</span>
          <input type="number" placeholder="Prix max" value={filters.maxPrice} className="form-control"
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} style={{ maxWidth: 140 }} />
          <button className="btn btn-primary btn-sm" onClick={() => apply()}>Filtrer</button>
          <button className="btn btn-outline btn-sm" onClick={reset}>Réinitialiser</button>
        </div>

        {/* Produits */}
        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <div className="catalogue__empty">
            <span>😔</span>
            <p>Aucun produit trouvé.</p>
            <button className="btn btn-primary" onClick={reset}>Tout afficher</button>
          </div>
        ) : (
          <div className="grid-4">
            {products.map(p => (
              <Link key={p._id} to={`/produits/${p._id}`} className="card" style={{ color: 'inherit' }}>
                <img src={p.images?.[0] || 'https://placehold.co/300x200?text=Produit'} alt={p.name}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <span className="badge badge-primary">{p.category}</span>
                  <p style={{ fontWeight: 700, margin: '0.5rem 0 0.3rem' }}>{p.name}</p>
                  <p style={{ color: 'var(--primary)', fontWeight: 800 }}>{p.price?.toLocaleString('fr-FR')} FCFA</p>
                  <p style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>Stock : {p.stock}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="catalogue__pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`}
                onClick={() => { const f = { ...filters, page: p }; setFilters(f); load(f) }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}