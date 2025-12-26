import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { ProjectSetupData, generateProjectId } from '@/lib/projectSetupTypes'

const DATA_DIR = path.join(process.cwd(), 'data', 'projects')

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// GET all projects or a specific project by ID
export async function GET(request: NextRequest) {
  try {
    await ensureDataDir()
    
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')
    
    if (projectId) {
      // Get specific project
      const filePath = path.join(DATA_DIR, `${projectId}.json`)
      try {
        const data = await fs.readFile(filePath, 'utf-8')
        return NextResponse.json(JSON.parse(data))
      } catch {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    } else {
      // Get all projects
      const files = await fs.readdir(DATA_DIR)
      const projects: ProjectSetupData[] = []
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readFile(path.join(DATA_DIR, file), 'utf-8')
          projects.push(JSON.parse(data))
        }
      }
      
      return NextResponse.json(projects)
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()
    
    const body = await request.json()
    const projectId = body.projectId || generateProjectId()
    
    const projectData: ProjectSetupData = {
      projectId,
      projectName: body.projectName || 'Untitled Project',
      // Basic Info fields
      ownerName: body.ownerName || '',
      consultantName: body.consultantName || '',
      contractNumber: body.contractNumber || '',
      contractValue: body.contractValue || null,
      contractStartDate: body.contractStartDate || '',
      contractEndDate: body.contractEndDate || '',
      projectLocation: body.projectLocation || '',
      description: body.description || '',
      initiative: body.initiative || '',
      template: body.template || '',
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Data tables
      employees: body.employees || [],
      equipment: body.equipment || [],
      materials: body.materials || [],
      services: body.services || [],
      executionPlan: body.executionPlan || [],
      supportingDocuments: body.supportingDocuments || [],
      // Status
      status: body.status || 'draft',
      currentStep: body.currentStep || 0,
      // Computed fields
      progress: body.progress || 0,
      health: body.health || 'on-track',
    }
    
    const filePath = path.join(DATA_DIR, `${projectId}.json`)
    await fs.writeFile(filePath, JSON.stringify(projectData, null, 2), 'utf-8')
    
    return NextResponse.json(projectData, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

// PUT - Update an existing project
export async function PUT(request: NextRequest) {
  try {
    await ensureDataDir()
    
    const body = await request.json()
    const projectId = body.projectId
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    const filePath = path.join(DATA_DIR, `${projectId}.json`)
    
    // Check if project exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Read existing data
    const existingData = JSON.parse(await fs.readFile(filePath, 'utf-8'))
    
    // Merge with new data
    const updatedData: ProjectSetupData = {
      ...existingData,
      ...body,
      updatedAt: new Date().toISOString(),
    }
    
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8')
    
    return NextResponse.json(updatedData)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    const filePath = path.join(DATA_DIR, `${projectId}.json`)
    
    try {
      await fs.unlink(filePath)
      return NextResponse.json({ message: 'Project deleted successfully' })
    } catch {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
