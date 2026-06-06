import { useTheme } from '../../context/ThemeContext'

export default function AuthSidebar() {
  const { dark } = useTheme()

  const backgroundImage = dark ? '/login-sidebar-black.png' : '/login-sidebar.png'
  const backgroundColor = dark ? '#000000' : '#FEFEFE'

  return (
    <div 
      className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: backgroundColor
      }}
    >
    </div>
  )
}
