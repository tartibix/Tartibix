'use client'

import { useState, useEffect, useRef } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

interface Document {
	id: string
	name: string
	category: string
	version: string
	status: string
	size?: string
	uploadedAt?: string
}

export default function DocumentManagementPage() {
	const [documents, setDocuments] = useState<Document[]>([])
	const [categories, setCategories] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [selectedCategory, setSelectedCategory] = useState<string>('')
	const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 })
	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		fetchDocuments()
	}, [selectedCategory])

	async function fetchDocuments() {
		try {
			const url = selectedCategory 
				? `/api/documents?category=${encodeURIComponent(selectedCategory)}`
				: '/api/documents'
			const response = await fetch(url)
			if (response.ok) {
				const data = await response.json()
				setDocuments(data.documents || [])
				setCategories(data.categories || [])
				setStats(data.stats || { total: 0, approved: 0, pending: 0, rejected: 0 })
			}
		} catch (error) {
			console.error('Error fetching documents:', error)
		} finally {
			setIsLoading(false)
		}
	}

	async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (!files || files.length === 0) return

		for (const file of Array.from(files)) {
			try {
				await fetch('/api/documents', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: file.name,
						category: 'Uploads',
						version: 'V1',
						size: formatFileSize(file.size),
					}),
				})
			} catch (error) {
				console.error('Error uploading document:', error)
			}
		}
		fetchDocuments()
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	const statusColors: Record<string, string> = {
		approved: '#41D37E',
		pending: '#F1D395',
		rejected: '#F87171',
		uploaded: '#5BA7FF',
	}

	if (isLoading) {
		return (
			<DashboardShell>
				<div className="mx-auto w-full max-w-[1103px] space-y-6">
					<TopBar title="Document Management" subtitle="Centralise, tag, and share critical files." />
					<div className="flex items-center justify-center py-20">
						<div className="text-soft-white/60">Loading documents...</div>
					</div>
				</div>
			</DashboardShell>
		)
	}

	return (
		<DashboardShell>
			<div className="mx-auto w-full max-w-[1103px] space-y-6">
				<TopBar title="Document Management" subtitle="Centralise, tag, and share critical files." />

				{/* Stats */}
				<div className="grid grid-cols-4 gap-4">
					<div className="rounded-lg bg-[#21222D] border border-[#2F303A] p-4 text-center">
						<p className="text-2xl font-bold text-soft-white">{stats.total}</p>
						<p className="text-xs text-muted-foreground/70">Total</p>
					</div>
					<div className="rounded-lg bg-[#21222D] border border-[#2F303A] p-4 text-center">
						<p className="text-2xl font-bold text-[#41D37E]">{stats.approved}</p>
						<p className="text-xs text-muted-foreground/70">Approved</p>
					</div>
					<div className="rounded-lg bg-[#21222D] border border-[#2F303A] p-4 text-center">
						<p className="text-2xl font-bold text-[#F1D395]">{stats.pending}</p>
						<p className="text-xs text-muted-foreground/70">Pending</p>
					</div>
					<div className="rounded-lg bg-[#21222D] border border-[#2F303A] p-4 text-center">
						<p className="text-2xl font-bold text-[#F87171]">{stats.rejected}</p>
						<p className="text-xs text-muted-foreground/70">Rejected</p>
					</div>
				</div>

				<section className="rounded-[10px] bg-surface shadow-[0_0_10px_rgba(169,223,216,0.4)]">
					<div className="rounded-[10px] border border-[#2F303A] bg-gradient-to-b from-[#1E1F29] to-[#171821] px-6 py-7">
						<div className="flex flex-col gap-5">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<h2 className="font-display text-[20px] font-semibold leading-[30px] text-soft-white">Upload Document</h2>
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
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
							<input 
								ref={fileInputRef}
								id="document-upload" 
								type="file" 
								className="hidden" 
								multiple 
								onChange={handleUpload}
							/>
						</div>
					</div>
				</section>

				{/* Category Filter */}
				{categories.length > 0 && (
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedCategory('')}
							className={`rounded-lg px-3 py-1.5 text-sm transition ${
								!selectedCategory ? 'bg-accent text-night' : 'bg-[#21222D] text-soft-white/70 border border-[#2F303A] hover:text-soft-white'
							}`}
						>
							All
						</button>
						{categories.map(cat => (
							<button
								key={cat}
								onClick={() => setSelectedCategory(cat)}
								className={`rounded-lg px-3 py-1.5 text-sm transition ${
									selectedCategory === cat ? 'bg-accent text-night' : 'bg-[#21222D] text-soft-white/70 border border-[#2F303A] hover:text-soft-white'
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				)}

				<section className="rounded-[10px] bg-surface shadow-[0_0_10px_rgba(169,223,216,0.35)]">
					<div className="overflow-hidden rounded-[10px] border border-[#2F303A] bg-[#1A1B24]">
						<div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.6fr)_minmax(0,0.7fr)] items-center gap-4 border-b border-white/10 px-6 py-4 text-[18px] font-medium text-[#6E6F75]">
							<span>Name</span>
							<span>Category</span>
							<span>Version</span>
							<span className="text-right">Status</span>
						</div>

						{documents.length === 0 ? (
							<div className="px-6 py-12 text-center text-muted-foreground/70">
								No documents found. Upload some documents to get started.
							</div>
						) : (
							<ul className="flex flex-col">
								{documents.map(row => (
									<li
										key={row.id}
										className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.6fr)_minmax(0,0.7fr)] items-center gap-4 border-b border-white/5 px-6 py-[18px] text-[14px] font-medium text-soft-white last:border-0"
									>
										<div>
											<span>{row.name}</span>
											{row.size && (
												<p className="text-xs text-muted-foreground/70">{row.size}</p>
											)}
										</div>
										<span>{row.category}</span>
										<span>{row.version}</span>
										<div className="flex justify-end gap-2">
											<span 
												className="rounded-full px-2 py-0.5 text-xs"
												style={{ 
													backgroundColor: `${statusColors[row.status] || statusColors.uploaded}20`,
													color: statusColors[row.status] || statusColors.uploaded 
												}}
											>
												{row.status}
											</span>
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
						)}
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}

