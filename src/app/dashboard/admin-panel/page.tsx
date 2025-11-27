"use client"

import { useState } from 'react'

import DashboardShell from '@/components/dashboard/DashboardShell'

type AdminUser = {
	name: string
	email: string
	role: 'Admin' | 'Editor' | 'Viewer'
}

type AdminRole = {
	name: string
	members: number
	description: string
	permissions: string[]
}

const users: AdminUser[] = [
	{ name: 'John Doe', email: 'John@example.com', role: 'Admin' },
	{ name: 'Jane Smith', email: 'Jane@example.com', role: 'Editor' },
	{ name: 'Tom Johnson', email: 'Tom@example.com', role: 'Viewer' },
	{ name: 'Emily Davis', email: 'Emily@example.com', role: 'Editor' },
	{ name: 'Tom Johnson', email: 'Tom@example.com', role: 'Viewer' },
	{ name: 'Emily Davis', email: 'Emily@example.com', role: 'Editor' },
]

const roles: AdminRole[] = [
	{
		name: 'Administrator',
		members: 4,
		description: 'Full access to all workspace settings and billing.',
		permissions: ['Projects', 'Tasks', 'Documents', 'Billing', 'People'],
	},
	{
		name: 'Project Manager',
		members: 9,
		description: 'Manage projects, tasks, resources, and reports.',
		permissions: ['Projects', 'Tasks', 'Resources', 'Reports'],
	},
	{
		name: 'Editor',
		members: 14,
		description: 'Update documents and monitor project progress.',
		permissions: ['Projects', 'Documents', 'Reports'],
	},
	{
		name: 'Viewer',
		members: 21,
		description: 'Read-only access to dashboards and reports.',
		permissions: ['Dashboards', 'Reports'],
	},
]

const permissionGroups = ['Projects', 'Tasks', 'Documents', 'Billing', 'Resources', 'Reports', 'People']

export default function AdminPanelPage() {
	const [activeTab, setActiveTab] = useState<'users' | 'roles'>('roles')

	return (
		<DashboardShell>
			<div className="space-y-8">
				<header>
					<p className="font-display text-[32px] font-medium text-soft-white">Admin Panel</p>
				</header>

				<section className="rounded-[20px] border border-[#2F303A] bg-surface p-4 shadow-[0_0_10px_rgba(169,223,216,0.12)] sm:p-6">
					<AdminPanelControls activeTab={activeTab} setActiveTab={setActiveTab} />
					{activeTab === 'users' ? <UserTable /> : <RolesPanel />}
				</section>
			</div>
		</DashboardShell>
	)
}

function AdminPanelControls({
	activeTab,
	setActiveTab,
}: {
	activeTab: 'users' | 'roles'
	setActiveTab: (tab: 'users' | 'roles') => void
}) {
	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex flex-wrap gap-3 rounded-[14px] border border-[#323449] bg-night/80 p-1">
				<button
					type="button"
					onClick={() => setActiveTab('users')}
					className={`rounded-[12px] px-6 py-2 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
						activeTab === 'users'
							? 'bg-accent text-night shadow-[0_4px_15px_rgba(169,223,216,0.25)]'
							: 'text-soft-white/70 hover:text-soft-white'
					}`}
				>
					Users
				</button>
				<button
					type="button"
					onClick={() => setActiveTab('roles')}
					className={`rounded-[12px] px-6 py-2 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
						activeTab === 'roles'
							? 'bg-accent text-night shadow-[0_4px_15px_rgba(169,223,216,0.25)]'
							: 'text-soft-white/70 hover:text-soft-white'
					}`}
				>
					Roles
				</button>
			</div>

			<button
				type="button"
				className="w-full rounded-[12px] bg-accent px-6 py-2 text-center text-base font-semibold text-night shadow-[0_4px_20px_rgba(169,223,216,0.25)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:w-auto"
			>
				Add User
			</button>
		</div>
	)
}


type SearchInputProps = {
	placeholder?: string
}

function UserTable() {
	return (
		<div className="mt-6 space-y-5">
			<SearchInput />
			<div className="rounded-[15px] border border-[#3D3F4F] bg-[#1B1C24] px-6 py-4 text-sm font-semibold text-soft-white shadow-[inset_0_0_6px_rgba(169,223,216,0.05)]">
				<div className="grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.6fr)]">
					<span>Name</span>
					<span>Email</span>
					<span className="sm:text-right">Role</span>
				</div>
			</div>
			<ul className="space-y-3">
				{users.map((user) => (
					<li key={`${user.name}-${user.email}`}>
						<UserRow user={user} />
					</li>
				))}
			</ul>
		</div>
	)
}

function SearchInput({ placeholder = 'Search' }: SearchInputProps = {}) {
	return (
		<label className="flex items-center gap-3 rounded-[14px] border border-[#2F303A] bg-night px-4 py-3 text-sm text-soft-white/70 shadow-[0_0_8px_rgba(0,0,0,0.25)]">
			<svg
				className="h-5 w-5 text-soft-white"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
			>
				<circle cx="11" cy="11" r="6" />
				<path d="m20 20-4.35-4.35" />
			</svg>
			<input
				type="search"
				name="search"
				placeholder={placeholder}
				className="w-full bg-transparent text-sm text-soft-white placeholder:text-soft-white/60 focus:outline-none"
			/>
		</label>
	)
}

function UserRow({ user }: { user: AdminUser }) {
	return (
		<div className="grid gap-4 rounded-[12px] border border-[#2F303A] bg-[#1A1B24] px-5 py-4 text-sm text-soft-white shadow-[0_0_8px_rgba(0,0,0,0.25)] transition hover:border-accent/40 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.6fr)]">
			<span className="text-base font-medium text-soft-white">{user.name}</span>
			<span className="text-soft-white/80">{user.email}</span>
			<div className="flex items-center justify-between gap-3 sm:justify-end">
				<span className="text-soft-white/90">{user.role}</span>
				<button
					aria-label={`Open actions for ${user.name}`}
					type="button"
					className="rounded-full p-2 text-soft-white/70 transition hover:text-soft-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
				>
					<EllipsisIcon />
				</button>
			</div>
		</div>
	)
}

function EllipsisIcon() {
	return (
		<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
			<circle cx="5" cy="12" r="1.5" />
			<circle cx="12" cy="12" r="1.5" />
			<circle cx="19" cy="12" r="1.5" />
		</svg>
	)
}

function RolesPanel() {
	const lastPermissionIndex = permissionGroups.length - 1

	return (
		<div className="mt-6 space-y-5">
			<SearchInput placeholder="Search roles" />
			<div className="rounded-[15px] border border-[#3D3F4F] bg-[#1B1C24] px-6 py-4 text-sm font-semibold text-soft-white shadow-[inset_0_0_6px_rgba(169,223,216,0.05)]">
				<div className="grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.6fr)_minmax(0,1.2fr)]">
					<span>Role</span>
					<span className="sm:text-center">Members</span>
					<span className="sm:text-right">Permissions</span>
				</div>
			</div>
			<ul className="space-y-3">
				{roles.map((role) => (
					<li key={role.name}>
						<RoleRow role={role} />
					</li>
				))}
			</ul>

			<div className="space-y-5 rounded-[15px] border border-[#3D3F4F] bg-[#1B1C24] p-6 shadow-[inset_0_0_6px_rgba(169,223,216,0.05)]">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-lg font-semibold text-soft-white">Permission matrix</p>
						<p className="text-sm text-soft-white/70">Control which modules every role can access.</p>
					</div>
					<button
						type="button"
						className="rounded-[10px] border border-[#2F303A] bg-[#1A1B24] px-4 py-2 text-sm font-semibold text-soft-white transition hover:border-accent/60"
					>
						Edit Policies
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-[720px] border-separate border-spacing-y-3 border-spacing-x-0 text-left text-sm text-soft-white/80">
						<thead>
							<tr>
								<th className="rounded-l-[12px] bg-[#1B1C24] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-soft-white/60">
									Role
								</th>
								{permissionGroups.map((permission, index) => (
									<th
										key={permission}
										className={`bg-[#1B1C24] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-soft-white/60 ${
											index === lastPermissionIndex ? 'rounded-r-[12px]' : ''
										}`}
									>
										{permission}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{roles.map((role) => (
								<tr key={`${role.name}-permissions`}>
									<td className="rounded-l-[12px] border border-[#2F303A] bg-[#1A1B24] px-4 py-3 text-soft-white font-semibold">
										{role.name}
									</td>
									{permissionGroups.map((permission, index) => (
										<td
											key={`${role.name}-${permission}`}
											className={`border border-[#2F303A] bg-[#1A1B24] px-4 py-3 text-center ${
												index === lastPermissionIndex ? 'rounded-r-[12px]' : ''
											}`}
										>
											<PermissionIndicator enabled={role.permissions.includes(permission)} />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

function RoleRow({ role }: { role: AdminRole }) {
	return (
		<div className="grid gap-4 rounded-[12px] border border-[#2F303A] bg-[#1A1B24] px-5 py-4 text-soft-white shadow-[0_0_8px_rgba(0,0,0,0.25)] sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.6fr)_minmax(0,1.2fr)]">
			<div>
				<p className="text-base font-semibold text-soft-white">{role.name}</p>
				<p className="text-sm text-soft-white/70">{role.description}</p>
			</div>
			<div className="flex items-center sm:justify-center">
				<span className="rounded-full border border-[#2F303A] bg-night px-3 py-1 text-xs font-semibold text-soft-white/80">
					{role.members} members
				</span>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
				<div className="flex flex-wrap gap-2">
					{role.permissions.map((permission) => (
						<span key={`${role.name}-${permission}`} className="rounded-full border border-[#323449] bg-night/80 px-3 py-1 text-xs text-soft-white/80">
							{permission}
						</span>
					))}
				</div>
				<button
					aria-label={`Open actions for ${role.name}`}
					type="button"
					className="rounded-full p-2 text-soft-white/70 transition hover:text-soft-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
				>
					<EllipsisIcon />
				</button>
			</div>
		</div>
	)
}

function PermissionIndicator({ enabled }: { enabled: boolean }) {
	return (
		<span
			className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
				enabled
					? 'border-accent/70 bg-accent/10 text-accent'
					: 'border-[#2F303A] text-soft-white/40'
			}`}
		>
			{enabled ? 'On' : 'Off'}
		</span>
	)
}
