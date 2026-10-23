import { useNavigate } from 'react-router-dom'
import { X, UserPlus, UserCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import UserAvatar from '../ui/UserAvatar'
import VerificationBadge from './VerificationBadge'

export default function UsersListModal({ title, users, onClose }) {
  const { toggleConnect, isConnected } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-sm bg-white dark:bg-[#1e1e1e] rounded-t-3xl sm:rounded-2xl shadow-modal flex flex-col max-h-[70vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#3a3a3a]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-[#2a2a2a]">
          <span className="font-semibold text-sm text-neutral-900 dark:text-white">{title}</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {users.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">Nenhum utilizador para mostrar.</p>
          ) : users.map(u => (
            <div key={u.id} className="flex items-center gap-3">
              <button
                onClick={() => { onClose(); navigate(`/profile/${u.id}`) }}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <UserAvatar name={u.name} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{u.name}</p>
                    {u.verified && <VerificationBadge university={u.verifiedUniversity} showLabel={false} />}
                  </div>
                  <p className="text-xs text-neutral-400 truncate">@{u.username} · {u.course}</p>
                </div>
              </button>
              <button
                onClick={() => toggleConnect(u.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isConnected(u.id)
                    ? 'bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isConnected(u.id)
                  ? <><UserCheck className="w-3.5 h-3.5" /><span className="hidden sm:inline ml-1">Conectado</span></>
                  : <><UserPlus className="w-3.5 h-3.5" /><span className="hidden sm:inline ml-1">Conectar</span></>
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
