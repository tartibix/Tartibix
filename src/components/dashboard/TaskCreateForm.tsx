'use client'

import Link from 'next/link'
import { FormEvent, ReactNode, useState } from 'react'

import type { TaskCreationTemplate, TaskMemberDetail } from '@/lib/tasksData'

type TaskCreateFormProps = {
	detail: TaskMemberDetail
	creationData: TaskCreationTemplate
	priorityOptions: string[]
}

const fieldStyles = 'w-full appearance-none rounded-[12px] border border-[#2F303A] bg-[#1B1C24] px-4 py-3 pr-12 text-[15px] text-soft-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'

export default function TaskCreateForm({ detail, creationData, priorityOptions }: TaskCreateFormProps) {
	const projects = creationData.projects
	const taskTypes = creationData.taskTypes
	const parentTasks = creationData.parentTasks
	const priorities = priorityOptions.length > 0 ? priorityOptions : creationData.priorityLevels ?? []
	const attachments = creationData.attachments
	const copy = creationData.copy

	const [formState, setFormState] = useState(() => ({
		project: projects[0] ?? '',
		taskType: taskTypes[0] ?? '',
		parentTask: parentTasks[0] ?? '',
		taskName: '',
		description: '',
		startDate: creationData.dateSuggestions.startDate,
		dueDate: creationData.dateSuggestions.dueDate,
		priority: priorities.includes(detail.priorityCard.value) ? detail.priorityCard.value : priorities[0] ?? '',
	}))

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
	}

	const updateField = (field: keyof typeof formState) => (value: string) => {
		setFormState((prev) => ({ ...prev, [field]: value }))
	}

	return (
		<div className="flex flex-col gap-6">
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
					<div className="flex h-full flex-col justify-between gap-6 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_4px_rgba(169,223,216,0.04)]">
					<div className="flex items-center gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-[#2F303A] bg-[#1B1C24] text-accent">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
								<path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<div className="space-y-1">
							<p className="font-display text-[30px] font-semibold text-soft-white leading-[1.1]">{detail.addTaskCard.title}</p>
							<p className="text-sm text-[#7D7E84]">{copy?.heroSubtitle ?? `Create a new work item for ${detail.name} and align it with current milestones.`}</p>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-[13px] uppercase tracking-[0.18em] text-[#7D7E84]">{copy?.helperPrompt ?? 'Need to review existing tasks?'}</p>
						<Link
							href={`/dashboard/tasks/${detail.slug}`}
							className="inline-flex items-center gap-2 text-[15px] font-semibold text-accent transition-colors hover:text-accent/80"
						>
							<span>{copy?.helperLinkLabel ?? 'View task board'}</span>
							<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
								<path d="M4 8h8M8 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</Link>
					</div>
				</div>

					<div className="flex h-full flex-col gap-4 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_4px_rgba(169,223,216,0.04)]">
					<div className="flex items-center justify-between">
						<p className="font-display text-[26px] font-semibold text-soft-white">{detail.priorityCard.label}</p>
						<svg className="h-4 w-4 text-soft-white/80" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M10.667.667 6 5.333 1.333.667" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
					<div className="relative">
						<select
							value={formState.priority}
							onChange={(event) => updateField('priority')(event.target.value)}
							className={fieldStyles}
							aria-label="Select task priority"
						>
							{priorities.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						<svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-soft-white/80" viewBox="0 0 12 7" fill="none">
							<path d="M10.667.667 6 5.333 1.333.667" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
					<p className="text-sm text-[#7D7E84]">{copy?.priorityHelper ?? 'Adjust the urgency to keep your sprints focused.'}</p>
				</div>
			</div>

		<section className="rounded-[26px] border border-[#2F303A] bg-[#21222D] p-8 shadow-[0_0_6px_rgba(169,223,216,0.05)]">
				<form className="space-y-8" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-6">
						<Field label="Project">
							<div className="relative">
								<select
									value={formState.project}
									onChange={(event) => updateField('project')(event.target.value)}
									className={fieldStyles}
									aria-label="Select project"
								>
									{projects.map((project) => (
										<option key={project} value={project}>
											{project}
										</option>
									))}
								</select>
								<DropdownIcon />
							</div>
						</Field>

						<Field label="Task Type">
							<div className="relative">
								<select
									value={formState.taskType}
									onChange={(event) => updateField('taskType')(event.target.value)}
									className={fieldStyles}
									aria-label="Select task type"
								>
									{taskTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
								<DropdownIcon />
							</div>
						</Field>

						<Field label="Parent Task">
							<div className="relative">
								<select
									value={formState.parentTask}
									onChange={(event) => updateField('parentTask')(event.target.value)}
									className={fieldStyles}
									aria-label="Select parent task"
								>
									{parentTasks.map((task) => (
										<option key={task} value={task}>
											{task}
										</option>
									))}
								</select>
								<DropdownIcon />
							</div>
						</Field>

						<Field label="Task Name / Title">
							<input
								type="text"
								value={formState.taskName}
								onChange={(event) => updateField('taskName')(event.target.value)}
								className={fieldStyles}
								placeholder={creationData.placeholders.taskName}
								aria-label="Task name"
							/>
						</Field>

						<Field label="Description">
							<textarea
								value={formState.description}
								onChange={(event) => updateField('description')(event.target.value)}
								className={`${fieldStyles} min-h-[120px] resize-none`}
								placeholder={creationData.placeholders.description}
								aria-label="Task description"
							/>
						</Field>

						<Field label="Start Date">
							<input
								type="date"
								value={formState.startDate}
								onChange={(event) => updateField('startDate')(event.target.value)}
								className={fieldStyles}
								aria-label="Start date"
							/>
						</Field>

						<Field label="Due Date">
							<input
								type="date"
								value={formState.dueDate}
								onChange={(event) => updateField('dueDate')(event.target.value)}
								className={fieldStyles}
								aria-label="Due date"
							/>
						</Field>

						<Field label="Priority">
							<div className="relative">
								<select
									value={formState.priority}
									onChange={(event) => updateField('priority')(event.target.value)}
									className={fieldStyles}
									aria-label="Priority"
								>
									{priorities.map((option) => (
										<option key={`priority-${option}`} value={option}>
											{option}
										</option>
									))}
								</select>
								<DropdownIcon />
							</div>
						</Field>

						<Field label="Attachments">
							<div className="flex flex-col gap-3">
								<div className="flex flex-wrap items-center gap-3">
									<button
										type="button"
										className="inline-flex items-center gap-2 rounded-[12px] border border-[#2F303A] bg-accent/10 px-4 py-2 text-[15px] font-semibold text-accent transition-colors hover:bg-accent/15"
									>
										<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
											<path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<span>{copy?.uploadButtonLabel ?? 'Upload'}</span>
									</button>
								</div>
								{attachments.length > 0 ? (
									<ul className="flex flex-col gap-2">
										{attachments.map((attachment) => (
											<li
												key={attachment.id}
												className="flex items-center justify-between rounded-[12px] border border-[#2F303A] bg-[#1B1C24] px-4 py-3 text-[15px] text-soft-white"
											>
												<span>{attachment.fileName}</span>
												<div className="flex items-center gap-3 text-sm text-[#7D7E84]">
													<span>{attachment.size}</span>
													{attachment.uploadedOn ? <span>{attachment.uploadedOn}</span> : null}
												</div>
											</li>
										))}
									</ul>
								) : (
									<p className="text-sm text-[#7D7E84]">{copy?.attachmentsEmptyState ?? 'No files attached yet. Upload supporting documents to keep context in one place.'}</p>
								)}
							</div>
						</Field>
					</div>

					<div className="flex flex-col items-stretch justify-end gap-4 border-t border-white/5 pt-4 sm:flex-row sm:items-center">
						<Link
							href={`/dashboard/tasks/${detail.slug}`}
							className="inline-flex items-center justify-center rounded-[12px] border border-[#2F303A] px-6 py-3 text-[15px] font-semibold text-soft-white transition-colors hover:bg-[#1B1C24]"
						>
							Cancel
						</Link>
						<button
							type="submit"
							className="inline-flex items-center justify-center rounded-[12px] bg-[#A5E8D6] px-8 py-3 text-[15px] font-semibold text-[#11201A] transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A5E8D6]/60"
						>
							Save
						</button>
					</div>
				</form>
			</section>
		</div>
	)
}

type FieldProps = {
	label: string
	children: ReactNode
}

function Field({ label, children }: FieldProps) {
	return (
		<label className="grid gap-3 text-soft-white sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
			<span className="text-[15px] font-medium text-[#F2F4F8]">{label}</span>
			<div>{children}</div>
		</label>
	)
}

function DropdownIcon() {
	return (
		<svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-soft-white/80" viewBox="0 0 12 7" fill="none">
			<path d="M10.667.667 6 5.333 1.333.667" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
