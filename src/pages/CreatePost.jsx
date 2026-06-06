import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Link2, BarChart2, Trophy, FileText, X, Plus, ChevronLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import UserAvatar from '../components/ui/UserAvatar'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import BackButton from '../components/layout/BackButton'

const POST_TYPES = [
  { key: 'texto',      icon: FileText,  label: 'Texto' },
  { key: 'imagem',     icon: Image,     label: 'Imagem' },
  { key: 'link',       icon: Link2,     label: 'Link' },
  { key: 'sondagem',   icon: BarChart2, label: 'Sondagem' },
  { key: 'conquista',  icon: Trophy,    label: 'Conquista' },
]

const CATEGORIES = [
  { key: 'académico',   label: '📚 Académico' },
  { key: 'oportunidade',label: '💼 Oportunidade' },
  { key: 'evento',      label: '📅 Evento' },
]

const VISIBILITY = [
  { key: 'publico',    label: '🌍 Público' },
  { key: 'conexoes',   label: '🔗 Só conexões' },
]

const POLL_DURATIONS = ['1 hora', '24 horas', '7 dias']

export default function CreatePost() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addPost } = usePosts()
  const [postType, setPostType] = useState('texto')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('académico')
  const [visibility, setVisibility] = useState('publico')
  const [link, setLink] = useState('')
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [pollDuration, setPollDuration] = useState('24 horas')
  const [achievementTitle, setAchievementTitle] = useState('')
  const [posting, setPosting] = useState(false)
  const imageInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions(o => [...o, ''])
  }
  const removePollOption = (i) => setPollOptions(o => o.filter((_, idx) => idx !== i))
  const updatePollOption = (i, val) => setPollOptions(o => o.map((v, idx) => idx === i ? val : v))

  const isValid = () => {
    if (postType === 'sondagem') return pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2
    if (postType === 'conquista') return achievementTitle.trim()
    return content.trim()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid()) return
    setPosting(true)
    await new Promise(r => setTimeout(r, 700))

    const text = postType === 'conquista'
      ? `🏆 ${achievementTitle}${content ? '\n\n' + content : ''}`
      : postType === 'sondagem'
      ? `📊 ${pollQuestion}\n\n${pollOptions.filter(o => o.trim()).map((o, i) => `${i + 1}. ${o}`).join('\n')}`
      : postType === 'link'
      ? `${content}\n\n🔗 ${link}`
      : content

    addPost({
      id: Date.now(),
      author: user,
      content: text,
      category,
      image: imagePreview || null,
      reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      myReaction: null,
      commentCount: 0,
      shares: 0,
      time: 'Agora mesmo',
      saved: false,
      comments: [],
    })

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white -ml-2">Criar Post</h1>
        </div>
        <Card className="p-4 sm:p-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <UserAvatar name={user?.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user?.name}</p>
              <select
                value={visibility}
                onChange={e => setVisibility(e.target.value)}
                className="text-xs text-neutral-500 bg-neutral-100 dark:bg-[#222222] border-none rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-500 mt-0.5"
              >
                {VISIBILITY.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Tipo de post */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
              {POST_TYPES.map(({ key, icon: Icon, label }) => (
                <button key={key} type="button" onClick={() => setPostType(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                    postType === key ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-[#222222] text-neutral-600 dark:text-white'
                  }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Conteúdo por tipo */}
            {(postType === 'texto' || postType === 'imagem') && (
              <>
                <textarea
                  placeholder="O que queres partilhar com a comunidade?"
                  className="w-full bg-neutral-50 dark:bg-[#222222] rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] transition-all"
                  rows={5}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
                <p className="text-xs text-neutral-400 text-right -mt-2">{content.length}/500</p>
                {postType === 'imagem' && (
                  <>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setImagePreview(URL.createObjectURL(file))
                    }} />
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="preview" className="w-full rounded-xl object-cover max-h-60" />
                        <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => imageInputRef.current?.click()} className="border-2 border-dashed border-neutral-200 dark:border-[#2a2a2a] rounded-xl p-5 text-center hover:border-primary-400 transition-colors cursor-pointer">
                        <Image className="w-7 h-7 text-neutral-300 mx-auto mb-2" />
                        <p className="text-sm text-neutral-500">Clica para adicionar imagem</p>
                        <p className="text-xs text-neutral-400 mt-0.5">PNG, JPG até 5MB</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {postType === 'link' && (
              <>
                <input
                  type="url"
                  placeholder="https://..."
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#222222] rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] transition-all"
                />
                <textarea
                  placeholder="Adiciona um comentário sobre este link..."
                  className="w-full bg-neutral-50 dark:bg-[#222222] rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] transition-all"
                  rows={3}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </>
            )}

            {postType === 'sondagem' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Qual é a tua pergunta?"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#222222] rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] transition-all font-medium"
                />
                <div className="space-y-2">
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Opção ${i + 1}`}
                        value={opt}
                        onChange={e => updatePollOption(i, e.target.value)}
                        className="flex-1 bg-neutral-50 dark:bg-[#222222] rounded-xl px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] transition-all"
                      />
                      {pollOptions.length > 2 && (
                        <button type="button" onClick={() => removePollOption(i)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <button type="button" onClick={addPollOption}
                      className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                      <Plus className="w-4 h-4" /> Adicionar opção
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-2">Duração</p>
                  <div className="flex gap-2">
                    {POLL_DURATIONS.map(d => (
                      <button key={d} type="button" onClick={() => setPollDuration(d)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          pollDuration === d ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-[#222222] text-neutral-600 dark:text-white'
                        }`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {postType === 'conquista' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
                  <Trophy className="w-8 h-8 text-amber-500 flex-shrink-0" />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Nome da conquista (ex: 1º lugar no Hackathon UEM)"
                      value={achievementTitle}
                      onChange={e => setAchievementTitle(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Conta a história por trás desta conquista..."
                  className="w-full bg-neutral-50 dark:bg-[#222222] rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-neutral-200 dark:border-[#2a2a2a] transition-all"
                  rows={4}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>
            )}

            {/* Categoria */}
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-2">Categoria</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <button key={c.key} type="button" onClick={() => setCategory(c.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      category === c.key ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-[#222222] text-neutral-600 dark:text-white'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} fullWidth>Cancelar</Button>
              <Button type="submit" loading={posting} disabled={!isValid()} fullWidth>Publicar</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
