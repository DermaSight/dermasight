import { IconChevronLeft, IconShieldCheck } from "@tabler/icons-react";
import type React from "react";
import { Link } from "react-router";

interface ResultHeaderProps {
	dateAnalyzed: string;
	conditionName: string;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({
	dateAnalyzed,
	conditionName,
}) => {
	return (
		<>
			{/* Back link to scan center */}
			<Link
				to="/scan"
				className="inline-flex items-center gap-1 font-sans text-sm font-bold text-mute hover:text-ink select-none self-start"
			>
				<IconChevronLeft size={16} stroke={2.5} />
				Back to Scanner
			</Link>

			{/* Title row */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="font-display-lg text-ink leading-tight select-none">
						AI Scan Report
					</h1>
					<p className="font-sans text-xs text-mute leading-none">
						Analyzed on {dateAnalyzed}
					</p>
				</div>

				{/* Result Accent Title */}
				<div className="flex items-center gap-3">
					<div className="flex flex-col items-end leading-none">
						<p className="font-sans text-xs text-mute font-medium leading-none">
							Diagnosed Condition
						</p>
						<p className="font-display text-xl font-bold text-ink mt-1 leading-none">
							{conditionName}
						</p>
					</div>
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
						<IconShieldCheck size={24} stroke={2} />
					</div>
				</div>
			</div>
		</>
	);
};
