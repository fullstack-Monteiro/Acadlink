import { useState } from 'react'
import ReelPlayer from './ReelPlayer'
import { useReels } from '../../context/ReelsContext'

// Mock reel data for demonstration
const mockReel = {
  id: 'demo-reel-1',
  creatorId: '1',
  creator: {
    name: 'Ana Machava',
    username: 'ana.machava',
    avatar: null,
    verified: true,
    university: 'UEM — Universidade Eduardo Mondlane',
    course: 'Engenharia Informática'
  },
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  thumbnailUrl: '',
  description: 'Demonstrando como criar um algoritmo de ordenação eficiente em Python! 🐍✨ Neste reel, mostro a implementação do QuickSort com complexidade O(n log n). Perfeito para quem está estudando estruturas de dados.',
  category: 'StudyTips',
  hashtags: ['#python', '#algoritmos', '#programacao', '#estudos', '#quicksort'],
  duration: 60,
  views: 1250,
  uniqueViews: 980,
  likes: 89,
  comments: 12,
  shares: 5,
  saves: 23,
  isLiked: false,
  isSaved: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  moderationStatus: 'approved',
  reportCount: 0
}

export default function ReelPlayerExample() {
  const { likeReel, unlikeReel, shareReel, saveReel } = useReels()
  const [currentReel, setCurrentReel] = useState(mockReel)

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════════════

  const handleLike = async (reelId) => {
    if (currentReel.isLiked) {
      unlikeReel(reelId)
      setCurrentReel(prev => ({
        ...prev,
        isLiked: false,
        likes: Math.max(0, prev.likes - 1)
      }))
    } else {
      likeReel(reelId)
      setCurrentReel(prev => ({
        ...prev,
        isLiked: true,
        likes: prev.likes + 1
      }))
    }
  }

  const handleComment = (reelId) => {
    console.log('Opening comments for reel:', reelId)
    // TODO: Open comments modal
  }

  const handleShare = (reelId) => {
    shareReel(reelId)
    setCurrentReel(prev => ({
      ...prev,
      shares: prev.shares + 1
    }))
    console.log('Sharing reel:', reelId)
    // TODO: Open share modal
  }

  const handleSave = async (reelId) => {
    saveReel(reelId)
    setCurrentReel(prev => ({
      ...prev,
      isSaved: !prev.isSaved,
      saves: prev.isSaved ? Math.max(0, prev.saves - 1) : prev.saves + 1
    }))
  }

  const handleMore = (reelId) => {
    console.log('More options for reel:', reelId)
    // TODO: Open more options modal
  }

  const handleCreatorClick = (creator) => {
    console.log('Navigate to creator profile:', creator)
    // TODO: Navigate to profile page
  }

  const handleHashtagClick = (hashtag) => {
    console.log('Navigate to hashtag feed:', hashtag)
    // TODO: Navigate to hashtag feed
  }

  const handleFollowClick = (creatorId, isFollowing) => {
    console.log('Toggle follow for creator:', creatorId, 'Following:', isFollowing)
    // TODO: Implement follow/unfollow
  }

  const handleNext = () => {
    console.log('Navigate to next reel')
    // TODO: Load next reel
  }

  const handlePrevious = () => {
    console.log('Navigate to previous reel')
    // TODO: Load previous reel
  }

  const handleClose = () => {
    console.log('Close reel player')
    // TODO: Navigate back or close modal
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="w-full h-screen bg-black">
      <ReelPlayer
        reel={currentReel}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onClose={handleClose}
        onCreatorClick={handleCreatorClick}
        onHashtagClick={handleHashtagClick}
        onFollowClick={handleFollowClick}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onSave={handleSave}
        onMore={handleMore}
        autoPlay={true}
      />
    </div>
  )
}
