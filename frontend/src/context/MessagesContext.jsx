import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const MOCK_CONVERSATIONS = [
  {
    id: 101,
    isGroup: false,
    user: { id: 2, name: 'Maria Silva', status: 'online', lastSeen: Date.now() - 60000 },
    participants: [{ id: 2, username: 'maria.silva' }],
    messages: [
      { id: 1, from: 2, fromName: 'Maria Silva', text: 'Oi! Tens os apontamentos de Matemática Discreta?', created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, from: 1, fromName: 'Tu', text: 'Sim, posso partilhar sim!', created_at: new Date(Date.now() - 3300000).toISOString() },
    ],
    lastMessage: 'Tens os apontamentos de Matemática Discreta?',
    time: '10:42',
    unread: 2,
  },
  {
    id: 102,
    isGroup: false,
    user: { id: 3, name: 'João Paulo', status: 'online', lastSeen: Date.now() - 180000 },
    participants: [{ id: 3, username: 'joao.paulo' }],
    messages: [
      { id: 3, from: 3, fromName: 'João Paulo', text: 'Vamos fazer o trabalho em grupo?', created_at: new Date(Date.now() - 5400000).toISOString() },
    ],
    lastMessage: 'Vamos fazer o trabalho em grupo?',
    time: '09:18',
    unread: 0,
  },
  {
    id: 103,
    isGroup: false,
    user: { id: 4, name: 'Ana Clara', status: 'online', lastSeen: Date.now() - 300000 },
    participants: [{ id: 4, username: 'ana.clara' }],
    messages: [
      { id: 5, from: 4, fromName: 'Ana Clara', text: 'Obrigada! 😊', created_at: new Date(Date.now() - 86400000).toISOString() },
    ],
    lastMessage: 'Obrigada! 😊',
    time: 'Ontem',
    unread: 3,
  },
  {
    id: 104,
    isGroup: false,
    user: { id: 5, name: 'Carlos Manuel', status: 'offline', lastSeen: Date.now() - 7200000 },
    participants: [{ id: 5, username: 'carlos.manuel' }],
    messages: [
      { id: 7, from: 5, fromName: 'Carlos Manuel', text: 'Encontro às 14h na biblioteca? Precisamos alinhar.', created_at: new Date(Date.now() - 86400000 * 1.5).toISOString() },
    ],
    lastMessage: 'Encontro às 14h na biblioteca? Precisamos alinhar.',
    time: 'Ontem',
    unread: 0,
  },
  {
    id: 105,
    isGroup: true,
    name: 'Grupo de Projeto Final',
    members: 6,
    participants: [
      { id: 2, username: 'maria.silva' },
      { id: 3, username: 'joao.paulo' },
      { id: 5, username: 'carlos.manuel' },
    ],
    messages: [
      { id: 9, from: 3, fromName: 'João', text: 'Vamos começar a trabalhar na apresentação?', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
    lastMessage: 'João: Vamos começar a trabalhar na apresentação?',
    time: '2 dias',
    unread: 4,
  },
  {
    id: 106,
    isGroup: false,
    user: { id: 6, name: 'Helena Jossias', status: 'offline', lastSeen: Date.now() - 86400000 * 2 },
    participants: [{ id: 6, username: 'helena.jossias' }],
    messages: [
      { id: 11, from: 6, fromName: 'Helena Jossias', text: 'Vou enviar os exercícios que o professor passou.', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    ],
    lastMessage: 'Vou enviar os exercícios que o professor passou.',
    time: '3 dias',
    unread: 0,
  },
  {
    id: 107,
    isGroup: true,
    name: 'Avisos Acadlink',
    members: 120,
    isChannel: true,
    participants: [],
    messages: [
      { id: 13, from: 'bot', fromName: 'AcadLink', text: 'Lembrete: Workshop de IA amanhã às 09:00 no Anfiteatro 1.', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    ],
    lastMessage: 'Lembrete: Workshop de IA amanhã às 09:00 no Anfiteatro 1.',
    time: '4 dias',
    unread: 0,
  },
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
