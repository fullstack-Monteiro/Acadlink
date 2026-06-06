import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const PostsContext = createContext(null)

export function PostsProvider({ children }) {
  const { user, authLoading, isTestMode } = useAuth()
  const [posts, setPosts] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)

  // Dados Mock para modo teste (memoizado)
  const mockPosts = useMemo(() => [
    {
      id: 1,
      groupId: 1,
      content: 'Comece a semana com novos contactos e partilhas de projeto. Vamos crescer juntos aqui no AcadLink!',
      image: null,
      video: null,
      author: {
        ...user,
        course: user?.course || 'Gestão de Empresas',
        university: user?.university || 'UEM — Gestão',
        verified: user?.verified ?? true,
        verifiedUniversity: user?.verifiedUniversity || 'UEM'
      },
      category: 'académico',
      time: 'Agora mesmo',
      likes_count: 8,
      comments_count: 3,
      commentCount: 3,
      shares: 2,
      reactions: {
        like: 4,
        love: 2,
        wow: 1,
        haha: 0,
        sad: 0,
        angry: 0,
      },
      myReaction: null,
      is_liked: false,
      is_saved: false,
      saved: false,
    },
    {
      id: 2,
      groupId: 4,
      content: 'Participei no Workshop de Fotografia criativa e adorei a experiência. Aqui vai um registo do trabalho finalizado!',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy3uN7JWQOSYWDamsJh45Sct0ZhfFaPI6a7w&s',
      video: null,
      author: {
        id: 2,
        name: 'Beatriz Silva',
        course: 'Design Gráfico',
        university: 'UEM — Artes',
        verified: true,
        verifiedUniversity: 'UEM'
      },
      category: 'evento',
      time: 'Há 2 horas',
      likes_count: 22,
      comments_count: 7,
      commentCount: 7,
      shares: 4,
      reactions: {
        like: 12,
        love: 5,
        wow: 3,
        haha: 1,
        sad: 0,
        angry: 0,
      },
      myReaction: null,
      is_liked: false,
      is_saved: false,
      saved: false,
    },
    {
      id: 3,
      groupId: 4,
      content: 'Gravei um pequeno vídeo com dicas para organizar o estudo antes das avaliações. Vê e comenta o que achaste!',
      image: null,
      video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      videoPoster: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      author: {
        id: 3,
        name: 'Artur Santos',
        course: 'Engenharia Informática',
        university: 'UEM — Informática',
        verified: false,
      },
      category: 'oportunidade',
      time: 'Hoje',
      likes_count: 15,
      comments_count: 5,
      commentCount: 5,
      shares: 6,
      reactions: {
        like: 8,
        love: 4,
        wow: 2,
        haha: 1,
        sad: 0,
        angry: 0,
      },
      myReaction: null,
      is_liked: false,
      is_saved: false,
      saved: false,
    },
    {
      id: 4,
      groupId: 2,
      content: 'Partilhei os meus apontamentos de Anatomia para a turma de Medicina. Quem quiser trocar notas, manda mensagem! 🩺',
      image: null,
      video: null,
      author: {
        id: 5,
        name: 'Beatriz Mondlane',
        course: 'Medicina',
        university: 'UniLúrio — Universidade Lúrio',
        verified: true,
      },
      category: 'académico',
      time: '1d atrás',
      likes_count: 67,
      comments_count: 18,
      commentCount: 18,
      shares: 45,
      reactions: {
        like: 34,
        love: 12,
        wow: 8,
        haha: 3,
        sad: 0,
        angry: 0,
      },
      myReaction: 'love',
      is_liked: false,
      is_saved: false,
      saved: false,
    },
    {
      id: 5,
      groupId: 3,
      content: 'O meu projecto de empreendedorismo recebeu financiamento! Vamos celebrar o próximo pitch com a comunidade do ISCTEM. 💡',
      image: null,
      video: null,
      author: {
        id: 3,
        name: 'Fátima Cossa',
        course: 'Gestão de Empresas',
        university: 'ISCTEM — Instituto Superior de Relações Internacionais',
        verified: false,
      },
      category: 'oportunidade',
      time: '3h atrás',
      likes_count: 18,
      comments_count: 5,
      commentCount: 5,
      shares: 9,
      reactions: {
        like: 12,
        love: 3,
        wow: 2,
        haha: 1,
        sad: 0,
        angry: 0,
      },
      myReaction: null,
      is_liked: false,
      is_saved: false,
      saved: false,
    },
    {
      id: 6,
      groupId: 5,
      content: 'Concurso de redação jurídica na UCM! Partilhei o meu esboço sobre direitos humanos. Vem participar também. ⚖️',
      image: null,
      video: null,
      author: {
        id: 9,
        name: 'Sofia Guambe',
        course: 'Direito',
        university: 'UCM — Universidade Católica de Moçambique',
        verified: true,
      },
      category: 'académico',
      time: '5h atrás',
      likes_count: 29,
      comments_count: 12,
      commentCount: 12,
      shares: 11,
      reactions: {
        like: 20,
        love: 4,
        wow: 3,
        haha: 0,
        sad: 0,
        angry: 0,
      },
      myReaction: null,
      is_liked: false,
      is_saved: false,
      saved: false,
    },
    {
      id: 7,
      groupId: 6,
      content: 'Partilhei um artigo sobre diplomacia digital. Quem estuda Relações Internacionais no ISRI, comentem com a vossa opinião!',
      image: null,
      video: null,
      author: {
        id: 10,
        name: 'Mário Cuna',
        course: 'Rel. Internacionais',
        university: 'ISRI — Instituto Superior de Relações Internacionais',
        verified: false,
      },
      category: 'académico',
      time: '6h atrás',
      likes_count: 16,
      comments_count: 6,
      commentCount: 6,
      shares: 8,
      reactions: {
        like: 11,
        love: 2,
        wow: 1,
        haha: 0,
        sad: 0,
        angry: 0,
      },
      myReaction: null,
      is_liked: false,
      is_saved: false,
      saved: false,
    },
  ], [user])

  // Carregar posts do feed
  const loadPosts = useCallback(async (page = 1, testMode = false) => {
    setLoading(true)
    setError(null)
    
    try {
      // Em modo teste, usar dados mock
      const actualTestMode = testMode || localStorage.getItem('test_mode') === 'true'
      
      if (actualTestMode) {
        console.log('[POSTS] Test mode: using mock data')
        setPosts(mockPosts)
        setError(null)
        setHasMore(false)
      } else {
        const { data } = await api.get(`/posts/feed/?page=${page}`)
        if (page === 1) {
          setPosts(data.results || [])
        } else {
          setPosts(prev => [...prev, ...(data.results || [])])
        }
        setHasMore(!!data.next)
        setCurrentPage(page)
      }
    } catch (err) {
      console.log('[POSTS] Error loading posts:', err.message)
      setError(err.response?.data?.detail || 'Erro ao carregar posts')
    } finally {
      setIsReady(true)
      setLoading(false)
    }
  }, [mockPosts, isTestMode])

  // Carregar mais posts (infinite scroll)
  const loadMorePosts = async () => {
    if (!hasMore || loading) return
    await loadPosts(currentPage + 1)
  }

  // Carregar posts apenas quando o usuário estiver autenticado
  useEffect(() => {
    console.log('[POSTS] useEffect: authLoading=', authLoading, 'user=', user?.email, 'testMode=', isTestMode)
    if (!authLoading && user) {
      console.log('[POSTS] Calling loadPosts with testMode=', isTestMode)
      loadPosts(1, isTestMode)
    } else if (!user && !authLoading) {
      console.log('[POSTS] No user, setting isReady=true')
      setIsReady(true)
    }
  }, [authLoading, user, isTestMode, loadPosts])

  // Adicionar post diretamente no feed
  const addPost = async (post) => {
    try {
      console.log('[POSTS] Adicionando post mockado:', post.content)
      setPosts(prev => [
        {
          ...post,
          id: post.id || Date.now(),
          author: post.author || user,
          time: post.time || 'Agora mesmo',
          image: post.image || null,
          video: post.video || null,
          comments: post.comments || [],
          reactions: post.reactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
          myReaction: post.myReaction || null,
          commentCount: post.commentCount || 0,
          shares: post.shares || 0,
          saved: post.saved || false,
        },
        ...prev
      ])
      return post
    } catch (err) {
      throw err
    }
  }

  // Criar post
  const createPost = async (content, image, groupId = null) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de criação de post
      console.log('[POSTS] Criando post mockado:', content)
      const newPost = {
        id: Math.random(),
        content: content,
        image: image || null,
        video: null,
        author: user,
        category: 'académico',
        time: 'Agora mesmo',
        likes_count: 0,
        comments_count: 0,
        shares: 0,
        is_liked: false,
        is_saved: false,
        saved: false,
        reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        myReaction: null,
        commentCount: 0,
        comments: [],
        groupId,
      }
      setPosts(prev => [newPost, ...prev])
      return newPost
    } catch (err) {
      throw err
    }
  }

  // Like em post
  const likePost = async (postId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de like
      console.log('[POSTS] Like mockado para post:', postId)
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, is_liked: true, likes_count: p.likes_count + 1 }
          : p
      ))
    } catch (err) {
      throw 'Erro ao dar like'
    }
  }

  // Unlike em post
  const unlikePost = async (postId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de unlike
      console.log('[POSTS] Unlike mockado para post:', postId)
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, is_liked: false, likes_count: Math.max(0, p.likes_count - 1) }
          : p
      ))
    } catch (err) {
      throw 'Erro ao remover like'
    }
  }

  // Toggle save
  const toggleSave = async (postId) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de toggle save
      console.log('[POSTS] Toggle save mockado para post:', postId)
      const post = posts.find(p => p.id === postId)
      if (post?.is_saved) {
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, is_saved: false }
            : p
        ))
      } else {
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, is_saved: true }
            : p
        ))
      }
    } catch (err) {
      throw 'Erro ao guardar post'
    }
  }

  // Comentar em post
  const commentPost = async (postId, content) => {
    try {
      // ✅ MODO DESENVOLVIMENTO: Simulação de comentário
      console.log('[POSTS] Comentário mockado para post:', postId, content)
      const newComment = {
        id: Math.random(),
        author: user,
        content: content,
        created_at: new Date().toISOString()
      }
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, comments_count: p.comments_count + 1, comments: [...(p.comments || []), newComment] }
          : p
      ))
      return newComment
    } catch (err) {
      throw err
    }
  }

  // Carregar posts guardados
  const loadSavedPosts = async () => {
    setLoading(true)
    try {
      // ✅ MODO DESENVOLVIMENTO: Retornar posts guardados locais
      console.log('[POSTS] Carregando posts guardados mockados')
      return posts.filter(p => p.is_saved)
    } catch (err) {
      setError('Erro ao carregar posts guardados')
      return []
    } finally {
      setLoading(false)
    }
  }

  const savedPosts = posts.filter(p => p.is_saved)

  return (
    <PostsContext.Provider value={{
      posts, isReady, loading, error, hasMore,
      loadPosts, loadMorePosts, createPost, addPost,
      likePost, unlikePost, toggleSave, commentPost,
      loadSavedPosts, savedPosts,
    }}>
      {children}
    </PostsContext.Provider>
  )
}

export const usePosts = () => useContext(PostsContext)
