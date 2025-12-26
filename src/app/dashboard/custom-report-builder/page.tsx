'use client'

import { useEffect, useRef, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

// Static report configuration data
const dateRanges = [
	{ label: 'Jan 1, 2024 - Dec 31, 2024', value: '2024-full' },
	{ label: 'Jul 1, 2024 - Dec 31, 2024', value: '2024-h2' },
	{ label: 'Jan 1, 2025 - Jun 30, 2025', value: '2025-h1' },
]

const dataTypes = [
	{ label: 'Financial Overview', value: 'financial-overview' },
	{ label: 'Resource Allocation', value: 'resource-allocation' },
	{ label: 'Task Completion', value: 'task-completion' },
	{ label: 'Risk & Compliance', value: 'risk-compliance' },
]

type Project = {
	projectId: string
	projectName: string
}

export default function CustomReportBuilderPage() {
	const [projects, setProjects] = useState<{ label: string; value: string }[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [selectedProject, setSelectedProject] = useState<string>('')
	const [selectedDateRange, setSelectedDateRange] = useState<string>(dateRanges[0]?.value ?? '')
	const [selectedDataType, setSelectedDataType] = useState<string>('')

	// Fetch projects from API
	useEffect(() => {
		async function fetchProjects() {
			try {
				const res = await fetch('/api/projects')
				if (res.ok) {
					const data = await res.json()
					const projectOptions = (data.projects || []).map((p: Project) => ({
						label: p.projectName,
						value: p.projectId
					}))
					setProjects(projectOptions)
				}
			} catch (error) {
				console.error('Error fetching projects:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchProjects()
	}, [])

	return (
		<DashboardShell>
			<div className="mx-auto w-full max-w-[1103px] pb-16">
				<TopBar title="Custom Report Builder" subtitle="Assemble the metrics that matter most." />

				<section className="mt-12 rounded-[10px] border border-[#2F303A] bg-surface px-6 py-9 shadow-[0_0_10px_rgba(169,223,216,0.2)] sm:px-10 sm:py-12">
					<div className="mx-auto flex min-h-[520px] w-full max-w-[1014px] flex-col gap-9">
						<SelectField
							label="Project Name"
							placeholder={isLoading ? "Loading projects..." : "Select project"}
							size="lg"
							options={projects}
							selectedValue={selectedProject}
							onSelect={setSelectedProject}
							disabled={isLoading}
						/>
						<SelectField
							label="Date Range"
							placeholder="Select date range"
							size="md"
							options={dateRanges}
							selectedValue={selectedDateRange}
							onSelect={setSelectedDateRange}
						/>
						<SelectField
							label="Data Type"
							placeholder="Select data type"
							size="md"
							options={dataTypes}
							selectedValue={selectedDataType}
							onSelect={setSelectedDataType}
						/>
						<DownloadSection disabled={!selectedProject || !selectedDataType} />
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}

type SelectOption = {
	label: string
	value: string
}

function SelectField({
	label,
	options,
	selectedValue,
	onSelect,
	placeholder = '',
	size = 'md',
	disabled = false,
}: {
	label: string
	options: SelectOption[]
	selectedValue?: string
	onSelect: (value: string) => void
	placeholder?: string
	size?: 'md' | 'lg'
	disabled?: boolean
}) {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const valueSize = size === 'lg' ? 'text-[18px]' : 'text-[16px]'
	const selectedOption = options.find(option => option.value === selectedValue)
	const displayLabel = selectedOption?.label ?? placeholder
	const isPlaceholder = !selectedOption && placeholder.length > 0

	useEffect(() => {
		if (!isOpen) return

		function handleClickOutside(event: MouseEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen])

	return (
		<div ref={containerRef} className="relative flex flex-col gap-3 text-soft-white">
			<span className="text-[20px] font-semibold leading-[1.2]">{label}</span>
			<button
				type="button"
				disabled={disabled}
				className={`flex min-h-[50px] items-center justify-between rounded-[7px] border border-[#323449] bg-[#171821] px-5 py-3 text-left text-soft-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171821] ${
					isPlaceholder ? 'text-soft-white/50' : 'text-soft-white'
				} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
				aria-expanded={isOpen}
				onClick={() => !disabled && setIsOpen(prev => !prev)}
			>
				<span className={`flex-1 truncate ${valueSize} ${isPlaceholder ? 'text-soft-white/55' : 'text-soft-white'} font-normal leading-[1.4]`}>
					{displayLabel}
				</span>
				<ArrowDownIcon
					className={`ml-4 h-[26px] w-[26px] text-soft-white/60 transition-transform duration-150 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>
			{isOpen && options.length > 0 && (
				<ul className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-[10px] border border-[#2F303A] bg-[#1C1D27] py-1 shadow-[0_0_12px_rgba(169,223,216,0.18)]">
					{options.map(option => {
						const isActive = option.value === selectedValue
						return (
							<li key={option.value} className="px-1">
								<button
									type="button"
									className={`flex w-full items-center justify-between rounded-[8px] px-4 py-2 text-left text-[15px] transition ${
										isActive
											? 'bg-accent/20 text-soft-white'
											: 'text-soft-white/80 hover:bg-[#232430] hover:text-soft-white'
									}`}
									onClick={() => {
										onSelect(option.value)
										setIsOpen(false)
									}}
								>
									<span className="truncate">{option.label}</span>
									{isActive && (
										<span className="ml-4 text-[12px] uppercase tracking-[0.18em] text-accent">
											Selected
										</span>
									)}
								</button>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}

function DownloadSection({ disabled = false }: { disabled?: boolean }) {
	return (
		<div className="mt-6 flex flex-col gap-3 text-soft-white">
			<span className="text-[20px] font-semibold leading-[1.2]">Download</span>
			<div className="flex flex-wrap gap-4">
				<DownloadButton accent label="Pdf" disabled={disabled} />
				<DownloadButton label="Excel" disabled={disabled} />
			</div>
			{disabled && (
				<p className="text-sm text-soft-white/50">Select a project and data type to enable downloads</p>
			)}
		</div>
	)
}

function DownloadButton({ label, accent = false, disabled = false }: { label: string; accent?: boolean; disabled?: boolean }) {
	if (accent) {
		return (
			<button
				type="button"
				disabled={disabled}
				className={`h-[47px] min-w-[159px] rounded-[10px] bg-accent px-8 text-center font-display text-[20px] font-bold leading-[30px] text-[#2B2B36] shadow-[0_0_10px_rgba(169,223,216,0.25)] transition hover:shadow-[0_0_12px_rgba(169,223,216,0.4)] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
			>
				{label}
			</button>
		)
	}

	return (
		<button
			type="button"
			disabled={disabled}
			className={`h-[47px] min-w-[159px] rounded-[10px] border border-[#323449] bg-[#10111B] px-8 text-center font-display text-[20px] font-medium leading-[30px] text-soft-white transition hover:border-accent/60 hover:bg-[#181A27] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
		>
			{label}
		</button>
	)
}

function ArrowDownIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M7 10l5 5 5-5" />
		</svg>
	)
}
