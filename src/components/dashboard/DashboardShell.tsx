import { ReactNode } from 'react'
import Sidebar from './Sidebar'

type DashboardShellProps = {
	children: ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
	return (
		<div className="flex min-h-screen bg-night text-soft-white">
			<Sidebar />
			<main className="flex-1 overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8 lg:px-12">
				{children}
			</main>
		</div>
	)
}
