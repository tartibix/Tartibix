import Image from 'next/image'
import Link from 'next/link'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { taskDetailData } from '@/lib/tasksData'

const fallbackAvatar = '/images/tasks/avatar-default.svg'

export default function TasksPage() {
	const { meta, overview, tasks, timeline, teams } = taskDetailData
	const progressColor = overview.progressColor ?? '#8FC7C8'
	const progressGlowColor = overview.progressGlowColor ?? 'rgba(143, 199, 200, 0.45)'
	const timelineBarColor = timeline.barColor ?? progressColor
	const timelineMarkerGlow = timeline.markerGlowColor ?? progressGlowColor

	return (
		<DashboardShell>
			<div className="flex flex-col gap-8">
				<TopBar title={meta.title} />
				<div className="grid gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
					<section className="flex flex-col gap-6">
						<article className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_6px_rgba(169,223,216,0.12)]">
							<header className="space-y-3">
								<p className="text-[15px] font-semibold uppercase tracking-[0.2em] text-[#7D7E84]">Overview</p>
								<div>
									<h2 className="font-display text-[28px] font-semibold text-soft-white">{overview.title}</h2>
									<p className="mt-1 text-sm text-muted-foreground/70">{overview.phase}</p>
								</div>
							</header>
							<div className="mt-6 space-y-3">
								<div className="relative h-2 rounded-full bg-[#2E2F3C]">
									<div
										className="h-full rounded-full"
										style={{ width: `${overview.progress}%`, backgroundColor: progressColor }}
									/>
									<span
										className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border"
										style={{
											left: `${overview.progress}%`,
											backgroundColor: '#111724',
											borderColor: progressColor,
											boxShadow: `0 0 6px ${progressGlowColor}`,
										}}
									/>
								</div>
								<div className="flex items-center justify-between text-sm text-soft-white">
									<span>Progress</span>
									<span className="font-semibold">{overview.progress} %</span>
								</div>
							</div>
						</article>

						<article className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_6px_rgba(169,223,216,0.12)]">
							<header className="flex items-center justify-between">
								<h2 className="font-display text-[24px] font-semibold text-soft-white">Tasks</h2>
							</header>
							<ul className="mt-6 space-y-4">
								{tasks.map((task) => (
									<li key={task.label} className="flex items-center justify-between gap-4">
										<label className="flex items-center gap-3 text-[16px] text-soft-white">
											<span className="relative inline-flex">
												<input
													type="checkbox"
													checked={task.completed}
													readOnly
													className="peer sr-only"
													aria-label={`Mark ${task.label} complete`}
												/>
												<span className="grid h-5 w-5 place-items-center rounded-[6px] border border-[#3A3B46] bg-[#1B1C24] text-soft-white/40 transition peer-checked:border-accent peer-checked:bg-accent/20 peer-checked:text-accent">
													<svg
														viewBox="0 0 14 14"
														className="h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path d="M3.5 7 6 9.5l4.5-5" />
													</svg>
												</span>
											</span>
											{task.label}
										</label>
										{typeof task.progress === 'number' ? (
											<span className="text-sm font-semibold text-[#5BA7FF]">{task.progress} %</span>
										) : (
											<span className="text-sm text-muted-foreground/70">--</span>
										)}
									</li>
								))}
							</ul>
						</article>

						<article className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_6px_rgba(169,223,216,0.12)]">
							<header className="mb-6">
								<h2 className="font-display text-[24px] font-semibold text-soft-white">Timeline</h2>
							</header>
							<div className="space-y-4">
								<div className="relative">
									<div className="absolute inset-0 h-2 rounded-full bg-[#2E2F3C]" />
									<div className="relative z-[1] flex h-2 w-full items-center">
										{timeline.phases.map((phase, index) => (
											<div
												key={phase.label}
												className="relative h-2 rounded-full"
												style={{ flexGrow: phase.duration, flexBasis: 0, backgroundColor: timelineBarColor }}
											>
												{index < timeline.phases.length - 1 && (
													<span
														className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full border"
														style={{
															backgroundColor: timelineBarColor,
															borderColor: '#1D2532',
															boxShadow: `0 0 6px ${timelineMarkerGlow}`,
														}}
													/>
												)}
											</div>
										))}
									</div>
								</div>
								<div className="flex justify-between text-xs font-medium text-soft-white/80">
									{timeline.phases.map((phase) => (
										<span key={phase.label}>{phase.label}</span>
									))}
								</div>
							</div>
						</article>
					</section>

					<aside className="space-y-6">
						<section className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_8px_rgba(169,223,216,0.2)]">
							<header className="border-b border-white/10 pb-4">
								<h2 className="font-display text-[22px] font-semibold text-soft-white">Team</h2>
							</header>
							<div className="mt-4 space-y-4">
								<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] text-xs font-semibold uppercase tracking-[0.18em] text-[#7D7E84]">
									{teams.primary.columns.map((column) => (
										<span key={column} className={column !== 'Image' ? 'pl-2' : ''}>
											{column}
										</span>
									))}
								</div>
								<ul className="space-y-3">
									{teams.primary.members.map((member) => {
										const avatarSrc = member.image && member.image.trim().length > 0 ? member.image : fallbackAvatar
										const content = (
											<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-0 rounded-[12px] border border-[#2F303A] bg-[#1B1C24] px-3 py-3 transition-colors hover:border-accent/60 hover:bg-[#1F2029]">
												<div className="flex items-center gap-3">
													<div className="h-10 w-10 overflow-hidden rounded-full border border-[#2F303A]">
														<Image src={avatarSrc} alt={`${member.name} avatar`} width={40} height={40} className="h-10 w-10" />
													</div>
												</div>
												<span className="pl-2 text-[15px] font-medium text-soft-white">{member.name}</span>
												<span className="pl-2 text-sm text-muted-foreground/70">{member.role}</span>
											</div>
										)

										return (
											<li key={`${member.name}-${member.role}`}>
												{member.slug ? (
													<Link href={`/dashboard/tasks/${member.slug}`} aria-label={`View details for ${member.name}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
														{content}
													</Link>
												) : (
													content
												)}
											</li>
										)
									})}
								</ul>
							</div>
						</section>

						<section className="rounded-[14px] border border-[#2F303A] bg-[#21222D] p-6 shadow-[0_0_8px_rgba(169,223,216,0.2)]">
							<header className="border-b border-white/10 pb-4">
								<h2 className="font-display text-[22px] font-semibold text-soft-white">Cook</h2>
							</header>
							<ul className="mt-4 space-y-3">
									{teams.secondary.members.map((member, index) => {
										const avatarSrc = member.image && member.image.trim().length > 0 ? member.image : fallbackAvatar
										return (
											<li key={`${member.name}-${index}`} className="flex items-center gap-3 rounded-[12px] border border-[#2F303A] bg-[#1B1C24] px-3 py-3">
												<div className="h-10 w-10 overflow-hidden rounded-full border border-[#2F303A]">
													<Image src={avatarSrc} alt={`${member.name} avatar`} width={40} height={40} className="h-10 w-10" />
												</div>
												<span className="text-[15px] font-medium text-soft-white">{member.name}</span>
											</li>
										)
									})}
							</ul>
						</section>
					</aside>
				</div>
			</div>
		</DashboardShell>
	)
}
