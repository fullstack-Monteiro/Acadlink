import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, Users, MessageCircle, Bell, LogOut, Bookmark, Search, Settings, Menu, X, BookOpen, Briefcase, HelpCircle, Shield, Info, Film } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useMessages } from '../../context/MessagesContext'
import UserAvatar from '../ui/UserAvatar'
import { stringifyUniversity } from '../../utils/university'

const NAV_ITEMS = [
  { to: '/dashboard',     icon: Home,     label: 'Início' },
  { to: '/explore',       icon: Users,    label: 'Conexões' },
  { to: '/reels',         icon: Film,     label: 'Reels' },
  { to: '/library',       icon: BookOpen, label: 'Biblioteca' },
]

// Páginas principais de navegação — SEM botão de voltar (como no Facebook)
const MAIN_NAVIGATION_ROUTES = ['/dashboard', '/explore', '/groups', '/library', '/messages', '/profile', '/saved']

// Rotas onde o botão de voltar não faz sentido
const NO_BACK_ROUTES = ['/dashboard', '/explore', '/groups', '/library', '/messages', '/profile', '/saved']

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark } = useTheme()
  const { unreadCount } = useNotifications()
  const { convs } = useMessages()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ]       = useState('')
  const [isHidden, setIsHidden] = useState(false)
  const lastYRef = useRef(0)
  const tickingRef = useRef(false)
  const menuRef = useRef(null)

  // Contar mensagens não lidas
  const unreadMessages = convs?.reduce((total, conv) => total + (conv.unread || 0), 0) || 0

  const handleLogout = () => { logout(); navigate('/') }
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQ.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQ)}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  const showBack = !NO_BACK_ROUTES.includes(location.pathname)

  // Esconder navbar na página de mensagens e notificações
  if (location.pathname === '/messages' || location.pathname === '/notifications') {
    return null
  }

  useEffect(() => {
    setIsHidden(false)
    lastYRef.current = window.scrollY || 0

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY || 0
        const delta = currentY - lastYRef.current
        const nearTop = currentY < 24

        if (nearTop) {
          setIsHidden(false)
        } else if (delta > 8) {
          setIsHidden(true)
        } else if (delta < -8) {
          setIsHidden(false)
        }

        lastYRef.current = currentY
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-50 bg-white/70 dark:bg-[#242526]/70 backdrop-blur-2xl border-b border-neutral-200/50 dark:border-[#3a3b3c]/50 transition-transform duration-250 ease-out shadow-sm ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Esquerda: logo sempre */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center">
            <span className="font-bold text-xl">
              <span style={{ color: '#1e3a8a' }}>Acad</span><span style={{ color: '#16a34a' }}>link</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-[#8a8d91] w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar estudantes, posts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-[#3a3b3c] bg-neutral-50 dark:bg-[#3a3b3c] text-sm text-neutral-900 dark:text-[#e4e6ea] placeholder-neutral-400 dark:placeholder-[#8a8d91] focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to}
                className={`relative flex items-center justify-center p-2.5 rounded-xl transition-all ${active ? 'bg-primary-50 dark:bg-[#404142] text-primary-600 dark:text-[#e4e6ea]' : 'text-neutral-600 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#404142]'}`}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
                {badge && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(s => !s)} className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#404142] transition-colors">
            <Search className="w-4 h-4" />
          </button>

          <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-xl text-neutral-600 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#404142] transition-colors">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <button onClick={() => navigate('/messages')} className="relative p-2 rounded-xl text-neutral-600 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#404142] transition-colors">
            <MessageCircle className="w-4 h-4" />
            {unreadMessages > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-0.5">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-neutral-600 dark:text-[#b0b3b8] hover:bg-neutral-100 dark:hover:bg-[#404142] transition-colors ml-1"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 bg-white dark:bg-[#242526] border border-neutral-100 dark:border-[#3a3b3c] rounded-2xl shadow-modal z-50 py-2 min-w-[280px] animate-fade-in">
                
                {/* Perfil do usuário */}
                <div className="px-4 py-3 border-b border-neutral-100 dark:border-[#3a3b3c]">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user?.name} size="md" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-neutral-900 dark:text-[#e4e6ea]">{user?.name}</p>
                      <p className="text-xs text-neutral-600 dark:text-[#b0b3b8]">{stringifyUniversity(user?.university)}</p>
                    </div>
                  </div>
                </div>

                {/* Navegação principal */}
                <div className="py-1">
                  <Link to="/groups" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-[#e4e6ea] hover:bg-neutral-50 dark:hover:bg-[#404142]">
                    <Users className="w-4 h-4" /> Grupos
                  </Link>
                  <Link to="/saved" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-[#e4e6ea] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <Bookmark className="w-4 h-4" /> Posts guardados
                  </Link>
                  <Link to="/opportunities" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-[#e4e6ea] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <Briefcase className="w-4 h-4" /> Oportunidades
                  </Link>
                </div>

                {/* Configurações e suporte */}
                <div className="border-t border-neutral-100 dark:border-[#2a2a2a] py-1">
                  <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-[#e4e6ea] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <Settings className="w-4 h-4" /> Configurações
                  </Link>
                  <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-700 dark:text-[#e4e6ea] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <HelpCircle className="w-4 h-4" /> Ajuda e suporte
                  </button>
                  <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-700 dark:text-[#e4e6ea] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <Shield className="w-4 h-4" /> Privacidade
                  </button>
                  <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-700 dark:text-[#e4e6ea] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]">
                    <Info className="w-4 h-4" /> Sobre o AcadLink
                  </button>
                </div>

                {/* Sair */}
                <div className="border-t border-neutral-100 dark:border-[#2a2a2a] py-1">
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden px-4 pb-3 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-[#b0b3b8] w-4 h-4" />
            <input autoFocus type="text" placeholder="Pesquisar..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-neutral-50 dark:bg-[#222222] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={handleSearch}
            />
          </div>
        </div>
      )}
    </header>
  )
}
