import { useState, useEffect } from 'react'
import { usePosts } from '../context/PostsContext'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import PostCard from '../components/feed/PostCard'
import Card from '../components/ui/Card'
import Stories from '../components/feed/Stories'
import PostComposer from '../components/feed/PostComposer'
import SkeletonPost from '../components/ui/SkeletonPost'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { RefreshCw } from 'lucide-react'
import Skeleton, { SkeletonGroup } from '../components/ui/Skeleton'

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
    <div ref={containerRef} className="min-h-screen bg-[#f0f2f5] dark:bg-[#141414] relative overflow-hidden">
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
          <div className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-xl rounded-full p-3 shadow-lg border border-neutral-200/50 dark:border-[#333333]/70">
            <RefreshCw 
              className={`w-5 h-5 text-primary-600 ${refreshing ? 'animate-spin' : ''}`}
              style={{ transform: `rotate(${progress * 360}deg)` }}
            />
          </div>
        </div>
      )}
      
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 pb-24 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-2 sm:gap-4 lg:gap-6">

          <main className="space-y-3 min-w-0">
            {/* Card de criação de publicação */}
            <PostComposer />

            {/* Stories */}
            {loading ? (
              <SkeletonGroup className="px-1 py-1">
                <div className="flex gap-3 overflow-hidden">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
                      <Skeleton circle className="w-12 h-12" />
                      <Skeleton className="w-14 h-2.5 rounded-full" />
                    </div>
                  ))}
                </div>
              </SkeletonGroup>
            ) : (
              <Stories />
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
                icon="document"
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
                  <SkeletonGroup key={i} className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-neutral-100 dark:border-[#333333] p-4 space-y-3">
                    <Skeleton className="h-3.5 w-28 rounded-full" />
                    <Skeleton className="h-9 w-full rounded-xl" />
                    <Skeleton className="h-9 w-5/6 rounded-xl" />
                  </SkeletonGroup>
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


