'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { projectManagementData, type Project } from '@/lib/projectManagementData'

const { projects } = projectManagementData

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

  // Find the project by ID (using first project for demo)
  const project = projects[0]

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'team', label: 'Team' },
    { id: 'financials', label: 'Financials' },
  ]

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
          <OverviewTab viewMode={viewMode} onViewModeChange={setViewMode} />
        )}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'financials' && <FinancialsTab />}
      </section>
    </DashboardShell>
  )
}

/* ===== Project Header Card ===== */
function ProjectHeaderCard({ project }: { project: Project }) {
  const budgetPercent = Math.round((project.budgetUsed / project.budgetTotal) * 100)

  return (
    <div className="rounded-[36px] border border-[#2F303A] bg-surface p-6 shadow-[0_0_10px_rgba(169,223,216,0.4)]">
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-[#323449] bg-night px-5 py-2.5">
              <span className="text-sm text-soft-white">{project.name}</span>
            </div>
            <div className="rounded-full border border-[#323449] bg-night px-5 py-2.5">
              <span className="text-sm text-soft-white">{project.status}</span>
            </div>
            <div className="rounded-full border border-[#323449] bg-night px-5 py-2.5">
              <span className="text-sm text-soft-white">{project.manager}</span>
            </div>
            <div className="rounded-full border border-[#323449] bg-night px-5 py-2.5">
              <span className="text-sm text-soft-white">{project.owner}</span>
            </div>
          </div>
          <div className="rounded-full border border-[#323449] bg-night px-6 py-4">
            <span className="text-sm text-soft-white/80">{project.description}</span>
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
                strokeDasharray={`${(project.progress / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-semibold text-soft-white">{project.progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Overview Tab ===== */
function OverviewTab({ viewMode, onViewModeChange }: { viewMode: ViewMode; onViewModeChange: (mode: ViewMode) => void }) {
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
      {viewMode === 'gantt' && <GanttView />}
      {viewMode === 'kanban' && <KanbanView />}
      {viewMode === 'timeline' && <TimelineView />}
    </div>
  )
}

/* ===== Gantt View ===== */
function GanttView() {
  const months = ['January', 'February', 'March', 'April']
  const weeks = Array.from({ length: 16 }, (_, i) => i + 1)

  return (
    <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6 overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Month Headers */}
        <div className="flex border-b border-[#323449] pb-4">
          <div className="w-[150px] shrink-0" />
          {months.map((month) => (
            <div key={month} className="flex-1 text-center">
              <span className="font-display text-sm font-semibold text-soft-white">{month}</span>
            </div>
          ))}
        </div>

        {/* Week Headers */}
        <div className="flex border-b border-[#323449] py-2">
          <div className="w-[150px] shrink-0" />
          {weeks.map((week) => (
            <div key={week} className="flex-1 text-center">
              <span className="text-xs text-soft-white/50">W{week}</span>
            </div>
          ))}
        </div>

        {/* Gantt Bars */}
        <div className="mt-4 space-y-3">
          {ganttTasks.map((task) => (
            <div key={task.id} className="flex items-center">
              <div className="w-[150px] shrink-0 pr-4">
                <span className="text-sm text-soft-white">{task.name}</span>
              </div>
              <div className="relative flex-1 h-10">
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg flex items-center px-3"
                  style={{
                    left: `${(task.start / 16) * 100}%`,
                    width: `${(task.duration / 16) * 100}%`,
                    backgroundColor: task.color,
                  }}
                >
                  <span className="text-xs font-medium text-night truncate">{task.phase}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== Kanban View ===== */
function KanbanView() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {kanbanColumns.map((column) => (
        <div
          key={column.id}
          className="w-[355px] shrink-0 rounded-lg bg-surface border border-[#323449] shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between border-b border-[#323449] bg-[#323449] px-5 py-3 rounded-t-lg">
            <span className="font-display text-base font-medium text-soft-white">{column.title}</span>
            <button type="button" className="text-soft-white/60 hover:text-soft-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="4" cy="10" r="2" />
                <circle cx="10" cy="10" r="2" />
                <circle cx="16" cy="10" r="2" />
              </svg>
            </button>
          </div>

          {/* Add Task Button */}
          <div className="p-4">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-[#323449] py-3 text-soft-white/50 transition hover:border-accent/50 hover:text-accent"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
                <path d="M10 5v10M5 10h10" />
              </svg>
            </button>
          </div>

          {/* Task Cards */}
          <div className="space-y-4 px-4 pb-4">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TaskCard({ task }: { task: typeof kanbanColumns[number]['tasks'][number] }) {
  return (
    <div className="rounded-lg border border-[#323449] bg-surface p-4 shadow-[0_0_3px_1px_rgba(0,0,0,0.15)]">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-display text-base font-medium text-soft-white">{task.title}</h4>
        <div className="flex items-center gap-1 text-soft-white/50">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="10" r="8" />
            <path d="M10 6v4l2 2" />
          </svg>
          <span className="text-xs">{task.daysLeft} Days</span>
        </div>
      </div>
      <p className="text-sm text-soft-white/60 mb-4 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-soft-white/50">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2 17v-1a7 7 0 017-7h2a7 7 0 017 7v1" />
            </svg>
            <span className="text-xs">{task.attachments}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 10h4M8 14h2M6 18h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">{task.comments}</span>
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-soft-white/30 text-soft-white/50 hover:border-accent hover:text-accent"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v6M3 6h6" />
            </svg>
          </button>
          <div className="flex -space-x-2 ml-2">
            {task.assignees.map((initials, index) => (
              <div
                key={index}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#2B3A42] to-[#1D2528] text-[10px] font-semibold text-soft-white"
              >
                {initials}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Timeline View ===== */
function TimelineView() {
  return (
    <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6 overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Year Headers */}
        <div className="flex items-end justify-between mb-8 relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#323449]" />
          {timelineYears.map((year) => (
            <div key={year} className="relative text-center flex-1">
              <span className="font-display text-xl font-semibold text-soft-white">{year}</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-20px]">
                <div className="h-6 w-6 rounded-full border-4 border-accent bg-night" />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Cards */}
        <div className="grid grid-cols-5 gap-6 mt-16">
          {timelineTasks.map((task, index) => (
            <div
              key={task.id}
              className="rounded-[14px] border border-[#323449] bg-night p-4"
            >
              <h4 className="font-display text-base font-medium text-soft-white mb-2">{task.title}</h4>
              <p className="text-xs text-soft-white/60 mb-4 line-clamp-4">{task.description}</p>
              <div className="flex items-center justify-between text-soft-white/50">
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs">5</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 10h4M8 14h2" />
                  </svg>
                  <span className="text-xs">8</span>
                </div>
                <div className="flex -space-x-1">
                  {['JD', 'AM', 'SK'].map((initials, i) => (
                    <div
                      key={i}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#2B3A42] to-[#1D2528] text-[8px] font-semibold text-soft-white"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== Documents Tab ===== */
function DocumentsTab() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (selectedCategory) {
    return <DocumentsListView categoryId={selectedCategory} onBack={() => setSelectedCategory(null)} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documentCategories.map((category) => (
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
        </button>
      ))}
    </div>
  )
}

function DocumentsListView({ categoryId, onBack }: { categoryId: string; onBack: () => void }) {
  const category = documentCategories.find((c) => c.id === categoryId)
  
  const documents = [
    { id: 'd1', name: 'Contract Agreement', type: 'PDF', version: '1.2', lastModified: '2024-01-15', uploadedBy: 'John Doe' },
    { id: 'd2', name: 'NDA Document', type: 'PDF', version: '1.0', lastModified: '2024-01-14', uploadedBy: 'Jane Smith' },
    { id: 'd3', name: 'Terms of Service', type: 'DOCX', version: '2.1', lastModified: '2024-01-12', uploadedBy: 'Mike Johnson' },
    { id: 'd4', name: 'Privacy Policy', type: 'PDF', version: '1.5', lastModified: '2024-01-10', uploadedBy: 'Sarah Wilson' },
    { id: 'd5', name: 'Service Agreement', type: 'PDF', version: '1.0', lastModified: '2024-01-08', uploadedBy: 'Tom Brown' },
  ]

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
                This is the project&apos;s legal foundation. This section contains all signed agreements, tender documents, the Letter of Award (LOA), and bank guarantees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-[18px] border border-[#2F303A] bg-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
              <th className="px-6 py-4 font-medium">#</th>
              <th className="px-6 py-4 font-medium">Document Name</th>
              <th className="px-6 py-4 font-medium">Document Type</th>
              <th className="px-6 py-4 font-medium">Version</th>
              <th className="px-6 py-4 font-medium">Last Modified</th>
              <th className="px-6 py-4 font-medium">Uploaded By</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.id} className="border-b border-[#323449]/50 last:border-0">
                <td className="px-6 py-4 text-sm text-soft-white/70">{String(index + 1).padStart(2, '0')}</td>
                <td className="px-6 py-4 text-sm text-soft-white">{doc.name}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{doc.type}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{doc.version}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{doc.lastModified}</td>
                <td className="px-6 py-4 text-sm text-soft-white/70">{doc.uploadedBy}</td>
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
      </div>
    </div>
  )
}

/* ===== Team Tab ===== */
function TeamTab() {
  const renderMember = (member: any, isRoot = false, depth = 0) => {
    const hasChildren = member.children && member.children.length > 0

    return (
      <div key={member.id} className="flex flex-col items-center">
        {/* Connector from parent */}
        {!isRoot && (
          <div className="h-6 w-px bg-[#323449]" />
        )}
        
        {/* Member Card */}
        <div
          className={`rounded-[14px] border px-6 py-4 text-center transition hover:border-accent/50 ${
            isRoot
              ? 'border-accent/40 bg-gradient-to-b from-[#1B1C24] to-[#1a2428]'
              : 'border-[#323449] bg-night'
          }`}
          style={{ minWidth: '180px' }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2B3A42] to-[#1D2528] text-sm font-display font-semibold text-soft-white mb-2">
            {member.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <p className="font-display text-sm font-semibold text-soft-white">{member.name}</p>
          <p className="text-xs text-soft-white/60">{member.role}</p>
          <p className="text-[10px] text-soft-white/40 mt-1">Employee ID: {member.employeeId}</p>
        </div>

        {/* Children */}
        {hasChildren && (
          <>
            <div className="h-6 w-px bg-[#323449]" />
            {member.children.length > 1 && (
              <div
                className="h-px bg-[#323449]"
                style={{ width: `${member.children.length * 200}px` }}
              />
            )}
            <div className="flex gap-8 mt-0">
              {member.children.map((child: any) => renderMember(child, false, depth + 1))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Org Chart */}
      <div className="rounded-[18px] border border-[#2F303A] bg-[#171821] p-8 overflow-x-auto">
        <div className="min-w-[1000px] flex justify-center">
          {renderMember(teamHierarchy.projectManager, true)}
        </div>
      </div>

      {/* Team Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Total Members</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">12</p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Departments</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">4</p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Reporting Lines</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">3</p>
        </div>
      </div>
    </div>
  )
}

/* ===== Financials Tab ===== */
function FinancialsTab() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Original Contract Value</p>
          <p className="font-display text-xl font-semibold text-soft-white">
            ${formatCurrency(financialData.originalContractValue)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Actual Costs to Date</p>
          <p className="font-display text-xl font-semibold text-soft-white">
            ${formatCurrency(financialData.actualCostsToDate)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Total Invoiced</p>
          <p className="font-display text-xl font-semibold text-soft-white">
            ${formatCurrency(financialData.totalInvoiced)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Projected Profit</p>
          <p className="font-display text-xl font-semibold text-soft-white">
            ${formatCurrency(financialData.projectedProfit)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Milestones */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Payment Milestones</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Due Status</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {financialData.paymentMilestones.map((milestone, index) => (
                <tr key={milestone.id} className="border-b border-[#323449]/50 last:border-0">
                  <td className="py-3 text-sm text-soft-white/70">{String(index + 1).padStart(2, '0')}</td>
                  <td className="py-3 text-sm text-soft-white/70">{milestone.time}</td>
                  <td className="py-3 text-sm text-soft-white">{milestone.name}</td>
                  <td className="py-3 text-sm text-soft-white/70">-</td>
                  <td className="py-3 text-sm text-soft-white/70">-</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        milestone.status === 'Received'
                          ? 'bg-[#15352C]/80 text-[#63FFC9] border border-[#315b48]'
                          : milestone.status === 'Submitted'
                          ? 'bg-[#3c3514]/70 text-[#FFE48C] border border-[#6b591f]'
                          : 'bg-[#3a1c1c]/70 text-[#FF9BB0] border border-[#7b3b3b]'
                      }`}
                    >
                      {milestone.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Variation Orders */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Variation Orders</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Code</th>
                <th className="pb-3 font-medium">Document</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {financialData.variationOrders.map((vo, index) => (
                <tr key={vo.code} className="border-b border-[#323449]/50 last:border-0">
                  <td className="py-3 text-sm text-soft-white/70">{String(index + 1).padStart(2, '0')}</td>
                  <td className="py-3 text-sm text-soft-white">{vo.code}</td>
                  <td className="py-3">
                    <svg className="h-5 w-5 text-soft-white/50" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                  </td>
                  <td className={`py-3 text-sm ${vo.value >= 0 ? 'text-[#63FFC9]' : 'text-[#FF9BB0]'}`}>
                    {vo.value >= 0 ? '+' : ''}{formatCurrency(vo.value)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        vo.status === 'Approved'
                          ? 'bg-[#15352C]/80 text-[#63FFC9] border border-[#315b48]'
                          : vo.status === 'Rejected'
                          ? 'bg-[#3a1c1c]/70 text-[#FF9BB0] border border-[#7b3b3b]'
                          : 'bg-[#3c3514]/70 text-[#FFE48C] border border-[#6b591f]'
                      }`}
                    >
                      {vo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cost Performance Chart */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Cost Performance</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#A9DFD8]" />
              <span className="text-xs text-soft-white/60">PV</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FF9BB0]" />
              <span className="text-xs text-soft-white/60">AC</span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-1 border-b border-l border-[#323449] relative">
            {/* Y-axis labels */}
            <div className="absolute left-[-30px] top-0 bottom-0 flex flex-col justify-between text-xs text-soft-white/40">
              <span>5k</span>
              <span>4k</span>
              <span>3k</span>
              <span>2k</span>
              <span>1k</span>
            </div>
            {/* Bars placeholder */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                <div className="bg-[#A9DFD8]/50 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-soft-white/40">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Cost Breakdown</h3>
          <div className="flex items-center gap-6">
            {/* Donut Chart Placeholder */}
            <div className="relative h-40 w-40 shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                {financialData.costBreakdown.reduce((acc, item, index) => {
                  const offset = acc.offset
                  const circumference = 2 * Math.PI * 35
                  const strokeDasharray = (item.percent / 100) * circumference
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
                }, { elements: [] as JSX.Element[], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-sm font-semibold text-soft-white">$1.8M</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-3">
              {financialData.costBreakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-soft-white/60">{item.percent}%</span>
                  <span className="text-sm text-soft-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
