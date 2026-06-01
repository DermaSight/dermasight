import { motion } from "motion/react";
import type React from "react";

interface SeverityIndexMeterProps {
	severityScore: number;
	severityLabel: "Mild" | "Moderate" | "Severe";
	size?: string;
	asymmetryScore: number;
	borderIrregularity: number;
}

export const SeverityIndexMeter: React.FC<SeverityIndexMeterProps> = ({
	severityScore,
	severityLabel,
	size,
	asymmetryScore,
	borderIrregularity,
}) => {
	// Calculate stroke dashoffset for the circular SVG progress meter
	const radius = 50;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset =
		circumference - (severityScore / 100) * circumference;

	const severityBadgeStyle =
		severityLabel === "Severe"
			? "bg-error/10 text-error"
			: severityLabel === "Moderate"
				? "bg-amber-600/10 text-amber-600"
				: "bg-emerald-600/10 text-emerald-600";

	return (
		<div className="bg-surface-card rounded-[32px] border border-hairline/50 p-6 flex flex-col gap-6">
			<h3 className="font-display text-base font-bold text-ink leading-none">
				Dermatological Severity Index
			</h3>

			<div className="flex items-center gap-6">
				{/* Circular SVG gauge */}
				<div className="relative w-24 h-24 shrink-0">
					<svg
						className="w-full h-full transform -rotate-90"
						viewBox="0 0 120 120"
					>
						<title>Severity Index Gauge</title>
						{/* Track */}
						<circle
							cx="60"
							cy="60"
							r={radius}
							fill="transparent"
							stroke="var(--color-secondary-bg)"
							strokeWidth="10"
						/>
						{/* Active Bar */}
						<motion.circle
							initial={{ strokeDashoffset: circumference }}
							animate={{ strokeDashoffset }}
							transition={{ duration: 1, ease: "easeOut" }}
							cx="60"
							cy="60"
							r={radius}
							fill="transparent"
							stroke={
								severityLabel === "Severe"
									? "var(--color-primary)"
									: "var(--color-ink)"
							}
							strokeWidth="10"
							strokeDasharray={circumference}
							strokeLinecap="round"
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
						<span className="font-display text-xl font-bold text-ink leading-none">
							{severityScore}
						</span>
						<span className="font-sans text-[9px] text-mute font-bold mt-1 uppercase leading-none">
							Score
						</span>
					</div>
				</div>

				{/* Scoring metadata */}
				<div className="flex flex-col gap-1">
					<span
						className={`inline-flex font-sans text-xs font-bold px-3 py-0.5 rounded-full self-start ${severityBadgeStyle}`}
					>
						{severityLabel} Concern
					</span>
					<p className="font-sans text-xs text-mute mt-2 leading-relaxed">
						Analyzed bounds report visual score indicators based on asymmetry,
						edge-irregularity, and coloring density.
					</p>
				</div>
			</div>

			{/* Diagnostic parameter values */}
			<div
				className={`grid ${size ? "grid-cols-3" : "grid-cols-2"} gap-4 pt-4 border-t border-hairline/30`}
			>
				{size && (
					<div className="flex flex-col leading-none">
						<span className="text-[10px] font-sans font-bold text-mute uppercase tracking-wider leading-none">
							Est. Size
						</span>
						<span className="font-display text-sm font-bold text-ink mt-1.5 leading-none">
							{size}
						</span>
					</div>
				)}
				<div className="flex flex-col leading-none">
					<span className="text-[10px] font-sans font-bold text-mute uppercase tracking-wider leading-none">
						Asymmetry
					</span>
					<span className="font-display text-sm font-bold text-ink mt-1.5 leading-none">
						{asymmetryScore}%
					</span>
				</div>
				<div className="flex flex-col leading-none">
					<span className="text-[10px] font-sans font-bold text-mute uppercase tracking-wider leading-none">
						Border Irreg.
					</span>
					<span className="font-display text-sm font-bold text-ink mt-1.5 leading-none">
						{borderIrregularity}%
					</span>
				</div>
			</div>
		</div>
	);
};
