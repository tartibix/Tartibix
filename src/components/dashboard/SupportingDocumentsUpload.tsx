'use client'

import { useState, useRef, useCallback } from 'react'
import { SupportingDocument } from '@/lib/projectSetupTypes'

interface SupportingDocumentsProps {
  projectId: string
  documents: SupportingDocument[]
  onChange: (documents: SupportingDocument[]) => void
  onBack: () => void
  onComplete: () => void
}

const generateId = () => `doc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

const documentCategories = [
  {
    id: 'plans',
    name: 'Project Plans',
    description: 'Upload architectural plans, drawings, and blueprints',
    acceptedTypes: '.pdf,.dwg,.dxf,.png,.jpg',
    icon: 'map',
  },
  {
    id: 'templates',
    name: 'Request Templates',
    description: 'Upload request forms and templates for the project',
    acceptedTypes: '.pdf,.docx,.doc,.xlsx,.xls',
    icon: 'file-text',
  },
  {
    id: 'logs',
    name: 'Project Log Forms',
    description: 'Upload log forms and tracking templates',
    acceptedTypes: '.pdf,.docx,.xlsx,.xls',
    icon: 'clipboard',
  },
  {
    id: 'other',
    name: 'Other Documents',
    description: 'Upload any other supporting documents',
    acceptedTypes: '*',
    icon: 'folder',
  },
]

export default function SupportingDocumentsUpload({
  projectId,
  documents,
  onChange,
  onBack,
  onComplete,
}: SupportingDocumentsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)

    if (!selectedCategory) {
      alert('Please select a document category first')
      return
    }

    const files = Array.from(e.dataTransfer.files)
    await uploadFiles(files)
  }, [selectedCategory])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      await uploadFiles(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFiles = async (files: File[]) => {
    if (!selectedCategory) return

    setUploading(true)
    const newDocs: SupportingDocument[] = []

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)
        formData.append('category', selectedCategory)

        const response = await fetch('/api/projects/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newDocs.push({
            id: data.id || generateId(),
            fileName: file.name,
            fileType: file.name.split('.').pop()?.toUpperCase() || 'FILE',
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            category: selectedCategory as SupportingDocument['category'],
            description: '',
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    if (newDocs.length > 0) {
      onChange([...documents, ...newDocs])
    }
    setUploading(false)
  }

  const deleteDocument = async (doc: SupportingDocument) => {
    try {
      await fetch(`/api/projects/upload?projectId=${projectId}&fileName=${encodeURIComponent(doc.fileName)}`, {
        method: 'DELETE',
      })
      onChange(documents.filter(d => d.id !== doc.id))
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getDocumentsByCategory = (categoryId: string) => {
    return documents.filter(doc => doc.category === categoryId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-medium text-soft-white">
          Supporting Documents
        </h2>
      <p className="mt-1 text-sm text-soft-white/60">
        Upload project plans, templates, and other supporting files
      </p>
    </div>      {/* Category Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {documentCategories.map((category) => {
          const categoryDocs = getDocumentsByCategory(category.id)
          const isSelected = selectedCategory === category.id

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              className={`group relative rounded-[16px] border p-5 text-left transition ${
                isSelected
                  ? 'border-accent bg-accent/10'
                  : 'border-[#323449] bg-[#1B1C24] hover:border-accent/50'
              }`}
            >
              {/* Document count badge */}
              {categoryDocs.length > 0 && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-night">
                  {categoryDocs.length}
                </span>
              )}

              {/* Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${
                isSelected ? 'bg-accent/20' : 'bg-[#21222D]'
              }`}>
                <CategoryIcon type={category.icon} className={`h-6 w-6 ${isSelected ? 'text-accent' : 'text-soft-white/60'}`} />
              </div>

              {/* Text */}
              <h3 className="mt-3 font-display text-lg font-semibold text-soft-white">
                {category.name}
              </h3>
              <p className="mt-2 text-xs text-soft-white/40">
                {category.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Upload Area - Shows when category is selected */}
      {selectedCategory && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-[16px] border-2 border-dashed p-8 text-center transition ${
            dragOver
              ? 'border-accent bg-accent/10'
              : 'border-[#323449] bg-[#1B1C24]/50 hover:border-accent/50'
          }`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#21222D]">
            <UploadIcon className="h-8 w-8 text-accent" />
          </div>
          <p className="mt-4 font-display text-sm font-semibold text-soft-white">
            {uploading ? 'Uploading...' : (
              <>
                Drag & drop files here or{' '}
                <label className="cursor-pointer text-accent hover:underline">
                  browse
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={documentCategories.find(c => c.id === selectedCategory)?.acceptedTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-soft-white/50">
            Uploading to: {documentCategories.find(c => c.id === selectedCategory)?.name}
          </p>
          <p className="mt-1 text-xs text-soft-white/40">
            Max file size: 25MB
          </p>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-soft-white">
            Uploaded Documents ({documents.length})
          </h3>

          {documentCategories.map((category) => {
            const categoryDocs = getDocumentsByCategory(category.id)
            if (categoryDocs.length === 0) return null

            return (
              <div key={category.id} className="rounded-[12px] border border-[#323449] bg-[#1B1C24]">
                <div className="border-b border-[#323449] px-4 py-3">
                  <h4 className="font-display text-sm font-semibold text-soft-white">
                    {category.name}
                  </h4>
                </div>
                <div className="divide-y divide-[#323449]/50">
                  {categoryDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#21222D]">
                          <FileIcon className="h-5 w-5 text-soft-white/60" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-soft-white">{doc.fileName}</p>
                          <p className="text-xs text-soft-white/50">
                            {doc.fileType} • {formatFileSize(doc.fileSize)} • {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteDocument(doc)}
                        className="rounded p-2 text-soft-white/60 transition hover:bg-red-500/20 hover:text-red-400"
                      >
                        <DeleteIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-[10px] border border-[#323449] px-8 py-3 text-sm font-display font-semibold text-soft-white transition hover:border-accent"
        >
          Back to Setup Files
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="rounded-[10px] bg-accent px-10 py-3 text-sm font-display font-semibold text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)] transition hover:brightness-110"
        >
          Complete & Save Project
        </button>
      </div>
    </div>
  )
}

/* ===== Icons ===== */
function CategoryIcon({ type, className = '' }: { type: string; className?: string }) {
  switch (type) {
    case 'map':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    case 'file-text':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'clipboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    case 'folder':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    default:
      return null
  }
}

function UploadIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
      <path d="M20 16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4" />
    </svg>
  )
}

function FileIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}

function DeleteIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l8 8M14 6l-8 8" />
    </svg>
  )
}
