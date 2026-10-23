import { useTheme } from '../../context/ThemeContext'

export default function AuthSidebar() {
  const { dark } = useTheme()

  const logoImage = '/logo-sidebar-white.png'
  const backgroundColor = dark ? '#0d0d0d' : '#ffffff'

  return (
    <div 
      className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
      style={{
        backgroundColor: backgroundColor
      }}
    >
      <img 
        src={logoImage} 
        alt="AcadLink" 
        className={`w-full h-auto max-w-lg object-contain ${dark ? 'invert' : ''}`}
      />
    </div>
  )
}
