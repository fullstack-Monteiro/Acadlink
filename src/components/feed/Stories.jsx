import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { STORIES } from '../../data/mock'
import UserAvatar from '../ui/UserAvatar'
import StoryCreator from './StoryCreator'
import { useAuth } from '../../context/AuthContext'
import { stringifyUniversity } from '../../utils/university'

const STORY_DURATION = 5000

function StoryViewer({ stories, startIndex, onClose }) {
  const navigate = useNavigate()
  const [index, setIndex]     = useState(startIndex)
  const [progress, setProgress] = useState(0)
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

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl h-full sm:h-[640px] sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Background */}
        {story.image ? (
          <img src={story.image} alt={story.text} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-500" />
        )}
        <div className="absolute inset-0 bg-black/30" />

        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={() => navigate(`/profile/${story.user.id}`)}
            className="flex items-center gap-3 rounded-full p-2 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <div className="rounded-full p-0.5 bg-white/80">
              <UserAvatar name={story.user.name} size="sm" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">{story.user.name}</p>
              <p className="text-white/75 text-xs">{stringifyUniversity(story.user.university)}</p>
            </div>
          </button>
          <button onClick={onClose} className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-30">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
          <div className="space-y-2 max-w-xl">
            <div className="text-5xl leading-none">{story.emoji}</div>
            <p className="text-3xl font-bold leading-tight">{story.text}</p>
          </div>
        </div>

        {/* Nav zones */}
        <button onClick={goPrev} className="absolute left-0 top-0 w-1/3 h-full z-10" />
        <button onClick={goNext} className="absolute right-0 top-0 w-1/3 h-full z-10" />

        {/* Arrow hints */}
        {index > 0 && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <ChevronLeft className="w-6 h-6 text-white/80" />
          </div>
        )}
        {index < stories.length - 1 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <ChevronRight className="w-6 h-6 text-white/80" />
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
  const [viewerIndex, setViewerIndex] = useState(null)
  const [showCreator, setShowCreator] = useState(false)

  const openStory = (idx) => {
    setViewerIndex(idx)
    setStories(s => s.map((st, i) => i === idx ? { ...st, seen: true } : st))
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {/* Create story card */}
        <div
          onClick={() => setShowCreator(true)}
          className="w-[150px] sm:w-[170px] max-w-[150px] sm:max-w-[170px] h-40 rounded-3xl bg-white dark:bg-[#111] border border-neutral-200 dark:border-[#222] shadow-sm overflow-hidden flex-shrink-0 cursor-pointer transition hover:-translate-y-0.5"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowCreator(true) }}
        >
          <div className="h-full flex flex-col items-center justify-center p-4 gap-3 bg-gradient-to-b from-white to-neutral-100 dark:from-[#181818] dark:to-[#111]">
            <div className="relative w-14 h-14 rounded-full bg-neutral-100 dark:bg-[#222] flex items-center justify-center overflow-hidden">
              <UserAvatar name={user?.name} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary-600 border-2 border-white dark:border-[#111] flex items-center justify-center text-white">
                <Plus className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-900 dark:text-white text-center">Criar história</p>
          </div>
        </div>

        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => openStory(idx)}
            className="relative w-[150px] sm:w-[170px] max-w-[150px] sm:max-w-[170px] h-40 rounded-3xl overflow-hidden shadow-sm flex-shrink-0 cursor-pointer group"
          >
            {story.image ? (
              <img src={story.image} alt={story.text} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className={`absolute inset-0 ${story.seen ? 'bg-neutral-200 dark:bg-[#202020]' : 'bg-gradient-to-br from-primary-500 via-secondary-400 to-accent-400'}`} />
            )}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/30 transition-colors" />
            <div className={`absolute top-4 left-4 p-0.5 rounded-full ${story.seen ? 'bg-white/80' : 'bg-white'}`}>
              <div className="bg-white dark:bg-[#111] rounded-full p-0.5">
                <UserAvatar name={story.user.name} size="sm" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-semibold line-clamp-2">{story.user.name.split(' ')[0]}</p>
              <p className="text-[11px] text-white/80 mt-1 line-clamp-2">{story.text}</p>
            </div>
          </div>
        ))}
      </div>

      {viewerIndex !== null && (
        <StoryViewer
          stories={stories}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {showCreator && (
        <StoryCreator
          user={user}
          onClose={() => setShowCreator(false)}
          onShare={({ text, image }) => {
            // cria um novo story localmente (simplificado)
            const newStory = {
              id: Date.now(),
              user: user,
              text: text || '',
              image: image ? URL.createObjectURL(image) : null,
              seen: false,
            }
            setStories(s => [newStory, ...s])
          }}
        />
      )}
    </>
  )
}
