/**
 * Excel Data Parser Utilities
 * For parsing PROJECTS_BIG_DATA Excel files into project data structures
 */

import { ProjectSetupData, Employee, Equipment, Material, Service, ExecutionPlanTask } from './projectSetupTypes'
import {
  ProjectRegistration,
  QualityInspection,
  SiteProgressReport,
  FinancialSummary,
  convertToProjectSetupData,
} from './projectDataTypes'

// Note: This utility is designed to work with the xlsx library
// Install it with: npm install xlsx

/**
 * Parse Project Registration Excel file (0_Project_Registration.xlsx)
 */
export function parseProjectRegistration(data: any[]): Partial<ProjectRegistration> | null {
  if (!data || data.length === 0) return null
  
  // Assuming first row is headers, second row is data
  const row = data[1] || data[0]
  
  return {
    projectId: row['Project ID'] || row['project_id'] || generateProjectCode(),
    projectCode: row['Project Code'] || row['project_code'] || '',
    projectName: row['Project Name'] || row['project_name'] || '',
    projectNameAr: row['Project Name (AR)'] || row['اسم المشروع'] || '',
    ownerName: row['Owner Name'] || row['owner_name'] || row['Client'] || '',
    consultantName: row['Consultant Name'] || row['consultant_name'] || '',
    contractorName: row['Contractor Name'] || row['contractor_name'] || '',
    contractNumber: row['Contract Number'] || row['contract_number'] || '',
    contractValue: parseFloat(row['Contract Value'] || row['contract_value'] || 0),
    currency: row['Currency'] || 'SAR',
    contractStartDate: parseExcelDate(row['Start Date'] || row['contract_start_date']),
    contractEndDate: parseExcelDate(row['End Date'] || row['contract_end_date']),
    projectLocation: row['Location'] || row['project_location'] || '',
    projectCity: row['City'] || row['project_city'] || '',
    projectRegion: row['Region'] || row['project_region'] || '',
    description: row['Description'] || row['description'] || '',
    scope: row['Scope'] || row['scope'] || '',
    projectType: row['Project Type'] || row['project_type'] || 'Building',
    sector: row['Sector'] || row['sector'] || 'Private',
    status: row['Status'] || row['status'] || 'Draft',
    phase: row['Phase'] || row['phase'] || 'Initiation',
    percentComplete: parseFloat(row['Progress'] || row['percent_complete'] || 0),
    projectManagerName: row['Project Manager'] || row['project_manager_name'] || '',
  }
}

/**
 * Parse Employees from Excel
 */
export function parseEmployees(data: any[]): Employee[] {
  if (!data || data.length < 2) return []
  
  const headers = data[0]
  const rows = data.slice(1)
  
  return rows
    .filter(row => row && (row['Employee Code'] || row['employee_code'] || row['الكود الوظيفي']))
    .map((row, index) => ({
      id: `emp-${index + 1}`,
      employeeCode: row['Employee Code'] || row['employee_code'] || row['الكود الوظيفي'] || '',
      jobTitle: row['Job Title'] || row['job_title'] || row['المسمى الوظيفي'] || '',
      rank: row['Rank'] || row['rank'] || row['الرتبة الوظيفية'] || '',
      dailyCost: parseFloat(row['Daily Cost'] || row['daily_cost'] || row['تكلفة اليوم'] || 0),
    }))
}

/**
 * Parse Equipment from Excel
 */
export function parseEquipment(data: any[]): Equipment[] {
  if (!data || data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows
    .filter(row => row && (row['Equipment Code'] || row['equipment_code'] || row['كود المعدة']))
    .map((row, index) => ({
      id: `equip-${index + 1}`,
      equipmentCode: row['Equipment Code'] || row['equipment_code'] || row['كود المعدة'] || '',
      equipmentName: row['Equipment Name'] || row['equipment_name'] || row['اسم المعدة'] || '',
      responsiblePosition: row['Responsible Position'] || row['responsible_position'] || row['الوظيفة المسؤولة'] || '',
      responsibleEmployee: row['Responsible Employee'] || row['responsible_employee'] || row['الموظف المسؤول'] || '',
      dailyCost: parseFloat(row['Daily Cost'] || row['daily_cost'] || row['تكلفة اليوم'] || 0),
    }))
}

/**
 * Parse Materials from Excel
 */
export function parseMaterials(data: any[]): Material[] {
  if (!data || data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows
    .filter(row => row && (row['Material Code'] || row['material_code'] || row['كود المادة']))
    .map((row, index) => ({
      id: `mat-${index + 1}`,
      materialCode: row['Material Code'] || row['material_code'] || row['كود المادة'] || '',
      materialName: row['Material Name'] || row['material_name'] || row['اسم المادة'] || '',
      description: row['Description'] || row['description'] || row['وصف المادة'] || '',
      requiredQuantity: parseFloat(row['Required Quantity'] || row['required_quantity'] || row['الكمية المطلوبة'] || 0),
      unit: row['Unit'] || row['unit'] || row['الوحدة'] || '',
      estimatedValue: parseFloat(row['Estimated Value'] || row['estimated_value'] || row['القيمة التقديرية'] || 0),
    }))
}

/**
 * Parse Services from Excel
 */
export function parseServices(data: any[]): Service[] {
  if (!data || data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows
    .filter(row => row && (row['Service Code'] || row['service_code'] || row['كود الخدمة']))
    .map((row, index) => ({
      id: `srv-${index + 1}`,
      serviceCode: row['Service Code'] || row['service_code'] || row['كود الخدمة'] || '',
      serviceName: row['Service Name'] || row['service_name'] || row['اسم الخدمة'] || '',
      description: row['Description'] || row['description'] || row['وصف الخدمة'] || '',
      unit: row['Unit'] || row['unit'] || row['الوحدة'] || '',
    }))
}

/**
 * Parse Execution Plan from Excel
 */
export function parseExecutionPlan(data: any[]): ExecutionPlanTask[] {
  if (!data || data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows
    .filter(row => row && (row['Task ID'] || row['task_id'] || row['رقم المهمة']))
    .map((row, index) => ({
      id: `task-${index + 1}`,
      taskId: row['Task ID'] || row['task_id'] || row['رقم المهمة'] || `T-${index + 1}`,
      taskName: row['Task Name'] || row['task_name'] || row['اسم المهمة'] || '',
      startDate: parseExcelDate(row['Start Date'] || row['start_date'] || row['تاريخ البدء']),
      endDate: parseExcelDate(row['End Date'] || row['end_date'] || row['تاريخ الانتهاء']),
      parentId: row['Parent ID'] || row['parent_id'] || row['المهمة الرئيسية'] || undefined,
      dependencies: row['Dependencies'] || row['dependencies'] || row['تعتمد على'] || undefined,
      employeeCode: row['Employee Code'] || row['employee_code'] || row['كود الوظيفة'] || undefined,
      employeeCount: parseInt(row['Employee Count'] || row['employee_count'] || row['العدد'] || 1),
      equipmentCode: row['Equipment Code'] || row['equipment_code'] || row['كود المعدة'] || undefined,
      equipmentCount: parseInt(row['Equipment Count'] || row['equipment_count'] || 0),
      materialCode: row['Material Code'] || row['material_code'] || row['كود المادة'] || undefined,
      materialQuantity: parseFloat(row['Material Quantity'] || row['material_quantity'] || row['الكمية'] || 0),
      serviceCode: row['Service Code'] || row['service_code'] || row['كود الخدمة'] || undefined,
      notes: row['Notes'] || row['notes'] || row['ملاحظات'] || undefined,
    }))
}

/**
 * Parse Quality Inspections from Excel
 */
export function parseQualityInspections(data: any[]): Partial<QualityInspection>[] {
  if (!data || data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows
    .filter(row => row && (row['Inspection Number'] || row['inspection_number']))
    .map((row, index) => ({
      id: `qc-${index + 1}`,
      inspectionNumber: row['Inspection Number'] || row['inspection_number'] || '',
      inspectionDate: parseExcelDate(row['Inspection Date'] || row['inspection_date']),
      inspectorName: row['Inspector Name'] || row['inspector_name'] || '',
      location: row['Location'] || row['location'] || '',
      inspectionType: row['Inspection Type'] || row['inspection_type'] || '',
      workActivity: row['Work Activity'] || row['work_activity'] || '',
      discipline: row['Discipline'] || row['discipline'] || 'Civil',
      result: row['Result'] || row['result'] || 'Pass',
      status: row['Status'] || row['status'] || 'Open',
    }))
}

/**
 * Parse Site Progress from Excel
 */
export function parseSiteProgress(data: any[]): Partial<SiteProgressReport>[] {
  if (!data || data.length < 2) return []
  
  const rows = data.slice(1)
  
  return rows
    .filter(row => row && (row['Report Number'] || row['report_number']))
    .map((row, index) => ({
      id: `progress-${index + 1}`,
      reportNumber: row['Report Number'] || row['report_number'] || '',
      reportDate: parseExcelDate(row['Report Date'] || row['report_date']),
      preparedBy: row['Prepared By'] || row['prepared_by'] || '',
      overallPlannedProgress: parseFloat(row['Planned Progress'] || row['planned_progress'] || 0),
      overallActualProgress: parseFloat(row['Actual Progress'] || row['actual_progress'] || 0),
      progressVariance: parseFloat(row['Variance'] || row['variance'] || 0),
      status: row['Status'] || row['status'] || 'Draft',
    }))
}

/**
 * Parse Financials from Excel
 */
export function parseFinancials(data: any[]): Partial<FinancialSummary> {
  if (!data || data.length < 2) return {}
  
  const row = data[1] || data[0]
  
  return {
    originalContractValue: parseFloat(row['Original Contract Value'] || row['original_contract_value'] || 0),
    approvedVariations: parseFloat(row['Approved Variations'] || row['approved_variations'] || 0),
    revisedContractValue: parseFloat(row['Revised Contract Value'] || row['revised_contract_value'] || 0),
    percentComplete: parseFloat(row['Percent Complete'] || row['percent_complete'] || 0),
    totalCertified: parseFloat(row['Total Certified'] || row['total_certified'] || 0),
    totalPayments: parseFloat(row['Total Payments'] || row['total_payments'] || 0),
    actualCostToDate: parseFloat(row['Actual Cost'] || row['actual_cost_to_date'] || 0),
    currency: row['Currency'] || 'SAR',
  }
}

/**
 * Helper function to parse Excel dates
 */
function parseExcelDate(value: any): string {
  if (!value) return ''
  
  // If it's already a string in ISO format
  if (typeof value === 'string') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    return value
  }
  
  // If it's an Excel serial number
  if (typeof value === 'number') {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000)
    return date.toISOString().split('T')[0]
  }
  
  return ''
}

/**
 * Generate a unique project code
 */
function generateProjectCode(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 6)
  return `PRJ-${timestamp}-${random}`.toUpperCase()
}

/**
 * Combine all parsed data into a complete ProjectSetupData object
 */
export function combineProjectData(
  registration: Partial<ProjectRegistration>,
  employees: Employee[],
  equipment: Equipment[],
  materials: Material[],
  services: Service[],
  executionPlan: ExecutionPlanTask[]
): ProjectSetupData {
  const now = new Date().toISOString()
  
  return {
    projectId: registration.projectId || generateProjectCode(),
    projectName: registration.projectName || 'Untitled Project',
    ownerName: registration.ownerName,
    consultantName: registration.consultantName,
    contractNumber: registration.contractNumber,
    contractValue: registration.contractValue,
    contractStartDate: registration.contractStartDate,
    contractEndDate: registration.contractEndDate,
    projectLocation: registration.projectLocation,
    description: registration.description,
    initiative: registration.projectType?.toLowerCase().replace(/ /g, '-'),
    template: 'blank',
    createdAt: now,
    updatedAt: now,
    employees,
    equipment,
    materials,
    services,
    executionPlan,
    supportingDocuments: [],
    status: mapStatus(registration.status),
    currentStep: 5,
    progress: registration.percentComplete || 0,
    health: calculateHealth(registration.percentComplete || 0),
  }
}

function mapStatus(status?: string): 'draft' | 'in-progress' | 'completed' {
  if (!status) return 'draft'
  const lower = status.toLowerCase()
  if (lower.includes('complet') || lower.includes('closed')) return 'completed'
  if (lower.includes('progress') || lower.includes('execution') || lower.includes('construction')) return 'in-progress'
  return 'draft'
}

function calculateHealth(progress: number): 'on-track' | 'watch' | 'blocked' {
  if (progress >= 70) return 'on-track'
  if (progress >= 40) return 'watch'
  return 'blocked'
}

// Export all parsers
export const excelParsers = {
  parseProjectRegistration,
  parseEmployees,
  parseEquipment,
  parseMaterials,
  parseServices,
  parseExecutionPlan,
  parseQualityInspections,
  parseSiteProgress,
  parseFinancials,
  combineProjectData,
}
