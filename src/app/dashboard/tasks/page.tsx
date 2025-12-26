'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

interface TaskWithProject {
	taskId?: string
	taskName: string
	status?: string
	startDate?: string
	endDate?: string
	assignedTo?: string
	progress?: number
	projectId: string
	projectName: string
	projectPhase?: string
}

interface TaskStats {
	total: number
	completed: number
	inProgress: number
	pending: number
	overdue: number
}

interface TeamMember {
	name: string
	role: string
	image?: string
	taskCount: number
}

const fallbackAvatar = '/images/tasks/avatar-default.svg'

export default function TasksPage() {
	const [tasks, setTasks] = useState<TaskWithProject[]>([])
	const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, inProgress: 0, pending: 0, overdue: 0 })
	const [progress, setProgress] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

	useEffect(() => {
		async function fetchTasks() {
			try {
				const response = await fetch('/api/tasks')
				if (response.ok) {
					const data = await response.json()
					setTasks(data.tasks || [])
					setStats(data.stats || { total: 0, completed: 0, inProgress: 0, pending: 0, overdue: 0 })
					setProgress(data.progress || 0)

					// Extract unique team members from tasks
					const members = new Map<string, TeamMember>()
					data.tasks?.forEach((task: TaskWithProject) => {
						if (task.assignedTo) {
							const existing = members.get(task.assignedTo)
							if (existing) {
								existing.taskCount++
							} else {
								members.set(task.assignedTo, {
									name: task.assignedTo,
									role: 'Team Member',
									taskCount: 1,
								})
							}
						}
					})
					setTeamMembers(Array.from(members.values()).slice(0, 4))
				}
			} catch (error) {
				console.error('Error fetching tasks:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchTasks()
	}, [])

	const progressColor = '#8FC7C8'
	const progressGlowColor = 'rgba(143, 199, 200, 0.45)'

	// Get current project info from first task
	const currentProject = tasks.length > 0 ? {
		name: tasks[0].projectName,
		phase: tasks[0].projectPhase || 'Planning'
	} : { name: 'All Projects', phase: 'Overview' }

	if (isLoading) {
		return (
			<DashboardShell>
				<div className="flex flex-col gap-8">
					<TopBar title="Task Management" />
					<div className="flex items-center justify-center py-20">
						<div className="text-soft-white/60">Loading tasks...</div>
					</div>
				</div>
			</DashboardShell>
		)
	}

	return (
		<DashboardShell>
			<div className="flex flex-col gap-8">
				<TopBar title="Task Management" />
				<div className="grid gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
					<section className="flex flex-col gap-6">
						{/* Overview Card */}
						<article className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_1px_rgba(169,223,216,0.01)]">
							<header className="space-y-3">
								<p className="text-[15px] font-semibold uppercase tracking-[0.2em] text-[#7D7E84]">Overview</p>
								<div>
									<h2 className="font-display text-[28px] font-semibold text-soft-white">{currentProject.name}</h2>
									<p className="mt-1 text-sm text-muted-foreground/70">{currentProject.phase}</p>
								</div>
							</header>
							<div className="mt-6 space-y-3">
								<div className="relative h-2 rounded-full bg-[#2E2F3C]">
									<div
										className="h-full rounded-full"
										style={{ width: `${progress}%`, backgroundColor: progressColor }}
									/>
									<span
										className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border"
										style={{
											left: `${progress}%`,
											backgroundColor: '#111724',
											borderColor: progressColor,
											boxShadow: `0 0 2px ${progressGlowColor}`,
										}}
									/>
								</div>
								<div className="flex items-center justify-between text-sm text-soft-white">
									<span>Progress</span>
									<span className="font-semibold">{progress} %</span>
								</div>
							</div>
							{/* Stats Row */}
							<div className="mt-6 grid grid-cols-4 gap-4">
								<div className="rounded-lg bg-[#1B1C24] p-3 text-center">
									<p className="text-2xl font-bold text-soft-white">{stats.total}</p>
									<p className="text-xs text-muted-foreground/70">Total</p>
								</div>
								<div className="rounded-lg bg-[#1B1C24] p-3 text-center">
									<p className="text-2xl font-bold text-[#41D37E]">{stats.completed}</p>
									<p className="text-xs text-muted-foreground/70">Completed</p>
								</div>
								<div className="rounded-lg bg-[#1B1C24] p-3 text-center">
									<p className="text-2xl font-bold text-[#5BA7FF]">{stats.inProgress}</p>
									<p className="text-xs text-muted-foreground/70">In Progress</p>
								</div>
								<div className="rounded-lg bg-[#1B1C24] p-3 text-center">
									<p className="text-2xl font-bold text-[#F1D395]">{stats.overdue}</p>
									<p className="text-xs text-muted-foreground/70">Overdue</p>
								</div>
							</div>
						</article>

						{/* Tasks List */}
						<article className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_1px_rgba(169,223,216,0.01)]">
							<header className="flex items-center justify-between">
								<h2 className="font-display text-[24px] font-semibold text-soft-white">Tasks</h2>
								<span className="text-sm text-muted-foreground/70">{tasks.length} tasks</span>
							</header>
							{tasks.length === 0 ? (
								<div className="mt-6 text-center py-8">
									<p className="text-muted-foreground/70">No tasks found. Create a project with execution plan to see tasks.</p>
								</div>
							) : (
								<ul className="mt-6 space-y-4">
									{tasks.slice(0, 10).map((task, index) => {
										const isCompleted = task.status?.toLowerCase() === 'completed' || task.status?.toLowerCase() === 'done'
										const taskProgress = task.progress || (isCompleted ? 100 : 0)
										return (
											<li key={task.taskId || index} className="flex items-center justify-between gap-4">
												<label className="flex items-center gap-3 text-[16px] text-soft-white">
													<span className="relative inline-flex">
														<input
															type="checkbox"
															checked={isCompleted}
															readOnly
															className="peer sr-only"
															aria-label={`Mark ${task.taskName} complete`}
														/>
														<span className={`grid h-5 w-5 place-items-center rounded-[6px] border ${isCompleted ? 'border-[rgba(169,223,216,0.7)] bg-[rgba(169,223,216,0.18)]' : 'border-[rgba(58,59,70,0.8)] bg-[#1B1C24]'} text-soft-white/40 transition`}>
															{isCompleted && (
																<svg
																	viewBox="0 0 14 14"
																	className="h-3 w-3 text-[rgba(169,223,216,0.85)]"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="2"
																>
																	<path d="M3.5 7 6 9.5l4.5-5" />
																</svg>
															)}
														</span>
													</span>
													<span className={isCompleted ? 'line-through opacity-60' : ''}>
														{task.taskName}
													</span>
												</label>
												<div className="flex items-center gap-3">
													{task.assignedTo && (
														<span className="text-xs text-muted-foreground/70">{task.assignedTo}</span>
													)}
													<span className="text-sm font-semibold text-[#5BA7FF]">{taskProgress} %</span>
												</div>
											</li>
										)
									})}
								</ul>
							)}
							{tasks.length > 10 && (
								<div className="mt-4 text-center">
									<Link href="/dashboard/projects" className="text-sm text-accent hover:underline">
										View all {tasks.length} tasks →
									</Link>
								</div>
							)}
						</article>

						{/* Task Distribution */}
						{stats.total > 0 && (
							<article className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_1px_rgba(169,223,216,0.01)]">
								<header className="mb-6">
									<h2 className="font-display text-[24px] font-semibold text-soft-white">Task Distribution</h2>
								</header>
								<div className="space-y-4">
									<div className="relative">
										<div className="absolute inset-0 h-2 rounded-full bg-[#2E2F3C]" />
										<div className="relative z-[1] flex h-2 w-full items-center">
											{stats.pending > 0 && (
												<div
													className="relative h-2 rounded-l-full bg-[#F1D395]"
													style={{ flexGrow: stats.pending, flexBasis: 0 }}
												/>
											)}
											{stats.inProgress > 0 && (
												<div
													className="relative h-2 bg-[#5BA7FF]"
													style={{ flexGrow: stats.inProgress, flexBasis: 0 }}
												/>
											)}
											{stats.completed > 0 && (
												<div
													className="relative h-2 rounded-r-full bg-[#41D37E]"
													style={{ flexGrow: stats.completed, flexBasis: 0 }}
												/>
											)}
										</div>
									</div>
									<div className="flex justify-between text-xs font-medium text-soft-white/80">
										<span className="text-[#F1D395]">Pending ({stats.pending})</span>
										<span className="text-[#5BA7FF]">In Progress ({stats.inProgress})</span>
										<span className="text-[#41D37E]">Completed ({stats.completed})</span>
									</div>
								</div>
							</article>
						)}
					</section>

					<aside className="space-y-6">
						{/* Team Members */}
						<section className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_1px_rgba(169,223,216,0.012)]">
							<header className="border-b border-white/10 pb-4">
								<h2 className="font-display text-[22px] font-semibold text-soft-white">Team Members</h2>
							</header>
							{teamMembers.length === 0 ? (
								<div className="mt-4 text-center py-4">
									<p className="text-sm text-muted-foreground/70">No team members assigned yet.</p>
								</div>
							) : (
								<ul className="mt-4 space-y-3">
									{teamMembers.map((member, index) => {
										const memberSlug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
										return (
											<li key={member.name + index}>
												<Link 
													href={`/dashboard/tasks/${memberSlug}`}
													className="flex items-center gap-3 rounded-[12px] border border-[rgba(47,48,58,0.78)] bg-[#1B1C24] px-3 py-3 transition-colors hover:bg-[#25262F] hover:border-accent/30"
												>
													<div className="h-10 w-10 overflow-hidden rounded-full border border-[rgba(47,48,58,0.78)] bg-accent/20 flex items-center justify-center">
														<span className="text-sm font-semibold text-accent">
															{member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
														</span>
													</div>
													<div className="flex-1">
														<span className="text-[15px] font-medium text-soft-white">{member.name}</span>
														<p className="text-xs text-muted-foreground/70">{member.taskCount} tasks assigned</p>
													</div>
													<svg className="h-4 w-4 text-soft-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
													</svg>
												</Link>
											</li>
										)
									})}
								</ul>
							)}
						</section>

						{/* Quick Stats */}
						<section className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_1px_rgba(169,223,216,0.012)]">
							<header className="border-b border-white/10 pb-4">
								<h2 className="font-display text-[22px] font-semibold text-soft-white">Quick Stats</h2>
							</header>
							<ul className="mt-4 space-y-3">
								<li className="flex items-center justify-between rounded-[12px] border border-[rgba(47,48,58,0.78)] bg-[#1B1C24] px-4 py-3">
									<span className="text-sm text-muted-foreground/70">Completion Rate</span>
									<span className="text-[15px] font-medium text-soft-white">{progress}%</span>
								</li>
								<li className="flex items-center justify-between rounded-[12px] border border-[rgba(47,48,58,0.78)] bg-[#1B1C24] px-4 py-3">
									<span className="text-sm text-muted-foreground/70">Overdue Tasks</span>
									<span className="text-[15px] font-medium text-[#F87171]">{stats.overdue}</span>
								</li>
								<li className="flex items-center justify-between rounded-[12px] border border-[rgba(47,48,58,0.78)] bg-[#1B1C24] px-4 py-3">
									<span className="text-sm text-muted-foreground/70">Active Tasks</span>
									<span className="text-[15px] font-medium text-[#5BA7FF]">{stats.inProgress}</span>
								</li>
							</ul>
						</section>
					</aside>
				</div>
			</div>
		</DashboardShell>
	)
}
