import {
	IconAlertTriangle,
	IconBolt,
	IconCpu,
	IconInfoCircle,
	IconMapPin,
	IconRulerMeasure,
	IconShield,
	IconSparkles,
	IconStethoscope,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { Navigate, useLocation } from "react-router";
import { ResultHeader } from "@/components/result/ResultHeader";
import { ResultVisuals } from "@/components/result/ResultVisuals";
import { SeverityIndexMeter } from "@/components/result/SeverityIndexMeter";
import { mapPredictResponseToSkinCondition } from "@/utils/scan/scanService";
import { SEO } from "@/components/seo/SEO";

export const Result: React.FC = () => {
	const location = useLocation();
	const scanResult = location.state?.scanResult;
	const allowed = location.state?.allowed;

	// Secure authorization guard layer: Redirect to /scan if accessed directly
	if (!allowed || !scanResult) {
		return <Navigate to="/scan" replace />;
	}

	const condition = mapPredictResponseToSkinCondition(scanResult);
	const displayName = condition.name.replace(/_/g, " ");

	// Choose appropriate severity accent colors matching DESIGN.md tokens
	const severityColorClass =
		condition.severityLabel === "Severe"
			? "text-primary"
			: condition.severityLabel === "Moderate"
				? "text-amber-600"
				: "text-emerald-600";

	const severityBgClass =
		condition.severityLabel === "Severe"
			? "bg-error/5 border-error/20"
			: condition.severityLabel === "Moderate"
				? "bg-amber-500/5 border-amber-500/10"
				: "bg-emerald-500/5 border-emerald-500/10";

	return (
		<div className="flex flex-col gap-6 max-w-[1280px] w-full">
			<SEO
				title="Analysis Results - Dermasight"
				description="Access your custom AI skin lesion assessment, highlighting boundary asymmetry, size metrics, predicted conditions, and professional medical educational guidelines."
				robots="noindex, nofollow"
			/>
			<ResultHeader
				dateAnalyzed={condition.dateAnalyzed}
				conditionName={displayName}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
				{/* Left Column: Visuals & Metrics (Lg: col-span-5) */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="lg:col-span-5 flex flex-col gap-6"
				>
					<ResultVisuals
						imageUrl={condition.imageUrl}
						conditionName={displayName}
					/>

					<SeverityIndexMeter
						severityScore={condition.severityScore}
						severityLabel={condition.severityLabel}
						asymmetryScore={condition.asymmetryScore}
						borderIrregularity={condition.borderIrregularity}
					/>
				</motion.div>

				{/* Right Column: Educational details & Gen-AI assistant (Lg: col-span-7) */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
					className="lg:col-span-7 flex flex-col gap-6 h-full justify-between"
				>
					{/* Performance & Model Info Bar */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<div className="bg-surface-card border border-hairline/40 rounded-2xl p-3 flex flex-col gap-1 select-none">
							<div className="flex items-center gap-1.5 text-mute text-[10px] font-sans font-bold uppercase tracking-wider">
								<IconBolt size={14} className="text-primary" />
								Inference
							</div>
							<span className="font-display text-sm font-bold text-ink leading-tight mt-1">
								{condition.inferenceTimeMs.toFixed(1)} ms
							</span>
						</div>

						<div className="bg-surface-card border border-hairline/40 rounded-2xl p-3 flex flex-col gap-1 select-none">
							<div className="flex items-center gap-1.5 text-mute text-[10px] font-sans font-bold uppercase tracking-wider">
								<IconRulerMeasure size={14} className="text-mute" />
								Lesion Area
							</div>
							<span className="font-display text-sm font-bold text-ink leading-tight mt-1">
								{condition.areaPct.toFixed(2)} %
							</span>
						</div>

						<div className="bg-surface-card border border-hairline/40 rounded-2xl p-3 flex flex-col gap-1 select-none">
							<div className="flex items-center gap-1.5 text-mute text-[10px] font-sans font-bold uppercase tracking-wider">
								<IconMapPin size={14} className="text-mute" />
								Anatomic Site
							</div>
							<span className="font-display text-sm font-bold text-ink leading-tight mt-1 capitalize">
								{condition.anatomicalSite.replace("/", " / ")}
							</span>
						</div>

						<div className="bg-surface-card border border-hairline/40 rounded-2xl p-3 flex flex-col gap-1 select-none">
							<div className="flex items-center gap-1.5 text-mute text-[10px] font-sans font-bold uppercase tracking-wider">
								<IconCpu size={14} className="text-mute" />
								AI Engine
							</div>
							<span className="font-display text-xs font-bold text-ink leading-tight mt-1.5 truncate">
								{condition.groqModel.split("-")[0].toUpperCase()} Llama 3
							</span>
						</div>
					</div>

					{/* AI-Powered Analysis report */}
					<div className="bg-canvas border border-hairline/50 rounded-[32px] p-6 flex flex-col gap-6 flex-1 shadow-sm mt-3">
						<div className="border-b border-hairline/30 pb-4">
							<h3 className="font-display text-base font-bold text-ink leading-tight">
								AI Medical Summary
							</h3>
							<p className="font-sans text-[10px] text-mute leading-none mt-1">
								Contextual analysis generated via {condition.groqModel}
							</p>
						</div>

						<div className="flex flex-col gap-5 overflow-y-auto max-h-[480px] pr-1">
							{/* Section 1: Ini apa? */}
							{condition.description && (
								<div className="flex flex-col gap-1.5">
									<h4 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
										<IconInfoCircle size={18} className="text-primary" />
										1. Analisis Lesi (Ini apa?)
									</h4>
									<p className="font-sans text-xs text-charcoal leading-relaxed pl-6.5">
										{condition.description}
									</p>
								</div>
							)}

							{/* Section 2: Apa artinya buat saya? */}
							{condition.whatMeansForMe && (
								<div className="flex flex-col gap-1.5">
									<h4 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
										<IconSparkles size={18} className="text-amber-500" />
										2. Implikasi Klinis (Apa artinya buat saya?)
									</h4>
									<p className="font-sans text-xs text-charcoal leading-relaxed pl-6.5">
										{condition.whatMeansForMe}
									</p>
								</div>
							)}

							{/* Section 3: Rencana Tindakan */}
							{condition.whatShouldIDo && (
								<div className="flex flex-col gap-1.5">
									<h4 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
										<IconStethoscope size={18} className="text-primary" />
										3. Rencana Tindakan (Apa yang harus saya lakukan?)
									</h4>
									<div
										className={`p-4.5 rounded-2xl border ${severityBgClass} flex flex-col gap-2 pl-4.5`}
									>
										<div className="flex items-center gap-2 text-ink">
											<IconShield size={16} className={severityColorClass} />
											<span className="font-display text-xs font-bold">
												Rekomendasi Utama
											</span>
										</div>
										<p className="font-sans text-xs text-mute leading-relaxed pl-6">
											{condition.whatShouldIDo}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</motion.div>
			</div>

			{/* Bottom Clinical Disclaimer Box */}
			{condition.disclaimerText ? (
				<div className="bg-surface-card rounded-[24px] border border-hairline/50 p-5 flex gap-4 items-start shadow-none">
					<div className="text-primary shrink-0 mt-0.5 animate-pulse">
						<IconAlertTriangle size={20} />
					</div>
					<div>
						<h4 className="font-display text-xs font-bold text-ink leading-tight">
							Catatan Penting AI Assistant
						</h4>
						<p className="font-sans text-[11px] text-mute mt-1 leading-relaxed">
							{condition.disclaimerText}
						</p>
					</div>
				</div>
			) : (
				<div className="bg-surface-card rounded-[24px] border border-hairline/50 p-5 flex gap-4 items-start shadow-none">
					<div className="text-mute shrink-0 mt-0.5">
						<IconInfoCircle size={20} stroke={2} />
					</div>
					<div>
						<h4 className="font-display text-xs font-bold text-ink leading-tight">
							Severity Parameters Reference
						</h4>
						<p className="font-sans text-[11px] text-mute mt-1 leading-relaxed">
							The severity index score evaluates: (1){" "}
							<strong className="font-bold text-ink">Mole Asymmetry</strong>{" "}
							(highly irregular layouts increase scores); (2){" "}
							<strong className="font-bold text-ink">
								Border Irregularity
							</strong>{" "}
							(jagged or blurred borders score higher); (3){" "}
							<strong className="font-bold text-ink">Color Variations</strong>{" "}
							(multiple colors like dark black, deep brown, and red halos score
							higher). outputs are advisory only and must be confirmed via a
							professional physical skin biopsy.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Result;
