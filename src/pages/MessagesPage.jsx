import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiArrowLeft, FiSend } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function MessagesPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [contacts, setContacts] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [thread, setThread] = useState([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)
  const pollRef = useRef(null)

  const loadContacts = async () => {
    try {
      const { data } = await api.get('/messages/contacts')
      setContacts(data)
      if (!activeId && data[0]?._id) setActiveId(data[0]._id)
    } catch {
      toast.error('Impossible de charger les contacts')
    }
  }

  const loadThread = async (userId) => {
    if (!userId) return
    try {
      const { data } = await api.get(`/messages/thread/${userId}`)
      setThread(data)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch {
      toast.error('Impossible de charger la conversation')
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    const to = searchParams.get('to')
    if (to) setActiveId(to)
  }, [searchParams])

  useEffect(() => {
    if (activeId) loadThread(activeId)
    if (pollRef.current) clearInterval(pollRef.current)
    if (activeId) {
      pollRef.current = setInterval(() => loadThread(activeId), 5000)
    }
    return () => clearInterval(pollRef.current)
  }, [activeId])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeId) return
    try {
      const { data } = await api.post('/messages', { to: activeId, content: text.trim() })
      setThread(t => [...t, data])
      setText('')
      loadContacts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    }
  }

  if (!user) return null

  const active = contacts.find(c => c._id === activeId) || (activeId ? { _id: activeId, name: 'Conversation' } : null)

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 960 }}>
        <Link to="/" className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
          <FiArrowLeft /> Accueil
        </Link>
        <h1 className="section-title">Messages</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1rem', minHeight: 420, alignItems: 'stretch' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {contacts.length === 0 && <p style={{ padding: '1rem', color: 'var(--gray)', fontSize: '0.88rem' }}>Aucune conversation.</p>}
            {contacts.map(c => (
              <button
                key={c._id}
                type="button"
                onClick={() => setActiveId(c._id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  background: activeId === c._id ? 'var(--primary-light)' : '#fff',
                  cursor: 'pointer',
                  fontWeight: activeId === c._id ? 700 : 500,
                }}
              >
                {c.name}
                {(c.unread || 0) > 0 && (
                  <span style={{ marginLeft: 6, background: 'var(--primary)', color: '#fff', borderRadius: 99, padding: '0 6px', fontSize: '0.72rem' }}>{c.unread}</span>
                )}
              </button>
            ))}
          </div>
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            {active && (
              <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 800 }}>
                {active.name}
              </div>
            )}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 360 }}>
              {thread.map(m => {
                const mine = String(m.sender?._id || m.sender) === String(user._id)
                return (
                  <div
                    key={m._id}
                    style={{
                      alignSelf: mine ? 'flex-end' : 'flex-start',
                      maxWidth: '78%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 12,
                      background: mine ? 'var(--primary)' : 'var(--gray-light)',
                      color: mine ? '#fff' : 'inherit',
                      fontSize: '0.9rem',
                    }}
                  >
                    {m.content}
                    <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: 4 }}>
                      {new Date(m.createdAt).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <input
                className="form-control"
                placeholder="Votre message…"
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={!activeId}
              />
              <button type="submit" className="btn btn-primary" disabled={!activeId || !text.trim()}><FiSend /></button>
            </form>
          </div>
        </div>
        <p style={{ color: 'var(--gray)', fontSize: '0.82rem', marginTop: '1rem' }}>
          Depuis un profil ouvrier, utilisez « Écrire » pour ouvrir la conversation avec cet artisan.
        </p>
      </div>
    </div>
  )
}
