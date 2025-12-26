import { NextRequest, NextResponse } from 'next/server'
import { getLocalProjects } from '@/lib/projectStorage'
import { ProjectSetupData, ExecutionPlanTask } from '@/lib/projectSetupTypes'

export interface TaskWithProject extends ExecutionPlanTask {
  projectId: string
  projectName: string
  projectPhase?: string
  // Computed fields
  status?: string
  assignedTo?: string
}

// Helper to compute task status from dates
function computeTaskStatus(task: ExecutionPlanTask): string {
  if (!task.startDate || !task.endDate) return 'Pending'
  const now = new Date()
  const start = new Date(task.startDate)
  const end = new Date(task.endDate)
  
  if (end < now) return 'Completed'
  if (start <= now && now <= end) return 'In Progress'
  return 'Pending'
}

// GET /api/tasks - Get all tasks across all projects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const assignee = searchParams.get('assignee')

    const projects = getLocalProjects()
    let allTasks: TaskWithProject[] = []

    for (const project of projects) {
      if (projectId && project.projectId !== projectId) continue

      const projectTasks = (project.executionPlan || []).map((task: ExecutionPlanTask) => ({
        ...task,
        projectId: project.projectId,
        projectName: project.projectName || 'Unnamed Project',
        projectPhase: 'Execution',
        status: computeTaskStatus(task),
        assignedTo: task.employeeCode || undefined,
      }))
      allTasks = allTasks.concat(projectTasks)
    }

    // Filter by status if provided
    if (status) {
      allTasks = allTasks.filter(task => 
        task.status?.toLowerCase() === status.toLowerCase()
      )
    }

    // Filter by assignee if provided
    if (assignee) {
      allTasks = allTasks.filter(task => 
        task.assignedTo?.toLowerCase().includes(assignee.toLowerCase())
      )
    }

    // Calculate task statistics
    const stats = {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'done').length,
      inProgress: allTasks.filter(t => t.status?.toLowerCase() === 'in progress' || t.status?.toLowerCase() === 'in-progress').length,
      pending: allTasks.filter(t => t.status?.toLowerCase() === 'pending' || t.status?.toLowerCase() === 'not started').length,
      overdue: allTasks.filter(t => {
        if (!t.endDate) return false
        const dueDate = new Date(t.endDate)
        return dueDate < new Date() && t.status?.toLowerCase() !== 'completed'
      }).length,
    }

    // Calculate overall progress
    const progress = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0

    return NextResponse.json({
      tasks: allTasks,
      stats,
      progress,
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, task } = body

    if (!projectId || !task) {
      return NextResponse.json(
        { error: 'Project ID and task data are required' },
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

    // Generate task ID
    const newTask: ExecutionPlanTask = {
      ...task,
      taskId: `TASK-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    // Add task to project
    if (!projects[projectIndex].executionPlan) {
      projects[projectIndex].executionPlan = []
    }
    projects[projectIndex].executionPlan!.push(newTask)

    // Save updated projects (would save to database in production)
    if (typeof window !== 'undefined') {
      localStorage.setItem('tartibix_projects', JSON.stringify(projects))
    }

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

// PUT /api/tasks - Update a task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, taskId, updates } = body

    if (!projectId || !taskId) {
      return NextResponse.json(
        { error: 'Project ID and Task ID are required' },
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

    const taskIndex = (projects[projectIndex].executionPlan || []).findIndex(
      (t: ExecutionPlanTask) => t.taskId === taskId
    )

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Update task
    projects[projectIndex].executionPlan![taskIndex] = {
      ...projects[projectIndex].executionPlan![taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // Save updated projects
    if (typeof window !== 'undefined') {
      localStorage.setItem('tartibix_projects', JSON.stringify(projects))
    }

    return NextResponse.json(projects[projectIndex].executionPlan![taskIndex])
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}
