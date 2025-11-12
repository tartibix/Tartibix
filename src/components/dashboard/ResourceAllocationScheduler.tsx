const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

type ProjectKey = 'Project A' | 'Project B' | 'Project C'

type Allocation = {
	id: string
	project: ProjectKey
	start: number
	end: number
}

type ScheduleRow = {
	id: string
	employee: string
	allocations: Allocation[]
}

const scheduleRows: ScheduleRow[] = [
	{
		id: 'row-emily',
		employee: 'Emily',
		allocations: [
			{ id: 'emily-a', project: 'Project A', start: 0, end: 2.7 },
			{ id: 'emily-b', project: 'Project B', start: 2.7, end: 4.2 },
			{ id: 'emily-c', project: 'Project C', start: 4.2, end: 5 },
		],
	},
	{
		id: 'row-james',
		employee: 'James',
		allocations: [
			{ id: 'james-a', project: 'Project A', start: 0, end: 2.4 },
			{ id: 'james-b', project: 'Project B', start: 2.4, end: 3.9 },
			{ id: 'james-c', project: 'Project C', start: 3.9, end: 5 },
		],
	},
	{
		id: 'row-anna',
		employee: 'Anna',
		allocations: [
			{ id: 'anna-a', project: 'Project A', start: 0, end: 2.9 },
			{ id: 'anna-b', project: 'Project B', start: 2.9, end: 4.3 },
			{ id: 'anna-c', project: 'Project C', start: 4.3, end: 5 },
		],
	},
	{
		id: 'row-michael',
		employee: 'Michael',
		allocations: [
			{ id: 'michael-a', project: 'Project A', start: 0, end: 2.1 },
			{ id: 'michael-b', project: 'Project B', start: 2.1, end: 3.8 },
			{ id: 'michael-c', project: 'Project C', start: 3.8, end: 5 },
		],
	},
]

const projectPalette: Record<ProjectKey, { fill: string; legend: string; shadow: string; text: string }> = {
	'Project A': {
		fill: 'rgba(225, 211, 182, 0.55)',
		legend: 'rgba(225, 211, 182, 0.85)',
		shadow: '0 0 14px rgba(225, 211, 182, 0.32)',
		text: '#0E1119',
	},
	'Project B': {
		fill: 'rgba(177, 192, 193, 0.55)',
		legend: 'rgba(177, 192, 193, 0.85)',
		shadow: '0 0 14px rgba(177, 192, 193, 0.28)',
		text: '#0E1119',
	},
	'Project C': {
		fill: 'rgba(195, 201, 178, 0.55)',
		legend: 'rgba(195, 201, 178, 0.85)',
		shadow: '0 0 14px rgba(195, 201, 178, 0.28)',
		text: '#0E1119',
	},
}

const filterOptions = [
	{ id: 'project', label: 'Project All', active: true },
	{ id: 'range', label: 'Week' },
	{ id: 'resource', label: 'equipment' },
]

const totalDays = dayLabels.length
const percentPerDay = 100 / totalDays

export default function ResourceAllocationScheduler() {
	return (
		<section className="rounded-[30px] border border-[#2F303A] bg-[#21222D] px-7 py-8 shadow-[0_0_10px_rgba(169,223,216,0.4)] sm:px-9 sm:py-9">
			<header>
				<div className="flex flex-wrap items-center gap-4 text-soft-white sm:gap-5">
					<span className="font-display text-[24px] font-medium leading-none">filtering</span>
					<div className="flex flex-wrap items-center gap-3">
						{filterOptions.map(option => (
							<FilterPill key={option.id} label={option.label} active={option.active} />
						))}
					</div>
				</div>
			</header>

			<div className="mt-8 rounded-[24px] border border-[#2F303A] bg-[#1A1B24] px-6 py-8 shadow-[0_0_10px_rgba(169,223,216,0.28)] sm:px-8 sm:py-9">
				<div className="grid grid-cols-[150px_1fr] items-end gap-6 text-soft-white/80">
					<span className="text-[22px] font-medium text-soft-white">Employees</span>
					<div className="grid flex-1 grid-cols-5 text-center text-[18px] font-medium tracking-wide">
						{dayLabels.map(day => (
							<span key={day}>{day}</span>
						))}
					</div>
				</div>

				<div className="mt-6 space-y-8">
					{scheduleRows.map((row, index) => (
						<div
							key={row.id}
							className={`grid grid-cols-[150px_1fr] items-center gap-6 ${index !== 0 ? 'border-t border-white/10 pt-6' : ''}`}
						>
							<span className="text-[18px] font-semibold text-soft-white">{row.employee}</span>
							<AllocationRow allocations={row.allocations} />
						</div>
					))}
				</div>

				<div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-soft-white/80">
					{(Object.keys(projectPalette) as ProjectKey[]).map(project => (
						<LegendBadge key={project} project={project} />
					))}
				</div>
			</div>
		</section>
	)
}

type FilterPillProps = {
	label: string
	active?: boolean
}

function FilterPill({ label, active = false }: FilterPillProps) {
	return (
		<button
			type="button"
			className={`flex items-center gap-3 rounded-full border px-5 py-2.5 text-[18px] font-medium tracking-wide transition-colors ${
				active
					? 'border-accent/60 bg-[#292A36] text-soft-white shadow-[0_0_12px_rgba(169,223,216,0.32)]'
					: 'border-[#323449] bg-[#252630] text-soft-white/80 shadow-[0_0_6px_rgba(169,223,216,0.18)] hover:border-accent/40 hover:text-soft-white'
			}`}
		>
			<span>{label}</span>
			<ChevronDownIcon className={active ? 'text-soft-white' : 'text-soft-white/70'} />
		</button>
	)
}

type AllocationRowProps = {
	allocations: Allocation[]
}

function AllocationRow({ allocations }: AllocationRowProps) {
	return (
		<div className="relative h-[64px] overflow-hidden rounded-[18px] border border-[#2F303A] bg-[#1D1E2A]/90">
			<div className="pointer-events-none absolute inset-0 flex">
				{dayLabels.map((day, index) => (
					<div key={day} className={`flex-1 border-r border-white/8 last:border-r-0`}>
						<span className="sr-only">{index}</span>
					</div>
				))}
			</div>
			<div className="absolute inset-0 flex items-center px-3">
				<div className="relative h-[42px] w-full">
					{allocations.map(allocation => {
						const palette = projectPalette[allocation.project]
						const leftPercent = allocation.start * percentPerDay
						const widthPercent = (allocation.end - allocation.start) * percentPerDay

						return (
							<div
								key={allocation.id}
								className="absolute top-1/2 flex h-[38px] -translate-y-1/2 items-center justify-center rounded-[12px] px-5 text-[15px] font-semibold"
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
			</div>
		</div>
	)
}

type LegendBadgeProps = {
	project: ProjectKey
}

function LegendBadge({ project }: LegendBadgeProps) {
	const palette = projectPalette[project]

	return (
		<div className="flex items-center gap-3 rounded-full bg-[#1D1E28] px-5 py-2 text-soft-white">
			<span
				className="h-3 w-6 rounded-full"
				style={{ backgroundColor: palette.legend }}
			/>
			<span className="text-sm font-medium tracking-wide">{project}</span>
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
