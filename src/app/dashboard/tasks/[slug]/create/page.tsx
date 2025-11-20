import { notFound } from 'next/navigation'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import TaskCreateForm from '@/components/dashboard/TaskCreateForm'
import { taskCreationDataByMember, taskMemberDetails } from '@/lib/tasksData'

type TaskCreatePageProps = {
	params: {
		slug: string
	}
}

export function generateStaticParams() {
	return Object.values(taskMemberDetails).map((detail) => ({ slug: detail.slug }))
}

export default function TaskCreatePage({ params }: TaskCreatePageProps) {
	const detail = taskMemberDetails[params.slug]

	if (!detail) {
		notFound()
	}

	const creationData = taskCreationDataByMember[params.slug] ?? taskCreationDataByMember.default
	const priorityOptions = creationData.priorityLevels ?? detail.priorityCard.options ?? []

	return (
		<DashboardShell>
			<div className="flex flex-col gap-8">
				<TopBar title={detail.sectionTitle} />
				<TaskCreateForm detail={detail} creationData={creationData} priorityOptions={priorityOptions} />
			</div>
		</DashboardShell>
	)
}
