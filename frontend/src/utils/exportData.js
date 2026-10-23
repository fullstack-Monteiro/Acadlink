/**
 * Utilities para exportar dados em diferentes formatos
 */

/**
 * Converte objeto para CSV
 */
export function objectToCSV(data, headers = null) {
  if (!data || data.length === 0) {
    return ''
  }

  // Se não houver headers, usar as chaves do primeiro objeto
  const csvHeaders = headers || Object.keys(data[0])
  
  // Header row
  const headerRow = csvHeaders.join(',')
  
  // Data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header]
      
      // Escapar valores com vírgulas ou aspas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      
      return value !== null && value !== undefined ? value : ''
    }).join(',')
  }).join('\n')
  
  return `${headerRow}\n${dataRows}`
}

/**
 * Faz download de arquivo
 */
export function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Exporta analytics de reel para CSV
 */
export function exportReelAnalytics(reel, metrics) {
  const data = [
    { Campo: 'Título', Valor: reel.description || 'Sem título' },
    { Campo: 'ID', Valor: reel.id },
    { Campo: 'Autor', Valor: reel.author?.name || 'Desconhecido' },
    { Campo: 'Categoria', Valor: reel.category || 'N/A' },
    { Campo: 'Data de Publicação', Valor: reel.created_at || 'N/A' },
    { Campo: '', Valor: '' },
    { Campo: 'MÉTRICAS', Valor: '' },
    { Campo: 'Visualizações', Valor: metrics.views },
    { Campo: 'Visualizações Únicas', Valor: metrics.uniqueViews },
    { Campo: 'Likes', Valor: metrics.likes },
    { Campo: 'Comentários', Valor: metrics.comments },
    { Campo: 'Compartilhamentos', Valor: metrics.shares },
    { Campo: 'Salvos', Valor: metrics.saves },
    { Campo: 'Total de Engajamento', Valor: metrics.totalEngagement },
    { Campo: 'Taxa de Engajamento (%)', Valor: metrics.engagementRate },
    { Campo: 'Tempo Médio de Visualização (s)', Valor: metrics.avgWatchTime },
    { Campo: 'Taxa de Conclusão (%)', Valor: metrics.completionRate },
  ]

  const csv = objectToCSV(data, ['Campo', 'Valor'])
  const filename = `reel-analytics-${reel.id}-${new Date().toISOString().split('T')[0]}.csv`
  downloadFile(csv, filename, 'text/csv;charset=utf-8;')
}

/**
 * Compartilha analytics (Web Share API ou fallback)
 */
export async function shareAnalytics(reel, metrics) {
  const text = `📊 Analytics do Reel\n\n` +
    `📹 ${reel.description || 'Sem título'}\n\n` +
    `👁️ ${metrics.views} visualizações\n` +
    `❤️ ${metrics.likes} likes\n` +
    `💬 ${metrics.comments} comentários\n` +
    `📈 ${metrics.engagementRate}% de engajamento\n\n` +
    `Via AcadLink`

  // Tentar Web Share API
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Analytics do Reel',
        text: text,
      })
      return true
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error)
      }
    }
  }
  
  // Fallback: copiar para clipboard
  try {
    await navigator.clipboard.writeText(text)
    alert('Analytics copiados para a área de transferência!')
    return true
  } catch (error) {
    console.error('Erro ao copiar:', error)
    alert('Não foi possível compartilhar. Tenta novamente.')
    return false
  }
}

/**
 * Exporta todos os dados do usuário (GDPR)
 */
export function exportUserData(userData) {
  const data = {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      university: userData.university,
      course: userData.course,
      year: userData.year,
      created_at: userData.created_at,
    },
    posts: userData.posts || [],
    reels: userData.reels || [],
    connections: userData.connections || [],
    messages: userData.messages || [],
    saved: userData.saved || [],
    comments: userData.comments || [],
  }

  const json = JSON.stringify(data, null, 2)
  const filename = `acadlink-data-${userData.username}-${new Date().toISOString().split('T')[0]}.json`
  downloadFile(json, filename, 'application/json')
}

/**
 * Formata bytes para tamanho legível
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Valida tipo de arquivo
 */
export function isValidFileType(file, acceptedTypes) {
  if (!file || !acceptedTypes) return false
  
  const fileType = file.type
  return acceptedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0]
      return fileType.startsWith(prefix)
    }
    return fileType === type
  })
}
