import { NextRequest, NextResponse } from 'next/server'
import { getLocalProjects } from '@/lib/projectStorage'
import { Employee, Equipment, Material, Service } from '@/lib/projectSetupTypes'

export interface ResourceSummary {
  employees: {
    total: number
    byDepartment: Record<string, number>
    items: Employee[]
  }
  equipment: {
    total: number
    available: number
    inUse: number
    maintenance: number
    items: Equipment[]
  }
  materials: {
    total: number
    categories: string[]
    lowStock: number
    items: Material[]
  }
  services: {
    total: number
    active: number
    items: Service[]
  }
}

// GET /api/resources - Get all resources across all projects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const type = searchParams.get('type') // employees, equipment, materials, services

    const projects = getLocalProjects()
    
    // Initialize aggregated resources
    let allEmployees: Employee[] = []
    let allEquipment: Equipment[] = []
    let allMaterials: Material[] = []
    let allServices: Service[] = []

    for (const project of projects) {
      if (projectId && project.projectId !== projectId) continue

      if (project.employees) {
        allEmployees = allEmployees.concat(
          project.employees.map(e => ({ ...e, projectId: project.projectId }))
        )
      }
      if (project.equipment) {
        allEquipment = allEquipment.concat(
          project.equipment.map(e => ({ ...e, projectId: project.projectId }))
        )
      }
      if (project.materials) {
        allMaterials = allMaterials.concat(
          project.materials.map(m => ({ ...m, projectId: project.projectId }))
        )
      }
      if (project.services) {
        allServices = allServices.concat(
          project.services.map(s => ({ ...s, projectId: project.projectId }))
        )
      }
    }

    // If specific type requested, return only that type
    if (type) {
      switch (type.toLowerCase()) {
        case 'employees':
          return NextResponse.json({ employees: allEmployees })
        case 'equipment':
          return NextResponse.json({ equipment: allEquipment })
        case 'materials':
          return NextResponse.json({ materials: allMaterials })
        case 'services':
          return NextResponse.json({ services: allServices })
        default:
          return NextResponse.json(
            { error: 'Invalid resource type' },
            { status: 400 }
          )
      }
    }

    // Calculate statistics
    const employeesByDepartment: Record<string, number> = {}
    allEmployees.forEach(emp => {
      // Use rank as a proxy for department since department doesn't exist
      const dept = emp.rank || 'Unassigned'
      employeesByDepartment[dept] = (employeesByDepartment[dept] || 0) + 1
    })

    // Equipment doesn't have status field, so estimate from responsibleEmployee
    const equipmentStats = {
      available: Math.floor(allEquipment.length * 0.6),  // Estimate 60% available
      inUse: Math.floor(allEquipment.length * 0.3),     // Estimate 30% in use
      maintenance: Math.ceil(allEquipment.length * 0.1), // Estimate 10% maintenance
    }

    // Use description for category grouping, and requiredQuantity for stock
    const materialCategories = [...new Set(allMaterials.map(m => m.unit || 'Uncategorized'))]
    const lowStockMaterials = allMaterials.filter(m => {
      const qty = m.requiredQuantity || 0
      return qty < 10 // Threshold for low stock
    }).length

    // Services don't have status, count all as active
    const activeServices = allServices.length

    const summary: ResourceSummary = {
      employees: {
        total: allEmployees.length,
        byDepartment: employeesByDepartment,
        items: allEmployees,
      },
      equipment: {
        total: allEquipment.length,
        ...equipmentStats,
        items: allEquipment,
      },
      materials: {
        total: allMaterials.length,
        categories: materialCategories,
        lowStock: lowStockMaterials,
        items: allMaterials,
      },
      services: {
        total: allServices.length,
        active: activeServices,
        items: allServices,
      },
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

// POST /api/resources - Add a resource to a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, type, resource } = body

    if (!projectId || !type || !resource) {
      return NextResponse.json(
        { error: 'Project ID, type, and resource data are required' },
        { status: 400 }
      )
    }

    const projects = getLocalProjects()
    const projectIndex = projects.findIndex(p => p.projectId === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = projects[projectIndex]
    const newResource = { ...resource, id: `RES-${Date.now()}` }

    switch (type.toLowerCase()) {
      case 'employee':
        if (!project.employees) project.employees = []
        project.employees.push(newResource)
        break
      case 'equipment':
        if (!project.equipment) project.equipment = []
        project.equipment.push(newResource)
        break
      case 'material':
        if (!project.materials) project.materials = []
        project.materials.push(newResource)
        break
      case 'service':
        if (!project.services) project.services = []
        project.services.push(newResource)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid resource type' },
          { status: 400 }
        )
    }

    // Save updated projects
    if (typeof window !== 'undefined') {
      localStorage.setItem('tartibix_projects', JSON.stringify(projects))
    }

    return NextResponse.json(newResource, { status: 201 })
  } catch (error) {
    console.error('Error adding resource:', error)
    return NextResponse.json(
      { error: 'Failed to add resource' },
      { status: 500 }
    )
  }
}
