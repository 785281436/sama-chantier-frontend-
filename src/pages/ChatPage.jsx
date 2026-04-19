import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiSend, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../utils/api'
import './ChatPage.css'

export default function ChatPage() {
  const { userId } = useParams()
  const { user }   = useAuth()
  const { socket } = useSocket()
  const [messages, setMessages]   = useState([])
  const [content, setContent]     = useState('')
  const [loading, setLoading]     = useState(true)
  const [otherUser, setOtherUser] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/messages/${userId}`)
        setMessages(data)
        if (data.length > 0) {
          const other = data[0].sender._id === user._id ? data[0].receiver : data[0].sender
          setOtherUser(other)
        }
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [userId])

  useEffect(() => {
    if (!socket) return
    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message])
    })
    return () => socket.off('receiveMessage')
  }, [socket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    try {
      const { data } = await api.post('/messages', {
        receiverId: userId,
        content: content.trim()
      })
      setMessages(prev => [...prev, data])
      socket?.emit('sendMessage', { ...data, receiver: userId })
      setContent('')
    } catch (_) {}
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <Link to="/messages" className="chat-back">
          <FiArrowLeft size={20} />
        </Link>
        <div className="chat-header__avatar">
          {otherUser?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="chat-header__name">{otherUser?.name || 'Conversation'}</p>
          <p className="chat-header__status">En ligne</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? <div className="spinner" /> : messages.length === 0 ? (
          <div className="chat-empty">
            <p>Commencez la conversation ! 👋</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg._id}
              className={`chat-bubble ${msg.sender._id === user._id ? 'chat-bubble--mine' : 'chat-bubble--other'}`}>
              <p>{msg.content}</p>
              <span className="chat-bubble__time">
                {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Écrire un message…"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="form-control"
        />
        <button type="submit" className="btn btn-primary" disabled={!content.trim()}>
          <FiSend size={18} />
        </button>
      </form>
    </div>
  )
}