import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const ReelsContext = createContext(null)

export const CATEGORIES = [
  { key: 'StudyTips', label: 'Dicas de Estudo', icon: '📚', color: '#3B82F6' },
  { key: 'ProjectShowcase', label: 'Projetos', icon: '🚀', color: '#8B5CF6' },
  { key: 'CampusLife', label: 'Vida no Campus', icon: '🎓', color: '#10B981' },
  { key: 'CareerAdvice', label: 'Carreira', icon: '💼', color: '#F59E0B' },
  { key: 'ResearchHighlights', label: 'Pesquisa', icon: '🔬', color: '#EF4444' },
  { key: 'SkillDemo', label: 'Habilidades', icon: '⚡', color: '#06B6D4' },
]

export function ReelsProvider({ children }) {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState([])

  const { user, authLoading, isTestMode } = useAuth()

  // Carregar categorias apenas após autenticação
  useEffect(() => {
    if (authLoading || !user) return

    // ✅ MODO DESENVOLVIMENTO: Usar categorias locais
    console.log('[REELS] Usando categorias locais em modo desenvolvimento')
    setCategories(CATEGORIES)
  }, [authLoading, user])

  // Carregar feed de reels
  const loadFeed = async (category = null, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      // ✅ MODO DESENVOLVIMENTO: Retornar feed mockado
      console.log('[REELS] Carregando feed mockado para categoria:', category, 'página:', page)
      const mockFeed = [
        {
          id: 1,
          author: { id: 2, username: 'usuario1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', name: 'Usuário 1' },
          description: 'Dica de estudo incrível!',
          category: 'StudyTips',
          videoUrl: '',
          thumbnail: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 15,
          comments_count: 3,
          shares_count: 2,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          author: { id: 3, username: 'usuario2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', name: 'Usuário 2' },
          description: 'Tour pelo campus.',
          category: 'CampusLife',
          videoUrl: '',
          thumbnail: 'https://images.pexels.com/photos/1181637/pexels-photo-1181637.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 8,
          comments_count: 1,
          shares_count: 0,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          author: { id: 4, username: 'usuario3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', name: 'Usuário 3' },
          description: 'Projeto final apresentado!',
          category: 'ProjectShowcase',
          videoUrl: '',
          thumbnail: 'https://images.pexels.com/photos/1181706/pexels-photo-1181706.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 22,
          comments_count: 5,
          shares_count: 4,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        },
        // IA/AI exemplos
        {
          id: 4,
          author: { id: 5, username: 'ia1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai1', name: 'IA Vision' },
          description: 'Geração de imagem por IA: robô pintando.',
          category: 'SkillDemo',
          videoUrl: '',
          thumbnail: 'https://images.pexels.com/photos/2317426/pexels-photo-2317426.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 30,
          comments_count: 7,
          shares_count: 5,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        },
        {
          id: 5,
          author: { id: 6, username: 'ia2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai2', name: 'AI Art' },
          description: 'Arte digital criada por inteligência artificial.',
          category: 'ResearchHighlights',
          videoUrl: '',
          thumbnail: 'https://images.pexels.com/photos/1111374/pexels-photo-1111374.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 18,
          comments_count: 2,
          shares_count: 1,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        },
        {
          id: 6,
          author: { id: 7, username: 'ia3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai3', name: 'AI Bot' },
          description: 'Paisagem surreal gerada por IA.',
          category: 'ProjectShowcase',
          videoUrl: '',
          thumbnail: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 25,
          comments_count: 4,
          shares_count: 3,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        }
      ]
      
      if (page === 1) {
        setFeed(mockFeed)
      } else {
        setFeed(prev => [...prev, ...mockFeed])
      }
      setHasMore(false)
      setCurrentPage(page)
    } catch (err) {
      setError('Erro ao carregar reels')
    } finally {
      setLoading(false)
    }
  }

  // Carregar mais reels
  const loadMore = async (category = null) => {
    if (!hasMore || loading) return
    await loadFeed(category, currentPage + 1)
  }

  // Atualizar feed de reels
  const refreshReels = async () => {
    setHasMore(true)
    await loadFeed(null, 1)
  }

  // Carregar feed inicial após autenticação
  useEffect(() => {
    if (authLoading) return
    // Permite carregar reels mockados mesmo sem usuário logado
    if (feed.length === 0) {
      loadFeed(null, 1)
    }
  }, [authLoading, user])

  // Upload de reel
  const uploadReel = async (videoFile, description, categoryId, hashtags, duration) => {
    setLoading(true)
    setError(null)
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de upload
      console.log('[REELS] Upload mockado:', { description, categoryId, hashtags, duration })
      const newReel = {
        id: Math.random(),
        author: { id: 999, username: 'developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev', name: 'Developer' },
        description: description,
        category: categoryId,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
        thumbnail: 'https://images.pexels.com/photos/1181637/pexels-photo-1181637.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        is_liked: false,
        is_bookmarked: false,
        created_at: new Date().toISOString()
      }
      return newReel
    } catch (err) {
      const errorMsg = 'Erro ao fazer upload'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Like em reel
  const likeReel = async (reelId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de like
      console.log('[REELS] Like mockado para reel:', reelId)
      setFeed(prev => prev.map(r =>
        r.id === reelId
          ? { ...r, is_liked: true, likes_count: r.likes_count + 1 }
          : r
      ))
    } catch (err) {
      throw 'Erro ao dar like'
    }
  }

  // Unlike em reel
  const unlikeReel = async (reelId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de unlike
      console.log('[REELS] Unlike mockado para reel:', reelId)
      setFeed(prev => prev.map(r =>
        r.id === reelId
          ? { ...r, is_liked: false, likes_count: Math.max(0, r.likes_count - 1) }
          : r
      ))
    } catch (err) {
      throw 'Erro ao remover like'
    }
  }

  // Comentar em reel
  const commentReel = async (reelId, content) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de comentário
      console.log('[REELS] Comentário mockado para reel:', reelId, content)
      const newComment = {
        id: Math.random(),
        author: { id: 999, username: 'developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev' },
        content: content,
        created_at: new Date().toISOString()
      }
      setFeed(prev => prev.map(r =>
        r.id === reelId
          ? { ...r, comments_count: r.comments_count + 1, comments: [...(r.comments || []), newComment] }
          : r
      ))
      return newComment
    } catch (err) {
      throw err
    }
  }

  // Guardar reel
  const saveReel = async (reelId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de guardar
      console.log('[REELS] Guardar mockado para reel:', reelId)
      setFeed(prev => prev.map(r =>
        r.id === reelId
          ? { ...r, is_bookmarked: true }
          : r
      ))
    } catch (err) {
      throw 'Erro ao guardar reel'
    }
  }

  // Remover guardado
  const unsaveReel = async (reelId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de remover guardado
      console.log('[REELS] Remover guardado mockado para reel:', reelId)
      setFeed(prev => prev.map(r =>
        r.id === reelId
          ? { ...r, is_bookmarked: false }
          : r
      ))
    } catch (err) {
      throw 'Erro ao remover guardado'
    }
  }

  // Rastrear visualização
  const trackView = async (reelId, watchTime, completed = false) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de rastreamento
      console.log('[REELS] Rastreamento mockado - reelId:', reelId, 'watchTime:', watchTime, 'completed:', completed)
    } catch (err) {
      console.error('[REELS] Error tracking view:', err)
    }
  }

  // Buscar reels
  const searchReels = async (query, category = null) => {
    setLoading(true)
    try {
      // ✅ MODO DESENVOLVIMENTO: Retornar resultados mockados
      console.log('[REELS] Busca mockada para query:', query, 'categoria:', category)
      const mockResults = [
        {
          id: 1,
          author: { id: 2, username: 'usuario1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', name: 'Usuário 1' },
          description: query,
          category: category || 'StudyTips',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
          thumbnail: 'https://images.pexels.com/photos/1181706/pexels-photo-1181706.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 10,
          comments_count: 2,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        }
      ]
      return mockResults
    } catch (err) {
      setError('Erro ao buscar reels')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Reels em tendência
  const getTrendingReels = async () => {
    setLoading(true)
    try {
      // ✅ MODO DESENVOLVIMENTO: Retornar trending mockado
      console.log('[REELS] Carregando trending mockado')
      const mockTrending = [
        {
          id: 1,
          author: { id: 2, username: 'usuario1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', name: 'Usuário 1' },
          description: 'Reel em tendência!',
          category: 'ProjectShowcase',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
          thumbnail: 'https://images.pexels.com/photos/2317426/pexels-photo-2317426.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
          likes_count: 100,
          comments_count: 25,
          is_liked: false,
          is_bookmarked: false,
          created_at: new Date().toISOString()
        }
      ]
      return mockTrending
    } catch (err) {
      setError('Erro ao carregar trending')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Reportar reel
  const reportReel = async (reelId, reason, description = '') => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de reportagem
      console.log('[REELS] Reportagem mockada - reelId:', reelId, 'reason:', reason, 'description:', description)
      return true
    } catch (err) {
      throw 'Erro ao reportar reel'
    }
  }

  return (
    <ReelsContext.Provider value={{
      reels: feed,
      feed,
      loading,
      error,
      hasMore,
      categories,
      loadFeed,
      loadMoreReels: loadMore,
      loadMore,
      refreshReels,
      uploadReel,
      likeReel,
      unlikeReel,
      commentReel,
      saveReel,
      unsaveReel,
      trackView,
      searchReels,
      getTrendingReels,
      reportReel,
    }}>
      {children}
    </ReelsContext.Provider>
  )
}

export const useReels = () => {
  const context = useContext(ReelsContext)
  if (!context) {
    throw new Error('useReels must be used within a ReelsProvider')
  }
  return context
}
