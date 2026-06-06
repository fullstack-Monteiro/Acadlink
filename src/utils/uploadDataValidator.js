import { ERROR_CODES, ERROR_MESSAGES, CATEGORIES } from '../context/ReelsContext'

// ══════════════════════════════════════════════════════════════════════════════
// VALIDATION CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const MAX_DESCRIPTION_LENGTH = 500 // characters
const MIN_HASHTAGS = 1
const MAX_HASHTAGS = 10

// Valid category keys extracted from CATEGORIES constant
const VALID_CATEGORIES = CATEGORIES.map(cat => cat.key)

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
 * Validates description length
 * @param {string} description - Reel description
 * @returns {{valid: boolean, error: {field: string, message: string, code: string} | null}}
 */
export function validateDescription(description) {
  // Description can be empty, but if provided, must not exceed max length
  if (description === null || description === undefined) {
    return { valid: true, error: null }
  }

  if (typeof description !== 'string') {
    return {
      valid: false,
      error: createValidationError('description', ERROR_CODES.DESCRIPTION_TOO_LONG)
    }
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: createValidationError('description', ERROR_CODES.DESCRIPTION_TOO_LONG)
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates hashtags array
 * @param {string[]} hashtags - Array of hashtags
 * @returns {{valid: boolean, error: {field: string, message: string, code: string} | null}}
 */
export function validateHashtags(hashtags) {
  // Hashtags must be an array
  if (!Array.isArray(hashtags)) {
    return {
      valid: false,
      error: createValidationError('hashtags', ERROR_CODES.INVALID_HASHTAGS)
    }
  }

  // Must have between 1 and 10 hashtags (inclusive)
  if (hashtags.length < MIN_HASHTAGS || hashtags.length > MAX_HASHTAGS) {
    return {
      valid: false,
      error: createValidationError('hashtags', ERROR_CODES.INVALID_HASHTAGS)
    }
  }

  // All hashtags must be non-empty strings
  const allValid = hashtags.every(tag => 
    typeof tag === 'string' && tag.trim().length > 0
  )

  if (!allValid) {
    return {
      valid: false,
      error: createValidationError('hashtags', ERROR_CODES.INVALID_HASHTAGS)
    }
  }

  return { valid: true, error: null }
}

/**
 * Validates category selection
 * @param {string} category - Selected category
 * @returns {{valid: boolean, error: {field: string, message: string, code: string} | null}}
 */
export function validateCategory(category) {
  // Category is required
  if (!category) {
    return {
      valid: false,
      error: createValidationError('category', ERROR_CODES.CATEGORY_REQUIRED)
    }
  }

  // Category must be from predefined list
  if (!VALID_CATEGORIES.includes(category)) {
    return {
      valid: false,
      error: createValidationError('category', ERROR_CODES.CATEGORY_REQUIRED)
    }
  }

  return { valid: true, error: null }
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN VALIDATION FUNCTION
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Validates upload data (description, hashtags, category)
 * @param {Object} uploadData - Upload data object
 * @param {string} uploadData.description - Reel description
 * @param {string[]} uploadData.hashtags - Array of hashtags
 * @param {string} uploadData.category - Selected category
 * @returns {{valid: boolean, errors: Array<{field: string, message: string, code: string}>}}
 */
export function validateUploadData(uploadData) {
  const errors = []

  if (!uploadData || typeof uploadData !== 'object') {
    // If no data provided, return all required field errors
    errors.push(createValidationError('hashtags', ERROR_CODES.INVALID_HASHTAGS))
    errors.push(createValidationError('category', ERROR_CODES.CATEGORY_REQUIRED))
    return { valid: false, errors }
  }

  // 1. Validate description
  const descriptionResult = validateDescription(uploadData.description)
  if (!descriptionResult.valid) {
    errors.push(descriptionResult.error)
  }

  // 2. Validate hashtags
  const hashtagsResult = validateHashtags(uploadData.hashtags)
  if (!hashtagsResult.valid) {
    errors.push(hashtagsResult.error)
  }

  // 3. Validate category
  const categoryResult = validateCategory(uploadData.category)
  if (!categoryResult.valid) {
    errors.push(categoryResult.error)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
