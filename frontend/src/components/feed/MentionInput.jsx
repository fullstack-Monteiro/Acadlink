import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALL_USERS } from '../../data/mock'

/**
 * Renderiza texto com @menções e #hashtags clicáveis
 */
export function MentionText({ text, className = '' }) {
  const navigate = useNavigate()
  if (!text) return null
  // split por @menções e #hashtags
  const parts = text.split(/([@#]\w[\w.]*)/g)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (/^@\w/.test(part)) {
          return <span key={i} className="text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:underline">{part}</span>
        }
        if (/^#\w/.test(part)) {
          return (
            <span
              key={i}
              className="text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:underline"
              onClick={e => { e.stopPropagation(); navigate(`/explore?q=${encodeURIComponent(part)}`) }}
            >
              {part}
            </span>
          )
        }
        return part
      })}
    </span>
  )
}

/**
 * Textarea com suporte a menções @
 * Props: value, onChange, onSubmit, placeholder, inputRef, rows
 */
export default function MentionInput({ value, onChange, onSubmit, placeholder, inputRef, rows = 1 }) {
  const [mentionQuery, setMentionQuery] = useState(null) // string após @
  const [mentionStart, setMentionStart] = useState(-1)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const dropdownRef = useRef(null)

  // Filtra utilizadores pelo query
  const suggestions = mentionQuery !== null
    ? ALL_USERS.filter(u =>
        u.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(mentionQuery.toLowerCase())
      ).slice(0, 5)
    : []

  const handleChange = (e) => {
    const val = e.target.value
    const cursor = e.target.selectionStart

    // Detecta se estamos a escrever uma menção
    const textBefore = val.slice(0, cursor)
    const match = textBefore.match(/@(\w[\w.]*)$/)
    const atMatch = textBefore.match(/@$/) // acabou de escrever @

    if (match) {
      setMentionQuery(match[1])
      setMentionStart(textBefore.lastIndexOf('@'))
      setSelectedIdx(0)
    } else if (atMatch) {
      setMentionQuery('')
      setMentionStart(textBefore.lastIndexOf('@'))
      setSelectedIdx(0)
    } else {
      setMentionQuery(null)
      setMentionStart(-1)
    }

    onChange(val)
  }

  const insertMention = (user) => {
    const before = value.slice(0, mentionStart)
    const after = value.slice(mentionStart + 1 + (mentionQuery?.length ?? 0))
    const newVal = `${before}@${user.username} ${after}`
    onChange(newVal)
    setMentionQuery(null)
    setMentionStart(-1)
    // foca e move cursor para depois da menção
    setTimeout(() => {
      if (inputRef?.current) {
        const pos = before.length + user.username.length + 2
        inputRef.current.focus()
        inputRef.current.setSelectionRange(pos, pos)
      }
    }, 0)
  }

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => (i + 1) % suggestions.length) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIdx(i => (i - 1 + suggestions.length) % suggestions.length) }
      if (e.key === 'Enter' && mentionQuery !== null) { e.preventDefault(); insertMention(suggestions[selectedIdx]); return }
      if (e.key === 'Escape') { setMentionQuery(null); return }
      if (e.key === 'Tab' && suggestions.length > 0) { e.preventDefault(); insertMention(suggestions[selectedIdx]); return }
    }
    if (e.key === 'Enter' && !e.shiftKey && mentionQuery === null) {
      e.preventDefault()
      onSubmit?.()
    }
  }

  // Fechar ao clicar fora
  useEffect(() => {
    if (mentionQuery === null) return
    const close = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setMentionQuery(null)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [mentionQuery])

  return (
    <div className="relative flex-1">
      <textarea
        ref={inputRef}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none resize-none leading-relaxed max-h-24 overflow-y-auto"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ fieldSizing: 'content' }}
      />

      {/* Dropdown de sugestões */}
      {suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full left-0 mb-1 w-56 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#2a2a2a] rounded-xl shadow-modal z-30 overflow-hidden animate-fade-in"
        >
          {suggestions.map((u, i) => (
            <button
              key={u.id}
              onMouseDown={e => { e.preventDefault(); insertMention(u) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                i === selectedIdx
                  ? 'bg-primary-50 dark:bg-white/10'
                  : 'hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-primary-500`}>
                {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{u.name}</p>
                <p className="text-xs text-neutral-400 truncate">@{u.username}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
