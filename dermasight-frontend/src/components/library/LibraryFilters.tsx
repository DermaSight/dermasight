import type React from "react";
import { SearchBar } from "@/components/SearchBar";

interface LibraryFiltersProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
}

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
	searchQuery,
	onSearchChange,
}) => {
	return (
		<div className="flex flex-col gap-4 border-b border-hairline/30 pb-6">
			<SearchBar
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder="Search for eczema care, acne prevention, melanoma guides..."
			/>
		</div>
	);
};

export default LibraryFilters;
