'use client'

import { useState, useEffect } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

interface Notification {
	id: string
	type: string
	title: string
	description: string
	time: string
	read: boolean
	priority: string
}

interface AuditLogEntry {
	id: string
	action: string
	user: string
	timestamp: string
}

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([])
	const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		async function fetchData() {
			try {
				// Fetch notifications
				const notifResponse = await fetch('/api/notifications')
				if (notifResponse.ok) {
					const notifData = await notifResponse.json()
					setNotifications(notifData.notifications || [])
					setUnreadCount(notifData.unreadCount || 0)
				}

				// Fetch audit log
				const auditResponse = await fetch('/api/notifications?type=audit')
				if (auditResponse.ok) {
					const auditData = await auditResponse.json()
					setAuditLog(auditData.auditLog || [])
				}
			} catch (error) {
				console.error('Error fetching notifications:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	const markAllAsRead = async () => {
		try {
			await fetch('/api/notifications', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ markAllRead: true }),
			})
			setNotifications(prev => prev.map(n => ({ ...n, read: true })))
			setUnreadCount(0)
		} catch (error) {
			console.error('Error marking notifications as read:', error)
		}
	}

	const markAsRead = async (id: string) => {
		try {
			await fetch('/api/notifications', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notificationIds: [id] }),
			})
			setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
			setUnreadCount(prev => Math.max(0, prev - 1))
		} catch (error) {
			console.error('Error marking notification as read:', error)
		}
	}

	if (isLoading) {
		return (
			<DashboardShell>
				<div className="mx-auto w-full max-w-[1103px] space-y-6">
					<TopBar title="Notification & Audit Log" />
					<div className="flex items-center justify-center py-20">
						<div className="text-soft-white/60">Loading notifications...</div>
					</div>
				</div>
			</DashboardShell>
		)
	}

	return (
		<DashboardShell>
			<div className="mx-auto w-full max-w-[1103px] space-y-6">
				<TopBar title="Notification & Audit Log" />

				<section className="rounded-[10px] border border-[#2F303A] bg-[#21222D] px-6 py-8 shadow-[0_0_8px_rgba(169,223,216,0.24)] sm:px-8 sm:py-9">
					<div className="space-y-10">
						<div className="space-y-5">
							<div className="flex items-center justify-between">
								<h2 className="font-display text-[20px] font-medium leading-[30px] text-soft-white">
									Notifications
									{unreadCount > 0 && (
										<span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
											{unreadCount} new
										</span>
									)}
								</h2>
								{unreadCount > 0 && (
									<button
										onClick={markAllAsRead}
										className="text-sm text-accent hover:underline"
									>
										Mark all as read
									</button>
								)}
							</div>
							{notifications.length === 0 ? (
								<p className="text-center py-8 text-muted-foreground/70">No notifications yet.</p>
							) : (
								<ul className="space-y-5">
									{notifications.map(notification => (
										<li 
											key={notification.id} 
											className={`space-y-3 ${!notification.read ? 'opacity-100' : 'opacity-70'}`}
											onClick={() => !notification.read && markAsRead(notification.id)}
										>
											<div className="flex items-center gap-2">
												{!notification.read && (
													<span className="h-2 w-2 rounded-full bg-accent"></span>
												)}
												<h3 className="text-[16px] font-semibold leading-[1.3] text-soft-white">
													{notification.title}
												</h3>
												{notification.priority === 'high' && (
													<span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
														High
													</span>
												)}
											</div>
											<div className="flex flex-col gap-3 rounded-[7px] border border-[#323449] px-4 py-3 font-display text-[14px] text-[#797979] sm:flex-row sm:items-center sm:justify-between sm:px-6 cursor-pointer hover:border-accent/30 transition">
												<p className="leading-[1.5]">{notification.description}</p>
												<span className="leading-[1.5] whitespace-nowrap">{notification.time}</span>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>

						<div className="space-y-5">
							<h2 className="font-display text-[20px] font-medium leading-[30px] text-soft-white">Audit Log</h2>
							{auditLog.length === 0 ? (
								<p className="text-center py-8 text-muted-foreground/70">No audit log entries yet.</p>
							) : (
								<div className="overflow-hidden rounded-[10px] border border-[#323449]">
									<div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3 bg-[#1A1B24] px-5 py-4 font-display text-[20px] font-medium leading-[30px] text-[#87888C] sm:px-7">
										<span>Action</span>
										<span>User</span>
										<span className="text-right">Date</span>
									</div>
									<ul className="divide-y divide-white/10 bg-[#21222D]">
										{auditLog.map(entry => (
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
							)}
						</div>
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}
