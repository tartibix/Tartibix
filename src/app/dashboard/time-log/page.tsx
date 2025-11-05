import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function TimeLogPage() {
	return (
		<DashboardShell>
			<TopBar title="Time log" subtitle="Capture and audit time entries with ease." />
			<PagePlaceholder
				title="Time tracking"
				description="Integrate timers, manual entry forms, or analytics to visualise productivity trends."
			/>
		</DashboardShell>
	)
}
