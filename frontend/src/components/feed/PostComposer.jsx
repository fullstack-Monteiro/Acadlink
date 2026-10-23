import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import UserAvatar from '../ui/UserAvatar'

export default function PostComposer() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [postText, setPostText] = useState('')

  const handlePublish = () => {
    if (postText.trim()) {
      // Navegar para create-post com o texto
      navigate('/create-post', { state: { initialText: postText } })
    }
  }

  const handleCancel = () => {
    setExpanded(false)
    setPostText('')
  }

  const handleClick = () => {
    // Ao clicar, navega direto para criar publicação
    navigate('/create-post')
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 transition-all">
      {/* Input row */}
      <div className="flex items-center gap-3">
        <UserAvatar name={user?.name} size="sm" />
        {expanded ? (
          <div className="flex-1 space-y-3">
            <textarea
              autoFocus
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="O que estás a pensar?"
              rows={4}
              className="
                w-full px-4 py-2.5 rounded-xl text-sm resize-none
                bg-neutral-100 dark:bg-[#282828]
                text-neutral-800 dark:text-neutral-200
                placeholder-neutral-500 dark:placeholder-[#636366]
                focus:outline-none focus:ring-2 focus:ring-primary-500/50
                transition-all
              "
            />
            {/* Botões de ação */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#282828] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={!postText.trim()}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Publicar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleClick}
            className="
              flex-1 text-left px-4 py-3 rounded-xl text-sm
              bg-neutral-100 dark:bg-[#282828]
              text-neutral-500 dark:text-[#636366]
              hover:bg-neutral-200 dark:hover:bg-[#333333]
              transition-colors
            "
          >
            O que estás a pensar?
          </button>
        )}
      </div>
    </div>
  )
}
