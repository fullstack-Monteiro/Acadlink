// Example usage of useReelUpload hook
// This file demonstrates how to use the useReelUpload hook in a component

import React from 'react'
import { useReelUpload } from './useReelUpload'

function ExampleReelUploadComponent() {
  const {
    // State
    videoFile,
    setVideoFile,
    videoPreview,
    thumbnail,
    description,
    setDescription,
    category,
    setCategory,
    hashtags,
    uploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    validating,
    errors,
    
    // Functions
    validateVideo,
    validateAllFields,
    uploadReel,
    retryUpload,
    resetUpload,
    addHashtag,
    removeHashtag,
    removeVideo
  } = useReelUpload()

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      await setVideoFile(file)
    }
  }

  const handleUpload = async () => {
    try {
      const newReel = await uploadReel()
      console.log('Reel uploaded successfully:', newReel)
      // Handle success (e.g., show success message, redirect, etc.)
    } catch (error) {
      console.error('Upload failed:', error)
      // Error is already handled by the hook
    }
  }

  const handleHashtagAdd = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const value = event.target.value.trim()
      if (value) {
        addHashtag(value)
        event.target.value = ''
      }
    }
  }

  return (
    <div>
      <h2>Upload Reel Example</h2>
      
      {/* File Input */}
      <input
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        onChange={handleFileSelect}
      />
      
      {/* Video Preview */}
      {videoPreview && (
        <div>
          <video src={videoPreview} controls style={{ maxWidth: '300px' }} />
          <button onClick={removeVideo}>Remove Video</button>
        </div>
      )}
      
      {/* Validation Status */}
      {validating && <p>Validating video...</p>}
      
      {/* Description Input */}
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
      />
      <p>{description.length}/500</p>
      
      {/* Category Selection */}
      <select value={category || ''} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="StudyTips">Study Tips</option>
        <option value="ProjectShowcase">Project Showcase</option>
        <option value="CampusLife">Campus Life</option>
        <option value="CareerAdvice">Career Advice</option>
        <option value="ResearchHighlights">Research Highlights</option>
        <option value="SkillDemo">Skill Demo</option>
      </select>
      
      {/* Hashtag Input */}
      <input
        type="text"
        placeholder="Add hashtags (press Enter)"
        onKeyDown={handleHashtagAdd}
      />
      
      {/* Hashtag Display */}
      <div>
        {hashtags.map((tag, index) => (
          <span key={index} style={{ margin: '2px', padding: '4px', background: '#eee' }}>
            {tag}
            <button onClick={() => removeHashtag(index)}>×</button>
          </span>
        ))}
      </div>
      
      {/* Errors */}
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && (
        <div>
          <p>Uploading... {Math.round(uploadProgress)}%</p>
          <progress value={uploadProgress} max={100} />
        </div>
      )}
      
      {/* Upload Error */}
      {uploadError && (
        <div style={{ color: 'red' }}>
          <p>{uploadError.message}</p>
          {uploadError.canRetry && (
            <button onClick={retryUpload}>Retry</button>
          )}
        </div>
      )}
      
      {/* Upload Success */}
      {uploadSuccess && (
        <div style={{ color: 'green' }}>
          <p>Reel uploaded successfully!</p>
        </div>
      )}
      
      {/* Actions */}
      <div>
        <button 
          onClick={handleUpload}
          disabled={!videoFile || errors.length > 0 || validating || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Reel'}
        </button>
        <button onClick={resetUpload}>Reset</button>
      </div>
    </div>
  )
}

export default ExampleReelUploadComponent
