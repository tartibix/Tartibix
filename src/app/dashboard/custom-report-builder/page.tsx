import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function CustomReportBuilderPage() {
	return (
		<DashboardShell>
			<TopBar title="Custom Report Builder" subtitle="Assemble the metrics that matter most." />
			<PagePlaceholder
				title="Report builder"
				description="Design chart builders, filters, and export utilities for bespoke insights."
			/>
		</DashboardShell>
	)
}
