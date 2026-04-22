'use client'

import { useState } from 'react'

export default function ProofUpload({
  winnerId,
  disabled,
}: {
  winnerId: string
  disabled?: boolean
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      alert('Please upload an image file')
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    setSubmitted(true)
    setError(null)

    const form = new FormData()
    form.set('winnerId', winnerId)
    form.set('file', file)

    const res = await fetch('/api/winners/proof', {
      method: 'POST',
      body: form,
    })

    const json = (await res.json()) as any
    if (!res.ok || !json?.ok) {
      setSubmitted(false)
      setError(json?.error || 'Upload failed')
      return
    }

    setTimeout(() => {
      setSubmitted(false)
      setFile(null)
      setPreview(null)
    }, 1200)
  }

  return (
    <div className="glass rounded-2xl p-4 border border-[#00D1FF]/30 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6">Upload Your Proof</h2>
      <p className="text-[#A0A0A8] mb-6">Please upload a screenshot or image as proof of your winning score</p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer sm:p-10 md:p-12 ${isDragging
            ? 'border-[#00D1FF] bg-[#00D1FF]/10'
            : 'border-[#00D1FF]/30 hover:border-[#00D1FF]/60'
          }`}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 max-w-full mx-auto rounded-lg"
            />
            <p className="text-[#E5E7EB] font-semibold">{file?.name}</p>
            <button
              onClick={() => {
                setFile(null)
                setPreview(null)
              }}
              className="text-[#00D1FF] hover:text-[#00D1FF]/80 text-sm font-semibold"
            >
              Choose Different File
            </button>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-4">📤</p>
            <p className="text-[#E5E7EB] font-semibold mb-2">Drag and drop your image here</p>
            <p className="text-[#A0A0A8] text-sm mb-4">or</p>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
              />
              <span className="px-6 py-2 rounded-lg bg-[#00D1FF] text-[#0A0A0F] font-bold cursor-pointer hover:shadow-[0_0_20px_rgba(0,209,255,0.6)] transition-all inline-block">
                Click to Browse
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={!file || submitted || disabled}
          className={`w-full px-6 py-3 rounded-lg font-bold transition-all ${!file || disabled
              ? 'bg-[#A0A0A8] text-[#0A0A0F] cursor-not-allowed opacity-50'
              : submitted
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-[#00D1FF] to-[#00B8D4] text-[#0A0A0F] hover:shadow-[0_0_30px_rgba(0,209,255,0.6)]'
            }`}
        >
          {submitted ? '✓ Submitted Successfully' : 'Submit Proof'}
        </button>
      </div>

      {/* Info */}
      <p className="text-[#A0A0A8] text-xs mt-6">
        Our admin team will review your proof within 24 hours. Supported formats: JPG, PNG, GIF
      </p>
    </div>
  )
}
