import type React from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

export const ScanHeader: React.FC = () => {
	return (
		<div className="text-center md:text-left flex flex-col gap-2">
			<h1 className="font-display-lg text-ink leading-tight select-none">
				AI Pigmented Skin Lesion Scanner
			</h1>
			<p className="font-sans text-sm text-mute leading-relaxed">
				Upload a clear, high-resolution photo of the pigmented skin lesion or
				click on one of our preloaded dermatological sample cases below to test
				the instant diagnostic pipeline.
			</p>
			{/* Medical Disclaimer Badge */}
			<MedicalDisclaimer />
		</div>
	);
};
