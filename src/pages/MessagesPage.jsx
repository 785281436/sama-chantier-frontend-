import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMessageCircle } from 'react-icons/fi'
import api from '../utils/api'
import './MessagesPage.css'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    api.get('/messages/conversations')
      .then(r => setConversations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 className="section-title">
          <FiMessageCircle /> Messages
        </h1>

        {loading ? <div className="spinner" /> : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <p>Aucune conversation pour le moment</p>
            <Link to="/ouvriers" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Trouver un ouvrier
            </Link>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map(conv => (
              <Link key={conv.id} to={`/messages/${conv.otherUser._id}`}
                className="conversation-item card">
                <div className="conversation-item__avatar">
                  {conv.otherUser.name?.[0]?.toUpperCase()}
                </div>
                <div className="conversation-item__info">
                  <p className="conversation-item__name">{conv.otherUser.name}</p>
                  <p className="conversation-item__last">
                    {conv.lastMessage.content.substring(0, 40)}...
                  </p>
                </div>
                {conv.unread > 0 && (
                  <span className="conversation-item__badge">{conv.unread}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}