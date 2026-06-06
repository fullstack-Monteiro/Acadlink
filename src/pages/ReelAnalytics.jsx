import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown, Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { useReels } from '../context/ReelsContext'

/**
 * ReelAnalytics Page
 * 
 * Exibe analytics detalhados de um reel específico
 * Inclui visualizações, engajamento, e dados demográficos
 * 
 * Features:
 * - Métricas de visualização
 * - Engajamento (likes, comments, shares, saves)
 * - Gráfico de visualizações ao longo do tempo
 * - Dados demográficos (curso, ano)
 * - Comparação com média
 */
export default function ReelAnalytics({ reelId }) {
  const { getReel } = useReels()
  const reel = getReel(reelId)

  // ══════════════════════════════════════════════════════════════════════════════
  // CALCULATIONS
  // ══════════════════════════════════════════════════════════════════════════════

  const metrics = useMemo(() => {
    if (!reel) return null

    const totalEngagement = reel.likes + reel.comments + reel.shares + reel.saves
    const engagementRate = reel.views > 0 ? ((totalEngagement / reel.views) * 100).toFixed(2) : 0
    const avgWatchTime = 45 // Mock data
    const completionRate = 65 // Mock data

    return {
      views: reel.views,
      uniqueViews: reel.uniqueViews || Math.round(reel.views * 0.8),
      likes: reel.likes,
      comments: reel.comments,
      shares: reel.shares,
      saves: reel.saves,
      totalEngagement,
      engagementRate,
      avgWatchTime,
      completionRate
    }
  }, [reel])

  // ══════════════════════════════════════════════════════════════════════════════
  // MOCK DATA FOR CHARTS
  // ══════════════════════════════════════════════════════════════════════════════

  const viewsOverTime = [
    { day: 'Seg', views: 120 },
    { day: 'Ter', views: 240 },
    { day: 'Qua', views: 180 },
    { day: 'Qui', views: 320 },
    { day: 'Sex', views: 280 },
    { day: 'Sab', views: 450 },
    { day: 'Dom', views: 380 }
  ]

  const demographicData = [
    { label: 'Engenharia', value: 35 },
    { label: 'Administração', value: 25 },
    { label: 'Direito', value: 20 },
    { label: 'Medicina', value: 15 },
    { label: 'Outros', value: 5 }
  ]

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  if (!reel || !metrics) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-neutral-500">Reel não encontrado</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#000000] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#242526] border-b border-neutral-200 dark:border-[#3a3b3c] px-4 py-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Analytics do Reel
        </h1>
        <p className="text-sm text-neutral-500 dark:text-[#b0b3b8] mt-1">
          {reel.description?.substring(0, 50)}...
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Views */}
          <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
                Visualizações
              </span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {metrics.views.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] mt-1">
              {metrics.uniqueViews.toLocaleString('pt-BR')} únicas
            </p>
          </div>

          {/* Likes */}
          <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
                Likes
              </span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {metrics.likes.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] mt-1">
              {((metrics.likes / metrics.views) * 100).toFixed(1)}% de views
            </p>
          </div>

          {/* Comments */}
          <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
                Comentários
              </span>
              <MessageCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {metrics.comments.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] mt-1">
              {((metrics.comments / metrics.views) * 100).toFixed(1)}% de views
            </p>
          </div>

          {/* Engagement Rate */}
          <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
                Taxa de Engajamento
              </span>
              <ArrowUp className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {metrics.engagementRate}%
            </p>
            <p className="text-xs text-neutral-500 dark:text-[#b0b3b8] mt-1">
              {metrics.totalEngagement} interações
            </p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Shares */}
          <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
                Compartilhamentos
              </span>
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              {metrics.shares}
            </p>
          </div>

          {/* Saves */}
          <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
                Salvos
              </span>
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              {metrics.saves}
            </p>
          </div>

          {/* Completion Rate */}
          <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-neutral-600 dark:text-[#b0b3b8]">
                Taxa de Conclusão
              </span>
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              {metrics.completionRate}%
            </p>
          </div>
        </div>

        {/* Views Over Time */}
        <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
            Visualizações nos últimos 7 dias
          </h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {viewsOverTime.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary-500 rounded-t"
                  style={{
                    height: `${(item.views / 450) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-xs text-neutral-600 dark:text-[#b0b3b8]">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-neutral-50 dark:bg-[#3a3b3c] rounded-lg p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
            Audiência por Curso
          </h3>
          <div className="space-y-3">
            {demographicData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-neutral-700 dark:text-[#e4e6eb] w-24">
                  {item.label}
                </span>
                <div className="flex-1 bg-neutral-200 dark:bg-[#4a4b4c] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full transition-all"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white w-12 text-right">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
            Exportar como CSV
          </button>
          <button className="flex-1 px-4 py-2 bg-neutral-200 dark:bg-[#3a3b3c] text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-[#4a4b4c] transition-colors font-medium">
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  )
}
