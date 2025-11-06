import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

const documentRows = [
	{
		id: 'doc-1',
		category: 'Contact',
		version: 'V1',
		name: 'Contract',
	},
	{
		id: 'doc-2',
		category: 'Drawings',
		version: 'Final',
		name: 'Floorlpan',
	},
	{
		id: 'doc-3',
		category: 'Safety Report',
		version: 'V2',
		name: 'Safety Inspection',
	},
	{
		id: 'doc-4',
		category: 'Invoices',
		version: 'V3',
		name: 'Invoice',
	},
	{
		id: 'doc-5',
		category: 'Contact',
		version: 'V1',
		name: 'Nelsa web developement',
	},
	{
		id: 'doc-6',
		category: 'Drawings',
		version: 'Final',
		name: 'Datascale AI app',
	},
	{
		id: 'doc-7',
		category: 'Safety Report',
		version: 'V2',
		name: 'Media channel branding',
	},
	{
		id: 'doc-8',
		category: 'Invoices',
		version: 'V3',
		name: 'Corlax iOS app develpoement',
	},
]

export default function DocumentManagementPage() {
	return (
		<DashboardShell>
			<div className="mx-auto w-full max-w-[1103px] space-y-6">
				<TopBar title="Document Management" subtitle="Centralise, tag, and share critical files." />

				<section className="rounded-[10px] bg-surface shadow-[0_0_10px_rgba(169,223,216,0.4)]">
					<div className="rounded-[10px] border border-[#2F303A] bg-gradient-to-b from-[#1E1F29] to-[#171821] px-6 py-7">
						<div className="flex flex-col gap-5">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<h2 className="font-display text-[20px] font-semibold leading-[30px] text-soft-white">Upload Document</h2>
								<button
									type="button"
									className="rounded-[10px] border border-accent px-8 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#E9E9E9] transition hover:bg-accent/10"
								>
									Upload
								</button>
							</div>
							<label
								htmlFor="document-upload"
								className="flex cursor-pointer items-center justify-between rounded-[10px] border border-[#30313A] bg-[#171821] px-5 py-3 text-sm text-soft-white/60 transition hover:border-accent/70"
							>
								<span>Select File</span>
								<svg
									className="h-6 w-6 text-soft-white/50"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M4 12h16" />
									<path d="M12 4v16" />
								</svg>
							</label>
							<input id="document-upload" type="file" className="hidden" multiple />
						</div>
					</div>
				</section>

				<section className="rounded-[10px] bg-surface shadow-[0_0_10px_rgba(169,223,216,0.35)]">
					<div className="overflow-hidden rounded-[10px] border border-[#2F303A] bg-[#1A1B24]">
						<div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.6fr)_minmax(0,0.7fr)] items-center gap-4 border-b border-white/10 px-6 py-4 text-[18px] font-medium text-[#6E6F75]">
							<span>Name</span>
							<span>Category</span>
							<span>Version</span>
							<span className="text-right">Status</span>
						</div>

						<ul className="flex flex-col">
							{documentRows.map(row => (
								<li
									key={row.id}
									className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.6fr)_minmax(0,0.7fr)] items-center gap-4 border-b border-white/5 px-6 py-[18px] text-[14px] font-medium text-soft-white last:border-0"
								>
									<span>{row.name}</span>
									<span>{row.category}</span>
									<span>{row.version}</span>
									<div className="flex justify-end">
										<button
											type="button"
											className="rounded-[4px] border border-[#2F303A] px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#41D37E] transition hover:border-[#41D37E]/60"
										>
											Download
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}

function DownloadIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 16 16"
			fill="none"
			stroke="#41D37E"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M8 2v8" />
			<path d="M5 7l3 3 3-3" />
			<path d="M3 12h10" />
		</svg>
	)
}

