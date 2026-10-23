import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { PostsProvider } from './context/PostsContext'
import { MessagesProvider } from './context/MessagesContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { ReelsProvider } from './context/ReelsContext'
import Splash from './pages/auth/Splash'
import Welcome from './pages/auth/Welcome'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetPassword from './pages/auth/ResetPassword'
import GoogleOnboarding from './pages/auth/GoogleOnboarding'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'
import CreatePost from './pages/CreatePost'
import Messages from './pages/Messages'
import Explore from './pages/Explore'
import Groups from './pages/Groups'
import Saved from './pages/Saved'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Opportunities from './pages/Opportunities'
import Library from './pages/Library'
import ReelFeed from './pages/ReelFeed'
import ReelSearch from './pages/ReelSearch'
import ReelTrending from './pages/ReelTrending'
import ReelAnalytics from './pages/ReelAnalytics'
import CreateStory from './pages/CreateStory'
import StoryAIChat from './pages/StoryAIChat'
import BottomNav from './components/layout/BottomNav'

function PrivateRoute({ children }) {
  // Desativada autenticação - permite acesso a todas as rotas
  return children
}

function GuestRoute({ children }) {
  // Desativada autenticação - permite acesso a todas as rotas
  return children
}

// Rotas de auth — sem navegação
const AUTH_ROUTES = ['/', '/welcome', '/login', '/register', '/reset-password', '/onboarding/google']

function Layout({ children }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  // Mostra BottomNav em todas as rotas autenticadas (não nas de auth)
  const showBottom = user && !AUTH_ROUTES.includes(pathname)

  return (
    <>
      {children}
      {showBottom && <BottomNav />}
    </>
  )
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding/google" element={<GoogleOnboarding />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/profile/:userId" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />
        <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
        <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
        <Route path="/saved" element={<PrivateRoute><Saved /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/opportunities" element={<PrivateRoute><Opportunities /></PrivateRoute>} />
        <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
        <Route path="/reels" element={<PrivateRoute><ReelFeed onClose={() => window.history.back()} /></PrivateRoute>} />
        <Route path="/reels/search" element={<PrivateRoute><ReelSearch /></PrivateRoute>} />
        <Route path="/reels/trending" element={<PrivateRoute><ReelTrending /></PrivateRoute>} />
        <Route path="/reels/analytics/:reelId" element={<PrivateRoute><ReelAnalytics /></PrivateRoute>} />
        <Route path="/create-story" element={<PrivateRoute><CreateStory /></PrivateRoute>} />
        <Route path="/create-story/ai" element={<PrivateRoute><StoryAIChat /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AuthProvider>
          <PostsProvider>
            <ReelsProvider>
              <MessagesProvider>
                <NotificationsProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </NotificationsProvider>
              </MessagesProvider>
            </ReelsProvider>
          </PostsProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}
