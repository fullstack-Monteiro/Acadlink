/**
 * Mock interceptor — simula respostas da API quando VITE_MOCK_MODE=true
 */
import {
  ALL_USERS, POSTS, CONVERSATIONS, STORIES, OPPORTUNITIES,
  SUGGESTIONS, UNIVERSITIES,
} from '../data/mock.js'

const MOCK_USER = {
  id: 1,
  username: 'amina.machava',
  email: 'amina@gmail.com',
  first_name: 'Amina',
  last_name: 'Machava',
  university: { id: 1, name: 'UEM — Universidade Eduardo Mondlane', acronym: 'UEM', country: 'Moçambique', courses: [] },
  course: 'Engenharia Informática',
  year: '3º Ano',
  is_email_verified: true,
  is_university_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  profile: {
    avatar: null, cover: null, bio: 'Apaixonada por tecnologia 🚀', website: '',
    connections_count: 248, posts_count: 14, reels_count: 3,
    profile_visibility: 'public', receive_notifications: true, receive_emails: true,
  },
  portfolio_items: [],
}

const MOCK_TOKENS = { access_token: 'mock-access-token', refresh_token: 'mock-refresh-token' }

function paginate(items, params = {}) {
  const page = parseInt(params?.page) || 1
  const pageSize = parseInt(params?.page_size) || 20
  const start = (page - 1) * pageSize
  return {
    count: items.length,
    next: start + pageSize < items.length ? `?page=${page + 1}` : null,
    previous: page > 1 ? `?page=${page - 1}` : null,
    results: items.slice(start, start + pageSize),
  }
}

function ok(data) {
  return Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config: {} })
}

const routes = [
  { method: 'POST', pattern: /\/users\/login\/$/, handler: () => ok({ ...MOCK_TOKENS, user: MOCK_USER, detail: 'Login realizado com sucesso' }) },
  { method: 'POST', pattern: /\/users\/register\/$/, handler: () => ok({ ...MOCK_TOKENS, user: MOCK_USER, detail: 'Conta criada com sucesso' }) },
  { method: 'POST', pattern: /\/users\/logout\/$/, handler: () => ok({ detail: 'Logout realizado com sucesso' }) },
  { method: 'GET',  pattern: /\/users\/me\/$/,     handler: () => ok(MOCK_USER) },
  { method: 'PUT',  pattern: /\/users\/update_profile\/$/, handler: (cfg) => ok({ ...MOCK_USER, ...JSON.parse(cfg.data || '{}') }) },
  { method: 'POST', pattern: /\/users\/forgot_password\/$/, handler: () => ok({ detail: 'Se o email existe, receberás um link' }) },
  { method: 'POST', pattern: /\/users\/reset_password\/$/, handler: () => ok({ detail: 'Senha alterada com sucesso' }) },
  { method: 'POST', pattern: /\/users\/google_login\/$/, handler: () => ok({ ...MOCK_TOKENS, user: MOCK_USER, created: false }) },
  { method: 'POST', pattern: /\/auth\/token\/refresh\/$/, handler: () => ok({ access: 'mock-access-token', refresh: 'mock-refresh-token' }) },

  { method: 'GET', pattern: /\/users\/universities\//, handler: () =>
    ok(paginate(UNIVERSITIES.map((name, i) => ({ id: i + 1, name, acronym: name.split('—')[0].trim(), country: 'Moçambique', courses: [] }))))
  },

  { method: 'GET',    pattern: /\/posts\//, handler: (cfg) => ok(paginate(POSTS, cfg.params)) },
  { method: 'POST',   pattern: /\/posts\/$/, handler: (cfg) => ok({ id: Date.now(), author: MOCK_USER, reactions: {}, commentCount: 0, shares: 0, time: 'agora', saved: false, comments: [], ...JSON.parse(cfg.data || '{}') }) },
  { method: 'GET',    pattern: /\/posts\/\d+\//, handler: (cfg) => { const id = parseInt(cfg.url.match(/\/posts\/(\d+)\//)?.[1]); return ok(POSTS.find(p => p.id === id) || POSTS[0]) } },
  { method: 'DELETE', pattern: /\/posts\/\d+\//, handler: () => ok({ detail: 'Post eliminado' }) },

  { method: 'GET',  pattern: /\/connections\/$/, handler: () => ok(paginate(ALL_USERS.slice(0, 5).map(u => ({ id: u.id, from_user: MOCK_USER, to_user: u, status: 'accepted' })))) },
  { method: 'POST', pattern: /\/connections\/send_request\//, handler: () => ok({ detail: 'Pedido enviado' }) },
  { method: 'GET',  pattern: /\/connections\/suggestions\//, handler: () => ok(paginate(SUGGESTIONS)) },

  { method: 'GET',  pattern: /\/notifications\/$/, handler: () => ok(paginate([
    { id: 1, type: 'connection_request', message: 'Samuel Nhantumbo enviou-te um pedido', read: false, created_at: new Date().toISOString(), actor: ALL_USERS[1] },
    { id: 2, type: 'post_like', message: 'Fatima Cossa reagiu ao teu post', read: false, created_at: new Date().toISOString(), actor: ALL_USERS[2] },
  ])) },
  { method: 'POST', pattern: /\/notifications\/mark_all_read\//, handler: () => ok({ detail: 'Marcadas como lidas' }) },

  { method: 'GET', pattern: /\/messages\/$/, handler: () => ok(paginate(CONVERSATIONS)) },
  { method: 'GET', pattern: /\/messages\/\d+\//, handler: (cfg) => { const id = parseInt(cfg.url.match(/\/messages\/(\d+)\//)?.[1]); return ok(CONVERSATIONS.find(c => c.id === id) || CONVERSATIONS[0]) } },

  { method: 'GET',  pattern: /\/users\/portfolio\//, handler: () => ok({ count: 0, results: [], next: null, previous: null }) },
  { method: 'POST', pattern: /\/users\/portfolio\//, handler: (cfg) => ok({ id: Date.now(), ...JSON.parse(cfg.data || '{}') }) },

  { method: 'GET', pattern: /\/reels\//, handler: () => ok(paginate(STORIES)) },

  { method: 'GET', pattern: /\/users\/$/, handler: (cfg) => {
    const search = (cfg.params?.search || '').toLowerCase()
    const filtered = ALL_USERS.filter(u => !search || u.name.toLowerCase().includes(search) || u.username.includes(search))
    return ok(paginate(filtered))
  }},
]

export function installMockInterceptor(axiosInstance) {
  // Sobrescreve o adapter padrão para interceptar antes da rede
  axiosInstance.defaults.adapter = (config) => {
    const url = config.url || ''
    const method = (config.method || 'GET').toUpperCase()
    const route = routes.find(r => r.method === method && r.pattern.test(url))

    if (route) {
      return route.handler(config).then(res => ({ ...res, config }))
    }

    // Rota não mapeada — retorna erro claro em vez de tentar ligação real
    return Promise.reject({
      response: { data: { detail: `[Mock] Rota não mapeada: ${method} ${url}` }, status: 501, config },
      config,
      isAxiosError: true,
      message: `[Mock] Rota não mapeada: ${method} ${url}`,
    })
  }

  console.info('[Mock Mode] Ativo — backend não necessário')
}
