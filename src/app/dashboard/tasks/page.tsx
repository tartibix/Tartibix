import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function TasksPage() {
	return (
		<DashboardShell>
			<TopBar title="Tasks" subtitle="Organise personal and team responsibilities." />
			<PagePlaceholder
				title="Tasks overview"
				description="Display task lists, statuses, and automation settings on this screen."
			/>
		</DashboardShell>
	)
}
