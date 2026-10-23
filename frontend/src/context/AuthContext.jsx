import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Verificar se há token ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setAuthLoading(false)
        return
      }
      try {
        const { data } = await api.get('/users/me/')
        setUser(data)
      } catch (err) {
        // Token expirado ou inválido
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUser(null)
      }
      setAuthLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios')
      }
      
      const { data } = await api.post('/users/login/', { email, password })
      
      // Guardar tokens JWT no localStorage
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      
      // Usar os dados do user já na resposta (evita segundo request)
      if (data.user) {
        setUser(data.user)
      } else {
        const userResponse = await api.get('/users/me/')
        setUser(userResponse.data)
      }
      
      return true
    } catch (err) {
      const d = err.response?.data
      const errorMsg = d?.detail ||
                       d?.non_field_errors?.[0] ||
                       d?.[0] ||
                       d?.email?.[0] ||
                       d?.password?.[0] ||
                       'Email ou senha incorretos'
      setError(errorMsg)
      throw errorMsg
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // Login com Google OAuth — chamado após o hook useGoogleLogin guardar os tokens
  const loginWithGoogle = async (googleData) => {
    try {
      // Tokens já foram guardados pelo useGoogleLogin
      // Buscar dados completos do utilizador
      const { data: userData } = await api.get('/users/me/')
      setUser(userData)
      return { user: userData, isNewUser: googleData?.created === true }
    } catch (err) {
      console.error('Error fetching user after Google login:', err)
      // Fallback: usar dados que o backend já devolveu
      if (googleData?.user) {
        setUser(googleData.user)
        return { user: googleData.user, isNewUser: googleData?.created === true }
      }
      throw err
    }
  }

  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/users/register/', formData)

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }

      if (data.user) {
        setUser(data.user)
      } else {
        const userResponse = await api.get('/users/me/')
        setUser(userResponse.data)
      }
      return true
    } catch (err) {
      const d = err.response?.data
      const errorMsg = d?.email?.[0] ||
                       d?.username?.[0] ||
                       d?.password?.[0] ||
                       d?.password_confirm?.[0] ||
                       d?.university_id?.[0] ||
                       d?.detail ||
                       d?.non_field_errors?.[0] ||
                       'Erro ao registrar'
      setError(errorMsg)
      throw errorMsg
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (data) => {
    try {
      const { data: updatedUser } = await api.put('/users/update_profile/', data)
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao atualizar perfil')
      throw err
    }
  }

  const forgotPassword = async (email) => {
    try {
      await api.post('/users/forgot_password/', { email })
      return true
    } catch (err) {
      throw err.response?.data?.detail || 'Erro ao enviar email'
    }
  }

  const resetPassword = async (email, token, newPassword) => {
    try {
      await api.post('/users/reset_password/', { 
        email, 
        token, 
        new_password: newPassword 
      })
      return true
    } catch (err) {
      throw err.response?.data?.detail || 'Erro ao resetar senha'
    }
  }

  // ── Conexões ──
  const [connections, setConnections] = useState([])
  const [loadingConnections, setLoadingConnections] = useState(false)

  const loadConnections = async () => {
    if (!user) return
    setLoadingConnections(true)
    try {
      const { data } = await api.get('/connections/')
      setConnections(data)
    } catch (err) {
      console.error('Error loading connections:', err)
    } finally {
      setLoadingConnections(false)
    }
  }

  const sendConnectionRequest = async (toUserId) => {
    try {
      const { data } = await api.post('/connections/send_request/', { to_user_id: toUserId })
      return data
    } catch (err) {
      throw err.response?.data?.detail || 'Erro ao enviar pedido'
    }
  }

  // ── Portfólio ──
  const [portfolio, setPortfolio] = useState([])
  const [loadingPortfolio, setLoadingPortfolio] = useState(false)

  const loadPortfolio = async () => {
    if (!user) return
    setLoadingPortfolio(true)
    try {
      const { data } = await api.get('/users/portfolio/')
      setPortfolio(data)
    } catch (err) {
      console.error('Error loading portfolio:', err)
    } finally {
      setLoadingPortfolio(false)
    }
  }

  const addPortfolioItem = async (item) => {
    try {
      const { data } = await api.post('/users/portfolio/', item)
      setPortfolio(p => [data, ...p])
      return data
    } catch (err) {
      throw err.response?.data
    }
  }

  const updatePortfolioItem = async (id, data) => {
    try {
      const { data: updated } = await api.put(`/users/portfolio/${id}/`, data)
      setPortfolio(p => p.map(i => i.id === id ? updated : i))
      return updated
    } catch (err) {
      throw err.response?.data
    }
  }

  const deletePortfolioItem = async (id) => {
    try {
      await api.delete(`/users/portfolio/${id}/`)
      setPortfolio(p => p.filter(i => i.id !== id))
    } catch (err) {
      throw err.response?.data
    }
  }

  const toggleConnect = async (userId) => {
    const isCurrentlyConnected = connections.some(c => 
      (c.from_user?.id === userId || c.to_user?.id === userId) && c.status === 'accepted'
    )
    
    if (isCurrentlyConnected) {
      // Remove connection
      try {
        const connection = connections.find(c => 
          (c.from_user?.id === userId || c.to_user?.id === userId) && c.status === 'accepted'
        )
        if (connection) {
          await api.delete(`/connections/${connection.id}/`)
          setConnections(prev => prev.filter(c => c.id !== connection.id))
        }
      } catch (err) {
        console.error('Error removing connection:', err)
      }
    } else {
      // Add connection
      try {
        await sendConnectionRequest(userId)
        await loadConnections()
      } catch (err) {
        console.error('Error adding connection:', err)
      }
    }
  }

  const isConnected = (userId) => {
    return connections.some(c => 
      (c.from_user?.id === userId || c.to_user?.id === userId) && c.status === 'accepted'
    )
  }

  return (
    <AuthContext.Provider value={{
      user, login, logout, register, updateUser, loginWithGoogle, loading, error, authLoading,
      forgotPassword, resetPassword,
      connections, loadConnections, loadingConnections, sendConnectionRequest,
      portfolio, loadPortfolio, loadingPortfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
      toggleConnect, isConnected,
      isTestMode: import.meta.env.VITE_MOCK_MODE === 'true',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
