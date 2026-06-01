/* eslint-disable react-refresh/only-export-components */

import { motion } from "motion/react";
import type React from "react";
import type { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	variant?: "flat" | "bordered" | "elevated";
	bg?: "canvas" | "surface-soft" | "surface-card" | "surface-dark";
	radius?: "md" | "lg" | "none";
	interactive?: boolean;
}

const CardMain: React.FC<CardProps> = ({
	children,
	onClick,
	className = "",
	variant = "bordered",
	bg = "surface-soft",
	radius = "md",
	interactive = true,
}) => {
	const baseClasses = "w-full overflow-hidden flex flex-col font-sans";

	// Radius mapping matching DESIGN.md tokens: 16px (md) and 32px (lg)
	const radiusMap = {
		md: "rounded-2xl", // 16px
		lg: "rounded-[32px]", // 32px
		none: "rounded-none",
	};

	// Background mapping matching DESIGN.md color tokens
	const bgMap = {
		canvas: "bg-canvas text-ink",
		"surface-soft": "bg-surface-soft text-ink",
		"surface-card": "bg-surface-card text-ink",
		"surface-dark": "bg-surface-dark text-white",
	};

	// Variant mapping matching DESIGN.md elevation tokens
	const variantMap = {
		flat: "border-none shadow-none",
		bordered: "border border-hairline/60 shadow-none",
		elevated: "border border-hairline/20 shadow-md",
	};

	const combinedClasses = `${baseClasses} ${radiusMap[radius]} ${bgMap[bg]} ${variantMap[variant]} ${className}`;

	if (interactive) {
		return (
			<motion.div
				whileHover={{ y: -4 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
				onClick={onClick}
				className={`${combinedClasses} cursor-pointer select-none transition-shadow duration-300 hover:shadow-md`}
			>
				{children}
			</motion.div>
		);
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: got nothing to say
		// biome-ignore lint/a11y/useKeyWithClickEvents: got nothing to say
		<div onClick={onClick} className={combinedClasses}>
			{children}
		</div>
	);
};

// Sub-components:

interface CardHeaderProps {
	children?: ReactNode;
	title?: ReactNode;
	subtitle?: ReactNode;
	avatar?: ReactNode;
	action?: ReactNode;
	className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
	children,
	title,
	subtitle,
	avatar,
	action,
	className = "",
}) => {
	return (
		<div
			className={`p-5 flex items-center justify-between gap-4 border-b border-hairline/20 ${className}`}
		>
			{children ? (
				children
			) : (
				<>
					<div className="flex items-center gap-3 min-w-0">
						{avatar && <div className="flex-shrink-0">{avatar}</div>}
						<div className="min-w-0">
							{title && (
								<h4 className="font-display text-sm font-bold text-ink truncate leading-tight">
									{title}
								</h4>
							)}
							{subtitle && (
								<p className="text-xs text-mute truncate mt-0.5 leading-none">
									{subtitle}
								</p>
							)}
						</div>
					</div>
					{action && <div className="flex-shrink-0">{action}</div>}
				</>
			)}
		</div>
	);
};

interface CardContentProps {
	children: ReactNode;
	className?: string;
	noPadding?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({
	children,
	className = "",
	noPadding = false,
}) => {
	return (
		<div className={`${noPadding ? "p-0" : "p-5"} flex-grow ${className}`}>
			{children}
		</div>
	);
};

interface CardMediaProps {
	src: string;
	alt?: string;
	aspectRatio?: "square" | "portrait" | "video" | "auto";
	className?: string;
	children?: ReactNode;
}

const CardMedia: React.FC<CardMediaProps> = ({
	src,
	alt = "",
	aspectRatio = "portrait",
	className = "",
	children,
}) => {
	const aspectMap = {
		square: "aspect-square",
		portrait: "aspect-[4/5]",
		video: "aspect-[16/9]",
		auto: "aspect-auto",
	};

	return (
		<div
			className={`relative w-full overflow-hidden bg-secondary-bg ${aspectMap[aspectRatio]} ${className}`}
		>
			<img
				src={src}
				alt={alt}
				loading="lazy"
				className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
			/>
			{children && <div className="absolute inset-0 z-10">{children}</div>}
		</div>
	);
};

interface CardFooterProps {
	children: ReactNode;
	className?: string;
	divider?: boolean;
}

const CardFooter: React.FC<CardFooterProps> = ({
	children,
	className = "",
	divider = false,
}) => {
	return (
		<div
			className={`p-5 flex items-center justify-between gap-4 mt-auto ${
				divider ? "border-t border-hairline/20" : ""
			} ${className}`}
		>
			{children}
		</div>
	);
};

// Export compound components
export const Card = Object.assign(CardMain, {
	Header: CardHeader,
	Content: CardContent,
	Media: CardMedia,
	Footer: CardFooter,
});
