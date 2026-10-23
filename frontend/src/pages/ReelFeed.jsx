import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Loader2, Search } from 'lucide-react'
import ReelPlayer from '../components/reels/ReelPlayer'
import ReelComments from '../components/reels/ReelComments'
import SaveToCollectionModal from '../components/reels/SaveToCollectionModal'
import ReelOptionsMenu from '../components/reels/ReelOptionsMenu'
import ReportReelModal from '../components/reels/ReportReelModal'
import Toast from '../components/ui/Toast'
import { useReels } from '../context/ReelsContext'
import { useNavigate } from 'react-router-dom'

export default function ReelFeed({ onClose }) {
  const {
    reels, loadMoreReels, refreshReels, loading, hasMore,
    likeReel, unlikeReel, commentReel, saveReel, unsaveReel, reportReel,
  } = useReels()

  const navigate                                    = useNavigate()
  const [currentIndex, setCurrentIndex]             = useState(0)
  const [isLoadingMore, setIsLoadingMore]           = useState(false)
  const [followingStates, setFollowingStates]       = useState({})
  const [showComments, setShowComments]             = useState(false)
  const [selectedReelId, setSelectedReelId]         = useState(null)
  const [showSaveModal, setShowSaveModal]           = useState(false)
  const [showOptionsMenu, setShowOptionsMenu]       = useState(false)
  const [showReportModal, setShowReportModal]       = useState(false)
  const [reelToSave, setReelToSave]                 = useState(null)
  const [selectedReel, setSelectedReel]             = useState(null)
  const [toast, setToast]                           = useState(null)
  const [collections, setCollections]               = useState([
    { id: 1, name: 'Favoritos', description: 'Meus reels favoritos', count: 0 },
    { id: 2, name: 'Dicas de Estudo', description: 'Recursos educativos', count: 0 },
    { id: 3, name: 'Inspiração', description: 'Conteúdo inspirador', count: 0 }
  ])
  const scrollRef  = useRef(null)
  const itemRefs   = useRef([])
  const observerRef = useRef(null)

  // ─── Intersection Observer ────────────────────────────────────────────────
  useEffect(() => {
    if (!scrollRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentIndex(Number(entry.target.dataset.index))
          }
        })
      },
      { root: scrollRef.current, threshold: 0.6 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observerRef.current.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [reels.length])

  // ─── Carregar mais quando perto do fim ────────────────────────────────────
  useEffect(() => {
    if (reels.length > 0 && currentIndex >= reels.length - 3) {
      loadMore()
    }
  }, [currentIndex, reels.length])

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || loading) return
    setIsLoadingMore(true)
    try { await loadMoreReels() }
    catch (err) { console.error(err) }
    finally { setIsLoadingMore(false) }
  }, [isLoadingMore, hasMore, loading, loadMoreReels])

  const scrollTo = useCallback((idx) => {
    const el = itemRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // ─── Handlers com acções reais ────────────────────────────────────────────
  const handleLike = async (reelId) => {
    const reel = reels.find(r => r.id === reelId)
    if (!reel) return
    if (reel.is_liked) {
      await unlikeReel(reelId)
    } else {
      await likeReel(reelId)
    }
  }

  const handleComment = (reelId) => {
    setSelectedReelId(reelId)
    setShowComments(true)
  }

  const handleCloseComments = () => {
    setShowComments(false)
    setSelectedReelId(null)
  }

  const handleAddComment = async (reelId, text) => {
    try {
      await commentReel(reelId, text)
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err)
    }
  }

  const handleShare = async (reelId) => {
    const url = `${window.location.origin}/reels?id=${reelId}`
    if (navigator.share) {
      await navigator.share({ title: 'AcadLink Reel', url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const handleSave = async (reelId) => {
    const reel = reels.find(r => r.id === reelId)
    if (!reel) return
    
    // Abrir modal de coleções
    setReelToSave(reel)
    setShowSaveModal(true)
  }

  const handleSaveToCollections = async (reelId, collectionIds) => {
    try {
      // Aqui implementarás a lógica real quando tiveres backend
      console.log('Guardando reel', reelId, 'em coleções:', collectionIds)
      
      // Por agora, apenas actualiza o estado local
      if (collectionIds.length > 0) {
        await saveReel(reelId)
      } else {
        await unsaveReel(reelId)
      }
    } catch (err) {
      console.error('Erro ao guardar em coleções:', err)
    }
  }

  const handleMore    = (reelId) => {
    const reel = reels.find(r => r.id === reelId)
    if (!reel) return
    
    setSelectedReel(reel)
    setShowOptionsMenu(true)
  }

  const handleOptionSelected = async (reelId, option) => {
    console.log('Opção selecionada:', option, 'para reel:', reelId)
    
    // Fechar menu de opções primeiro
    setShowOptionsMenu(false)
    
    // Abrir modal de reportagem se necessário
    if (option === 'report') {
      const reel = reels.find(r => r.id === reelId)
      if (reel) {
        // Delay pequeno para permitir animação de saída do menu
        setTimeout(() => {
          setSelectedReel(reel)
          setShowReportModal(true)
        }, 200)
      }
    }
    
    // Navegar para perfil se "acerca desta conta"
    if (option === 'about-account') {
      const reel = reels.find(r => r.id === reelId)
      if (reel?.author?.id || reel?.creator?.id) {
        navigate(`/profile/${reel.author?.id || reel.creator?.id}`)
      }
    }
  }

  const handleSubmitReport = async (reelId, reason, description) => {
    try {
      await reportReel(reelId, reason, description)
      console.log('Reportagem enviada:', { reelId, reason, description })
      showToast('Reportagem enviada com sucesso!', 'success')
    } catch (err) {
      console.error('Erro ao enviar reportagem:', err)
      showToast('Erro ao enviar reportagem', 'error')
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const closeToast = () => {
    setToast(null)
  }

  const handleFollowClick = (creator) => {
    const id = creator?.id || creator?.username || ''
    setFollowingStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCreatorClick = (creator) => {
    if (creator?.id) navigate(`/profile/${creator.id}`)
  }

  // ─── Loading / Empty ──────────────────────────────────────────────────────
  if (loading && reels.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">A carregar reels…</span>
        </div>
      </div>
    )
  }

  if (reels.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white text-center px-6">
          <p className="text-white/60 text-sm">Sem reels disponíveis</p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black">

      <div
        ref={scrollRef}
        className="w-full h-full overflow-y-scroll"
        style={{
          scrollSnapType:     'y mandatory',
          scrollBehavior:     'smooth',
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {reels.map((reel, idx) => (
          <div
            key={reel.id ?? idx}
            ref={(el) => { itemRefs.current[idx] = el }}
            data-index={idx}
            className="w-full relative"
            style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          >
            <ReelPlayer
              reel={reel}
              onNext={() => scrollTo(idx + 1)}
              onPrevious={() => scrollTo(idx - 1)}
              onClose={onClose}
              autoPlay={idx === currentIndex}
              onCreatorClick={handleCreatorClick}
              onHashtagClick={() => {}}
              onFollowClick={handleFollowClick}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
              onMore={handleMore}
              followingStates={followingStates}
            />
          </div>
        ))}

        {isLoadingMore && (
          <div className="w-full flex items-center justify-center text-white/60 gap-2" style={{ height: 80 }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">A carregar mais…</span>
          </div>
        )}
      </div>

      {/* Fechar */}
      <button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/30 border border-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/15 transition-colors"
        aria-label="Fechar reels"
      >
        <X className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Pesquisar */}
      <button
        onClick={() => navigate('/reels/search')}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/30 border border-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/15 transition-colors"
        aria-label="Pesquisar reels"
      >
        <Search className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Painel de Comentários */}
      {showComments && selectedReelId && (
        <ReelComments
          reelId={selectedReelId}
          onClose={handleCloseComments}
          onAddComment={handleAddComment}
        />
      )}

      {/* Modal de Coleções */}
      {showSaveModal && reelToSave && (
        <SaveToCollectionModal
          reel={reelToSave}
          existingCollections={collections}
          onClose={() => {
            setShowSaveModal(false)
            setReelToSave(null)
          }}
          onSave={handleSaveToCollections}
        />
      )}

      {/* Menu de Opções */}
      {showOptionsMenu && selectedReel && (
        <ReelOptionsMenu
          reel={selectedReel}
          onClose={() => {
            setShowOptionsMenu(false)
            setSelectedReel(null)
          }}
          onOption={handleOptionSelected}
          onShowToast={showToast}
        />
      )}

      {/* Modal de Reportagem */}
      {showReportModal && selectedReel && (
        <ReportReelModal
          reel={selectedReel}
          onClose={() => {
            setShowReportModal(false)
            setSelectedReel(null)
          }}
          onSubmit={handleSubmitReport}
        />
      )}

      {/* Toast de Notificação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

    </div>
  )
}
