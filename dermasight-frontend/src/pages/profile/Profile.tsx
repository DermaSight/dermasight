import {
	IconAlertTriangle,
	IconBolt,
	IconCpu,
	IconInfoCircle,
	IconMapPin,
	IconRulerMeasure,
	IconSparkles,
	IconStethoscope,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ScanHistoryList } from "@/components/profile/ScanHistoryList";
import { SeverityProgressionChart } from "@/components/profile/SeverityProgressionChart";
import { ResultVisuals } from "@/components/result/ResultVisuals";
import { SeverityIndexMeter } from "@/components/result/SeverityIndexMeter";
import { useAuth } from "@/utils/auth-context/AuthContext";
import { useProtectedFetch } from "@/utils/protected-fetch/ProtectedFetch";
import {
	type LivePredictionResult,
	mapPredictResponseToSkinCondition,
	type ScanPredictionData,
} from "@/utils/scan/scanService";
import { SEO } from "@/components/seo/SEO";

export const Profile: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated, user, loading: authLoading } = useAuth();
	const protectedFetch = useProtectedFetch();
	const [scans, setScans] = useState<LivePredictionResult[]>([]);
	const [selectedScan, setSelectedScan] = useState<LivePredictionResult | null>(
		null,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			navigate("/");
		}
	}, [authLoading, isAuthenticated, navigate]);

	useEffect(() => {
		const fetchHistory = async () => {
			setLoading(true);
			try {
				const response = await protectedFetch(
					"/predict/history?limit=100&offset=0",
					{
						method: "GET",
					},
				);
				if (response.ok) {
					const res = await response.json();
					const apiScans = res.data?.predictions || [];
					const mapped = apiScans.map((item: ScanPredictionData) =>
						mapPredictResponseToSkinCondition(item),
					);
					setScans(mapped);
				}
			} catch (error) {
				console.error("Failed to fetch scan history:", error);
			} finally {
				setLoading(false);
			}
		};

		if (isAuthenticated) {
			fetchHistory();
		}
	}, [isAuthenticated, protectedFetch]);

	if (authLoading) {
		return (
			<div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
				<span className="font-sans text-sm font-bold text-mute animate-pulse">
					Loading Profile...
				</span>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="max-w-[1280px] mx-auto flex flex-col gap-8 w-full relative min-h-[calc(100vh-140px)]">
			<SEO
				title="Profile - Dermasight"
				description="Track your skin health journey over time. View chronological scan history, monitor severity score trends, review saved clinical articles, and manage your account parameters."
				robots="noindex, nofollow"
			/>
			<ProfileHeader
				name={user?.name || "Jane Doe"}
				username={user?.email?.split("@")[0] || "janedoe"}
				createdAt={user?.createdAt}
				scansCount={scans.length}
			/>

			<div className="mt-4 flex-1 flex flex-col">
				<motion.div
					key="scans"
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className="flex flex-col gap-6 flex-1 h-full"
				>
					{loading ? (
						<div className="h-64 flex items-center justify-center">
							<span className="font-sans text-sm font-bold text-mute animate-pulse">
								Loading scan history...
							</span>
						</div>
					) : (
						<>
							{/* Progression chart only loads if we have history data */}
							{scans.length >= 2 && <SeverityProgressionChart scans={scans} />}

							{/* Scans history checklist */}
							<ScanHistoryList
								scans={scans}
								onScanClick={(id) => {
									const matched = scans.find((item) => item.id === id);
									if (matched) {
										setSelectedScan(matched);
									}
								}}
							/>
						</>
					)}
				</motion.div>
			</div>

			{/* Custom History Details Modal Scrim (matches Result.tsx UI) */}
			<AnimatePresence>
				{selectedScan && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						{/* Backdrop Scrim */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-charcoal/40 backdrop-blur-md "
							onClick={() => setSelectedScan(null)}
						/>

						{/* Modal Card Content Container */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{
								opacity: 1,
								scale: 1,
								y: 0,
								transition: {
									type: "spring",
									duration: 0.4,
									bounce: 0.15,
								},
							}}
							exit={{
								opacity: 0,
								scale: 0.9,
								y: 20,
								transition: {
									duration: 0.25,
								},
							}}
							className="relative z-10 w-full max-w-[1000px] max-h-[85vh] overflow-y-auto bg-canvas rounded-[32px] border border-hairline/60 shadow-2xl p-6 md:p-8 flex flex-col gap-6 scrollbar-thin"
						>
							{/* Close Button & Header */}
							<div className="flex items-center justify-between border-b border-hairline/30 pb-4">
								<div>
									<h2 className="font-display text-lg font-bold text-ink">
										Historical Diagnosis Result
									</h2>
									<p className="font-sans text-xs text-mute mt-1">
										Analyzed on {selectedScan.dateAnalyzed}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setSelectedScan(null)}
									className="bg-surface-card hover:bg-secondary-bg rounded-full w-10 h-10 flex items-center justify-center text-ink border border-hairline/50 transition-colors cursor-pointer text-sm font-bold active:scale-90"
								>
									✕
								</button>
							</div>

							{/* Visual Columns identical to Result.tsx */}
							<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
								{/* Left Column: Visuals & Metrics */}
								<div className="md:col-span-5 flex flex-col gap-6">
									<ResultVisuals
										imageUrl={selectedScan.imageUrl}
										conditionName={selectedScan.name.replace(/_/g, " ")}
									/>

									<SeverityIndexMeter
										severityScore={selectedScan.severityScore}
										severityLabel={selectedScan.severityLabel}
										asymmetryScore={selectedScan.asymmetryScore}
										borderIrregularity={selectedScan.borderIrregularity}
									/>
								</div>

								{/* Right Column: AI Details & Performance Capsules */}
								<div className="md:col-span-7 flex flex-col gap-6 justify-between h-full">
									{/* Metadata bar */}
									<div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
										<div className="bg-surface-card border border-hairline/40 rounded-2xl p-2.5 flex flex-col gap-0.5 select-none">
											<div className="flex items-center gap-1 text-mute text-[9px] font-sans font-bold uppercase tracking-wider">
												<IconBolt size={12} className="text-primary" />
												Inference
											</div>
											<span className="font-display text-xs font-bold text-ink mt-0.5">
												{selectedScan.inferenceTimeMs.toFixed(1)} ms
											</span>
										</div>

										<div className="bg-surface-card border border-hairline/40 rounded-2xl p-2.5 flex flex-col gap-0.5 select-none">
											<div className="flex items-center gap-1 text-mute text-[9px] font-sans font-bold uppercase tracking-wider">
												<IconRulerMeasure size={12} className="text-mute" />
												Lesion Area
											</div>
											<span className="font-display text-xs font-bold text-ink mt-0.5">
												{selectedScan.areaPct.toFixed(2)} %
											</span>
										</div>

										<div className="bg-surface-card border border-hairline/40 rounded-2xl p-2.5 flex flex-col gap-0.5 select-none">
											<div className="flex items-center gap-1 text-mute text-[9px] font-sans font-bold uppercase tracking-wider">
												<IconMapPin size={12} className="text-mute" />
												Anatomic Site
											</div>
											<span className="font-display text-xs font-bold text-ink mt-0.5 capitalize">
												{selectedScan.anatomicalSite.replace("/", " / ")}
											</span>
										</div>

										<div className="bg-surface-card border border-hairline/40 rounded-2xl p-2.5 flex flex-col gap-0.5 select-none">
											<div className="flex items-center gap-1 text-mute text-[9px] font-sans font-bold uppercase tracking-wider">
												<IconCpu size={12} className="text-mute" />
												AI Engine
											</div>
											<span className="font-display text-[10px] font-bold text-ink mt-1 truncate">
												{selectedScan.groqModel.split("-")[0].toUpperCase()}{" "}
												Llama 3
											</span>
										</div>
									</div>

									{/* Analysis Card */}
									<div className="bg-canvas border border-hairline/40 rounded-[24px] p-5 flex flex-col gap-5 flex-1 mt-2">
										<div className="border-b border-hairline/25 pb-3">
											<h3 className="font-display text-sm font-bold text-ink">
												AI Medical Summary
											</h3>
										</div>

										<div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-1">
											{selectedScan.description && (
												<div className="flex flex-col gap-1">
													<h4 className="flex items-center gap-2 font-display text-xs font-bold text-ink">
														<IconInfoCircle
															size={16}
															className="text-primary"
														/>
														1. Analisis Lesi (Ini apa?)
													</h4>
													<p className="font-sans text-[11px] text-charcoal leading-relaxed pl-6">
														{selectedScan.description}
													</p>
												</div>
											)}

											{selectedScan.whatMeansForMe && (
												<div className="flex flex-col gap-1">
													<h4 className="flex items-center gap-2 font-display text-xs font-bold text-ink">
														<IconSparkles
															size={16}
															className="text-amber-500"
														/>
														2. Implikasi Klinis (Apa artinya buat saya?)
													</h4>
													<p className="font-sans text-[11px] text-charcoal leading-relaxed pl-6">
														{selectedScan.whatMeansForMe}
													</p>
												</div>
											)}

											{selectedScan.whatShouldIDo && (
												<div className="flex flex-col gap-1">
													<h4 className="flex items-center gap-2 font-display text-xs font-bold text-ink">
														<IconStethoscope
															size={16}
															className="text-primary"
														/>
														3. Rencana Tindakan (Apa yang harus saya lakukan?)
													</h4>
													<div
														className={`p-3.5 rounded-xl border flex flex-col gap-1.5 pl-3.5 ${
															selectedScan.severityLabel === "Severe"
																? "bg-error/5 border-error/15"
																: selectedScan.severityLabel === "Moderate"
																	? "bg-amber-500/5 border-amber-500/10"
																	: "bg-emerald-500/5 border-emerald-500/10"
														}`}
													>
														<p className="font-sans text-[11px] text-mute leading-relaxed">
															{selectedScan.whatShouldIDo}
														</p>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Bottom Disclaimer */}
							{selectedScan.disclaimerText && (
								<div className="bg-surface-card rounded-2xl border border-hairline/50 p-4 flex gap-3.5 items-start">
									<div className="text-primary shrink-0 mt-0.5">
										<IconAlertTriangle size={18} />
									</div>
									<p className="font-sans text-[10px] text-mute leading-relaxed">
										{selectedScan.disclaimerText}
									</p>
								</div>
							)}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Profile;
