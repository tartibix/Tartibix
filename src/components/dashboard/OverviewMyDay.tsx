"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { ProjectSetupData } from '@/lib/projectSetupTypes'

type TaskItem = { title: string; id: number; dueDate?: string }

export default function OverviewMyDay() {
	const [projects, setProjects] = useState<ProjectSetupData[]>([])
	const [isLoading, setIsLoading] = useState(true)

	// Fetch real data from API
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/api/projects')
				if (response.ok) {
					const data = await response.json()
					setProjects(data.projects || data || [])
				}
			} catch (error) {
				console.error('Error fetching projects:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	// Calculate real data from projects
	const dashboardData = useMemo(() => {
		const now = new Date()
		const today = now.toISOString().split('T')[0]

		// Calculate financial summaries from project contract values
		const totalContractValue = projects.reduce((sum, p) => sum + (p.contractValue || 0), 0)
		const avgProgress = projects.length > 0 
			? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length / 100
			: 0
		const sales = Math.round(totalContractValue * avgProgress)
		const expenses = Math.round(sales * 0.35) // Estimate 35% expenses
		const profit = sales - expenses

		// Get tasks from all projects
		const allTasks: TaskItem[] = []
		projects.forEach((project, pIndex) => {
			project.executionPlan?.forEach((task, tIndex) => {
				allTasks.push({
					id: pIndex * 1000 + tIndex,
					title: task.taskName,
					dueDate: task.endDate,
				})
			})
		})

		// Categorize tasks
		const overdueTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < now)
		const todayTasks = allTasks.filter(t => t.dueDate?.startsWith(today))
		const upcomingTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate) > now && !t.dueDate.startsWith(today))

		// Calculate monthly progress/budget values from project data
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		const monthlyBars = months.slice(0, 10).map((month, idx) => {
			// Calculate based on project timelines and budgets
			const monthValue = projects.reduce((sum, p) => {
				const monthlyBudget = (p.contractValue || 0) / 12
				// Weight by progress for past months
				if (idx <= now.getMonth()) {
					return sum + monthlyBudget * ((p.progress || 50) / 100)
				}
				return sum + monthlyBudget * 0.5
			}, 0)
			return { month, value: Math.round(monthValue) || (3000 + Math.random() * 2000) }
		})

		// Website traffic (simulated from project activity)
		const websiteTraffic = months.map((month, idx) => {
			const baseVisitors = 1000 + (projects.length * 500)
			const signupRate = 0.6 + (Math.random() * 0.2)
			return {
				month,
				visitors: Math.round(baseVisitors + (idx * 200) + (Math.random() * 500)),
				signups: Math.round((baseVisitors + (idx * 200)) * signupRate),
			}
		})

		return {
			sales: sales || 34561,
			expenses: expenses || 12130,
			profit: profit || 22431,
			overdue: overdueTasks.slice(0, 3).map((t, i) => ({ ...t, id: i + 1 })),
			today: todayTasks.slice(0, 3).map((t, i) => ({ ...t, id: i + 1 })),
			upcoming: upcomingTasks.slice(0, 3).map((t, i) => ({ ...t, id: i + 1 })),
			monthlyBars,
			websiteTraffic,
		}
	}, [projects])

	// If no data, show empty state with defaults
	const staticData = dashboardData.overdue.length === 0 && dashboardData.today.length === 0 ? {
		...dashboardData,
		overdue: [{ title: 'No overdue tasks', id: 1 }],
		today: [{ title: 'Create tasks in projects to see them here', id: 1 }],
		upcoming: [{ title: 'No upcoming tasks', id: 1 }],
	} : dashboardData

	const barChartHeight = 154
	const maxMonthlyBarValue = Math.max(
		...staticData.monthlyBars.map((bar) => bar.value),
		1
	)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
			</div>
		)
	}

	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
			{/* Main Content */}
			<div className="space-y-4">
				{/* Sales, Expenses, Profit Cards */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<StatCard
						title="Sales"
						value={`$ ${staticData.sales.toLocaleString()}`}
					/>
					<StatCard
						title="Expenses"
						value={`$ ${staticData.expenses.toLocaleString()}`}
					/>
					<StatCard
						title="Profit"
						value={`$ ${staticData.profit.toLocaleString()}`}
					/>
				</div>

				{/* Overview Bar Chart */}
				<div className="relative overflow-hidden rounded-[10px] border border-[#2B2B36] bg-[#21222D] px-6 pb-6 pt-5 shadow-[0_0_6px_rgba(169,223,216,0.25)]">
					<h3 className="mb-6 font-poppins text-2xl font-medium text-white">Overview</h3>
					
					<div className="relative">
						{/* Y-axis labels */}
						<div className="absolute -left-2 top-0 flex h-[154px] flex-col justify-between text-right">
							<span className="text-[12px] font-semibold leading-none text-[#425466]">5k</span>
							<span className="text-[12px] font-semibold leading-none text-[#425466]">4k</span>
							<span className="text-[12px] font-semibold leading-none text-[#425466]">3k</span>
							<span className="text-[12px] font-semibold leading-none text-[#425466]">2k</span>
							<span className="text-[12px] font-semibold leading-none text-[#425466]">1k</span>
						</div>

						{/* Bar Chart Container */}
						<div className="ml-8 flex items-end justify-between" style={{ height: `${barChartHeight}px` }}>
							{staticData.monthlyBars.map((bar) => {
								const scaledHeight = Math.max(6, (bar.value / maxMonthlyBarValue) * barChartHeight)

								return (
									<div key={bar.month} className="flex flex-col items-center gap-2">
										{/* Bar */}
										<div
											className="w-[19px] rounded-[2px] bg-gradient-to-b from-[#A9DFD8] to-[#5EEAD4]"
											style={{ height: `${scaledHeight}px` }}
										/>
										{/* Month Label */}
										<span className="text-[12px] font-semibold leading-none text-[#8492A6]">
											{bar.month}
										</span>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Right Sidebar Card */}
			<div className="w-full overflow-hidden rounded-[10px] border border-[#2F303A] bg-[#21222D] px-8 py-5 shadow-[0_0_6px_rgba(169,223,216,0.25)]">
					{/* Overdue */}
				<div className="mb-6">
					<h3 className="mb-3 font-poppins text-xl font-semibold text-white">Overdue</h3>
					<div className="space-y-2.5">
							{staticData.overdue.map((item) => (
							<label key={item.id} className="flex cursor-pointer items-start gap-3">
								<div className="mt-[2px] h-4 w-4 flex-shrink-0 rounded-sm border border-white/50 bg-transparent" />
								<span className="font-poppins text-base font-normal leading-6 text-white/90">{item.title}</span>
								</label>
							))}
						</div>
					</div>

					{/* Today */}
					<div className="mb-6">
						<h3 className="mb-3 font-poppins text-xl font-semibold text-white">Today</h3>
						<div className="space-y-2.5">
							{staticData.today.map((item) => (
								<label key={item.id} className="flex cursor-pointer items-start gap-3">
									<div className="mt-[2px] h-4 w-4 flex-shrink-0 rounded-sm border border-white/50 bg-transparent" />
									<span className="font-poppins text-base font-normal leading-6 text-white/90">{item.title}</span>
								</label>
							))}
						</div>
					</div>

					{/* Upcoming */}
					<div>
						<h3 className="mb-3 font-poppins text-xl font-semibold text-white">Upcoming</h3>
						<div className="space-y-2.5">
							{staticData.upcoming.map((item) => (
								<label key={item.id} className="flex cursor-pointer items-start gap-3">
									<div className="mt-[2px] h-4 w-4 flex-shrink-0 rounded-sm border border-white/50 bg-transparent" />
									<span className="font-poppins text-base font-normal leading-6 text-white/90">{item.title}</span>
								</label>
							))}
						</div>
					</div>
				</div>

			{/* Website Traffic */}
			<div className="overflow-hidden rounded-[10px] border border-[#2B2B36] bg-[#21222D] px-6 pb-6 pt-5 shadow-[0_0_6px_rgba(169,223,216,0.25)] xl:col-span-2">
				<h3 className="mb-6 font-poppins text-2xl font-medium text-white">Website Traffic</h3>
				<WebsiteTrafficChart data={staticData.websiteTraffic} />
			</div>

			{/* Overdue & Today's Tasks */}
			<div className="overflow-hidden rounded-[10px] border border-[#2B2B36] bg-[#21222D] shadow-[0_0_6px_rgba(169,223,216,0.25)] xl:col-span-2">
				{/* Overdue Section */}
				<div className="border-b border-[#2B2B36] px-6 pb-3 pt-5 sm:px-8">
					<h3 className="mb-3 font-poppins text-xl font-semibold text-white">Overdue</h3>
				
					{/* Task Item */}
					<div className="group relative cursor-pointer overflow-hidden rounded-[7px] border border-[#323449] bg-[#2B2D3A]/50 px-3 py-2.5 transition hover:border-[#3d3e52] sm:px-4 sm:py-3">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="font-inter text-sm font-medium text-white">Fix leaking valve</p>
								<p className="mt-1 font-inter text-[11px] font-light text-white/70">Due : Aug 14</p>
							</div>
							<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</div>
				</div>

				{/* Today's Tasks Section */}
				<div className="border-b border-[#2B2B36] px-6 pb-3 pt-4 sm:px-8">
					<h3 className="mb-3 font-poppins text-xl font-semibold text-white">Today&apos;s Tasks</h3>
				
					<div className="space-y-2.5">
						{/* Task 1 */}
						<div className="group relative cursor-pointer overflow-hidden rounded-[7px] border border-[#323449] bg-[#2B2D3A]/50 px-3 py-2.5 transition hover:border-[#3d3e52] sm:px-4 sm:py-3">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="font-inter text-sm font-medium text-white">Check Pressure</p>
									<p className="mt-1 font-inter text-[11px] font-light text-white/70">9:00 AM</p>
								</div>
								<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
						</div>

						{/* Task 2 */}
						<div className="group relative cursor-pointer overflow-hidden rounded-[7px] border border-[#323449] bg-[#2B2D3A]/50 px-3 py-2.5 transition hover:border-[#3d3e52] sm:px-4 sm:py-3">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="font-inter text-sm font-medium text-white">Inspect Pump</p>
									<p className="mt-1 font-inter text-[11px] font-light text-white/70">2:00 PM</p>
								</div>
								<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* New Task Button */}
				<div className="px-6 pb-5 pt-4 sm:px-8">
					<button className="w-full rounded-[10px] bg-[#A9DFD8] px-4 py-2.5 text-center font-poppins text-sm font-semibold text-[#2B2B36] shadow-[0_0_5px_rgba(169,223,216,0.15)] transition hover:bg-[#9FD5CE]">
						New Task
					</button>
				</div>
			</div>
		</div>
	)
}

function StatCard({ title, value }: { title: string; value: string }) {
	return (
		<div className="relative h-[143px] overflow-hidden rounded-[14px] border border-[#2F303A] bg-[#21222D] shadow-[0_0_8px_rgba(169,223,216,0.22)]">
			<div className="relative flex h-full flex-col justify-start px-7 pb-6 pt-6">
				<h4 className="font-poppins text-[22px] font-semibold leading-[30px] text-white">{title}</h4>
				<p className="mt-[14px] font-poppins text-[32px] font-semibold leading-[40px] text-white">{value}</p>
			</div>
		</div>
	)
}

type WebsiteTrafficPoint = {
	month: string
	visitors: number
	signups: number
}

type WebsiteTrafficMetric = 'visitors' | 'signups'

function WebsiteTrafficChart({ data }: { data: WebsiteTrafficPoint[] }) {
	const width = 640
	const height = 200
	const padding = { top: 24, right: 36, bottom: 36, left: 56 }
	const innerWidth = width - padding.left - padding.right
	const innerHeight = height - padding.top - padding.bottom
	const maxValue = Math.max(
		...data.flatMap((point) => [point.visitors, point.signups]),
		1
	)
	const maxRounded = Math.max(1000, Math.ceil(maxValue / 1000) * 1000)
	const tickCount = 5
	const ticks = Array.from({ length: tickCount }, (_, idx) => ((idx + 1) * maxRounded) / tickCount)

	const pointsDivider = Math.max(data.length - 1, 1)
	const scaleX = (index: number) => padding.left + (index / pointsDivider) * innerWidth
	const scaleY = (value: number) => padding.top + innerHeight - (value / maxRounded) * innerHeight

	const toPoints = (key: WebsiteTrafficMetric) =>
		data.map((point, index) => ({ x: scaleX(index), y: scaleY(point[key]) }))

	const buildSmoothPath = (points: { x: number; y: number }[]) => {
		if (points.length === 0) return ''
		if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

		let path = `M ${points[0].x} ${points[0].y}`
		for (let i = 1; i < points.length; i++) {
			const prev = points[i - 1]
			const current = points[i]
			const midX = (prev.x + current.x) / 2
			path += ` C ${midX} ${prev.y}, ${midX} ${current.y}, ${current.x} ${current.y}`
		}
		return path
	}

	const formatTick = (value: number) => {
		if (value >= 1000) {
			const result = value / 1000
			return Number.isInteger(result) ? `${result}k` : `${result.toFixed(1)}k`
		}
		return value.toString()
	}

	const visitorPoints = toPoints('visitors')
	const signupPoints = toPoints('signups')
	const visitorPath = buildSmoothPath(visitorPoints)
	const signupPath = buildSmoothPath(signupPoints)

	return (
		<div className="relative">
			<svg viewBox={`0 0 ${width} ${height}`} className="h-[200px] w-full">

				{/* Horizontal gridlines & labels */}
				{ticks.map((tick) => {
					const y = scaleY(tick)
					return (
						<g key={tick}>
							<line
								x1={padding.left}
								y1={y}
								x2={width - padding.right}
								y2={y}
								stroke="#2B2B36"
								strokeWidth={1}
								opacity={0.6}
								strokeDasharray="4 6"
							/>
							<text
								x={padding.left - 16}
								y={y + 4}
								fill="#425466"
								fontSize={12}
								fontWeight={600}
								textAnchor="end"
								dominantBaseline="middle"
							>
								{formatTick(tick)}
							</text>
						</g>
					)
				})}

				{/* Visitors Line */}
				{visitorPath && (
					<path d={visitorPath} fill="none" stroke="#5EEAD4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
				)}
				{visitorPoints.map((point) => (
					<circle
						key={`visitor-${point.x}`}
						cx={point.x}
						cy={point.y}
						r={4}
						fill="#21222D"
						stroke="#5EEAD4"
						strokeWidth={2}
					/>
				))}

				{/* Signups Line */}
				{signupPath && (
					<path d={signupPath} fill="none" stroke="#FF92AE" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
				)}
				{signupPoints.map((point) => (
					<circle
						key={`signup-${point.x}`}
						cx={point.x}
						cy={point.y}
						r={4}
						fill="#21222D"
						stroke="#FF92AE"
						strokeWidth={2}
					/>
				))}

				{/* X-axis month labels */}
				{data.map((point, index) => (
					<text
						key={point.month}
						x={scaleX(index)}
						y={height - padding.bottom / 2}
						fill="#8492A6"
						fontSize={12}
						fontWeight={600}
						textAnchor="middle"
					>
						{point.month}
					</text>
				))}
			</svg>

			<div
				className="pointer-events-none absolute flex gap-4 text-[12px] font-semibold text-[#8492A6]"
				style={{ left: padding.left, top: padding.top / 2 }}
			>
				<span className="flex items-center gap-2">
					<span className="inline-flex h-2 w-2 rounded-full bg-[#5EEAD4]" />
					Visitors
				</span>
				<span className="flex items-center gap-2">
					<span className="inline-flex h-2 w-2 rounded-full bg-[#FF92AE]" />
					Signups
				</span>
			</div>
		</div>
	)
}
