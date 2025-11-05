import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function AdminPanelPage() {
	return (
		<DashboardShell>
			<TopBar title="Admin Panel" subtitle="Manage roles, permissions, and workspace settings." />
			<PagePlaceholder
				title="Admin controls"
				description="Add role management tables, audit logs, and tenant configurations here."
			/>
		</DashboardShell>
	)
}
