import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function RequestPage() {
	return (
		<DashboardShell>
			<TopBar title="Request page" subtitle="Create, approve, and archive requests." />
			<PagePlaceholder
				title="Request centre"
				description="Add forms, approval workflows, and history tables for incoming requests."
			/>
		</DashboardShell>
	)
}
