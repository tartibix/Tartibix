export type NotificationItem = {
	id: string
	title: string
	description: string
	time: string
}

export type AuditLogEntry = {
	id: string
	action: string
	user: string
	timestamp: string
}

export const notificationData: NotificationItem[] = [
	{
		id: 'notif-1',
		title: 'New System message',
		description: 'Release v2.4 shipped with analytics fixes and improved task syncing. See release notes.',
		time: '2 hours ago',
	},
	{
		id: 'notif-2',
		title: 'Your Password was changed',
		description: 'Security alert: Password updated from Account Settings on the web dashboard.',
		time: '7 hours ago',
	},
	{
		id: 'notif-3',
		title: 'New comment on your post',
		description: "Olivia Martin replied to 'Marketing Roadmap' with updated launch copy.",
		time: '4 hours ago',
	},
]

export const auditLogData: AuditLogEntry[] = [
	{
		id: 'audit-1',
		action: 'Updated project timeline',
		user: 'Amira Patel',
		timestamp: 'Apr 20, 2024, 09:22 PM',
	},
	{
		id: 'audit-2',
		action: 'Approved budget revision',
		user: 'Liam Rodriguez',
		timestamp: 'Apr 25, 2024, 09:22 PM',
	},
	{
		id: 'audit-3',
		action: 'Exported Q2 compliance report',
		user: 'Janelle Wong',
		timestamp: 'Apr 29, 2024, 09:22 PM',
	},
]
