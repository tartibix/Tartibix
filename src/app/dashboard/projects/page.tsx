import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function ProjectsPage() {
	return (
		<DashboardShell>
			<TopBar title="Projects" subtitle="Plan milestones and delivery timelines." />
			<PagePlaceholder
				title="Projects workspace"
				description="Build project tables, kanban boards, or analytics here to keep teams aligned."
			/>
		</DashboardShell>
	)
}
