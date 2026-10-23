import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Send, Sparkles, Image, Video, Type,
  Lightbulb, RotateCcw, Copy, Check, X, Plus, Paperclip, File,
} from 'lucide-react'
import UserAvatar from '../components/ui/UserAvatar'
import { useAuth } from '../context/AuthContext'

// ── Sugestões rápidas iniciais ───────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  { icon: Image,     label: 'Gerar ideia de imagem',  prompt: 'Dá-me uma ideia criativa para uma imagem de história académica.' },
  { icon: Video,     label: 'Ideia de vídeo curto',   prompt: 'Sugere um conceito para um vídeo curto de história académica.' },
  { icon: Type,      label: 'Texto criativo',         prompt: 'Cria um texto curto e criativo para uma história sobre a vida universitária.' },
  { icon: Lightbulb, label: 'Dica para o feed',       prompt: 'Dá-me uma dica de como tornar as minhas histórias mais envolventes para outros estudantes.' },
]

// ── Respostas simuladas da IA ─────────────────────────────────────────────────
const AI_RESPONSES = {
  default: [
    `Boa ideia! Aqui vai uma sugestão:\n\n**Título:** "A minha rotina de estudo"\n\nComeça com uma foto do teu espaço de estudo organizado, adiciona uma legenda motivacional como *"Cada hora de estudo é um passo mais perto do teu sonho"* e termina com os teus livros favoritos em destaque. Funciona muito bem para histórias académicas! 📚`,
    `Que tal esta ideia?\n\n**Conceito:** Mostra o "antes e depois" de um dia de testes — manhã ansiosa vs. tarde aliviada. É autêntico, os teus colegas vão identificar-se facilmente.\n\n**Dica:** Usa o filtro de luz natural para as fotos — transmite frescura e energia positiva. ✨`,
    `Perfeito para uma história!\n\n**Texto sugerido:**\n*"Há dias em que o campus parece pequeno demais para tantos sonhos grandes. Continua a caminhar."* 🎓\n\nCurto, poético e muito partilhável entre estudantes universitários.`,
    `Aqui tens 3 dicas para histórias mais envolventes:\n\n1. **Sê autêntico** — mostra os bastidores reais do teu dia académico\n2. **Usa texto curto** — máximo 2 linhas, directo ao ponto\n3. **Hora certa** — publica entre as 18h-21h para mais visualizações\n\nQuer que desenvolva alguma destas? 💡`,
  ],
  image: [
    `Aqui vai uma ideia visual para a tua história:\n\n📸 **Conceito: "Mesa de Estudo Flat Lay"**\n- Coloca os teus cadernos, canetas coloridas e um café no centro\n- Ângulo superior (bird's eye view)\n- Luz natural da janela à esquerda\n- Adiciona a legenda: *"O caos organizado de quem estuda com paixão"*\n\nEste tipo de conteúdo tem muito engagement entre estudantes! ✨`,
    `Ideia para imagem de história:\n\n🌅 **"Pôr do sol no campus"**\nFotografa o pôr do sol a partir de uma janela da universidade. Silhueta dos edifícios + céu cor de laranja = história perfeita.\n\nLegenda: *"Mais um dia de sonhos no forno"* 🎓`,
  ],
  video: [
    `Conceito de vídeo curto (15-30 segundos):\n\n🎬 **"A minha manhã de universitário"**\n1. 0-5s: Alarme a tocar, mão a desligar\n2. 5-12s: Time-lapse de preparar a mochila\n3. 12-20s: Caminho até à sala de aulas\n4. 20-30s: Abrir o caderno — pronto para aprender!\n\nUsa música motivacional de fundo. Simples, autêntico e muito relatable! 🎵`,
    `Ideia de vídeo rápido:\n\n⚡ **"Antes vs. Depois dos testes"**\n- Split screen: manhã stressada / tarde descontraída\n- Duração: 20 segundos\n- Áudio: transição de música tensa → música alegre\n\nEste formato tem altíssimo engagement! 🔥`,
  ],
  text: [
    `Aqui tens 3 textos prontos a usar:\n\n**Opção 1 (Motivacional):**\n*"Cada página que viras é uma vitória. Não pares."*\n\n**Opção 2 (Humor):**\n*"Modo: estudar às 23h e convencer-me que sou produtivo."*\n\n**Opção 3 (Reflexivo):**\n*"A universidade não te ensina apenas a matéria. Ensina-te a ti mesmo."*\n\nQual preferes? Posso personalizar! ✍️`,
  ],
  tip: [
    `5 dicas para histórias que prendem atenção:\n\n✅ **1. Primeiros 2 segundos** — captura atenção logo no início\n✅ **2. Texto visível** — contraste alto, letra grande\n✅ **3. Consistência** — publica a horas regulares\n✅ **4. CTA** — termina com uma pergunta ou "Desliza para ver mais"\n✅ **5. Autenticidade** — o imperfeito é mais real e mais partilhado\n\nQuer dicas específicas para algum tipo de conteúdo? 🎯`,
  ],
}

function getAIResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('imagem') || lower.includes('foto') || lower.includes('image')) {
    return AI_RESPONSES.image[Math.floor(Math.random() * AI_RESPONSES.image.length)]
  }
  if (lower.includes('vídeo') || lower.includes('video')) {
    return AI_RESPONSES.video[Math.floor(Math.random() * AI_RESPONSES.video.length)]
  }
  if (lower.includes('texto') || lower.includes('legenda') || lower.includes('frase')) {
    return AI_RESPONSES.text[Math.floor(Math.random() * AI_RESPONSES.text.length)]
  }
  if (lower.includes('dica') || lower.includes('conselho') || lower.includes('tip')) {
    return AI_RESPONSES.tip[Math.floor(Math.random() * AI_RESPONSES.tip.length)]
  }
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)]
}

// ── Componente de bolha de mensagem ──────────────────────────────────────────
function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(msg.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Render simples de markdown básico (negrito, itálico, listas)
  const renderText = (text) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      // Linha vazia
      if (!line.trim()) return <div key={i} className="h-2" />

      // Negrito **text**
      const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={j} className="italic">{part.slice(1, -1)}</em>
        }
        return part
      })

      return <p key={i} className="leading-relaxed">{parts}</p>
    })
  }

  if (msg.role === 'user') {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[78%]">
          {/* Ficheiros anexados */}
          {msg.files && msg.files.length > 0 && (
            <div className="mb-2 space-y-1.5">
              {msg.files.map((file, i) => {
                const isImage = file.type.startsWith('image/')
                const isVideo = file.type.startsWith('video/')
                return (
                  <div key={i} className="bg-[#1d4ed8] rounded-xl overflow-hidden">
                    {isImage ? (
                      <img src={file.url} alt={file.name} className="w-full h-auto max-h-48 object-cover" />
                    ) : isVideo ? (
                      <video src={file.url} controls className="w-full h-auto max-h-48" />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2">
                        <File className="w-4 h-4 text-white flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{file.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          {/* Texto */}
          {msg.text && (
            <div className="bg-[#2563EB] text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed">
              {msg.text}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5 mb-4">
      {/* Avatar IA */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7c3aed] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-white dark:bg-[#1c1c1e] border border-neutral-100 dark:border-[#2c2c2e] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-neutral-800 dark:text-[#f5f5f7] shadow-sm max-w-[85%]">
          <div className="space-y-0.5">{renderText(msg.text)}</div>
        </div>

        {/* Acções da mensagem */}
        <div className="flex items-center gap-2 mt-1.5 ml-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-[#636366] hover:text-neutral-600 dark:hover:text-[#aeaeb2] transition-colors"
          >
            {copied
              ? <><Check className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">Copiado</span></>
              : <><Copy className="w-3 h-3" /><span>Copiar</span></>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Indicador de digitação ────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7c3aed] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-[#1c1c1e] border border-neutral-100 dark:border-[#2c2c2e] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-[#48484a]"
              style={{ animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function StoryAIChat() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: `Olá${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋\n\nSou o teu assistente de histórias. Posso ajudar-te a criar **ideias para imagens**, **conceitos de vídeo**, **textos criativos** e **dicas** para tornares as tuas histórias mais envolventes.\n\nO que queres criar hoje?`,
    },
  ])
  const [input, setInput]       = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const fileInputRef = useRef(null)
  const attachMenuRef = useRef(null)

  // Scroll automático para o fim
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Fechar menu de anexar ao clicar fora
  useEffect(() => {
    if (!showAttachMenu) return
    const handler = (e) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setShowAttachMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showAttachMenu])

  const sendMessage = (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed && attachedFiles.length === 0) return

    // Criar mensagem do utilizador
    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      text: trimmed || '📎 Ficheiro(s) anexado(s)',
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setAttachedFiles([])
    setIsTyping(true)

    // Simular delay de resposta da IA (800-1800ms)
    const delay = 800 + Math.random() * 1000
    setTimeout(() => {
      let aiResponse = getAIResponse(trimmed)
      
      // Se há ficheiros anexados, personalizar resposta
      if (userMsg.files && userMsg.files.length > 0) {
        const fileTypes = userMsg.files.map(f => {
          if (f.type.startsWith('image/')) return 'imagem'
          if (f.type.startsWith('video/')) return 'vídeo'
          return 'documento'
        })
        const uniqueTypes = [...new Set(fileTypes)].join(' e ')
        aiResponse = `Recebi ${userMsg.files.length === 1 ? 'o teu' : 'os teus'} ${userMsg.files.length} ficheiro(s) (${uniqueTypes})!\n\n` + 
                     `Vou analisar e dar-te sugestões criativas. Aqui está o que posso fazer:\n\n` +
                     aiResponse
      }
      
      const aiMsg = { id: Date.now() + 1, role: 'ai', text: aiResponse }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, delay)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validar tipo e tamanho
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type.startsWith('video/') ||
                         file.type === 'application/pdf' ||
                         file.type.includes('document')
      const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB max
      return isValidType && isValidSize
    })

    if (validFiles.length > 0) {
      const fileData = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }))
      setAttachedFiles(prev => [...prev, ...fileData])
    }
    
    // Reset input
    e.target.value = ''
  }

  const openFileSelector = (type) => {
    setShowAttachMenu(false)
    if (!fileInputRef.current) return
    
    // Definir accept baseado no tipo
    switch (type) {
      case 'image':
        fileInputRef.current.accept = 'image/*'
        break
      case 'video':
        fileInputRef.current.accept = 'video/*'
        break
      case 'document':
        fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.ppt,.pptx'
        break
      default:
        fileInputRef.current.accept = '*'
    }
    
    fileInputRef.current.click()
  }

  const removeAttachedFile = (index) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev]
      // Revogar URL do objecto
      if (newFiles[index].url) {
        URL.revokeObjectURL(newFiles[index].url)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'ai',
      text: `Chat limpo! Começa uma nova conversa. O que queres criar? ✨`,
    }])
  }

  return (
    <div className="flex flex-col h-[100vh] h-[100dvh] bg-[#F8FAFC] dark:bg-[#111113] overflow-hidden">
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-[#1c1c1e] border-b border-neutral-100 dark:border-[#2c2c2e] shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-1 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2c2c2e] text-neutral-600 dark:text-[#aeaeb2] transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Avatar IA */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7c3aed] flex items-center justify-center shadow-sm flex-shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-white">Assistente de Histórias</p>
          <p className="text-xs text-emerald-500 font-medium">Online · pronto para criar</p>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2c2c2e] text-neutral-400 dark:text-[#636366] transition-colors"
          title="Limpar conversa"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </header>

      {/* ── Mensagens ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* Lista de mensagens */}
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* Indicador de digitação */}
        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 bg-white dark:bg-[#1c1c1e] border-t border-neutral-100 dark:border-[#2c2c2e] z-50">
        
        {/* Pré-visualização de ficheiros anexados */}
        {attachedFiles.length > 0 && (
          <div className="px-4 pt-3 pb-2 border-b border-neutral-100 dark:border-[#2c2c2e]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {attachedFiles.map((file, i) => {
                const isImage = file.type.startsWith('image/')
                const isVideo = file.type.startsWith('video/')
                return (
                  <div key={i} className="relative flex-shrink-0 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#2c2c2e] border border-neutral-200 dark:border-[#3a3a3c]">
                      {isImage ? (
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      ) : isVideo ? (
                        <video src={file.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <File className="w-6 h-6 text-neutral-400 dark:text-[#636366]" />
                          <p className="text-[9px] text-neutral-400 dark:text-[#636366] mt-0.5 px-1 text-center truncate w-full">
                            {file.name.split('.').pop()?.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Botão remover */}
                    <button
                      onClick={() => removeAttachedFile(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remover"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-[#636366] mt-1">
              {attachedFiles.length} ficheiro{attachedFiles.length !== 1 ? 's' : ''} anexado{attachedFiles.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Campo de input */}
        <div className="px-4 py-3">
          <div className="flex items-end gap-2.5">
            
            {/* Botão anexar com menu */}
            <div ref={attachMenuRef} className="relative flex-shrink-0">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  showAttachMenu
                    ? 'bg-[#2563EB]/10 text-[#2563EB]'
                    : 'text-neutral-400 dark:text-[#636366] hover:text-[#2563EB] hover:bg-[#2563EB]/10'
                }`}
                aria-label="Anexar ficheiro"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Menu de opções */}
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-44 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-neutral-200 dark:border-[#2c2c2e] shadow-xl overflow-hidden animate-fade-in">
                  <button
                    onClick={() => openFileSelector('image')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2c2c2e] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                      <Image className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">Imagem</p>
                      <p className="text-xs text-neutral-400 dark:text-[#636366]">JPG, PNG, GIF</p>
                    </div>
                  </button>

                  <div className="h-px bg-neutral-100 dark:bg-[#2c2c2e]" />

                  <button
                    onClick={() => openFileSelector('video')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2c2c2e] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                      <Video className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">Vídeo</p>
                      <p className="text-xs text-neutral-400 dark:text-[#636366]">MP4, MOV, AVI</p>
                    </div>
                  </button>

                  <div className="h-px bg-neutral-100 dark:bg-[#2c2c2e]" />

                  <button
                    onClick={() => openFileSelector('document')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2c2c2e] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <File className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">Documento</p>
                      <p className="text-xs text-neutral-400 dark:text-[#636366]">PDF, DOC, TXT</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center bg-neutral-50 dark:bg-[#2c2c2e] border border-neutral-200 dark:border-[#3a3a3c] rounded-2xl px-4 py-3 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20 transition-all min-h-[44px]">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pede uma ideia, texto, dica…"
                className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-[#f5f5f7] placeholder-neutral-400 dark:placeholder-[#636366] outline-none"
              />
            </div>

            {/* Botão enviar */}
            <button
              onClick={() => sendMessage()}
              disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                (input.trim() || attachedFiles.length > 0) && !isTyping
                  ? 'bg-[#2563EB] text-white shadow-md hover:bg-[#1d4ed8] active:scale-95'
                  : 'bg-neutral-100 dark:bg-[#2c2c2e] text-neutral-300 dark:text-[#48484a] cursor-not-allowed'
              }`}
              aria-label="Enviar"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input de ficheiro oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  )
}
