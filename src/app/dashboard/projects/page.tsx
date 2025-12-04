'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import Link from 'next/link'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import {
  projectCreateFlowData,
  type CreateDropdownOption,
  type CreateTeamMember,
  type DocumentIconVariant,
  type TeamHierarchyMember,
} from '@/lib/projectCreateFlowData'
import { projectManagementData, type GovernanceReviewRow, type Milestone, type Project } from '@/lib/projectManagementData'

const { programOptions, projects, governanceReviews, focusOptions, quarterOptions } = projectManagementData

type PageMode = 'overview' | 'create'

const { initiativeOptions, templateOptions, documentItems, teamMembers, teamHierarchy } = projectCreateFlowData

const initialCompletedDocIds = documentItems.filter((item) => item.completed).map((item) => item.id)

const documentIconSrc: Record<DocumentIconVariant, string> = {
  archive: '/images/projects/documents/archive-book.svg',
  edit: '/images/projects/documents/edit.svg',
  note: '/images/projects/documents/note-favorite.svg',
}

const stepOrder = [
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'documents', label: 'Documents' },
  { id: 'team', label: 'Team' },
] as const

type StepId = typeof stepOrder[number]['id']

type DocumentsSubView = 'categories' | 'table'

const statusTokens: Record<string, { textClass: string; chipClass: string }> = {
  Execution: { textClass: 'text-[#8CDCC7]', chipClass: 'bg-[#1f3b30]/70 border border-[#315b48]' },
  'Pilot Stage': { textClass: 'text-[#F7E5AA]', chipClass: 'bg-[#3c3514]/70 border border-[#6b591f]' },
  'At Risk': { textClass: 'text-[#FFB2B2]', chipClass: 'bg-[#3a1c1c]/70 border border-[#7b3b3b]' },
  'Beta Testing': { textClass: 'text-[#C5D3FF]', chipClass: 'bg-[#232a45]/70 border border-[#3f4c7f]' },
  Planning: { textClass: 'text-[#A9DFD8]', chipClass: 'bg-[#1e2b32]/70 border border-[#37545b]' },
}

const governanceStatusTokens: Record<GovernanceReviewRow['status'], { textClass: string; chipClass: string }> = {
	Scheduled: { textClass: 'text-[#A9DFD8]', chipClass: 'bg-[#1e2b32]/70 border border-[#315b48]' },
	'In Review': { textClass: 'text-[#FFE48C]', chipClass: 'bg-[#3c3514]/70 border border-[#6b591f]' },
	Blocked: { textClass: 'text-[#FF9BB0]', chipClass: 'bg-[#3a1c1c]/70 border border-[#7b3b3b]' },
	Complete: { textClass: 'text-[#63FFC9]', chipClass: 'bg-[#15352C]/80 border border-[#315b48]' },
}

const healthTokens: Record<Project['health'], { label: string; ring: [string, string]; textClass: string; barClass: string }> = {
  'on-track': {
    label: 'On Track',
    ring: ['#63FFC9', '#1DD1A1'],
    textClass: 'text-[#A9DFD8]',
    barClass: 'bg-gradient-to-r from-[#63FFC9] to-[#1DD1A1]',
  },
  watch: {
    label: 'Monitor Closely',
    ring: ['#FFE48C', '#FFB347'],
    textClass: 'text-[#FFE48C]',
    barClass: 'bg-gradient-to-r from-[#FFE48C] to-[#FFB347]',
  },
  blocked: {
    label: 'Needs Attention',
    ring: ['#FF6B7F', '#FF3D68'],
    textClass: 'text-[#FF9BB0]',
    barClass: 'bg-gradient-to-r from-[#FF6B7F] to-[#FF3D68]',
  },
}

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type Insights = {
  total: number
  avgProgress: number
  onTrack: number
  blocked: number
  budgetUtilization: number
}

export default function ProjectsPage() {
  const [mode, setMode] = useState<PageMode>('overview')

  return (
    <DashboardShell>
      {mode === 'overview' ? (
        <ProjectsOverview onCreate={() => setMode('create')} />
      ) : (
        <CreateProjectFlow onExit={() => setMode('overview')} />
      )}
    </DashboardShell>
  )
}

function ProjectsOverview({ onCreate }: { onCreate: () => void }) {
  const [selectedProgram, setSelectedProgram] = useState(programOptions[0].value)
  const [selectedFocus, setSelectedFocus] = useState(focusOptions[0])
  const [selectedQuarter, setSelectedQuarter] = useState(quarterOptions[0])

  const filteredProjects = useMemo(() => projects.filter((project) => project.program === selectedProgram), [selectedProgram])

  const insights = useMemo<Insights>(() => {
    if (!filteredProjects.length) {
      return { total: 0, avgProgress: 0, onTrack: 0, blocked: 0, budgetUtilization: 0 }
    }

    const total = filteredProjects.length
    const avgProgress = Math.round(filteredProjects.reduce((sum, project) => sum + project.progress, 0) / total)
    const onTrack = filteredProjects.filter((project) => project.health === 'on-track').length
    const blocked = filteredProjects.filter((project) => project.health === 'blocked').length
    const budgetUtilization = Math.round(
      (filteredProjects.reduce((sum, project) => sum + project.budgetUsed / project.budgetTotal, 0) / total) * 100,
    )

    return { total, avgProgress, onTrack, blocked, budgetUtilization }
  }, [filteredProjects])

  const activeProgramLabel = programOptions.find((option) => option.value === selectedProgram)?.label ?? 'Selected program'

  return (
    <>
      <TopBar title="Project Management" />
      <section className="mt-8 space-y-7">
        <SummaryDeck insights={insights} programLabel={activeProgramLabel} />
        <FilterBar selectedProgram={selectedProgram} onProgramChange={setSelectedProgram} onCreate={onCreate} />
        <GovernanceReviews
          rows={governanceReviews}
          focusOptions={focusOptions}
          quarterOptions={quarterOptions}
          selectedFocus={selectedFocus}
          selectedQuarter={selectedQuarter}
          onFocusChange={setSelectedFocus}
          onQuarterChange={setSelectedQuarter}
        />
        <div className="space-y-6">
          {filteredProjects.length ? (
            filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <EmptyState label={activeProgramLabel} />
          )}
        </div>
      </section>
    </>
  )
}

function SummaryDeck({ insights, programLabel }: { insights: Insights; programLabel: string }) {
  const tiles = [
    { label: 'Program', value: programLabel, detail: `${insights.total} Active Projects` },
    { label: 'Average Progress', value: `${insights.avgProgress}%`, detail: 'Velocity This Quarter' },
    { label: 'Healthy Projects', value: insights.onTrack.toString(), detail: 'Status: On Track' },
    { label: 'Budget Used', value: `${insights.budgetUtilization}%`, detail: 'Spend vs Plan' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-[24px] border border-[#2F303A] bg-surface px-5 py-4 shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-soft-white/50">{tile.label}</p>
          <p className="font-display mt-2 text-2xl font-semibold text-soft-white">{tile.value}</p>
          <p className="font-sans text-sm text-soft-white/60">{tile.detail}</p>
        </div>
      ))}
    </div>
  )
}


function GovernanceReviews({
  rows,
  focusOptions,
  quarterOptions,
  selectedFocus,
  selectedQuarter,
  onFocusChange,
  onQuarterChange,
}: {
  rows: GovernanceReviewRow[]
  focusOptions: string[]
  quarterOptions: string[]
  selectedFocus: string
  selectedQuarter: string
  onFocusChange: (value: string) => void
  onQuarterChange: (value: string) => void
}) {
  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesFocus = selectedFocus === 'All' || row.focus === selectedFocus
        const matchesQuarter = selectedQuarter === 'All' || row.quarter === selectedQuarter
        return matchesFocus && matchesQuarter
      }),
    [rows, selectedFocus, selectedQuarter],
  )

  return (
    <div className="rounded-[26px] border border-[#2F303A] bg-night px-6 py-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-soft-white/55">Governance</p>
          <h3 className="font-display text-2xl font-semibold text-soft-white">Upcoming Reviews</h3>
          <p className="text-sm text-soft-white/60">Filter by focus area and quarter to prep steering content.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <SelectInput label="Focus" options={focusOptions} value={selectedFocus} onChange={onFocusChange} />
          <SelectInput label="Quarter" options={quarterOptions} value={selectedQuarter} onChange={onQuarterChange} />
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-soft-white/80">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.2em] text-soft-white/55">
              <th className="py-2 pr-4 font-medium">Review</th>
              <th className="py-2 pr-4 font-medium">Lead</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Focus</th>
              <th className="py-2 font-medium">Quarter</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="border-t border-white/5">
                <td className="py-3 pr-4 text-soft-white">{row.review}</td>
                <td className="py-3 pr-4 text-soft-white/70">{row.lead}</td>
                <td className="py-3 pr-4">
                  <StatusChip status={row.status} />
                </td>
                <td className="py-3 pr-4 text-soft-white/70">{row.date}</td>
                <td className="py-3 pr-4 text-soft-white/70">{row.focus}</td>
                <td className="py-3 text-soft-white/70">{row.quarter}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRows.length === 0 && (
          <p className="py-4 text-center text-sm text-soft-white/60">No reviews match the selected filters.</p>
        )}
      </div>
    </div>
  )
}

function SelectInput({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-[11px] uppercase tracking-[0.3em] text-soft-white/55">
      {label}
      <select
        className="mt-1 min-w-[140px] rounded-full border border-[#2F303A] bg-[#1B1C24] px-4 py-2 text-sm font-sans text-soft-white focus:border-accent focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#1B1C24] text-soft-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function StatusChip({ status }: { status: GovernanceReviewRow['status'] }) {
  const token = governanceStatusTokens[status]
  return <span className={`rounded-full px-3 py-1 text-xs font-display font-semibold ${token.textClass} ${token.chipClass}`}>{status}</span>
}

function FilterBar({ selectedProgram, onProgramChange, onCreate }: { selectedProgram: string; onProgramChange: (value: string) => void; onCreate: () => void }) {
  return (
    <div className="rounded-[22px] border border-[#2F303A] bg-surface px-5 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ProgramTabs selected={selectedProgram} onSelect={onProgramChange} />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#2F303A] px-4 py-2 text-sm font-display font-semibold text-soft-white/80 transition hover:border-accent hover:text-soft-white"
          >
            <ShareIcon className="h-4 w-4" />
            Share Snapshot
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-display font-semibold text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)] transition hover:brightness-110"
            onClick={onCreate}
          >
            <PlusIcon className="h-4 w-4" />
            Create Project
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateProjectFlow({ onExit }: { onExit: () => void }) {
  const [selectedInitiative, setSelectedInitiative] = useState(initiativeOptions[0].value)
  const [selectedTemplate, setSelectedTemplate] = useState(templateOptions[0].value)
  const [activeStep, setActiveStep] = useState<StepId>('basic-info')
  const [documentsSubView, setDocumentsSubView] = useState<DocumentsSubView>('categories')
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [completedDocs, setCompletedDocs] = useState(() => new Set(initialCompletedDocIds))
  const [members, setMembers] = useState<CreateTeamMember[]>(() => teamMembers.map((member) => ({ ...member })))

  const selectedInitiativeOption = initiativeOptions.find((option) => option.value === selectedInitiative) ?? initiativeOptions[0]
  const stepIndex = stepOrder.findIndex((step) => step.id === activeStep)
  const isLastStep = stepIndex === stepOrder.length - 1
  const nextStep = stepOrder[stepIndex + 1]?.id
  const previousStep = stepOrder[stepIndex - 1]?.id

  const assignedCount = members.filter((member) => member.selected).length
  const teamCoverage = members.length ? Math.round((assignedCount / members.length) * 100) : 0
  const completedDocCount = documentItems.filter((doc) => completedDocs.has(doc.id)).length
  const documentProgress = documentItems.length ? Math.round((completedDocCount / documentItems.length) * 100) : 0
  const requiredDocs = documentItems.filter((doc) => doc.required).length
  const requiredDocsComplete = documentItems.filter((doc) => doc.required && completedDocs.has(doc.id)).length
  const selectedMembers = members.filter((member) => member.selected)
  const totalAllocatedHours = selectedMembers.reduce((sum, member) => sum + member.allocation, 0)
  const totalAvailableHours = selectedMembers.reduce((sum, member) => sum + member.availability, 0)
  const allocationPercent = totalAvailableHours ? Math.round((totalAllocatedHours / totalAvailableHours) * 100) : 0

  const handlePrimaryAction = () => {
    if (isLastStep) {
      const payload = {
        initiative: selectedInitiative,
        template: selectedTemplate,
        name: projectName,
        description: projectDescription,
        documents: Array.from(completedDocs),
        team: members.filter((member) => member.selected),
      }
      console.info('Submitting project payload', payload)
      onExit()
      return
    }

    if (nextStep) {
      setActiveStep(nextStep)
    }
  }

  const handleSaveDraft = () => {
    const draft = {
      initiative: selectedInitiative,
      template: selectedTemplate,
      name: projectName,
      description: projectDescription,
      documents: Array.from(completedDocs),
      team: members.filter((member) => member.selected),
      step: activeStep,
    }
    console.info('Saving draft project', draft)
    onExit()
  }

  const handleReset = () => {
    setSelectedInitiative(initiativeOptions[0].value)
    setSelectedTemplate(templateOptions[0].value)
    setProjectName('')
    setProjectDescription('')
    setCompletedDocs(new Set(initialCompletedDocIds))
    setMembers(teamMembers.map((member) => ({ ...member })))
    setActiveStep('basic-info')
  }

  const handleDocumentToggle = (event: ReactMouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault()
    event.stopPropagation()
    toggleDocument(id)
  }

  const toggleDocument = (id: string) => {
    const docMeta = documentItems.find((doc) => doc.id === id)
    if (docMeta?.locked) {
      return
    }

    setCompletedDocs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleMember = (id: string) => {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, selected: !member.selected } : member)))
  }

  const content = {
    'basic-info': (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-medium text-soft-white">Submit new request</h2>
          <p className="mt-2 text-sm text-soft-white/65">
            Populate the starter details for the {selectedInitiativeOption.label.toLowerCase()} workstream before inviting the broader team.
          </p>
        </div>
        <div className="space-y-5">
          <label className="block">
            <span className="font-display text-sm font-semibold text-soft-white">Project Name</span>
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="Enter project name"
              className="mt-2 w-full rounded-[7px] border border-[#323449] bg-[#1B1C24] px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="font-display text-sm font-semibold text-soft-white">Project Description</span>
            <textarea
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
              placeholder="Outline scope, milestones, and desired outcomes"
              rows={6}
              className="mt-2 w-full rounded-[7px] border border-[#323449] bg-[#1B1C24] px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
            />
          </label>
        </div>
      </div>
    ),
    documents: documentsSubView === 'categories' ? (
      <DocumentsCategoriesView
        documentItems={documentItems}
        completedDocs={completedDocs}
        onToggleDocument={toggleDocument}
        onSelectCategory={(id) => {
          // Navigate to table view for selected category
          setDocumentsSubView('table')
        }}
      />
    ) : (
      <DocumentsTableView
        documentItems={documentItems}
        completedDocs={completedDocs}
        onBack={() => setDocumentsSubView('categories')}
      />
    ),
    team: (
      <TeamHierarchyView teamHierarchy={teamHierarchy} />
    ),
  } as Record<StepId, ReactNode>

  const primaryLabel = isLastStep ? 'Create Project' : 'Next'

  return (
    <>
      <TopBar title="Project Management" />
      <section className="mt-8 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <DropdownSelect
            value={selectedInitiative}
            onChange={setSelectedInitiative}
            options={initiativeOptions}
            className="min-w-[220px]"
            ariaLabel="Select initiative"
          />
          <DropdownSelect
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            options={templateOptions}
            className="min-w-[180px]"
            ariaLabel="Select template"
          />
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-display font-semibold text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)] transition hover:brightness-110"
          >
            <PlusIcon className="h-4 w-4" />
            Create Project
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-3">
            {stepOrder.map((step) => {
              const isActive = step.id === activeStep
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`rounded-[10px] border px-8 py-3 text-sm font-display font-semibold transition ${
                    isActive
                      ? 'border-transparent bg-accent text-night shadow-[0_0_12px_rgba(169,223,216,0.35)]'
                      : 'border-[#323449] bg-surface text-soft-white/80 hover:text-soft-white'
                  }`}
                >
                  {step.label}
                </button>
              )
            })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-[10px] bg-surface px-10 py-[11px] text-sm font-display font-semibold text-soft-white shadow-[0_0_10px_rgba(169,223,216,0.18)] transition hover:brightness-110"
            >
              Save
            </button>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#2F3A43] bg-[#1C1D27] p-6 shadow-[0_0_12px_rgba(169,223,216,0.18)]">
          {content[activeStep]}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {previousStep && (
              <button
                type="button"
                onClick={() => setActiveStep(previousStep)}
                className="rounded-[10px] border border-[#323449] px-8 py-3 text-sm font-display font-semibold text-soft-white transition hover:border-accent hover:text-soft-white"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="w-full rounded-[10px] bg-accent px-10 py-3 text-sm font-display font-semibold text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)] transition hover:brightness-110 sm:w-[292px]"
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

/* ===== Documents Categories View ===== */
function DocumentsCategoriesView({
  documentItems,
  completedDocs,
  onToggleDocument,
  onSelectCategory,
}: {
  documentItems: typeof projectCreateFlowData.documentItems
  completedDocs: Set<string>
  onToggleDocument: (id: string) => void
  onSelectCategory: (id: string) => void
}) {
  // The documentItems are already categories with uploads
  const categoryColors: Record<string, string> = {
    'contractual-legal': '#A9DFD8',
    'project-setup-files': '#FFE48C',
    'supporting-documents': '#C5D3FF',
  }

  const totalDocs = documentItems.reduce((sum, cat) => sum + (cat.uploads?.length || 0), 0)
  const completedCount = completedDocs.size
  const progress = totalDocs ? Math.round((completedCount / totalDocs) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-soft-white">Documents</h2>
        <p className="mt-2 text-sm text-soft-white/65">
          Select document categories to upload required files for project setup.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {documentItems.map((category) => {
          const uploadsCount = category.uploads?.length || 0
          const isComplete = completedDocs.has(category.id)
          const color = categoryColors[category.id] || '#A9DFD8'

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className="group relative flex flex-col items-center rounded-[20px] border border-[#323449] bg-[#1B1C24] p-6 text-center transition hover:border-accent/50 hover:bg-[#1F2029] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {/* Checkbox indicator */}
              <div className="absolute right-4 top-4">
                <div
                  className={`grid h-6 w-6 place-items-center rounded-[6px] border transition ${
                    isComplete ? 'border-accent bg-accent' : 'border-[#5B5F6D] bg-transparent'
                  }`}
                >
                  {isComplete && (
                    <svg className="h-4 w-4 text-night" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 8l4 4 6-7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div
                className="flex h-[80px] w-[80px] items-center justify-center rounded-[20px]"
                style={{ backgroundColor: `${color}15` }}
              >
                <Image
                  src={documentIconSrc[category.icon]}
                  alt=""
                  width={48}
                  height={48}
                  className="h-[48px] w-[48px]"
                />
              </div>

              {/* Label */}
              <p className="mt-4 font-display text-lg font-semibold text-soft-white">{category.name}</p>
              <p className="mt-1 text-xs text-soft-white/50">
                {uploadsCount} files
              </p>
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="rounded-[16px] border border-[#2F3A43] bg-[#13141b] px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Document Status</p>
            <p className="font-display text-lg font-semibold text-soft-white">{completedCount} / {documentItems.length} categories complete</p>
          </div>
          <div className="ml-auto min-w-[220px]">
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFE48C] via-[#A9DFD8] to-[#63FFC9]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-soft-white/60">{progress}% prepared</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Documents Table View ===== */
function DocumentsTableView({
  documentItems,
  completedDocs,
  onBack,
}: {
  documentItems: typeof projectCreateFlowData.documentItems
  completedDocs: Set<string>
  onBack: () => void
}) {
  const tableDocuments = [
    { id: 'doc-1', name: 'Contract Agreement', type: 'PDF', size: '2.4 MB', status: 'Uploaded', date: '2024-01-15' },
    { id: 'doc-2', name: 'NDA Document', type: 'PDF', size: '1.2 MB', status: 'Uploaded', date: '2024-01-14' },
    { id: 'doc-3', name: 'Terms of Service', type: 'DOCX', size: '890 KB', status: 'Pending', date: '–' },
    { id: 'doc-4', name: 'Privacy Policy', type: 'PDF', size: '1.8 MB', status: 'Uploaded', date: '2024-01-12' },
    { id: 'doc-5', name: 'Service Agreement', type: 'PDF', size: '–', status: 'Required', date: '–' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#323449] bg-surface transition hover:border-accent"
        >
          <svg className="h-5 w-5 text-soft-white" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
            <path d="M12 4l-6 6 6 6" />
          </svg>
        </button>
        <div>
          <h2 className="font-display text-2xl font-medium text-soft-white">Contractual & Legal</h2>
          <p className="mt-1 text-sm text-soft-white/65">
            Upload required legal documents for project setup.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[16px] border border-[#323449] bg-[#1B1C24]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#323449] text-left text-[11px] uppercase tracking-[0.2em] text-soft-white/55">
              <th className="px-5 py-4 font-medium">Document Name</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Size</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Upload Date</th>
              <th className="px-5 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableDocuments.map((doc) => {
              const isUploaded = doc.status === 'Uploaded'
              const isPending = doc.status === 'Pending'
              const statusColors = isUploaded
                ? 'text-[#63FFC9] bg-[#15352C]/80 border-[#315b48]'
                : isPending
                ? 'text-[#FFE48C] bg-[#3c3514]/70 border-[#6b591f]'
                : 'text-[#FF9BB0] bg-[#3a1c1c]/70 border-[#7b3b3b]'

              return (
                <tr key={doc.id} className="border-b border-[#323449]/50 last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#21222D]">
                        <svg className="h-5 w-5 text-soft-white/60" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 4h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                          <path d="M12 4v4h4" />
                        </svg>
                      </div>
                      <span className="font-display text-sm font-medium text-soft-white">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-soft-white/70">{doc.type}</td>
                  <td className="px-5 py-4 text-sm text-soft-white/70">{doc.size}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusColors}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-soft-white/70">{doc.date}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      className={`rounded-[8px] px-4 py-2 text-xs font-display font-semibold transition ${
                        isUploaded
                          ? 'border border-[#323449] bg-transparent text-soft-white/70 hover:border-accent'
                          : 'bg-accent text-night hover:brightness-110'
                      }`}
                    >
                      {isUploaded ? 'View' : 'Upload'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Upload area */}
      <div className="rounded-[16px] border-2 border-dashed border-[#323449] bg-[#1B1C24]/50 p-8 text-center transition hover:border-accent/50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#21222D]">
          <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
            <path d="M20 16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4" />
          </svg>
        </div>
        <p className="mt-4 font-display text-sm font-semibold text-soft-white">
          Drag & drop files here or <span className="text-accent">browse</span>
        </p>
        <p className="mt-1 text-xs text-soft-white/50">
          Supported formats: PDF, DOC, DOCX, XLS, XLSX (max 25MB)
        </p>
      </div>
    </div>
  )
}

/* ===== Team Hierarchy View ===== */
function TeamHierarchyView({ teamHierarchy }: { teamHierarchy: TeamHierarchyMember[] }) {
  const renderMember = (member: TeamHierarchyMember, isRoot = false) => {
    const hasChildren = member.children && member.children.length > 0

    return (
      <div key={member.id} className={`flex flex-col items-center ${isRoot ? '' : 'mt-6'}`}>
        {/* Member card */}
        <div
          className={`relative rounded-[14px] border bg-[#1B1C24] px-5 py-4 text-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition hover:border-accent/50 ${
            isRoot ? 'border-accent/40 bg-gradient-to-b from-[#1B1C24] to-[#1a2428]' : 'border-[#323449]'
          }`}
          style={{ minWidth: '160px' }}
        >
          {/* Avatar */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2B3A42] to-[#1D2528] text-sm font-display font-semibold text-soft-white">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <p className="mt-2 font-display text-sm font-semibold text-soft-white">{member.name}</p>
          <p className="text-xs text-soft-white/60">{member.role}</p>
          <p className="mt-1 text-[10px] text-soft-white/40">ID: {member.employeeId}</p>
        </div>

        {/* Connector lines and children */}
        {hasChildren && (
          <>
            {/* Vertical line down */}
            <div className="h-6 w-px bg-[#323449]" />

            {/* Horizontal connector if multiple children */}
            {member.children!.length > 1 && (
              <div
                className="h-px bg-[#323449]"
                style={{
                  width: `${Math.min(member.children!.length * 180, 600)}px`,
                }}
              />
            )}

            {/* Children container */}
            <div className="flex flex-wrap justify-center gap-4">
              {member.children!.map((child) => renderMember(child, false))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-soft-white">Team Structure</h2>
        <p className="mt-2 text-sm text-soft-white/65">
          Review the organizational hierarchy for this project.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft-white/40"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full rounded-[10px] border border-[#323449] bg-[#1B1C24] py-2.5 pl-10 pr-4 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-[10px] border border-[#323449] bg-surface px-4 py-2.5 text-sm font-display font-semibold text-soft-white/80 transition hover:border-accent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 4h14M3 8h10M3 12h6" />
          </svg>
          Filter
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-[10px] border border-[#323449] bg-surface px-4 py-2.5 text-sm font-display font-semibold text-soft-white/80 transition hover:border-accent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="11" y="3" width="6" height="6" rx="1" />
            <rect x="3" y="11" width="6" height="6" rx="1" />
            <rect x="11" y="11" width="6" height="6" rx="1" />
          </svg>
          Grid View
        </button>
      </div>

      {/* Org chart container */}
      <div className="overflow-x-auto rounded-[18px] border border-[#2F3A43] bg-[#171821] p-8">
        <div className="min-w-[800px] flex justify-center">
          {teamHierarchy.map((rootMember) => renderMember(rootMember, true))}
        </div>
      </div>

      {/* Team summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[14px] border border-[#323449] bg-[#1B1C24] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Total Members</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">18</p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-[#1B1C24] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Departments</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">5</p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-[#1B1C24] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Reporting Lines</p>
          <p className="font-display mt-1 text-2xl font-semibold text-soft-white">4</p>
        </div>
      </div>
    </div>
  )
}

function DropdownSelect({
  value,
  onChange,
  options,
  className = '',
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  options: CreateDropdownOption[]
  className?: string
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen((state) => !state)}
        className="flex w-full items-center justify-between rounded-[10px] border border-[#323449] bg-surface px-4 py-2 text-sm font-display text-soft-white transition hover:border-accent"
      >
        {selectedOption.label}
        <ChevronIcon className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-[10px] border border-[#323449] bg-[#1B1C24] shadow-[0_12px_28px_rgba(0,0,0,0.45)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`flex w-full items-start gap-2 px-4 py-3 text-left text-sm text-soft-white transition hover:bg-white/5 ${
                option.value === value ? 'bg-white/5' : ''
              }`}
            >
              <span className="font-display font-semibold">{option.label}</span>
              {option.description && <span className="text-xs text-soft-white/60">{option.description}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m4 6 4 4 4-4" />
    </svg>
  )
}

function ProgramTabs({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {programOptions.map((option) => {
        const isActive = option.value === selected
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-full border px-4 py-2 text-sm font-display font-semibold transition ${
              isActive
                ? 'border-accent bg-accent/20 text-soft-white shadow-[0_10px_24px_rgba(169,223,216,0.25)]'
                : 'border-[#2F303A] bg-night text-soft-white/70 hover:text-soft-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <article className="rounded-[28px] border border-[#2F303A] bg-surface p-6 text-soft-white shadow-[0_18px_45px_rgba(0,0,0,0.4)] transition hover:border-accent/30 cursor-pointer">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            <header className="flex flex-wrap items-start gap-4">
              <div className="min-w-[200px] flex-1">
                <p className="font-display text-xs uppercase tracking-[0.35em] text-soft-white/50">Project</p>
                <h3 className="font-display mt-1 text-2xl font-semibold text-soft-white">{project.name}</h3>
                <p className="font-sans text-sm text-soft-white/60">{project.category}</p>
              </div>
              <StatusBadge status={project.status} />
            </header>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetaField label="Project Manager" value={project.manager} />
              <MetaField label="Project Owner" value={project.owner} />
              <MetaField label="Timeline" value={`${project.start} → ${project.end}`} />
              <MetaField label="Program" value={programOptions.find((option) => option.value === project.program)?.label ?? project.program} />
              <MetaField label="Health" value={healthTokens[project.health].label} />
              <MetaField label="Team">
                <TeamStack members={project.team} />
              </MetaField>
            </div>
            <ProjectDescription text={project.description} />
            <MilestoneStepper milestones={project.milestones} />
          </div>
          <ProjectAside project={project} />
        </div>
      </article>
    </Link>
  )
}

function MetaField({ label, value, children }: { label: string; value?: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#2F303A] bg-night px-4 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.35)]">
      <p className="font-display text-[11px] uppercase tracking-[0.2em] text-soft-white/55">{label}</p>
      <div className="font-sans mt-1 text-sm font-medium text-soft-white">{children ?? value}</div>
    </div>
  )
}

function ProjectDescription({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-[#2F303A] bg-night/80 px-6 py-5 text-sm font-sans text-soft-white/85">
      {text}
    </div>
  )
}

function MilestoneStepper({ milestones }: { milestones: Milestone[] }) {
  const lastCompleteIndex = milestones.reduce((lastIndex, milestone, index) => (milestone.complete ? index : lastIndex), -1)
  const fillRatio = milestones.length > 1 ? Math.max(lastCompleteIndex, 0) / (milestones.length - 1) : 1
  const fillWidth = `${Math.min(fillRatio, 1) * 100}%`

  return (
    <div className="relative mt-4 rounded-3xl border border-[#2F303A] bg-night/70 px-4 py-4">
      <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-white/10" />
      <div
        className="absolute left-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-accent to-[#70B7FF]"
        style={{ width: fillWidth }}
      />
      <div className="relative flex items-center justify-between">
        {milestones.map((milestone) => (
          <div key={milestone.label} className="flex flex-col items-center text-[11px] text-soft-white/70">
            <span
              className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                milestone.complete ? 'border-accent bg-accent/20 text-soft-white' : 'border-white/20 bg-white/5 text-soft-white/50'
              }`}
            >
              {milestone.complete ? '•' : ''}
            </span>
            <span className="font-display mt-2 uppercase tracking-[0.2em]">{milestone.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectAside({ project }: { project: Project }) {
  const token = healthTokens[project.health]
  const budgetPercent = Math.min(100, Math.round((project.budgetUsed / project.budgetTotal) * 100))

  return (
    <div className="w-full max-w-[240px] rounded-[22px] border border-[#2F303A] bg-night px-5 py-6 shadow-[0_14px_38px_rgba(0,0,0,0.35)]">
      <ProgressRing progress={project.progress} health={project.health} />
      <p className="font-display mt-4 text-xs uppercase tracking-[0.3em] text-soft-white/55">Delivery Health</p>
      <p className={`font-display mt-1 text-sm font-semibold ${token.textClass}`}>{token.label}</p>
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-sans text-soft-white/60">
          <span>Budget</span>
          <span>{budgetPercent}% used</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
          <div className={`h-full rounded-full ${token.barClass}`} style={{ width: `${budgetPercent}%` }} />
        </div>
        <p className="font-sans mt-2 text-sm font-medium text-soft-white">
          {moneyFormatter.format(project.budgetUsed)} / {moneyFormatter.format(project.budgetTotal)}
        </p>
      </div>
    </div>
  )
}

function ProgressRing({ progress, health }: { progress: number; health: Project['health'] }) {
  const clamped = Math.min(Math.max(progress, 0), 100)
  const degrees = (clamped / 100) * 360
  const token = healthTokens[health]

  return (
    <div className="relative h-[130px] w-[130px] self-center" aria-label={`Project completion ${clamped} percent`}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${token.ring[0]} 0deg, ${token.ring[1]} ${degrees}deg, rgba(255,255,255,0.08) ${degrees}deg 360deg)`,
          transform: 'rotate(-90deg)',
        }}
      />
      <div className="absolute inset-[10px] rounded-full bg-[#181923]" />
      <div className="absolute inset-[24px] grid place-items-center rounded-full bg-night text-center">
        <p className="font-display text-3xl font-semibold text-soft-white">{clamped}%</p>
        <p className="font-display text-[11px] uppercase tracking-[0.3em] text-soft-white/40">Complete</p>
      </div>
    </div>
  )
}

function TeamStack({ members }: { members: string[] }) {
  const visible = members.slice(0, 3)
  const remaining = members.length - visible.length

  return (
    <div className="flex items-center">
      {visible.map((initials, index) => (
        <span
          key={initials + index}
          className="-ml-2 first:ml-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#2F303A] bg-night text-xs font-display font-semibold text-soft-white"
        >
          {initials}
        </span>
      ))}
      {remaining > 0 && (
        <span className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#2F303A] bg-surface text-xs font-display font-semibold text-soft-white">
          +{remaining}
        </span>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const token = statusTokens[status] ?? { textClass: 'text-soft-white', chipClass: 'bg-night border border-[#2F303A]' }

  return <span className={`rounded-full px-4 py-1 text-sm font-display font-semibold ${token.textClass} ${token.chipClass}`}>{status}</span>
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#2F303A] bg-surface px-6 py-10 text-center text-soft-white/70">
      <p className="text-sm">
        No projects are linked to <span className="font-semibold text-soft-white">{label}</span> yet.
      </p>
    </div>
  )
}

function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function ShareIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M15 4a3 3 0 1 1-3 3" />
      <path d="M5 13a3 3 0 1 0 3 3" />
      <path d="M8 14 14 8" />
    </svg>
  )
}
