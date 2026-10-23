import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

const TYPES = ['projecto', 'publicação', 'trabalho', 'certificado', 'outro']

const EMPTY = { title: '', type: 'projecto', year: '', description: '', links: [] }

export default function PortfolioModal({ item, onSave, onClose }) {
  const editing = !!item
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY, year: new Date().getFullYear().toString() })
  const [linkLabel, setLinkLabel] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const addLink = () => {
    if (!linkLabel.trim() || !linkUrl.trim()) return
    setForm(f => ({ ...f, links: [...f.links, { label: linkLabel.trim(), url: linkUrl.trim() }] }))
    setLinkLabel('')
    setLinkUrl('')
  }

  const removeLink = (i) => setForm(f => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Título obrigatório'
    if (!form.year.trim()) e.year = 'Ano obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-lg bg-white dark:bg-[#1e1e1e] rounded-t-3xl sm:rounded-2xl shadow-modal flex flex-col max-h-[90vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#3a3a3a]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-[#2a2a2a]">
          <span className="font-semibold text-sm text-neutral-900 dark:text-white">
            {editing ? 'Editar item' : 'Adicionar ao portfólio'}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

          {/* Tipo */}
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">Tipo</label>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                    form.type === t
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#333]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="Ex: Sistema de Gestão de Biblioteca"
              className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                errors.title ? 'border-red-400' : 'border-neutral-200 dark:border-[#2a2a2a]'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Ano */}
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">Ano *</label>
            <input
              type="text"
              value={form.year}
              onChange={set('year')}
              placeholder="2024"
              maxLength={4}
              className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                errors.year ? 'border-red-400' : 'border-neutral-200 dark:border-[#2a2a2a]'
              }`}
            />
            {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">Descrição</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Descreve o projecto, tecnologias usadas, impacto..."
              rows={3}
              className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] px-3 py-2.5 text-sm bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
            />
          </div>

          {/* Links */}
          <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">Links</label>
            {form.links.map((l, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-[#222222] rounded-xl border border-neutral-200 dark:border-[#2a2a2a]">
                  <span className="text-xs font-medium text-primary-600">{l.label}</span>
                  <span className="text-neutral-300 dark:text-neutral-600">·</span>
                  <span className="text-xs text-neutral-400 truncate">{l.url}</span>
                </div>
                <button onClick={() => removeLink(i)} className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Label (ex: GitHub)"
                value={linkLabel}
                onChange={e => setLinkLabel(e.target.value)}
                className="w-24 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] px-3 py-2 text-xs bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <input
                type="url"
                placeholder="https://..."
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addLink()}
                className="flex-1 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] px-3 py-2 text-xs bg-white dark:bg-[#222222] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button
                onClick={addLink}
                disabled={!linkLabel.trim() || !linkUrl.trim()}
                className="p-2 bg-neutral-100 dark:bg-[#2a2a2a] hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 text-neutral-500 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-[#2a2a2a] flex gap-2" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors">
            {editing ? 'Guardar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  )
}
