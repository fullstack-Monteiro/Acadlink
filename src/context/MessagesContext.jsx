import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const MOCK_CONVERSATIONS = [
  {
    id: 101,
    isGroup: false,
    user: { id: 2, name: 'Beatriz', status: 'online', lastSeen: Date.now() - 120000 },
    participants: [{ id: 2, username: 'beatriz' }],
    messages: [
      { id: 1, from: 2, fromName: 'Beatriz', text: 'Oi! Como anda o seu projeto?', created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, from: 'bot', fromName: 'AcadLink Bot', text: 'Estou a preparar as tuas tarefas.', created_at: new Date(Date.now() - 1800000).toISOString() }
    ],
    lastMessage: 'Estou a preparar as tuas tarefas.',
    unread: 1
  },
  {
    id: 102,
    isGroup: true,
    name: 'Equipe AcadLink',
    members: 5,
    participants: [
      { id: 2, username: 'beatriz' },
      { id: 3, username: 'carlos' },
      { id: 'bot', username: 'acadlink_bot' }
    ],
    messages: [
      { id: 3, from: 3, fromName: 'Carlos', text: 'Lembrete: reunião às 15h.', created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 4, from: 'bot', fromName: 'AcadLink Bot', text: 'Convite enviado para todos.', created_at: new Date(Date.now() - 3600000).toISOString() }
    ],
    lastMessage: 'Convite enviado para todos.',
    unread: 0
  }
]

const MessagesContext = createContext(null)

export function MessagesProvider({ children }) {
  const { user, authLoading, isTestMode } = useAuth()
  const [conversations, setConversations] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ws, setWs] = useState(null)

  // Carregar conversas
  const loadConversations = async () => {
    setLoading(true)
    try {
      // Em modo teste, usar dados mock
      if (isTestMode) {
        console.log('[MESSAGES] Test mode: using mock data')
        setConversations(MOCK_CONVERSATIONS)
        setIsReady(true)
        return
      }

      const { data } = await api.get('/messages/')
      setConversations(data)
      setIsReady(true)
      setError(null)
    } catch (err) {
      console.log('[MESSAGES] Error loading conversations:', err.message)
      setError('Falha ao carregar conversas')
      setIsReady(true)
    } finally {
      setLoading(false)
    }
  }

  // Carregar conversas apenas após autenticação
  useEffect(() => {
    console.log('[MESSAGES] useEffect: authLoading=', authLoading, 'user=', user?.email, 'testMode=', isTestMode)
    if (!authLoading && user) {
      loadConversations()
    }
  }, [authLoading, user, isTestMode])

  // Conectar WebSocket
  useEffect(() => {
    if (authLoading || !user) return

    // ✅ MODO DESENVOLVIMENTO: WebSocket desativado
    console.log('[MESSAGES] WebSocket desativado em modo desenvolvimento')
    return
  }, [])

  // Enviar mensagem
  const sendMessage = async (conversationId, senderId, senderName, content, replyTo = null) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de envio de mensagem
      console.log('[MESSAGES] Mensagem mockada para conversa:', conversationId, content)
      const newMessage = {
        id: Date.now(),
        conversation_id: conversationId,
        from: senderId,
        fromName: senderName,
        text: content,
        replyTo: replyTo,
        created_at: new Date().toISOString()
      }
      
      // Atualizar conversa localmente
      setConversations(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...(c.messages || []), newMessage], lastMessage: newMessage.text }
          : c
      ))
      
      return newMessage
    } catch (err) {
      throw err
    }
  }

  // Marcar como lido
  const markRead = async (conversationId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação
      console.log('[MESSAGES] Marcar como lido mockado para conversa:', conversationId)
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, unread: 0 } : c
      ))
    } catch (err) {
      console.error('[MESSAGES] Error marking as read:', err)
    }
  }

  // Deletar mensagem
  const deleteMessage = async (conversationId, messageId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação
      console.log('[MESSAGES] Deletar mensagem mockado - conversa:', conversationId, 'mensagem:', messageId)
      setConversations(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: c.messages.filter(m => m.id !== messageId) }
          : c
      ))
    } catch (err) {
      throw err
    }
  }

  // Obter ou criar conversa
  const getOrCreateConversation = async (otherUserIdOrProfile) => {
    try {
      const otherUserId = typeof otherUserIdOrProfile === 'object'
        ? otherUserIdOrProfile?.id
        : otherUserIdOrProfile

      if (!otherUserId) {
        console.warn('[MESSAGES] getOrCreateConversation recebeu id inválido:', otherUserIdOrProfile)
        return null
      }

      // ✅ MODO DESENVOLVIMENTO: Simulação
      console.log('[MESSAGES] getOrCreateConversation mockado para user:', otherUserId)

      // Procura conversa existente entre participantes ou usuário direto
      let conv = conversations.find(c =>
        !c.isGroup && (
          c.participants?.some(p => p.id === otherUserId) ||
          c.user?.id === otherUserId
        )
      )

      if (!conv) {
        const newConv = {
          id: Date.now(),
          isGroup: false,
          user: { id: otherUserId, name: 'Usuário ' + otherUserId, status: 'offline', lastSeen: Date.now() - 1800000 },
          participants: [{ id: otherUserId, username: 'usuario_' + otherUserId }],
          messages: [],
          unread: 0,
          lastMessage: ''
        }
        setConversations(prev => [newConv, ...prev])
        return newConv.id
      }

      return conv.id
    } catch (err) {
      throw err
    }
  }

  const addBotReply = (conversationId, reaction) => {
    setConversations(prev => prev.map(c =>
      c.id === conversationId
        ? {
          ...c,
          messages: [
            ...(c.messages || []),
            {
              id: Date.now(),
              from: 'bot',
              fromName: 'AcadLink Bot',
              text: reaction,
              created_at: new Date().toISOString()
            }
          ]
        }
        : c
    ))
  }

  return (
    <MessagesContext.Provider value={{
      convs: conversations,
      conversations,
      isReady,
      error,
      loading,
      loadConversations,
      sendMessage,
      markRead,
      deleteMessage,
      getOrCreateConversation,
      addBotReply
    }}>
      {children}
    </MessagesContext.Provider>
  )
}

export const useMessages = () => useContext(MessagesContext)
