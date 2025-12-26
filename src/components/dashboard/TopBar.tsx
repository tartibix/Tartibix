'use client'

import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type IconProps = {
	className?: string
}

type TopBarProps = {
	title?: string
	subtitle?: string
}

type SearchResult = {
	type: 'project' | 'task' | 'document'
	id: string
	name: string
	link: string
}

export default function TopBar({
	title = 'Overview',
	subtitle,
}: TopBarProps) {
	return (
		<header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<h1 className="font-display text-2xl sm:text-[32px] font-medium leading-[1.5em] text-soft-white">{title}</h1>
				{subtitle && <p className="mt-1 text-sm text-muted-foreground/70">{subtitle}</p>}
			</div>

			<div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:flex-nowrap">
				<SearchInput />
				<NotificationButton />
				<ProfileBubble />
			</div>
		</header>
	)
}

function SearchInput() {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchResult[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// Search when query changes
	useEffect(() => {
		if (query.length < 2) {
			setResults([])
			return
		}

		const searchTimeout = setTimeout(async () => {
			setIsLoading(true)
			try {
				// Search projects
				const projectsRes = await fetch('/api/projects')
				const projects = projectsRes.ok ? await projectsRes.json() : []
				
				const matchingProjects = (Array.isArray(projects) ? projects : [])
					.filter((p: any) => 
						p.projectName?.toLowerCase().includes(query.toLowerCase()) ||
						p.projectId?.toLowerCase().includes(query.toLowerCase())
					)
					.slice(0, 5)
					.map((p: any) => ({
						type: 'project' as const,
						id: p.projectId,
						name: p.projectName,
						link: `/dashboard/projects/${p.projectId}`,
					}))

				// Get tasks from projects
				const matchingTasks = (Array.isArray(projects) ? projects : [])
					.flatMap((p: any) => 
						(p.executionPlan || []).map((t: any) => ({
							...t,
							projectId: p.projectId,
							projectName: p.projectName,
						}))
					)
					.filter((t: any) => t.taskName?.toLowerCase().includes(query.toLowerCase()))
					.slice(0, 3)
					.map((t: any) => ({
						type: 'task' as const,
						id: t.taskId || t.taskName,
						name: `${t.taskName} (${t.projectName})`,
						link: `/dashboard/projects/${t.projectId}`,
					}))

				setResults([...matchingProjects, ...matchingTasks])
			} catch (error) {
				console.error('Search error:', error)
			} finally {
				setIsLoading(false)
			}
		}, 300)

		return () => clearTimeout(searchTimeout)
	}, [query])

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div ref={containerRef} className="relative hidden md:block">
			<div className="min-w-[300px] lg:min-w-[556px] flex items-center gap-3 rounded-[10px] border border-[#2F303A] bg-[#21222D] px-3.5 py-2.5 shadow-[0_0_5px_rgba(169,223,216,0.15)]">
				<SearchIcon className="h-6 w-6 text-soft-white" />
				<input
					type="search"
					placeholder="Search projects, tasks..."
					value={query}
					onChange={(e) => {
						setQuery(e.target.value)
						setIsOpen(true)
					}}
					onFocus={() => setIsOpen(true)}
					className="w-full bg-transparent text-sm text-soft-white placeholder:text-muted-foreground/80 focus:outline-none"
				/>
				{isLoading && (
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
				)}
			</div>
			
			{/* Search Results Dropdown */}
			{isOpen && query.length >= 2 && (
				<div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-[#2F303A] bg-[#21222D] shadow-lg">
					{results.length === 0 && !isLoading ? (
						<p className="px-4 py-3 text-sm text-soft-white/60">No results found</p>
					) : (
						<ul>
							{results.map((result) => (
								<li key={`${result.type}-${result.id}`}>
									<Link
										href={result.link}
										onClick={() => {
											setIsOpen(false)
											setQuery('')
										}}
										className="flex items-center gap-3 px-4 py-3 text-sm text-soft-white hover:bg-accent/10 transition"
									>
										<span className={`text-xs uppercase px-2 py-0.5 rounded ${
											result.type === 'project' ? 'bg-accent/20 text-accent' : 'bg-[#FFE48C]/20 text-[#FFE48C]'
										}`}>
											{result.type}
										</span>
										<span className="truncate">{result.name}</span>
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	)
}

function NotificationButton() {
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		async function fetchNotifications() {
			try {
				const res = await fetch('/api/notifications')
				if (res.ok) {
					const data = await res.json()
					setUnreadCount(data.unreadCount || 0)
				}
			} catch (error) {
				console.error('Error fetching notifications:', error)
			}
		}
		fetchNotifications()
	}, [])

	return (
		<Link href="/dashboard/notifications">
			<IconButton label="Notifications">
				<BellIcon className="text-soft-white" />
				{unreadCount > 0 && (
					<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FC003C] text-[10px] font-bold text-white">
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				)}
			</IconButton>
		</Link>
	)
}

function IconButton({
	children,
	label,
	className = '',
}: {
	children: ReactNode
	label: string
	className?: string
}) {
	return (
		<button
			type="button"
			aria-label={label}
			className={`relative grid h-[29px] w-[29px] place-items-center rounded-[10px] border border-[#2F303A] bg-[#21222D] shadow-[0_0_5px_rgba(169,223,216,0.15)] transition hover:border-accent hover:bg-accent/10 ${className}`}
		>
			{children}
		</button>
	)
}

function ProfileBubble() {
	const [isOpen, setIsOpen] = useState(false)
	const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch('/api/users')
				if (res.ok) {
					const data = await res.json()
					// Get first user as current user (in real app, this would be the logged in user)
					if (data.users && data.users.length > 0) {
						setUser(data.users[0])
					}
				}
			} catch (error) {
				console.error('Error fetching user:', error)
			}
		}
		fetchUser()
	}, [])

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const initials = user?.name
		?.split(' ')
		.map(n => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2) || 'U'

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-[10px] border border-[#2F303A] bg-[#21222D] px-2 py-1 pl-1 pr-3 shadow-[0_0_5px_rgba(169,223,216,0.15)] transition hover:border-accent"
			>
				<div className="grid h-[29px] w-[29px] place-items-center overflow-hidden rounded-full bg-gradient-to-br from-accent/30 to-accent/20 text-xs font-semibold text-soft-white">
					{user ? initials : (
						<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
						</svg>
					)}
				</div>
				<ChevronDownIcon className={`h-3 w-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			
			{isOpen && (
				<div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-[#2F303A] bg-[#21222D] py-2 shadow-lg">
					{user && (
						<div className="border-b border-[#2F303A] px-4 pb-3 pt-1">
							<p className="font-semibold text-soft-white">{user.name}</p>
							<p className="text-xs text-soft-white/60">{user.email}</p>
							<p className="mt-1 text-xs text-accent">{user.role}</p>
						</div>
					)}
					<nav className="py-1">
						<Link 
							href="/dashboard/admin-panel" 
							onClick={() => setIsOpen(false)}
							className="block px-4 py-2 text-sm text-soft-white hover:bg-accent/10 transition"
						>
							Settings
						</Link>
						<Link 
							href="/dashboard/notifications" 
							onClick={() => setIsOpen(false)}
							className="block px-4 py-2 text-sm text-soft-white hover:bg-accent/10 transition"
						>
							Notifications
						</Link>
						<button 
							type="button"
							onClick={() => {
								setIsOpen(false)
								// In a real app, this would trigger logout
								alert('Logout functionality would be implemented with authentication')
							}}
							className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
						>
							Sign Out
						</button>
					</nav>
				</div>
			)}
		</div>
	)
}

function SearchIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<circle cx="10" cy="10" r="6" />
			<path d="m20 20-6-6" />
		</svg>
	)
}

function BellIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-[17px] w-[15px] ${className}`}
			viewBox="0 0 15 17"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<path d="M13 10.5V7a6 6 0 0 0-12 0v3.5" />
			<path d="M1 10.5h13l-1 2H2l-1-2Z" />
		</svg>
	)
}

function ChevronDownIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="m4 6 4 4 4-4" />
		</svg>
	)
}
