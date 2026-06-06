import { useState, useRef } from 'react'
import { validateVideo, validateVideoSync } from '../utils/videoValidator'
import { validateDescription, validateCategory, validateHashtags } from '../utils/uploadDataValidator'
import { generateThumbnailDataURL } from '../utils/thumbnailGenerator'
import { useReels } from '../context/ReelsContext'

/**
 * Custom hook for managing reel upload state and logic
 * Provides centralized upload functionality that can be used by multiple components
 * 
 * Features:
 * - Video file validation (format, size, duration, aspect ratio)
 * - Form data management (description, category, hashtags)
 * - Upload progress tracking with simulation
 * - Error handling and validation feedback
 * - Integration with ReelsContext for reel creation
 * - Resource cleanup and state reset
 * 
 * Usage:
 * ```javascript
 * const {
 *   videoFile, setVideoFile,
 *   description, setDescription,
 *   category, setCategory,
 *   hashtags, addHashtag, removeHashtag,
 *   uploading, uploadProgress, errors,
 *   uploadReel, resetUpload
 * } = useReelUpload()
 * ```
 * 
 * @returns {Object} Hook interface with state and functions
 */
export function useReelUpload() {
  const { createReel } = useReels()

  // ══════════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════════

  // Video file state
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)

  // Form data state
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(null)
  const [hashtags, setHashtags] = useState([])

  // Upload process state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Validation state
  const [validating, setValidating] = useState(false)
  const [errors, setErrors] = useState([])

  // ══════════════════════════════════════════════════════════════════════════════
  // VIDEO FILE HANDLING
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Validates and sets a video file
   * @param {File} file - Video file to validate and set
   */
  const handleVideoFile = async (file) => {
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

  /**
   * Removes the current video file and cleans up resources
   */
  const removeVideo = () => {
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
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // FORM DATA HANDLING
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Updates description and validates it
   * @param {string} value - New description value
   */
  const updateDescription = (value) => {
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

  /**
   * Updates category and validates it
   * @param {string} categoryKey - Category key to set
   */
  const updateCategory = (categoryKey) => {
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

  /**
   * Normalizes a hashtag by adding # prefix and trimming
   * @param {string} tag - Raw hashtag input
   * @returns {string} Normalized hashtag
   */
  const normalizeHashtag = (tag) => {
    // Remove # prefix if present and trim whitespace
    const cleaned = tag.replace(/^#/, '').trim()
    // Add # prefix back
    return cleaned ? `#${cleaned}` : ''
  }

  /**
   * Adds a hashtag to the list
   * @param {string} tag - Hashtag to add
   */
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

  /**
   * Removes a hashtag from the list
   * @param {number} index - Index of hashtag to remove
   */
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

  // ══════════════════════════════════════════════════════════════════════════════
  // VALIDATION
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Validates the video file
   * @param {File} file - Video file to validate
   * @returns {Promise<{valid: boolean, errors: Array}>}
   */
  const validateVideoFile = async (file) => {
    if (!file) {
      return {
        valid: false,
        errors: [{
          field: 'videoFile',
          message: 'Selecione um vídeo para fazer upload',
          code: 'VIDEO_REQUIRED'
        }]
      }
    }

    try {
      const result = await validateVideo(file)
      return result
    } catch (error) {
      return {
        valid: false,
        errors: [{
          field: 'videoFile',
          message: 'Erro ao validar o vídeo. Tente novamente.',
          code: 'VALIDATION_ERROR'
        }]
      }
    }
  }

  /**
   * Validates all form fields
   * @returns {Array} Array of validation errors
   */
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

  // ══════════════════════════════════════════════════════════════════════════════
  // UPLOAD PROCESS
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Simulates upload progress for better UX
   * @returns {Promise<void>}
   */
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

  /**
   * Uploads the reel with current form data
   * @returns {Promise<Object>} Created reel object
   */
  const uploadReel = async () => {
    // Validate all fields
    const validationErrors = validateAllFields()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      throw new Error('Validation failed')
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
      return newReel

    } catch (error) {
      console.error('Upload error:', error)
      const uploadError = {
        message: error.message || 'Erro ao fazer upload do reel. Tente novamente.',
        canRetry: true
      }
      setUploadError(uploadError)
      setUploadProgress(0)
      throw error
    } finally {
      setUploading(false)
    }
  }

  /**
   * Retries the upload process
   * @returns {Promise<Object>} Created reel object
   */
  const retryUpload = async () => {
    setUploadError(null)
    setUploadProgress(0)
    return await uploadReel()
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RESET AND CLEANUP
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Resets all upload state to initial values
   */
  const resetUpload = () => {
    // Clean up URLs
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    if (thumbnail) {
      URL.revokeObjectURL(thumbnail)
    }

    // Reset all state
    setVideoFile(null)
    setVideoPreview(null)
    setThumbnail(null)
    setDescription('')
    setCategory(null)
    setHashtags([])
    setUploading(false)
    setUploadProgress(0)
    setUploadError(null)
    setUploadSuccess(false)
    setValidating(false)
    setErrors([])
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HOOK INTERFACE
  // ══════════════════════════════════════════════════════════════════════════════

  return {
    // State
    videoFile,
    setVideoFile: handleVideoFile,
    videoPreview,
    thumbnail,
    description,
    setDescription: updateDescription,
    category,
    setCategory: updateCategory,
    hashtags,
    setHashtags,
    uploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    validating,
    errors,

    // Functions
    validateVideo: validateVideoFile,
    validateAllFields,
    uploadReel,
    retryUpload,
    resetUpload,
    addHashtag,
    removeHashtag,
    removeVideo,
    normalizeHashtag
  }
}

export default useReelUpload
