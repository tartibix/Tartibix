"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

type ProjectAllocation = {
	id: string
	project: string
	projectName: string
	startDay: number
	spanDays: number
	color: string
}

type ScheduleRow = {
	id: string
	employee: string
	employeeCode?: string
	allocations: ProjectAllocation[]
}

type FilterId = 'project' | 'range' | 'resource'

type FilterOption = {
	value: string
	label: string
}

type FilterGroup = {
	id: FilterId
	defaultValue: string
	options: FilterOption[]
}

// Color palette for projects
const projectColors = [
	{ fill: 'rgba(169, 223, 216, 0.48)', shadow: '0 0 10px rgba(169, 223, 216, 0.2)', text: '#F6F6F6' },
	{ fill: 'rgba(225, 211, 182, 0.48)', shadow: '0 0 10px rgba(225, 211, 182, 0.2)', text: '#F6F6F6' },
	{ fill: 'rgba(177, 192, 193, 0.48)', shadow: '0 0 10px rgba(177, 192, 193, 0.18)', text: '#F6F6F6' },
	{ fill: 'rgba(195, 201, 178, 0.48)', shadow: '0 0 10px rgba(195, 201, 178, 0.18)', text: '#F6F6F6' },
	{ fill: 'rgba(200, 182, 225, 0.48)', shadow: '0 0 10px rgba(200, 182, 225, 0.2)', text: '#F6F6F6' },
	{ fill: 'rgba(225, 182, 193, 0.48)', shadow: '0 0 10px rgba(225, 182, 193, 0.2)', text: '#F6F6F6' },
]

const totalDays = dayLabels.length

function buildAllocationLanes(allocations: ProjectAllocation[]): ProjectAllocation[][] {
	const sorted = [...allocations].sort((a, b) => a.startDay - b.startDay)
	const lanes: ProjectAllocation[][] = []

	sorted.forEach(allocation => {
		let placed = false
		for (const lane of lanes) {
			const last = lane[lane.length - 1]
			if (allocation.startDay >= last.startDay + last.spanDays) {
				lane.push(allocation)
				placed = true
				break
			}
		}

		if (!placed) {
			lanes.push([allocation])
		}
	})

	return lanes
}

// Static filter groups for range and resource type
const staticFilterGroups: Omit<FilterGroup, 'id'>[] = [
	{
		defaultValue: 'Week',
		options: [
			{ value: 'Day', label: 'Day' },
			{ value: 'Week', label: 'Week' },
			{ value: 'Month', label: 'Month' },
		],
	},
	{
		defaultValue: 'all',
		options: [
			{ value: 'all', label: 'All Resources' },
			{ value: 'employees', label: 'Employees' },
			{ value: 'equipment', label: 'Equipment' },
		],
	},
]

type ProjectData = {
	projectId: string
	projectName: string
	employees?: { id: string; employeeCode: string; jobTitle: string }[]
}

export default function ResourceAllocationScheduler() {
	const [projects, setProjects] = useState<ProjectData[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([])
	const [selectedFilters, setSelectedFilters] = useState<Record<FilterId, string>>({
		project: 'All Projects',
		range: 'Week',
		resource: 'all',
	})

	// Fetch projects from API
	useEffect(() => {
		async function fetchProjects() {
			try {
				const res = await fetch('/api/projects')
				if (res.ok) {
					const data = await res.json()
					setProjects(data.projects || [])
					
					// Build project filter options
					const projectOptions: FilterOption[] = [
						{ value: 'All Projects', label: 'All Projects' },
						...(data.projects || []).map((p: ProjectData) => ({
							value: p.projectId,
							label: p.projectName
						}))
					]
					
					setFilterGroups([
						{ id: 'project', defaultValue: 'All Projects', options: projectOptions },
						{ id: 'range', defaultValue: 'Week', options: staticFilterGroups[0].options },
						{ id: 'resource', defaultValue: 'all', options: staticFilterGroups[1].options },
					])
				}
			} catch (error) {
				console.error('Error fetching projects:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchProjects()
	}, [])

	// Build schedule rows from project employees
	const rows = useMemo((): ScheduleRow[] => {
		const employeeMap = new Map<string, ScheduleRow>()
		
		projects.forEach((project, projectIndex) => {
			const color = projectColors[projectIndex % projectColors.length]
			
			project.employees?.forEach((employee, empIndex) => {
				const existingRow = employeeMap.get(employee.employeeCode)
				const allocation: ProjectAllocation = {
					id: `${project.projectId}-${employee.employeeCode}`,
					project: project.projectId,
					projectName: project.projectName,
					startDay: (empIndex % totalDays) * 0.5 + projectIndex * 0.3,
					spanDays: 1.5 + Math.random() * 1.5,
					color: color.fill,
				}

				if (existingRow) {
					existingRow.allocations.push(allocation)
				} else {
					employeeMap.set(employee.employeeCode, {
						id: `row-${employee.employeeCode}`,
						employee: employee.jobTitle,
						employeeCode: employee.employeeCode,
						allocations: [allocation],
					})
				}
			})
		})

		return Array.from(employeeMap.values()).slice(0, 8) // Limit to 8 rows for visibility
	}, [projects])

	const activeProject = selectedFilters.project

	if (isLoading) {
		return (
			<section className="rounded-[30px] border border-[#2F303A] bg-[#21222D] px-7 py-8 shadow-[0_0_6px_rgba(169,223,216,0.2)] sm:px-9 sm:py-10">
				<div className="flex items-center justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
				</div>
			</section>
		)
	}

	return (
		<section className="rounded-[30px] border border-[#2F303A] bg-[#21222D] px-7 py-8 shadow-[0_0_6px_rgba(169,223,216,0.2)] sm:px-9 sm:py-10">
			<header className="flex flex-wrap items-center gap-4 text-soft-white sm:gap-6">
				<span className="font-display text-[24px] font-medium leading-none tracking-[0.02em]">filtering</span>
				<div className="flex flex-wrap items-center gap-3 sm:gap-4">
					{filterGroups.map(group => (
						<FilterDropdown
							key={group.id}
							group={group}
							value={selectedFilters[group.id]}
							onSelect={value =>
								setSelectedFilters(current => ({
									...current,
									[group.id]: value,
								}))
							}
						/>
					))}
				</div>
			</header>

			<div className="mt-10 rounded-[26px] border border-[#323449] bg-[#1A1B24] px-6 py-9 shadow-[0_0_6px_rgba(169,223,216,0.18)] sm:px-9 sm:py-10">
				<div className="grid grid-cols-[160px_1fr] items-end gap-6">
					<span className="font-display text-[22px] font-medium text-soft-white">Resources</span>
					<div className="grid flex-1 grid-cols-5 text-center">
						{dayLabels.map(day => (
							<span key={day} className="font-display text-[18px] font-medium text-soft-white">
								{day}
							</span>
						))}
					</div>
				</div>

				<div className="mt-6 h-px w-full bg-white/12" />

				{rows.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-soft-white/60">No resources found</p>
						<p className="text-sm text-soft-white/40 mt-1">Add employees to projects to see their allocations</p>
					</div>
				) : (
					<div className="space-y-9">
						{rows.map((row, index) => (
							<div
								key={row.id}
								className={`grid grid-cols-[160px_1fr] items-center gap-6 pt-8 ${index !== 0 ? 'border-t border-white/10' : ''}`}
							>
								<div>
									<span className="font-display text-[18px] font-semibold text-soft-white block">{row.employee}</span>
									{row.employeeCode && (
										<span className="text-xs text-soft-white/50">{row.employeeCode}</span>
									)}
								</div>
								<AllocationRow allocations={row.allocations} activeProject={activeProject} />
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	)
}

type FilterDropdownProps = {
	group: FilterGroup
	value: string
	onSelect: (value: string) => void
}

function FilterDropdown({ group, value, onSelect }: FilterDropdownProps) {
	const [open, setOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const selectedLabel = useMemo(() => group.options.find(option => option.value === value)?.label ?? value, [group.options, value])

	useEffect(() => {
		if (!open) return
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setOpen(false)
			}
		}
		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [open])

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen(prev => !prev)}
				className="flex h-[45px] min-w-[166px] items-center justify-between rounded-full border border-[#323449] bg-[#21222D] px-5 text-[18px] font-medium tracking-wide text-soft-white shadow-[0_0_6px_rgba(169,223,216,0.22)] transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-accent/70 focus:ring-offset-0"
			>
				<span>{selectedLabel}</span>
				<ChevronDownIcon className={`text-soft-white transition-transform ${open ? 'rotate-180' : ''}`} />
			</button>
			{open && (
				<ul
					role="listbox"
					className="absolute left-0 top-[calc(100%+8px)] z-10 w-full overflow-hidden rounded-[14px] border border-[#323449]/80 bg-[#1C1D27] shadow-[0_0_8px_rgba(169,223,216,0.16)]"
				>
					{group.options.map(option => (
						<li key={option.value}>
							<button
								type="button"
								role="option"
								aria-selected={value === option.value}
								onClick={() => {
									onSelect(option.value)
									setOpen(false)
								}}
								className={`flex w-full items-center justify-between px-5 py-3 text-left text-[16px] font-medium text-soft-white transition hover:bg-accent/15 ${
									value === option.value ? 'bg-accent/15 text-soft-white' : 'text-soft-white/85'
								}`}
							>
								<span>{option.label}</span>
								{value === option.value && <CheckIcon className="text-accent" />}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

type AllocationRowProps = {
	allocations: ProjectAllocation[]
	activeProject: string
}

function AllocationRow({ allocations, activeProject }: AllocationRowProps) {
	const lanes = useMemo(() => buildAllocationLanes(allocations), [allocations])
	const laneHeight = 40
	const laneGap = 12
	const verticalPadding = 16
	const containerHeight = Math.max(72, lanes.length * laneHeight + Math.max(0, lanes.length - 1) * laneGap + verticalPadding * 2)

	return (
		<div
			className="relative overflow-hidden rounded-[18px] border border-[#2F303A] bg-[#1C1D27]"
			style={{ minHeight: containerHeight }}
		>
			<div className="pointer-events-none absolute inset-0 flex">
				{dayLabels.map(day => (
					<div key={day} className="flex-1 border-r border-white/12 last:border-r-0" />
				))}
			</div>
			<div
				className="absolute inset-0 px-4"
				style={{ paddingTop: verticalPadding, paddingBottom: verticalPadding }}
			>
				<div className="flex h-full flex-col" style={{ rowGap: laneGap }}>
					{lanes.map((lane, laneIndex) => (
						<div key={laneIndex} className="relative w-full" style={{ height: laneHeight }}>
							{lane.map(allocation => {
								const clampedSpan = Math.min(allocation.spanDays, totalDays - allocation.startDay)
								const leftPercent = (allocation.startDay / totalDays) * 100
								const widthPercent = (clampedSpan / totalDays) * 100
								const dimmed = activeProject !== 'All Projects' && allocation.project !== activeProject

								return (
									<div
										key={allocation.id}
										className={`absolute top-1/2 flex h-[40px] -translate-y-1/2 items-center justify-center rounded-[12px] px-5 text-[15px] font-semibold transition-opacity ${
											dimmed ? 'opacity-35' : 'opacity-100'
										}`}
										style={{
											left: `${leftPercent}%`,
											width: `${widthPercent}%`,
											backgroundColor: allocation.color,
											boxShadow: '0 0 10px rgba(169, 223, 216, 0.15)',
											color: '#F6F6F6',
										}}
										title={allocation.projectName}
									>
										{allocation.projectName.length > 15 
											? allocation.projectName.substring(0, 15) + '...' 
											: allocation.projectName}
									</div>
								)
							})}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

type IconProps = {
	className?: string
}

function ChevronDownIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-3.5 w-3.5 ${className}`}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m4 6 4 4 4-4" />
		</svg>
	)
}

function CheckIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-3.5 w-3.5 ${className}`}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m3.5 8.5 3 3 6-6" />
		</svg>
	)
}
