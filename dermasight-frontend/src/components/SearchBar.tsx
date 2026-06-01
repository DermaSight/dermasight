import { IconSearch } from "@tabler/icons-react";
import type React from "react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	className = "",
	placeholder = "Search for skin conditions, tips, articles...",
	...props
}) => {
	return (
		<div className={`relative flex items-center w-full ${className}`}>
			<div className="absolute left-4 text-mute pointer-events-none">
				<IconSearch size={20} stroke={2.5} />
			</div>
			<input
				type="text"
				placeholder={placeholder}
				className="w-full h-12 pl-12 pr-4 bg-surface-card hover:bg-secondary-bg text-ink placeholder-ash font-sans text-base font-normal rounded-full outline-none transition-all duration-200 focus:bg-canvas focus:ring-2 focus:ring-ink focus:border-ash"
				{...props}
			/>
		</div>
	);
};
