// Email validation - accept any valid email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}



// Name validation
export const isValidName = (name) => {
  return name.trim().length >= 3 && /^[a-záéíóúàâêôãõç\s'-]+$/i.test(name)
}

// Common weak passwords
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master'
]

export const isCommonPassword = (password) => {
  return COMMON_PASSWORDS.includes(password.toLowerCase())
}

// Password validation
export const validatePassword = (password) => {
  const strength = {
    score: 0,
    feedback: [],
    level: 'weak'
  }

  if (password.length >= 8) strength.score++
  else strength.feedback.push('Mínimo 8 caracteres')

  if (password.length >= 12) strength.score++
  if (/[a-z]/.test(password)) strength.score++
  else strength.feedback.push('Adiciona letras minúsculas')

  if (/[A-Z]/.test(password)) strength.score++
  else strength.feedback.push('Adiciona letras maiúsculas')

  if (/[0-9]/.test(password)) strength.score++
  else strength.feedback.push('Adiciona números')

  if (/[!@#$%^&*]/.test(password)) strength.score++
  else strength.feedback.push('Adiciona caracteres especiais')

  if (strength.score <= 2) strength.level = 'weak'
  else if (strength.score <= 4) strength.level = 'medium'
  else strength.level = 'strong'

  return strength
}

// Error message mapping
export const getErrorMessage = (error) => {
  if (!error) return ''

  // Handle object errors from backend
  if (typeof error === 'object') {
    if (error.email) {
      const msg = Array.isArray(error.email) ? error.email[0] : error.email
      return msg || 'Email inválido'
    }
    if (error.username) {
      const msg = Array.isArray(error.username) ? error.username[0] : error.username
      return msg || 'Nome de utilizador já existe'
    }
    if (error.password) {
      const msg = Array.isArray(error.password) ? error.password[0] : error.password
      return msg || 'Senha inválida'
    }
    if (error.detail) {
      return error.detail
    }
  }

  const errorString = String(error).toLowerCase()

  if (errorString.includes('network') || errorString.includes('econnrefused')) {
    return 'Servidor indisponível. Verifica se o backend está rodando em http://localhost:8000'
  }
  if (errorString.includes('401') || errorString.includes('unauthorized')) {
    return 'Email ou senha incorretos'
  }
  if (errorString.includes('404') || errorString.includes('not found')) {
    return 'Utilizador não encontrado. Cria uma conta'
  }
  if (errorString.includes('timeout')) {
    return 'Conexão expirou. Tenta novamente'
  }
  if (errorString.includes('gmail')) {
    return 'Apenas emails Gmail são aceitos'
  }

  return error
}
