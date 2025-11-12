import DashboardShell from '@/components/dashboard/DashboardShell'
import ResourceAllocationScheduler from '@/components/dashboard/ResourceAllocationScheduler'
import TopBar from '@/components/dashboard/TopBar'

export default function AllocationSchedulerPage() {
	return (
		<DashboardShell>
			<div className="mx-auto w-full max-w-[1103px] space-y-6">
				<TopBar title="Resource Allocation Scheduler" subtitle="Balance workloads and availability." />
				<ResourceAllocationScheduler />
			</div>
		</DashboardShell>
	)
}
