import { useState } from 'react'
import { Search, Upload, Download, BookOpen, X, FileText, ChevronDown, ChevronLeft } from 'lucide-react'
import { LIBRARY_DOCS, DOC_TYPES, UNIVERSITIES, COURSES } from '../data/mock'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import UserAvatar from '../components/ui/UserAvatar'
import UniversityTag from '../components/profile/UniversityTag'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'

const FORMAT_ICON = { PDF: '📄', PPT: '📊', DOC: '📝', default: '📎' }

function DocCard({ doc, onSave }) {
  const [saved, setSaved] = useState(doc.saved)
  const [myRating, setMyRating] = useState(0)

  function handleSave() {
    setSaved(s => !s)
    onSave?.(doc.id)
  }

  return (
    <Card className="p-4 flex flex-col gap-3" hover>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{FORMAT_ICON[doc.format] ?? FORMAT_ICON.default}</span>
          <div>
            <p className="font-semibold text-sm leading-tight text-neutral-900 dark:text-neutral-100">{doc.title}</p>
            <p className="text-xs text-neutral-500 dark:text-white">{doc.type} · {doc.format} · {doc.pages}p</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`text-lg transition-transform active:scale-90 ${saved ? 'text-accent-500' : 'text-neutral-300 dark:text-neutral-600'}`}
          aria-label={saved ? 'Remover dos guardados' : 'Guardar documento'}
        >
          ★
        </button>
      </div>

      <p className="text-xs text-neutral-600 dark:text-white line-clamp-2">{doc.description}</p>

      <div className="flex items-center gap-2">
        <UserAvatar name={doc.author.name} size="xs" />
        <span className="text-xs text-neutral-500">{doc.author.name}</span>
        <span className="text-neutral-300 dark:text-neutral-600">·</span>
        <span className="text-xs text-neutral-500">{doc.year}</span>
      </div>

      <UniversityTag university={doc.university} />

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-[#2a2a2a]">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => setMyRating(s)}
              className={`text-sm transition-colors ${s <= (myRating || Math.round(doc.rating)) ? 'text-accent-500' : 'text-neutral-300 dark:text-neutral-600'}`}
              aria-label={`Avaliar ${s} estrelas`}
            >
              ★
            </button>
          ))}
          <span className="text-xs text-neutral-500 ml-1">{doc.rating.toFixed(1)} ({doc.ratingCount})</span>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">
          <Download size={13} />
          {doc.downloads}
        </button>
      </div>
    </Card>
  )
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-sm transition-colors ${
          value
            ? 'border-primary-500 bg-primary-50 dark:bg-white/10 text-primary-600 dark:text-primary-400'
            : 'border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]'
        }`}
      >
        {value || label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-20 bg-white dark:bg-[#1e1e1e] border border-neutral-100 dark:border-[#2a2a2a] rounded-xl shadow-modal min-w-[180px] py-1 max-h-60 overflow-y-auto">
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-neutral-500"
          >
            Todos
          </button>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] ${value === opt ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Library() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [uniFilter, setUniFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const hasError = !Array.isArray(LIBRARY_DOCS)

  const filtered = LIBRARY_DOCS.filter(doc => {
    const q = search.toLowerCase()
    // Pesquisa inteligente: título, descrição, tipo, universidade, curso, autor
    const matchSearch = !q || 
      doc.title.toLowerCase().includes(q) || 
      doc.description.toLowerCase().includes(q) ||
      doc.type.toLowerCase().includes(q) ||
      doc.university.toLowerCase().includes(q) ||
      (doc.course && doc.course.toLowerCase().includes(q)) ||
      doc.author.name.toLowerCase().includes(q) ||
      doc.format.toLowerCase().includes(q)
    const matchType = !typeFilter || doc.type === typeFilter
    const matchUni = !uniFilter || doc.university === uniFilter
    const matchCourse = !courseFilter || doc.course === courseFilter
    return matchSearch && matchType && matchUni && matchCourse
  })

  const hasFilters = typeFilter || uniFilter || courseFilter

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white -ml-2">Biblioteca</h1>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Upload size={14} />
            Partilhar
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Pesquisar documentos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-3">
          <FilterDropdown label="Tipo" options={DOC_TYPES.filter(t => t !== 'Todos')} value={typeFilter} onChange={setTypeFilter} />
          <FilterDropdown label="Universidade" options={UNIVERSITIES} value={uniFilter} onChange={setUniFilter} />
          <FilterDropdown label="Curso" options={COURSES} value={courseFilter} onChange={setCourseFilter} />
          {hasFilters && (
            <button
              onClick={() => { setTypeFilter(''); setUniFilter(''); setCourseFilter('') }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <X size={12} /> Limpar
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-neutral-500 mb-3">
          {filtered.length} documento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Docs grid */}
        {hasError ? (
          <ErrorState
            scope="library.page"
            title="Erro ao carregar biblioteca"
            subtitle="Nao foi possivel carregar os documentos agora."
            meta={{ search, typeFilter, uniFilter, courseFilter }}
            onRetry={() => window.location.reload()}
          />
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map(doc => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📘"
            title="Nenhum documento encontrado"
            subtitle="Tenta ajustar os filtros ou sê o primeiro a partilhar!"
            action={
              <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                Partilhar documento
              </button>
            }
          />
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 animate-fade-in" onClick={() => setShowUpload(false)}>
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 shadow-modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-neutral-900 dark:text-white">Partilhar Documento</h2>
              <button onClick={() => setShowUpload(false)} className="text-neutral-400 dark:text-[#b0b3b8] hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="border-2 border-dashed border-neutral-200 dark:border-[#2a2a2a] rounded-xl p-8 flex flex-col items-center gap-2 text-neutral-400 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-white/5 transition-colors">
              <Upload size={28} />
              <p className="text-sm font-medium">Clica para seleccionar ficheiro</p>
              <p className="text-xs">PDF, PPT, DOC — máx. 20MB</p>
            </div>
            <button
              onClick={() => setShowUpload(false)}
              className="mt-4 w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Publicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
