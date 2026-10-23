import { useState } from 'react'
import api from '../services/api'

/**
 * Hook reutilizável para upload de arquivos
 * Suporta imagens, documentos e validação
 */
export function useFileUpload({
  maxSize = 20 * 1024 * 1024, // 20MB padrão
  acceptedTypes = ['image/*'],
  endpoint = '/media/upload/',
  onSuccess,
  onError
} = {}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const validateFile = (file) => {
    // Validar tamanho
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(0)
      throw new Error(`Arquivo muito grande. Máximo: ${sizeMB}MB`)
    }

    // Validar tipo
    const fileType = file.type
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const prefix = type.split('/')[0]
        return fileType.startsWith(prefix)
      }
      return fileType === type
    })

    if (!isAccepted) {
      throw new Error('Tipo de arquivo não suportado')
    }

    return true
  }

  const upload = async (file, additionalData = {}) => {
    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      // Validar arquivo
      validateFile(file)

      // Criar FormData
      const formData = new FormData()
      formData.append('file', file)
      
      // Adicionar dados extras
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key])
      })

      // Upload com progress
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setProgress(percentCompleted)
        },
      })

      setUploading(false)
      setProgress(100)
      
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer upload'
      setError(errorMessage)
      setUploading(false)
      setProgress(0)
      
      if (onError) {
        onError(errorMessage)
      }
      
      throw err
    }
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return {
    upload,
    uploading,
    progress,
    error,
    reset
  }
}

/**
 * Hook especializado para upload de imagens com preview
 */
export function useImageUpload(options = {}) {
  const [preview, setPreview] = useState(null)
  const fileUpload = useFileUpload({
    ...options,
    acceptedTypes: options.acceptedTypes || ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB para imagens
  })

  const selectImage = (file) => {
    if (file) {
      // Gerar preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file, additionalData = {}) => {
    selectImage(file)
    return fileUpload.upload(file, additionalData)
  }

  const clearPreview = () => {
    setPreview(null)
    fileUpload.reset()
  }

  return {
    ...fileUpload,
    preview,
    uploadImage,
    selectImage,
    clearPreview
  }
}

/**
 * Hook para upload de documentos (PDF, DOC, PPT)
 */
export function useDocumentUpload(options = {}) {
  return useFileUpload({
    ...options,
    acceptedTypes: options.acceptedTypes || [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    maxSize: options.maxSize || 20 * 1024 * 1024, // 20MB para documentos
  })
}
