import axios from 'axios'
import { installMockInterceptor } from './mockInterceptor.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

if (import.meta.env.VITE_MOCK_MODE === 'true') {
  installMockInterceptor(api)
}

// JWT Interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh Token Interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        )
        
        localStorage.setItem('access_token', data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        const path = window.location.pathname
        const isAuthPage = ['/login', '/register', '/welcome', '/reset-password', '/'].includes(path)
        if (!isAuthPage) {
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
