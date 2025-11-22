'use client'

import { useMemo, useState, type ReactNode } from 'react'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import {
  projectManagementData,
  type GovernanceReviewRow,
  type Milestone,
  type ProgramPerformanceMetric,
  type Project,
  type RiskChecklistItem,
  type StatusBreakdownSlice,
} from '@/lib/projectManagementData'

const {
  programOptions,
  projects,
  programPerformance,
  statusBreakdown,
  riskChecklist,
  governanceReviews,
  focusOptions,
  quarterOptions,
} = projectManagementData

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
  const [selectedProgram, setSelectedProgram] = useState(programOptions[0].value)
  const [selectedFocus, setSelectedFocus] = useState(focusOptions[0])
  const [selectedQuarter, setSelectedQuarter] = useState(quarterOptions[0])
  const [checklistItems, setChecklistItems] = useState(() => riskChecklist.map((item) => ({ ...item })))

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

  const handleChecklistToggle = (id: string) => {
    setChecklistItems((prev) => prev.map((item) => (item.id === id ? { ...item, complete: !item.complete } : item)))
  }

  return (
    <DashboardShell>
      <TopBar title="Project Management" />
      <section className="mt-8 space-y-7">
        <SummaryDeck insights={insights} programLabel={activeProgramLabel} />
        <FilterBar selectedProgram={selectedProgram} onProgramChange={setSelectedProgram} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ProgramPerformanceSlider programs={programPerformance} />
          <RiskChecklist items={checklistItems} onToggle={handleChecklistToggle} />
        </div>
        <StatusBreakdownChart slices={statusBreakdown} />
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
    </DashboardShell>
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

function ProgramPerformanceSlider({ programs }: { programs: ProgramPerformanceMetric[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!programs.length) {
    return null
  }

  const boundedIndex = Math.min(activeIndex, programs.length - 1)
  const activeProgram = programs[boundedIndex]
  const sliderMax = Math.max(programs.length - 1, 0)
  const completion = Math.round(activeProgram.completion)
  const budgetPercent = Math.round((activeProgram.budgetUsed / activeProgram.budgetTotal) * 100)

  return (
    <div className="rounded-[26px] border border-[#2F303A] bg-night px-6 py-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-soft-white/55">Program Focus</p>
          <h3 className="font-display text-2xl font-semibold text-soft-white">{activeProgram.label}</h3>
          <p className="text-sm text-soft-white/60">Owned by {activeProgram.owners.join(', ')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-soft-white/55">Velocity</p>
          <p className="font-display text-3xl font-semibold text-soft-white">{activeProgram.velocity.toFixed(1)}</p>
          <p className="text-xs text-soft-white/50">sprints / month</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-soft-white/55">Completion</p>
          <div className="mt-3 flex items-end gap-4">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#63FFC9] to-[#70B7FF]" style={{ width: `${completion}%` }} />
              </div>
            </div>
            <span className="font-display text-3xl font-semibold text-soft-white">{completion}%</span>
          </div>
          <p className="mt-1 text-xs text-soft-white/50">Timeline confidence {activeProgram.timelineConfidence}%</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-soft-white/55">Budget Use</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-soft-white/60">
              <span>Used</span>
              <span>{budgetPercent}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#A9DFD8] to-[#63FFC9]" style={{ width: `${budgetPercent}%` }} />
            </div>
            <p className="font-sans mt-2 text-sm font-medium text-soft-white">
              {moneyFormatter.format(activeProgram.budgetUsed)} / {moneyFormatter.format(activeProgram.budgetTotal)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <input
          type="range"
          min={0}
          max={sliderMax}
          value={boundedIndex}
          onChange={(event) => setActiveIndex(Number(event.target.value))}
          className="w-full accent-[#A9DFD8]"
          style={{ accentColor: '#A9DFD8' }}
          aria-label="Program selection slider"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-soft-white/60">
          {programs.map((program, index) => (
            <button
              key={program.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-full border px-3 py-1 font-semibold transition ${
                index === boundedIndex ? 'border-accent text-soft-white' : 'border-transparent text-soft-white/50 hover:text-soft-white'
              }`}
            >
              {program.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusBreakdownChart({ slices }: { slices: StatusBreakdownSlice[] }) {
  if (!slices.length) {
    return null
  }

  const maxValue = Math.max(...slices.map((slice) => slice.value)) || 1

  return (
    <div className="rounded-[26px] border border-[#2F303A] bg-night px-6 py-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-soft-white/55">Portfolio Mix</p>
          <h3 className="font-display text-2xl font-semibold text-soft-white">Delivery Health Snapshot</h3>
        </div>
        <p className="text-sm text-soft-white/60">Counts update automatically as projects shift status.</p>
      </div>
      <div className="mt-8 flex flex-wrap items-end gap-6">
        {slices.map((slice) => {
          const heightPercent = (slice.value / maxValue) * 100
          const columnHeight = (140 * heightPercent) / 100
          return (
            <div key={slice.label} className="flex min-w-[80px] flex-1 flex-col items-center gap-2 text-center">
              <div className="flex h-[150px] w-12 items-end justify-center rounded-full bg-white/5">
                <div
                  className="w-6 rounded-full"
                  style={{ height: `${columnHeight}px`, background: slice.color, boxShadow: `0 10px 25px ${slice.color}45` }}
                />
              </div>
              <p className="font-display text-lg font-semibold text-soft-white">{slice.value}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-soft-white/60">{slice.label}</p>
              <p className="text-[11px] text-soft-white/40">Target {slice.target}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RiskChecklist({ items, onToggle }: { items: RiskChecklistItem[]; onToggle: (id: string) => void }) {
  if (!items.length) {
    return null
  }

  return (
    <div className="rounded-[26px] border border-[#2F303A] bg-night px-6 py-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-soft-white/55">Risk Controls</p>
          <h3 className="font-display text-2xl font-semibold text-soft-white">Go-Live Checklist</h3>
        </div>
        <p className="text-sm text-soft-white/60">Mark items as teams provide evidence.</p>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 rounded-[16px] border border-[#2F303A] bg-[#191A24] px-4 py-3">
            <label htmlFor={`risk-${item.id}`} className="flex flex-1 items-center gap-3 text-sm text-soft-white">
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  id={`risk-${item.id}`}
                  checked={item.complete}
                  onChange={() => onToggle(item.id)}
                  className="peer sr-only"
                />
                <span className="grid h-5 w-5 place-items-center rounded-md border border-[#3A3B46] bg-night text-soft-white/40 transition peer-checked:border-accent peer-checked:bg-accent/20 peer-checked:text-accent">
                  <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8 6 10.5 11 4" />
                  </svg>
                </span>
              </span>
              <span>{item.label}</span>
            </label>
            <span className="text-xs text-soft-white/60">{item.owner}</span>
          </li>
        ))}
      </ul>
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

function FilterBar({ selectedProgram, onProgramChange }: { selectedProgram: string; onProgramChange: (value: string) => void }) {
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
          >
            <PlusIcon className="h-4 w-4" />
            Create Project
          </button>
        </div>
      </div>
    </div>
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
