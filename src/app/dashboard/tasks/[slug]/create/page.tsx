'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

type TaskCreatePageProps = {
	params: {
		slug: string
	}
}

interface EmployeeData {
	id: string
	employeeCode: string
	jobTitle: string
	rank?: string
	name?: string
}

interface ProjectData {
	projectId: string
	projectName: string
}

export default function TaskCreatePage({ params }: TaskCreatePageProps) {
	const [employee, setEmployee] = useState<EmployeeData | null>(null)
	const [projects, setProjects] = useState<ProjectData[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [notFound, setNotFound] = useState(false)
	
	// Form state
	const [formState, setFormState] = useState({
		project: '',
		taskName: '',
		description: '',
		startDate: '',
		dueDate: '',
		priority: 'Medium',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitSuccess, setSubmitSuccess] = useState(false)

	useEffect(() => {
		async function fetchData() {
			try {
				// Fetch all resources to find the employee
				const resourcesRes = await fetch('/api/resources')
				if (!resourcesRes.ok) {
					setNotFound(true)
					return
				}
				const resourcesData = await resourcesRes.json()
				
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

				// Fetch projects
				const projectsRes = await fetch('/api/projects')
				if (projectsRes.ok) {
					const projectsData = await projectsRes.json()
					setProjects(projectsData.projects || projectsData || [])
					if (projectsData.projects?.length > 0 || projectsData.length > 0) {
						const firstProject = projectsData.projects?.[0] || projectsData[0]
						setFormState(prev => ({ ...prev, project: firstProject.projectId }))
					}
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!employee || !formState.project || !formState.taskName) return

		setIsSubmitting(true)
		try {
			const response = await fetch('/api/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					projectId: formState.project,
					taskName: formState.taskName,
					description: formState.description,
					startDate: formState.startDate,
					endDate: formState.dueDate,
					employeeCode: employee.employeeCode,
					priority: formState.priority,
				}),
			})

			if (response.ok) {
				setSubmitSuccess(true)
				setFormState({
					project: formState.project,
					taskName: '',
					description: '',
					startDate: '',
					dueDate: '',
					priority: 'Medium',
				})
			}
		} catch (error) {
			console.error('Error creating task:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<DashboardShell>
				<div className="flex flex-col gap-8">
					<TopBar title="Create Task" />
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
						<p className="text-soft-white/70 mb-4">No team member found</p>
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
	const fieldStyles = 'w-full appearance-none rounded-[12px] border border-[#2F303A] bg-[#1B1C24] px-4 py-3 text-[15px] text-soft-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'

	return (
		<DashboardShell>
			<div className="flex flex-col gap-8">
				<TopBar title={`Create Task for ${displayName}`} />
				
				{submitSuccess && (
					<div className="rounded-lg bg-green-500/20 border border-green-500/40 p-4 text-green-400">
						Task created successfully!
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid gap-6 lg:grid-cols-2">
						<div className="rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6">
							<h2 className="font-display text-xl font-semibold text-soft-white mb-4">Task Details</h2>
							
							<div className="space-y-4">
								<div>
									<label className="block text-sm text-[#7D7E84] mb-2">Project</label>
									<select
										value={formState.project}
										onChange={(e) => setFormState(prev => ({ ...prev, project: e.target.value }))}
										className={fieldStyles}
										required
									>
										<option value="">Select a project</option>
										{projects.map(p => (
											<option key={p.projectId} value={p.projectId}>{p.projectName}</option>
										))}
									</select>
								</div>
								
								<div>
									<label className="block text-sm text-[#7D7E84] mb-2">Task Name</label>
									<input
										type="text"
										value={formState.taskName}
										onChange={(e) => setFormState(prev => ({ ...prev, taskName: e.target.value }))}
										className={fieldStyles}
										placeholder="Enter task name"
										required
									/>
								</div>
								
								<div>
									<label className="block text-sm text-[#7D7E84] mb-2">Description</label>
									<textarea
										value={formState.description}
										onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
										className={`${fieldStyles} min-h-[100px]`}
										placeholder="Describe the task..."
									/>
								</div>
							</div>
						</div>
						
						<div className="rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6">
							<h2 className="font-display text-xl font-semibold text-soft-white mb-4">Schedule & Priority</h2>
							
							<div className="space-y-4">
								<div>
									<label className="block text-sm text-[#7D7E84] mb-2">Start Date</label>
									<input
										type="date"
										value={formState.startDate}
										onChange={(e) => setFormState(prev => ({ ...prev, startDate: e.target.value }))}
										className={fieldStyles}
									/>
								</div>
								
								<div>
									<label className="block text-sm text-[#7D7E84] mb-2">Due Date</label>
									<input
										type="date"
										value={formState.dueDate}
										onChange={(e) => setFormState(prev => ({ ...prev, dueDate: e.target.value }))}
										className={fieldStyles}
									/>
								</div>
								
								<div>
									<label className="block text-sm text-[#7D7E84] mb-2">Priority</label>
									<select
										value={formState.priority}
										onChange={(e) => setFormState(prev => ({ ...prev, priority: e.target.value }))}
										className={fieldStyles}
									>
										<option value="Low">Low</option>
										<option value="Medium">Medium</option>
										<option value="High">High</option>
										<option value="Critical">Critical</option>
									</select>
								</div>
								
								<div className="pt-4">
									<p className="text-sm text-[#7D7E84] mb-2">Assigned To</p>
									<div className="flex items-center gap-3 rounded-lg bg-[#1B1C24] p-3">
										<div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
											<span className="text-accent font-bold">{displayName.charAt(0)}</span>
										</div>
										<div>
											<p className="text-soft-white font-medium">{displayName}</p>
											<p className="text-xs text-[#7D7E84]">{employee.employeeCode}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="flex items-center justify-between">
						<Link
							href={`/dashboard/tasks/${params.slug}`}
							className="rounded-lg border border-[#2F303A] px-6 py-3 text-soft-white hover:bg-white/5"
						>
							Cancel
						</Link>
						<button
							type="submit"
							disabled={isSubmitting || !formState.taskName || !formState.project}
							className="rounded-lg bg-accent px-6 py-3 font-semibold text-night hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? 'Creating...' : 'Create Task'}
						</button>
					</div>
				</form>
			</div>
		</DashboardShell>
	)
}
