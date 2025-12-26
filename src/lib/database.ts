/**
 * Database Configuration and Connection Utilities
 * Prepared for Supabase integration with real project data
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ProjectSetupData, Employee, Equipment, Material, Service, ExecutionPlanTask, SupportingDocument } from './projectSetupTypes'

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Database client singleton
let supabaseClient: SupabaseClient | null = null

/**
 * Get or create Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Using local storage fallback.')
    return null
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  
  return supabaseClient
}

/**
 * Check if database is configured and available
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const client = getSupabaseClient()
  if (!client) return false
  
  try {
    const { error } = await client.from('projects').select('count').limit(1)
    return !error
  } catch {
    return false
  }
}

/**
 * Database table definitions for project data
 * These match the structure of real project data from PROJECTS_BIG_DATA
 */
export interface DatabaseTables {
  projects: ProjectSetupData
  employees: Employee & { project_id: string }
  equipment: Equipment & { project_id: string }
  materials: Material & { project_id: string }
  services: Service & { project_id: string }
  execution_tasks: ExecutionPlanTask & { project_id: string }
  documents: SupportingDocument & { project_id: string }
  
  // Additional tables for real construction project data
  quality_inspections: QualityInspection
  site_progress: SiteProgress
  materials_log: MaterialsLog
  engineering_records: EngineeringRecord
  safety_hse: SafetyHSE
  correspondence: Correspondence
  financials: Financial
}

// Real project data interfaces (from Excel files in PROJECTS_BIG_DATA)
export interface QualityInspection {
  id: string
  project_id: string
  inspection_date: string
  inspector_name: string
  area_inspected: string
  inspection_type: string
  result: 'Pass' | 'Fail' | 'Conditional'
  defects_found?: string
  corrective_action?: string
  follow_up_date?: string
  status: 'Open' | 'Closed' | 'In Progress'
  attachments?: string[]
  created_at: string
  updated_at: string
}

export interface SiteProgress {
  id: string
  project_id: string
  report_date: string
  work_description: string
  location: string
  planned_progress: number
  actual_progress: number
  variance: number
  weather_conditions?: string
  manpower_count: number
  equipment_on_site: string[]
  issues?: string
  next_day_plan?: string
  photos?: string[]
  created_at: string
  updated_at: string
}

export interface MaterialsLog {
  id: string
  project_id: string
  material_code: string
  material_name: string
  supplier: string
  po_number?: string
  quantity_ordered: number
  quantity_received: number
  quantity_used: number
  unit: string
  unit_price: number
  total_value: number
  delivery_date?: string
  storage_location?: string
  quality_status: 'Approved' | 'Pending' | 'Rejected'
  batch_number?: string
  expiry_date?: string
  created_at: string
  updated_at: string
}

export interface EngineeringRecord {
  id: string
  project_id: string
  document_type: 'Drawing' | 'Specification' | 'Calculation' | 'RFI' | 'Submittal' | 'Shop Drawing'
  document_number: string
  title: string
  revision: string
  discipline: 'Civil' | 'Structural' | 'Architectural' | 'Mechanical' | 'Electrical' | 'Plumbing'
  status: 'For Review' | 'Approved' | 'Approved with Comments' | 'Revise and Resubmit' | 'Rejected'
  prepared_by: string
  reviewed_by?: string
  approved_by?: string
  submission_date: string
  response_date?: string
  comments?: string
  file_path?: string
  created_at: string
  updated_at: string
}

export interface SafetyHSE {
  id: string
  project_id: string
  report_date: string
  incident_type?: 'Near Miss' | 'First Aid' | 'Medical Treatment' | 'Lost Time' | 'Fatality'
  incident_description?: string
  location?: string
  persons_involved?: string[]
  corrective_actions?: string
  toolbox_meeting?: boolean
  safety_induction_count?: number
  ppe_compliance: number // percentage
  housekeeping_score: number // 1-10
  hazards_identified?: string[]
  inspections_completed?: string[]
  created_at: string
  updated_at: string
}

export interface Correspondence {
  id: string
  project_id: string
  correspondence_type: 'Letter' | 'Email' | 'Meeting Minutes' | 'Site Instruction' | 'Variation Order' | 'NCR' | 'Claim'
  reference_number: string
  date: string
  from_party: string
  to_party: string
  subject: string
  content?: string
  attachments?: string[]
  status: 'Open' | 'Responded' | 'Closed' | 'Pending Response'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  due_date?: string
  response_date?: string
  created_at: string
  updated_at: string
}

export interface Financial {
  id: string
  project_id: string
  transaction_date: string
  transaction_type: 'Invoice' | 'Payment' | 'Retention' | 'Variation' | 'Claim' | 'Cost'
  reference_number: string
  description: string
  amount: number
  currency: string
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid' | 'Rejected'
  category: 'Labor' | 'Materials' | 'Equipment' | 'Subcontractor' | 'Overheads' | 'Profit'
  cost_code?: string
  approved_by?: string
  payment_date?: string
  created_at: string
  updated_at: string
}

/**
 * Project repository for database operations
 */
export class ProjectRepository {
  private client: SupabaseClient | null
  
  constructor() {
    this.client = getSupabaseClient()
  }
  
  async getAll(): Promise<ProjectSetupData[]> {
    if (!this.client) {
      throw new Error('Database not configured')
    }
    
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
  
  async getById(projectId: string): Promise<ProjectSetupData | null> {
    if (!this.client) {
      throw new Error('Database not configured')
    }
    
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('project_id', projectId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }
  
  async create(project: Partial<ProjectSetupData>): Promise<ProjectSetupData> {
    if (!this.client) {
      throw new Error('Database not configured')
    }
    
    const { data, error } = await this.client
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async update(projectId: string, updates: Partial<ProjectSetupData>): Promise<ProjectSetupData> {
    if (!this.client) {
      throw new Error('Database not configured')
    }
    
    const { data, error } = await this.client
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('project_id', projectId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async delete(projectId: string): Promise<void> {
    if (!this.client) {
      throw new Error('Database not configured')
    }
    
    const { error } = await this.client
      .from('projects')
      .delete()
      .eq('project_id', projectId)
    
    if (error) throw error
  }
  
  // Specialized queries for construction project data
  async getProjectWithDetails(projectId: string): Promise<ProjectWithDetails | null> {
    if (!this.client) {
      throw new Error('Database not configured')
    }
    
    const [
      projectResult,
      employeesResult,
      equipmentResult,
      materialsResult,
      servicesResult,
      tasksResult,
      documentsResult,
    ] = await Promise.all([
      this.client.from('projects').select('*').eq('project_id', projectId).single(),
      this.client.from('employees').select('*').eq('project_id', projectId),
      this.client.from('equipment').select('*').eq('project_id', projectId),
      this.client.from('materials').select('*').eq('project_id', projectId),
      this.client.from('services').select('*').eq('project_id', projectId),
      this.client.from('execution_tasks').select('*').eq('project_id', projectId),
      this.client.from('documents').select('*').eq('project_id', projectId),
    ])
    
    if (projectResult.error) return null
    
    return {
      ...projectResult.data,
      employees: employeesResult.data || [],
      equipment: equipmentResult.data || [],
      materials: materialsResult.data || [],
      services: servicesResult.data || [],
      executionPlan: tasksResult.data || [],
      supportingDocuments: documentsResult.data || [],
    }
  }
}

export interface ProjectWithDetails extends ProjectSetupData {
  // Extended relations loaded from database
}

// Export singleton instance
export const projectRepository = new ProjectRepository()
