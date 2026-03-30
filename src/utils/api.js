import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api'

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('samaUser') || 'null')
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  } catch {
    // ignore
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('samaUser')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api