"use client"

import { useState, useEffect } from 'react'

import DashboardShell from '@/components/dashboard/DashboardShell'

type AdminUser = {
	id: string
	name: string
	email: string
	role: string
	department?: string
	status?: string
	createdAt?: string
}

type AdminRole = {
	id: string
	name: string
	members: number
	description: string
	permissions: string[]
}

const PERMISSION_GROUPS = ['Projects', 'Tasks', 'Documents', 'Billing', 'Resources', 'Reports', 'People']

export default function AdminPanelPage() {
	const [activeTab, setActiveTab] = useState<'users' | 'roles'>('roles')
	const [users, setUsers] = useState<AdminUser[]>([])
	const [roles, setRoles] = useState<AdminRole[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [showAddUserModal, setShowAddUserModal] = useState(false)
	const [showAddRoleModal, setShowAddRoleModal] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	// Fetch data from API
	useEffect(() => {
		async function fetchData() {
			setIsLoading(true)
			try {
				const [usersRes, rolesRes] = await Promise.all([
					fetch('/api/users'),
					fetch('/api/users?type=roles')
				])
				
				if (usersRes.ok) {
					const usersData = await usersRes.json()
					setUsers(usersData.users || [])
				}
				
				if (rolesRes.ok) {
					const rolesData = await rolesRes.json()
					setRoles(rolesData.roles || [])
				}
			} catch (error) {
				console.error('Error fetching admin data:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	// Filter users based on search
	const filteredUsers = users.filter(user => 
		user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		user.email.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const filteredRoles = roles.filter(role =>
		role.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<DashboardShell>
			<div className="space-y-8">
				<header className="flex items-center justify-between">
					<div>
						<p className="font-display text-[32px] font-medium text-soft-white">Admin Panel</p>
						<p className="text-sm text-soft-white/60">
							{users.length} users • {roles.length} roles
						</p>
					</div>
				</header>

				<section className="rounded-[20px] border border-[#2F303A] bg-surface p-4 shadow-[0_0_10px_rgba(169,223,216,0.12)] sm:p-6">
					<AdminPanelControls 
						activeTab={activeTab} 
						setActiveTab={setActiveTab}
						onAddUser={() => setShowAddUserModal(true)}
						onAddRole={() => setShowAddRoleModal(true)}
					/>
					
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
						</div>
					) : activeTab === 'users' ? (
						<UserTable 
							users={filteredUsers} 
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							roles={roles}
						/>
					) : (
						<RolesPanel 
							roles={filteredRoles}
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							permissionGroups={PERMISSION_GROUPS}
						/>
					)}
				</section>

				{/* Add User Modal */}
				{showAddUserModal && (
					<AddUserModal 
						roles={roles}
						onClose={() => setShowAddUserModal(false)}
						onSave={async (userData) => {
							try {
								const res = await fetch('/api/users', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(userData)
								})
								if (res.ok) {
									const newUser = await res.json()
									setUsers(prev => [...prev, newUser])
									setShowAddUserModal(false)
								}
							} catch (error) {
								console.error('Error adding user:', error)
							}
						}}
					/>
				)}

				{/* Add Role Modal */}
				{showAddRoleModal && (
					<AddRoleModal
						permissionGroups={PERMISSION_GROUPS}
						onClose={() => setShowAddRoleModal(false)}
						onSave={async (roleData) => {
							try {
								const res = await fetch('/api/users?type=roles', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(roleData)
								})
								if (res.ok) {
									const newRole = await res.json()
									setRoles(prev => [...prev, newRole])
									setShowAddRoleModal(false)
								}
							} catch (error) {
								console.error('Error adding role:', error)
							}
						}}
					/>
				)}
			</div>
		</DashboardShell>
	)
}

function AdminPanelControls({
	activeTab,
	setActiveTab,
	onAddUser,
	onAddRole,
}: {
	activeTab: 'users' | 'roles'
	setActiveTab: (tab: 'users' | 'roles') => void
	onAddUser: () => void
	onAddRole: () => void
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
				onClick={activeTab === 'users' ? onAddUser : onAddRole}
				className="w-full rounded-[12px] bg-accent px-6 py-2 text-center text-base font-semibold text-night shadow-[0_4px_20px_rgba(169,223,216,0.25)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:w-auto"
			>
				{activeTab === 'users' ? 'Add User' : 'Add Role'}
			</button>
		</div>
	)
}


type SearchInputProps = {
	placeholder?: string
	value?: string
	onChange?: (value: string) => void
}

function UserTable({ 
	users, 
	searchQuery, 
	onSearchChange,
	roles
}: { 
	users: AdminUser[]
	searchQuery: string
	onSearchChange: (query: string) => void
	roles: AdminRole[]
}) {
	return (
		<div className="mt-6 space-y-5">
			<SearchInput 
				placeholder="Search users" 
				value={searchQuery}
				onChange={onSearchChange}
			/>
			<div className="rounded-[15px] border border-[#3D3F4F] bg-[#1B1C24] px-6 py-4 text-sm font-semibold text-soft-white shadow-[inset_0_0_6px_rgba(169,223,216,0.05)]">
				<div className="grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.6fr)]">
					<span>Name</span>
					<span>Email</span>
					<span className="sm:text-right">Role</span>
				</div>
			</div>
			{users.length === 0 ? (
				<div className="rounded-[12px] border border-dashed border-[#2F303A] bg-[#1A1B24] px-5 py-8 text-center">
					<p className="text-soft-white/60">No users found</p>
					<p className="text-sm text-soft-white/40 mt-1">Add users to get started</p>
				</div>
			) : (
				<ul className="space-y-3">
					{users.map((user) => (
						<li key={user.id || `${user.name}-${user.email}`}>
							<UserRow user={user} />
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

function SearchInput({ placeholder = 'Search', value = '', onChange }: SearchInputProps) {
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
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
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

function RolesPanel({
	roles,
	searchQuery,
	onSearchChange,
	permissionGroups
}: {
	roles: AdminRole[]
	searchQuery: string
	onSearchChange: (query: string) => void
	permissionGroups: string[]
}) {
	const lastPermissionIndex = permissionGroups.length - 1

	return (
		<div className="mt-6 space-y-5">
			<SearchInput 
				placeholder="Search roles" 
				value={searchQuery}
				onChange={onSearchChange}
			/>
			<div className="rounded-[15px] border border-[#3D3F4F] bg-[#1B1C24] px-6 py-4 text-sm font-semibold text-soft-white shadow-[inset_0_0_6px_rgba(169,223,216,0.05)]">
				<div className="grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.6fr)_minmax(0,1.2fr)]">
					<span>Role</span>
					<span className="sm:text-center">Members</span>
					<span className="sm:text-right">Permissions</span>
				</div>
			</div>
			{roles.length === 0 ? (
				<div className="rounded-[12px] border border-dashed border-[#2F303A] bg-[#1A1B24] px-5 py-8 text-center">
					<p className="text-soft-white/60">No roles found</p>
					<p className="text-sm text-soft-white/40 mt-1">Add roles to organize permissions</p>
				</div>
			) : (
				<ul className="space-y-3">
					{roles.map((role) => (
						<li key={role.id || role.name}>
							<RoleRow role={role} />
						</li>
					))}
				</ul>
			)}

			{roles.length > 0 && (
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
									<tr key={`${role.id || role.name}-permissions`}>
										<td className="rounded-l-[12px] border border-[#2F303A] bg-[#1A1B24] px-4 py-3 text-soft-white font-semibold">
											{role.name}
										</td>
										{permissionGroups.map((permission, index) => (
											<td
												key={`${role.id || role.name}-${permission}`}
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
			)}
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

// Add User Modal
function AddUserModal({
	roles,
	onClose,
	onSave,
}: {
	roles: AdminRole[]
	onClose: () => void
	onSave: (userData: { name: string; email: string; role: string; department?: string }) => void
}) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [role, setRole] = useState('')
	const [department, setDepartment] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (name && email && role) {
			onSave({ name, email, role, department })
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-[20px] border border-[#2F303A] bg-surface p-6 shadow-xl">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-soft-white">Add New User</h2>
					<button
						onClick={onClose}
						className="rounded-full p-2 text-soft-white/70 hover:text-soft-white hover:bg-white/10"
					>
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-soft-white mb-2">Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-[10px] border border-[#2F303A] bg-night px-4 py-3 text-soft-white placeholder:text-soft-white/50 focus:outline-none focus:border-accent"
							placeholder="Enter full name"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-soft-white mb-2">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-[10px] border border-[#2F303A] bg-night px-4 py-3 text-soft-white placeholder:text-soft-white/50 focus:outline-none focus:border-accent"
							placeholder="Enter email address"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-soft-white mb-2">Role</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full rounded-[10px] border border-[#2F303A] bg-night px-4 py-3 text-soft-white focus:outline-none focus:border-accent"
							required
						>
							<option value="">Select a role</option>
							{roles.map((r) => (
								<option key={r.id || r.name} value={r.name}>{r.name}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-soft-white mb-2">Department (Optional)</label>
						<input
							type="text"
							value={department}
							onChange={(e) => setDepartment(e.target.value)}
							className="w-full rounded-[10px] border border-[#2F303A] bg-night px-4 py-3 text-soft-white placeholder:text-soft-white/50 focus:outline-none focus:border-accent"
							placeholder="Enter department"
						/>
					</div>
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-[10px] border border-[#2F303A] px-4 py-3 text-soft-white hover:border-accent/60"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 rounded-[10px] bg-accent px-4 py-3 font-semibold text-night hover:opacity-90"
						>
							Add User
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

// Add Role Modal
function AddRoleModal({
	permissionGroups,
	onClose,
	onSave,
}: {
	permissionGroups: string[]
	onClose: () => void
	onSave: (roleData: { name: string; description: string; permissions: string[] }) => void
}) {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

	const togglePermission = (permission: string) => {
		setSelectedPermissions(prev =>
			prev.includes(permission)
				? prev.filter(p => p !== permission)
				: [...prev, permission]
		)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (name && description) {
			onSave({ name, description, permissions: selectedPermissions })
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-[20px] border border-[#2F303A] bg-surface p-6 shadow-xl">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-soft-white">Add New Role</h2>
					<button
						onClick={onClose}
						className="rounded-full p-2 text-soft-white/70 hover:text-soft-white hover:bg-white/10"
					>
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-soft-white mb-2">Role Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-[10px] border border-[#2F303A] bg-night px-4 py-3 text-soft-white placeholder:text-soft-white/50 focus:outline-none focus:border-accent"
							placeholder="e.g., Project Manager"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-soft-white mb-2">Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full rounded-[10px] border border-[#2F303A] bg-night px-4 py-3 text-soft-white placeholder:text-soft-white/50 focus:outline-none focus:border-accent resize-none"
							placeholder="Describe the role's responsibilities"
							rows={3}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-soft-white mb-2">Permissions</label>
						<div className="flex flex-wrap gap-2">
							{permissionGroups.map((permission) => (
								<button
									key={permission}
									type="button"
									onClick={() => togglePermission(permission)}
									className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
										selectedPermissions.includes(permission)
											? 'bg-accent text-night'
											: 'border border-[#2F303A] text-soft-white/70 hover:border-accent/60'
									}`}
								>
									{permission}
								</button>
							))}
						</div>
					</div>
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-[10px] border border-[#2F303A] px-4 py-3 text-soft-white hover:border-accent/60"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 rounded-[10px] bg-accent px-4 py-3 font-semibold text-night hover:opacity-90"
						>
							Add Role
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
