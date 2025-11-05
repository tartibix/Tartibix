type PagePlaceholderProps = {
	title: string
	description?: string
}

export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
	return (
		<section className="mt-10 rounded-3xl border border-[#2F303A] bg-surface p-10 text-soft-white shadow-[0_0_10px_rgba(169,223,216,0.25)]">
			<h2 className="font-display text-3xl font-semibold">{title}</h2>
			{description ? (
				<p className="mt-4 max-w-2xl text-base text-muted-foreground/80">{description}</p>
			) : null}
		</section>
	)
}
