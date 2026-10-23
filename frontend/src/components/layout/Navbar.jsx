import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Compass, Film, Library, Bell, MessageCircle,
  Search, UsersRound, Bookmark, BriefcaseBusiness,
  Settings, CircleHelp, LockKeyhole, Info, LogOut, X, List,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useMessages } from '../../context/MessagesContext'
import UserAvatar from '../ui/UserAvatar'
import { stringifyUniversity } from '../../utils/university'

const NAV_ITEMS = [
  { to: '/dashboard', icon: Home,      label: 'Início'     },
  { to: '/explore',   icon: Compass,   label: 'Explorar'   },
  { to: '/reels',     icon: Film,      label: 'Reels'      },
  { to: '/library',   icon: Library,   label: 'Biblioteca' },
]

const NO_BACK_ROUTES = [
  '/dashboard', '/explore', '/groups', '/library',
  '/messages', '/profile', '/saved',
]

export default function Navbar() {
  const { user, logout }        = useAuth()
  const { dark }                = useTheme()
  const { unreadCount }         = useNotifications()
  const { convs }               = useMessages()
  const location                = useLocation()
  const navigate                = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ]   = useState('')
  const [isHidden, setIsHidden] = useState(false)
  const lastYRef                = useRef(0)
  const tickingRef              = useRef(false)
  const menuRef                 = useRef(null)

  const unreadMessages = convs?.reduce((t, c) => t + (c.unread || 0), 0) || 0

  const handleLogout = () => { logout(); navigate('/') }
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQ.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQ)}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  // Ocultar nas páginas de mensagens e notificações
  if (location.pathname === '/messages' || location.pathname === '/notifications') {
    return null
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setIsHidden(false)
    lastYRef.current = window.scrollY || 0

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      window.requestAnimationFrame(() => {
        const y     = window.scrollY || 0
        const delta = y - lastYRef.current
        if (y < 24)        setIsHidden(false)
        else if (delta > 8)  setIsHidden(true)
        else if (delta < -8) setIsHidden(false)
        lastYRef.current = y
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!menuOpen) return
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [menuOpen])

  return (
    <header
      className={`
        sticky top-0 z-50
        bg-white/80 dark:bg-[#1e1e1e]/80
        backdrop-blur-xl
        border-b border-neutral-200/70 dark:border-[#282828]
        transition-transform duration-250 ease-out
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/dashboard" className="flex items-center">
            <span className="font-bold text-xl tracking-tight">
              <span className="text-neutral-900 dark:text-white">Acad</span>
              <span className="text-[#1D6AFF]">link</span>
            </span>
          </Link>
        </div>

        {/* ── Search (desktop) ── */}
        <div className="hidden md:flex flex-1 max-w-xs relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#636366]" />
          <input
            type="text"
            placeholder="Pesquisar estudantes, posts..."
            className="
              w-full pl-9 pr-4 py-2 rounded-xl text-sm
              bg-neutral-100 dark:bg-[#282828]
              border border-transparent dark:border-transparent
              text-neutral-900 dark:text-[#f5f5f7]
              placeholder-neutral-400 dark:placeholder-[#636366]
              focus:outline-none focus:ring-2 focus:ring-[#1D6AFF]/50
              transition-all
            "
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* ── Nav links (desktop) ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-xl transition-all
                  ${active
                    ? 'bg-[#1D6AFF]/10 text-[#1D6AFF]'
                    : 'text-neutral-500 dark:text-[#aeaeb2] hover:bg-neutral-100 dark:hover:bg-[#282828]'
                  }
                `}
              >
                <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
              </Link>
            )
          })}
        </nav>

        {/* ── Ações direita ── */}
        <div className="flex items-center gap-0.5">

          {/* Search mobile */}
          <button
            onClick={() => setSearchOpen(s => !s)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-neutral-500 dark:text-[#aeaeb2] hover:bg-neutral-100 dark:hover:bg-[#282828] transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Notificações */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-neutral-500 dark:text-[#aeaeb2] hover:bg-neutral-100 dark:hover:bg-[#282828] transition-colors"
            aria-label="Notificações"
          >
            <Bell size={20} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Mensagens */}
          <button
            onClick={() => navigate('/messages')}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-neutral-500 dark:text-[#aeaeb2] hover:bg-neutral-100 dark:hover:bg-[#282828] transition-colors"
            aria-label="Mensagens"
          >
            <MessageCircle size={20} strokeWidth={1.8} />
            {unreadMessages > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-0.5">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </button>

          {/* Menu / Avatar */}
          <div className="relative ml-1" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#282828] transition-colors"
              aria-label="Menu"
            >
              {menuOpen
                ? <X size={20} className="text-neutral-600 dark:text-[#aeaeb2]" />
                : <List size={22} className="text-neutral-600 dark:text-[#aeaeb2]" />
              }
            </button>

            {menuOpen && (
              <div className="
                absolute right-0 top-11
                bg-white dark:bg-[#1e1e1e]
                border border-neutral-200 dark:border-[#282828]
                rounded-2xl shadow-xl dark:shadow-black/40
                z-50 py-1.5 min-w-[260px]
                animate-fade-in
              ">
                {/* Perfil mini */}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 border-b border-neutral-100 dark:border-[#282828] flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-[#282828] transition-colors"
                >
                  <UserAvatar name={user?.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-neutral-900 dark:text-[#f5f5f7] truncate">{user?.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-[#aeaeb2] truncate">{stringifyUniversity(user?.university)}</p>
                  </div>
                </Link>

                {/* Links principais */}
                <div className="py-1">
                  {[
                    { to: '/groups',       icon: UsersRound,       label: 'Grupos'           },
                    { to: '/saved',        icon: Bookmark,         label: 'Posts guardados'  },
                    { to: '/opportunities',icon: BriefcaseBusiness,label: 'Oportunidades'    },
                  ].map(({ to, icon: Icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-[#f5f5f7] hover:bg-neutral-50 dark:hover:bg-[#282828] transition-colors"
                    >
                      <Icon size={17} className="text-neutral-400 dark:text-[#aeaeb2]" />
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Secundários */}
                <div className="border-t border-neutral-100 dark:border-[#282828] py-1">
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-[#f5f5f7] hover:bg-neutral-50 dark:hover:bg-[#282828] transition-colors"
                  >
                    <Settings size={17} className="text-neutral-400 dark:text-[#aeaeb2]" /> Configurações
                  </Link>
                  {[
                    { icon: CircleHelp,  label: 'Ajuda e suporte' },
                    { icon: LockKeyhole, label: 'Privacidade'      },
                    { icon: Info,        label: 'Sobre o AcadLink' },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-700 dark:text-[#f5f5f7] hover:bg-neutral-50 dark:hover:bg-[#282828] transition-colors"
                    >
                      <Icon size={17} className="text-neutral-400 dark:text-[#aeaeb2]" /> {label}
                    </button>
                  ))}
                </div>

                {/* Sair */}
                <div className="border-t border-neutral-100 dark:border-[#282828] py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={17} /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search expandido (mobile) ── */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 animate-slide-up">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#636366]" />
            <input
              autoFocus
              type="text"
              placeholder="Pesquisar..."
              className="
                w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
                bg-neutral-100 dark:bg-[#282828]
                text-neutral-900 dark:text-[#f5f5f7]
                placeholder-neutral-400 dark:placeholder-[#636366]
                focus:outline-none focus:ring-2 focus:ring-[#1D6AFF]/50
                transition-all
              "
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      )}
    </header>
  )
}
