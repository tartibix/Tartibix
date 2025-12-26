'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

type Request = {
	id: string
	type: string
	description: string
	status: 'Pending' | 'Approved' | 'Rejected'
	submittedAt: string
	submittedBy?: string
	attachments?: { name: string; size: string; url?: string }[]
}

type UploadFile = {
	name: string
	size: string
	progress: number
	file?: File
}

const REQUEST_TYPES = [
	'Purchase request',
	'Software access',
	'Maintenance support',
	'Contract review',
	'Budget approval',
	'Equipment rental',
	'Material procurement',
]

const statusColors: Record<string, string> = {
	Approved: '#92BCA6',
	Pending: '#F1D395',
	Rejected: '#C91B1B',
}

export default function RequestPage() {
	const [requests, setRequests] = useState<Request[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [selectedType, setSelectedType] = useState('')
	const [description, setDescription] = useState('')
	const [uploads, setUploads] = useState<UploadFile[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Fetch requests from API
	useEffect(() => {
		async function fetchRequests() {
			try {
				const res = await fetch('/api/requests')
				if (res.ok) {
					const data = await res.json()
					setRequests(data.requests || [])
				}
			} catch (error) {
				console.error('Error fetching requests:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchRequests()
	}, [])

	// Handle file upload
	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files) return

		const newUploads: UploadFile[] = Array.from(files).map(file => ({
			name: file.name,
			size: formatFileSize(file.size),
			progress: 0,
			file
		}))

		// Simulate upload progress
		setUploads(prev => [...prev, ...newUploads])
		
		newUploads.forEach((upload, index) => {
			simulateUpload(uploads.length + index)
		})
	}

	const simulateUpload = (index: number) => {
		let progress = 0
		const interval = setInterval(() => {
			progress += Math.random() * 20
			if (progress >= 100) {
				progress = 100
				clearInterval(interval)
			}
			setUploads(prev => prev.map((u, i) => 
				i === index ? { ...u, progress } : u
			))
		}, 300)
	}

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	// Handle form submission
	const handleSubmit = async () => {
		if (!selectedType || !description) {
			alert('Please select a request type and provide a description')
			return
		}

		setIsSubmitting(true)
		try {
			const res = await fetch('/api/requests', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: selectedType,
					description,
					attachments: uploads.filter(u => u.progress === 100).map(u => ({
						name: u.name,
						size: u.size
					}))
				})
			})

			if (res.ok) {
				const newRequest = await res.json()
				setRequests(prev => [newRequest, ...prev])
				setSelectedType('')
				setDescription('')
				setUploads([])
			}
		} catch (error) {
			console.error('Error submitting request:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	// Format date for display
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr)
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
	}

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
												value={selectedType}
												onChange={(e) => setSelectedType(e.target.value)}
											>
												<option value="" disabled>
													Select request type
												</option>
												{REQUEST_TYPES.map((type) => (
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
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											className="resize-none rounded-[7px] border border-[#323449] bg-[#1B1C24] px-4 py-3 text-[14px] text-soft-white placeholder:text-muted-foreground/60 focus:outline-none"
										/>
									</div>
								</div>

								<div className="flex flex-wrap gap-3 pt-2">
									<button
										type="button"
										onClick={handleSubmit}
										disabled={isSubmitting || !selectedType || !description}
										className="w-full rounded-[10px] border border-accent text-center text-[16px] font-bold uppercase tracking-wide text-[#E9E9E9] transition hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:px-10 sm:py-3"
									>
										{isSubmitting ? 'Submitting...' : 'Submit'}
									</button>
								</div>
							</div>
						</div>

						<div className="flex-1 space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-[16px] font-semibold text-soft-white">Upload the files</h3>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileSelect}
									className="hidden"
									multiple
									accept=".pdf,.xlsx,.csv,.dwg,.doc,.docx,.mpp,.jpg,.png"
								/>
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="rounded-[10px] border border-accent px-5 py-2 text-[16px] font-bold uppercase tracking-wide text-[#E9E9E9] transition hover:bg-accent/10"
								>
									Upload
								</button>
							</div>

							<div 
								className="rounded-[7px] border border-dashed border-[rgba(8,133,134,0.3)] bg-[rgba(208,252,253,0.05)] px-6 py-10 text-center cursor-pointer hover:border-accent/50 transition"
								onClick={() => fileInputRef.current?.click()}
							>
								<div className="mx-auto mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#F9FFF9]/30 bg-accent/10">
									<svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
									</svg>
								</div>
								<p className="text-[16px] font-semibold text-soft-white">Drag &amp; drop files</p>
								<p className="mt-2 text-xs text-[#676767]">
									Supported formats: .pdf .xlsx .csv .dwg .doc .docx .mpp .jpg .png
								</p>
							</div>

							{uploads.length > 0 && (
								<ul className="space-y-3">
									{uploads.map((file, index) => (
										<li key={`${file.name}-${index}`} className="rounded-[10px] border border-[#2F303A] bg-[#1B1C24] p-4 shadow-[0_0_4px_rgba(169,223,216,0.12)]">
											<div className="flex items-center justify-between text-[14px] text-soft-white">
												<span className="font-medium">{file.name}</span>
												<span className="text-xs text-muted-foreground/70">{file.size}</span>
											</div>
											<div className="mt-3 h-1.5 rounded-full bg-[#2E2F3C]">
												<div
													className="h-full rounded-full bg-accent transition-all duration-300"
													style={{ width: `${file.progress}%` }}
												/>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</section>

				<section className="rounded-[10px] border border-[#2F303A] bg-[#21222D] shadow-[0_0_8px_rgba(169,223,216,0.2)]">
					<header className="flex items-center justify-between border-b border-white/20 px-6 py-5">
						<h2 className="font-display text-[24px] font-medium leading-snug text-soft-white">Track status</h2>
						<span className="text-sm text-soft-white/60">{requests.length} requests</span>
					</header>
					<div className="px-6 py-4 text-soft-white">
						<div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto] gap-6 border-b border-white/20 pb-4 text-[14px] font-medium text-[#87888C]">
							<span>Request</span>
							<span>Status</span>
							<span>Submitted</span>
							<span className="text-right">Action</span>
						</div>
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
							</div>
						) : requests.length === 0 ? (
							<div className="py-8 text-center text-soft-white/60">
								<p>No requests yet</p>
								<p className="text-sm text-soft-white/40 mt-1">Submit a request to get started</p>
							</div>
						) : (
							<ul className="divide-y divide-white/20">
								{requests.map((item) => (
									<li key={item.id} className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto] items-center gap-6 py-4 text-[14px]">
										<div>
											<span className="font-medium text-soft-white">{item.type}</span>
											<p className="text-xs text-soft-white/60 truncate mt-0.5">{item.description}</p>
										</div>
										<span className="font-medium" style={{ color: statusColors[item.status] ?? '#FFFFFF' }}>
											{item.status}
										</span>
										<span className="text-soft-white/80">{formatDate(item.submittedAt)}</span>
										<button
											type="button"
											className="justify-self-end rounded-full border border-[#2F303A] bg-[#1B1C24] p-2 text-soft-white transition hover:border-accent hover:bg-accent/10"
											aria-label={`View ${item.type}`}
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
						)}
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}
