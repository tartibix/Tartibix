'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import MyDayToggle from '@/components/dashboard/MyDayToggle'
import MyDayOverview from '@/components/dashboard/MyDayOverview'

type Project = {
	id: string
	name: string
	popularity: number
	sales: number
	status: string
}

type Task = {
	id: string
	name: string
	status: string
}

type WorkloadEntry = {
	label: string
	value: number
}

type Deadline = {
	title: string
	highlight?: boolean
}

type CompanyStat = {
	label: string
	value: number
	color: string
}

const dashboardData = {
	kpiProgress: 65,
	projects: [
		{
			id: '01',
			name: 'Nelsa web developement',
			popularity: 78,
			sales: 46,
			status: 'Approved',
		},
		{
			id: '02',
			name: 'Datascale AI app',
			popularity: 64,
			sales: 17,
			status: 'In review',
		},
		{
			id: '03',
			name: 'Media channel branding',
			popularity: 58,
			sales: 19,
			status: 'On hold',
		},
		{
			id: '04',
			name: 'Corlax iOS app development',
			popularity: 42,
			sales: 29,
			status: 'On going',
		},
	] as Project[],
	teamWorkload: [
		{ label: 'Mon', value: 32 },
		{ label: 'Tue', value: 48 },
		{ label: 'Wed', value: 38 },
		{ label: 'Thu', value: 52 },
		{ label: 'Fri', value: 44 },
	] as WorkloadEntry[],
	tasks: [
		{
			id: '01',
			name: 'Create a user flow of social application design',
			status: 'Approved',
		},
		{
			id: '02',
			name: 'Create a user flow of social application design',
			status: 'In review',
		},
		{
			id: '03',
			name: 'Landing page design for Fintech project of singapore',
			status: 'On going',
		},
		{
			id: '04',
			name: 'Interactive prototype for app screens of deltainme project',
			status: 'Over due',
		},
	] as Task[],
	deadlines: [
		{ title: 'Submit Report', highlight: true },
		{ title: 'Launch Ad ( May 5 )' },
	] as Deadline[],
	companyStats: [
		{ label: 'On Track', value: 9, color: '#5ad7c6' },
		{ label: 'At Risk', value: 7, color: '#ff6b6b' },
		{ label: 'Completed', value: 7, color: '#6d6dfd' },
	] as CompanyStat[],
	taskSummary: {
		overdue: 11,
	},
}

export default function DashboardPage() {
	const [isMyDayOn, setIsMyDayOn] = useState(false)
	const {
		kpiProgress,
		projects,
		teamWorkload,
		tasks,
		deadlines,
		companyStats,
		taskSummary,
	} = dashboardData

	return (
		<DashboardShell>
			<TopBar />
			<div className="mt-4 flex justify-end">
				<MyDayToggle isOn={isMyDayOn} onToggle={() => setIsMyDayOn(!isMyDayOn)} />
			</div>
			
			{isMyDayOn ? (
				<section className="mt-4">
					<MyDayOverview />
				</section>
			) : (
				<section className="mt-4 flex flex-col gap-3">
					<div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
						<KpiCard progress={kpiProgress} />
						<OverdueCard overdueCount={taskSummary.overdue} />
						<TeamWorkloadCard data={teamWorkload} />
					</div>

					<div className="grid gap-3 lg:grid-cols-1 xl:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)]">
						<ProjectTable projects={projects} />
						<CompanyDashboardCard stats={companyStats} />
					</div>

					<div className="grid gap-3 lg:grid-cols-1 xl:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)]">
						<TaskTable tasks={tasks} />
						<DeadlineCard deadlines={deadlines} />
					</div>
				</section>
			)}
		</DashboardShell>
	)
}

function ProjectTable({ projects }: { projects: Project[] }) {
	return (
		<Card>
			<header className="flex flex-col justify-between gap-1.5 sm:flex-row sm:items-end">
				<div>
					<p className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
						Dashboard
					</p>
					<h2 className="font-display text-lg font-semibold text-soft-white">
						Active Projects
					</h2>
				</div>
				<span className="text-[10px] text-muted-foreground/70">
					Sorted by popularity
				</span>
			</header>

			<div className="mt-3 overflow-x-auto">
				<div className="min-w-[620px] overflow-hidden rounded-2xl border border-[#2B2B36]">
					<div className="grid grid-cols-[auto_1fr_140px_100px_120px] gap-4 bg-surface px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
						<span>#</span>
						<span>Name</span>
						<span>Popularity</span>
						<span>Sales</span>
						<span>Status</span>
					</div>
					<ul className="divide-y divide-[#2B2B36]">
						{projects.map((project) => (
							<li
								key={project.id}
								className="grid grid-cols-[auto_1fr_140px_100px_120px] items-center gap-4 px-4 py-2.5 text-xs"
							>
								<span className="font-semibold text-soft-white/90">{project.id}</span>
								<span className="text-soft-white/90">{project.name}</span>
								<PopularityBar value={project.popularity} />
								<span className="font-medium text-soft-white/90">{project.sales}%</span>
								<StatusBadge status={project.status} />
							</li>
						))}
					</ul>
				</div>
			</div>
		</Card>
	)
}

function CompanyDashboardCard({ stats }: { stats: CompanyStat[] }) {
	const total = stats.reduce((sum, stat) => sum + stat.value, 0)
	const gradient = buildConicGradient(stats, total)

	return (
		<Card className="flex h-full flex-col justify-between gap-4 py-5">
			<h3 className="font-display text-sm sm:text-base font-semibold text-soft-white">
				Company-Wide Dashboard
			</h3>
			<div className="flex flex-1 flex-col items-center justify-center gap-4 sm:gap-6">
				<div className="relative grid h-32 w-32 sm:h-40 sm:w-40 flex-shrink-0 place-items-center">
					<div
						className="h-32 w-32 sm:h-40 sm:w-40 rounded-full"
						style={{ background: gradient }}
					/>
					<div className="absolute inset-3 sm:inset-4 grid place-items-center rounded-full bg-surface text-center">
						<span className="text-3xl sm:text-4xl font-semibold text-soft-white">{total}</span>
						<span className="text-[10px] sm:text-xs text-muted-foreground/70">Projects</span>
					</div>
				</div>
				<ul className="w-full space-y-2 text-xs">
					{stats.map((stat) => (
						<li key={stat.label} className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2.5">
								<span
									className="block h-2 w-2 rounded-full"
									style={{ backgroundColor: stat.color }}
								/>
								<span className="text-soft-white/90">{stat.label}</span>
							</div>
							<span className="font-semibold text-soft-white/90">{stat.value}</span>
						</li>
					))}
				</ul>
			</div>
		</Card>
	)
}

function TaskTable({ tasks }: { tasks: Task[] }) {
	return (
		<Card>
			<header className="flex flex-col justify-between gap-1.5 sm:flex-row sm:items-end">
				<div>
					<p className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
						Tasks
					</p>
					<h2 className="font-display text-lg font-semibold text-soft-white">
						Today&apos;s Tasks
					</h2>
				</div>
				<span className="text-[10px] text-muted-foreground/70">Status overview</span>
			</header>
			<div className="mt-3 overflow-hidden rounded-2xl border border-[#2B2B36]">
				<ul className="divide-y divide-[#2B2B36]">
					{tasks.map((task) => (
						<li key={task.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-2.5 text-xs">
							<span className="font-semibold text-soft-white/90">{task.id}</span>
							<span className="text-soft-white/90">{task.name}</span>
							<StatusBadge status={task.status} />
						</li>
					))}
				</ul>
			</div>
		</Card>
	)
}

function KpiCard({ progress }: { progress: number }) {
	const radius = 45
	const circumference = 2 * Math.PI * radius
	const offset = circumference * (1 - progress / 100)

	return (
		<Card className="flex items-center justify-between gap-4 py-5">
			<div className="flex-1">
				<h3 className="font-display text-xl sm:text-2xl font-semibold text-soft-white">KPIs</h3>
				<p className="mt-3 text-2xl sm:text-3xl font-bold text-soft-white">
					{progress}% <span className="text-xs sm:text-sm font-normal text-muted-foreground/70">Progress</span>
				</p>
			</div>
			<div className="relative flex-shrink-0">
				<svg width="90" height="90" viewBox="0 0 110 110" className="transform -rotate-90 sm:w-[110px] sm:h-[110px]">
					<circle cx="55" cy="55" r={radius} stroke="#2B2B36" strokeWidth="7" fill="none" />
					<circle
						cx="55"
						cy="55"
						r={radius}
						stroke="#A9DFD8"
						strokeWidth="7"
						fill="none"
						strokeDasharray={circumference.toFixed(2)}
						strokeDashoffset={offset.toFixed(2)}
						strokeLinecap="round"
					/>
				</svg>
			</div>
		</Card>
	)
}

function OverdueCard({ overdueCount }: { overdueCount: number }) {
	return (
		<Card className="flex items-center justify-between gap-4 py-5">
			<div className="flex-1">
				<h3 className="font-display text-xl sm:text-2xl font-semibold text-soft-white">
					Overdue Tasks
				</h3>
				<p className="mt-3 text-2xl sm:text-3xl font-bold text-soft-white">
					{overdueCount} <span className="text-base sm:text-lg font-medium text-muted-foreground/70">tasks</span>
				</p>
			</div>
			<div className="grid h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 place-items-center rounded-full bg-accent/15 ring-2 ring-accent/10">
				<CheckIcon className="h-10 w-10 sm:h-12 sm:w-12 text-accent" />
			</div>
		</Card>
	)
}

function TeamWorkloadCard({ data }: { data: WorkloadEntry[] }) {
	const maxValue = Math.max(...data.map((entry) => entry.value))

	return (
		<Card>
			<h3 className="font-display text-base font-semibold text-soft-white">
				Team workload
			</h3>
			<div className="mt-3 flex items-end gap-2">
				{data.map((entry) => {
					const height = maxValue === 0 ? 0 : Math.round((entry.value / maxValue) * 60)
					return (
						<div key={entry.label} className="flex flex-1 flex-col items-center gap-1.5">
							<div className="flex h-[70px] w-3.5 items-end rounded-full bg-[#2B2B36]">
								<div
									className="w-full rounded-full bg-accent"
									style={{ height: `${height}px` }}
								/>
							</div>
							<span className="text-[10px] text-muted-foreground/80">{entry.label}</span>
						</div>
					)
				})}
			</div>
		</Card>
	)
}

function DeadlineCard({ deadlines }: { deadlines: Deadline[] }) {
	return (
		<Card className="flex flex-col gap-3 py-4">
			<h3 className="font-display text-xl font-semibold text-soft-white">
				Deadlines
			</h3>
			<div className="flex flex-col gap-2">
				{deadlines.map((deadline) => (
					<div
						key={deadline.title}
						className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.01] ${
							deadline.highlight 
								? 'border-accent/30 bg-accent/20 text-soft-white shadow-[0_0_15px_rgba(169,223,216,0.25)]' 
								: 'border-[#323449] bg-surface-light/50 text-soft-white/90 hover:border-[#3d3e52]'
						}`}
					>
						<span>{deadline.title}</span>
						{deadline.highlight && (
							<span className="text-xs text-accent/80">⚡</span>
						)}
					</div>
				))}
			</div>
		</Card>
	)
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
	return (
		<section className={`rounded-3xl border border-[#2F303A] bg-surface p-4 shadow-[0_0_5px_rgba(169,223,216,0.15)] ${className}`}>
			{children}
		</section>
	)
}

function PopularityBar({ value }: { value: number }) {
	return (
		<div className="flex items-center gap-2">
			<div className="h-1.5 w-full rounded-full bg-[#2B2B36]">
				<div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
			</div>
			<span className="text-xs font-medium text-soft-white/80">{value}%</span>
		</div>
	)
}

function StatusBadge({ status }: { status: string }) {
	const styles = getStatusStyles(status)
	return (
		<span className={`inline-flex items-center justify-between rounded-lg px-2.5 py-1 text-[10px] font-semibold ${styles}`}>
			{status}
		</span>
	)
}

function getStatusStyles(status: string) {
	switch (status) {
		case 'Approved':
			return 'bg-[#25C935]/15 text-[#25C935]'
		case 'In review':
			return 'bg-[#FF6B6B]/15 text-[#FF6B6B]'
		case 'On going':
			return 'bg-[#FBBF24]/15 text-[#FBBF24]'
		case 'On hold':
			return 'bg-[#4CA1F4]/15 text-[#4CA1F4]'
		case 'Over due':
			return 'bg-[#FF4D4F]/15 text-[#FF8688]'
		default:
			return 'bg-accent/10 text-accent'
	}
}

function CheckIcon({ className = '' }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
			<circle cx="12" cy="12" r="10" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	)
}

function buildConicGradient(stats: CompanyStat[], total: number) {
	if (!total) {
		return '#2B2B36'
	}

	let currentAngle = 0
	const segments: string[] = []

	stats.forEach((stat) => {
		const slice = (stat.value / total) * 360
		const start = currentAngle
		const end = currentAngle + slice
		segments.push(`${stat.color} ${start}deg ${end}deg`)
		currentAngle = end
	})

	return `conic-gradient(${segments.join(', ')})`
}
