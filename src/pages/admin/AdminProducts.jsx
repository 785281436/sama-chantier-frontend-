/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../utils/api'

const CATEGORIES = ['carreaux','ciment','peinture','fer','bois','plomberie','electricite','outillage','autre']
const EMPTY = { name: '', description: '', price: '', stock: '', unit: 'pièce', category: 'carreaux', brand: '', featured: false, images: [] }
export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
const [imageFile, setImageFile]     = useState(null)
const [imagePreview, setImagePreview] = useState('')
const [uploading, setUploading]     = useState(false)

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }
}

const uploadImage = async () => {
  if (!imageFile) return null
  setUploading(true)
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data.url
  } catch (err) {
    toast.error("Erreur upload image")
    return null
  } finally {
    setUploading(false)
  }
}
  const load = async () => {
    try {
      const { data } = await api.get('/products?limit=50')
      setProducts(data.products || [])
    // eslint-disable-next-line no-empty
    } catch (_) {}
    setLoading(false)
  }

   
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  
    const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    let imageUrl = form.images?.[0] || ''
    
    if (imageFile) {
      const uploaded = await uploadImage()
      if (uploaded) imageUrl = uploaded
    }

    const productData = { ...form, images: imageUrl ? [imageUrl] : [] }

    if (editing) {
      await api.put(`/products/${editing}`, productData)
      toast.success('Produit modifié !')
    } else {
      await api.post('/products', productData)
      toast.success('Produit créé !')
    }
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY)
    setImageFile(null)
    setImagePreview('')
    load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Erreur')
  }
}

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      unit: p.unit,
      category: p.category,
      brand: p.brand || '',
      featured: p.featured,
      images: p.images || []
    })
    setEditing(p._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Produit supprimé')
      load()
    } catch (_) {
      toast.error('Erreur')
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <Link to="/admin" className="btn btn-outline btn-sm" style={{ marginBottom: '0.5rem' }}>
              <FiArrowLeft /> Dashboard
            </Link>
            <h1 className="section-title">Gestion des produits</h1>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY) }}>
            <FiPlus /> Nouveau produit
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1.2rem' }}>
              {editing ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Nom *</label>
                  <input className="form-control" value={form.name} onChange={set('name')} required />
                </div>
                <div className="form-group">
                  <label>Catégorie *</label>
                  <select className="form-control" value={form.category} onChange={set('category')}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Prix (FCFA) *</label>
                  <input className="form-control" type="number" value={form.price} onChange={set('price')} required />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input className="form-control" type="number" value={form.stock} onChange={set('stock')} required />
                </div>
                <div className="form-group">
                  <label>Unité</label>
                  <input className="form-control" value={form.unit} onChange={set('unit')} placeholder="pièce, sac, m²..." />
                </div>
                <div className="form-group">
                  <label>Marque</label>
                  <input className="form-control" value={form.brand} onChange={set('brand')} />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={set('description')} required />
              </div>
              <div className="form-group">
  <label>Description *</label>
  <textarea className="form-control" rows={3} value={form.description} onChange={set('description')} required />
</div>

{/* ← Ajoute ici */}
<div className="form-group">
  <label>Image du produit</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="form-control"
  />
  {imagePreview && (
    <img
      src={imagePreview}
      alt="Preview"
      style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginTop: '0.8rem' }}
    />
  )}
  {!imagePreview && form.images?.[0] && (
    <img
      src={form.images[0]}
      alt="Image actuelle"
      style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginTop: '0.8rem' }}
    />
  )}
</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  Mettre en vedette sur la page d'accueil ⭐
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" type="submit">
                  {editing ? 'Modifier' : 'Créer'}
                </button>
                <button className="btn btn-outline" type="button"
                  onClick={() => { setShowForm(false); setEditing(null) }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="spinner" /> : (
          <div className="card" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--gray)', marginBottom: '1rem', fontSize: '0.88rem' }}>
              {products.length} produit(s)
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Nom','Catégorie','Prix','Stock','Vedette','Actions'].map(h => (
                      <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: 'var(--gray)', fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.7rem 0.8rem', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>
                        <span className="badge badge-primary">{p.category}</span>
                      </td>
                      <td style={{ padding: '0.7rem 0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {p.price?.toLocaleString('fr-FR')} F
                      </td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>
                        <span style={{ color: p.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>{p.featured ? '⭐' : '—'}</td>
                      <td style={{ padding: '0.7rem 0.8rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>
                            <FiEdit size={13} />
                          </button>
                          <button className="btn btn-sm"
                            style={{ background: 'var(--error)', color: '#fff' }}
                            onClick={() => handleDelete(p._id)}>
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray)' }}>
                        Aucun produit — cliquez sur "Nouveau produit" pour commencer
                      </td>
                    </tr>
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