import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const NotificationsContext = createContext(null)

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'like',    user: { id: 2, name: 'Samuel Nhantumbo' }, text: 'reagiu ao teu post com 🔥', time: '2min',  read: false, is_read: false, pending: false },
  { id: 2, type: 'connect', user: { id: 3, name: 'Fatima Cossa' },   text: 'quer conectar-se contigo',       time: '15min', read: false, is_read: false, pending: true  },
  { id: 3, type: 'comment', user: { id: 5, name: 'Beatrice Mondlane' },text: 'comentou no teu post: "Muito útil, obrigada!"', time: '1h', read: false, is_read: false, pending: false },
  { id: 4, type: 'like',    user: { id: 7, name: 'Lúcia Tembe' },    text: 'reagiu ao teu post com 👏',          time: '2h',  read: true,  is_read: true,  pending: false },
  { id: 5, type: 'connect', user: { id: 4, name: 'João Sitoe' },     text: 'quer conectar-se contigo',       time: '3h',  read: true,  is_read: true,  pending: true  },
  { id: 6, type: 'opp',     user: null, text: 'Nova bolsa disponível: Google STEM Africa', time: '5h', read: true, is_read: true, pending: false },
  { id: 7, type: 'comment', user: { id: 10, name: 'Mário Cuna' },    text: 'comentou no teu post: "Vou candidatar-me!"', time: '1d', read: true, is_read: true, pending: false },
]

export function NotificationsProvider({ children }) {
  const { user, authLoading, isTestMode } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [ws, setWs] = useState(null)

  // Carregar notificações
  const loadNotifications = async () => {
    setLoading(true)
    try {
      // Em modo teste, usar dados mock
      if (isTestMode) {
        console.log('[NOTIFICATIONS] Test mode: using mock data')
        setNotifications(MOCK_NOTIFICATIONS)
        setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.is_read).length)
        setError(null)
      } else {
        const { data } = await api.get('/notifications/')
        setNotifications(data)
        
        // Contar não lidas
        const unread = data.filter(n => !n.is_read && !n.read).length
        setUnreadCount(unread)
        
        setError(null)
      }
    } catch (err) {
      console.log('[NOTIFICATIONS] Error loading notifications:', err.message)
      setError('Falha ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }

  // Carregar notificações apenas após autenticação
  useEffect(() => {
    if (!authLoading && user) {
      loadNotifications()
      setIsReady(true)
    }
  }, [authLoading, user, isTestMode])

  // Conectar WebSocket para notificações em tempo real
  useEffect(() => {
    if (authLoading || !user) return

    // ✅ MODO DESENVOLVIMENTO: WebSocket desativado
    console.log('[NOTIFICATIONS] WebSocket desativado em modo desenvolvimento')
    setIsReady(true)
    return
  }, [])

  // Marcar como lida
  const markAsRead = async (notificationId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação
      console.log('[NOTIFICATIONS] Marcar como lida mockado:', notificationId)
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, read: true, is_read: true } : n
      ))
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('[NOTIFICATIONS] Error marking notification as read:', err)
    }
  }

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação
      console.log('[NOTIFICATIONS] Marcar todas como lidas mockado')
      setNotifications(prev => prev.map(n => ({ ...n, read: true, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('[NOTIFICATIONS] Error marking all as read:', err)
    }
  }

  // Deletar notificação
  const deleteNotification = async (notificationId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação
      console.log('[NOTIFICATIONS] Deletar notificação mockado:', notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      // Atualizar contagem se era não lida
      const notification = notifications.find(n => n.id === notificationId)
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('[NOTIFICATIONS] Error deleting notification:', err)
    }
  }

  // Limpar todas as notificações
  const clearAll = async () => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação
      console.log('[NOTIFICATIONS] Limpar todas as notificações mockado')
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      console.error('[NOTIFICATIONS] Error clearing notifications:', err)
    }
  }

  const decrement = () => {
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <NotificationsContext.Provider value={{
      notifications, unreadCount, loading, error,
      loadNotifications, markAsRead, markAllAsRead,
      deleteNotification, clearAll, decrement
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
