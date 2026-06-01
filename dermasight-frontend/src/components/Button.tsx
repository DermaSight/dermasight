import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "tertiary" | "icon" | "overlay";
	children: React.ReactNode;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	children,
	className = "",
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center font-sans text-sm font-bold transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-focus-outer focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed";

	let variantStyles = "";

	switch (variant) {
		case "primary":
			// Pinterest Red, 16px radius, white text
			variantStyles =
				"bg-primary text-canvas hover:bg-primary-pressed rounded-2xl h-10 px-[14px]";
			break;
		case "secondary":
			// Gray-cream background, dark text
			variantStyles =
				"bg-secondary-bg text-ink hover:bg-secondary-pressed rounded-2xl h-10 px-[14px]";
			break;
		case "tertiary":
			// Transparent background, ink text, no shadow
			variantStyles =
				"bg-transparent text-ink hover:bg-surface-card rounded-2xl h-10 px-[14px]";
			break;
		case "icon":
			// Circular icon buttons, 40px diameter
			variantStyles =
				"bg-surface-card text-ink hover:bg-secondary-bg rounded-full w-10 h-10 p-0 shrink-0";
			break;
		case "overlay":
			// White floating pill overlay on image
			variantStyles =
				"bg-canvas text-ink hover:bg-surface-soft shadow-sm rounded-full px-3 py-1 text-xs";
			break;
	}

	return (
		<button
			type="button"
			className={`${baseStyles} ${variantStyles} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
