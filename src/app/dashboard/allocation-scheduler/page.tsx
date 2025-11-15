import DashboardShell from '@/components/dashboard/DashboardShell'
import ResourceAllocationScheduler from '@/components/dashboard/ResourceAllocationScheduler'

export default function AllocationSchedulerPage() {
	return (
		<DashboardShell>
			<div className="mx-auto w-full max-w-[1103px] space-y-8">
				<h1 className="font-display text-[32px] font-medium leading-[1.5em] text-soft-white">Resource Allocation Scheduler</h1>
				<ResourceAllocationScheduler />
			</div>
		</DashboardShell>
	)
}
