import { IconAlertTriangle } from "@tabler/icons-react";
import type React from "react";

export const MedicalDisclaimer: React.FC = () => {
	return (
		<div className="bg-surface-card border border-primary/20 rounded-2xl p-4 flex gap-4 items-start shadow-none">
			<div className="text-primary shrink-0 mt-0.5">
				<IconAlertTriangle size={24} stroke={2} />
			</div>
			<div className="flex-1">
				<h4 className="font-display text-sm font-bold text-ink leading-tight">
					Important Skin Health Disclaimer
				</h4>
				<p className="font-sans text-xs text-mute mt-1 leading-relaxed">
					DermaSight uses artificial intelligence for early-stage skin disease
					and severity scoring. It provides educational resources, common
					triggers, and home first aid guidance. It{" "}
					<strong className="font-bold text-ink">is not</strong> a replacement
					for professional clinical diagnostics, physical biopsy, or clinical
					consultations. Always consult a board-certified dermatologist for
					medical diagnosis and treatment plans.
				</p>
			</div>
		</div>
	);
};
