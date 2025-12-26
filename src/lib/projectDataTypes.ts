/**
 * Extended Project Types for Real Construction Projects
 * Compatible with PROJECTS_BIG_DATA Excel file structure
 */

import { ProjectSetupData, Employee, Equipment, Material, Service, ExecutionPlanTask, SupportingDocument } from './projectSetupTypes'

// Project Registration Data (from 0_Project_Registration.xlsx)
export interface ProjectRegistration {
  projectId: string
  projectCode: string
  projectName: string
  projectNameAr?: string
  ownerName: string
  ownerNameAr?: string
  consultantName: string
  consultantNameAr?: string
  contractorName: string
  contractorNameAr?: string
  contractNumber: string
  contractType: ContractType
  contractValue: number
  currency: 'SAR' | 'USD' | 'EUR'
  contractStartDate: string
  contractEndDate: string
  durationMonths: number
  extensionMonths?: number
  revisedEndDate?: string
  projectLocation: string
  projectCity: string
  projectRegion: string
  coordinates?: { lat: number; lng: number }
  description: string
  scope: string
  projectType: ProjectType
  sector: ProjectSector
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status: ProjectStatus
  phase: ProjectPhase
  percentComplete: number
  // Financial
  originalContractValue: number
  approvedVariations: number
  revisedContractValue: number
  invoicedToDate: number
  paidToDate: number
  retentionAmount: number
  // Dates
  sitePossessionDate?: string
  mobilizationDate?: string
  actualStartDate?: string
  targetCompletionDate?: string
  actualCompletionDate?: string
  handoverDate?: string
  defectsLiabilityPeriod?: number // months
  // Contacts
  projectManagerName: string
  projectManagerEmail?: string
  projectManagerPhone?: string
  siteManagerName?: string
  clientRepName?: string
  consultantRepName?: string
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export type ContractType = 
  | 'Lump Sum'
  | 'Unit Price'
  | 'Cost Plus'
  | 'Design Build'
  | 'EPC'
  | 'EPCM'
  | 'BOT'
  | 'PPP'

export type ProjectType = 
  | 'Building'
  | 'Infrastructure'
  | 'Industrial'
  | 'Residential'
  | 'Commercial'
  | 'Healthcare'
  | 'Education'
  | 'Transportation'
  | 'Water & Wastewater'
  | 'Power & Energy'
  | 'Oil & Gas'
  | 'Telecommunications'

export type ProjectSector = 
  | 'Public'
  | 'Private'
  | 'Semi-Government'
  | 'International'

export type ProjectStatus = 
  | 'Draft'
  | 'Tendering'
  | 'Awarded'
  | 'Mobilization'
  | 'In Progress'
  | 'On Hold'
  | 'Delayed'
  | 'Completed'
  | 'Defects Liability'
  | 'Closed'
  | 'Cancelled'

export type ProjectPhase = 
  | 'Initiation'
  | 'Planning'
  | 'Design'
  | 'Procurement'
  | 'Construction'
  | 'Commissioning'
  | 'Handover'
  | 'Operations'
  | 'Closeout'

// Quality Inspection Data (from 1_Quality_Inspection.xlsx)
export interface QualityInspection {
  id: string
  projectId: string
  inspectionNumber: string
  inspectionDate: string
  inspectionTime?: string
  inspectorName: string
  inspectorCompany: 'Contractor' | 'Consultant' | 'Client' | 'Third Party'
  
  // Location
  location: string
  building?: string
  floor?: string
  zone?: string
  gridLine?: string
  
  // Inspection Details
  inspectionType: InspectionType
  workActivity: string
  discipline: EngineeringDiscipline
  tradeContractor?: string
  
  // Results
  result: 'Pass' | 'Fail' | 'Conditional Pass' | 'Not Applicable'
  conformance: number // percentage
  
  // Defects/NCRs
  defectsCount: number
  defects?: QualityDefect[]
  ncrRequired: boolean
  ncrNumber?: string
  
  // Documentation
  checklist?: string
  drawings?: string[]
  specifications?: string[]
  photos?: string[]
  
  // Follow-up
  correctiveAction?: string
  responsibleParty?: string
  dueDate?: string
  reinspectionDate?: string
  status: 'Open' | 'In Progress' | 'Closed' | 'Cancelled'
  
  // Signatures
  contractorSignature?: string
  consultantSignature?: string
  clientSignature?: string
  signedDate?: string
  
  createdAt: string
  updatedAt: string
}

export type InspectionType = 
  | 'Material Inspection'
  | 'Work Inspection'
  | 'Pre-Pour Inspection'
  | 'Post-Pour Inspection'
  | 'MEP Rough-In'
  | 'MEP Final'
  | 'Finishing Inspection'
  | 'Snagging'
  | 'Final Inspection'
  | 'Mock-Up Approval'

export type EngineeringDiscipline = 
  | 'Civil'
  | 'Structural'
  | 'Architectural'
  | 'Mechanical'
  | 'Electrical'
  | 'Plumbing'
  | 'Fire Protection'
  | 'HVAC'
  | 'Landscaping'
  | 'Interior Design'

export interface QualityDefect {
  id: string
  description: string
  severity: 'Minor' | 'Major' | 'Critical'
  location: string
  photo?: string
  correctiveAction?: string
  status: 'Open' | 'Resolved' | 'Verified'
}

// Site Progress Data (from 2_Site_Progress.xlsx)
export interface SiteProgressReport {
  id: string
  projectId: string
  reportNumber: string
  reportDate: string
  reportPeriod: 'Daily' | 'Weekly' | 'Monthly'
  preparedBy: string
  approvedBy?: string
  
  // Weather
  weatherCondition: WeatherCondition
  temperature?: number
  humidity?: number
  windSpeed?: number
  rainHours?: number
  workableHours: number
  
  // Progress
  sections: SiteProgressSection[]
  overallPlannedProgress: number
  overallActualProgress: number
  progressVariance: number
  
  // Resources
  manpowerSummary: ManpowerSummary
  equipmentSummary: EquipmentSummary
  
  // Issues
  delaysEncountered?: string[]
  issuesRaised?: string[]
  actionsRequired?: string[]
  
  // Plans
  workCompletedToday: string[]
  workPlannedTomorrow: string[]
  lookaheadItems?: string[]
  
  // Photos
  progressPhotos?: ProgressPhoto[]
  
  // Milestones
  milestonesAchieved?: string[]
  upcomingMilestones?: { name: string; dueDate: string }[]
  
  status: 'Draft' | 'Submitted' | 'Approved' | 'Revised'
  createdAt: string
  updatedAt: string
}

export type WeatherCondition = 
  | 'Clear'
  | 'Partly Cloudy'
  | 'Cloudy'
  | 'Rain'
  | 'Heavy Rain'
  | 'Sandstorm'
  | 'Extreme Heat'

export interface SiteProgressSection {
  id: string
  workPackage: string
  activity: string
  location: string
  plannedQty: number
  actualQty: number
  unit: string
  plannedProgress: number
  actualProgress: number
  variance: number
  remarks?: string
}

export interface ManpowerSummary {
  categories: ManpowerCategory[]
  totalPlanned: number
  totalActual: number
  totalManHours: number
}

export interface ManpowerCategory {
  category: string
  trade: string
  planned: number
  actual: number
  hours: number
}

export interface EquipmentSummary {
  items: EquipmentStatus[]
  totalEquipment: number
  operationalCount: number
  idleCount: number
  breakdownCount: number
}

export interface EquipmentStatus {
  equipmentCode: string
  equipmentName: string
  status: 'Operational' | 'Idle' | 'Breakdown' | 'Maintenance'
  hoursWorked: number
  operator?: string
  remarks?: string
}

export interface ProgressPhoto {
  id: string
  url: string
  caption: string
  location: string
  takenAt: string
  takenBy: string
}

// Financial Summary Data (from 7_Financials.xlsx)
export interface FinancialSummary {
  projectId: string
  reportDate: string
  currency: string
  
  // Contract Values
  originalContractValue: number
  approvedVariations: number
  pendingVariations: number
  revisedContractValue: number
  
  // Progress Billing
  percentComplete: number
  earnedValue: number
  previousCertified: number
  currentCertified: number
  totalCertified: number
  retentionDeducted: number
  advanceRecovery: number
  netCertified: number
  
  // Payments
  previousPayments: number
  currentPayment: number
  totalPayments: number
  outstandingAmount: number
  averagePaymentDays?: number
  
  // Costs
  actualCostToDate: number
  committedCost: number
  estimateToComplete: number
  estimateAtCompletion: number
  costVariance: number
  
  // Profitability
  grossProfit: number
  grossProfitMargin: number
  projectedFinalProfit: number
  projectedProfitMargin: number
  
  // Budget Breakdown
  costBreakdown: CostBreakdown[]
  variationOrders: VariationOrder[]
  claims: ClaimRecord[]
  
  // Cash Flow
  cashFlowProjection?: CashFlowItem[]
  
  createdAt: string
  updatedAt: string
}

export interface CostBreakdown {
  category: string
  budgetAmount: number
  actualAmount: number
  committedAmount: number
  variance: number
  percentUsed: number
}

export interface VariationOrder {
  voNumber: string
  description: string
  submittedDate: string
  submittedAmount: number
  approvedDate?: string
  approvedAmount?: number
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Partially Approved'
}

export interface ClaimRecord {
  claimNumber: string
  claimType: 'Extension of Time' | 'Cost' | 'Loss and Expense' | 'Disruption'
  description: string
  submittedDate: string
  submittedAmount: number
  approvedAmount?: number
  status: 'Draft' | 'Submitted' | 'Negotiating' | 'Approved' | 'Rejected' | 'Settled'
}

export interface CashFlowItem {
  period: string // YYYY-MM
  plannedIncome: number
  actualIncome: number
  plannedExpense: number
  actualExpense: number
  netCashFlow: number
  cumulativeCashFlow: number
}

// Extended Project Data combining all sources
export interface ExtendedProjectData extends ProjectSetupData {
  registration?: ProjectRegistration
  qualityInspections?: QualityInspection[]
  siteProgressReports?: SiteProgressReport[]
  financialSummary?: FinancialSummary
}

// Utility functions for project data conversion
export function convertToProjectSetupData(registration: ProjectRegistration): ProjectSetupData {
  return {
    projectId: registration.projectId,
    projectName: registration.projectName,
    ownerName: registration.ownerName,
    consultantName: registration.consultantName,
    contractNumber: registration.contractNumber,
    contractValue: registration.contractValue,
    contractStartDate: registration.contractStartDate,
    contractEndDate: registration.contractEndDate,
    projectLocation: registration.projectLocation,
    description: registration.description,
    initiative: registration.projectType.toLowerCase().replace(/ /g, '-'),
    template: 'blank',
    createdAt: registration.createdAt,
    updatedAt: registration.updatedAt,
    employees: [],
    equipment: [],
    materials: [],
    services: [],
    executionPlan: [],
    supportingDocuments: [],
    status: mapProjectStatus(registration.status),
    currentStep: 0,
    progress: registration.percentComplete,
    health: calculateProjectHealth(registration),
  }
}

function mapProjectStatus(status: ProjectStatus): 'draft' | 'in-progress' | 'completed' {
  switch (status) {
    case 'Draft':
    case 'Tendering':
      return 'draft'
    case 'Completed':
    case 'Closed':
    case 'Defects Liability':
      return 'completed'
    default:
      return 'in-progress'
  }
}

function calculateProjectHealth(registration: ProjectRegistration): 'on-track' | 'watch' | 'blocked' {
  // Calculate health based on schedule and cost variance
  const now = new Date()
  const endDate = new Date(registration.contractEndDate)
  const startDate = new Date(registration.contractStartDate)
  
  // Calculate expected progress based on timeline
  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  const expectedProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  
  // Compare actual vs expected progress
  const progressVariance = registration.percentComplete - expectedProgress
  
  // Calculate cost variance
  const costVariance = registration.revisedContractValue > 0 
    ? ((registration.revisedContractValue - registration.invoicedToDate) / registration.revisedContractValue) * 100
    : 0
  
  if (progressVariance < -15 || costVariance < -10 || registration.status === 'On Hold' || registration.status === 'Delayed') {
    return 'blocked'
  } else if (progressVariance < -5 || costVariance < -5) {
    return 'watch'
  }
  
  return 'on-track'
}

// Project statistics calculation
export function calculateProjectStatistics(projects: ProjectSetupData[]): ProjectStatistics {
  const total = projects.length
  const completed = projects.filter(p => p.status === 'completed').length
  const inProgress = projects.filter(p => p.status === 'in-progress').length
  const draft = projects.filter(p => p.status === 'draft').length
  
  const onTrack = projects.filter(p => p.health === 'on-track').length
  const watch = projects.filter(p => p.health === 'watch').length
  const blocked = projects.filter(p => p.health === 'blocked').length
  
  const totalContractValue = projects.reduce((sum, p) => sum + (p.contractValue || 0), 0)
  const avgProgress = total > 0 ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total : 0
  
  const totalEmployees = projects.reduce((sum, p) => sum + (p.employees?.length || 0), 0)
  const totalEquipment = projects.reduce((sum, p) => sum + (p.equipment?.length || 0), 0)
  const totalTasks = projects.reduce((sum, p) => sum + (p.executionPlan?.length || 0), 0)
  
  return {
    total,
    completed,
    inProgress,
    draft,
    onTrack,
    watch,
    blocked,
    totalContractValue,
    avgProgress: Math.round(avgProgress),
    totalEmployees,
    totalEquipment,
    totalTasks,
  }
}

export interface ProjectStatistics {
  total: number
  completed: number
  inProgress: number
  draft: number
  onTrack: number
  watch: number
  blocked: number
  totalContractValue: number
  avgProgress: number
  totalEmployees: number
  totalEquipment: number
  totalTasks: number
}
