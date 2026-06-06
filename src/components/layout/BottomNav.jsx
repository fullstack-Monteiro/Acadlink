import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, BookOpen, User, Film } from 'lucide-react'

const ITEMS = [
  { to: '/dashboard', icon: Home,     label: 'Início' },
  { to: '/explore',   icon: Users,    label: 'Conexões' },
  { to: '/reels',     icon: Film,     label: 'Reels' },
  { to: '/library',   icon: BookOpen, label: 'Biblioteca' },
  { to: '/profile',   icon: User,     label: 'Perfil' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const isProfileActive = pathname === '/profile' || pathname.startsWith('/profile/')
  const [isHidden, setIsHidden] = useState(false)
  const lastYRef = useRef(0)
  const tickingRef = useRef(false)
  const shouldHideNav = pathname === '/messages'

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
  }, [pathname])

  if (shouldHideNav) {
    return null
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/70 dark:bg-[#242526]/70 backdrop-blur-2xl border-t border-neutral-200/50 dark:border-[#3a3b3c]/50 md:hidden transition-transform duration-250 ease-out shadow-lg ${
        isHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-1.5 pb-2">
        {ITEMS.map(({ to, icon: Icon, label, badge }) => {
          const active = to === '/profile' ? isProfileActive : pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 transform active:scale-95 ${
                active ? 'text-primary-600' : 'text-neutral-400 dark:text-[#b0b3b8]'
              }`}
              aria-label={label}
            >
              {active && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary-600 animate-scale-in" />
              )}
              <div className={`relative p-2 rounded-xl transition-all duration-200 ${active ? 'bg-primary-50 dark:bg-[#404142]' : ''}`}>
                <Icon className={`w-6 h-6 transition-all duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                {badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
