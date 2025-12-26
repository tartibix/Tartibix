'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { taskStatusStyles } from '@/lib/tasksData'

const fallbackAvatar = '/images/tasks/avatar-default.svg'

interface TaskWithProject {
	taskId?: string
	taskName: string
	status?: string
	startDate?: string
	endDate?: string
	assignedTo?: string
	employeeCode?: string
	projectId: string
	projectName: string
}

interface EmployeeData {
	id: string
	employeeCode: string
	jobTitle: string
	rank?: string
	dailyCost?: number
	name?: string
}

type TaskMemberPageProps = {
	params: {
		slug: string
	}
}

export default function TaskMemberPage({ params }: TaskMemberPageProps) {
	const [employee, setEmployee] = useState<EmployeeData | null>(null)
	const [tasks, setTasks] = useState<TaskWithProject[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [notFound, setNotFound] = useState(false)

	// Fetch employee and their tasks
	useEffect(() => {
		async function fetchData() {
			try {
				// Fetch all resources to find the employee by slug
				const resourcesRes = await fetch('/api/resources')
				if (!resourcesRes.ok) {
					setNotFound(true)
					return
				}
				const resourcesData = await resourcesRes.json()
				
				// Find employee matching the slug (by employeeCode or name slug)
				const allEmployees = resourcesData.employees?.items || []
				const foundEmployee = allEmployees.find((emp: any) => {
					const slugFromCode = emp.employeeCode?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
					const slugFromName = (emp.name || emp.jobTitle || '')?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
					return slugFromCode === params.slug || slugFromName === params.slug
				})

				if (!foundEmployee) {
					setNotFound(true)
					return
				}

				setEmployee(foundEmployee)

				// Fetch tasks assigned to this employee
				const tasksRes = await fetch(`/api/tasks?assignee=${encodeURIComponent(foundEmployee.employeeCode)}`)
				if (tasksRes.ok) {
					const tasksData = await tasksRes.json()
					setTasks(tasksData.tasks || [])
				}
			} catch (error) {
				console.error('Error fetching data:', error)
				setNotFound(true)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [params.slug])

	// Compute status counts
	const statusCounts = useMemo(() => {
		return tasks.reduce<Record<string, number>>((acc, task) => {
			const key = task.status || 'Pending'
			acc[key] = (acc[key] ?? 0) + 1
			return acc
		}, {})
	}, [tasks])

	const sortedStatusEntries = useMemo(() => {
		const statusOrder = Object.keys(taskStatusStyles)
		return [
			...statusOrder.filter((status) => statusCounts[status]).map((status) => [status, statusCounts[status]] as const),
			...Object.entries(statusCounts).filter(([status]) => !statusOrder.includes(status)),
		]
	}, [statusCounts])

	const completedCount = tasks.filter((task) => task.status === 'Completed' || task.status === 'Done').length
	const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

	if (isLoading) {
		return (
			<DashboardShell>
				<div className="flex flex-col gap-8">
					<TopBar title="Team Member Tasks" />
					<div className="flex items-center justify-center py-20">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
					</div>
				</div>
			</DashboardShell>
		)
	}

	if (notFound || !employee) {
		return (
			<DashboardShell>
				<div className="flex flex-col gap-8">
					<TopBar title="Team Member Not Found" />
					<div className="rounded-[20px] border border-[#2F303A] bg-[#21222D] p-12 text-center">
						<p className="text-soft-white/70 mb-4">No team member found with identifier &quot;{params.slug}&quot;</p>
						<Link 
							href="/dashboard/tasks"
							className="inline-flex items-center gap-2 rounded-lg bg-accent/20 px-4 py-2 text-accent hover:bg-accent/30"
						>
							← Back to Tasks
						</Link>
					</div>
				</div>
			</DashboardShell>
		)
	}

	const displayName = employee.name || employee.jobTitle || employee.employeeCode
	const displayRole = employee.jobTitle || employee.rank || 'Team Member'

	return (
		<DashboardShell>
			<div className="flex flex-col gap-8">
				<TopBar title={`${displayName}'s Tasks`} />
				<div className="space-y-6">
					<div className="flex items-center gap-4 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_4px_rgba(169,223,216,0.045)]">
						<div className="h-14 w-14 overflow-hidden rounded-full border border-[#2F303A] bg-accent/20 flex items-center justify-center">
							<span className="text-xl font-bold text-accent">
								{displayName.charAt(0).toUpperCase()}
							</span>
						</div>
						<div>
							<p className="text-sm uppercase tracking-[0.18em] text-[#7D7E84]">{displayRole}</p>
							<h1 className="font-display text-[28px] font-semibold text-soft-white">{displayName}</h1>
							<p className="text-xs text-muted-foreground/60">{employee.employeeCode}</p>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
						<div className="flex flex-col gap-4 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_4px_rgba(169,223,216,0.04)] sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-3">
								<h2 className="font-display text-[28px] font-semibold text-soft-white">Task Overview</h2>
								<p className="text-sm text-muted-foreground/70">
									{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned
								</p>
							</div>
						</div>

						<div className="flex h-full flex-col gap-4 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_4px_rgba(169,223,216,0.04)]">
							<div className="flex items-center justify-between">
								<p className="font-display text-[24px] font-semibold text-soft-white">Priority Tasks</p>
							</div>
							<p className="text-[16px] font-medium text-soft-white">
								{tasks.filter(t => t.status === 'In Progress').length} in progress
							</p>
						</div>
					</div>

					<section className="rounded-[26px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_6px_rgba(169,223,216,0.05)]">
						<header className="space-y-3 border-b border-white/10 pb-5">
							<div>
								<h2 className="font-display text-[26px] font-semibold text-soft-white">Assigned Tasks</h2>
								<p className="text-sm text-muted-foreground/70">All tasks for {displayName}</p>
							</div>
							<div className="flex flex-wrap items-center gap-3 text-sm text-soft-white/80">
								{sortedStatusEntries.map(([status, count]) => {
									const statusMeta = taskStatusStyles[status]
									return (
										<span
											key={`${status}-summary`}
											className="flex items-center gap-2 rounded-full border border-[#2F303A] bg-[#1B1C24] px-3 py-1.5"
										>
											<span
												className="h-2 w-2 rounded-full"
												style={{ backgroundColor: statusMeta?.badge.text ?? '#7D7E84' }}
											/>
											<span className="font-medium">{statusMeta?.label ?? status}</span>
											<span className="text-soft-white/60">{count}</span>
										</span>
									)
								})}
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-xs font-semibold text-soft-white/70">
									<span>Completion</span>
									<span>{completionPercentage}%</span>
								</div>
								<div className="relative h-2 rounded-full bg-[#2F303A]">
									<div className="h-full rounded-full bg-accent transition-all" style={{ width: `${completionPercentage}%` }} />
								</div>
							</div>
						</header>
						{tasks.length === 0 ? (
							<div className="py-12 text-center">
								<p className="text-muted-foreground/70">No tasks assigned yet</p>
							</div>
						) : (
							<div className="mt-5 overflow-hidden rounded-[22px] border border-[#2F303A] bg-[#1B1C24]">
								<div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] bg-[#1F2029]">
									{['Task Name', 'Due Date', 'Project', 'Status'].map((column, index) => (
										<div
											key={`${column}-${index}`}
											className={`px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7D7E84] ${index > 0 ? 'border-l border-white/10' : ''}`}
										>
											{column}
										</div>
									))}
								</div>
								<div>
									{tasks.map((task) => {
										const status = task.status || 'Pending'
										const meta = taskStatusStyles[status]
										const dueDate = task.endDate 
											? new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
											: '-'
										return (
											<div key={task.taskId || task.taskName} className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] border-t border-white/10">
												<div className="px-6 py-5">
													<p className="text-[15px] text-soft-white">{task.taskName}</p>
												</div>
												<div className="border-l border-white/10 px-6 py-5">
													<p className="text-[15px] text-soft-white">{dueDate}</p>
												</div>
												<div className="border-l border-white/10 px-6 py-5">
													<p className="text-[15px] text-soft-white">{task.projectName}</p>
												</div>
												<div className="border-l border-white/10 px-6 py-5">
													<div className="flex items-center justify-end">
														<span
															className="rounded-[8px] px-3 py-1.5 text-[13px] font-medium"
															style={{
																backgroundColor: meta?.badge.background ?? 'rgba(155, 160, 174, 0.12)',
																color: meta?.badge.text ?? '#9BA0AE',
															}}
														>
															{meta?.label ?? status}
														</span>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						)}
					</section>
				</div>
			</div>
		</DashboardShell>
	)
}
