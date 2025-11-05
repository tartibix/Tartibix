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
	subtitle = 'Track your workspace at a glance',
}: TopBarProps) {
	return (
		<header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<h1 className="font-display text-3xl font-medium text-soft-white">{title}</h1>
				<p className="mt-1 text-sm text-muted-foreground/80">{subtitle}</p>
			</div>

			<div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
				<SearchInput />
				<MyDayToggle />
				<IconButton label="Notifications">
					<BellIcon className="text-soft-white" />
					<span className="absolute right-2 top-2 block h-2 w-2 rounded-full bg-[#FC003C]" />
				</IconButton>
				<ProfileBubble />
			</div>
		</header>
	)
}

function SearchInput() {
	return (
		<div className="hidden min-w-[260px] items-center gap-3 rounded-2xl border border-[#2F303A] bg-surface px-4 py-2 shadow-inset md:flex">
			<SearchIcon className="h-5 w-5 text-muted-foreground" />
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
			className={`relative grid h-11 w-11 place-items-center rounded-xl border border-[#2F303A] bg-surface transition hover:border-accent hover:bg-accent/10 ${className}`}
		>
			{children}
		</button>
	)
}

function MyDayToggle() {
	return (
		<button
			type="button"
			aria-pressed="true"
			className="flex items-center gap-3 rounded-full border border-[#2F303A] bg-surface px-3 py-2 text-sm font-medium text-soft-white/85 shadow-inset transition hover:border-accent hover:bg-accent/10"
		>
			<span>My Day</span>
			<span className="relative flex h-7 w-12 items-center rounded-full bg-accent/30 px-1">
				<span className="ml-auto block h-5 w-5 rounded-full bg-accent" />
			</span>
		</button>
	)
}

function ProfileBubble() {
	return (
		<div className="flex items-center gap-2 rounded-full border border-[#2F303A] bg-surface px-2 py-1 pl-1 pr-3">
			<div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-base font-semibold text-soft-white">
				BW
			</div>
			<ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
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
			strokeWidth="1.8"
		>
			<circle cx="11" cy="11" r="6" />
			<path d="m20 20-3.5-3.5" />
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
