import { ProjectSetupData } from './projectSetupTypes'
import { calculateProjectStatistics, ProjectStatistics } from './projectDataTypes'

const STORAGE_KEY = 'tartibix_projects'
const DRAFT_KEY = 'tartibix_draft_project'
const SETTINGS_KEY = 'tartibix_settings'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Storage settings
interface StorageSettings {
  useDatabase: boolean
  initialized: boolean
  lastSync: string | null
}

function getSettings(): StorageSettings {
  if (!isBrowser) return { useDatabase: false, initialized: false, lastSync: null }
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : { useDatabase: false, initialized: false, lastSync: null }
  } catch {
    return { useDatabase: false, initialized: false, lastSync: null }
  }
}

function saveSettings(settings: StorageSettings): void {
  if (!isBrowser) return
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

// Get all projects from local storage
export function getLocalProjects(): ProjectSetupData[] {
  if (!isBrowser) return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const projects = data ? JSON.parse(data) : []
    // Sort by updated date descending
    return projects.sort((a: ProjectSetupData, b: ProjectSetupData) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

// Get project statistics
export function getProjectStatistics(): ProjectStatistics {
  const projects = getLocalProjects()
  return calculateProjectStatistics(projects)
}

// Get a specific project by ID
export function getLocalProject(projectId: string): ProjectSetupData | null {
  const projects = getLocalProjects()
  return projects.find(p => p.projectId === projectId) || null
}

// Save a project to local storage
export function saveLocalProject(project: ProjectSetupData): void {
  if (!isBrowser) return
  
  try {
    const projects = getLocalProjects()
    const existingIndex = projects.findIndex(p => p.projectId === project.projectId)
    
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() }
    } else {
      projects.push(project)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Delete a project from local storage
export function deleteLocalProject(projectId: string): void {
  if (!isBrowser) return

  try {
    const projects = getLocalProjects()
    const filtered = projects.filter(p => p.projectId !== projectId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting from localStorage:', error)
  }
}

// Initialize sample projects if none exist
export async function initializeSampleProjects(): Promise<void> {
  if (!isBrowser) return
  
  const settings = getSettings()
  if (settings.initialized) {
    console.log('Projects already initialized')
    return
  }
  
  const existingProjects = getLocalProjects()
  console.log('Existing projects count:', existingProjects.length)
  
  if (existingProjects.length === 0) {
    console.log('Initializing sample projects from JSON files...')
    try {
      // Load sample projects
      const sampleFiles = ['PRJ-SAMPLE-001.json', 'PRJ-SAMPLE-002.json']
      
      for (const file of sampleFiles) {
        try {
          const response = await fetch(`/data/projects/${file}`)
          if (response.ok) {
            const project = await response.json()
            // Ensure project has all required fields
            const completeProject: ProjectSetupData = {
              ...project,
              employees: project.employees || [],
              equipment: project.equipment || [],
              materials: project.materials || [],
              services: project.services || [],
              executionPlan: project.executionPlan || [],
              supportingDocuments: project.supportingDocuments || [],
              status: project.status || 'in-progress',
              currentStep: project.currentStep || 5,
              progress: project.progress || calculateProgress(project),
              health: project.health || 'on-track',
            }
            saveLocalProject(completeProject)
            console.log(`Loaded ${file}`)
          }
        } catch (fileError) {
          console.warn(`Could not load ${file}:`, fileError)
        }
      }
      
      // Also try to fetch from API
      try {
        const apiResponse = await fetch('/api/projects')
        if (apiResponse.ok) {
          const apiProjects = await apiResponse.json()
          if (Array.isArray(apiProjects)) {
            for (const project of apiProjects) {
              if (!getLocalProject(project.projectId)) {
                saveLocalProject(project)
                console.log(`Synced project ${project.projectId} from API`)
              }
            }
          }
        }
      } catch (apiError) {
        console.warn('Could not sync from API:', apiError)
      }
      
      console.log('Sample projects initialized successfully')
    } catch (error) {
      console.error('Error loading sample projects:', error)
    }
  }
  
  // Mark as initialized
  saveSettings({ ...settings, initialized: true, lastSync: new Date().toISOString() })
}

// Calculate project progress based on available data
function calculateProgress(project: Partial<ProjectSetupData>): number {
  if (project.progress !== undefined) return project.progress
  
  // Calculate based on execution plan if available
  if (project.executionPlan && project.executionPlan.length > 0) {
    const now = new Date()
    const completedTasks = project.executionPlan.filter(task => {
      if (!task.endDate) return false
      return new Date(task.endDate) < now
    }).length
    return Math.round((completedTasks / project.executionPlan.length) * 100)
  }
  
  // Calculate based on timeline if available
  if (project.contractStartDate && project.contractEndDate) {
    const start = new Date(project.contractStartDate)
    const end = new Date(project.contractEndDate)
    const now = new Date()
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
  }
  
  return 0
}

// Save draft project (single draft)
export function saveDraftProject(draft: Partial<ProjectSetupData>): void {
  if (!isBrowser) return
  
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      ...draft,
      updatedAt: new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error saving draft:', error)
  }
}

// Get draft project
export function getDraftProject(): Partial<ProjectSetupData> | null {
  if (!isBrowser) return null
  
  try {
    const data = localStorage.getItem(DRAFT_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error reading draft:', error)
    return null
  }
}

// Clear draft project
export function clearDraftProject(): void {
  if (!isBrowser) return
  
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch (error) {
    console.error('Error clearing draft:', error)
  }
}

// Export projects to JSON file
export function exportProjectsToJSON(): void {
  if (!isBrowser) return
  
  const projects = getLocalProjects()
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `tartibix_projects_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Import projects from JSON file
export function importProjectsFromJSON(file: File): Promise<ProjectSetupData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        const projects = Array.isArray(data) ? data : [data]
        
        // Validate and save each project
        projects.forEach(project => {
          if (project.projectId) {
            saveLocalProject(project)
          }
        })
        
        resolve(projects)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

// Get storage usage info
export function getStorageInfo(): { used: number; available: number; percentage: number } {
  if (!isBrowser) return { used: 0, available: 0, percentage: 0 }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY) || ''
    const used = new Blob([data]).size
    const available = 5 * 1024 * 1024 // 5MB typical localStorage limit
    const percentage = Math.round((used / available) * 100)
    
    return { used, available, percentage }
  } catch (error) {
    return { used: 0, available: 0, percentage: 0 }
  }
}

// Format bytes to human readable
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
