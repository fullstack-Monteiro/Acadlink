import { useEffect, useState } from 'react'
import { Heart, MessageCircle, UserPlus, Briefcase, Bell, Check, X, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import UserAvatar from '../components/ui/UserAvatar'
import BackButton from '../components/layout/BackButton'
import EmptyState from '../components/ui/EmptyState'
import { useNotifications } from '../context/NotificationsContext'
import { useAuth } from '../context/AuthContext'

const ICON_CFG = {
  like:    { icon: Heart,         bg: 'bg-red-100 dark:bg-red-900/30',             color: 'text-red-500' },
  comment: { icon: MessageCircle, bg: 'bg-primary-100 dark:bg-white/10',           color: 'text-primary-600' },
  connect: { icon: UserPlus,      bg: 'bg-secondary-100 dark:bg-secondary-900/30', color: 'text-secondary-600' },
  opp:     { icon: Briefcase,     bg: 'bg-amber-100 dark:bg-amber-900/30',         color: 'text-amber-600' },
}

const TABS = [
  { key: 'all',     label: 'Tudo' },
  { key: 'like',    label: 'Reações' },
  { key: 'connect', label: 'Conexões' },
]

export default function Notifications() {
  const [notifs, setNotifs] = useState([])
  const [tab, setTab] = useState('all')
  const navigate = useNavigate()
  const { notifications, clearAll, decrement } = useNotifications()
  const { connectUser, disconnectUser } = useAuth()

  useEffect(() => {
    setNotifs(notifications || [])
  }, [notifications])

  const unread = notifs.filter(n => !n.read).length

  const markAll = () => { setNotifs(ns => ns.map(n => ({ ...n, read: true }))); clearAll() }

  const markOne = (id) => {
    const n = notifs.find(n => n.id === id)
    if (n && !n.read) decrement()
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const acceptConnect = (e, n) => {
    e.stopPropagation()
    connectUser(n.user.id)
    markOne(n.id)
    setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, pending: false, text: 'conectou-se contigo' } : x))
  }

  const declineConnect = (e, n) => {
    e.stopPropagation()
    disconnectUser(n.user.id)
    markOne(n.id)
    setNotifs(ns => ns.filter(x => x.id !== n.id))
  }

  const handleClick = (n) => {
    markOne(n.id)
    if (n.user) navigate(`/profile/${n.user.id}`)
  }

  const filtered = tab === 'all' ? notifs : notifs.filter(n =>
    n.type === tab || (tab === 'like' && n.type === 'comment')
  )

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
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white -ml-2">Notificações</h1>
          </div>
          {unread > 0 && (
            <button onClick={markAll} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              <Check className="w-3.5 h-3.5" /> Marcar todas
            </button>
          )}
        </div>

        {unread > 0 && <p className="text-sm text-neutral-500 dark:text-[#b0b3b8] mb-4">{unread} não lida{unread !== 1 ? 's' : ''}</p>}

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-4 pb-0.5">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                tab === t.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#2a2a2a] text-neutral-600 dark:text-neutral-400'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState icon="🔔" title="Sem notificações" subtitle="Quando tiveres actividade, aparece aqui." />
        ) : (
          <div className="space-y-1">
            {filtered.map(n => {
              const cfg = ICON_CFG[n.type]
              const Icon = cfg.icon
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl cursor-pointer transition-colors ${
                    n.read
                      ? 'bg-white dark:bg-[#1e1e1e] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]'
                      : 'bg-primary-50 dark:bg-white/5 hover:bg-primary-100 dark:hover:bg-white/10'
                  }`}
                >
                  {/* Avatar + ícone */}
                  <div className="relative flex-shrink-0">
                    {n.user
                      ? <UserAvatar name={n.user.name} size="md" />
                      : <div className={`w-11 h-11 rounded-full ${cfg.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                    }
                    {n.user && (
                      <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full ${cfg.bg} flex items-center justify-center border-2 border-white dark:border-[#1e1e1e]`}>
                        <Icon className={`w-2.5 h-2.5 ${cfg.color}`} />
                      </div>
                    )}
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
                      {n.user && <span className="font-semibold">{n.user.name} </span>}
                      {n.text}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-[#b0b3b8] mt-0.5">{n.time} atrás</p>

                    {/* Botões aceitar/recusar para pedidos de conexão pendentes */}
                    {n.type === 'connect' && n.pending && (
                      <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={e => acceptConnect(e, n)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                          <Check className="w-3 h-3" /> Aceitar
                        </button>
                        <button
                          type="button"
                          onClick={e => declineConnect(e, n)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 dark:bg-[#2a2a2a] hover:bg-neutral-200 dark:hover:bg-[#333] text-neutral-600 dark:text-neutral-400 text-xs font-semibold rounded-xl transition-colors"
                        >
                          <X className="w-3 h-3" /> Recusar
                        </button>
                      </div>
                    )}
                  </div>

                  {!n.read && <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
