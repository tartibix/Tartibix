import Image from 'next/image'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

const requestData = {
	requestTypes: [
		'Purchase request',
		'Software access',
		'Maintenance support',
		'Contract review',
	],
	uploads: [
		{ name: 'Budget_breakdown.xlsx', size: '840 KB', progress: 64 },
		{ name: 'Statement_of_work.pdf', size: '2.4 MB', progress: 100 },
		{ name: 'Stakeholder_list.csv', size: '130 KB', progress: 42 },
	],
	statusHistory: [
		{ request: 'Request 1', status: 'Pending', submitted: 'Aug 1' },
		{ request: 'Request 2', status: 'Approved', submitted: 'Aug 3' },
		{ request: 'Request 3', status: 'Rejected', submitted: 'Aug 7' },
	],
} as const

const statusColors: Record<string, string> = {
	Approved: '#92BCA6',
	Pending: '#F1D395',
	Rejected: '#C91B1B',
}

export default function RequestPage() {
	return (
		<DashboardShell>
			<div className="flex flex-col gap-8">
				<TopBar title="Request Page" subtitle="Create, approve, and archive requests." />

				<section className="relative overflow-hidden rounded-[10px] border border-[#2F303A] bg-[#21222D] shadow-[0_0_8px_rgba(169,223,216,0.2)]">
					<div className="absolute -left-16 bottom-12 h-24 w-64 rounded-full bg-accent/10 blur-3xl" />
					<div className="absolute -right-12 top-16 hidden h-32 w-72 rounded-full bg-accent/10 blur-3xl lg:block" />
					<div className="flex flex-col gap-10 p-6 lg:flex-row lg:gap-12 lg:p-8 xl:p-12">
						<div className="relative flex-1 max-w-xl space-y-8">
							<div className="space-y-6">
								<div>
									<h2 className="font-display text-[24px] font-medium leading-snug text-soft-white">
										Submit new request
									</h2>
									<p className="mt-1 text-sm text-muted-foreground/70">
										Provide a clear summary before sending the form to approvers.
									</p>
								</div>

								<div className="grid gap-5">
									<div className="grid gap-2">
										<label className="text-[16px] font-semibold text-soft-white">Request type</label>
										<div className="relative rounded-[7px] border border-[#323449] bg-[#1B1C24] px-4 py-3">
											<select
												className="w-full appearance-none bg-transparent text-[14px] text-soft-white focus:outline-none"
												defaultValue=""
											>
												<option value="" disabled>
													Select request type
												</option>
												{requestData.requestTypes.map((type) => (
													<option key={type} value={type} className="bg-[#21222D] text-soft-white">
														{type}
													</option>
												))}
											</select>
											<svg
												className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-soft-white/70"
												viewBox="0 0 16 16"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.6"
											>
												<path d="m4 6 4 4 4-4" />
											</svg>
										</div>
									</div>

									<div className="grid gap-2">
										<label className="text-[16px] font-semibold text-soft-white">Description</label>
										<textarea
											rows={6}
											placeholder="Include context, deadlines, and relevant links for reviewers."
											className="resize-none rounded-[7px] border border-[#323449] bg-[#1B1C24] px-4 py-3 text-[14px] text-soft-white placeholder:text-muted-foreground/60 focus:outline-none"
										/>
									</div>
								</div>

								<div className="flex flex-wrap gap-3 pt-2">
									<button
										type="button"
										className="w-full rounded-[10px] border border-accent text-center text-[16px] font-bold uppercase tracking-wide text-[#E9E9E9] transition hover:bg-accent/10 sm:w-auto sm:px-10 sm:py-3"
									>
										Submit
									</button>
								</div>
							</div>
						</div>

						<div className="flex-1 space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-[16px] font-semibold text-soft-white">Upload the files</h3>
								<button
									type="button"
									className="rounded-[10px] border border-accent px-5 py-2 text-[16px] font-bold uppercase tracking-wide text-[#E9E9E9] transition hover:bg-accent/10"
								>
									Upload
								</button>
							</div>

							<div className="rounded-[7px] border border-dashed border-[rgba(8,133,134,0.3)] bg-[rgba(208,252,253,0.05)] px-6 py-10 text-center">
								<div className="mx-auto mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#F9FFF9]/30 bg-accent/10">
									<Image
										src="/images/request-page/upload-icon.svg"
										alt="Upload icon"
										width={69}
										height={60}
										className="h-12 w-12"
										priority
									/>
								</div>
								<p className="text-[16px] font-semibold text-soft-white">Drag &amp; drop files</p>
								<p className="mt-2 text-xs text-[#676767]">
									Supported formats: .pdf .xlsx .csv .dwg .doc .docx .mpp .jpg .png
								</p>
							</div>

							<ul className="space-y-3">
								{requestData.uploads.map((file) => (
									<li key={file.name} className="rounded-[10px] border border-[#2F303A] bg-[#1B1C24] p-4 shadow-[0_0_4px_rgba(169,223,216,0.12)]">
										<div className="flex items-center justify-between text-[14px] text-soft-white">
											<span className="font-medium">{file.name}</span>
											<span className="text-xs text-muted-foreground/70">{file.size}</span>
										</div>
										<div className="mt-3 h-1.5 rounded-full bg-[#2E2F3C]">
											<div
												className="h-full rounded-full bg-accent"
												style={{ width: `${file.progress}%` }}
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				<section className="rounded-[10px] border border-[#2F303A] bg-[#21222D] shadow-[0_0_8px_rgba(169,223,216,0.2)]">
					<header className="flex items-center justify-between border-b border-white/20 px-6 py-5">
						<h2 className="font-display text-[24px] font-medium leading-snug text-soft-white">Track status</h2>
					</header>
					<div className="px-6 py-4 text-soft-white">
						<div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto] gap-6 border-b border-white/20 pb-4 text-[14px] font-medium text-[#87888C]">
							<span>Request</span>
							<span>Status</span>
							<span>Submitted</span>
							<span className="text-right">Action</span>
						</div>
						<ul className="divide-y divide-white/20">
							{requestData.statusHistory.map((item) => (
								<li key={item.request} className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto] items-center gap-6 py-4 text-[14px]">
									<span className="font-medium text-soft-white">{item.request}</span>
									<span className="font-medium" style={{ color: statusColors[item.status] ?? '#FFFFFF' }}>
										{item.status}
									</span>
									<span className="text-soft-white/80">{item.submitted}</span>
									<button
										type="button"
										className="justify-self-end rounded-full border border-[#2F303A] bg-[#1B1C24] p-2 text-soft-white transition hover:border-accent hover:bg-accent/10"
										aria-label={`Open ${item.request}`}
									>
										<svg
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.8"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M10 3v14" />
											<path d="M16 9l-6-6-6 6" />
										</svg>
									</button>
								</li>
							))}
						</ul>
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}
