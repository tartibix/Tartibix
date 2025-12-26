import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface Document {
  id: string
  name: string
  category: string
  version: string
  status: 'uploaded' | 'pending' | 'approved' | 'rejected'
  uploadedBy?: string
  uploadedAt: string
  size?: string
  mimeType?: string
  projectId?: string
  filePath?: string
  tags?: string[]
}

// Storage file path
const DOCUMENTS_FILE = path.join(process.cwd(), 'data', 'documents.json')

// Helper to read documents from file
function getDocuments(): Document[] {
  try {
    if (fs.existsSync(DOCUMENTS_FILE)) {
      const data = fs.readFileSync(DOCUMENTS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading documents:', error)
  }
  return getDefaultDocuments()
}

// Helper to save documents to file
function saveDocuments(documents: Document[]): void {
  try {
    const dir = path.dirname(DOCUMENTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2))
  } catch (error) {
    console.error('Error saving documents:', error)
  }
}

// Default documents (initial data)
function getDefaultDocuments(): Document[] {
  return [
    {
      id: 'doc-1',
      name: 'Contract',
      category: 'Contract',
      version: 'V1',
      status: 'approved',
      uploadedAt: new Date().toISOString(),
      size: '2.4 MB',
    },
    {
      id: 'doc-2',
      name: 'Floorplan',
      category: 'Drawings',
      version: 'Final',
      status: 'approved',
      uploadedAt: new Date().toISOString(),
      size: '15.8 MB',
    },
    {
      id: 'doc-3',
      name: 'Safety Inspection',
      category: 'Safety Report',
      version: 'V2',
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      size: '1.2 MB',
    },
    {
      id: 'doc-4',
      name: 'Invoice',
      category: 'Invoices',
      version: 'V3',
      status: 'approved',
      uploadedAt: new Date().toISOString(),
      size: '540 KB',
    },
    {
      id: 'doc-5',
      name: 'Project Specifications',
      category: 'Contract',
      version: 'V1',
      status: 'approved',
      uploadedAt: new Date().toISOString(),
      size: '3.1 MB',
    },
    {
      id: 'doc-6',
      name: 'Site Layout',
      category: 'Drawings',
      version: 'Final',
      status: 'approved',
      uploadedAt: new Date().toISOString(),
      size: '22.4 MB',
    },
    {
      id: 'doc-7',
      name: 'HSE Report',
      category: 'Safety Report',
      version: 'V2',
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      size: '890 KB',
    },
    {
      id: 'doc-8',
      name: 'Progress Payment',
      category: 'Invoices',
      version: 'V3',
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      size: '1.5 MB',
    },
  ]
}

// GET /api/documents - Get all documents
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let documents = getDocuments()

    // Filter by project if provided
    if (projectId) {
      documents = documents.filter(d => d.projectId === projectId)
    }

    // Filter by category if provided
    if (category) {
      documents = documents.filter(d => 
        d.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by status if provided
    if (status) {
      documents = documents.filter(d => d.status === status)
    }

    // Get unique categories
    const categories = [...new Set(documents.map(d => d.category))]

    // Calculate stats
    const stats = {
      total: documents.length,
      approved: documents.filter(d => d.status === 'approved').length,
      pending: documents.filter(d => d.status === 'pending').length,
      rejected: documents.filter(d => d.status === 'rejected').length,
    }

    return NextResponse.json({
      documents,
      categories,
      stats,
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Upload/create a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, version, projectId, uploadedBy, size, mimeType, tags } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    const documents = getDocuments()
    
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name,
      category,
      version: version || 'V1',
      status: 'uploaded',
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      size,
      mimeType,
      projectId,
      tags,
    }

    documents.push(newDocument)
    saveDocuments(documents)

    return NextResponse.json(newDocument, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}

// PUT /api/documents - Update document status or details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const documents = getDocuments()
    const docIndex = documents.findIndex(d => d.id === id)

    if (docIndex === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    documents[docIndex] = {
      ...documents[docIndex],
      ...updates,
    }

    saveDocuments(documents)

    return NextResponse.json(documents[docIndex])
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents - Delete a document
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    let documents = getDocuments()
    documents = documents.filter(d => d.id !== documentId)
    saveDocuments(documents)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
