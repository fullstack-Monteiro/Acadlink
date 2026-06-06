import { Link } from 'react-router-dom'
import { GraduationCap, Users, Briefcase, BookOpen, ArrowRight, Star, Moon, Sun } from 'lucide-react'
import Button from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'

const UNIS = ['UEM', 'ISCTEM', 'UP', 'UniLúrio', 'UCM', 'ISRI']

const FEATURES = [
  { icon: Users, title: 'Networking Académico', desc: 'Conecta-te com estudantes de todas as universidades de Moçambique.' },
  { icon: Briefcase, title: 'Oportunidades', desc: 'Bolsas, estágios, concursos e eventos num só lugar.' },
  { icon: BookOpen, title: 'Partilha de Conhecimento', desc: 'Apontamentos, resumos e recursos académicos da comunidade.' },
  { icon: GraduationCap, title: 'Comunidades', desc: 'Grupos por curso, universidade e área de interesse.' },
]

const STATS = [
  { value: '12.000+', label: 'Estudantes' },
  { value: '8', label: 'Universidades' },
  { value: '500+', label: 'Oportunidades' },
  { value: '50+', label: 'Cursos' },
]

export default function Landing() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md border-b border-neutral-100 dark:border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-xl">
              <span style={{ color: '#1e3a8a' }}>Acad</span><span style={{ color: '#16a34a' }}>link</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] transition-colors">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Criar conta</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-white/10 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Star className="w-3.5 h-3.5" />
          A rede académica de Moçambique
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-tight mb-6">
          Conecta, aprende e{' '}
          <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            cresce juntos
          </span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          A plataforma que une estudantes universitários de Moçambique. Partilha conhecimento, descobre oportunidades e constrói o teu futuro académico e profissional.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Começar agora <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Já tenho conta</Button>
          </Link>
        </div>

        {/* Universities */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {UNIS.map(u => (
            <span key={u} className="px-4 py-2 bg-neutral-100 dark:bg-[#222222] text-neutral-600 dark:text-neutral-400 rounded-full text-sm font-medium">
              {u}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-500 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-primary-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            Tudo o que precisas num só lugar
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Ferramentas pensadas para o estudante universitário moçambicano
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 bg-neutral-50 dark:bg-[#1e1e1e] rounded-2xl border border-neutral-100 dark:border-[#2a2a2a] hover:border-primary-200 dark:hover:border-primary-800 transition-colors group">
              <div className="w-10 h-10 bg-primary-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-br from-primary-600 to-secondary-500 rounded-3xl p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">Pronto para começar?</h2>
          <p className="text-primary-100 mb-6">Junta-te a milhares de estudantes que já fazem parte da comunidade.</p>
          <Link to="/register">
            <Button variant="ghost" size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
              Criar conta gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 dark:border-[#2a2a2a] py-6 text-center text-sm text-neutral-400">
        © 2026 AcadLink · Feito com 💙 para estudantes de Moçambique
      </footer>
    </div>
  )
}
