import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { taskMemberDetails, taskStatusStyles } from '@/lib/tasksData'

const fallbackAvatar = '/images/tasks/avatar-default.svg'

type TaskMemberPageProps = {
	params: {
		slug: string
	}
}

export function generateStaticParams() {
	return Object.values(taskMemberDetails).map((detail) => ({ slug: detail.slug }))
}

export default function TaskMemberPage({ params }: TaskMemberPageProps) {
	const detail = taskMemberDetails[params.slug]
	if (!detail) {
		notFound()
	}

	const avatarSrc = detail.avatar && detail.avatar.trim().length > 0 ? detail.avatar : fallbackAvatar
	const priorityOptions = detail.priorityCard.options ?? []
	const statusCounts = detail.board.rows.reduce<Record<string, number>>((acc, row) => {
		const key = row.status
		acc[key] = (acc[key] ?? 0) + 1
		return acc
	}, {})
	const statusOrder = Object.keys(taskStatusStyles)
	const sortedStatusEntries = [
		...statusOrder.filter((status) => statusCounts[status]).map((status) => [status, statusCounts[status]] as const),
		...Object.entries(statusCounts).filter(([status]) => !statusOrder.includes(status)),
	]
	const totalRows = detail.board.rows.length
	const completedCount = detail.board.rows.filter((row) => row.status === 'Completed').length
	const completionPercentage = totalRows > 0 ? Math.round((completedCount / totalRows) * 100) : 0

	return (
		<DashboardShell>
			<div className="flex flex-col gap-8">
				<TopBar title={detail.sectionTitle} />
				<div className="space-y-6">
					<div className="flex items-center gap-4 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_6px_rgba(169,223,216,0.08)]">
						<div className="h-14 w-14 overflow-hidden rounded-full border border-[#2F303A]">
							<Image src={avatarSrc} alt={`${detail.name} avatar`} width={56} height={56} className="h-full w-full" />
						</div>
						<div>
							<p className="text-sm uppercase tracking-[0.18em] text-[#7D7E84]">{detail.role}</p>
							<h1 className="font-display text-[28px] font-semibold text-soft-white">{detail.name}</h1>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
						<div className="flex flex-col gap-4 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_6px_rgba(169,223,216,0.07)] sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-3">
								<h2 className="font-display text-[28px] font-semibold text-soft-white">{detail.addTaskCard.title}</h2>
								{detail.addTaskCard.description ? (
									<p className="text-sm text-muted-foreground/70">{detail.addTaskCard.description}</p>
								) : null}
								{detail.addTaskCard.ctaLabel ? (
									<Link
										href={`/dashboard/tasks/${detail.slug}/create`}
										className="inline-flex items-center gap-2 rounded-[12px] border border-[#2F303A] bg-accent/10 px-4 py-3 text-[15px] font-semibold text-accent transition-colors hover:bg-accent/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
									>
										<svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
											<path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										{detail.addTaskCard.ctaLabel}
									</Link>
								) : null}
							</div>
						</div>

						<div className="flex h-full flex-col gap-4 rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_6px_rgba(169,223,216,0.07)]">
							<div className="flex items-center justify-between">
								<p className="font-display text-[24px] font-semibold text-soft-white">{detail.priorityCard.label}</p>
								{priorityOptions.length === 0 && (
									<svg
										className="h-4 w-4 text-soft-white/80"
										viewBox="0 0 12 7"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M10.667.667 6 5.333 1.333.667" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>
							{priorityOptions.length > 0 ? (
								<div className="relative mt-2">
									<select
										defaultValue={detail.priorityCard.value}
										className="w-full appearance-none rounded-[12px] border border-[#2F303A] bg-[#1B1C24] px-4 py-3 pr-10 text-[15px] text-soft-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
										aria-label={`${detail.priorityCard.label} selection`}
									>
										{priorityOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
									<svg
										className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-soft-white/80"
										viewBox="0 0 12 7"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M10.667.667 6 5.333 1.333.667" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
							) : (
								<p className="text-[16px] font-medium text-soft-white">{detail.priorityCard.value}</p>
							)}
						</div>
					</div>

					<section className="rounded-[26px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_8px_rgba(169,223,216,0.09)]">
						<header className="space-y-3 border-b border-white/10 pb-5">
							<div>
								<h2 className="font-display text-[26px] font-semibold text-soft-white">{detail.board.title}</h2>
								<p className="text-sm text-muted-foreground/70">{detail.board.subtitle}</p>
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
						<div className="mt-5 overflow-hidden rounded-[22px] border border-[#2F303A] bg-[#1B1C24]">
							<div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] bg-[#1F2029]">
								{detail.board.columns.map((column, index) => (
									<div
										key={`${column}-${index}`}
										className={`px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7D7E84] ${index > 0 ? 'border-l border-white/10' : ''}`}
									>
										{column}
									</div>
								))}
							</div>
							<div>
								{detail.board.rows.map((row) => {
									const meta = taskStatusStyles[row.status]
									return (
										<div key={row.id} className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] border-t border-white/10">
										<div className="px-6 py-5">
											<p className="text-[15px] text-soft-white">{row.name}</p>
										</div>
										<div className="border-l border-white/10 px-6 py-5">
											<p className="text-[15px] text-soft-white">{row.dueDate}</p>
										</div>
										<div className="border-l border-white/10 px-6 py-5">
											<p className="text-[15px] text-soft-white">{row.assignedTo}</p>
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
													{meta?.label ?? row.status}
												</span>
											</div>
										</div>
									</div>
								)
							})}
							</div>
						</div>
					</section>
				</div>
			</div>
		</DashboardShell>
	)
}
