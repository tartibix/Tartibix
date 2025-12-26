import { ProjectSetupData } from './projectSetupTypes'

const STORAGE_KEY = 'tartibix_projects'
const DRAFT_KEY = 'tartibix_draft_project'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Get all projects from local storage
export function getLocalProjects(): ProjectSetupData[] {
  if (!isBrowser) return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
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
  
  const existingProjects = getLocalProjects()
  console.log('Existing projects count:', existingProjects.length)
  
  if (existingProjects.length === 0) {
    console.log('Initializing sample projects from JSON files...')
    try {
      // Load PRJ-SAMPLE-001
      const response1 = await fetch('/data/projects/PRJ-SAMPLE-001.json')
      if (response1.ok) {
        const project1 = await response1.json()
        saveLocalProject(project1)
        console.log('Loaded PRJ-SAMPLE-001')
      }
      
      // Load PRJ-SAMPLE-002
      const response2 = await fetch('/data/projects/PRJ-SAMPLE-002.json')
      if (response2.ok) {
        const project2 = await response2.json()
        saveLocalProject(project2)
        console.log('Loaded PRJ-SAMPLE-002')
      }
      
      console.log('Sample projects initialized successfully')
    } catch (error) {
      console.error('Error loading sample projects:', error)
    }
  } else {
    console.log('Projects already exist, skipping initialization')
  }
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
