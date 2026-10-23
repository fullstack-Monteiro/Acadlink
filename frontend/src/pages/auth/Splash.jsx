import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Splash() {
  const { user, authLoading } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const navigatedRef = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    console.log('[SPLASH] Render: authLoading=', authLoading, 'user=', user?.email || 'null', 'navigated=', navigatedRef.current)
    
    if (authLoading || navigatedRef.current) {
      console.log('[SPLASH] Early return - authLoading:', authLoading, 'navigated:', navigatedRef.current)
      return
    }

    const t2 = setTimeout(() => {
      if (!navigatedRef.current) {
        // Validar seção: se tem utilizador, vai para dashboard, se não vai para login
        const target = user ? '/dashboard' : '/login'
        console.log('[SPLASH] Navigating to:', target)
        navigatedRef.current = true
        navigate(target, { replace: true })
      }
    }, 7000)

    return () => clearTimeout(t2)
  }, [authLoading, user, navigate])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div
        className="flex flex-col items-center gap-8 transition-all duration-1000"
        style={{ 
          opacity: visible ? 1 : 0, 
          transform: visible ? 'scale(1)' : 'scale(0.9)' 
        }}
      >
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="AcadLink" 
          className="h-64 w-auto object-contain" 
        />

        {/* Loading dots com cores da logo */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: '#1D6AFF', animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: '#00A3FF', animationDelay: '0.2s' }}></div>
          <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: '#1D6AFF', animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}
