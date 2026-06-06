export function useApiError() {
  const handleError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return 'Sessão expirada. Por favor, faça login novamente.'
    } else if (error.response?.status === 403) {
      return 'Não tem permissão para realizar esta ação.'
    } else if (error.response?.status === 404) {
      return 'Recurso não encontrado.'
    } else if (error.response?.status === 429) {
      return 'Muitas requisições. Tente novamente mais tarde.'
    } else if (error.response?.status === 500) {
      return 'Erro no servidor. Tente novamente.'
    } else if (error.response?.status === 400) {
      return error.response?.data?.detail || 'Dados inválidos.'
    }
    
    return error.response?.data?.detail || error.message || 'Erro desconhecido'
  }
  
  return { handleError }
}
