import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { ProjectSetupData, generateProjectId } from '@/lib/projectSetupTypes'
import { getSupabaseClient, isDatabaseAvailable } from '@/lib/database'

const DATA_DIR = path.join(process.cwd(), 'data', 'projects')
const USE_DATABASE = process.env.USE_DATABASE === 'true'

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Get data source preference
async function getDataSource(): Promise<'database' | 'filesystem'> {
  if (USE_DATABASE) {
    const dbAvailable = await isDatabaseAvailable()
    if (dbAvailable) return 'database'
  }
  return 'filesystem'
}

// GET all projects or a specific project by ID
export async function GET(request: NextRequest) {
  try {
    const dataSource = await getDataSource()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')
    const includeDetails = searchParams.get('details') === 'true'
    
    if (dataSource === 'database') {
      const client = getSupabaseClient()
      if (!client) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
      }
      
      if (projectId) {
        // Get specific project from database
        let query = client.from('projects').select('*').eq('project_id', projectId)
        const { data, error } = await query.single()
        
        if (error) {
          if (error.code === 'PGRST116') {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
          }
          throw error
        }
        
        // If details requested, fetch related data
        if (includeDetails && data) {
          const [employees, equipment, materials, services, tasks, documents] = await Promise.all([
            client.from('employees').select('*').eq('project_id', projectId),
            client.from('equipment').select('*').eq('project_id', projectId),
            client.from('materials').select('*').eq('project_id', projectId),
            client.from('services').select('*').eq('project_id', projectId),
            client.from('execution_tasks').select('*').eq('project_id', projectId),
            client.from('documents').select('*').eq('project_id', projectId),
          ])
          
          return NextResponse.json({
            ...data,
            employees: employees.data || [],
            equipment: equipment.data || [],
            materials: materials.data || [],
            services: services.data || [],
            executionPlan: tasks.data || [],
            supportingDocuments: documents.data || [],
          })
        }
        
        return NextResponse.json(data)
      } else {
        // Get all projects from database
        const { data, error } = await client
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        return NextResponse.json(data || [])
      }
    } else {
      // Fallback to filesystem
      await ensureDataDir()
      
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
            try {
              const data = await fs.readFile(path.join(DATA_DIR, file), 'utf-8')
              projects.push(JSON.parse(data))
            } catch (parseError) {
              console.error(`Error parsing ${file}:`, parseError)
            }
          }
        }
        
        // Sort by creation date descending
        projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        
        return NextResponse.json(projects)
      }
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    const dataSource = await getDataSource()
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
    
    if (dataSource === 'database') {
      const client = getSupabaseClient()
      if (!client) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
      }
      
      // Insert main project data
      const { data, error } = await client
        .from('projects')
        .insert({
          project_id: projectData.projectId,
          project_name: projectData.projectName,
          owner_name: projectData.ownerName,
          consultant_name: projectData.consultantName,
          contract_number: projectData.contractNumber,
          contract_value: projectData.contractValue,
          contract_start_date: projectData.contractStartDate,
          contract_end_date: projectData.contractEndDate,
          project_location: projectData.projectLocation,
          description: projectData.description,
          initiative: projectData.initiative,
          template: projectData.template,
          status: projectData.status,
          current_step: projectData.currentStep,
          progress: projectData.progress,
          health: projectData.health,
          created_at: projectData.createdAt,
          updated_at: projectData.updatedAt,
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Insert related data in parallel
      const relatedInserts = []
      
      if (projectData.employees?.length) {
        relatedInserts.push(
          client.from('employees').insert(
            projectData.employees.map(e => ({ ...e, project_id: projectId }))
          )
        )
      }
      
      if (projectData.equipment?.length) {
        relatedInserts.push(
          client.from('equipment').insert(
            projectData.equipment.map(e => ({ ...e, project_id: projectId }))
          )
        )
      }
      
      if (projectData.materials?.length) {
        relatedInserts.push(
          client.from('materials').insert(
            projectData.materials.map(m => ({ ...m, project_id: projectId }))
          )
        )
      }
      
      if (projectData.services?.length) {
        relatedInserts.push(
          client.from('services').insert(
            projectData.services.map(s => ({ ...s, project_id: projectId }))
          )
        )
      }
      
      if (projectData.executionPlan?.length) {
        relatedInserts.push(
          client.from('execution_tasks').insert(
            projectData.executionPlan.map(t => ({ ...t, project_id: projectId }))
          )
        )
      }
      
      await Promise.all(relatedInserts)
      
      return NextResponse.json(projectData, { status: 201 })
    } else {
      // Fallback to filesystem
      await ensureDataDir()
      const filePath = path.join(DATA_DIR, `${projectId}.json`)
      await fs.writeFile(filePath, JSON.stringify(projectData, null, 2), 'utf-8')
      
      return NextResponse.json(projectData, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

// PUT - Update an existing project
export async function PUT(request: NextRequest) {
  try {
    const dataSource = await getDataSource()
    const body = await request.json()
    const projectId = body.projectId
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    if (dataSource === 'database') {
      const client = getSupabaseClient()
      if (!client) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
      }
      
      // Update main project data
      const { data, error } = await client
        .from('projects')
        .update({
          project_name: body.projectName,
          owner_name: body.ownerName,
          consultant_name: body.consultantName,
          contract_number: body.contractNumber,
          contract_value: body.contractValue,
          contract_start_date: body.contractStartDate,
          contract_end_date: body.contractEndDate,
          project_location: body.projectLocation,
          description: body.description,
          initiative: body.initiative,
          template: body.template,
          status: body.status,
          current_step: body.currentStep,
          progress: body.progress,
          health: body.health,
          updated_at: new Date().toISOString(),
        })
        .eq('project_id', projectId)
        .select()
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }
        throw error
      }
      
      // Update related data if provided
      if (body.employees) {
        await client.from('employees').delete().eq('project_id', projectId)
        if (body.employees.length > 0) {
          await client.from('employees').insert(
            body.employees.map((e: any) => ({ ...e, project_id: projectId }))
          )
        }
      }
      
      if (body.equipment) {
        await client.from('equipment').delete().eq('project_id', projectId)
        if (body.equipment.length > 0) {
          await client.from('equipment').insert(
            body.equipment.map((e: any) => ({ ...e, project_id: projectId }))
          )
        }
      }
      
      if (body.materials) {
        await client.from('materials').delete().eq('project_id', projectId)
        if (body.materials.length > 0) {
          await client.from('materials').insert(
            body.materials.map((m: any) => ({ ...m, project_id: projectId }))
          )
        }
      }
      
      if (body.services) {
        await client.from('services').delete().eq('project_id', projectId)
        if (body.services.length > 0) {
          await client.from('services').insert(
            body.services.map((s: any) => ({ ...s, project_id: projectId }))
          )
        }
      }
      
      if (body.executionPlan) {
        await client.from('execution_tasks').delete().eq('project_id', projectId)
        if (body.executionPlan.length > 0) {
          await client.from('execution_tasks').insert(
            body.executionPlan.map((t: any) => ({ ...t, project_id: projectId }))
          )
        }
      }
      
      return NextResponse.json({ ...body, updatedAt: new Date().toISOString() })
    } else {
      // Fallback to filesystem
      await ensureDataDir()
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
    }
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const dataSource = await getDataSource()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    if (dataSource === 'database') {
      const client = getSupabaseClient()
      if (!client) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
      }
      
      // Delete related data first (cascade)
      await Promise.all([
        client.from('employees').delete().eq('project_id', projectId),
        client.from('equipment').delete().eq('project_id', projectId),
        client.from('materials').delete().eq('project_id', projectId),
        client.from('services').delete().eq('project_id', projectId),
        client.from('execution_tasks').delete().eq('project_id', projectId),
        client.from('documents').delete().eq('project_id', projectId),
      ])
      
      // Delete main project
      const { error } = await client
        .from('projects')
        .delete()
        .eq('project_id', projectId)
      
      if (error) throw error
      
      return NextResponse.json({ message: 'Project deleted successfully' })
    } else {
      // Fallback to filesystem
      const filePath = path.join(DATA_DIR, `${projectId}.json`)
      
      try {
        await fs.unlink(filePath)
        return NextResponse.json({ message: 'Project deleted successfully' })
      } catch {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
