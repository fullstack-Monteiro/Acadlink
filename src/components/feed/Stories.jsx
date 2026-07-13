import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, X, ChevronLeft, ChevronRight, MoreHorizontal, ThumbsUp, Heart, Smile, Send } from 'lucide-react'
import { STORIES } from '../../data/mock'
import UserAvatar from '../ui/UserAvatar'
import { useAuth } from '../../context/AuthContext'
import { stringifyUniversity } from '../../utils/university'

const STORY_DURATION = 5000

function StoryViewer({ stories, startIndex, onClose }) {
  const navigate = useNavigate()
  const [index, setIndex]     = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const [reaction, setReaction] = useState(null)
  const [message, setMessage] = useState('')
  const intervalRef = useRef(null)
  const story = stories[index]

  useEffect(() => {
    setProgress(0)
    const step = 100 / (STORY_DURATION / 50)
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          goNext()
          return 0
        }
        return p + step
      })
    }, 50)
    return () => clearInterval(intervalRef.current)
  }, [index])

  const goNext = () => {
    if (index < stories.length - 1) setIndex(i => i + 1)
    else onClose()
  }

  const goPrev = () => {
    if (index > 0) setIndex(i => i - 1)
  }

  const handleReaction = (type) => {
    setReaction(type)
    setTimeout(() => setReaction(null), 1000)
  }

  const getTimeAgo = () => {
    return '2 h'
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 animate-fade-in">
      <div className="relative w-full h-full overflow-hidden bg-black">

        {/* Background */}
        {story.image ? (
          <img src={story.image} alt={story.text} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-500" />
        )}
        <div className="absolute inset-0 bg-black/20" />

        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-40">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-3 right-3 z-40 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`/profile/${story.user.id}`)}
            className="flex items-center gap-3 rounded-full px-3 py-2 transition-colors hover:bg-white/10"
          >
            <UserAvatar name={story.user.name} size="sm" />
            <div className="text-left">
              <p className="text-white font-semibold text-sm">{story.user.name}</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center bg-white/12 backdrop-blur rounded-full px-3 py-2 sm:px-4 sm:py-2.5 transition-colors focus-within:bg-white/20">
                <input
                  type="text"
                  placeholder="Enviar mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent text-white text-sm placeholder-white/60 outline-none min-w-0"
                />
                {message && (
                  <button
                    onClick={() => setMessage('')}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => handleReaction('like')}
                className={`p-3 rounded-full transition-all ${reaction === 'like' ? 'bg-blue-600 scale-110' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReaction('love')}
                className={`p-3 rounded-full transition-all ${reaction === 'love' ? 'bg-red-600 scale-110' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReaction('haha')}
                className={`p-3 rounded-full transition-all ${reaction === 'haha' ? 'bg-yellow-500 scale-110' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Nav zones */}
        <button onClick={goPrev} className="absolute left-0 top-0 w-1/4 h-full z-30" />
        <button onClick={goNext} className="absolute right-0 top-0 w-1/4 h-full z-30" />

        {index > 0 && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <ChevronLeft className="w-6 h-6 text-white/60" />
          </div>
        )}
        {index < stories.length - 1 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <ChevronRight className="w-6 h-6 text-white/60" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Stories() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stories, setStories] = useState(STORIES)
  const [viewerData, setViewerData] = useState(null)

  const openStory = (idx) => {
    const selected = stories[idx]
    // marcar como visto
    setStories(s => s.map((st, i) => i === idx ? { ...st, seen: true } : st))
    // agrupa stories do mesmo usuário e passa índice relativo
    const group = stories.filter(st => st.user.id === selected.user.id)
    const startIndex = group.findIndex(st => st.id === selected.id)
    setViewerData({ group, startIndex })
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {/* Create story card */}
        <Link
          to="/create-story"
          className="w-[120px] max-w-[120px] h-[210px] rounded-[20px] bg-white dark:bg-[#111] border border-neutral-200 dark:border-[#222] shadow-sm overflow-hidden flex-shrink-0 cursor-pointer transition hover:-translate-y-0.5"
          role="button"
          tabIndex={0}
        >
          <div className="h-full flex flex-col items-center justify-center p-3 bg-white dark:bg-[#111] gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 dark:bg-[#222]">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/png?seed=${encodeURIComponent(user?.name || 'perfil')}&size=256`}
                alt={user?.name || 'Perfil'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div className="w-full text-center">
              <p className="text-xs font-semibold text-neutral-900 dark:text-white">Adicionar história</p>
            </div>
          </div>
        </Link>

        {stories.map((story, idx) => {
          const postCount = stories.filter(s => s.user.id === story.user.id).length
          return (
          <div
            key={story.id}
            onClick={() => openStory(idx)}
            className="relative w-[120px] max-w-[120px] h-[210px] rounded-[20px] overflow-hidden shadow-sm flex-shrink-0 cursor-pointer group"
          >
            {story.image ? (
              <img src={story.image} alt={story.text} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className={`absolute inset-0 ${story.seen ? 'bg-neutral-200 dark:bg-[#202020]' : 'bg-gradient-to-br from-primary-500 via-secondary-400 to-accent-400'}`} />
            )}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/30 transition-colors" />
            {/* post count badge top-left */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-secondary-500 text-white text-xs font-semibold">
              {postCount}
            </div>
            {/* avatar removed per design: only show name at bottom */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-base font-semibold line-clamp-2">{story.user.name.split(' ')[0]}</p>
            </div>
          </div>
        )
        })}
      </div>

      {viewerData !== null && (
        <StoryViewer
          stories={viewerData.group}
          startIndex={viewerData.startIndex}
          onClose={() => setViewerData(null)}
        />
      )}

    </>
  )
}
