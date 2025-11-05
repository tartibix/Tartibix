import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function DocumentManagementPage() {
	return (
		<DashboardShell>
			<TopBar title="Document management" subtitle="Centralise, tag, and share critical files." />
			<PagePlaceholder
				title="Document hub"
				description="Surface file browsers, versioning timelines, and permission controls for your team."
			/>
		</DashboardShell>
	)
}
