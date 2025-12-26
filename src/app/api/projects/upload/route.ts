import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads')

// Ensure the uploads directory exists
async function ensureUploadsDir(projectId: string) {
  const projectDir = path.join(UPLOADS_DIR, projectId)
  try {
    await fs.access(projectDir)
  } catch {
    await fs.mkdir(projectDir, { recursive: true })
  }
  return projectDir
}

// POST - Upload a file for a project
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const projectId = formData.get('projectId') as string | null
    const category = formData.get('category') as string || 'other'
    const description = formData.get('description') as string || ''
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    const projectDir = await ensureUploadsDir(projectId)
    
    // Generate unique filename
    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const baseName = path.basename(file.name, ext)
    const uniqueFileName = `${baseName}-${timestamp}${ext}`
    
    const filePath = path.join(projectDir, uniqueFileName)
    
    // Convert File to Buffer and save
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(filePath, buffer)
    
    // Return file metadata
    const fileData = {
      id: `file-${timestamp}`,
      fileName: file.name,
      savedAs: uniqueFileName,
      fileType: ext.replace('.', '').toUpperCase(),
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      description,
      category,
      path: `/data/uploads/${projectId}/${uniqueFileName}`,
    }
    
    return NextResponse.json(fileData, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// GET - List files for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    const projectDir = path.join(UPLOADS_DIR, projectId)
    
    try {
      await fs.access(projectDir)
    } catch {
      return NextResponse.json([])
    }
    
    const files = await fs.readdir(projectDir)
    const fileList = await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(projectDir, fileName)
        const stats = await fs.stat(filePath)
        const ext = path.extname(fileName)
        
        return {
          id: fileName,
          fileName,
          fileType: ext.replace('.', '').toUpperCase(),
          fileSize: stats.size,
          uploadDate: stats.mtime.toISOString(),
          path: `/data/uploads/${projectId}/${fileName}`,
        }
      })
    )
    
    return NextResponse.json(fileList)
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// DELETE - Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const fileName = searchParams.get('fileName')
    
    if (!projectId || !fileName) {
      return NextResponse.json({ error: 'Project ID and file name are required' }, { status: 400 })
    }
    
    const filePath = path.join(UPLOADS_DIR, projectId, fileName)
    
    try {
      await fs.unlink(filePath)
      return NextResponse.json({ message: 'File deleted successfully' })
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
