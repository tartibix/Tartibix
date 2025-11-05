import DashboardShell from '@/components/dashboard/DashboardShell'
import PagePlaceholder from '@/components/dashboard/PagePlaceholder'
import TopBar from '@/components/dashboard/TopBar'

export default function RecourcesPage() {
	return (
		<DashboardShell>
			<TopBar title="Recources" subtitle="Host tutorials, policies, and onboarding kits." />
			<PagePlaceholder
				title="Knowledge base"
				description="Embed documentation, video playlists, or searchable FAQs here."
			/>
		</DashboardShell>
	)
}
