import { IconChevronRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";

interface PinCardProps {
	title: string;
	imageUrl: string;
	category?: string;
	readTime?: string;
	doctorName?: string;
	doctorTitle?: string;
	doctorAvatar?: string;
	onClick?: () => void;
	className?: string;
}

export const PinCard: React.FC<PinCardProps> = ({
	title,
	imageUrl,
	category,
	readTime,
	doctorName,
	doctorTitle,
	doctorAvatar,
	onClick,
	className = "",
}) => {
	return (
		<motion.div
			whileHover={{ y: -4 }}
			transition={{ duration: 0.2, ease: "easeOut" }}
			onClick={onClick}
			className={`group relative bg-surface-card rounded-2xl overflow-hidden cursor-pointer select-none border border-hairline/20 shadow-none hover:shadow-md transition-shadow duration-300 w-full h-full flex flex-col ${className}`}
		>
			{/* Image Container with Hover Zoom */}
			<div className="relative w-full aspect-[4/3] overflow-hidden bg-secondary-bg">
				<img
					src={imageUrl}
					alt={title}
					loading="lazy"
					className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
				/>

				{/* Optional Floating Overlay Tag */}
				{category && (
					<div className="absolute top-3 left-3 z-10">
						<span className="inline-flex items-center bg-canvas/90 backdrop-blur-sm text-ink text-xs font-bold rounded-full px-3 py-1 shadow-sm font-sans">
							{category}
						</span>
					</div>
				)}

				{/* Read Time Overlay */}
				{readTime && (
					<div className="absolute bottom-3 right-3 z-10">
						<span className="inline-flex items-center bg-surface-dark/80 backdrop-blur-sm text-canvas text-[10px] font-bold rounded-full px-2 py-0.5 font-sans">
							{readTime}
						</span>
					</div>
				)}
			</div>

			{/* Info Area (Fades in slightly or sits naturally as Pinterest content) */}
			<div className="p-4 flex flex-col flex-grow justify-between gap-4">
				<h3 className="font-display text-base font-bold text-ink leading-tight group-hover:text-primary transition-colors duration-200">
					{title}
				</h3>

				{/* Optional Doctor Attribution */}
				{doctorName && (
					<div className="flex items-center gap-2 mt-auto border-t border-hairline/30 pt-3">
						{doctorAvatar ? (
							<img
								src={doctorAvatar}
								alt={doctorName}
								className="w-8 h-8 rounded-full object-cover border border-hairline"
							/>
						) : (
							<div className="w-8 h-8 rounded-full bg-secondary-bg flex items-center justify-center text-ink font-bold text-xs">
								{doctorName.charAt(0)}
							</div>
						)}
						<div className="flex-1 min-w-0">
							<p className="font-sans text-xs font-bold text-ink truncate leading-none">
								{doctorName}
							</p>
							<p className="font-sans text-[10px] text-mute truncate mt-0.5 leading-none">
								{doctorTitle || "Reviewer"}
							</p>
						</div>
						<div className="text-mute group-hover:translate-x-1 transition-transform duration-200">
							<IconChevronRight size={14} stroke={2.5} />
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
};
