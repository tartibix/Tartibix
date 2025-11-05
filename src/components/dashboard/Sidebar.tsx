"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { ComponentType } from 'react'

type IconProps = {
	className?: string
}

type NavItem = {
	label: string
	href: string
	icon: ComponentType<IconProps>
}

const navItems: NavItem[] = [
	{ label: 'Dashboard', href: '/dashboard', icon: GridIcon },
	{ label: 'Projects', href: '/dashboard/projects', icon: FolderIcon },
	{ label: 'Tasks', href: '/dashboard/tasks', icon: ClipboardIcon },
	{ label: 'Time log', href: '/dashboard/time-log', icon: ClockIcon },
	{ label: 'Request page', href: '/dashboard/request-page', icon: RequestIcon },
	{
		label: 'Document management',
		href: '/dashboard/document-management',
		icon: FileIcon,
	},
	{
		label: 'Allocation Scheduler',
		href: '/dashboard/allocation-scheduler',
		icon: CalendarIcon,
	},
	{ label: 'Recources', href: '/dashboard/recources', icon: BookIcon },
	{
		label: 'Custom Report Builder',
		href: '/dashboard/custom-report-builder',
		icon: ReportIcon,
	},
	{ label: 'Admin Panel', href: '/dashboard/admin-panel', icon: UserIcon },
	{
		label: 'Notification & Audit Log',
		href: '/dashboard/notifications',
		icon: BellIcon,
	},
]

export default function Sidebar() {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-night shadow-lg lg:hidden"
				aria-label="Toggle menu"
			>
				<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
					{isOpen ? (
						<path d="M6 18L18 6M6 6l12 12" />
					) : (
						<path d="M4 6h16M4 12h16M4 18h16" />
					)}
				</svg>
			</button>

			{/* Mobile Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside className={`fixed lg:static inset-y-0 left-0 z-40 min-h-screen w-[260px] flex-shrink-0 flex-col border-r border-[#1F2028] bg-night px-6 py-8 text-soft-white transition-transform duration-300 lg:flex ${
				isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
			}`}>
				<Link href="/" className="block" onClick={() => setIsOpen(false)}>
					<Image
						src="/images/tartibix-logo.svg"
						alt="Tartibix logo"
						width={200}
						height={60}
						className="h-auto w-36"
						priority
					/>
				</Link>

				<nav className="mt-10 space-y-2">
					{navItems.map((item) => {
						const isActive = isItemActive(pathname, item.href)
						return (
							<SidebarLink 
								key={item.label} 
								item={item} 
								active={isActive}
								onClick={() => setIsOpen(false)}
							/>
						)
					})}
				</nav>
			</aside>
		</>
	)
}

function SidebarLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
	const Icon = item.icon
	return (
		<Link
			href={item.href}
			prefetch
			onClick={onClick}
			aria-current={active ? 'page' : undefined}
			className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
				active
					? 'bg-accent text-night'
					: 'text-soft-white/85 hover:bg-white/5 hover:text-soft-white'
			}`}
		>
			<Icon className={active ? 'text-night' : 'text-soft-white/70'} />
			<span>{item.label}</span>
		</Link>
	)
}

function isItemActive(pathname: string, href: string) {
	if (href === '/dashboard') {
		return pathname === '/dashboard'
	}
	return pathname.startsWith(href)
}

function GridIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
		>
			<rect x="3" y="3" width="7" height="7" rx="1.5" />
			<rect x="14" y="3" width="7" height="7" rx="1.5" />
			<rect x="14" y="14" width="7" height="7" rx="1.5" />
			<rect x="3" y="14" width="7" height="7" rx="1.5" />
		</svg>
	)
}

function BellIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="M18 16v-5a6 6 0 1 0-12 0v5" />
			<path d="M5 16h14l-1.5 2H6.5L5 16Z" />
			<path d="M9 20a3 3 0 0 0 6 0" />
		</svg>
	)
}

function BookIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="M5 4h7a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z" />
			<path d="M19 4h-4v16a3 3 0 0 1 3-3h1V4Z" />
		</svg>
	)
}

function RequestIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="M5 4h14a2 2 0 0 1 2 2v6H3V6a2 2 0 0 1 2-2Z" />
			<path d="M3 12h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z" />
			<path d="M7 16h5" />
		</svg>
	)
}

function ClipboardIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1Z" />
			<path d="M5 5h2v2h10V5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
			<path d="M9 13h6M9 17h3" />
		</svg>
	)
}

function FolderIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
		</svg>
	)
}

function ReportIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="M12 3v18" />
			<path d="M5 12h14" />
			<path d="M7 5h6" />
			<path d="M7 19h6" />
		</svg>
	)
}

function CalendarIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<rect x="3" y="4" width="18" height="17" rx="2" />
			<path d="M3 10h18" />
			<path d="M8 2v4" />
			<path d="M16 2v4" />
			<path d="M8 15h2" />
			<path d="M12 15h2" />
		</svg>
	)
}

function FileIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<path d="M4 4a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" />
			<path d="M13 2v5h5" />
		</svg>
	)
}

function ClockIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</svg>
	)
}

function UserIcon({ className = '' }: IconProps) {
	return (
		<svg
			className={`h-5 w-5 ${className}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<circle cx="12" cy="7" r="4" />
			<path d="M6 21v-1a6 6 0 0 1 12 0v1" />
		</svg>
	)
}
