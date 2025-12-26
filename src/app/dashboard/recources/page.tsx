'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

interface ResourceSummary {
	employees: {
		total: number
		byDepartment: Record<string, number>
		items: any[]
	}
	equipment: {
		total: number
		available: number
		inUse: number
		maintenance: number
		items: any[]
	}
	materials: {
		total: number
		categories: string[]
		lowStock: number
		items: any[]
	}
	services: {
		total: number
		active: number
		items: any[]
	}
}

const RESOURCE_CARDS = [
	{
		key: 'materials',
		title: 'Material Inventory',
		icon: {
			src: '/images/resources/material-inventory-icon.svg',
			alt: 'Circular material inventory icon',
			width: 66,
			height: 66,
		},
		getStats: (data: ResourceSummary) => ({
			count: data.materials.total,
			subtext: `${data.materials.lowStock} low stock items`,
			color: '#F1D395',
		}),
	},
	{
		key: 'equipment',
		title: 'Equipment Availability',
		icon: {
			src: '/images/resources/equipment-availability-icon.svg',
			alt: 'Construction helmet icon',
			width: 66,
			height: 66,
		},
		getStats: (data: ResourceSummary) => ({
			count: data.equipment.total,
			subtext: `${data.equipment.available} available, ${data.equipment.inUse} in use`,
			color: '#5BA7FF',
		}),
	},
	{
		key: 'employees',
		title: 'Employee Allocation',
		icon: {
			src: '/images/resources/employee-allocation-icon.svg',
			alt: 'Employee allocation icon',
			width: 56,
			height: 56,
		},
		getStats: (data: ResourceSummary) => ({
			count: data.employees.total,
			subtext: `${Object.keys(data.employees.byDepartment).length} departments`,
			color: '#41D37E',
		}),
	},
]

export default function RecourcesPage() {
	const [resources, setResources] = useState<ResourceSummary | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'equipment' | 'materials'>('overview')

	useEffect(() => {
		async function fetchResources() {
			try {
				const response = await fetch('/api/resources')
				if (response.ok) {
					const data = await response.json()
					setResources(data)
				}
			} catch (error) {
				console.error('Error fetching resources:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchResources()
	}, [])

	if (isLoading) {
		return (
			<DashboardShell>
				<div className="space-y-8">
					<TopBar title="Resources" />
					<div className="flex items-center justify-center py-20">
						<div className="text-soft-white/60">Loading resources...</div>
					</div>
				</div>
			</DashboardShell>
		)
	}

	const defaultResources: ResourceSummary = {
		employees: { total: 0, byDepartment: {}, items: [] },
		equipment: { total: 0, available: 0, inUse: 0, maintenance: 0, items: [] },
		materials: { total: 0, categories: [], lowStock: 0, items: [] },
		services: { total: 0, active: 0, items: [] },
	}

	const data = resources || defaultResources

	return (
		<DashboardShell>
			<div className="space-y-8">
				<TopBar title="Resources" />

				{/* Tab Navigation */}
				<div className="flex flex-wrap gap-2">
					{['overview', 'employees', 'equipment', 'materials'].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab as any)}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
								activeTab === tab
									? 'bg-accent text-night'
									: 'bg-[#21222D] text-soft-white/70 hover:text-soft-white border border-[#2F303A]'
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>

				{activeTab === 'overview' && (
					<section
						aria-label="Resource quick links"
						className="rounded-[30px] border border-[#1F2028] bg-[#13141B]/80 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8"
					>
						<div className="space-y-5">
							{RESOURCE_CARDS.map((resource) => {
								const stats = resource.getStats(data)
								return (
									<article
										key={resource.key}
										onClick={() => setActiveTab(resource.key as any)}
										className="flex min-h-[102px] cursor-pointer items-center justify-between gap-6 rounded-[18px] border border-[#1D1E28] bg-[#21222D] px-5 py-5 shadow-[0_0_8px_rgba(169,223,216,0.25)] transition hover:border-[#6DF1E2]/35 hover:shadow-[0_0_12px_rgba(169,223,216,0.35)] sm:px-8"
									>
										<div className="flex items-center gap-6">
											<div className="grid size-[72px] place-items-center">
												<Image 
													src={resource.icon.src} 
													alt={resource.icon.alt} 
													width={resource.icon.width} 
													height={resource.icon.height} 
													className="h-auto w-auto" 
												/>
											</div>
											<div>
												<p className="font-display text-xl text-[#FFF9F7]">{resource.title}</p>
												<p className="text-sm text-muted-foreground/70">{stats.subtext}</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-3xl font-bold" style={{ color: stats.color }}>{stats.count}</p>
											<p className="text-xs text-muted-foreground/70">Total</p>
										</div>
									</article>
								)
							})}
						</div>
					</section>
				)}

				{activeTab === 'employees' && (
					<section className="rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6">
						<h2 className="mb-4 text-xl font-semibold text-soft-white">Employee Allocation</h2>
						{data.employees.items.length === 0 ? (
							<p className="text-center py-8 text-muted-foreground/70">No employees found. Add employees to your projects.</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-white/10 text-left text-sm text-[#7D7E84]">
											<th className="pb-3 font-medium">Name</th>
											<th className="pb-3 font-medium">Role</th>
											<th className="pb-3 font-medium">Department</th>
											<th className="pb-3 font-medium">Status</th>
										</tr>
									</thead>
									<tbody>
										{data.employees.items.map((emp, idx) => (
											<tr key={emp.id || idx} className="border-b border-white/5">
												<td className="py-3 text-soft-white">{emp.name}</td>
												<td className="py-3 text-muted-foreground/70">{emp.role || emp.position || '-'}</td>
												<td className="py-3 text-muted-foreground/70">{emp.department || '-'}</td>
												<td className="py-3">
													<span className={`rounded-full px-2 py-1 text-xs ${
														emp.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
													}`}>
														{emp.status || 'Active'}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</section>
				)}

				{activeTab === 'equipment' && (
					<section className="rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6">
						<h2 className="mb-4 text-xl font-semibold text-soft-white">Equipment Availability</h2>
						{/* Stats */}
						<div className="mb-6 grid grid-cols-3 gap-4">
							<div className="rounded-lg bg-[#1B1C24] p-4 text-center">
								<p className="text-2xl font-bold text-[#41D37E]">{data.equipment.available}</p>
								<p className="text-xs text-muted-foreground/70">Available</p>
							</div>
							<div className="rounded-lg bg-[#1B1C24] p-4 text-center">
								<p className="text-2xl font-bold text-[#5BA7FF]">{data.equipment.inUse}</p>
								<p className="text-xs text-muted-foreground/70">In Use</p>
							</div>
							<div className="rounded-lg bg-[#1B1C24] p-4 text-center">
								<p className="text-2xl font-bold text-[#F1D395]">{data.equipment.maintenance}</p>
								<p className="text-xs text-muted-foreground/70">Maintenance</p>
							</div>
						</div>
						{data.equipment.items.length === 0 ? (
							<p className="text-center py-8 text-muted-foreground/70">No equipment found. Add equipment to your projects.</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-white/10 text-left text-sm text-[#7D7E84]">
											<th className="pb-3 font-medium">Name</th>
											<th className="pb-3 font-medium">Type</th>
											<th className="pb-3 font-medium">Status</th>
											<th className="pb-3 font-medium">Quantity</th>
										</tr>
									</thead>
									<tbody>
										{data.equipment.items.map((eq, idx) => (
											<tr key={eq.id || idx} className="border-b border-white/5">
												<td className="py-3 text-soft-white">{eq.name}</td>
												<td className="py-3 text-muted-foreground/70">{eq.type || '-'}</td>
												<td className="py-3">
													<span className={`rounded-full px-2 py-1 text-xs ${
														eq.status === 'Available' ? 'bg-green-500/20 text-green-400' :
														eq.status === 'In Use' ? 'bg-blue-500/20 text-blue-400' :
														'bg-yellow-500/20 text-yellow-400'
													}`}>
														{eq.status || 'Available'}
													</span>
												</td>
												<td className="py-3 text-muted-foreground/70">{eq.quantity || 1}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</section>
				)}

				{activeTab === 'materials' && (
					<section className="rounded-[20px] border border-[#2F303A] bg-[#21222D] p-6">
						<h2 className="mb-4 text-xl font-semibold text-soft-white">Material Inventory</h2>
						{/* Categories */}
						{data.materials.categories.length > 0 && (
							<div className="mb-4 flex flex-wrap gap-2">
								{data.materials.categories.map((cat) => (
									<span key={cat} className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">
										{cat}
									</span>
								))}
							</div>
						)}
						{data.materials.items.length === 0 ? (
							<p className="text-center py-8 text-muted-foreground/70">No materials found. Add materials to your projects.</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-white/10 text-left text-sm text-[#7D7E84]">
											<th className="pb-3 font-medium">Name</th>
											<th className="pb-3 font-medium">Category</th>
											<th className="pb-3 font-medium">Quantity</th>
											<th className="pb-3 font-medium">Unit</th>
										</tr>
									</thead>
									<tbody>
										{data.materials.items.map((mat, idx) => (
											<tr key={mat.id || idx} className="border-b border-white/5">
												<td className="py-3 text-soft-white">{mat.name}</td>
												<td className="py-3 text-muted-foreground/70">{mat.category || '-'}</td>
												<td className="py-3 text-muted-foreground/70">{mat.quantity || 0}</td>
												<td className="py-3 text-muted-foreground/70">{mat.unit || '-'}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</section>
				)}
			</div>
		</DashboardShell>
	)
}
