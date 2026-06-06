// ══════════════════════════════════════════════════════════════════════════════
// THUMBNAIL GENERATION UTILITY
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Generates a thumbnail from the first frame of a video file
 * Uses HTML5 Canvas API to capture the frame
 * 
 * @param {File} videoFile - Video file to extract thumbnail from
 * @param {Object} options - Optional configuration
 * @param {number} options.maxWidth - Maximum width of thumbnail (default: 400)
 * @param {number} options.maxHeight - Maximum height of thumbnail (default: 800)
 * @param {string} options.format - Output format: 'dataURL' or 'blob' (default: 'dataURL')
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string|Blob>} Data URL or Blob of the thumbnail
 */
export async function generateThumbnail(videoFile, options = {}) {
  // Default options
  const {
    maxWidth = 400,
    maxHeight = 800,
    format = 'dataURL',
    quality = 0.8
  } = options

  // Validate input
  if (!videoFile || !(videoFile instanceof File)) {
    throw new Error('Invalid video file provided')
  }

  return new Promise((resolve, reject) => {
    try {
      // Create video element
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true // Mute to avoid audio playback

      // Handle metadata loaded
      video.onloadedmetadata = () => {
        // Seek to first frame (0.1 seconds to ensure frame is loaded)
        video.currentTime = 0.1
      }

      // Handle seeked event (when video is at the desired time)
      video.onseeked = () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            throw new Error('Failed to get canvas context')
          }

          // Calculate dimensions maintaining aspect ratio
          let width = video.videoWidth
          let height = video.videoHeight

          // Scale down if necessary
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          // Set canvas dimensions
          canvas.width = width
          canvas.height = height

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, width, height)

          // Clean up video element
          window.URL.revokeObjectURL(video.src)

          // Return based on format
          if (format === 'blob') {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error('Failed to generate thumbnail blob'))
                }
              },
              'image/jpeg',
              quality
            )
          } else {
            // Return data URL
            const dataURL = canvas.toDataURL('image/jpeg', quality)
            resolve(dataURL)
          }
        } catch (error) {
          window.URL.revokeObjectURL(video.src)
          reject(new Error(`Failed to capture video frame: ${error.message}`))
        }
      }

      // Handle errors
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video for thumbnail generation'))
      }

      // Set video source
      video.src = URL.createObjectURL(videoFile)
    } catch (error) {
      reject(new Error(`Thumbnail generation error: ${error.message}`))
    }
  })
}

/**
 * Generates a thumbnail and returns it as a data URL
 * Convenience wrapper around generateThumbnail
 * 
 * @param {File} videoFile - Video file to extract thumbnail from
 * @param {Object} options - Optional configuration (maxWidth, maxHeight, quality)
 * @returns {Promise<string>} Data URL of the thumbnail
 */
export async function generateThumbnailDataURL(videoFile, options = {}) {
  return generateThumbnail(videoFile, { ...options, format: 'dataURL' })
}

/**
 * Generates a thumbnail and returns it as a Blob
 * Convenience wrapper around generateThumbnail
 * 
 * @param {File} videoFile - Video file to extract thumbnail from
 * @param {Object} options - Optional configuration (maxWidth, maxHeight, quality)
 * @returns {Promise<Blob>} Blob of the thumbnail
 */
export async function generateThumbnailBlob(videoFile, options = {}) {
  return generateThumbnail(videoFile, { ...options, format: 'blob' })
}

/**
 * Validates if thumbnail generation is supported in the current browser
 * @returns {boolean} True if thumbnail generation is supported
 */
export function isThumbnailGenerationSupported() {
  try {
    const canvas = document.createElement('canvas')
    const video = document.createElement('video')
    return !!(
      canvas.getContext &&
      canvas.getContext('2d') &&
      video.canPlayType &&
      typeof URL.createObjectURL === 'function'
    )
  } catch (error) {
    return false
  }
}
