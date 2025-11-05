'use client'

import React from 'react'

type Props = {
	isOn: boolean
	onToggle: (next: boolean) => void
}

export default function MyDayToggle({ isOn, onToggle }: Props) {
	return (
		<button
			type="button"
			aria-pressed={isOn}
			onClick={() => onToggle(!isOn)}
			className="flex h-[47px] w-full sm:w-[177px] items-center justify-between rounded-[10px] border border-[#2F303A] bg-[#21222D] px-[22px] py-3 shadow-[0_0_5px_rgba(169,223,216,0.15)] transition hover:border-accent hover:bg-accent/10"
		>
			<span className="font-display text-base font-medium leading-6 text-white">My Day</span>
			<div className="relative h-[35px] w-[35px] -scale-x-100">
				<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect y="8" width="35" height="19.69" rx="9.845" fill={isOn ? '#A9DFD8' : '#909C9A'} className="transition-colors duration-200" />
					<circle cx={isOn ? '9.845' : '25.155'} cy="17.845" r="7.845" fill="#2B2D3A" className="transition-all duration-200" />
				</svg>
			</div>
		</button>
	)
}
