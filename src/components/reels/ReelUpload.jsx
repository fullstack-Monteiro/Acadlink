import { useState, useRef } from 'react'
import { X, Upload, Video, AlertCircle, Hash, CheckCircle, RefreshCw } from 'lucide-react'
import Button from '../ui/Button'
import { validateVideo, validateVideoSync } from '../../utils/videoValidator'
import { validateDescription, validateCategory, validateHashtags } from '../../utils/uploadDataValidator'
import { generateThumbnailDataURL } from '../../utils/thumbnailGenerator'
import { CATEGORIES, useReels } from '../../context/ReelsContext'

export default function ReelUpload({ onClose, onSuccess }) {
  const { createReel } = useReels()
  
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(null)
  const [hashtags, setHashtags] = useState([])
  const [hashtagInput, setHashtagInput] = useState('')
  const [errors, setErrors] = useState([])
  const [validating, setValidating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const descriptionInputRef = useRef(null)
  const hashtagInputRef = useRef(null)

  // ══════════════════════════════════════════════════════════════════════════════
  // FILE SELECTION AND VALIDATION
  // ══════════════════════════════════════════════════════════════════════════════

  const handleFileSelect = async (file) => {
    if (!file) return

    // Clear previous errors and states
    setErrors([])
    setUploadError(null)
    setUploadSuccess(false)
    setValidating(true)

    // Quick sync validation (format and size)
    const syncResult = validateVideoSync(file)
    if (!syncResult.valid) {
      setErrors(syncResult.errors)
      setValidating(false)
      return
    }

    // Set preview immediately for better UX
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
    setVideoFile(file)

    try {
      // Async validation (duration and aspect ratio)
      const result = await validateVideo(file)
      if (!result.valid) {
        setErrors(result.errors)
        setValidating(false)
        return
      }

      // Generate thumbnail
      const thumbnailUrl = await generateThumbnailDataURL(file)
      setThumbnail(thumbnailUrl)
      
    } catch (error) {
      setErrors([{
        field: 'videoFile',
        message: 'Erro ao processar o vídeo. Tente novamente.',
        code: 'PROCESSING_ERROR'
      }])
    } finally {
      setValidating(false)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    if (thumbnail) {
      URL.revokeObjectURL(thumbnail)
    }
    setVideoFile(null)
    setVideoPreview(null)
    setThumbnail(null)
    setErrors([])
    setUploadError(null)
    setUploadSuccess(false)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // DESCRIPTION HANDLING
  // ══════════════════════════════════════════════════════════════════════════════

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    setDescription(value)

    // Validate description and update errors
    const result = validateDescription(value)
    if (!result.valid) {
      // Add or update description error
      setErrors(prev => {
        const filtered = prev.filter(err => err.field !== 'description')
        return [...filtered, result.error]
      })
    } else {
      // Remove description error if valid
      setErrors(prev => prev.filter(err => err.field !== 'description'))
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // CATEGORY HANDLING
  // ══════════════════════════════════════════════════════════════════════════════

  const handleCategorySelect = (categoryKey) => {
    setCategory(categoryKey)

    // Validate category and update errors
    const result = validateCategory(categoryKey)
    if (!result.valid) {
      // Add or update category error
      setErrors(prev => {
        const filtered = prev.filter(err => err.field !== 'category')
        return [...filtered, result.error]
      })
    } else {
      // Remove category error if valid
      setErrors(prev => prev.filter(err => err.field !== 'category'))
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HASHTAG HANDLING
  // ══════════════════════════════════════════════════════════════════════════════

  const normalizeHashtag = (tag) => {
    // Remove # prefix if present and trim whitespace
    const cleaned = tag.replace(/^#/, '').trim()
    // Add # prefix back
    return cleaned ? `#${cleaned}` : ''
  }

  const addHashtag = (tag) => {
    const normalized = normalizeHashtag(tag)
    
    if (!normalized || normalized === '#') return
    
    // Check for duplicates (case insensitive)
    const isDuplicate = hashtags.some(existing => 
      existing.toLowerCase() === normalized.toLowerCase()
    )
    
    if (isDuplicate) return
    
    // Check character limit per hashtag (reasonable limit of 50 chars)
    if (normalized.length > 50) return
    
    const newHashtags = [...hashtags, normalized]
    setHashtags(newHashtags)
    
    // Validate hashtags and update errors
    const result = validateHashtags(newHashtags)
    if (!result.valid) {
      setErrors(prev => {
        const filtered = prev.filter(err => err.field !== 'hashtags')
        return [...filtered, result.error]
      })
    } else {
      setErrors(prev => prev.filter(err => err.field !== 'hashtags'))
    }
  }

  const removeHashtag = (index) => {
    const newHashtags = hashtags.filter((_, i) => i !== index)
    setHashtags(newHashtags)
    
    // Validate hashtags and update errors
    const result = validateHashtags(newHashtags)
    if (!result.valid) {
      setErrors(prev => {
        const filtered = prev.filter(err => err.field !== 'hashtags')
        return [...filtered, result.error]
      })
    } else {
      setErrors(prev => prev.filter(err => err.field !== 'hashtags'))
    }
  }

  const handleHashtagInputChange = (e) => {
    const value = e.target.value
    
    // Handle comma separation
    if (value.includes(',')) {
      const tags = value.split(',')
      const lastTag = tags.pop() // Keep the last part as input
      
      // Add all complete tags
      tags.forEach(tag => {
        const trimmed = tag.trim()
        if (trimmed) {
          addHashtag(trimmed)
        }
      })
      
      setHashtagInput(lastTag?.trim() || '')
      return
    }
    
    setHashtagInput(value)
  }

  const handleHashtagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (hashtagInput.trim()) {
        addHashtag(hashtagInput.trim())
        setHashtagInput('')
      }
    } else if (e.key === 'Backspace' && !hashtagInput && hashtags.length > 0) {
      // Remove last hashtag if input is empty and backspace is pressed
      removeHashtag(hashtags.length - 1)
    }
  }

  const handleHashtagInputBlur = () => {
    if (hashtagInput.trim()) {
      addHashtag(hashtagInput.trim())
      setHashtagInput('')
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // DRAG AND DROP
  // ══════════════════════════════════════════════════════════════════════════════

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // UPLOAD HANDLING
  // ══════════════════════════════════════════════════════════════════════════════

  const validateAllFields = () => {
    const allErrors = []

    // Validate video file
    if (!videoFile) {
      allErrors.push({
        field: 'videoFile',
        message: 'Selecione um vídeo para fazer upload',
        code: 'VIDEO_REQUIRED'
      })
    }

    // Validate description
    const descResult = validateDescription(description)
    if (!descResult.valid) {
      allErrors.push(descResult.error)
    }

    // Validate category
    const catResult = validateCategory(category)
    if (!catResult.valid) {
      allErrors.push(catResult.error)
    }

    // Validate hashtags
    const hashResult = validateHashtags(hashtags)
    if (!hashResult.valid) {
      allErrors.push(hashResult.error)
    }

    return allErrors
  }

  const simulateUploadProgress = () => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5 // Random increment between 5-20%
        if (progress >= 95) {
          progress = 95
          clearInterval(interval)
          // Final jump to 100% after a short delay
          setTimeout(() => {
            setUploadProgress(100)
            resolve()
          }, 200)
        } else {
          setUploadProgress(Math.min(progress, 95))
        }
      }, 150)
    })
  }

  const handleUpload = async () => {
    // Validate all fields
    const validationErrors = validateAllFields()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)
    setErrors([])

    try {
      // Simulate upload progress
      await simulateUploadProgress()

      // Create upload data
      const uploadData = {
        videoFile,
        description: description.trim(),
        category,
        hashtags
      }

      // Call createReel from context
      const newReel = await createReel(uploadData)

      // Set thumbnail URL if generated
      if (thumbnail) {
        newReel.thumbnailUrl = thumbnail
      }

      setUploadSuccess(true)
      
      // Call success callback after a short delay to show success state
      setTimeout(() => {
        onSuccess?.(newReel)
        handleClose()
      }, 1500)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError({
        message: error.message || 'Erro ao fazer upload do reel. Tente novamente.',
        canRetry: true
      })
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleRetry = () => {
    setUploadError(null)
    setUploadProgress(0)
    handleUpload()
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ══════════════════════════════════════════════════════════════════════════════

  const handleClose = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    if (thumbnail) {
      URL.revokeObjectURL(thumbnail)
    }
    onClose()
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in" 
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      
      <div
        className="relative w-full sm:max-w-lg bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-2xl rounded-t-3xl sm:rounded-2xl shadow-modal flex flex-col max-h-[85vh] animate-slide-up border border-white/20 dark:border-white/10"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-[#3a3a3a]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-[#2a2a2a]">
          <span className="font-semibold text-sm text-neutral-900 dark:text-white">
            Novo Reel
          </span>
          <button 
            onClick={handleClose} 
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] text-neutral-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Fazendo upload do reel...
                </span>
                <span className="text-sm text-neutral-500">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-[#3a3a3a] rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Processando vídeo e gerando thumbnail...
              </p>
            </div>
          )}

          {/* Upload Success */}
          {uploadSuccess && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                  Reel publicado com sucesso!
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Seu reel está sendo processado e estará disponível em breve.
                </p>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Erro no upload
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {uploadError.message}
                  </p>
                </div>
              </div>
              {uploadError.canRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={handleRetry}
                  fullWidth
                >
                  Tentar novamente
                </Button>
              )}
            </div>
          )}

          {/* Hide form during upload/success states */}
          {!uploading && !uploadSuccess && (
            <>
              {/* File Upload Area */}
              {!videoFile ? (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-neutral-300 dark:border-[#3a3a3a] hover:border-primary-400 dark:hover:border-primary-600'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-white/10 flex items-center justify-center">
                  <Video className="w-8 h-8 text-primary-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                    {isDragging ? 'Solte o vídeo aqui' : 'Arraste um vídeo ou clique para selecionar'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    MP4, MOV ou WEBM • 15-90 segundos • Máx 100MB
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Formato vertical (9:16 a 9:18)
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  icon={<Upload className="w-4 h-4" />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Selecionar vídeo
                </Button>
              </div>
            </div>
          ) : (
            /* Video Preview */
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[400px] mx-auto">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full object-contain"
                  playsInline
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                    {videoFile.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveVideo}
                >
                  Remover
                </Button>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Descrição (opcional)
                </label>
                <div className="relative">
                  <textarea
                    ref={descriptionInputRef}
                    rows={3}
                    placeholder="Adicione uma descrição ao seu reel..."
                    className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3a3a3a] rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none leading-relaxed transition-colors"
                    value={description}
                    onChange={handleDescriptionChange}
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-neutral-400 pointer-events-none">
                    {description.length}/500
                  </div>
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.key
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => handleCategorySelect(cat.key)}
                        className={`
                          flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${isSelected
                            ? 'shadow-sm'
                            : 'border-2 hover:scale-[1.02]'
                          }
                        `}
                        style={{
                          backgroundColor: isSelected ? cat.color : 'transparent',
                          borderColor: isSelected ? cat.color : cat.color,
                          color: isSelected ? '#ffffff' : cat.color,
                        }}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Hashtag Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Hashtags <span className="text-red-500">*</span>
                  <span className="text-xs text-neutral-500 ml-1">(1-10 hashtags)</span>
                </label>
                
                {/* Hashtag Chips */}
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {hashtags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                      >
                        <Hash className="w-3 h-3" />
                        <span>{tag.slice(1)}</span>
                        <button
                          type="button"
                          onClick={() => removeHashtag(index)}
                          className="ml-1 p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hashtag Input Field */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    ref={hashtagInputRef}
                    type="text"
                    placeholder="Adicione hashtags..."
                    className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3a3a3a] rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    value={hashtagInput}
                    onChange={handleHashtagInputChange}
                    onKeyDown={handleHashtagInputKeyDown}
                    onBlur={handleHashtagInputBlur}
                    maxLength={50}
                    disabled={hashtags.length >= 10}
                  />
                </div>
                
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Pressione Enter ou vírgula para adicionar. {hashtags.length}/10 hashtags
                </p>
              </div>
            </div>
          )}

          {/* Validation Status */}
          {validating && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Validando vídeo...</span>
            </div>
          )}

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Info Message */}
          {videoFile && errors.filter(e => e.field !== 'description').length === 0 && !validating && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Vídeo válido! Continue para adicionar descrição, categoria e hashtags.</span>
            </div>
          )}
          </>
          )}
        </div>

        {/* Footer */}
        <div 
          className="px-4 py-3 border-t border-neutral-100 dark:border-[#2a2a2a] flex gap-2"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {uploadSuccess ? (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleClose}
            >
              Fechar
            </Button>
          ) : uploading ? (
            <Button
              variant="ghost"
              size="md"
              fullWidth
              disabled
            >
              Fazendo upload...
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={handleClose}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                disabled={!videoFile || errors.length > 0 || validating || uploading}
                onClick={handleUpload}
              >
                {validating ? 'Validando...' : 'Publicar Reel'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
