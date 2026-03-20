import { createContext, useContext, useState } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('samaUser') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setUser(data)
      localStorage.setItem('samaUser', JSON.stringify(data))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Erreur de connexion' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', userData)
      setUser(data)
      localStorage.setItem('samaUser', JSON.stringify(data))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Erreur d'inscription" }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('samaUser')
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('samaUser', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)