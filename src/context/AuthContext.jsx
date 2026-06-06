import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isTestMode, setIsTestMode] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Verificar se há token ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      const testMode = localStorage.getItem('test_mode')
      
      if (testMode === 'true') {
        setIsTestMode(true)
        const testUser = localStorage.getItem('test_user')
        if (testUser) {
          setUser(JSON.parse(testUser))
        }
        setAuthLoading(false)
        return
      }
      
      if (token) {
        try {
          const { data } = await api.get('/users/me/')
          setUser(data)
        } catch (err) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
      setAuthLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      // Modo de teste: aceita qualquer email e senha
      const emailHash = email.split('@')[0].charCodeAt(0) + email.length
      const testUser = {
        id: emailHash,
        username: email.split('@')[0],
        email: email,
        first_name: email.split('@')[0],
        last_name: 'Teste',
        name: email.split('@')[0],
        university: 'Universidade de Teste',
        course: 'Curso de Teste',
        year: 1,
        bio: 'Utilizador em modo de teste',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        is_verified: true,
        created_at: new Date().toISOString()
      }
      
      localStorage.setItem('access_token', 'test_token_' + Date.now())
      localStorage.setItem('test_mode', 'true')
      localStorage.setItem('test_user', JSON.stringify(testUser))
      setUser(testUser)
      setIsTestMode(true)
      return true
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Email ou senha incorretos'
      setError(errorMsg)
      throw errorMsg
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsTestMode(false)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('test_mode')
    localStorage.removeItem('test_user')
  }

  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/users/register/', formData)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      
      const userResponse = await api.get('/users/me/')
      setUser(userResponse.data)
      return true
    } catch (err) {
      const errorMsg = err.response?.data?.email?.[0] || 
                       err.response?.data?.detail || 
                       err.response?.data?.password?.[0] ||
                       'Erro ao registrar'
      setError(errorMsg)
      throw err.response?.data
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
      user, login, logout, register, updateUser, loading, error, authLoading,
      forgotPassword, resetPassword,
      connections, loadConnections, loadingConnections, sendConnectionRequest,
      portfolio, loadPortfolio, loadingPortfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
      toggleConnect, isConnected,
      isTestMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
