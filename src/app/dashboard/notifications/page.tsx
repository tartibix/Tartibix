import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { auditLogData, notificationData } from '@/lib/notificationsData'

export default function NotificationsPage() {
	return (
		<DashboardShell>
			<div className="mx-auto w-full max-w-[1103px] space-y-6">
				<TopBar title="Notification & Audit Log" />

				<section className="rounded-[10px] border border-[#2F303A] bg-[#21222D] px-6 py-8 shadow-[0_0_8px_rgba(169,223,216,0.24)] sm:px-8 sm:py-9">
					<div className="space-y-10">
						<div className="space-y-5">
							<h2 className="font-display text-[20px] font-medium leading-[30px] text-soft-white">Notifications</h2>
							<ul className="space-y-5">
								{notificationData.map(notification => (
									<li key={notification.id} className="space-y-3">
										<h3 className="text-[16px] font-semibold leading-[1.3] text-soft-white">
											{notification.title}
										</h3>
										<div className="flex flex-col gap-3 rounded-[7px] border border-[#323449] px-4 py-3 font-display text-[14px] text-[#797979] sm:flex-row sm:items-center sm:justify-between sm:px-6">
											<p className="leading-[1.5]">{notification.description}</p>
											<span className="leading-[1.5]">{notification.time}</span>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="space-y-5">
							<h2 className="font-display text-[20px] font-medium leading-[30px] text-soft-white">Audit Log</h2>
							<div className="overflow-hidden rounded-[10px] border border-[#323449]">
								<div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3 bg-[#1A1B24] px-5 py-4 font-display text-[20px] font-medium leading-[30px] text-[#87888C] sm:px-7">
									<span>Action</span>
									<span>User</span>
									<span className="text-right">Date</span>
								</div>
								<ul className="divide-y divide-white/10 bg-[#21222D]">
									{auditLogData.map(entry => (
										<li
											key={entry.id}
											className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3 px-5 py-5 font-display text-[14px] font-medium text-soft-white sm:px-7"
										>
											<span>{entry.action}</span>
											<span>{entry.user}</span>
											<span className="text-right">{entry.timestamp}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}
