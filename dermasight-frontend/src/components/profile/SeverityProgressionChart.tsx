import { IconActivity } from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useRef } from "react";
import type { LivePredictionResult } from "@/utils/scan/scanService";

interface SeverityProgressionChartProps {
	scans: LivePredictionResult[];
}

const POINT_SPACING = 180;
const PADDING_X = 50;
const CHART_HEIGHT = 140;
const PADDING_Y = 35;

export const SeverityProgressionChart: React.FC<
	SeverityProgressionChartProps
> = ({ scans }) => {
	// Sort historical items oldest to newest for chronological progress mapping (oldest left, newest right)
	const sortedScans = [...scans].sort((a, b) => {
		const dateA = a.createdAt
			? new Date(a.createdAt)
			: new Date(a.dateAnalyzed);
		const dateB = b.createdAt
			? new Date(b.createdAt)
			: new Date(b.dateAnalyzed);
		return dateA.getTime() - dateB.getTime();
	});

	const chartScrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll history chart to the far right on mount / when scans length changes
	useEffect(() => {
		if (chartScrollRef.current && sortedScans.length > 0) {
			chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
		}
	}, [sortedScans.length]);

	const chartWidth = PADDING_X * 2 + (sortedScans.length - 1) * POINT_SPACING;

	// Calculate progression line graph points using SVG with standard unskewed scale
	const buildLineChartPath = () => {
		if (sortedScans.length < 2) return "";

		const points = sortedScans.map((scan, i) => {
			const x = PADDING_X + i * POINT_SPACING;
			// Invert y: high severity is physically near top (close to padding), low severity near bottom
			const y =
				CHART_HEIGHT -
				PADDING_Y -
				(scan.severityScore / 100) * (CHART_HEIGHT - PADDING_Y * 2);
			return { x, y };
		});

		// Build SVG path string
		let pathStr = `M ${points[0].x} ${points[0].y}`;
		for (let i = 1; i < points.length; i++) {
			pathStr += ` L ${points[i].x} ${points[i].y}`;
		}
		return pathStr;
	};

	if (scans.length < 2) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.1 }}
			className="bg-surface-soft border border-hairline/60 rounded-3xl p-6 flex flex-col gap-4"
		>
			<div className="flex items-center gap-2">
				<IconActivity className="text-primary animate-pulse" size={20} />
				<h3 className="font-display text-sm font-bold text-ink leading-none">
					Severity Progression History
				</h3>
			</div>

			{/* SVG line graph chart */}
			<div
				ref={chartScrollRef}
				className="relative w-full overflow-x-auto pb-2 scrollbar-thin"
			>
				<div
					style={{
						width: `${chartWidth}px`,
						height: `${CHART_HEIGHT}px`,
					}}
					className="relative shrink-0 pt-2 mx-auto"
				>
					<svg
						className="w-full h-full"
						viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
					>
						<title>Severity Progress Chart</title>
						{/* Line path */}
						<motion.path
							d={buildLineChartPath()}
							fill="none"
							stroke="var(--color-primary)"
							strokeWidth="3.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{
								duration: 1.2,
								ease: "easeOut",
								delay: 0.2,
							}}
						/>
						{/* Graph nodes */}
						{sortedScans.map((scan, i) => {
							const x = PADDING_X + i * POINT_SPACING;
							const y =
								CHART_HEIGHT -
								PADDING_Y -
								(scan.severityScore / 100) * (CHART_HEIGHT - PADDING_Y * 2);
							return (
								<g key={scan.id}>
									<circle
										cx={x}
										cy={y}
										r="6"
										fill="var(--color-canvas)"
										stroke="var(--color-primary)"
										strokeWidth="3.5"
									/>
									<text
										x={x}
										y={y - 12}
										textAnchor="middle"
										className="font-sans font-bold text-[10px] fill-ink select-none"
									>
										{scan.severityScore}%
									</text>
									<text
										x={x}
										y={CHART_HEIGHT - 8}
										textAnchor="middle"
										className="font-sans font-medium text-[9px] fill-mute select-none"
									>
										{scan.dateAnalyzed}
									</text>
								</g>
							);
						})}
					</svg>
				</div>
			</div>
		</motion.div>
	);
};
