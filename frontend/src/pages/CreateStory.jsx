import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  Image,
  Video,
  Smile,
  Edit3,
  PenTool,
  MapPin,
  Music,
  Link2,
  ChevronLeft,
  Sparkles,
  Plus,
  Globe2,
  Users,
  GraduationCap,
  Lock,
  ShieldCheck,
  X,
  AlertTriangle,
  Settings,
  Check,
  Type,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const ACTIONS = [
  { key: 'camera',  icon: Camera, label: 'Câmera',  tint: 'bg-sky-100 text-sky-700' },
  { key: 'gallery', icon: Image,  label: 'Galeria',  tint: 'bg-indigo-100 text-indigo-700' },
  { key: 'video',   icon: Video,  label: 'Vídeo',    tint: 'bg-violet-100 text-violet-700' },
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


const PRIVACY_OPTIONS = [
  { key: 'public', icon: Globe2, label: 'Público', description: 'Todos na plataforma podem ver.' },
  { key: 'friends', icon: Users, label: 'Amigos', description: 'Só as tuas conexões veem.' },
  { key: 'university', icon: GraduationCap, label: 'Colegas da universidade', description: 'Só estudantes da tua universidade.' },
  { key: 'private', icon: Lock, label: 'Apenas eu', description: 'História privada.' },
]

const GROUPS = [
  { key: 'programacao-web', label: 'Programação Web', joined: true },
  { key: 'banco-de-dados', label: 'Banco de Dados', joined: true },
  { key: 'calculo-i', label: 'Cálculo I', joined: false },
  { key: 'engenharia-civil', label: 'Engenharia Civil', joined: false },
]

// ── Modal de permissão de câmera ─────────────────────────────────────────────
function CameraPermissionModal({ status, onAllow, onDeny, onClose }) {
  // status: 'prompt' | 'denied' | 'requesting'
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl">

        {status === 'denied' ? (
          /* ── Estado: acesso negado ── */
          <>
            <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Acesso à câmera bloqueado
              </h2>
              <p className="text-sm text-neutral-500 dark:text-[#aeaeb2] leading-relaxed">
                Bloqueaste o acesso à câmera. Para activá-la, vai às definições do teu browser e permite o acesso à câmera para este site.
              </p>
            </div>
            <div className="flex flex-col gap-2 px-6 pb-6">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-neutral-100 dark:bg-[#2c2c2e] text-neutral-700 dark:text-white text-sm font-semibold hover:bg-neutral-200 dark:hover:bg-[#3a3a3c] transition-colors"
              >
                Fechar
              </button>
            </div>
          </>
        ) : (
          /* ── Estado: pedir permissão ── */
          <>
            {/* Ícone animado */}
            <div className="flex flex-col items-center text-center px-6 pt-8 pb-2">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-3xl bg-[#1877F2]/10 dark:bg-[#1877F2]/20 flex items-center justify-center">
                  <Camera className="w-9 h-9 text-[#1877F2]" />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Permitir acesso à câmera
              </h2>
              <p className="text-sm text-neutral-500 dark:text-[#aeaeb2] leading-relaxed">
                O AcadLink precisa de acesso à câmera para tirares fotos e gravares vídeos para a tua história.
              </p>
            </div>

            {/* Itens de garantia */}
            <div className="mx-6 my-4 rounded-2xl bg-neutral-50 dark:bg-[#2c2c2e] divide-y divide-neutral-100 dark:divide-[#3a3a3c]">
              {[
                'A câmera só é usada quando estás nesta página.',
                'Nunca gravamos sem o teu conhecimento.',
                'Podes revogar o acesso nas definições a qualquer momento.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-[#aeaeb2] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Acções */}
            <div className="flex flex-col gap-2 px-6 pb-6">
              <button
                onClick={onAllow}
                disabled={status === 'requesting'}
                className="w-full py-3.5 rounded-2xl bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#1565d8] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === 'requesting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    A pedir permissão…
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Permitir acesso
                  </>
                )}
              </button>
              <button
                onClick={onDeny}
                className="w-full py-3 text-sm font-medium text-neutral-500 dark:text-[#636366] hover:text-neutral-700 dark:hover:text-[#aeaeb2] transition-colors"
              >
                Agora não
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Drawer de configurações da história ──────────────────────────────────────
function StorySettingsDrawer({ open, onClose, privacy, setPrivacy, selectedGroups, toggleGroup, onOpenAI }) {
  // Fechar ao clicar no backdrop
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const privacySelected = PRIVACY_OPTIONS.find(o => o.key === privacy)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
          onPointerDown={handleBackdrop}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#1c1c1e] rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '88vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#3a3a3c]" />
        </div>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-[#2c2c2e]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Configurações da história</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2c2c2e] text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="overflow-y-auto pb-8" style={{ maxHeight: 'calc(88vh - 80px)' }}>

          {/* ── Secção: Quem pode visualizar ── */}
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs font-semibold text-neutral-400 dark:text-[#636366] uppercase tracking-wider mb-3">
              Privacidade
            </p>
            <div className="space-y-2">
              {PRIVACY_OPTIONS.map(({ icon: Icon, ...option }) => {
                const isSelected = privacy === option.key
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setPrivacy(option.key)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]/5 dark:bg-[#2563EB]/10'
                        : 'border-neutral-100 dark:border-[#2c2c2e] bg-neutral-50 dark:bg-[#2c2c2e] hover:border-neutral-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-[#2563EB] text-white' : 'bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-500 dark:text-[#aeaeb2]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-semibold ${isSelected ? 'text-[#2563EB]' : 'text-slate-900 dark:text-white'}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-[#636366] mt-0.5">{option.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 my-1 h-px bg-neutral-100 dark:bg-[#2c2c2e]" />

          {/* ── Secção: Partilhar em grupos ── */}
          <div className="px-5 pt-4 pb-3">
            <p className="text-xs font-semibold text-neutral-400 dark:text-[#636366] uppercase tracking-wider mb-3">
              Partilhar também em grupos
            </p>
            <div className="space-y-2">
              {GROUPS.map(group => {
                const isSelected = selectedGroups.includes(group.key)
                return (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]/5 dark:bg-[#2563EB]/10'
                        : 'border-neutral-100 dark:border-[#2c2c2e] bg-neutral-50 dark:bg-[#2c2c2e] hover:border-neutral-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-[#2563EB] text-white' : 'bg-neutral-100 dark:bg-[#3a3a3c] text-neutral-500 dark:text-[#aeaeb2]'
                    }`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <p className={`flex-1 text-left text-sm font-semibold ${isSelected ? 'text-[#2563EB]' : 'text-slate-900 dark:text-white'}`}>
                      {group.label}
                    </p>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 my-1 h-px bg-neutral-100 dark:bg-[#2c2c2e]" />

          {/* ── Secção: Criar com IA ── */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold text-neutral-400 dark:text-[#636366] uppercase tracking-wider mb-3">
              Ferramentas
            </p>
            <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#4338ca] to-[#7c3aed] p-4 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">Criar com IA</p>
                  <p className="text-xs text-white/70">Gera uma história a partir de uma ideia</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAI}
                className="w-full py-2.5 rounded-xl bg-white text-[#2563EB] text-sm font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Gerar com IA
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default function CreateStory() {
  const navigate = useNavigate()
  const fileInputRef   = useRef(null)
  const cameraInputRef = useRef(null)
  const toolsRef = useRef(null)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [selectedMediaType, setSelectedMediaType] = useState(null)
  const [activeAction, setActiveAction] = useState('gallery')
  const [privacy, setPrivacy] = useState('public')
  const [selectedGroups, setSelectedGroups] = useState(() => GROUPS.filter(g => g.joined).map(g => g.key))
  const [showTools, setShowTools] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [storyText, setStoryText] = useState('')
  const [textColor, setTextColor] = useState('#ffffff')
  const [textBg, setTextBg] = useState('bg-transparent')
  const [textPosition, setTextPosition] = useState('center') // 'top', 'center', 'bottom'
  // 'idle' | 'prompt' | 'requesting' | 'denied'
  const [cameraPermission, setCameraPermission] = useState('idle')

  const TEXT_COLORS = ['#ffffff', '#111113', '#1877F2', '#F33E58', '#F7B125', '#22c55e']
  const TEXT_BGS = [
    { key: 'bg-transparent', label: 'Sem fundo' },
    { key: 'bg-black/50',    label: 'Escuro' },
    { key: 'bg-white/70',    label: 'Claro' },
    { key: 'bg-[#1877F2]/80',label: 'Azul' },
  ]

  // Fechar menu de ferramentas ao clicar fora
  useEffect(() => {
    if (!showTools) return
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setShowTools(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showTools])

  // Limpar estado quando texto for completamente apagado
  useEffect(() => {
    if (storyText.trim() === '') {
      // Manter vazio mas sem resetar
    }
  }, [storyText])

  // ── Câmera ──────────────────────────────────────────────────────────────────

  // Ao clicar no botão câmera: mostrar modal de permissão
  const handleCameraClick = async () => {
    setActiveAction('camera')

    // Verificar se já temos permissão via Permissions API (quando disponível)
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'camera' })
        if (result.state === 'granted') {
          // Já tem permissão — abre directamente
          openCameraInput()
          return
        }
        if (result.state === 'denied') {
          setCameraPermission('denied')
          return
        }
      } catch {
        // Permissions API não suportada — mostrar modal na mesma
      }
    }

    // Mostrar modal de pedido de permissão
    setCameraPermission('prompt')
  }

  // Utilizador clicou "Permitir" no modal
  const handleAllowCamera = async () => {
    setCameraPermission('requesting')
    try {
      // Pedir acesso real ao browser/SO
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      // Sucesso — parar o stream imediatamente (só precisávamos da permissão)
      stream.getTracks().forEach(t => t.stop())
      setCameraPermission('idle')
      openCameraInput()
    } catch (err) {
      // Negado pelo utilizador ou indisponível
      setCameraPermission('denied')
    }
  }

  // Abrir input de ficheiro com capture=environment
  const openCameraInput = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

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
    : 'Adicionar foto ou vídeo'

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
          
          {/* Botão de configurações (ícone apenas) */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5 text-slate-900" />
          </button>
        </header>

        {/* Botões de acção (Câmera, Galeria, Vídeo, Ferramentas) - acima do preview */}
        <section className="flex items-center justify-center gap-4 mb-4">
          {ACTIONS.map(action => {
            const Icon = action.icon
            const active = activeAction === action.key
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => {
                  if (action.key === 'camera') handleCameraClick()
                  else if (action.key === 'gallery') openFilePicker('image/*,video/*', action.key)
                  else setActiveAction(action.key)
                }}
                className={`flex flex-col items-center gap-1.5 transition-all ${
                  active ? 'scale-110' : 'hover:scale-105'
                }`}
                aria-label={action.label}
              >
                <div className={`w-14 h-14 rounded-2xl ${action.tint} flex items-center justify-center shadow-sm ${
                  active ? 'shadow-md ring-2 ring-offset-2 ring-[#2563EB]' : ''
                }`}>
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-300">{action.label}</span>
              </button>
            )
          })}

          {/* Botão de ferramentas (+) */}
          <div ref={toolsRef} className="relative flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowTools(o => !o)}
              className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center transition-all ${
                showTools
                  ? 'bg-slate-800 text-white rotate-45 shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              aria-label="Ferramentas"
              aria-expanded={showTools}
            >
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </button>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-300">Mais</span>

            {/* Menu de ferramentas */}
            {showTools && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200 shadow-xl p-1.5 animate-fade-in z-30">
                {TOOLS.map(tool => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.key}
                      type="button"
                      onClick={() => {
                        setShowTools(false)
                        // Implementar acção de cada ferramenta
                        if (tool.key === 'text') {
                          setStoryText(' ')
                        } else if (tool.key === 'emoji') {
                          // Adicionar emoji picker (futuro)
                          alert('Emoji picker - em breve!')
                        } else if (tool.key === 'draw') {
                          alert('Ferramenta de desenho - em breve!')
                        } else if (tool.key === 'sticker') {
                          alert('Stickers - em breve!')
                        } else if (tool.key === 'location') {
                          alert('Adicionar localização - em breve!')
                        } else if (tool.key === 'music') {
                          alert('Adicionar música - em breve!')
                        } else if (tool.key === 'link') {
                          const url = prompt('Cole o link:')
                          if (url) {
                            setStoryText(prev => prev ? `${prev}\n${url}` : url)
                          }
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                      aria-label={tool.label}
                    >
                      <Icon className="w-4 h-4 text-slate-700 dark:text-slate-400 flex-shrink-0" />
                      {tool.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="relative mb-4">
          <div className="relative rounded-[20px] border border-neutral-200 bg-white shadow-sm overflow-hidden aspect-video max-h-[320px]">

            {/* ── Fundo: média ou gradiente de texto ── */}
            {selectedMedia ? (
              selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} className="absolute inset-0 w-full h-full object-contain bg-black" />
              ) : (
                <img src={selectedMedia.url} alt={selectedMedia.name} className="absolute inset-0 w-full h-full object-contain" />
              )
            ) : (
              /* Fundo vazio — placeholder ou gradiente quando só texto */
              <div className={`absolute inset-0 ${storyText ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' : 'bg-white'}`} />
            )}

            {/* ── Campo de texto sobreposto ── */}
            <div className={`absolute inset-x-0 flex p-4 z-10 ${
              textPosition === 'top' ? 'top-0 pt-8' :
              textPosition === 'bottom' ? 'bottom-0 pb-8' :
              'inset-y-0 items-center'
            } justify-center`}>
              {storyText !== '' ? (
                /* Textarea quando há texto */
                <div className={`w-full max-w-md rounded-2xl px-4 py-3 ${storyText && !selectedMedia ? '' : textBg}`}>
                  <textarea
                    value={storyText}
                    onChange={e => setStoryText(e.target.value)}
                    placeholder={selectedMedia ? 'Adicionar texto…' : 'Escreve a tua história…'}
                    rows={2}
                    maxLength={200}
                    autoFocus
                    className={`w-full bg-transparent outline-none resize-none text-center font-bold text-lg md:text-xl leading-snug placeholder-white/40 ${
                      selectedMedia ? '' : 'text-white'
                    }`}
                    style={{ color: selectedMedia ? textColor : textColor }}
                  />
                  <p className="text-right text-[10px] text-white/40 mt-1">{storyText.length}/200</p>
                </div>
              ) : selectedMedia ? (
                /* Indicador para adicionar texto quando há média */
                <button
                  type="button"
                  onClick={() => setStoryText(' ')}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 hover:bg-white text-slate-700 text-sm font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <Type className="w-4.5 h-4.5" />
                  <span>Toca para adicionar texto</span>
                </button>
              ) : (
                /* Estado inicial — sem média e sem texto */
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shadow-inner">
                    <Camera className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-slate-700">Adicionar conteúdo</p>
                    <p className="text-xs text-slate-400 mt-1">Escolhe câmera, galeria ou vídeo acima.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Seletor de cor do texto (visível quando há texto) ── */}
            {storyText && (
              <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                {/* Cores */}
                <div className="flex flex-col gap-1.5">
                  {TEXT_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTextColor(c)}
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-transform ${
                        textColor === c ? 'scale-125 border-white' : 'border-white/40 hover:scale-110'
                      }`}
                      style={{ background: c }}
                      aria-label={`Cor ${c}`}
                    />
                  ))}
                </div>

                {/* Divisor */}
                <div className="h-px bg-white/20 mx-1" />

                {/* Posições */}
                <div className="flex flex-col gap-1.5">
                  {[
                    { key: 'top', icon: '↑', label: 'Topo' },
                    { key: 'center', icon: '•', label: 'Centro' },
                    { key: 'bottom', icon: '↓', label: 'Baixo' }
                  ].map(pos => (
                    <button
                      key={pos.key}
                      type="button"
                      onClick={() => setTextPosition(pos.key)}
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                        textPosition === pos.key 
                          ? 'bg-white text-slate-900 scale-125' 
                          : 'bg-white/20 text-white hover:bg-white/30 hover:scale-110'
                      }`}
                      aria-label={pos.label}
                    >
                      {pos.icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Botão limpar texto ── */}
            {storyText && (
              <button
                type="button"
                onClick={() => setStoryText('')}
                className="absolute top-2 md:top-3 right-2 md:right-3 z-20 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Remover texto"
              >
                <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            )}

          </div>

          {/* inputs ocultos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </section>


        {/* Botão fixo de publicar no bottom */}
        <Button type="button" variant="primary" size="lg" fullWidth className="h-14 rounded-full">
          Publicar História
        </Button>
      </div>

      {/* Modal de permissão de câmera */}
      {(cameraPermission === 'prompt' || cameraPermission === 'requesting' || cameraPermission === 'denied') && (
        <CameraPermissionModal
          status={cameraPermission}
          onAllow={handleAllowCamera}
          onDeny={() => setCameraPermission('idle')}
          onClose={() => setCameraPermission('idle')}
        />
      )}

      {/* Drawer de configurações */}
      <StorySettingsDrawer
        open={showSettings}
        onClose={() => setShowSettings(false)}
        privacy={privacy}
        setPrivacy={setPrivacy}
        selectedGroups={selectedGroups}
        toggleGroup={toggleGroup}
        onOpenAI={() => { setShowSettings(false); navigate('/create-story/ai') }}
      />
    </div>
  )
}
