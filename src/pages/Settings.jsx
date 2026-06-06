import { useState, useRef } from 'react'
import {
  ChevronLeft, ChevronRight, LogOut, User, Lock, Bell, Eye, Palette,
  Shield, GraduationCap, Rss, MessageSquare, Database, HelpCircle,
  Camera, Phone, Calendar, Hash, BookOpen, CheckCircle, Sun, Moon,
  Monitor, Type, Globe, Accessibility, Download, Trash2, AlertTriangle,
  Mail, Smartphone, Clock, X, Check, BadgeCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import UserAvatar from '../components/ui/UserAvatar'
import BackButton from '../components/layout/BackButton'
import { stringifyUniversity } from '../utils/university'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-[#2a2a2a]'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function Row({ icon: Icon, iconBg, label, sublabel, right, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors' : ''}`}
    >
      {Icon && (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg || 'bg-neutral-100 dark:bg-[#222222]'}`}>
          <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-neutral-600 dark:text-[#e4e6ea]'}`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-neutral-800 dark:text-neutral-200'}`}>{label}</span>
        {sublabel && <p className="text-xs text-neutral-400 dark:text-[#b0b3b8] mt-0.5 truncate">{sublabel}</p>}
      </div>
      {right}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      {title && <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2 px-1">{title}</p>}
      <Card className="overflow-hidden divide-y divide-neutral-100 dark:divide-[#2a2a2a]">
        {children}
      </Card>
    </div>
  )
}

function SubPage({ title, onBack, children }) {
  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-[#e4e6ea] hover:text-neutral-700 dark:hover:text-neutral-300 mb-5 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>
      <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5">{title}</h2>
      {children}
    </div>
  )
}

function InputField({ label, value, type = 'text', placeholder, onChange }) {
  const [val, setVal] = useState(value || '')
  const handleChange = (e) => {
    setVal(e.target.value)
    onChange?.(e.target.value)
  }
  return (
    <div>
      <label className="text-xs font-medium text-neutral-500 dark:text-[#b0b3b8] mb-1.5 block">{label}</label>
      <input
        type={type}
        value={val}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 dark:border-[#2a2a2a] bg-white dark:bg-[#222222] px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
      />
    </div>
  )
}

function SaveButton({ label = 'Guardar alterações', onSave }) {
  const [saved, setSaved] = useState(false)
  const handle = () => { onSave?.(); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <button onClick={handle} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-secondary-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}>
      {saved ? '✓ Guardado' : label}
    </button>
  )
}

// ─── SUB-PÁGINAS ────────────────────────────────────────────────────────────

function ContaPage({ onBack, user, updateUser }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || '',
    course: user?.course || '',
    year: user?.year || '',
  })
  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))
  const photoInputRef = useRef(null)
  const capeInputRef = useRef(null)

  return (
    <SubPage title="Conta e Perfil" onBack={onBack}>
      {/* Foto de perfil */}
      <Section title="Foto de perfil">
        <div className="p-4 flex items-center gap-4">
          <UserAvatar name={user?.name} size="lg" />
          <div className="flex flex-col gap-2 flex-1">
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={() => {}} />
            <button onClick={() => photoInputRef.current?.click()} className="flex items-center gap-2 text-sm text-primary-600 font-medium">
              <Camera className="w-4 h-4" /> Carregar nova foto
            </button>
            <button onClick={() => {}} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-[#e4e6ea] hover:text-red-500 transition-colors">
              <X className="w-4 h-4" /> Remover foto actual
            </button>
            <button onClick={() => updateUser({ avatar: null })} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-[#e4e6ea] hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
              <User className="w-4 h-4" /> Usar iniciais ({user?.name?.split(' ').map(n => n[0]).join('').slice(0,2)})
            </button>
          </div>
        </div>
      </Section>

      {/* Foto de capa */}
      <Section title="Foto de capa">
        <div className="p-4 space-y-2">
          <input ref={capeInputRef} type="file" accept="image/*" className="hidden" onChange={() => {}} />
          <button onClick={() => capeInputRef.current?.click()} className="flex items-center gap-2 text-sm text-primary-600 font-medium">
            <Camera className="w-4 h-4" /> Carregar imagem
          </button>
          <button onClick={() => {}} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" /> Remover capa
          </button>
        </div>
      </Section>

      {/* Informações pessoais */}
      <Section title="Informações pessoais">
        <div className="p-4 space-y-4">
          <InputField label="Nome completo" value={form.name} onChange={set('name')} />
          <InputField label="Username" value={user?.username ? `@${user.username}` : ''} placeholder="@username" />
          <InputField label="Email" value={form.email} type="email" onChange={set('email')} />
          <InputField label="Número de telefone" placeholder="+258 84 000 0000" type="tel" />
          <InputField label="Data de nascimento" type="date" />
          <SaveButton onSave={() => updateUser({ name: form.name, email: form.email })} />
        </div>
      </Section>

      {/* Informações académicas */}
      <Section title="Informações académicas">
        <div className="p-4 space-y-4">
          <InputField label="Universidade" value={form.university} onChange={set('university')} />
          <InputField label="Curso" value={form.course} onChange={set('course')} />
          <InputField label="Ano académico" value={form.year} onChange={set('year')} placeholder="3º Ano" />
          <InputField label="Número de estudante" placeholder="2021XXXXX" />
          <InputField label="Data de conclusão prevista" type="month" />
          <SaveButton onSave={() => updateUser({ university: form.university, course: form.course, year: form.year })} />
        </div>
      </Section>
    </SubPage>
  )
}

function PrivacidadePage({ onBack }) {
  const [vis, setVis] = useState('public')
  const [msgs, setMsgs] = useState('all')
  const [conns, setConns] = useState('all')
  const [posts, setPosts] = useState('all')
  const [comments, setComments] = useState('all')
  const [suggestions, setSuggestions] = useState(true)

  const RadioGroup = ({ label, value, onChange, options }) => (
    <div className="py-3">
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2">{label}</p>
      <div className="space-y-2">
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-[#222222] transition-colors text-left">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${value === o.value ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600'}`}>
              {value === o.value && <div className="w-2 h-2 rounded-full bg-primary-600" />}
            </div>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <SubPage title="Privacidade" onBack={onBack}>
      <Section>
        <div className="p-4 divide-y divide-neutral-100 dark:divide-[#2a2a2a]">
          <RadioGroup label="Visibilidade do perfil" value={vis} onChange={setVis} options={[
            { value: 'public', label: '🌍 Público (todos vêem)' },
            { value: 'students', label: '🎓 Só estudantes verificados' },
            { value: 'connections', label: '🔗 Só conexões' },
            { value: 'private', label: '🔒 Privado (só eu)' },
          ]} />
          <RadioGroup label="Quem pode enviar mensagens" value={msgs} onChange={setMsgs} options={[
            { value: 'all', label: 'Todos' },
            { value: 'connections', label: 'Só conexões' },
            { value: 'nobody', label: 'Ninguém' },
          ]} />
          <RadioGroup label="Quem pode ver as minhas conexões" value={conns} onChange={setConns} options={[
            { value: 'all', label: 'Todos' },
            { value: 'connections', label: 'Só conexões' },
            { value: 'me', label: 'Só eu' },
          ]} />
          <RadioGroup label="Quem pode ver os meus posts" value={posts} onChange={setPosts} options={[
            { value: 'all', label: 'Todos' },
            { value: 'connections', label: 'Só conexões' },
            { value: 'me', label: 'Só eu' },
          ]} />
          <RadioGroup label="Quem pode comentar nos meus posts" value={comments} onChange={setComments} options={[
            { value: 'all', label: 'Todos' },
            { value: 'connections', label: 'Só conexões' },
            { value: 'nobody', label: 'Ninguém' },
          ]} />
          <div className="flex items-center justify-between py-3">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Aparecer em sugestões de conexão</p>
            <Toggle value={suggestions} onChange={setSuggestions} />
          </div>
        </div>
      </Section>
      <SaveButton />
    </SubPage>
  )
}

function NotificacoesPage({ onBack }) {
  const [push, setPush] = useState({
    all: true, messages: true, connections: true, likes: true,
    comments: true, mentions: true, groupPosts: false, opportunities: true,
  })
  const [email, setEmail] = useState({
    all: false, weekly: true, opportunities: true, connections: false, newsletter: false,
  })
  const [freq, setFreq] = useState('realtime')

  const togglePush = k => setPush(p => ({ ...p, [k]: !p[k] }))
  const toggleEmail = k => setEmail(e => ({ ...e, [k]: !e[k] }))

  return (
    <SubPage title="Notificações" onBack={onBack}>
      <Section title="Notificações push (telemóvel)">
        <Row label="Activar/desactivar tudo" right={<Toggle value={push.all} onChange={() => togglePush('all')} />} />
        {[
          { k: 'messages', l: 'Novas mensagens' },
          { k: 'connections', l: 'Pedidos de conexão' },
          { k: 'likes', l: 'Likes nos meus posts' },
          { k: 'comments', l: 'Comentários nos meus posts' },
          { k: 'mentions', l: 'Menções (@amilcar)' },
          { k: 'groupPosts', l: 'Novos posts nos grupos' },
          { k: 'opportunities', l: 'Oportunidades novas' },
        ].map(({ k, l }) => (
          <Row key={k} label={l} right={<Toggle value={push[k]} onChange={() => togglePush(k)} />} />
        ))}
      </Section>

      <Section title="Notificações por email">
        <Row label="Activar/desactivar tudo" right={<Toggle value={email.all} onChange={() => toggleEmail('all')} />} />
        {[
          { k: 'weekly', l: 'Resumo semanal de actividade' },
          { k: 'opportunities', l: 'Novas oportunidades e bolsas' },
          { k: 'connections', l: 'Pedidos de conexão' },
          { k: 'newsletter', l: 'Newsletter do AcadLink' },
        ].map(({ k, l }) => (
          <Row key={k} label={l} right={<Toggle value={email[k]} onChange={() => toggleEmail(k)} />} />
        ))}
      </Section>

      <Section title="Frequência de resumo">
        {[
          { v: 'realtime', l: 'Tempo real' },
          { v: 'daily', l: 'Diário (às 18h)' },
          { v: 'weekly', l: 'Semanal (segunda-feira)' },
        ].map(({ v, l }) => (
          <button key={v} onClick={() => setFreq(v)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors text-left">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${freq === v ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600'}`}>
              {freq === v && <div className="w-2 h-2 rounded-full bg-primary-600" />}
            </div>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{l}</span>
          </button>
        ))}
      </Section>
      <SaveButton />
    </SubPage>
  )
}

function SegurancaPage({ onBack }) {
  const [twoFA, setTwoFA] = useState(false)
  const [twoFAMethod, setTwoFAMethod] = useState('sms')
  const [showHistory, setShowHistory] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const sessions = [
    { device: 'Chrome', location: 'Maputo', time: 'agora', current: true },
    { device: 'Safari — iPhone', location: 'Maputo', time: 'ontem', current: false },
  ]

  const handleChangePassword = () => {
    setPwError('')
    if (!pwForm.current) return setPwError('Introduz a senha actual.')
    if (pwForm.next.length < 6) return setPwError('A nova senha deve ter pelo menos 6 caracteres.')
    if (pwForm.next !== pwForm.confirm) return setPwError('As senhas não coincidem.')
    setPwSaved(true)
    setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwSaved(false), 2500)
  }

  const handleTerminateSessions = () => {
    if (window.confirm('Terminar todas as outras sessões activas?')) {
      alert('Todas as outras sessões foram terminadas.')
    }
  }

  return (
    <SubPage title="Segurança" onBack={onBack}>
      <Section title="Alterar senha">
        <div className="p-4 space-y-4">
          <InputField label="Senha actual" type="password" placeholder="••••••••" value={pwForm.current} onChange={v => setPwForm(f => ({ ...f, current: v }))} />
          <InputField label="Nova senha" type="password" placeholder="••••••••" value={pwForm.next} onChange={v => setPwForm(f => ({ ...f, next: v }))} />
          <InputField label="Confirmar nova senha" type="password" placeholder="••••••••" value={pwForm.confirm} onChange={v => setPwForm(f => ({ ...f, confirm: v }))} />
          {pwError && <p className="text-xs text-red-500">{pwError}</p>}
          <button onClick={handleChangePassword} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${pwSaved ? 'bg-secondary-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}>
            {pwSaved ? '✓ Senha alterada' : 'Alterar senha'}
          </button>
        </div>
      </Section>

      <Section title="Autenticação em dois factores (2FA)">
        <Row label="Activar 2FA" right={<Toggle value={twoFA} onChange={setTwoFA} />} />
        {twoFA && (
          <div className="px-4 pb-4 space-y-2">
            {[{ v: 'sms', l: '📱 Via SMS' }, { v: 'app', l: '🔐 Via app autenticadora' }].map(({ v, l }) => (
              <button key={v} onClick={() => setTwoFAMethod(v)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-[#222222] transition-colors text-left">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${twoFAMethod === v ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600'}`}>
                  {twoFAMethod === v && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                </div>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{l}</span>
              </button>
            ))}
          </div>
        )}
      </Section>

      <Section title="Sessões activas">
        {sessions.map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Monitor className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{s.device}</p>
              <p className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{s.location} · {s.time} {s.current && '· Esta sessão'}</p>
            </div>
            {s.current && <span className="text-xs bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 px-2 py-0.5 rounded-full">Activa</span>}
          </div>
        ))}
        <button onClick={handleTerminateSessions} className="w-full px-4 py-3 text-sm text-red-500 font-medium text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          Terminar todas as sessões
        </button>
      </Section>

      <Section title="Histórico de acesso">
        <Row icon={Clock} label="Ver últimos logins" sublabel="Data, hora e localização" onClick={() => setShowHistory(true)} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
      </Section>

      {showHistory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowHistory(false)}>
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-5 w-full max-w-sm shadow-modal" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Histórico de acesso</h3>
            {[
              { date: '25 Abr 2026, 14:32', location: 'Maputo, MZ', device: 'Chrome — Windows' },
              { date: '24 Abr 2026, 09:15', location: 'Maputo, MZ', device: 'Safari — iPhone' },
              { date: '22 Abr 2026, 18:44', location: 'Maputo, MZ', device: 'Chrome — Windows' },
            ].map((l, i) => (
              <div key={i} className="py-2.5 border-b border-neutral-100 dark:border-[#2a2a2a] last:border-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{l.device}</p>
                <p className="text-xs text-neutral-400 dark:text-[#b0b3b8]">{l.location} · {l.date}</p>
              </div>
            ))}
            <button onClick={() => setShowHistory(false)} className="w-full mt-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#222222] text-sm font-medium text-neutral-700 dark:text-neutral-300">Fechar</button>
          </div>
        </div>
      )}
    </SubPage>
  )
}

function AparenciaPage({ onBack }) {
  const { dark, toggle } = useTheme()
  const [themeMode, setThemeMode] = useState(dark ? 'dark' : 'light')
  const [fontSize, setFontSize] = useState('normal')
  const [lang, setLang] = useState('pt-MZ')
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [colorBlind, setColorBlind] = useState(false)

  const handleTheme = (v) => {
    setThemeMode(v)
    if (v === 'dark' && !dark) toggle()
    if (v === 'light' && dark) toggle()
  }

  return (
    <SubPage title="Aparência" onBack={onBack}>
      <Section title="Tema">
        {[
          { v: 'light', l: '☀️ Claro (light mode)' },
          { v: 'dark', l: '🌙 Escuro (dark mode)' },
          { v: 'auto', l: '💻 Automático (segue o sistema)' },
        ].map(({ v, l }) => (
          <button key={v} onClick={() => handleTheme(v)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors text-left">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${themeMode === v ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600'}`}>
              {themeMode === v && <div className="w-2 h-2 rounded-full bg-primary-600" />}
            </div>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{l}</span>
          </button>
        ))}
      </Section>

      <Section title="Tamanho do texto">
        {[{ v: 'small', l: 'Pequeno' }, { v: 'normal', l: 'Normal (padrão)' }, { v: 'large', l: 'Grande' }].map(({ v, l }) => (
          <button key={v} onClick={() => setFontSize(v)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors text-left">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${fontSize === v ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600'}`}>
              {fontSize === v && <div className="w-2 h-2 rounded-full bg-primary-600" />}
            </div>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{l}</span>
          </button>
        ))}
      </Section>

      <Section title="Idioma">
        {[{ v: 'pt-MZ', l: 'Português (pt-MZ) — padrão' }, { v: 'pt-PT', l: 'Português (pt-PT)' }, { v: 'en', l: 'English' }].map(({ v, l }) => (
          <button key={v} onClick={() => setLang(v)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors text-left">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${lang === v ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600'}`}>
              {lang === v && <div className="w-2 h-2 rounded-full bg-primary-600" />}
            </div>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{l}</span>
          </button>
        ))}
      </Section>

      <Section title="Acessibilidade">
        <Row label="Reduzir animações" right={<Toggle value={reduceMotion} onChange={setReduceMotion} />} />
        <Row label="Alto contraste" right={<Toggle value={highContrast} onChange={setHighContrast} />} />
        <Row label="Modo daltónico" right={<Toggle value={colorBlind} onChange={setColorBlind} />} />
      </Section>
    </SubPage>
  )
}

function VerificacaoPage({ onBack }) {
  const [showBadge, setShowBadge] = useState(true)
  return (
    <SubPage title="Verificação" onBack={onBack}>
      <Section title="Estado actual">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">🟢 Verificado — UEM</p>
            <p className="text-xs text-neutral-400 dark:text-[#b0b3b8]">Verificado em 12/01/2026</p>
          </div>
        </div>
      </Section>

      <Section title="Documento">
        <Row icon={CheckCircle} label="Ver documento actual" onClick={() => alert('Documento: Cartão de Estudante UEM\nData de verificação: 12/01/2026\nEstado: Válido')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row icon={Camera} label="Substituir documento" onClick={() => document.getElementById('doc-upload')?.click()} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <input id="doc-upload" type="file" accept="image/*,.pdf" className="hidden" onChange={() => {}} />
      </Section>

      <Section title="Email institucional">
        <div className="px-4 py-3">
          <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">amilcar@uem.ac.mz</p>
          <p className="text-xs text-secondary-500 mt-0.5">✓ confirmado</p>
        </div>
        <Row icon={Mail} label="Alterar email institucional" onClick={() => {
          const email = prompt('Novo email institucional:')
          if (email && email.includes('@')) alert(`Email ${email} submetido para verificação.`)
        }} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
      </Section>

      <Section title="Badge no perfil">
        <Row label="Mostrar badge de verificado" right={<Toggle value={showBadge} onChange={setShowBadge} />} />
      </Section>
    </SubPage>
  )
}

function FeedPage({ onBack }) {
  const [prefs, setPrefs] = useState({ connections: true, opportunities: true, groups: true })
  const [interests, setInterests] = useState({
    bolsas: true, estagios: true, eventos: true, vida: true, tech: true, empreend: true,
  })
  const togglePref = k => setPrefs(p => ({ ...p, [k]: !p[k] }))
  const toggleInt = k => setInterests(i => ({ ...i, [k]: !i[k] }))

  return (
    <SubPage title="Feed e Conteúdo" onBack={onBack}>
      <Section title="Preferências do feed">
        <Row label="Mostrar posts de conexões primeiro" right={<Toggle value={prefs.connections} onChange={() => togglePref('connections')} />} />
        <Row label="Mostrar oportunidades em destaque" right={<Toggle value={prefs.opportunities} onChange={() => togglePref('opportunities')} />} />
        <Row label="Mostrar sugestões de grupos" right={<Toggle value={prefs.groups} onChange={() => togglePref('groups')} />} />
      </Section>

      <Section title="Categorias de interesse">
        {[
          { k: 'bolsas', l: 'Bolsas e financiamento' },
          { k: 'estagios', l: 'Estágios e emprego' },
          { k: 'eventos', l: 'Eventos académicos' },
          { k: 'vida', l: 'Vida universitária' },
          { k: 'tech', l: 'Tecnologia e inovação' },
          { k: 'empreend', l: 'Empreendedorismo' },
        ].map(({ k, l }) => (
          <Row key={k} label={l} right={<Toggle value={interests[k]} onChange={() => toggleInt(k)} />} />
        ))}
      </Section>

      <Section title="Outros">
        <Row icon={GraduationCap} label="Universidades a seguir" sublabel="Ver posts de outras universidades" onClick={() => alert('Funcionalidade em desenvolvimento.')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row icon={Trash2} label="Conteúdo bloqueado" sublabel="Ver utilizadores bloqueados" onClick={() => alert('Nenhum utilizador bloqueado.')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
      </Section>
    </SubPage>
  )
}

function MensagensPage({ onBack }) {
  const [readReceipts, setReadReceipts] = useState(true)
  const [preview, setPreview] = useState(true)
  const [archiveAfter, setArchiveAfter] = useState('never')

  return (
    <SubPage title="Mensagens" onBack={onBack}>
      <Section>
        <Row label='Confirmação de leitura ("visto")' right={<Toggle value={readReceipts} onChange={setReadReceipts} />} />
        <Row label="Pré-visualização nas notificações" right={<Toggle value={preview} onChange={setPreview} />} />
      </Section>

      <Section title="Arquivar conversas automaticamente">
        {[{ v: 'never', l: 'Nunca' }, { v: '30', l: 'Após 30 dias de inactividade' }, { v: '60', l: 'Após 60 dias de inactividade' }, { v: '90', l: 'Após 90 dias de inactividade' }].map(({ v, l }) => (
          <button key={v} onClick={() => setArchiveAfter(v)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors text-left">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${archiveAfter === v ? 'border-primary-600' : 'border-neutral-300 dark:border-neutral-600'}`}>
              {archiveAfter === v && <div className="w-2 h-2 rounded-full bg-primary-600" />}
            </div>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{l}</span>
          </button>
        ))}
      </Section>
    </SubPage>
  )
}

function DadosPage({ onBack }) {
  const [confirm, setConfirm] = useState(null)
  return (
    <SubPage title="Dados e Conta" onBack={onBack}>
      <Section>
        <Row icon={Download} label="Descarregar os meus dados" sublabel="Exportar posts, conexões e mensagens em JSON" onClick={() => {
          const data = { user: 'Ana Machava', exportDate: new Date().toISOString(), posts: [], connections: [], messages: [] }
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = 'acadlink-dados.json'; a.click()
          URL.revokeObjectURL(url)
        }} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
      </Section>

      <Section title="Zona de perigo">
        <Row icon={AlertTriangle} label="Desactivar conta temporariamente" sublabel="O perfil fica oculto mas os dados são guardados" onClick={() => setConfirm('deactivate')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row icon={Trash2} label="Apagar conta permanentemente" sublabel="⚠️ Acção irreversível — todos os dados eliminados" onClick={() => setConfirm('delete')} danger right={<ChevronRight className="w-4 h-4 text-red-400" />} />
      </Section>

      {confirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setConfirm(null)}>
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-sm shadow-modal" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-center text-neutral-900 dark:text-white mb-2">
              {confirm === 'delete' ? 'Apagar conta?' : 'Desactivar conta?'}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-[#b0b3b8] text-center mb-5">
              {confirm === 'delete'
                ? 'Esta acção é irreversível. Todos os teus dados serão eliminados permanentemente. Será enviado um email de confirmação.'
                : 'O teu perfil ficará oculto. Podes reactivar a conta a qualquer momento.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-[#2a2a2a] text-sm font-medium text-neutral-600 dark:text-neutral-400">Cancelar</button>
              <button onClick={() => { setConfirm(null); alert(confirm === 'delete' ? 'Email de confirmação enviado para a tua conta.' : 'Conta desactivada. Podes reactivar a qualquer momento.') }} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
                {confirm === 'delete' ? 'Apagar' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SubPage>
  )
}

function AjudaPage({ onBack }) {
  return (
    <SubPage title="Ajuda e Suporte" onBack={onBack}>
      <Section>
        <Row icon={HelpCircle} label="Centro de ajuda" sublabel="FAQ e guias de uso" onClick={() => window.open('https://acadlink.co.mz/ajuda', '_blank')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row icon={AlertTriangle} label="Reportar um problema" sublabel="Formulário de bug report" onClick={() => window.open('mailto:bugs@acadlink.co.mz?subject=Bug Report', '_blank')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row icon={Shield} label="Reportar um utilizador" sublabel="Conteúdo inapropriado, spam, assédio" onClick={() => window.open('mailto:suporte@acadlink.co.mz?subject=Reportar utilizador', '_blank')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row icon={Mail} label="Contactar suporte" sublabel="suporte@acadlink.co.mz" onClick={() => window.open('mailto:suporte@acadlink.co.mz', '_blank')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
      </Section>

      <Section title="Sobre o AcadLink">
        <div className="px-4 py-3 space-y-1">
          <p className="text-sm text-neutral-500 dark:text-[#b0b3b8]">Versão 1.0.0</p>
        </div>
        <Row label="Termos de uso" onClick={() => window.open('https://acadlink.co.mz/termos', '_blank')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row label="Política de privacidade" onClick={() => window.open('https://acadlink.co.mz/privacidade', '_blank')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
        <Row label="Política de cookies" onClick={() => window.open('https://acadlink.co.mz/cookies', '_blank')} right={<ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#b0b3b8]" />} />
      </Section>
    </SubPage>
  )
}

// ─── PÁGINA PRINCIPAL ────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { key: 'conta',         icon: User,          label: 'Conta e Perfil',    sublabel: 'Informações pessoais e académicas' },
  { key: 'privacidade',   icon: Eye,           label: 'Privacidade',       sublabel: 'Visibilidade e permissões' },
  { key: 'notificacoes',  icon: Bell,          label: 'Notificações',      sublabel: 'Push, email e frequência' },
  { key: 'seguranca',     icon: Lock,          label: 'Segurança',         sublabel: 'Senha, 2FA e sessões' },
  { key: 'aparencia',     icon: Palette,       label: 'Aparência',         sublabel: 'Tema, texto e idioma' },
  { key: 'verificacao',   icon: BadgeCheck,    label: 'Verificação',       sublabel: 'Estado e documentos' },
  { key: 'feed',          icon: Rss,           label: 'Feed e Conteúdo',   sublabel: 'Preferências e interesses' },
  { key: 'mensagens',     icon: MessageSquare, label: 'Mensagens',         sublabel: 'Leitura e arquivo' },
  { key: 'dados',         icon: Database,      label: 'Dados e Conta',     sublabel: 'Exportar ou apagar conta' },
  { key: 'ajuda',         icon: HelpCircle,    label: 'Ajuda e Suporte',   sublabel: 'FAQ, suporte e sobre' },
]

export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(null)

  const handleLogout = () => { logout(); navigate('/') }

  const renderPage = () => {
    switch (page) {
      case 'conta':        return <ContaPage onBack={() => setPage(null)} user={user} updateUser={updateUser} />
      case 'privacidade':  return <PrivacidadePage onBack={() => setPage(null)} />
      case 'notificacoes': return <NotificacoesPage onBack={() => setPage(null)} />
      case 'seguranca':    return <SegurancaPage onBack={() => setPage(null)} />
      case 'aparencia':    return <AparenciaPage onBack={() => setPage(null)} />
      case 'verificacao':  return <VerificacaoPage onBack={() => setPage(null)} />
      case 'feed':         return <FeedPage onBack={() => setPage(null)} />
      case 'mensagens':    return <MensagensPage onBack={() => setPage(null)} />
      case 'dados':        return <DadosPage onBack={() => setPage(null)} />
      case 'ajuda':        return <AjudaPage onBack={() => setPage(null)} />
      default:             return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#000000]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6">
        {page ? renderPage() : (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white -ml-2">Configurações</h1>
            </div>

            {/* Perfil mini */}
            <Card className="p-4 mb-5 flex items-center gap-4">
              <UserAvatar name={user?.name} size="lg" />
              <div>
                <p className="font-bold text-neutral-900 dark:text-white">{user?.name}</p>
                <p className="text-sm text-neutral-500 dark:text-[#b0b3b8]">{stringifyUniversity(user?.university)}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-secondary-500" />
                  <span className="text-xs text-secondary-500 font-medium">Verificado</span>
                </div>
              </div>
            </Card>

            {/* Menu */}
            <Card className="overflow-hidden divide-y divide-neutral-100 dark:divide-[#2a2a2a] mb-5">
              {MENU_ITEMS.map(({ key, icon: Icon, label, sublabel }) => (
                <button key={key} onClick={() => setPage(key)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] transition-colors text-left">
                  <div className="w-9 h-9 bg-neutral-100 dark:bg-[#222222] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-neutral-600 dark:text-[#e4e6ea]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</p>
                    <p className="text-xs text-neutral-400 truncate">{sublabel}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                </button>
              ))}
            </Card>

            {/* Logout */}
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-semibold">
              <LogOut className="w-4 h-4" /> Terminar sessão
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
