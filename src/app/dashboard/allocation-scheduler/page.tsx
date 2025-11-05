import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function AllocationSchedulerPage() {
	return (
		<DashboardShell>
			<TopBar title="Allocation Scheduler" subtitle="Balance workloads and availability." />
			<PagePlaceholder
				title="Resource allocation"
				description="Bring in calendars, drag-and-drop schedulers, and heatmaps for staffing decisions."
			/>
		</DashboardShell>
	)
}
