'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { ProjectSetupData, Employee, Equipment, Material, Service, ExecutionPlanTask } from '@/lib/projectSetupTypes'
import { projectCreateFlowData } from '@/lib/projectCreateFlowData'

const { initiativeOptions } = projectCreateFlowData

type TabId = 'overview' | 'documents' | 'team' | 'financials'
type ViewMode = 'gantt' | 'kanban' | 'timeline'

// Sample Kanban data
const kanbanColumns = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      {
        id: 't1',
        title: 'Food Research',
        description: "Food design is required for our new project let's research the best practices.",
        daysLeft: 12,
        attachments: 5,
        comments: 8,
        assignees: ['JD', 'AM', 'SK'],
      },
      {
        id: 't2',
        title: 'Mockups',
        description: 'Create a 12 mockups for mobile iphone 13 pro max',
        daysLeft: 12,
        attachments: 3,
        comments: 6,
        assignees: ['LP', 'MR', 'TK'],
      },
      {
        id: 't3',
        title: 'UI Animation',
        description: 'Micro interaction loading and progress, story telling, Navigation',
        daysLeft: 12,
        attachments: 2,
        comments: 4,
        assignees: ['JD', 'SK', 'LP'],
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: 't4',
        title: 'User Interface',
        description: 'Design new user interface design for food delivery app',
        daysLeft: 12,
        attachments: 2,
        comments: 4,
        assignees: ['JD', 'AM', 'SK'],
      },
      {
        id: 't5',
        title: 'Usability Testing',
        description: 'Perform the usability testing for the newly develop app',
        daysLeft: 12,
        attachments: 3,
        comments: 5,
        assignees: ['LP', 'MR', 'TK'],
      },
      {
        id: 't6',
        title: 'Food Research',
        description: "Food design is required for our new project let's research the best practices.",
        daysLeft: 12,
        attachments: 5,
        comments: 9,
        assignees: ['AM', 'LP', 'JD'],
      },
    ],
  },
  {
    id: 'completed',
    title: 'Completed',
    tasks: [
      {
        id: 't7',
        title: 'Mind Mapping',
        description: 'Mind mapping for the food delivery app for by targeting young users',
        daysLeft: 12,
        attachments: 7,
        comments: 2,
        assignees: ['SK', 'AM', 'TK'],
      },
      {
        id: 't8',
        title: 'Food Research',
        description: "Food design is required for our new project let's research the best practices.",
        daysLeft: 12,
        attachments: 5,
        comments: 5,
        assignees: ['JD', 'LP', 'MR'],
      },
      {
        id: 't9',
        title: 'User Feedback',
        description: 'Perform the user survey and take necessary steps to solve their problem with existing one',
        daysLeft: 12,
        attachments: 5,
        comments: 8,
        assignees: ['JD', 'AM', 'TK'],
      },
    ],
  },
]

// Sample Gantt data
const ganttTasks = [
  { id: 'g1', name: 'Research', phase: 'Research', start: 0, duration: 4, color: '#FFB347' },
  { id: 'g2', name: 'Gathering Specs', phase: 'Planning', start: 2, duration: 3, color: '#8B5CF6' },
  { id: 'g3', name: 'UX Design', phase: 'Design', start: 4, duration: 5, color: '#F472B6' },
  { id: 'g4', name: 'UI Design', phase: 'Design', start: 6, duration: 4, color: '#60A5FA' },
  { id: 'g5', name: 'Design System', phase: 'Design', start: 8, duration: 3, color: '#34D399' },
  { id: 'g6', name: 'Handover', phase: 'Delivery', start: 10, duration: 2, color: '#FBBF24' },
]

// Sample Timeline data
const timelineYears = ['2015', '2016', '2017', '2018', '2019']
const timelineTasks = [
  { id: 'tl1', title: 'Food Research', year: '2015', description: "Food design is required for our new project let's research the best practices." },
  { id: 'tl2', title: 'Food Research', year: '2016', description: "Food design is required for our new project let's research the best practices." },
  { id: 'tl3', title: 'Food Research', year: '2017', description: "Food design is required for our new project let's research the best practices." },
  { id: 'tl4', title: 'Food Research', year: '2018', description: "Food design is required for our new project let's research the best practices." },
  { id: 'tl5', title: 'Food Research', year: '2019', description: "Food design is required for our new project let's research the best practices." },
]

// Document category icons
const DocumentIcons = {
  contractual: (color: string) => (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  execution: (color: string) => (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  design: (color: string) => (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill={color} />
      <circle cx="17.5" cy="10.5" r="0.5" fill={color} />
      <circle cx="8.5" cy="7.5" r="0.5" fill={color} />
      <circle cx="6.5" cy="12.5" r="0.5" fill={color} />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  financial: (color: string) => (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  planning: (color: string) => (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  closeout: (color: string) => (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
}

// Document categories
const documentCategories = [
  { id: 'contractual', name: 'Contractual & Legal', color: '#A9DFD8' },
  { id: 'execution', name: 'Execution & Correspondence', color: '#FFE48C' },
  { id: 'design', name: 'Design & Engineering', color: '#C5D3FF' },
  { id: 'financial', name: 'Financial & Change Management', color: '#F8B4B4' },
  { id: 'planning', name: 'Planning & Management', color: '#A9DFD8' },
  { id: 'closeout', name: 'Project Close-out', color: '#FFE48C' },
]

// Team hierarchy
const teamHierarchy = {
  projectManager: {
    id: 'pm1',
    name: 'Sarah Johnson',
    role: 'Project Manager',
    employeeId: '14893',
    children: [
      {
        id: 'lead1',
        name: 'Michael Chen',
        role: 'Technical Lead',
        employeeId: '14563',
        children: [
          { id: 'dev1', name: 'Alex Kim', role: 'Senior Developer', employeeId: '14564' },
          { id: 'dev2', name: 'Emma Wilson', role: 'Developer', employeeId: '14565' },
          { id: 'dev3', name: 'David Brown', role: 'Developer', employeeId: '14566' },
        ],
      },
      {
        id: 'lead2',
        name: 'Jessica Davis',
        role: 'Design Lead',
        employeeId: '14567',
        children: [
          { id: 'des1', name: 'Ryan Taylor', role: 'Senior Designer', employeeId: '14568' },
          { id: 'des2', name: 'Lisa Anderson', role: 'UI Designer', employeeId: '14569' },
        ],
      },
      {
        id: 'lead3',
        name: 'James Miller',
        role: 'QA Lead',
        employeeId: '14570',
        children: [
          { id: 'qa1', name: 'Sophie Martinez', role: 'QA Engineer', employeeId: '14571' },
          { id: 'qa2', name: 'Chris Lee', role: 'QA Engineer', employeeId: '14572' },
        ],
      },
    ],
  },
}

// Financial data
const financialData = {
  originalContractValue: 5750654.00,
  actualCostsToDate: 1864345.65,
  totalInvoiced: 2654100.00,
  projectedProfit: 5750654,
  paymentMilestones: [
    { id: 'pm1', name: 'Initial Payment', time: 'Due: Jan 15', status: 'Received' },
    { id: 'pm2', name: 'Phase 1 Complete', time: 'Due: Feb 28', status: 'Received' },
    { id: 'pm3', name: 'Phase 2 Complete', time: 'Due: Mar 31', status: 'Submitted' },
    { id: 'pm4', name: 'Final Delivery', time: 'Due: Apr 30', status: 'Not Received' },
  ],
  variationOrders: [
    { code: 'VO-001', value: 500000, status: 'Approved' },
    { code: 'VO-002', value: -306000, status: 'Rejected' },
    { code: 'VO-003', value: 5648, status: 'Pending' },
  ],
  costBreakdown: [
    { label: 'Materials', percent: 40, color: '#A9DFD8' },
    { label: 'Labor', percent: 20, color: '#FFE48C' },
    { label: 'Subcontractors', percent: 25, color: '#C5D3FF' },
    { label: 'Equipment', percent: 10, color: '#F8B4B4' },
    { label: 'Overheads', percent: 5, color: '#D1D5DB' },
  ],
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projectId = params.id
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [viewMode, setViewMode] = useState<ViewMode>('gantt')
  const [project, setProject] = useState<ProjectSetupData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch project data from API
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects?id=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data)
        } else {
          setError('Project not found')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [projectId])

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'team', label: 'Team' },
    { id: 'financials', label: 'Financials' },
  ]

  if (isLoading) {
    return (
      <DashboardShell>
        <TopBar title="Project Management" />
        <div className="mt-8 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="mt-4 text-soft-white/60">Loading project...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (error || !project) {
    return (
      <DashboardShell>
        <TopBar title="Project Management" />
        <div className="mt-8 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-soft-white/80 text-lg">{error || 'Project not found'}</p>
            <Link
              href="/dashboard/projects"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-sm font-semibold text-night hover:brightness-110 transition"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <TopBar title="Project Management" />
      <section className="mt-8 space-y-6">
        {/* Back Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 text-soft-white/70 hover:text-soft-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
              <path d="M12 4l-6 6 6 6" />
            </svg>
            <span className="text-sm">Back to Projects</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/projects/${projectId}/edit`}
              className="flex items-center gap-2 rounded-[10px] border border-[#323449] px-4 py-2 text-sm font-display font-semibold text-soft-white transition hover:border-accent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-10 10a2 2 0 01-.702.468l-4 1.5a.5.5 0 01-.632-.632l1.5-4a2 2 0 01.468-.702l10-10z" />
              </svg>
              Edit
            </Link>
            <Link
              href={`/dashboard/projects/${projectId}/settings`}
              className="flex items-center gap-2 rounded-[10px] border border-[#323449] px-4 py-2 text-sm font-display font-semibold text-soft-white transition hover:border-accent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </Link>
          </div>
        </div>

        {/* Project Header Card */}
        <ProjectHeaderCard project={project} />

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] bg-surface border border-[#2F303A] px-4 py-3 shadow-[0_0_10px_rgba(169,223,216,0.18)]">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-[10px] px-6 py-2.5 text-sm font-display font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-surface text-soft-white shadow-[0_0_8px_rgba(169,223,216,0.2)]'
                    : 'text-soft-white/70 hover:text-soft-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Link
            href={`/dashboard/projects/${projectId}/budget`}
            className="rounded-[10px] bg-surface px-6 py-2.5 text-sm font-display font-semibold text-soft-white shadow-[0_0_10px_rgba(169,223,216,0.18)] transition hover:brightness-110"
          >
            Project Budget
          </Link>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab viewMode={viewMode} onViewModeChange={setViewMode} project={project} />
        )}
        {activeTab === 'documents' && <DocumentsTab project={project} />}
        {activeTab === 'team' && <TeamTab project={project} />}
        {activeTab === 'financials' && <FinancialsTab project={project} />}
      </section>
    </DashboardShell>
  )
}

/* ===== Project Header Card ===== */
function ProjectHeaderCard({ project }: { project: ProjectSetupData }) {
  const progress = project.progress || 0
  const statusLabels: Record<string, string> = {
    draft: 'Draft',
    'in-progress': 'In Progress',
    completed: 'Completed',
  }

  // Format currency
  const formatCurrency = (value?: number) => {
    if (!value) return null
    return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(value)
  }

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  return (
    <div className="rounded-[36px] border border-[#2F303A] bg-surface p-6 shadow-[0_0_10px_rgba(169,223,216,0.4)]">
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 space-y-4">
          {/* Project Name & Status */}
          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-[#323449] bg-night px-5 py-2.5">
              <span className="text-sm text-soft-white font-semibold">{project.projectName}</span>
            </div>
            <div className={`rounded-full px-5 py-2.5 ${
              project.status === 'completed' 
                ? 'bg-[#1f3b30]/70 border border-[#315b48]'
                : project.status === 'in-progress'
                ? 'bg-[#3c3514]/70 border border-[#6b591f]'
                : 'bg-[#232a45]/70 border border-[#3f4c7f]'
            }`}>
              <span className={`text-sm ${
                project.status === 'completed' ? 'text-[#8CDCC7]'
                : project.status === 'in-progress' ? 'text-[#F7E5AA]'
                : 'text-[#C5D3FF]'
              }`}>{statusLabels[project.status] || project.status}</span>
            </div>
            {project.initiative && (
              <div className="rounded-full border border-[#323449] bg-night px-5 py-2.5">
                <span className="text-sm text-soft-white/80">
                  {initiativeOptions.find(opt => opt.value === project.initiative)?.label || project.initiative}
                </span>
              </div>
            )}
          </div>

          {/* Project Details Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {project.ownerName && (
              <div className="rounded-2xl border border-[#323449] bg-night px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-soft-white/50">Owner / Client</p>
                <p className="text-sm text-soft-white mt-1">{project.ownerName}</p>
              </div>
            )}
            {project.consultantName && (
              <div className="rounded-2xl border border-[#323449] bg-night px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-soft-white/50">Consultant</p>
                <p className="text-sm text-soft-white mt-1">{project.consultantName}</p>
              </div>
            )}
            {project.contractNumber && (
              <div className="rounded-2xl border border-[#323449] bg-night px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-soft-white/50">Contract #</p>
                <p className="text-sm text-soft-white mt-1">{project.contractNumber}</p>
              </div>
            )}
            {project.contractValue && (
              <div className="rounded-2xl border border-[#323449] bg-night px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-soft-white/50">Contract Value</p>
                <p className="text-sm text-accent mt-1 font-semibold">{formatCurrency(project.contractValue)}</p>
              </div>
            )}
            {project.contractStartDate && (
              <div className="rounded-2xl border border-[#323449] bg-night px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-soft-white/50">Start Date</p>
                <p className="text-sm text-soft-white mt-1">{formatDate(project.contractStartDate)}</p>
              </div>
            )}
            {project.contractEndDate && (
              <div className="rounded-2xl border border-[#323449] bg-night px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-soft-white/50">End Date</p>
                <p className="text-sm text-soft-white mt-1">{formatDate(project.contractEndDate)}</p>
              </div>
            )}
            {project.projectLocation && (
              <div className="rounded-2xl border border-[#323449] bg-night px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-soft-white/50">Location</p>
                <a href={project.projectLocation} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-1 block truncate">
                  View on Map
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <div className="rounded-2xl border border-[#323449] bg-night px-6 py-4">
              <span className="text-sm text-soft-white/80">{project.description}</span>
            </div>
          )}

          {/* Data Summary */}
          <div className="flex flex-wrap gap-2">
            {project.employees && project.employees.length > 0 && (
              <span className="rounded-full border border-[#323449] bg-night/50 px-3 py-1.5 text-xs text-soft-white/70">
                {project.employees.length} Employees
              </span>
            )}
            {project.equipment && project.equipment.length > 0 && (
              <span className="rounded-full border border-[#323449] bg-night/50 px-3 py-1.5 text-xs text-soft-white/70">
                {project.equipment.length} Equipment
              </span>
            )}
            {project.materials && project.materials.length > 0 && (
              <span className="rounded-full border border-[#323449] bg-night/50 px-3 py-1.5 text-xs text-soft-white/70">
                {project.materials.length} Materials
              </span>
            )}
            {project.services && project.services.length > 0 && (
              <span className="rounded-full border border-[#323449] bg-night/50 px-3 py-1.5 text-xs text-soft-white/70">
                {project.services.length} Services
              </span>
            )}
            {project.executionPlan && project.executionPlan.length > 0 && (
              <span className="rounded-full border border-[#323449] bg-night/50 px-3 py-1.5 text-xs text-soft-white/70">
                {project.executionPlan.length} Tasks
              </span>
            )}
          </div>
        </div>
        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative h-[120px] w-[120px]">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#323449"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#38EE4A"
                strokeWidth="10"
                strokeDasharray={`${(progress / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-semibold text-soft-white">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Overview Tab ===== */
function OverviewTab({ viewMode, onViewModeChange, project }: { viewMode: ViewMode; onViewModeChange: (mode: ViewMode) => void; project: ProjectSetupData }) {
  const viewModes: { id: ViewMode; label: string }[] = [
    { id: 'gantt', label: 'Gantt' },
    { id: 'kanban', label: 'Kanban' },
    { id: 'timeline', label: 'Timeline' },
  ]

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex flex-wrap gap-3">
        {viewModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onViewModeChange(mode.id)}
            className={`rounded-[10px] px-8 py-5 text-xl font-display font-medium transition ${
              viewMode === mode.id
                ? 'bg-accent text-night shadow-[0_0_10px_rgba(169,223,216,0.4)]'
                : 'bg-surface border border-[#323449] text-soft-white hover:border-accent/50'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* View Content */}
      {viewMode === 'gantt' && <GanttView project={project} />}
      {viewMode === 'kanban' && <KanbanView project={project} />}
      {viewMode === 'timeline' && <TimelineView project={project} />}
    </div>
  )
}

/* ===== Gantt View ===== */
function GanttView({ project }: { project: ProjectSetupData }) {
  const tasks = project.executionPlan || []
  
  // Get date range from tasks
  const dates = tasks.flatMap(t => [t.startDate, t.endDate].filter(Boolean))
  const minDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => new Date(d).getTime()))) : new Date()
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => new Date(d).getTime()))) : new Date()
  
  // Calculate total days span
  const totalDays = Math.max(Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)), 30)
  
  // Generate month headers based on date range
  const months: string[] = []
  const currentDate = new Date(minDate)
  while (currentDate <= maxDate) {
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!months.includes(monthName)) {
      months.push(monthName)
    }
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
  if (months.length === 0) months.push('No Data')

  // Colors for tasks
  const colors = ['#A9DFD8', '#FFE48C', '#C5D3FF', '#F8B4B4', '#34D399', '#FBBF24', '#60A5FA', '#F472B6']

  if (tasks.length === 0) {
    return (
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-soft-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-4 text-lg text-soft-white/60">No execution plan tasks yet</p>
        <p className="mt-2 text-sm text-soft-white/40">Add tasks in the project setup to see them here</p>
      </div>
    )
  }

  return (
    <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6 overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Month Headers */}
        <div className="flex border-b border-[#323449] pb-4">
          <div className="w-[200px] shrink-0" />
          {months.map((month) => (
            <div key={month} className="flex-1 text-center">
              <span className="font-display text-sm font-semibold text-soft-white">{month}</span>
            </div>
          ))}
        </div>

        {/* Gantt Bars */}
        <div className="mt-4 space-y-3">
          {tasks.map((task, index) => {
            const taskStart = new Date(task.startDate)
            const taskEnd = new Date(task.endDate)
            const startOffset = Math.max(0, (taskStart.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
            const duration = Math.max(1, (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24))
            const color = colors[index % colors.length]

            return (
              <div key={task.id} className="flex items-center">
                <div className="w-[200px] shrink-0 pr-4">
                  <span className="text-sm text-soft-white">{task.taskName}</span>
                  <span className="text-xs text-soft-white/50 block">{task.taskId}</span>
                </div>
                <div className="relative flex-1 h-10">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg flex items-center px-3"
                    style={{
                      left: `${(startOffset / totalDays) * 100}%`,
                      width: `${Math.max((duration / totalDays) * 100, 5)}%`,
                      backgroundColor: color,
                    }}
                  >
                    <span className="text-xs font-medium text-night truncate">{task.taskName}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ===== Kanban View ===== */
function KanbanView({ project }: { project: ProjectSetupData }) {
  const tasks = project.executionPlan || []
  
  // Group tasks by a simple status based on dates
  const today = new Date()
  const backlog = tasks.filter(t => new Date(t.startDate) > today)
  const inProgress = tasks.filter(t => {
    const start = new Date(t.startDate)
    const end = new Date(t.endDate)
    return start <= today && end >= today
  })
  const completed = tasks.filter(t => new Date(t.endDate) < today)

  const columns = [
    { id: 'backlog', title: 'Backlog', tasks: backlog },
    { id: 'in-progress', title: 'In Progress', tasks: inProgress },
    { id: 'completed', title: 'Completed', tasks: completed },
  ]

  if (tasks.length === 0) {
    return (
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-soft-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-4 text-lg text-soft-white/60">No execution plan tasks yet</p>
        <p className="mt-2 text-sm text-soft-white/40">Add tasks in the project setup to see them here</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="w-[355px] shrink-0 rounded-lg bg-surface border border-[#323449] shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between border-b border-[#323449] bg-[#323449] px-5 py-3 rounded-t-lg">
            <span className="font-display text-base font-medium text-soft-white">{column.title}</span>
            <span className="text-xs text-soft-white/60 bg-night px-2 py-1 rounded-full">{column.tasks.length}</span>
          </div>

          {/* Task Cards */}
          <div className="space-y-4 p-4">
            {column.tasks.length === 0 ? (
              <p className="text-center text-sm text-soft-white/40 py-4">No tasks</p>
            ) : (
              column.tasks.map((task) => (
                <RealTaskCard key={task.id} task={task} employees={project.employees} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function RealTaskCard({ task, employees }: { task: ExecutionPlanTask; employees: Employee[] }) {
  // Calculate days until end date
  const endDate = new Date(task.endDate)
  const today = new Date()
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  
  // Find assigned employee
  const assignedEmployee = employees.find(e => e.employeeCode === task.employeeCode)

  return (
    <div className="rounded-lg border border-[#323449] bg-surface p-4 shadow-[0_0_3px_1px_rgba(0,0,0,0.15)]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-display text-base font-medium text-soft-white">{task.taskName}</h4>
          <span className="text-xs text-soft-white/50">{task.taskId}</span>
        </div>
        <div className="flex items-center gap-1 text-soft-white/50">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="10" r="8" />
            <path d="M10 6v4l2 2" />
          </svg>
          <span className="text-xs">{daysLeft} Days</span>
        </div>
      </div>
      <div className="text-xs text-soft-white/60 space-y-1 mb-3">
        <p>Start: {new Date(task.startDate).toLocaleDateString()}</p>
        <p>End: {new Date(task.endDate).toLocaleDateString()}</p>
      </div>
      {task.notes && (
        <p className="text-sm text-soft-white/60 mb-4 line-clamp-2">{task.notes}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-soft-white/50">
          {task.employeeCount && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2 17v-1a7 7 0 017-7h2a7 7 0 017 7v1" />
              </svg>
              <span className="text-xs">{task.employeeCount}</span>
            </div>
          )}
          {task.equipmentCount && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              <span className="text-xs">{task.equipmentCount}</span>
            </div>
          )}
        </div>
        {assignedEmployee && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#2B3A42] to-[#1D2528] text-[10px] font-semibold text-soft-white">
              {assignedEmployee.jobTitle.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs text-soft-white/60">{assignedEmployee.jobTitle}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ===== Timeline View ===== */
function TimelineView({ project }: { project: ProjectSetupData }) {
  const tasks = project.executionPlan || []
  
  // Group tasks by month
  const tasksByMonth = tasks.reduce((acc, task) => {
    const date = new Date(task.startDate)
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(task)
    return acc
  }, {} as Record<string, ExecutionPlanTask[]>)

  const months = Object.keys(tasksByMonth).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (tasks.length === 0) {
    return (
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-soft-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-4 text-lg text-soft-white/60">No execution plan tasks yet</p>
        <p className="mt-2 text-sm text-soft-white/40">Add tasks in the project setup to see them here</p>
      </div>
    )
  }

  return (
    <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6 overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Month Headers */}
        <div className="flex items-end justify-between mb-8 relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#323449]" />
          {months.map((month) => (
            <div key={month} className="relative text-center flex-1">
              <span className="font-display text-lg font-semibold text-soft-white">{month}</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-20px]">
                <div className="h-6 w-6 rounded-full border-4 border-accent bg-night" />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Cards */}
        <div className={`grid gap-6 mt-16`} style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
          {months.map((month) => (
            <div key={month} className="space-y-4">
              {tasksByMonth[month].map((task) => (
                <div
                  key={task.id}
                  className="rounded-[14px] border border-[#323449] bg-night p-4"
                >
                  <h4 className="font-display text-base font-medium text-soft-white mb-1">{task.taskName}</h4>
                  <span className="text-xs text-soft-white/50">{task.taskId}</span>
                  <div className="mt-2 text-xs text-soft-white/60">
                    <p>{new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}</p>
                  </div>
                  {task.notes && (
                    <p className="text-xs text-soft-white/50 mt-2 line-clamp-2">{task.notes}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-soft-white/50">
                    {task.employeeCount && (
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs">{task.employeeCount}</span>
                      </div>
                    )}
                    {task.equipmentCount && (
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                          <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        <span className="text-xs">{task.equipmentCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== Documents Tab ===== */
function DocumentsTab({ project }: { project: ProjectSetupData }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const allDocuments = project.supportingDocuments || []

  // Count documents per category
  const getDocumentCount = (categoryId: string) => {
    return allDocuments.filter(doc => doc.category === categoryId).length
  }

  if (selectedCategory) {
    return <DocumentsListView categoryId={selectedCategory} onBack={() => setSelectedCategory(null)} project={project} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documentCategories.map((category) => {
        const count = getDocumentCount(category.id)
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className="group flex flex-col items-center rounded-[20px] border border-[#323449] bg-surface p-8 text-center transition hover:border-accent/50"
          >
            <div
              className="flex h-20 w-20 items-center justify-center rounded-[20px] mb-4"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {DocumentIcons[category.id as keyof typeof DocumentIcons](category.color)}
            </div>
            <h3 className="font-display text-lg font-semibold text-soft-white">{category.name}</h3>
            <span className="mt-2 text-sm text-soft-white/50">{count} {count === 1 ? 'document' : 'documents'}</span>
          </button>
        )
      })}
    </div>
  )
}

function DocumentsListView({ categoryId, onBack, project }: { categoryId: string; onBack: () => void; project: ProjectSetupData }) {
  const category = documentCategories.find((c) => c.id === categoryId)
  
  // Filter documents by selected category
  const allDocuments = project.supportingDocuments || []
  const documents = allDocuments.filter(doc => doc.category === categoryId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#323449] bg-night transition hover:border-accent"
          >
            <svg className="h-5 w-5 text-soft-white" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
              <path d="M12 4l-6 6 6 6" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[12px]" style={{ backgroundColor: `${category?.color}20` }}>
              {category && DocumentIcons[category.id as keyof typeof DocumentIcons](category.color)}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-soft-white">{category?.name}</h2>
              <p className="text-sm text-soft-white/60">
                Project documents and supporting files for {project.projectName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-[18px] border border-[#2F303A] bg-surface overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-soft-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-soft-white/60">No documents uploaded yet</p>
          </div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
              <th className="px-6 py-4 font-medium">#</th>
              <th className="px-6 py-4 font-medium">Document Name</th>
              <th className="px-6 py-4 font-medium">Document Type</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Upload Date</th>
              <th className="px-6 py-4 font-medium">Size</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.id} className="border-b border-[#323449]/50 last:border-0">
                <td className="px-6 py-4 text-sm text-soft-white/70">{String(index + 1).padStart(2, '0')}</td>
                <td className="px-6 py-4 text-sm text-soft-white">{doc.fileName}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{doc.fileType.toUpperCase()}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70 capitalize">{doc.category}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{(doc.fileSize / 1024).toFixed(1)} KB</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="rounded-[8px] border border-[#323449] px-4 py-1.5 text-xs font-semibold text-soft-white transition hover:border-accent"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}

/* ===== Team Tab ===== */
function TeamTab({ project }: { project: ProjectSetupData }) {
  const employees = project.employees || []

  // Calculate total daily cost
  const totalDailyCost = employees.reduce((sum, emp) => sum + (emp.dailyCost || 0), 0)

  // Build hierarchy based on rank levels
  // Define rank hierarchy order (top to bottom)
  const rankHierarchy: Record<string, number> = {
    'Senior Manager': 1,
    'Manager': 2,
    'Senior Engineer': 3,
    'Senior Architect': 4,
    'Senior Surveyor': 3,
    'Engineer': 4,
    'Architect': 4,
    'Surveyor': 4,
    'Officer': 5,
    'Coordinator': 5,
    'Other': 6,
  }

  // Group employees by their hierarchy level
  const getRankLevel = (rank: string) => rankHierarchy[rank] || 6
  
  // Sort employees by rank level
  const sortedEmployees = [...employees].sort((a, b) => {
    return getRankLevel(a.rank) - getRankLevel(b.rank)
  })

  // Get unique rank levels that exist in this project
  const uniqueRankLevels = [...new Set(sortedEmployees.map(emp => getRankLevel(emp.rank)))].sort((a, b) => a - b)

  if (employees.length === 0) {
    return (
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-soft-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <p className="mt-4 text-lg text-soft-white/60">No team members yet</p>
        <p className="mt-2 text-sm text-soft-white/40">Add employees in the project setup to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Team Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Total Members</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">{employees.length}</p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Hierarchy Levels</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">{uniqueRankLevels.length}</p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Daily Team Cost</p>
          <p className="font-display mt-1 text-2xl font-semibold text-accent">
            {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(totalDailyCost)}
          </p>
        </div>
      </div>

      {/* Team Hierarchy Tree */}
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
        <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Team Hierarchy</h3>
        <TeamHierarchyTree employees={sortedEmployees} rankHierarchy={rankHierarchy} />
      </div>

      {/* Employee Table */}
      <div className="rounded-[18px] border border-[#2F303A] bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-[#323449]">
          <h3 className="font-display text-lg font-semibold text-soft-white">All Team Members</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
              <th className="px-6 py-4 font-medium">#</th>
              <th className="px-6 py-4 font-medium">Employee Code</th>
              <th className="px-6 py-4 font-medium">Job Title</th>
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Daily Cost</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id} className="border-b border-[#323449]/50 last:border-0">
                <td className="px-6 py-4 text-sm text-soft-white/70">{String(index + 1).padStart(2, '0')}</td>
                <td className="px-6 py-4 text-sm text-soft-white">{emp.employeeCode}</td>
                <td className="px-6 py-4 text-sm text-soft-white">{emp.jobTitle}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{emp.rank}</td>
                <td className="px-6 py-4 text-sm text-accent font-semibold">
                  {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(emp.dailyCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ===== Team Hierarchy Tree Component ===== */
function TeamHierarchyTree({ employees, rankHierarchy }: { employees: Employee[]; rankHierarchy: Record<string, number> }) {
  const getRankLevel = (rank: string) => rankHierarchy[rank] || 6
  
  // Group employees by rank level
  const employeesByLevel = employees.reduce((acc, emp) => {
    const level = getRankLevel(emp.rank)
    if (!acc[level]) {
      acc[level] = []
    }
    acc[level].push(emp)
    return acc
  }, {} as Record<number, Employee[]>)

  const levels = Object.keys(employeesByLevel).map(Number).sort((a, b) => a - b)

  return (
    <div className="relative">
      {levels.map((level, levelIndex) => {
        const levelEmployees = employeesByLevel[level]
        const isFirst = levelIndex === 0
        const isLast = levelIndex === levels.length - 1

        return (
          <div key={level} className="relative">
            {/* Vertical connecting line from previous level */}
            {!isFirst && (
              <div className="absolute left-1/2 -top-6 h-6 w-px bg-[#323449]" />
            )}
            
            {/* Level container */}
            <div className={`flex flex-wrap justify-center gap-4 ${!isLast ? 'pb-12' : ''}`}>
              {levelEmployees.map((employee, empIndex) => (
                <div key={employee.id} className="relative">
                  {/* Horizontal line to siblings */}
                  {levelEmployees.length > 1 && empIndex === 0 && (
                    <div 
                      className="absolute top-0 left-1/2 h-px bg-[#323449]" 
                      style={{ width: `${(levelEmployees.length - 1) * 200}px` }}
                    />
                  )}
                  
                  {/* Employee Card */}
                  <div className="relative flex flex-col items-center">
                    {/* Vertical line down to next level */}
                    {!isLast && empIndex === Math.floor(levelEmployees.length / 2) && (
                      <div className="absolute -bottom-12 left-1/2 h-12 w-px bg-[#323449]" />
                    )}
                    
                    <div className={`rounded-[14px] border bg-night p-4 w-[180px] text-center transition hover:border-accent/50 ${
                      level === 1 ? 'border-accent/50 shadow-[0_0_15px_rgba(169,223,216,0.2)]' : 'border-[#323449]'
                    }`}>
                      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-display font-semibold mb-3 ${
                        level === 1 
                          ? 'bg-accent/20 text-accent' 
                          : level === 2 
                          ? 'bg-[#FFE48C]/20 text-[#FFE48C]'
                          : 'bg-gradient-to-br from-[#2B3A42] to-[#1D2528] text-soft-white'
                      }`}>
                        {employee.jobTitle.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="font-display text-sm font-semibold text-soft-white truncate">{employee.jobTitle}</p>
                      <p className="text-xs text-soft-white/50 mt-1">{employee.employeeCode}</p>
                      <div className="mt-2 pt-2 border-t border-[#323449]">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                          level === 1 
                            ? 'bg-accent/10 text-accent' 
                            : level === 2 
                            ? 'bg-[#FFE48C]/10 text-[#FFE48C]'
                            : 'bg-[#323449] text-soft-white/60'
                        }`}>
                          {employee.rank}
                        </span>
                      </div>
                      <p className="text-xs text-accent font-semibold mt-2">
                        {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(employee.dailyCost)}/day
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ===== Financials Tab ===== */
function FinancialsTab({ project }: { project: ProjectSetupData }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Calculate costs from project data
  const employees = project.employees || []
  const materials = project.materials || []
  const equipment = project.equipment || []
  
  const totalEmployeeDailyCost = employees.reduce((sum, emp) => sum + (emp.dailyCost || 0), 0)
  const totalMaterialsValue = materials.reduce((sum, mat) => sum + (mat.estimatedValue || 0), 0)
  const totalEquipmentDailyCost = equipment.reduce((sum, eq) => sum + (eq.dailyCost || 0), 0)
  
  const estimatedTotalCost = totalEmployeeDailyCost * 30 + totalMaterialsValue + totalEquipmentDailyCost * 30
  const contractValue = project.contractValue || 0
  const estimatedProfit = contractValue - estimatedTotalCost

  // Cost breakdown
  const costBreakdown = [
    { label: 'Labor', value: totalEmployeeDailyCost * 30, color: '#A9DFD8' },
    { label: 'Materials', value: totalMaterialsValue, color: '#FFE48C' },
    { label: 'Equipment', value: totalEquipmentDailyCost * 30, color: '#C5D3FF' },
  ].filter(item => item.value > 0)

  const totalBreakdown = costBreakdown.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Contract Value</p>
          <p className="font-display text-xl font-semibold text-soft-white">
            {formatCurrency(contractValue)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Estimated Costs</p>
          <p className="font-display text-xl font-semibold text-soft-white">
            {formatCurrency(estimatedTotalCost)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Materials Value</p>
          <p className="font-display text-xl font-semibold text-soft-white">
            {formatCurrency(totalMaterialsValue)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Estimated Profit</p>
          <p className={`font-display text-xl font-semibold ${estimatedProfit >= 0 ? 'text-[#63FFC9]' : 'text-[#FF9BB0]'}`}>
            {formatCurrency(estimatedProfit)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Resource Costs */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Daily Resource Costs</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Daily Cost</th>
                <th className="pb-3 font-medium">Monthly Est.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#323449]/50">
                <td className="py-3 text-sm text-soft-white">Employees</td>
                <td className="py-3 text-sm text-soft-white/70">{employees.length}</td>
                <td className="py-3 text-sm text-accent">{formatCurrency(totalEmployeeDailyCost)}</td>
                <td className="py-3 text-sm text-soft-white/70">{formatCurrency(totalEmployeeDailyCost * 30)}</td>
              </tr>
              <tr className="border-b border-[#323449]/50">
                <td className="py-3 text-sm text-soft-white">Equipment</td>
                <td className="py-3 text-sm text-soft-white/70">{equipment.length}</td>
                <td className="py-3 text-sm text-accent">{formatCurrency(totalEquipmentDailyCost)}</td>
                <td className="py-3 text-sm text-soft-white/70">{formatCurrency(totalEquipmentDailyCost * 30)}</td>
              </tr>
              <tr className="border-b border-[#323449]/50 last:border-0">
                <td className="py-3 text-sm text-soft-white">Materials (Total)</td>
                <td className="py-3 text-sm text-soft-white/70">{materials.length}</td>
                <td className="py-3 text-sm text-soft-white/50">-</td>
                <td className="py-3 text-sm text-accent">{formatCurrency(totalMaterialsValue)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-[#323449]">
                <td className="py-3 text-sm font-semibold text-soft-white">Total</td>
                <td className="py-3 text-sm text-soft-white/70">{employees.length + equipment.length + materials.length}</td>
                <td className="py-3 text-sm text-accent font-semibold">{formatCurrency(totalEmployeeDailyCost + totalEquipmentDailyCost)}</td>
                <td className="py-3 text-sm text-accent font-semibold">{formatCurrency(estimatedTotalCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Cost Breakdown */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Cost Breakdown</h3>
          {costBreakdown.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-soft-white/60">No cost data available</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {/* Donut Chart */}
              <div className="relative h-40 w-40 shrink-0">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  {costBreakdown.reduce((acc, item, index) => {
                    const offset = acc.offset
                    const circumference = 2 * Math.PI * 35
                    const percent = totalBreakdown > 0 ? (item.value / totalBreakdown) * 100 : 0
                    const strokeDasharray = (percent / 100) * circumference
                    acc.elements.push(
                      <circle
                        key={item.label}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="15"
                        strokeDasharray={`${strokeDasharray} ${circumference}`}
                        strokeDashoffset={-offset}
                      />
                    )
                    acc.offset += strokeDasharray
                    return acc
                  }, { elements: [] as React.ReactElement[], offset: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-sm font-semibold text-soft-white">{formatCurrency(totalBreakdown)}</span>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-3">
                {costBreakdown.map((item) => {
                  const percent = totalBreakdown > 0 ? Math.round((item.value / totalBreakdown) * 100) : 0
                  return (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-soft-white/60">{percent}%</span>
                      <span className="text-sm text-soft-white">{item.label}</span>
                      <span className="text-xs text-soft-white/50 ml-auto">{formatCurrency(item.value)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Materials Detail */}
      {materials.length > 0 && (
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Materials Cost Detail</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Material Code</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Unit</th>
                <th className="pb-3 font-medium">Estimated Value</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((mat, index) => (
                <tr key={mat.id} className="border-b border-[#323449]/50 last:border-0">
                  <td className="py-3 text-sm text-soft-white/70">{String(index + 1).padStart(2, '0')}</td>
                  <td className="py-3 text-sm text-soft-white">{mat.materialCode}</td>
                  <td className="py-3 text-sm text-soft-white">{mat.materialName}</td>
                  <td className="py-3 text-sm text-soft-white/70">{mat.requiredQuantity}</td>
                  <td className="py-3 text-sm text-soft-white/70">{mat.unit}</td>
                  <td className="py-3 text-sm text-accent">{mat.estimatedValue ? formatCurrency(mat.estimatedValue) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
