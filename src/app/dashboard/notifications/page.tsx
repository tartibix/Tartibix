import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function NotificationsPage() {
	return (
		<DashboardShell>
			<TopBar title="Notification & Audit Log" subtitle="Review alerts and trace system actions." />
			<PagePlaceholder
				title="Notifications & audit trail"
				description="Surface alert rules, delivery preferences, and historical logs for compliance."
			/>
		</DashboardShell>
	)
}
