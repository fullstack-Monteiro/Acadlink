import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  Image,
  FileText,
  Video,
  Type,
  Smile,
  Edit3,
  PenTool,
  MapPin,
  Music,
  Link2,
  ChevronLeft,
  BookOpen,
  Calendar,
  Award,
  PlayCircle,
  Sparkles,
  Plus,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const ACTIONS = [
  { key: 'camera', icon: Camera, label: 'Câmera', tint: 'bg-sky-100 text-sky-700' },
  { key: 'gallery', icon: Image, label: 'Galeria', tint: 'bg-indigo-100 text-indigo-700' },
  { key: 'document', icon: FileText, label: 'Documento', tint: 'bg-emerald-100 text-emerald-700' },
  { key: 'video', icon: Video, label: 'Vídeo', tint: 'bg-violet-100 text-violet-700' },
  { key: 'text', icon: Type, label: 'Texto', tint: 'bg-slate-100 text-slate-700' },
]

const TOOLS = [
  { key: 'emoji', icon: Smile, label: 'Emoji' },
  { key: 'text', icon: Edit3, label: 'Texto' },
  { key: 'draw', icon: PenTool, label: 'Desenhar' },
  { key: 'sticker', icon: Sparkles, label: 'Sticker' },
  { key: 'location', icon: MapPin, label: 'Localização' },
  { key: 'music', icon: Music, label: 'Música' },
  { key: 'link', icon: Link2, label: 'Link' },
]

const ACADEMIC_CARDS = [
  { key: 'doc', icon: FileText, color: 'text-sky-600 bg-sky-100', title: 'Compartilhar Documento', description: 'Anexa trabalhos, resumos ou PDFs rápidos.' },
  { key: 'course', icon: BookOpen, color: 'text-emerald-600 bg-emerald-100', title: 'Compartilhar Disciplina', description: 'Mostrar notas, matérias ou dicas de estudo.' },
  { key: 'event', icon: Calendar, color: 'text-violet-600 bg-violet-100', title: 'Compartilhar Evento', description: 'Divulga palestras, aulas ou meetups.' },
  { key: 'achievement', icon: Award, color: 'text-amber-600 bg-amber-100', title: 'Compartilhar Conquista', description: 'Celebra uma vitória académica ou prémio.' },
  { key: 'lesson', icon: PlayCircle, color: 'text-indigo-600 bg-indigo-100', title: 'Mini Aula', description: 'Gravações curtas para a tua comunidade.' },
]

const PRIVACY_OPTIONS = [
  { key: 'public', label: '🌍 Público', description: 'Todos na plataforma podem ver.' },
  { key: 'friends', label: '👥 Amigos', description: 'Só as tuas conexões veem.' },
  { key: 'university', label: '🎓 Colegas da universidade', description: 'Só estudantes da tua universidade.' },
  { key: 'private', label: '🔒 Apenas eu', description: 'História privada.' },
]

const GROUPS = [
  { key: 'programacao-web', label: 'Programação Web', joined: true },
  { key: 'banco-de-dados', label: 'Banco de Dados', joined: true },
  { key: 'calculo-i', label: 'Cálculo I', joined: false },
  { key: 'engenharia-civil', label: 'Engenharia Civil', joined: false },
]

export default function CreateStory() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [selectedMediaType, setSelectedMediaType] = useState(null)
  const [activeAction, setActiveAction] = useState('gallery')
  const [privacy, setPrivacy] = useState('public')
  const [selectedGroups, setSelectedGroups] = useState(() => GROUPS.filter(g => g.joined).map(g => g.key))

  const openFilePicker = (accept, type) => {
    setActiveAction(type)
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('video/') ? 'video' : 'image'
    setSelectedMedia({ url, type, name: file.name })
    setSelectedMediaType(type)
  }

  const toggleGroup = (key) => {
    setSelectedGroups(current =>
      current.includes(key)
        ? current.filter(item => item !== key)
        : [...current, key]
    )
  }

  const previewLabel = selectedMedia
    ? `${selectedMediaType === 'video' ? 'Pré-visualização de vídeo' : 'Pré-visualização de imagem'}`
    : activeAction === 'document'
    ? 'Adicionar documento acadêmico' : activeAction === 'text'
    ? 'Escrever texto rápido' : 'Adicionar foto ou vídeo'

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pb-32 pt-4">
        <header className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5 text-slate-900" />
          </button>
          <h1 className="text-lg font-semibold">Nova História</h1>
          <button className="px-4 py-2 rounded-2xl bg-[#2563EB] text-white text-sm font-semibold shadow-sm hover:bg-[#1d4ed8] transition-colors">
            Publicar
          </button>
        </header>

        <section className="relative mb-6">
          <div className="relative rounded-[20px] border border-neutral-200 bg-white shadow-sm overflow-hidden aspect-[4/5]">
            {selectedMedia ? (
              selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={selectedMedia.url} alt={selectedMedia.name} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 px-6 text-center text-slate-500">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                  <Camera className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Adicionar foto ou vídeo</p>
                  <p className="text-sm text-slate-500 mt-1">Arrasta a média ou escolhe uma opção abaixo.</p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="px-5 py-2.5 rounded-2xl"
                  onClick={() => openFilePicker('image/*,video/*', 'gallery')}
                >
                  Selecionar mídia
                </Button>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/90 to-transparent">
              <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-sm border border-neutral-200 text-sm text-slate-600">
                {previewLabel}
              </div>
            </div>

            <aside className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-3xl bg-white/95 border border-neutral-200 shadow-lg p-3 backdrop-blur-xl">
              <div className="flex flex-col items-center gap-3">
                {TOOLS.map(tool => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.key}
                      type="button"
                      className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-100 transition-colors"
                      aria-label={tool.label}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </section>

        {/* DEBUG: visual marker para confirmar renderização (remover após teste) */}
        <div className="mb-4">
          <div className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-medium">Página CreateStory montada — se não aparecer, há um erro de renderização</div>
        </div>

        <section className="overflow-x-auto pb-2 mb-6">
          <div className="inline-flex gap-3">
            {ACTIONS.map(action => {
              const Icon = action.icon
              const active = activeAction === action.key
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => {
                    if (action.key === 'camera') openFilePicker('image/*,video/*', action.key)
                    else if (action.key === 'gallery') openFilePicker('image/*,video/*', action.key)
                    else setActiveAction(action.key)
                  }}
                  className={`min-w-[100px] flex flex-col items-center gap-2 rounded-3xl border p-4 text-center transition-all duration-200 shadow-sm ${active ? 'border-[#2563EB] bg-white scale-[1.01]' : 'border-transparent bg-white/90 hover:bg-white'}`}
                >
                  <span className={`inline-flex p-3 rounded-3xl ${action.tint}`}> <Icon className="w-5 h-5" /> </span>
                  <span className="text-xs font-semibold text-slate-700">{action.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Compartilhar algo acadêmico</p>
              <p className="text-xs text-slate-500">Cria um story com foco na tua vida acadêmica.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ACADEMIC_CARDS.map(card => {
              const Icon = card.icon
              return (
                <button
                  key={card.key}
                  type="button"
                  className="group relative overflow-hidden rounded-[20px] border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-slate-900">{card.title}</p>
                    <p className="mt-1 text-xs text-slate-500 leading-5">{card.description}</p>
                  </div>
                  <ArrowRight className="absolute right-4 top-4 w-4 h-4 text-slate-300 transition group-hover:text-[#2563EB]" />
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-[20px] bg-gradient-to-r from-[#2563EB] via-[#4338ca] to-[#7c3aed] p-5 shadow-lg mb-6 text-white overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold">✨ Criar História com IA</p>
              <p className="mt-1 text-sm text-white/75">A IA cria uma história bonita a partir de uma ideia.</p>
            </div>
          </div>
          <div className="mt-5">
            <Button type="button" variant="primary" size="lg" className="bg-white text-[#2563EB] hover:bg-slate-100 shadow-md">
              Gerar com IA
            </Button>
          </div>
        </section>

        <section className="rounded-[20px] bg-white p-4 shadow-sm mb-6 border border-neutral-200">
          <p className="text-sm font-semibold text-slate-900 mb-3">Quem pode visualizar?</p>
          <div className="space-y-3">
            {PRIVACY_OPTIONS.map(option => (
              <button
                key={option.key}
                type="button"
                onClick={() => setPrivacy(option.key)}
                className={`w-full rounded-3xl border p-4 text-left transition-colors ${privacy === option.key ? 'border-[#2563EB] bg-slate-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{option.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 ${privacy === option.key ? 'border-[#2563EB] bg-[#2563EB]' : 'border-neutral-300 bg-white'}`}> {privacy === option.key && <div className="mx-auto mt-[2px] h-2 w-2 rounded-full bg-white" />} </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] bg-white p-4 shadow-sm border border-neutral-200 mb-20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Compartilhar também em grupos</p>
              <p className="text-xs text-slate-500">Escolha grupos relevantes para a sua história.</p>
            </div>
          </div>
          <div className="space-y-3">
            {GROUPS.map(group => (
              <button
                key={group.key}
                type="button"
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center justify-between gap-3 rounded-3xl border p-4 transition ${selectedGroups.includes(group.key) ? 'border-[#2563EB] bg-slate-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}
              >
                <div>
                  <p className="font-medium text-slate-900">{group.label}</p>
                </div>
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGroups.includes(group.key) ? 'border-[#2563EB] bg-[#2563EB]' : 'border-neutral-300 bg-white'}`}>
                  {selectedGroups.includes(group.key) ? <Plus className="w-3 h-3 text-white" /> : null}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-[#F8FAFC] px-4 py-4">
        <Button type="button" variant="primary" size="lg" fullWidth className="h-14 rounded-full">
          Publicar História
        </Button>
      </div>
    </div>
  )
}
