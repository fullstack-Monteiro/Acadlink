import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Film, Library, Plus } from 'lucide-react'

const ITEMS_LEFT  = [
  { to: '/dashboard', icon: Home,    label: 'Início'     },
  { to: '/explore',   icon: Search,  label: 'Explorar'   },
]

const ITEMS_RIGHT = [
  { to: '/reels',     icon: Film,    label: 'Reels'      },
  { to: '/library',   icon: Library, label: 'Biblioteca' },
]

export default function BottomNav() {
  const { pathname }    = useLocation()
  const [isHidden, setIsHidden] = useState(false)
  const lastYRef        = useRef(0)
  const tickingRef      = useRef(false)

  const shouldHideNav = pathname === '/messages' || pathname === '/create-story/ai'

  useEffect(() => {
    setIsHidden(false)
    lastYRef.current = window.scrollY || 0

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      window.requestAnimationFrame(() => {
        const y     = window.scrollY || 0
        const delta = y - lastYRef.current
        if (y < 24)         setIsHidden(false)
        else if (delta > 8)  setIsHidden(true)
        else if (delta < -8) setIsHidden(false)
        lastYRef.current = y
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (shouldHideNav) return null

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = pathname === to
    return (
      <Link
        to={to}
        className="relative flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-200 active:scale-90"
        aria-label={label}
      >
        {active && (
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-[#1D6AFF] animate-scale-in" />
        )}
        <Icon
          size={24}
          strokeWidth={active ? 2.5 : 1.8}
          className={active ? 'text-[#1D6AFF]' : 'text-neutral-400 dark:text-[#aeaeb2]'}
        />
        <span className={`text-[10px] font-medium ${active ? 'text-[#1D6AFF]' : 'text-neutral-400 dark:text-[#aeaeb2]'}`}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-40 md:hidden
        bg-white/90 dark:bg-[#1e1e1e]/95
        backdrop-blur-xl
        border-t border-neutral-200/60 dark:border-[#282828]
        transition-transform duration-250 ease-out
        ${isHidden ? 'translate-y-full' : 'translate-y-0'}
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around px-2 pt-1 pb-2">

        {/* Esquerda */}
        {ITEMS_LEFT.map(item => <NavItem key={item.to} {...item} />)}

        {/* Botão + central */}
        <Link
          to="/create-post"
          aria-label="Nova publicação"
          className="flex flex-col items-center gap-0.5 px-4 py-2 active:scale-90 transition-all duration-200"
        >
          <div className="w-11 h-11 rounded-full bg-[#1D6AFF] flex items-center justify-center shadow-lg shadow-[#1D6AFF]/30 -mt-4">
            <Plus size={22} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-[10px] font-medium text-neutral-400 dark:text-[#aeaeb2] mt-0.5">
            Publicar
          </span>
        </Link>

        {/* Direita */}
        {ITEMS_RIGHT.map(item => <NavItem key={item.to} {...item} />)}

      </div>
    </nav>
  )
}
