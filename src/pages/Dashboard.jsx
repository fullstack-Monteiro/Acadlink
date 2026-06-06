import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import PostCard from '../components/feed/PostCard'
import UserAvatar from '../components/ui/UserAvatar'
import Card from '../components/ui/Card'
import Stories from '../components/feed/Stories'
import SkeletonPost from '../components/ui/SkeletonPost'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { RefreshCw, Image, Video, Heart } from 'lucide-react'

function AnimatedPost({ post, toggleSave }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 })
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <PostCard post={post} onToggleSave={toggleSave} />
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const postsCtx = usePosts()
  if (!postsCtx) {
    console.log('[DASHBOARD] posts context is null - showing loader')
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#000000] flex items-center justify-center">
        <div className="text-center text-neutral-500">Carregando...</div>
      </div>
    )
  }

  const { posts, toggleSave, isReady } = postsCtx
  const loading = !isReady
  const hasError = !Array.isArray(posts)

  const handleRefresh = async () => {
    // Simula refresh - em produção, chamaria API
    await new Promise(resolve => setTimeout(resolve, 1000))
    window.location.reload()
  }

  const { containerRef, pulling, refreshing, pullDistance, progress } = usePullToRefresh(handleRefresh, {
    threshold: 80,
    resistance: 2.5,
  })

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50 dark:bg-[#000000] relative overflow-hidden">
      {/* Gradiente de fundo animado para mostrar glassmorphism */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>
      
      <Navbar />
      
      {/* Pull-to-refresh indicator */}
      {(pulling || refreshing) && (
        <div 
          className="fixed top-14 left-1/2 -translate-x-1/2 z-40 transition-all duration-200"
          style={{ 
            transform: `translate(-50%, ${Math.min(pullDistance, 60)}px)`,
            opacity: progress 
          }}
        >
          <div className="bg-white/90 dark:bg-[#242526]/90 backdrop-blur-xl rounded-full p-3 shadow-lg border border-neutral-200/50 dark:border-[#3a3b3c]/50">
            <RefreshCw 
              className={`w-5 h-5 text-primary-600 ${refreshing ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${progress * 360}deg)` }}
            />
          </div>
        </div>
      )}
      
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 pb-24 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-2 sm:gap-4 lg:gap-6">

          <main className="space-y-2 sm:space-y-3 min-w-0">
            {loading ? (
              <Card className="overflow-hidden animate-pulse">
                <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
                  <div className="h-9 rounded-full bg-neutral-200 dark:bg-[#2a2a2a] flex-1" />
                </div>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="flex items-center gap-3 px-3 sm:px-4 py-1">
                  <UserAvatar name={user?.name} size="sm" />
                  <Link to="/create-post" className="flex-1">
                    <div className="flex items-center justify-between gap-3 bg-neutral-100 dark:bg-[#222222] rounded-full px-4 py-1 text-sm text-neutral-400 cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] transition-colors select-none">
                      <span className="flex-1 truncate">O que estás a pensar?</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1c1c1c] text-primary-600 border border-neutral-200 dark:border-[#2a2a2a]">
                          <Image className="w-5 h-5" />
                        </span>
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1c1c1c] text-secondary-600 border border-neutral-200 dark:border-[#2a2a2a]">
                          <Video className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Card>
            )}

            {loading ? (
              <Card className="p-3 sm:p-4 animate-pulse">
                <div className="flex gap-3 overflow-hidden">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
                      <div className="w-14 h-2.5 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-3 sm:p-4">
                <Stories />
              </Card>
            )}

            {loading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : hasError ? (
              <ErrorState
                scope="dashboard.feed"
                title="Erro ao carregar o feed"
                subtitle="Nao foi possivel obter os posts neste momento."
                meta={{ source: 'PostsContext', isReady }}
                onRetry={() => window.location.reload()}
              />
            ) : posts.length === 0 ? (
              <EmptyState
                icon="📝"
                title="Sem posts no feed"
                subtitle="Segue outros estudantes ou cria o teu primeiro post!"
                action={
                  <Link to="/create-post" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                    Criar post
                  </Link>
                }
              />
            ) : (
              posts.map(post => <AnimatedPost key={post.id} post={post} toggleSave={toggleSave} />)
            )}
          </main>

          <div className="hidden lg:block">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="space-y-3">
                      <div className="h-3.5 w-28 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
                      <div className="h-9 w-full rounded-xl bg-neutral-200 dark:bg-[#2a2a2a]" />
                      <div className="h-9 w-5/6 rounded-xl bg-neutral-200 dark:bg-[#2a2a2a]" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Sidebar />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
