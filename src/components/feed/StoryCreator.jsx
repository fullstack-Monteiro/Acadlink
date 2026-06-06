import { useState, useRef } from 'react'
import { X, Plus } from 'lucide-react'
import UserAvatar from '../ui/UserAvatar'

export default function StoryCreator({ user, onClose, onShare }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImage({ url, file })
  }

  const handleShare = () => {
    // envia dados para o handler pai
    onShare && onShare({ text, image: image?.file })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0b0b0b] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-[#111]">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-0.5 bg-white/80">
              <UserAvatar name={user?.name} size="sm" />
            </div>
            <div>
              <p className="font-semibold text-sm">Criar história</p>
              <p className="text-xs text-neutral-500">Partilha algo rápido com os teus contactos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#111]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative w-full h-56 rounded-lg bg-neutral-100 dark:bg-[#111] overflow-hidden flex items-center justify-center">
            {image ? (
              <img src={image.url} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <button
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center gap-2 text-neutral-500"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#111] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm">Adicionar foto ou vídeo</span>
              </button>
            )}
            <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreve algo..."
            className="w-full min-h-[80px] p-3 rounded-md bg-neutral-50 dark:bg-[#080808] border border-neutral-100 dark:border-[#111] resize-none"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500">A tua história ficará visível durante 24h</div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-3 py-1 rounded-md border border-neutral-200 text-sm">Cancelar</button>
              <button onClick={handleShare} className="px-4 py-1 rounded-md bg-primary-600 text-white text-sm">Partilhar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
