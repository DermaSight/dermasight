import type React from "react";

interface ResultVisualsProps {
	imageUrl: string;
	conditionName: string;
}

export const ResultVisuals: React.FC<ResultVisualsProps> = ({
	imageUrl,
	conditionName,
}) => {
	return (
		<div className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-surface-card border border-hairline/60 p-2">
			<img
				src={imageUrl}
				alt={conditionName}
				className="w-full h-full object-cover rounded-[24px]"
			/>
			<div className="absolute top-4 left-4 z-10">
				<span className="bg-canvas/90 backdrop-blur-sm text-ink text-xs font-bold px-3 py-1 rounded-full shadow-sm font-sans flex items-center gap-1">
					<span className="w-2 h-2 rounded-full bg-primary" />
					Analyzed Lesion Area
				</span>
			</div>
		</div>
	);
};
