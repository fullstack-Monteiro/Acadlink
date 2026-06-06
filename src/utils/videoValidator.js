import { ERROR_CODES, ERROR_MESSAGES } from '../context/ReelsContext'

// ══════════════════════════════════════════════════════════════════════════════
// VALIDATION CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const MIN_DURATION = 15 // seconds
const MAX_DURATION = 90 // seconds
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB in bytes
const VALID_FORMATS = ['video/mp4', 'video/quicktime', 'video/webm'] // MP4, MOV, WEBM
const MIN_ASPECT_RATIO = 9 / 16 // 0.5625
const MAX_ASPECT_RATIO = 9 / 18 // 0.5

// ══════════════════════════════════════════════════════════════════════════════
// VALIDATION ERROR STRUCTURE
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Creates a validation error object
 * @param {string} field - Field name
 * @param {string} code - Error code
 * @returns {{field: string, message: string, code: string}}
 */
function createValidationError(field, code) {
  return {
    field,
    message: ERROR_MESSAGES[code] || 'Erro de validação',
    code
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// INDIVIDUAL VALIDATION FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Validates video format
 * @param {File} file - Video file
 * @returns {{valid: boolean, error: {field: string, message: string, code: string} | null}}
 */
export function validateVideoFormat(file) {
  if (!file) {
    return {
      valid: false,
      error: createValidationError('videoFile', ERROR_CODES.INVALID_FORMAT)
    }
  }

  const isValidFormat = VALID_FORMATS.includes(file.type)

  if (!isValidFormat) {
    return {
      valid: false,
      error: createValidationError('videoFile', ERROR_CODES.INVALID_FORMAT)
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates video duration
 * @param {number} duration - Video duration in seconds
 * @returns {{valid: boolean, error: {field: string, message: string, code: string} | null}}
 */
export function validateDuration(duration) {
  if (typeof duration !== 'number' || isNaN(duration)) {
    return {
      valid: false,
      error: createValidationError('duration', ERROR_CODES.VIDEO_TOO_SHORT)
    }
  }

  if (duration < MIN_DURATION) {
    return {
      valid: false,
      error: createValidationError('duration', ERROR_CODES.VIDEO_TOO_SHORT)
    }
  }

  if (duration > MAX_DURATION) {
    return {
      valid: false,
      error: createValidationError('duration', ERROR_CODES.VIDEO_TOO_LONG)
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates file size
 * @param {File} file - Video file
 * @returns {{valid: boolean, error: {field: string, message: string, code: string} | null}}
 */
export function validateFileSize(file) {
  if (!file) {
    return {
      valid: false,
      error: createValidationError('videoFile', ERROR_CODES.FILE_TOO_LARGE)
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: createValidationError('videoFile', ERROR_CODES.FILE_TOO_LARGE)
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates aspect ratio (vertical format)
 * @param {number} width - Video width in pixels
 * @param {number} height - Video height in pixels
 * @returns {{valid: boolean, error: {field: string, message: string, code: string} | null}}
 */
export function validateAspectRatio(width, height) {
  if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
    return {
      valid: false,
      error: createValidationError('aspectRatio', ERROR_CODES.INVALID_ASPECT_RATIO)
    }
  }

  const aspectRatio = width / height

  // Aspect ratio should be between 9:18 (0.5) and 9:16 (0.5625)
  // Note: vertical videos have width < height, so ratio < 1
  if (aspectRatio < MAX_ASPECT_RATIO || aspectRatio > MIN_ASPECT_RATIO) {
    return {
      valid: false,
      error: createValidationError('aspectRatio', ERROR_CODES.INVALID_ASPECT_RATIO)
    }
  }

  return { valid: true, error: null }
}

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Gets video metadata (duration, width, height) from a video file
 * @param {File} file - Video file
 * @returns {Promise<{duration: number, width: number, height: number}>}
 */
export function getVideoMetadata(file) {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        // Clean up
        window.URL.revokeObjectURL(video.src)

        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        })
      }

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video metadata'))
      }

      video.src = URL.createObjectURL(file)
    } catch (error) {
      reject(error)
    }
  })
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN VALIDATION FUNCTION
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Validates a video file against all requirements
 * @param {File} file - Video file to validate
 * @returns {Promise<{valid: boolean, errors: Array<{field: string, message: string, code: string}>}>}
 */
export async function validateVideo(file) {
  const errors = []

  // 1. Validate format
  const formatResult = validateVideoFormat(file)
  if (!formatResult.valid) {
    errors.push(formatResult.error)
    // If format is invalid, no point checking other properties
    return { valid: false, errors }
  }

  // 2. Validate file size
  const sizeResult = validateFileSize(file)
  if (!sizeResult.valid) {
    errors.push(sizeResult.error)
  }

  // 3. Get video metadata and validate duration and aspect ratio
  try {
    const metadata = await getVideoMetadata(file)

    // Validate duration
    const durationResult = validateDuration(metadata.duration)
    if (!durationResult.valid) {
      errors.push(durationResult.error)
    }

    // Validate aspect ratio
    const aspectRatioResult = validateAspectRatio(metadata.width, metadata.height)
    if (!aspectRatioResult.valid) {
      errors.push(aspectRatioResult.error)
    }
  } catch (error) {
    // If we can't read metadata, treat it as an invalid format
    errors.push(createValidationError('videoFile', ERROR_CODES.INVALID_FORMAT))
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validates video file synchronously (format and size only)
 * Use this for quick validation before async metadata extraction
 * @param {File} file - Video file to validate
 * @returns {{valid: boolean, errors: Array<{field: string, message: string, code: string}>}}
 */
export function validateVideoSync(file) {
  const errors = []

  // Validate format
  const formatResult = validateVideoFormat(file)
  if (!formatResult.valid) {
    errors.push(formatResult.error)
  }

  // Validate file size
  const sizeResult = validateFileSize(file)
  if (!sizeResult.valid) {
    errors.push(sizeResult.error)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
