"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

type ProjectKey = 'Project A' | 'Project B' | 'Project C'
type ProjectFilterValue = 'Project All' | ProjectKey

type Allocation = {
	id: string
	project: ProjectKey
	startDay: number
	spanDays: number
}

type ScheduleRow = {
	id: string
	employee: string
	allocations: Allocation[]
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

const projectPalette: Record<ProjectKey, { fill: string; shadow: string; text: string }> = {
	'Project A': {
		fill: 'rgba(225, 211, 182, 0.48)',
		shadow: '0 0 10px rgba(225, 211, 182, 0.2)',
		text: '#F6F6F6',
	},
	'Project B': {
		fill: 'rgba(177, 192, 193, 0.48)',
		shadow: '0 0 10px rgba(177, 192, 193, 0.18)',
		text: '#F6F6F6',
	},
	'Project C': {
		fill: 'rgba(195, 201, 178, 0.48)',
		shadow: '0 0 10px rgba(195, 201, 178, 0.18)',
		text: '#F6F6F6',
	},
}

const totalDays = dayLabels.length

const baseScheduleRows: ScheduleRow[] = [
	{
		id: 'row-emily',
		employee: 'Emily',
		allocations: [
			{ id: 'emily-a', project: 'Project A', startDay: 0, spanDays: 2 },
			{ id: 'emily-b', project: 'Project B', startDay: 1.5, spanDays: 2 },
			{ id: 'emily-c', project: 'Project C', startDay: 3, spanDays: 2 },
		],
	},
	{
		id: 'row-james',
		employee: 'James',
		allocations: [
			{ id: 'james-a', project: 'Project A', startDay: 0, spanDays: 1.5 },
			{ id: 'james-b', project: 'Project B', startDay: 0.5, spanDays: 2 },
			{ id: 'james-c', project: 'Project C', startDay: 2, spanDays: 3 },
		],
	},
	{
		id: 'row-anna',
		employee: 'Anna',
		allocations: [
			{ id: 'anna-a', project: 'Project A', startDay: 0, spanDays: 3 },
			{ id: 'anna-b', project: 'Project B', startDay: 2, spanDays: 1.5 },
			{ id: 'anna-c', project: 'Project C', startDay: 2.5, spanDays: 2.5 },
		],
	},
	{
		id: 'row-michael',
		employee: 'Michael',
		allocations: [
			{ id: 'michael-a', project: 'Project A', startDay: 0, spanDays: 2.5 },
			{ id: 'michael-b', project: 'Project B', startDay: 1, spanDays: 2 },
			{ id: 'michael-c', project: 'Project C', startDay: 1.5, spanDays: 2 },
			{ id: 'michael-d', project: 'Project A', startDay: 3.5, spanDays: 1.5 },
		],
	},
]

type RangeFilterValue = 'Day' | 'Week' | 'Month'

const scheduleByRange: Record<RangeFilterValue, ScheduleRow[]> = {
	Day: baseScheduleRows.map(row => ({
		...row,
		allocations: row.allocations.map(allocation =>
			allocation.project === 'Project A'
				? { ...allocation, spanDays: Math.min(1.5, allocation.spanDays) }
				: { ...allocation, spanDays: Math.max(0.4, allocation.spanDays - 0.6), startDay: Math.max(allocation.startDay, 3.2) }
		),
	})),
	Week: baseScheduleRows,
	Month: baseScheduleRows.map(row => ({
		...row,
		allocations: row.allocations.map(allocation => ({
			...allocation,
			spanDays: Math.min(totalDays - allocation.startDay, allocation.spanDays + 0.3),
		})),
	})),
}

function buildAllocationLanes(allocations: Allocation[]): Allocation[][] {
	const sorted = [...allocations].sort((a, b) => a.startDay - b.startDay)
	const lanes: Allocation[][] = []

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

const filterGroups: FilterGroup[] = [
	{
		id: 'project',
		defaultValue: 'Project All',
		options: [
			{ value: 'Project All', label: 'Project All' },
			{ value: 'Project A', label: 'Project A' },
			{ value: 'Project B', label: 'Project B' },
			{ value: 'Project C', label: 'Project C' },
		],
	},
	{
		id: 'range',
		defaultValue: 'Week',
		options: [
			{ value: 'Day', label: 'Day' },
			{ value: 'Week', label: 'Week' },
			{ value: 'Month', label: 'Month' },
		],
	},
	{
		id: 'resource',
		defaultValue: 'equipment',
		options: [
			{ value: 'equipment', label: 'equipment' },
			{ value: 'staff', label: 'staff' },
			{ value: 'budget', label: 'budget' },
		],
	},
]

export default function ResourceAllocationScheduler() {
	const [selectedFilters, setSelectedFilters] = useState<Record<FilterId, string>>(() =>
		filterGroups.reduce<Record<FilterId, string>>((acc, group) => {
			acc[group.id] = group.defaultValue
			return acc
		}, {} as Record<FilterId, string>),
	)

	const selectedRange = selectedFilters.range as RangeFilterValue
	const activeProject = selectedFilters.project as ProjectFilterValue
	const rows = useMemo(() => scheduleByRange[selectedRange] ?? baseScheduleRows, [selectedRange])

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
					<span className="font-display text-[22px] font-medium text-soft-white">Employees</span>
					<div className="grid flex-1 grid-cols-5 text-center">
						{dayLabels.map(day => (
							<span key={day} className="font-display text-[18px] font-medium text-soft-white">
								{day}
							</span>
						))}
					</div>
				</div>

				<div className="mt-6 h-px w-full bg-white/12" />

				<div className="space-y-9">
					{rows.map((row, index) => (
						<div
							key={row.id}
							className={`grid grid-cols-[160px_1fr] items-center gap-6 pt-8 ${index !== 0 ? 'border-t border-white/10' : ''}`}
						>
							<span className="font-display text-[18px] font-semibold text-soft-white">{row.employee}</span>
							<AllocationRow allocations={row.allocations} activeProject={activeProject} />
						</div>
					))}
				</div>
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
	allocations: Allocation[]
	activeProject: ProjectFilterValue
}

function AllocationRow({ allocations, activeProject }: AllocationRowProps) {
	const lanes = useMemo(() => buildAllocationLanes(allocations), [allocations])
	const laneHeight = 40
	const laneGap = 12
	const verticalPadding = 16
	const containerHeight = lanes.length * laneHeight + Math.max(0, lanes.length - 1) * laneGap + verticalPadding * 2

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
								const palette = projectPalette[allocation.project]
								const clampedSpan = Math.min(allocation.spanDays, totalDays - allocation.startDay)
								const leftPercent = (allocation.startDay / totalDays) * 100
								const widthPercent = (clampedSpan / totalDays) * 100
								const dimmed = activeProject !== 'Project All' && allocation.project !== activeProject

								return (
									<div
										key={allocation.id}
										className={`absolute top-1/2 flex h-[40px] -translate-y-1/2 items-center justify-center rounded-[12px] px-5 text-[15px] font-semibold transition-opacity ${
											dimmed ? 'opacity-35' : 'opacity-100'
										}`}
										style={{
											left: `${leftPercent}%`,
											width: `${widthPercent}%`,
											backgroundColor: palette.fill,
											boxShadow: palette.shadow,
											color: palette.text,
										}}
									>
										{allocation.project}
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
