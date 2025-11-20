export type TaskDetailTask = {
	label: string
	completed: boolean
	progress?: number
}

export type TaskDetailTimelinePhase = {
	label: string
	duration: number
}

export type TaskDetailTeamMember = {
	slug?: string
	name: string
	image?: string
	role?: string
}

export type TaskMemberTaskRow = {
	id: string
	name: string
	dueDate: string
	assignedTo: string
	status: string
}

export type TaskMemberDetail = {
	slug: string
	name: string
	role: string
	avatar?: string
	sectionTitle: string
	addTaskCard: {
		title: string
		description?: string
		ctaLabel?: string
	}
	priorityCard: {
		label: string
		value: string
		options?: string[]
	}
	board: {
		title: string
		subtitle: string
		columns: string[]
		rows: TaskMemberTaskRow[]
	}
}

export type TaskCreationAttachment = {
	id: string
	fileName: string
	size: string
	uploadedOn?: string
}

export type TaskStatusStyle = {
	label: string
	badge: {
		background: string
		text: string
	}
}

export type TaskCreationTemplate = {
	projects: string[]
	taskTypes: string[]
	parentTasks: string[]
	priorityLevels?: string[]
	placeholders: {
		taskName: string
		description: string
	}
	dateSuggestions: {
		startDate: string
		dueDate: string
	}
	attachments: TaskCreationAttachment[]
	copy: {
		heroSubtitle: string
		helperPrompt: string
		helperLinkLabel: string
		priorityHelper: string
		uploadButtonLabel: string
		attachmentsEmptyState: string
	}
}

export type TaskDetailData = {
	meta: {
		title: string
	}
	overview: {
		title: string
		phase: string
		progress: number
		progressColor?: string
		progressGlowColor?: string
	}
	tasks: TaskDetailTask[]
	timeline: {
		phases: TaskDetailTimelinePhase[]
		barColor?: string
		markerGlowColor?: string
	}
	teams: {
		primary: {
			title: string
			columns: string[]
			members: TaskDetailTeamMember[]
		}
		secondary: {
			title: string
			members: TaskDetailTeamMember[]
		}
	}
}

export const taskDetailData: TaskDetailData = {
	meta: {
		title: 'Task Detail Modal',
	},
	overview: {
		title: 'Website Redesign',
		phase: 'Design Phase',
		progress: 62,
		progressColor: '#8FC7C8',
		progressGlowColor: 'rgba(143, 199, 200, 0.45)',
	},
	tasks: [
		{ label: 'Design homepage', completed: true, progress: 90 },
		{ label: 'Create wireframes', completed: true, progress: 75 },
		{ label: 'Implement new design system', completed: false, progress: 48 },
		{ label: 'Launch website', completed: false, progress: 12 },
	],
	timeline: {
		phases: [
			{ label: 'Jan 1', duration: 14 },
			{ label: 'Design', duration: 36 },
			{ label: 'Development', duration: 28 },
			{ label: 'Launch', duration: 18 },
		],
		barColor: '#8FC7C8',
		markerGlowColor: 'rgba(143, 199, 200, 0.45)',
	},
	teams: {
		primary: {
			title: 'Team',
			columns: ['Image', 'Name', 'Positions'],
			members: [
				{ slug: 'ava-patel', name: 'Ava Patel', role: 'Front-end Developer', image: '/images/tasks/avatar-1.svg' },
				{ slug: 'noah-ramirez', name: 'Noah Ramirez', role: 'UX Designer', image: '/images/tasks/avatar-2.svg' },
				{ slug: 'sofia-chen', name: 'Sofia Chen', role: 'Product Manager', image: '/images/tasks/avatar-3.svg' },
				{ slug: 'ethan-brooks', name: 'Ethan Brooks', role: 'Back-end Engineer', image: '/images/tasks/avatar-4.svg' },
			],
		},
		secondary: {
			title: 'Cook',
			members: [
				{ name: 'Priya Kumar', image: '/images/tasks/avatar-1.svg' },
				{ name: 'Daniel Park', image: '/images/tasks/avatar-2.svg' },
				{ name: 'Lina Torres', image: '/images/tasks/avatar-3.svg' },
			],
		},
	},
}

export const taskMemberDetails: Record<string, TaskMemberDetail> = {
	'ava-patel': {
		slug: 'ava-patel',
		name: 'Ava Patel',
		role: 'Front-end Developer',
		avatar: '/images/tasks/avatar-1.svg',
		sectionTitle: 'Task Management',
		addTaskCard: {
			title: 'Add Tasks',
			description: 'Build out remaining UI tickets so QA can begin on Thursday.',
			ctaLabel: 'Create new task',
		},
		priorityCard: {
			label: 'Priority',
			value: 'High priority',
			options: ['Critical priority', 'High priority', 'Medium priority', 'Low priority'],
		},
		board: {
			title: 'Home decore section',
			subtitle: 'Coordinated handoffs across the décor launch timeline.',
			columns: ['Task', 'Due date', 'Assigned to', 'Status'],
			rows: [
				{
					id: 'nelsa-web-1',
					name: 'Nelsa web developement',
					dueDate: 'Aug 25',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'datascale-ai-1',
					name: 'Datascale AI app',
					dueDate: 'Aug 30',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'media-branding-1',
					name: 'Media channel branding',
					dueDate: 'Sep 1',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'corlax-ios-1',
					name: 'Corlax iOS app develpoement',
					dueDate: 'Sep 6',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'nelsa-web-2',
					name: 'Nelsa web developement',
					dueDate: 'Aug 25',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'datascale-ai-2',
					name: 'Datascale AI app',
					dueDate: 'Aug 30',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'media-branding-2',
					name: 'Media channel branding',
					dueDate: 'Sep 1',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'corlax-ios-2',
					name: 'Corlax iOS app develpoement',
					dueDate: 'Sep 6',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
			],
		},
	},
	'noah-ramirez': {
		slug: 'noah-ramirez',
		name: 'Noah Ramirez',
		role: 'UX Designer',
		avatar: '/images/tasks/avatar-2.svg',
		sectionTitle: 'Task Management',
		addTaskCard: {
			title: 'Add Tasks',
			description: 'Map upcoming workshops and validation sprints for Datascale.',
			ctaLabel: 'Plan session',
		},
		priorityCard: {
			label: 'Priority',
			value: 'Medium priority',
			options: ['Critical priority', 'High priority', 'Medium priority', 'Low priority'],
		},
		board: {
			title: 'Datascale AI app',
			subtitle: 'Research, prototyping, and validation checkpoints.',
			columns: ['Task', 'Due date', 'Assigned to', 'Status'],
			rows: [
				{
					id: 'datascale-dashboard-1',
					name: 'Analytics dashboard flows',
					dueDate: 'Aug 21',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'datascale-onboarding-1',
					name: 'Onboarding walkthrough',
					dueDate: 'Aug 28',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'datascale-heuristics-1',
					name: 'Heuristic review pack',
					dueDate: 'Sep 3',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'datascale-interviews-1',
					name: 'Executive interview readouts',
					dueDate: 'Sep 8',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'datascale-dashboard-2',
					name: 'Analytics dashboard flows',
					dueDate: 'Aug 21',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'datascale-onboarding-2',
					name: 'Onboarding walkthrough',
					dueDate: 'Aug 28',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'datascale-heuristics-2',
					name: 'Heuristic review pack',
					dueDate: 'Sep 3',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'datascale-interviews-2',
					name: 'Executive interview readouts',
					dueDate: 'Sep 8',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
			],
		},
	},
	'sofia-chen': {
		slug: 'sofia-chen',
		name: 'Sofia Chen',
		role: 'Product Manager',
		avatar: '/images/tasks/avatar-3.svg',
		sectionTitle: 'Task Management',
		addTaskCard: {
			title: 'Add Tasks',
			description: 'Outline partner deliverables and due dates for launch readiness.',
			ctaLabel: 'Schedule follow-up',
		},
		priorityCard: {
			label: 'Priority',
			value: 'Critical priority',
			options: ['Critical priority', 'High priority', 'Medium priority', 'Low priority'],
		},
		board: {
			title: 'Media channel branding',
			subtitle: 'Cross-team milestones ahead of the public rollout.',
			columns: ['Task', 'Due date', 'Assigned to', 'Status'],
			rows: [
				{
					id: 'branding-guidelines-1',
					name: 'Brand guidelines refresh',
					dueDate: 'Aug 19',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'branding-assets-1',
					name: 'Partner asset toolkit',
					dueDate: 'Aug 26',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'branding-training-1',
					name: 'Sales enablement training',
					dueDate: 'Sep 2',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'branding-analytics-1',
					name: 'Rollout analytics dashboard',
					dueDate: 'Sep 7',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'branding-guidelines-2',
					name: 'Brand guidelines refresh',
					dueDate: 'Aug 19',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'branding-assets-2',
					name: 'Partner asset toolkit',
					dueDate: 'Aug 26',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'branding-training-2',
					name: 'Sales enablement training',
					dueDate: 'Sep 2',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'branding-analytics-2',
					name: 'Rollout analytics dashboard',
					dueDate: 'Sep 7',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
			],
		},
	},
	'ethan-brooks': {
		slug: 'ethan-brooks',
		name: 'Ethan Brooks',
		role: 'Back-end Engineer',
		avatar: '/images/tasks/avatar-4.svg',
		sectionTitle: 'Task Management',
		addTaskCard: {
			title: 'Add Tasks',
			description: 'Close remaining integration tickets before beta submission.',
			ctaLabel: 'Log backend task',
		},
		priorityCard: {
			label: 'Priority',
			value: 'High priority',
			options: ['Critical priority', 'High priority', 'Medium priority', 'Low priority'],
		},
		board: {
			title: 'Corlax iOS app developement',
			subtitle: 'Backend-focused checkpoints leading up to release.',
			columns: ['Task', 'Due date', 'Assigned to', 'Status'],
			rows: [
				{
					id: 'corlax-auth-1',
					name: 'Authentication service handoff',
					dueDate: 'Aug 23',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'corlax-payments-1',
					name: 'Payments gateway upgrade',
					dueDate: 'Aug 29',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'corlax-monitoring-1',
					name: 'Observability dashboards',
					dueDate: 'Sep 4',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'corlax-sync-1',
					name: 'Background sync reliability',
					dueDate: 'Sep 9',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'corlax-auth-2',
					name: 'Authentication service handoff',
					dueDate: 'Aug 23',
					assignedTo: 'Jhon Doe',
					status: 'In Progress',
				},
				{
					id: 'corlax-payments-2',
					name: 'Payments gateway upgrade',
					dueDate: 'Aug 29',
					assignedTo: 'Jhon Doe',
					status: 'Completed',
				},
				{
					id: 'corlax-monitoring-2',
					name: 'Observability dashboards',
					dueDate: 'Sep 4',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
				{
					id: 'corlax-sync-2',
					name: 'Background sync reliability',
					dueDate: 'Sep 9',
					assignedTo: 'Jhon Doe',
					status: 'Not Started',
				},
			],
		},
	},
}

export const taskStatusStyles: Record<string, TaskStatusStyle> = {
	'In Progress': {
		label: 'In Progress',
		badge: { background: 'rgba(91, 167, 255, 0.14)', text: '#5BA7FF' },
	},
	Completed: {
		label: 'Completed',
		badge: { background: 'rgba(101, 214, 173, 0.12)', text: '#65D6AD' },
	},
	'Not Started': {
		label: 'Not Started',
		badge: { background: 'rgba(155, 160, 174, 0.12)', text: '#9BA0AE' },
	},
}

export const taskCreationDataByMember: Record<string, TaskCreationTemplate> = {
	default: {
		projects: ['Study Villa Construction', 'Datascale AI App', 'Brand Campaign Refresh'],
		taskTypes: ['Construction', 'Design', 'Development', 'Quality Assurance'],
		parentTasks: ['Foundation Planning', 'Site Survey Review', 'Stakeholder Presentation'],
		priorityLevels: ['Critical priority', 'High priority', 'Medium priority', 'Low priority'],
		placeholders: {
			taskName: 'Example: Pouring concrete for the foundations of Building A',
			description: 'Outline the key milestones, required resources, and quality checks for this task.',
		},
		dateSuggestions: {
			startDate: '2024-08-18',
			dueDate: '2024-09-02',
		},
		attachments: [
			{ id: 'blueprint', fileName: 'Blueprint-v4.pdf', size: '2.6 MB', uploadedOn: 'Aug 04, 2024' },
			{ id: 'site-scan', fileName: 'Site-scan.jpg', size: '1.2 MB', uploadedOn: 'Aug 01, 2024' },
		],
		copy: {
			heroSubtitle: 'Create a new task and connect it to the latest project milestones in seconds.',
			helperPrompt: 'Need to review existing tasks?',
			helperLinkLabel: 'View task board',
			priorityHelper: 'Adjust the urgency to keep your team aligned on what comes next.',
			uploadButtonLabel: 'Upload',
			attachmentsEmptyState: 'No files attached yet. Upload supporting documents to keep context in one place.',
		},
	},
	'ava-patel': {
		projects: ['Home Decor Section', 'Datascale AI App', 'Nelsa Web Development'],
		taskTypes: ['UI Implementation', 'Design QA', 'Bug Fix', 'Documentation'],
		parentTasks: ['Homepage Rebuild', 'Component Library Audit', 'Accessibility Review'],
		priorityLevels: ['Critical priority', 'High priority', 'Medium priority', 'Low priority'],
		placeholders: {
			taskName: 'Example: Pouring concrete for the foundations of Building A',
			description: 'Document the scope, dependencies, and acceptance criteria for the UI deliverable.',
		},
		dateSuggestions: {
			startDate: '2024-08-21',
			dueDate: '2024-09-05',
		},
		attachments: [
			{ id: 'wireframes', fileName: 'Wireframes.fig', size: '4.8 MB', uploadedOn: 'Aug 11, 2024' },
			{ id: 'handoff-doc', fileName: 'Design-handoff.docx', size: '940 KB', uploadedOn: 'Aug 10, 2024' },
		],
		copy: {
			heroSubtitle: 'Spin up a fresh ticket so QA can validate the new UI flow on Thursday.',
			helperPrompt: 'Want to confirm open Jira items first?',
			helperLinkLabel: 'Go to task board',
			priorityHelper: 'Set how urgent this feels for the sprint before handing it off.',
			uploadButtonLabel: 'Upload',
			attachmentsEmptyState: 'No files attached yet. Add supporting specs or screenshots to keep context nearby.',
		},
	},
}
