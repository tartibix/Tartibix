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
} from '@/lib/projectCreateFlowData'
import { projectManagementData, type GovernanceReviewRow, type Milestone, type Project } from '@/lib/projectManagementData'

const { programOptions, projects, governanceReviews, focusOptions, quarterOptions } = projectManagementData

type PageMode = 'overview' | 'create'

const { initiativeOptions, templateOptions, documentItems, teamMembers } = projectCreateFlowData

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
    documents: (
      <div className="rounded-[22px] border border-[#2F3A43] bg-[#1C1D27] p-6 shadow-[0_0_12px_rgba(169,223,216,0.18)]">
        <ul className="space-y-4">
          {documentItems.map((item) => {
            const checked = completedDocs.has(item.id)
            const isLocked = Boolean(item.locked)
            const labelClasses = isLocked
              ? 'font-display text-[20px] font-extrabold text-[#87888c] line-through'
              : 'font-display text-[20px] font-extrabold text-soft-white'
            const cardClasses =
              'grid grid-cols-[auto_1fr_auto] items-center gap-6 rounded-[14px] border border-[rgba(47,58,67,0.85)] bg-[#1B1C24] px-6 py-7 text-left shadow-[0_0_8px_rgba(0,0,0,0.22)] transition hover:border-[rgba(169,223,216,0.35)] hover:bg-[#1F2029] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'

            const cardContent = (
              <>
                <span className="flex h-[80px] w-[80px] items-center justify-center rounded-[20px] bg-[#1C1E27]">
                  <Image
                    src={documentIconSrc[item.icon]}
                    alt=""
                    width={48}
                    height={48}
                    className={`h-[48px] w-[48px] ${isLocked ? 'opacity-50' : ''}`}
                  />
                </span>
                <span className={labelClasses}>{item.name}</span>
                <button
                  type="button"
                  onClick={(event) => handleDocumentToggle(event, item.id)}
                  disabled={isLocked}
                  className={`grid h-6 w-6 place-items-center rounded-[4px] border transition ${
                    checked ? 'border-soft-white bg-soft-white' : 'border-[#5B5F6D] bg-transparent'
                  } disabled:opacity-50`}
                >
                  {checked ? <span className="block h-3 w-3 rounded-[2px] bg-night/80" /> : null}
                </button>
              </>
            )

            return (
              <li key={item.id}>
                {isLocked ? (
                  <div className={`${cardClasses} opacity-80`}>{cardContent}</div>
                ) : (
                  <Link href={`/dashboard/projects/documents/${item.id}`} className={cardClasses}>
                    {cardContent}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
        <div className="mt-6 rounded-[16px] border border-[#2F3A43] bg-[#13141b] px-5 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Document Status</p>
              <p className="font-display text-lg font-semibold text-soft-white">{completedDocCount} / {documentItems.length} complete</p>
              <p className="text-xs text-soft-white/60">{requiredDocsComplete} of {requiredDocs} required files ready</p>
            </div>
            <div className="ml-auto min-w-[220px]">
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#FFE48C] via-[#A9DFD8] to-[#63FFC9]" style={{ width: `${documentProgress}%` }} />
              </div>
              <p className="mt-1 text-right text-xs text-soft-white/60">{documentProgress}% prepared</p>
            </div>
          </div>
        </div>
      </div>
    ),
    team: (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-medium text-soft-white">Assemble delivery team</h2>
          <p className="mt-2 text-sm text-soft-white/65">Confirm core contributors and review their current capacity.</p>
        </div>
        <div className="space-y-3">
          {members.map((member) => {
            const utilization = Math.min(100, Math.round((member.allocation / member.availability) * 100))
            return (
              <div
                key={member.id}
                className="rounded-[12px] border border-[#323449] bg-[#1B1C24] px-4 py-3 shadow-[0_0_8px_rgba(0,0,0,0.28)]"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(member.selected)}
                      onChange={() => toggleMember(member.id)}
                      className="h-4 w-4 rounded-[5px] border border-[#49506A] bg-night accent-[#A9DFD8]"
                    />
                    <div>
                      <p className="font-display text-sm font-semibold text-soft-white">{member.name}</p>
                      <p className="text-xs text-soft-white/60">{member.role}</p>
                    </div>
                  </label>
                  <div className="ml-auto flex items-center gap-2 text-xs text-soft-white/60">
                    <span>{member.allocation}h / {member.availability}h</span>
                    <span className="rounded-full border border-[#2F303A] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-soft-white/60">
                      {utilization}% utilized
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#2B2F3D]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#70B7FF] to-[#63FFC9]"
                    style={{ width: `${utilization}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <div className="h-2 rounded-full bg-[#2B2F3D]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FFE48C] via-[#A9DFD8] to-[#63FFC9]"
              style={{ width: `${teamCoverage}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-soft-white/65">Team coverage {teamCoverage}% complete</p>
        </div>
        <div className="rounded-[14px] border border-[#323449] bg-[#13141b] px-4 py-3 text-sm text-soft-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Hours Confirmed</p>
          <p className="font-display text-lg font-semibold text-soft-white">{totalAllocatedHours}h / {totalAvailableHours || 0}h committed</p>
          <p className="text-xs text-soft-white/60">{allocationPercent}% of available time allocated across {selectedMembers.length} contributors</p>
        </div>
      </div>
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
    <article className="rounded-[28px] border border-[#2F303A] bg-surface p-6 text-soft-white shadow-[0_18px_45px_rgba(0,0,0,0.4)]">
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
