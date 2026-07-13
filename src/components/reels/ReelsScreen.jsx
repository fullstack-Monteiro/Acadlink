import React from 'react'
import {
  Search,
  Bell,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Home,
  Users,
  BookOpen,
  FilmPlus,
  Camera
} from 'lucide-react'

export default function ReelsScreen({
  cover = '/cover-reel.jpg',
  avatar = '/avatar-reel.jpg',
  userName = 'Samuel N.',
  subtitle = 'Estudante de Matemática • UEM',
  caption = 'Entendendo derivadas de forma simples! #Calculo #Matematica #Derivadas #UEM',
  likes = '1.2K',
  comments = 86,
  shares = 243,
  saves = 512
}) {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      <div className="absolute inset-0">
        <img
          src={cover}
          alt="Reel cover"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-blue-500">Acad</span>
            <span className="text-emerald-400">link</span>
          </span>
          <nav className="hidden sm:flex gap-6 text-sm text-white/80">
            <button className="border-b-2 border-white pb-1">Para ti</button>
            <button className="text-white/70">Seguindo</button>
            <button className="text-white/70">Tendências</button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-white/10">
            <Search className="w-5 h-5 text-white" />
          </button>
          <div className="relative">
            <button className="p-2 rounded-full bg-white/10">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold">
              3
            </span>
          </div>
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar"
              className="h-9 w-9 rounded-full ring-2 ring-white/20 object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
          </div>
        </div>
      </header>

      <main className="relative z-20 mt-3 h-[76vh] sm:h-[80vh]">
        <div className="absolute right-4 top-1/3 flex flex-col items-center gap-6">
          <div className="relative">
            <img
              src={avatar}
              alt="avatar"
              className="h-12 w-12 rounded-full ring-2 ring-white/30 object-cover"
            />
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
              +
            </div>
          </div>

          <button className="flex flex-col items-center gap-2 text-white/90">
            <Heart className="h-8 w-8" />
            <span className="text-sm">{likes}</span>
          </button>

          <button className="flex flex-col items-center gap-2 text-white/90">
            <MessageCircle className="h-8 w-8" />
            <span className="text-sm">{comments}</span>
          </button>

          <button className="flex flex-col items-center gap-2 text-white/90">
            <Send className="h-8 w-8 rotate-45" />
            <span className="text-sm">{shares}</span>
          </button>

          <button className="flex flex-col items-center gap-2 text-white/90">
            <Bookmark className="h-7 w-7" />
            <span className="text-sm">{saves}</span>
          </button>

          <div className="mt-2 h-24 w-[2px] rounded-full bg-white/20" />
        </div>

        <div className="absolute left-4 bottom-28 max-w-[70%] space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs uppercase tracking-wide text-white/80">
            Educação
          </span>

          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="avatar"
              className="h-12 w-12 rounded-full ring-4 ring-white/20 object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{userName}</span>
                <svg
                  className="h-4 w-4 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l2.9 5.9L21 9l-4.5 4.1L17.8 21 12 17.8 6.2 21l1.3-7.9L3 9l6.1-1.1L12 2z" />
                </svg>
                <button className="ml-auto rounded-full bg-emerald-500 px-3 py-1 text-sm font-medium">
                  Seguir
                </button>
              </div>
              <p className="text-sm text-white/70">{subtitle}</p>
            </div>
          </div>

          <p className="max-w-lg text-sm leading-6">{caption}</p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-full bg-black/50 px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg">
                ♪
              </span>
              <span className="text-sm text-white/80">
                Som original <strong>{userName}</strong>
              </span>
            </div>
            <button className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              Usar áudio
            </button>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-4 left-0 right-0 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-8 rounded-full bg-black/60 px-4 py-2">
          <button className="flex flex-col items-center gap-1 text-white/90">
            <Home className="h-5 w-5" />
            <span className="text-[10px]">Início</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white/60">
            <Users className="h-5 w-5" />
            <span className="text-[10px]">Comunidade</span>
          </button>
        </div>

        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-xl">
          <FilmPlus className="h-7 w-7" />
        </button>

        <div className="flex items-center gap-8 rounded-full bg-black/60 px-4 py-2">
          <button className="flex flex-col items-center gap-1 text-white/60">
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px]">Biblioteca</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-blue-400">
            <FilmPlus className="h-5 w-5" />
            <span className="text-[10px]">Reels</span>
          </button>
        </div>
      </nav>

      <button className="fixed right-4 top-20 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-xl">
        <Camera className="h-6 w-6" />
      </button>
    </div>
  )
}