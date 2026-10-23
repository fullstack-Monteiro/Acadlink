# AcadLink — Estrutura Detalhada de Telas

> Documento de referência para replicar o frontend em outro projeto.  
> Stack: React 18 + Vite + Tailwind CSS + React Router v6 + Lucide React

---

## Índice

1. [Estrutura de Rotas](#rotas)
2. [Providers e Contextos](#providers)
3. [Autenticação](#auth)
   - [Splash](#1-splash)
   - [Welcome](#2-welcome)
   - [Login](#3-login)
   - [Register](#4-register)
   - [Reset Password](#5-resetpassword)
   - [Google Onboarding](#6-googleonboarding)
4. [App Principal](#app-principal)
   - [Dashboard](#7-dashboard)
   - [Profile](#8-profile)
   - [PublicProfile](#9-publicprofile)
   - [Messages](#10-messages)
   - [CallScreen](#11-callscreen)
   - [Notifications](#12-notifications)
   - [Explore](#13-explore)
   - [Groups](#14-groups)
   - [Opportunities](#15-opportunities)
   - [Library](#16-library)
   - [Saved](#17-saved)
   - [Settings](#18-settings)
5. [Reels](#reels)
   - [ReelFeed](#19-reelfeed)
   - [ReelSearch](#20-reelsearch)
   - [ReelTrending](#21-reeltrending)
   - [ReelAnalytics](#22-reelanalytics)
6. [Criação de Conteúdo](#criacao)
   - [CreatePost](#23-createpost)
   - [CreateStory](#24-createstory)
7. [Componentes Partilhados](#componentes)
8. [Design System](#design-system)

---

## Rotas

```
/                       → redirect para /login
/welcome                → Welcome
/login                  → Login
/register               → Register
/reset-password         → ResetPassword
/onboarding/google      → GoogleOnboarding

/dashboard              → Dashboard
/profile                → Profile (próprio)
/profile/:userId        → PublicProfile
/create-post            → CreatePost
/messages               → Messages
/groups                 → Groups
/explore                → Explore
/saved                  → Saved
/notifications          → Notifications
/settings               → Settings
/opportunities          → Opportunities
/library                → Library

/reels                  → ReelFeed
/reels/search           → ReelSearch
/reels/trending         → ReelTrending
/reels/analytics/:id    → ReelAnalytics

/create-story           → CreateStory
*                       → redirect para /
```

**BottomNav** aparece em todas as rotas privadas (quando user está autenticado).  
**Rotas de auth** (`/`, `/welcome`, `/login`, `/register`, `/reset-password`, `/onboarding/google`) não mostram BottomNav.

---

## Providers

Ordem de encapsulamento (de fora para dentro):

```
GoogleOAuthProvider
  ThemeProvider
    AuthProvider
      PostsProvider
        ReelsProvider
          MessagesProvider
            NotificationsProvider
              BrowserRouter
```

| Provider | Contexto | O que fornece |
|---|---|---|
| `AuthProvider` | `useAuth()` | user, login, logout, register, portfolio, connections |
| `PostsProvider` | `usePosts()` | posts[], toggleSave, addPost, isReady |
| `MessagesProvider` | `useMessages()` | convs[], sendMessage, markRead, deleteMessage |
| `NotificationsProvider` | `useNotifications()` | notifications[], markRead, markAllRead |
| `ReelsProvider` | `useReels()` | reels[], loadMore, getTrending, follow |
| `ThemeProvider` | `useTheme()` | theme, setTheme (system/light/dark) |

---

## Auth

### 1. Splash
**Rota:** não tem rota — era o ecrã inicial, agora substituído por redirect direto para `/login`

**Layout:**
```
┌─────────────────────────────┐
│                             │
│                             │
│         [LOGO]              │
│          h-64               │
│                             │
│      ● ● ●  (bounce)        │
│                             │
└─────────────────────────────┘
```

- Fundo: `bg-black` 100%
- Logo grande centrado com fade-in + scale (1000ms)
- 3 bolinhas `animate-bounce` com delay escalonado
- Cores das bolinhas: `#1D6AFF`, `#00A3FF`
- Navega automaticamente após 7s para `/dashboard` (se auth) ou `/login`
- Guard `navigatedRef` para evitar dupla navegação

---

### 2. Welcome
**Rota:** `/welcome`

**Layout:**
```
┌─────────────────────────────┐
│                             │
│         [LOGO]              │
│                             │
│   [Criar conta]             │
│   [Já tenho conta]          │
│                             │
│   © 2024 AcadLink           │
└─────────────────────────────┘
```

- Fundo: `bg-neutral-50 dark:bg-[#000000]`
- Logo `/logo.png` a `w-64`
- Animações `animate-slide-up` e `animate-fade-in`
- Botão "Criar conta" → `/register`
- Botão "Já tenho conta" → `/login`

---

### 3. Login
**Rota:** `/login`

**Layout (desktop: 2 painéis | mobile: só formulário):**
```
┌─────────────────┬──────────────────────┐
│                 │  Entrar              │
│  AuthSidebar    │  ──────────────────  │
│  (imagens +     │  [email]        ✓    │
│   frases        │  [password]  👁       │
│   motivacionais)│  □ Lembrar-me        │
│                 │  Esqueci a senha     │
│                 │  ──────────────────  │
│                 │  [Entrar]            │
│                 │  ──────────────────  │
│                 │  G  Continuar Google │
│                 │  M  Continuar Micro  │
│                 │  GH Continuar GitHub │
│                 │  ──────────────────  │
│                 │  Sem conta? Registe  │
└─────────────────┴──────────────────────┘
```

**Componentes:** `AuthSidebar`, `Button`, `Input`, `ErrorAlert`, `ForgotPasswordModal`, `GoogleIcon`, `MicrosoftIcon`, `GithubIcon`

**Estados:**
- Validação de email em tempo real → ícone `CheckCircle` verde quando válido
- Checkbox "Lembrar-me" — salva email no `localStorage`
- Sistema de bloqueio por tentativas (`useLoginAttempts`):
  - Aviso amarelo quando restam < 3 tentativas
  - Botão desativado com countdown quando bloqueado
- `ForgotPasswordModal` no clique de "Esqueci a senha"

**Login Social:**
- Google → OAuth real via `@react-oauth/google`; novo utilizador → `/onboarding/google`; existente → `/dashboard`
- Microsoft e GitHub → mock com `localStorage`

**Design:**
- Card: `rounded-2xl border border-neutral-100 dark:border-[#3a3b3c] shadow-card`
- Fundo: `dark:bg-[#0d0d0d]`
- Botão primário: `bg-primary-600`
- Input: `rounded-xl`
- Autofocus no campo email

---

### 4. Register
**Rota:** `/register`

**Layout:** idêntico ao Login (AuthSidebar + formulário)

**Campos:**
```
Nome completo
Email
Universidade (texto livre)
Curso (texto livre)
Senha           [👁 toggle]
Confirmar Senha [👁 toggle]
Bio             [máx 160 chars com contador]
```

**Componentes:** `AuthSidebar`, `Button`, `GoogleIcon`, `MicrosoftIcon`, `GithubIcon`

**Design:** idêntico ao Login; bio com `resize-none`; contador de caracteres restantes.

---

### 5. ResetPassword
**Rota:** `/reset-password?token=...&email=...`

**Layout:**
```
┌──────────────────────────────┐
│  ██████ (header gradiente)   │
│     Redefinir Senha          │
├──────────────────────────────┤
│  [Nova Senha]                │
│  [Confirmar Senha]           │
│  ──────────────────          │
│  [Redefinir Senha]           │
│  Voltar ao Login             │
└──────────────────────────────┘
```

- Lê `token` e `email` dos query params
- Se inválidos → estado de erro + botão "Voltar ao Login"
- Validações: obrigatório, senhas iguais, mínimo 8 caracteres
- Sucesso → mensagem verde + redirect para `/login` em 2s
- Header do card: `bg-gradient-to-r from-blue-600 to-purple-600`
- Fundo: `bg-gradient-to-b from-white to-blue-50 dark:from-[#18191a] dark:to-[#0f1419]`

---

### 6. GoogleOnboarding
**Rota:** `/onboarding/google`

**Layout:**
```
┌──────────────────────────────┐
│      🎓 Bem-vindo!           │
│      [Nome do Google]        │
│                              │
│   ① ────────── ②             │
│   (stepper 2 passos)         │
│                              │
│  Step 1: Universidade        │
│           Curso              │
│           Ano curricular     │
│                              │
│  Step 2: Bio (opcional)      │
│                              │
│  [Continuar] / [Pular]       │
└──────────────────────────────┘
```

- Recebe `googleUser` via `location.state`
- Step 1: Universidade (obrigatório), Curso (obrigatório), Ano (select 1–6)
- Step 2: Bio textarea opcional (máx 300 chars)
- "Preencher mais tarde" salta o onboarding
- Stepper: círculos numerados + linha de progresso
- Ao submeter: `PUT /users/update_profile/` + `PATCH` para bio

---

## App Principal

### 7. Dashboard
**Rota:** `/dashboard`

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Navbar]                               │
├──────────────────────────┬──────────────┤
│                          │              │
│  [Stories carrossel]     │  [Sidebar]   │
│                          │  300px       │
│  [PostCard]              │  (hidden     │
│  [PostCard]              │   mobile)    │
│  [PostCard]              │              │
│  ...                     │              │
│                          │              │
├──────────────────────────┴──────────────┤
│  [BottomNav]  (mobile)                  │
└─────────────────────────────────────────┘
```

**Componentes:** `Navbar`, `Sidebar`, `Stories`, `PostCard` (via `AnimatedPost`), `SkeletonPost`, `Skeleton`, `EmptyState`, `ErrorState`

**Funcionalidades:**
- Pull-to-refresh com indicador `RefreshCw` animado
- Animação de entrada dos posts ao scroll (`IntersectionObserver`, threshold 0.2)
- Stories horizontais no topo do feed
- Sidebar visível só em desktop (lg+) com skeleton durante loading
- 3 estados: loading (skeleton) → erro (ErrorState + retry) → vazio (EmptyState + CTA) → posts
- Grid: `grid-cols-1 lg:grid-cols-[1fr_300px]`
- Padding bottom: `pb-24 md:pb-6`

---

### 8. Profile
**Rota:** `/profile`

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Navbar]                               │
├─────────────────────────────────────────┤
│  [Cover gradient]                [✏ Ed] │
│  [Avatar + câmera] [Editar perfil]      │
│                                         │
│  Nome   @username  [✓ Verificado]       │
│  Bio                                    │
│  🎓 Universidade · Curso · Ano          │
│  📍 Localização                         │
│                                         │
│  42 Posts   156 Conexões                │
├─────────────────────────────────────────┤
│  Posts | Portfólio | Conquistas | Conex │
├─────────────────────────────────────────┤
│  [Conteúdo da tab]                      │
└─────────────────────────────────────────┘
```

**Tabs:**

| Tab | Conteúdo |
|---|---|
| Posts | Lista de posts do utilizador via `PostCard` |
| Portfólio | Lista de itens (projeto, certificado...) + botão adicionar + `PortfolioModal` |
| Conquistas | Agrupadas por tipo (prémio, certificado, reconhecimento) |
| Conexões | Grid de conexões atuais + tipo (colega/universitário/mentor) + sugestões inteligentes |

**Funcionalidades:**
- Cover editável (input file oculto)
- Avatar editável com botão câmera
- "Editar perfil" → `/settings`
- Conexões clicável → `UsersListModal`
- Sugestões inteligentes: mesmo curso outra uni, conexões em comum

**Design:**
- Cover: `bg-gradient-to-r from-primary-900 via-brand-500 to-accent-500`
- Tab ativa: `border-b-2 border-primary-600`
- Avatar ring: `ring-4 ring-white dark:ring-[#0d0d0d]`

---

### 9. PublicProfile
**Rota:** `/profile/:userId`

**Layout:** idêntico ao Profile mas sem edição

**Diferenças para o Profile:**
- Dados do utilizador buscados via `userId` em `ALL_USERS` mock
- Se `userId` === próprio user → redirect para `/profile`
- Botão "Mensagem" → cria/obtém conversa via `MessagesContext` → navega para `/messages?conv=ID`
- Botão "Conectar" / "Conectado" com toggle
- Sem funcionalidade de edição (sem câmera, sem "Editar perfil")
- Portfólio sempre vazio para outros utilizadores

---

### 10. Messages
**Rota:** `/messages`

**Layout (desktop: 2 painéis | mobile: alternado):**
```
┌────────────────────────┬────────────────────────────┐
│  Mensagens    ⚙        │  [Nome]  🟢 Online          │
│  ─────────────────     │  [📞] [📹] [ℹ]             │
│  [🔍 Pesquisar]        ├────────────────────────────┤
│  ─────────────────     │                            │
│  Todas|Não lidas|Grp   │  [mensagens]               │
│  ─────────────────     │  [mensagens]               │
│  [ConvItem]            │  [mensagens]               │
│  [ConvItem]            │                            │
│  [ConvItem]            ├────────────────────────────┤
│  ...                   │  ┌──────────────────────┐  │
│                        │  │ 📎 😊 ↩  [input] [➤]│  │
│                        │  └──────────────────────┘  │
└────────────────────────┴────────────────────────────┘
```

**Componentes:** `UserAvatar`, `EmptyState`, `ErrorState`, `CallScreen`, `Skeleton`

**Funcionalidades da lista:**
- Pesquisa por nome/mensagem
- Filtros: Todas | Não lidas | Grupos
- Indicadores de status: 🟢 online / 🟡 away / ⚫ offline
- Badge de não lidas (pill azul)
- Suporte a grupos (avatar gradiente + Users icon) e canais (🎓 emoji)
- Skeleton loading durante carregamento

**Funcionalidades do chat:**
- Pesquisa dentro do chat (`chatSearch`, highlight nos resultados)
- Mensagens fixadas (pin) com indicador no topo
- Reply por swipe ou botão (mostra preview da mensagem respondida)
- Emoji picker com 6 reações por mensagem
- Anexos: imagem, PDF, DOC (input file)
- Context menu (longo clique): responder, fixar, apagar
- Indicador "a escrever…" (3 bolinhas animadas)
- Chamadas de voz/vídeo → abre `CallScreen` em fullscreen
- Painel de info da conversa (desktop)
- Silenciar conversa
- Auto-scroll para última mensagem

**MessageBubble:**
- Bordas assimétricas baseadas em mensagens consecutivas do mesmo autor
- Enviadas: `bg-primary-600 text-white` (alinhadas à direita)
- Recebidas: `bg-neutral-100 dark:bg-[#2a2a2a]` (alinhadas à esquerda)
- Highlight em texto pesquisado

---

### 11. CallScreen
**Componente:** `src/components/calls/CallScreen.jsx` (modal, sem rota)

**Sub-componentes:**
- `StatusBar` — hora, sinal, wifi, bateria no topo
- `CallHeader` — logo Acadlink + nome da chamada + duração + ações (settings, menu)
- `ControlButton` — botão circular com label e variantes (default, danger, active)
- `SelfViewPiP` — self-view picture-in-picture no canto inferior direito
- `VideoCallScreen` — tela de videochamada
- `VoiceCallScreen` — tela de chamada de voz
- `IncomingCallScreen` — tela de chamada a entrar

**Layout VideoCallScreen:**
```
┌─────────────────────────────────┐
│ 12:34    ▲▲▼ WiFi 78%    [status]│
│ ← [🎓] Acadlink    08:24  ⚙  ⋮  │
├─────────────────────────────────┤
│                                 │
│   [Vídeo remoto - fullscreen]   │
│                        ┌──────┐ │
│                        │self  │ │
│                        │view  │ │
│                        │      │ │
│                        │Ana   │ │
│                        │Silva │ │
│                        └──────┘ │
├─────────────────────────────────┤
│  🎤   📹  📤      👥     🔴     │
│ Micr  Câm  Part  Parti  Termin  │
└─────────────────────────────────┘
```

**Props do CallScreen:**
```js
{
  user,                  // { name, ... }
  callType = 'voice',    // 'voice' | 'video'
  onEnd,
  remoteStream = null,
  localStream = null,
  incoming = false,
  onAccept = null,
  onReject = null,
  onBack = null,
}
```

**Estados internos:** `isMuted`, `isVideoOn`, `duration` (timer com setInterval), `remoteVideoRef`, `localVideoRef`

**Comportamentos:**
- ESC fecha/rejeita
- Auto-hide dos controlos após 4s de inatividade (video call)
- PiP mostra UserAvatar quando sem stream real
- SelfViewPiP exibe ícone de mudo quando muted

---

### 12. Notifications
**Rota:** `/notifications`

**Layout:**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  ← Notificações   [Ler tudo]    │
├─────────────────────────────────┤
│  Tudo | Reações | Conexões      │
├─────────────────────────────────┤
│  [Avatar] Fulano curtiu…  2m    │
│  ❤ [não lido]                   │
│                                 │
│  [Avatar] Fulano quer conet…    │
│  [Aceitar] [Recusar]            │
│  ...                            │
└─────────────────────────────────┘
```

**Tabs:** Tudo | Reações | Conexões

**Tipos de notificação + ícones:**
- Like → ❤️ vermelho
- Comment → 💬 azul
- Connect → 👤+ verde
- Opportunity → 💼 âmbar

**Funcionalidades:**
- Marcar todas como lidas
- Marcar uma individualmente ao clicar
- Pedidos de conexão: botões "Aceitar" e "Recusar" inline
- Clique → navega para `/profile/:userId`

**Design:**
- Não lida: `bg-primary-50 dark:bg-white/5` + badge azul
- Lida: `bg-white dark:bg-[#1e1e1e]`

---

### 13. Explore
**Rota:** `/explore`

**Layout:**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  [🔍 Pesquisar...          ✕]   │
├─────────────────────────────────┤
│  Pessoas | Posts | Hashtags     │
├─────────────────────────────────┤
│  [Filtros de universidade]      │  ← só tab Pessoas
│  ─────────────────────────────  │
│  [Resultado] [Resultado]        │
│  [Resultado] [Resultado]        │
│  ...                            │
└─────────────────────────────────┘
```

**Tabs:**

| Tab | Conteúdo |
|---|---|
| Pessoas | Filtros de universidade (scroll horizontal) + grid 2 colunas + botão Conectar/Conectado |
| Posts | Lista filtrada por query text |
| Hashtags | Grid 2 colunas com ícone TrendingUp + contagem de posts + posição #1 #2 |

**Funcionalidades:**
- Search bar com botão clear
- Query param `?q=` lido ao montar
- Se `q` começa com `#` → abre tab Hashtags automaticamente
- Contador de resultados encontrados

---

### 14. Groups
**Rota:** `/groups`

**Layout (lista):**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  Grupos             [+ Criar]   │
│  [🔍 Pesquisar]                 │
├─────────────────────────────────┤
│  Os meus grupos                 │
│  [GroupCard]                    │
│  [GroupCard]                    │
│                                 │
│  Descobrir                      │
│  [GroupCard]                    │
│  [GroupCard]                    │
└─────────────────────────────────┘
```

**Layout (detalhe do grupo):**
```
┌─────────────────────────────────┐
│  [Cover gradient]               │
│  [Nome] [🔒] [membros]          │
│  [Sair/Entrar]                  │
├─────────────────────────────────┤
│  Publicações | Membros          │
├──────────────────┬──────────────┤
│  [Criar post]    │ Sobre        │
│  (só membros)    │ Admins       │
│  [Post]          │ Atividade    │
│  [Post]          │              │
└──────────────────┴──────────────┘
```

**Funcionalidades:**
- Pesquisa por nome/descrição
- `CreateGroupModal` para criar grupo
- Toggle Entrar/Sair por grupo
- Tabs no detalhe: Publicações | Membros
- Grid de membros com badge Admin
- Grupos públicos vs fechados (ícone 🔒)

---

### 15. Opportunities
**Rota:** `/opportunities`

**Layout:**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  [Avatar] No que estás… [Post]  │  ← caixa partilha rápida
├─────────────────────────────────┤
│  [🔍 Pesquisar]                 │
├─────────────────────────────────┤
│  Todos|Vagas|Eventos|Académico  │
├─────────────────────────────────┤
│  [PostCard]                     │
│  [PostCard]                     │
└─────────────────────────────────┘
```

**Filtros de categoria:** Todos | Vagas/Estágios/Bolsas | Eventos | Académico

**Funcionalidades:**
- Caixa de partilha rápida inline → redireciona para `/create-post`
- Pesquisa por texto (conteúdo + autor)
- Feed filtrado por categoria a partir do `PostsContext`

---

### 16. Library
**Rota:** `/library`

**Layout:**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  Biblioteca        [+ Partilhar]│
│  [🔍 Pesquisar]                 │
│  [▾ Tipo] [▾ Universidade]      │
│           [▾ Curso]             │
├─────────────────────────────────┤
│  [DocCard]                      │
│  [DocCard]                      │
└─────────────────────────────────┘
```

**DocCard:**
- Ícone por formato: 📄 PDF, 📊 PPT, 📝 DOC
- Título, autor com avatar, universidade
- Avaliação em estrelas interativa (1–5)
- Contador de downloads
- Botão guardar (★)

**Funcionalidades:**
- Pesquisa por: título, descrição, tipo, universidade, curso, autor, formato
- Filtros dropdown: Tipo, Universidade, Curso
- "Partilhar" → `UploadDocumentModal`
- Dados de `LIBRARY_DOCS` mock

---

### 17. Saved
**Rota:** `/saved`

**Layout (coleções):**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  Guardados                      │
├─────────────────────────────────┤
│  [🗂 Todos os guardados  (12)]  │
│  [⭐ Favoritos           (5) ]  │
│  [📚 Artigos             (3) ]  │
│  ...                            │
└─────────────────────────────────┘
```

**Layout (detalhe de coleção):**
```
┌─────────────────────────────────┐
│  ← [Nome da coleção]  [🗑 Apag] │
├─────────────────────────────────┤
│  [PostCard]                     │
│  [PostCard]                     │
└─────────────────────────────────┘
```

**Funcionalidades:**
- "Todos os guardados" é uma coleção virtual sempre presente
- Coleções com emoji, nome, contagem de posts
- Apagar coleção (exceto "Todos")
- Empty state quando sem posts guardados

---

### 18. Settings
**Rota:** `/settings`

**Layout (menu principal):**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  ← Configurações                │
│                                 │
│  [Avatar] Nome  Universidade    │
│           ✓ Verificado          │
├─────────────────────────────────┤
│  👤 Conta e Perfil           >  │
│  🔒 Privacidade              >  │
│  🔔 Notificações             >  │
│  🎨 Aparência                >  │
│  ✅ Verificação               >  │
│  📰 Feed e Conteúdo          >  │
│  💬 Mensagens                >  │
│  📊 Os meus dados            >  │
│  ❓ Ajuda e suporte          >  │
├─────────────────────────────────┤
│  [Terminar sessão] (vermelho)   │
└─────────────────────────────────┘
```

**Sub-páginas (navegação interna — sem nova rota):**

| Sub-página | Conteúdo |
|---|---|
| Conta e Perfil | Upload foto (com progress %), upload capa, nome, email, tel, data nasc., universidade, curso, ano, nº estudante, `ChangeEmailModal` |
| Privacidade | Visibilidade do perfil (público/estudantes/conexões/privado), quem pode enviar mensagens, ver conexões, ver posts, comentar, aparecer em sugestões |
| Notificações | Toggles push (mensagens, conexões, likes, comentários, menções, grupos, oportunidades) + email (semanal, oportunidades) + frequência (tempo real/horária/diária) |
| Aparência | Tema (Sistema/Light/Dark) via ThemeContext, tamanho de fonte, idioma |
| Verificação | Badge verificado + email institucional |
| Feed e Conteúdo | Prefs do feed (conexões primeiro, oportunidades em destaque, grupos) + categorias de interesse (6 toggles) |
| Mensagens | Confirmação de leitura, preview notificações, arquivar automático |
| Os meus dados | Exportar como CSV, terminar outras sessões, apagar conta |
| Ajuda e suporte | FAQ, bug report, reportar utilizador, suporte. Versão 1.0.0. Termos/privacidade |

**Componentes internos (declarados dentro do ficheiro):**
- `Toggle` — pill animado on/off
- `Row` — linha de menu com ícone + label + value + chevron
- `Section` — card com `divide-y` entre rows
- `SubPage` — wrapper com botão voltar

---

## Reels

### 19. ReelFeed
**Rota:** `/reels`

**Layout (fullscreen, sem Navbar):**
```
┌─────────────────────────────────┐
│  [X fechar]         [∧ cima]    │
│                                 │
│                                 │
│   [ReelPlayer - fullscreen]     │
│   Vídeo + áudio                 │
│                     [❤ 1.2k]   │
│                     [💬 234]    │
│                     [↗ 89]     │
│                     [follow]    │
│                                 │
│  @autor  · Descrição            │
│  #hashtag                       │
│                                 │
│  [∨ baixo]                      │
└─────────────────────────────────┘
```

**Navegação:**
- Scroll vertical (wheel deltaY)
- Touch swipe vertical
- Setas ChevronUp/ChevronDown sobrepostas
- Throttle 300ms entre reels
- `loadMoreReels` quando próximo do fim
- Botão `X` fecha (chama `onClose` → `window.history.back()`)

**Funcionalidades:**
- Seguir/não seguir criadores inline
- Pull-to-refresh
- Loading e estados de erro

---

### 20. ReelSearch
**Rota:** `/reels/search`

**Layout:**
```
┌─────────────────────────────────┐
│  [← ] [🔍 Pesquisar reels  ] [▼]│
├─────────────────────────────────┤
│  (filtros expansíveis)          │
│  Categorias: [Tech] [Arte]...   │
│  Ordenar: Recentes / Views      │
│  Views mínimas: ──●──── 500     │
├─────────────────────────────────┤
│  [ReelCard] [ReelCard]          │
│  [ReelCard] [ReelCard]          │
└─────────────────────────────────┘
```

**Funcionalidades:**
- Busca com debounce 300ms (mínimo 2 chars)
- Histórico de buscas (`localStorage`, máx 10)
- Filtros avançados: categorias multi-select, ordenação, views mínimas (slider)
- Grid responsivo: 2/3/4 colunas

---

### 21. ReelTrending
**Rota:** `/reels/trending`

**Layout:**
```
┌─────────────────────────────────┐
│  🔥 Em Alta                     │
├─────────────────────────────────┤
│  [Todos] [Tech] [Arte] [Ciência]│  ← filtro por categoria
├─────────────────────────────────┤
│  Tecnologia                     │
│  #1 [ReelCard] [ReelCard]       │
│     [ReelCard] [ReelCard]       │
│                                 │
│  Arte                           │
│  #1 [ReelCard] [ReelCard]       │
└─────────────────────────────────┘
```

**Funcionalidades:**
- Agrupa reels por categoria
- Filtro por categoria (null = Todos)
- Badge `#1 #2 #3` nos primeiros 3 de cada grupo (fundo laranja)
- Hover mostra score de engajamento (likes + comments×2 + shares×1.5)

---

### 22. ReelAnalytics
**Rota:** `/reels/analytics/:reelId`

**Layout:**
```
┌─────────────────────────────────┐
│  ← Analytics: [título do reel]  │
├─────────────────────────────────┤
│  [Views] [Likes] [Coment] [Eng] │  ← grid 4 colunas
├─────────────────────────────────┤
│  [Shares] [Salvos] [Conclusão]  │  ← grid 3 colunas
├─────────────────────────────────┤
│  Visualizações (últimos 7 dias) │
│  [Gráfico barras CSS]           │
├─────────────────────────────────┤
│  Dados demográficos             │
│  Engenharia     ████████ 35%    │
│  Administração  ██████   25%    │
│  ...                            │
├─────────────────────────────────┤
│  [Exportar CSV] [Partilhar]     │
└─────────────────────────────────┘
```

**Métricas calculadas:**
- Views, unique views, likes, comments, shares, saves
- Engagement rate: `(likes + comments + shares) / views * 100`
- Avg watch time: mock 45s
- Completion rate: mock 65%

---

## Criação de Conteúdo

### 23. CreatePost
**Rota:** `/create-post`

**Layout:**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  ← Nova Publicação              │
├─────────────────────────────────┤
│  Texto|Imagem|Link|Sondagem|Con │  ← tipo de post
├─────────────────────────────────┤
│  [Avatar] Para: [▾ Público]     │
│                                 │
│  [textarea - 500 chars]         │
│  (conteúdo varia por tipo)      │
│                                 │
│  Categoria: Académico|Opor|Ev   │
├─────────────────────────────────┤
│  [Publicar]                     │
└─────────────────────────────────┘
```

**Tipos de post:**

| Tipo | Campos extra |
|---|---|
| Texto | textarea 500 chars |
| Imagem | textarea + input file + preview com botão remover |
| Link | textarea + input URL |
| Sondagem | pergunta + 2–4 opções (add/remove) + duração (1h/24h/7 dias) |
| Conquista | título + descrição opcional |

**Funcionalidades:**
- Visibilidade: Público / Só conexões
- Categorias: Académico | Oportunidade | Evento
- Submit: `addPost` do `PostsContext` → redirect para `/dashboard`
- Botão "Publicar" desativado se inválido

---

### 24. CreateStory
**Rota:** `/create-story`

**Layout:**
```
┌─────────────────────────────────┐
│  [Navbar]                       │
├─────────────────────────────────┤
│  Criar Story                    │
├─────────────────────────────────┤
│  Adicionar mídia:               │
│  [📷] [🖼] [📄] [🎬] [T]       │  ← câmera, galeria, doc, vídeo, texto
│                                 │
│  Ferramentas:                   │
│  [😀] [T] [✏] [⭐] [📍] [♪] [🔗]│
│                                 │
│  Cards académicos:              │
│  [📄 Doc] [📚 Disciplina]       │
│  [📅 Evento] [🏆 Conquista]     │
│  [🎓 Mini Aula]                 │
├─────────────────────────────────┤
│  Privacidade:                   │
│  ○ Público  ○ Amigos            │
│  ○ Colegas  ○ Só eu             │
├─────────────────────────────────┤
│  Partilhar em grupos:           │
│  [toggle por grupo]             │
├─────────────────────────────────┤
│  [Partilhar Story]              │
└─────────────────────────────────┘
```

---

## Componentes

### Layout (`src/components/layout/`)

| Componente | Descrição |
|---|---|
| `Navbar` | Barra superior: logo, pesquisa, ícone notificações (badge), avatar → `/settings` |
| `Sidebar` | Desktop only: sugestões de conexão, grupos sugeridos, oportunidades |
| `BottomNav` | Mobile: Dashboard, Explorar, + (CreatePost), Mensagens, Perfil |
| `BackButton` | Botão voltar reutilizável com ChevronLeft |
| `AuthSidebar` | Painel lateral das páginas de auth com imagens e frases motivacionais |

**BottomNav ícones:**
```
🏠         🔍         ✚         💬         👤
Dashboard  Explorar  CriarPost  Mensagens  Perfil
```

---

### Feed (`src/components/feed/`)

| Componente | Descrição |
|---|---|
| `PostCard` | Card completo: autor, conteúdo, imagem, reações (like/love/etc.), comentários, partilha, guardar, `SaveToCollectionModal` |
| `Stories` | Carrossel horizontal de stories com `StoryCreator` (1º item) |
| `StoryCreator` | Botão "+ Story" com avatar do utilizador |
| `MentionInput` | Input com suporte a @menções |

**PostCard estados:**
- Like com 6 reações (longo toque abre picker)
- Comentários inline (expansível)
- Partilha via Web Share API / clipboard
- Guardar → `SaveToCollectionModal`

---

### UI (`src/components/ui/`)

| Componente | Props principais | Descrição |
|---|---|---|
| `UserAvatar` | `name`, `size` (xs/sm/md/lg/xl), `src` | Avatar com iniciais e cor gerada por hash do nome |
| `Button` | `variant` (primary/outline/ghost/danger), `size`, `loading`, `disabled` | Botão base |
| `Card` | `className` | Wrapper com bordas e sombra |
| `Skeleton` | `circle`, `className` | Placeholder shimmer animado |
| `SkeletonPost` | — | Skeleton completo de um PostCard |
| `SkeletonGroup` | `className` | Wrapper para grupo de skeletons |
| `EmptyState` | `icon`, `title`, `subtitle`, `action` | Estado vazio com ilustração |
| `ErrorState` | `title`, `subtitle`, `onRetry`, `scope`, `meta` | Estado de erro com retry |
| `Badge` | `color`, `size` | Pill colorido |
| `ErrorAlert` | `message`, `onClose`, `action` | Alerta de erro inline |
| `UniversityTag` | `university`, `size` | Tag de universidade com logo |
| `VerificationBadge` | `university`, `showLabel`, `size` | Badge ✓ verificado |

---

### Modais (`src/components/modals/`)

| Modal | Acionado por |
|---|---|
| `ForgotPasswordModal` | Clique "Esqueci a senha" no Login |
| `ChangeEmailModal` | Settings → Conta e Perfil |
| `CreateGroupModal` | Botão "+ Criar" em Groups |
| `UploadDocumentModal` | Botão "Partilhar" em Library |
| `SaveToCollectionModal` | Ícone guardar no PostCard |
| `TermsModal` | Links de termos/privacidade |

---

### Profile (`src/components/profile/`)

| Componente | Descrição |
|---|---|
| `UniversityTag` | Tag com logo e nome da universidade |
| `VerificationBadge` | Badge com checkmark de verificação |
| `PortfolioModal` | Modal para adicionar/editar item do portfólio |
| `UsersListModal` | Modal com lista de utilizadores (conexões, seguidores) |

---

### Reels (`src/components/reels/`)

| Componente | Descrição |
|---|---|
| `ReelPlayer` | Player fullscreen com controlos sobrepostos, ações (like, comment, share, follow) |
| `ReelCard` | Thumbnail do reel em grid (cover + views + duração + avatar autor) |

---

## Design System

### Paleta de Cores

```
Primary:   #1D6AFF  (azul principal — botões, links, badges)
Brand:     #00A3FF  (azul claro — gradientes, destaques)
Accent:    variável (roxo/verde — gradientes de capa)

Neutros Light:
  bg:      #FAFAFA (neutral-50)
  card:    #FFFFFF
  border:  #E5E7EB (neutral-200)
  text:    #111827 (neutral-900)
  subtext: #6B7280 (neutral-500)

Neutros Dark:
  bg:      #000000
  surface: #1E1E1E, #242526, #18191A
  card:    #1E1E1E
  border:  #2A2A2A, #3A3B3C
  text:    #E4E6EA
  subtext: #B0B3B8
```

### Border Radius

```
rounded-xl   → 12px  (inputs, botões, cards pequenos)
rounded-2xl  → 16px  (cards principais, modais)
rounded-3xl  → 24px  (PiP da chamada)
rounded-full → 50%   (avatares, badges, pills)
```

### Tipografia

```
Títulos de página:    text-xl font-bold
Subtítulos:          text-base font-semibold
Corpo:               text-sm
Metadados:           text-xs
Monoespaçado:        font-mono tabular-nums (timers, contadores)
```

### Animações

```css
animate-fade-in     → opacity 0→1 (300ms)
animate-slide-up    → translateY 20px→0 + opacity (400ms)
animate-bounce      → bounce infinito (delays escalonados)
animate-spin        → rotação 360° (loading)
animate-ping        → escala + opacity (anéis pulsantes)
animate-shimmer     → gradiente deslizante (skeleton)
```

### Breakpoints (Tailwind)

```
sm:   640px   (tablet pequeno)
md:   768px   (tablet)
lg:   1024px  (desktop — aparece Sidebar, 2 colunas)
xl:   1280px  (desktop grande)
```

### Shadows

```
shadow-card  → 0 2px 12px rgba(0,0,0,0.06)
shadow-lg    → sombra larga (botões danger/accept)
```

---

## Notas Técnicas

### Hooks customizados

```
useAuth()             → contexto de autenticação
usePosts()            → contexto de posts
useMessages()         → contexto de mensagens
useNotifications()    → contexto de notificações
useReels()            → contexto de reels
useTheme()            → contexto de tema
useScrollAnimation()  → IntersectionObserver para animar ao scroll
usePullToRefresh()    → drag-to-refresh com threshold e resistência
useLoginAttempts()    → controlo de tentativas de login
```

### Mock Data

Os dados ficam em `src/data/mock.js`:
- `ALL_USERS` — lista de utilizadores
- `LIBRARY_DOCS` — documentos da biblioteca
- `ACHIEVEMENTS` — conquistas
- `CATEGORIES` — categorias de reels

### Variáveis de Ambiente

```env
VITE_API_URL=https://api.acadlink.com
VITE_GOOGLE_CLIENT_ID=...
VITE_APP_ENV=production
VITE_MOCK_MODE=true
```

---

*Documento gerado em agosto de 2026 — AcadLink v1.0.0*
