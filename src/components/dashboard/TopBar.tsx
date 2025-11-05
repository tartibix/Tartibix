import type { ReactNode } from 'react'

type IconProps = {
	className?: string
}

type TopBarProps = {
	title?: string
	subtitle?: string
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
				<IconButton label="Notifications">
					<BellIcon className="text-soft-white" />
					<span className="absolute right-1.5 top-1.5 block h-1.5 w-1.5 rounded-full bg-[#FC003C]" />
				</IconButton>
				<ProfileBubble />
			</div>
		</header>
	)
}

function SearchInput() {
	return (
		<div className="hidden min-w-[300px] lg:min-w-[556px] items-center gap-3 rounded-[10px] border border-[#2F303A] bg-[#21222D] px-3.5 py-2.5 shadow-[0_0_5px_rgba(169,223,216,0.15)] md:flex">
			<SearchIcon className="h-6 w-6 text-soft-white" />
			<input
				type="search"
				placeholder="Search"
				className="w-full bg-transparent text-sm text-soft-white placeholder:text-muted-foreground/80 focus:outline-none"
			/>
		</div>
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
	return (
		<div className="flex items-center gap-2 rounded-[10px] border border-[#2F303A] bg-[#21222D] px-2 py-1 pl-1 pr-3 shadow-[0_0_5px_rgba(169,223,216,0.15)]">
			<div className="grid h-[29px] w-[29px] place-items-center overflow-hidden rounded-full bg-gradient-to-br from-accent/30 to-accent/20 text-xs font-semibold text-soft-white">
				<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
				</svg>
			</div>
			<ChevronDownIcon className="h-3 w-3 text-muted-foreground" />
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
