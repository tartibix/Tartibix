import Image from 'next/image'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

const RESOURCES = [
	{
		title: 'Material inventory',
		icon: {
			src: '/images/resources/material-inventory-icon.svg',
			alt: 'Circular material inventory icon',
			width: 66,
			height: 66,
		},
	},
	{
		title: 'Equipment availability',
		icon: {
			src: '/images/resources/equipment-availability-icon.svg',
			alt: 'Construction helmet icon',
			width: 66,
			height: 66,
		},
	},
	{
		title: 'Employess aloocation',
		icon: {
			src: '/images/resources/employee-allocation-icon.svg',
			alt: 'Employee allocation icon',
			width: 56,
			height: 56,
		},
	},
]

export default function RecourcesPage() {
	return (
		<DashboardShell>
			<div className="space-y-8">
				<TopBar title="Resources" />
				<section
					aria-label="Resource quick links"
					className="rounded-[30px] border border-[#1F2028] bg-[#13141B]/80 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8"
				>
					<div className="space-y-5">
						{RESOURCES.map((resource) => (
							<ResourceCard key={resource.title} {...resource} />
						))}
					</div>
				</section>
			</div>
		</DashboardShell>
	)
}

type ResourceCardProps = (typeof RESOURCES)[number]

function ResourceCard({ title, icon }: ResourceCardProps) {
	const { src, alt, width, height } = icon

	return (
		<article
			className="flex min-h-[102px] items-center gap-6 rounded-[18px] border border-[#1D1E28] bg-[#21222D] px-5 py-5 shadow-[0_0_8px_rgba(169,223,216,0.25)] transition hover:border-[#6DF1E2]/35 hover:shadow-[0_0_12px_rgba(169,223,216,0.35)] sm:px-8"
		>
				<div className="flex items-center gap-6">
					<div className="grid size-[72px] place-items-center">
						<Image src={src} alt={alt} width={width} height={height} className="h-auto w-auto" />
					</div>
				<p className="font-display text-xl text-[#FFF9F7]">{title}</p>
			</div>
		</article>
	)
}
