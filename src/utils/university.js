// utils/university.js — Lógica de negócio para universidade como contexto

/**
 * Normaliza diferentes formatos de `university` para string.
 * Aceita string, object {id,name}, array, null.
 * Retorna null se input for null/undefined.
 */
export const stringifyUniversity = (university) => {
  if (university == null) return null
  if (typeof university === 'string') return university
  if (Array.isArray(university)) {
    return university.map(stringifyUniversity).filter(Boolean).join(', ')
  }
  if (typeof university === 'object') {
    if (typeof university.name === 'string') return university.name
    if (typeof university.id === 'string' || typeof university.id === 'number') return String(university.id)
  }
  return String(university)
}

/**
 * Extrai a sigla do padrão "SIGLA — Nome completo".
 * Retorna a string completa como fallback se não houver " — ".
 * Retorna null se input for null/undefined.
 */
export const getUniversityTag = (university) => {
  const u = stringifyUniversity(university)
  if (u == null) return null
  const parts = u.split(' — ')
  return parts.length > 1 ? parts[0].trim() : u
}

/**
 * Filtra array por campo university.
 * Se filter for 'Todas' ou null/undefined, retorna todos os items.
 */
export const filterByUniversity = (items, filter) => {
  if (!filter || filter === 'Todas') return items
  return items.filter((item) => item.university === filter)
}

/**
 * Aplica múltiplos filtros em intersecção.
 * filters é um objecto { university?, course? }
 * Ignora filtros com valor 'Todas', null ou undefined.
 */
export const applyFilters = (users, filters = {}) => {
  let result = users
  if (filters.university && filters.university !== 'Todas') {
    result = result.filter((u) => u.university === filters.university)
  }
  if (filters.course && filters.course !== 'Todas') {
    result = result.filter((u) => u.course === filters.course)
  }
  return result
}

/**
 * Retorna novo objecto com university actualizada.
 * Sempre define verified: false e verifiedUniversity: null.
 * NÃO muta o objecto original.
 */
export const updateUniversity = (user, novaUniversidade) => ({
  ...user,
  university: novaUniversidade,
  verified: false,
  verifiedUniversity: null,
})

/**
 * Se actor.id !== targetUserId, retorna { success: false }.
 * Caso contrário, retorna { success: true, user: updateUniversity(actor, novaUniversidade) }.
 */
export const updateUniversityAsActor = (actor, targetUserId, novaUniversidade) => {
  if (actor.id !== targetUserId) return { success: false }
  return { success: true, user: updateUniversity(actor, novaUniversidade) }
}

/**
 * Cria um novo grupo.
 * groupData: { name, description, university? }
 * Retorna novo grupo com adminIds: [user.id], moderatorIds: [], memberCount: 1, reported: false.
 * university é opcional (pode ser null).
 */
export const createGroup = (user, groupData) => ({
  id: Date.now(),
  name: groupData.name,
  description: groupData.description,
  university: groupData.university ?? null,
  adminIds: [user.id],
  moderatorIds: [],
  memberCount: 1,
  reported: false,
})

/**
 * Retorna true se user.id está em group.adminIds ou group.moderatorIds.
 */
export const canManageGroup = (user, group) =>
  group.adminIds.includes(user.id) || group.moderatorIds.includes(user.id)

/**
 * Retorna true se user.accountType === 'university'.
 */
export const isUniversityEntity = (user) => user?.accountType === 'university'

/**
 * Valida e simula submissão de documentação de verificação.
 * document pode ser null, string vazia, ou objecto.
 * Se document for inválido, retorna { success: false, message: string }.
 * Se document for válido (tem type e size > 0), retorna { success: true }.
 */
export const submitVerification = (user, document) => {
  if (
    document == null ||
    document === '' ||
    typeof document !== 'object' ||
    !document.type ||
    !(document.size > 0)
  ) {
    return { success: false, message: 'Documento inválido. Por favor submeta um ficheiro com tipo e tamanho válidos.' }
  }
  return { success: true }
}

/**
 * Array mutável de eventos de segurança.
 */
export const securityLog = []

/**
 * Adiciona { timestamp: Date.now(), description } ao securityLog.
 */
export const logSecurityEvent = (description) => {
  securityLog.push({ timestamp: Date.now(), description })
}

/**
 * Se isUniversityEntity(actor), chama logSecurityEvent e retorna { success: false }.
 * Caso contrário, retorna { success: true }.
 */
export const guardAction = (actor, action) => {
  if (isUniversityEntity(actor)) {
    logSecurityEvent(`Acção bloqueada para entidade universitária: ${action}`)
    return { success: false }
  }
  return { success: true }
}
