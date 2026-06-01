import {
	IconCalendar,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconShieldCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/Button";
import type { LivePredictionResult } from "@/utils/scan/scanService";

interface ScanHistoryListProps {
	scans: LivePredictionResult[];
	onScanClick: (scanId: string) => void;
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring" as const,
			stiffness: 120,
			damping: 18,
		},
	},
};

export const ScanHistoryList: React.FC<ScanHistoryListProps> = ({
	scans,
	onScanClick,
}) => {
	const [currentPage, setCurrentPage] = useState(1);

	if (scans.length === 0) {
		return (
			<div className="border border-dashed border-hairline/80 rounded-[32px] flex flex-col items-center justify-center text-center gap-3 p-8 flex-1 min-h-[400px] bg-surface-card/20 select-none">
				<div className="w-12 h-12 rounded-full bg-secondary-bg flex items-center justify-center text-mute">
					<IconShieldCheck size={24} />
				</div>
				<div>
					<p className="font-sans text-sm font-bold text-ink leading-tight">
						No tracked skin scans yet
					</p>
					<p className="font-sans text-xs text-mute mt-1 leading-normal max-w-[280px]">
						Your visual severity progressions will appear here once you take a
						scan.
					</p>
				</div>
				<Link to="/scan" className="mt-2">
					<Button variant="primary">Start Your First Scan</Button>
				</Link>
			</div>
		);
	}

	const totalPages = Math.ceil(scans.length / 6);
	const activePage = Math.min(currentPage, totalPages || 1);
	const startIndex = (activePage - 1) * 6;
	const currentScans = scans.slice(startIndex, startIndex + 6);

	return (
		<div className="flex flex-col gap-3">
			<h3 className="font-display text-base font-bold text-ink leading-tight mb-2 select-none">
				Recent Scans
			</h3>
			<motion.div
				key={activePage}
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 md:grid-cols-2 gap-4"
			>
				{currentScans.map((scan) => (
					<motion.div key={scan.id} variants={itemVariants}>
						<button
							type="button"
							onClick={() => onScanClick(scan.id)}
							className="flex items-center gap-4 p-4 bg-surface-card hover:bg-secondary-bg border border-hairline/30 rounded-2xl text-left transition-colors select-none cursor-pointer outline-none w-full"
						>
							<img
								src={scan.imageUrl}
								alt={scan.name}
								className="w-16 h-16 rounded-xl object-cover border border-hairline"
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between gap-2">
									<span className="font-display text-sm font-bold text-ink truncate leading-tight">
										{scan.name}
									</span>
									<span className="text-[10px] text-mute flex items-center gap-1 font-medium shrink-0 leading-none">
										<IconCalendar size={12} />
										{scan.dateAnalyzed}
									</span>
								</div>
								<p className="font-sans text-xs text-mute mt-1 leading-none">
									Scientific Name:{" "}
									<span className="italic">{scan.scientificName}</span>
								</p>
								<div className="flex items-center gap-2 mt-2 leading-none">
									<span className="text-[9px] font-sans font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full leading-none">
										Confidence: {scan.confidence}%
									</span>
									<span className="text-[9px] font-sans font-bold bg-canvas text-ink px-2 py-0.5 rounded-full border border-hairline leading-none">
										Severity: {scan.severityScore}%
									</span>
								</div>
							</div>
							<div className="text-mute shrink-0">
								<IconChevronRight size={18} stroke={2.5} />
							</div>
						</button>
					</motion.div>
				))}
			</motion.div>

			{totalPages > 1 && (
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-hairline/35 select-none">
					<div className="text-xs font-sans text-mute">
						Page <strong className="font-bold text-ink">{activePage}</strong> of{" "}
						<strong className="font-bold text-ink">{totalPages}</strong>{" "}
						(showing {startIndex + 1}-{Math.min(startIndex + 6, scans.length)}{" "}
						of {scans.length} scans)
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setCurrentPage(1)}
							disabled={activePage === 1}
							className="w-8 h-8 flex items-center justify-center bg-secondary-bg hover:bg-secondary-pressed text-ink disabled:opacity-45 disabled:cursor-not-allowed rounded-xl transition-all duration-200 outline-none select-none active:scale-95 disabled:scale-100 shrink-0"
							aria-label="Newest Scans"
						>
							<IconChevronsLeft size={18} />
						</button>
						<button
							type="button"
							onClick={() => setCurrentPage(activePage - 1)}
							disabled={activePage === 1}
							className="w-8 h-8 flex items-center justify-center bg-secondary-bg hover:bg-secondary-pressed text-ink disabled:opacity-45 disabled:cursor-not-allowed rounded-xl transition-all duration-200 outline-none select-none active:scale-95 disabled:scale-100 shrink-0"
							aria-label="Previous Page"
						>
							<IconChevronLeft size={18} />
						</button>
						<button
							type="button"
							onClick={() => setCurrentPage(activePage + 1)}
							disabled={activePage === totalPages}
							className="w-8 h-8 flex items-center justify-center bg-secondary-bg hover:bg-secondary-pressed text-ink disabled:opacity-45 disabled:cursor-not-allowed rounded-xl transition-all duration-200 outline-none select-none active:scale-95 disabled:scale-100 shrink-0"
							aria-label="Next Page"
						>
							<IconChevronRight size={18} />
						</button>
						<button
							type="button"
							onClick={() => setCurrentPage(totalPages)}
							disabled={activePage === totalPages}
							className="w-8 h-8 flex items-center justify-center bg-secondary-bg hover:bg-secondary-pressed text-ink disabled:opacity-45 disabled:cursor-not-allowed rounded-xl transition-all duration-200 outline-none select-none active:scale-95 disabled:scale-100 shrink-0"
							aria-label="Oldest Scans"
						>
							<IconChevronsRight size={18} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
