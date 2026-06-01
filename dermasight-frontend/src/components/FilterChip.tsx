import type React from "react";

interface FilterChipProps {
	label: string;
	active: boolean;
	onClick?: () => void;
	className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
	label,
	active,
	onClick,
	className = "",
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`inline-flex items-center justify-center h-10 px-4 font-sans text-sm font-bold rounded-full transition-all duration-200 select-none active:scale-95 cursor-pointer border-none outline-none ${
				active
					? "bg-ink text-canvas"
					: "bg-surface-card text-ink hover:bg-secondary-bg"
			} ${className}`}
		>
			{label}
		</button>
	);
};
