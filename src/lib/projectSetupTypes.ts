// Project Setup Types for the 5 document tables

export interface Employee {
  id: string
  employeeCode: string // الكود الوظيفي
  jobTitle: string // المسمى الوظيفي
  rank: string // الرتبة الوظيفية
  dailyCost: number // تكلفة اليوم (المعيارية)
}

export interface Equipment {
  id: string
  equipmentCode: string // كود المعدة
  equipmentName: string // اسم المعدة
  responsiblePosition: string // الوظيفة المسؤولة
  responsibleEmployee: string // الموظف المسؤول
  dailyCost?: number // تكلفة اليوم (اختيارية)
}

export interface Material {
  id: string
  materialCode: string // كود المادة
  materialName: string // اسم المادة
  description: string // وصف المادة
  requiredQuantity: number // الكمية المطلوبة في المشروع
  unit: string // الوحدة
  estimatedValue?: number // قيمة المادة (التقديرية)
}

export interface Service {
  id: string
  serviceCode: string // كود الخدمة
  serviceName: string // اسم الخدمة
  description: string // وصف الخدمة
  unit: string // الوحدة
}

export interface ExecutionPlanTask {
  id: string
  taskId: string // Task_ID (رقم المهمة)
  taskName: string // Task_Name (اسم المهمة)
  startDate: string // Start_Date (تاريخ البدء)
  endDate: string // End_Date (تاريخ الانتهاء)
  parentId?: string // Parent_ID (المهمة الرئيسية)
  dependencies?: string // Dependencies (تعتمد على)
  employeeCode?: string // كود الوظيفة (المسؤول)
  employeeCount?: number // العدد
  equipmentCode?: string // كود المعدة
  equipmentCount?: number // العدد
  materialCode?: string // كود المادة
  materialQuantity?: number // الكمية
  serviceCode?: string // كود الخدمة
  notes?: string // ملاحظات
}

export interface SupportingDocument {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description?: string
  category: 'contractual' | 'execution' | 'design' | 'financial' | 'planning' | 'closeout' | 'plans' | 'templates' | 'logs' | 'other'
}

export interface ProjectSetupData {
  projectId: string
  projectName: string
  // Basic Info fields
  ownerName?: string
  consultantName?: string
  contractNumber?: string
  contractValue?: number
  contractStartDate?: string
  contractEndDate?: string
  projectLocation?: string
  description?: string
  initiative?: string
  template?: string
  // Timestamps
  createdAt: string
  updatedAt: string
  // Data tables
  employees: Employee[]
  equipment: Equipment[]
  materials: Material[]
  services: Service[]
  executionPlan: ExecutionPlanTask[]
  supportingDocuments: SupportingDocument[]
  // Status
  status: 'draft' | 'in-progress' | 'completed'
  currentStep: number
  // Computed fields for display
  progress?: number
  health?: 'on-track' | 'watch' | 'blocked'
}

export type SetupStepId = 'employees' | 'equipment' | 'materials' | 'services' | 'execution-plan' | 'supporting-docs'

export interface SetupStep {
  id: SetupStepId
  label: string
  description: string
  icon: string
  required: boolean
}

export const setupSteps: SetupStep[] = [
  {
    id: 'employees',
    label: 'Employees Table',
    description: 'Fill in employee codes, job titles, ranks, and daily costs',
    icon: 'users',
    required: true,
  },
  {
    id: 'equipment',
    label: 'Equipment Table',
    description: 'Fill in equipment codes, names, and responsible personnel',
    icon: 'tool',
    required: true,
  },
  {
    id: 'materials',
    label: 'Materials Table',
    description: 'Fill in material codes, names, quantities, and values',
    icon: 'package',
    required: true,
  },
  {
    id: 'services',
    label: 'Services Table',
    description: 'Fill in service codes, names, descriptions, and units',
    icon: 'briefcase',
    required: true,
  },
  {
    id: 'execution-plan',
    label: 'Execution Plan',
    description: 'Upload or create the project execution plan (CSV/XLSX)',
    icon: 'calendar',
    required: true,
  },
  {
    id: 'supporting-docs',
    label: 'Supporting Documents',
    description: 'Upload plans, templates, request forms, and project logs',
    icon: 'file-plus',
    required: false,
  },
]

// Generate unique project ID
export function generateProjectId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `PRJ-${timestamp}-${randomPart}`.toUpperCase()
}

// Create empty project setup data
export function createEmptyProjectSetup(projectName: string): ProjectSetupData {
  return {
    projectId: generateProjectId(),
    projectName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    employees: [],
    equipment: [],
    materials: [],
    services: [],
    executionPlan: [],
    supportingDocuments: [],
    status: 'draft',
    currentStep: 0,
  }
}

// Validation functions
export function isEmployeeValid(employee: Partial<Employee>): boolean {
  return Boolean(
    employee.employeeCode &&
    employee.jobTitle &&
    employee.rank &&
    employee.dailyCost !== undefined &&
    employee.dailyCost > 0
  )
}

export function isEquipmentValid(equipment: Partial<Equipment>): boolean {
  return Boolean(
    equipment.equipmentCode &&
    equipment.equipmentName &&
    equipment.responsiblePosition &&
    equipment.responsibleEmployee
  )
}

export function isMaterialValid(material: Partial<Material>): boolean {
  return Boolean(
    material.materialCode &&
    material.materialName &&
    material.description &&
    material.requiredQuantity !== undefined &&
    material.requiredQuantity > 0 &&
    material.unit
  )
}

export function isServiceValid(service: Partial<Service>): boolean {
  return Boolean(
    service.serviceCode &&
    service.serviceName &&
    service.description &&
    service.unit
  )
}

export function isExecutionTaskValid(task: Partial<ExecutionPlanTask>): boolean {
  return Boolean(
    task.taskId &&
    task.taskName &&
    task.startDate &&
    task.endDate
  )
}
