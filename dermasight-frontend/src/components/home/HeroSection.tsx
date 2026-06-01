import {
	IconActivity,
	IconArrowUpRight,
	IconBrandGoogleFit,
	IconCamera,
	IconPlus,
	IconShieldCheck,
	IconSparkles,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { Link } from "react-router";
import DoodleHand from "@/assets/home/doodle_hand.png";
import DoodleShield from "@/assets/home/doodle_shield.png";
import { Button } from "@/components/Button";
import ShinyText from "@/components/ShinyText";

export const HeroSection: React.FC = () => {
	return (
		<section className="relative w-full md:min-h-[calc(100vh-64px)] flex flex-col justify-between pt-8 pb-0 overflow-visible">
			<div className="relative w-full max-w-[1280px] mx-auto flex-1 flex flex-col justify-between items-center">
				{/* Floating Elements (Bobbing and rocking animations using Framer Motion) */}

				{/* Boilerplate floating image Left - change src here */}
				<motion.div
					initial={{ opacity: 0, y: -100, filter: "blur(8px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
					className="absolute left-[2%] top-[12%] xl:left-8 w-24 h-24 md:w-48 md:h-48 hidden lg:block select-none z-0"
				>
					<motion.div
						initial={{ rotate: -10 }}
						animate={{ y: [0, -12, 0], rotate: [-10, -14, -10] }}
						transition={{
							repeat: Infinity,
							duration: 4.2,
							ease: "easeInOut",
						}}
						className="w-full h-full rounded-[24px] overflow-hidden border-0 p-0 bg-transparent"
					>
						<img
							src={DoodleShield}
							alt="Boilerplate skin health display left"
							className="w-full h-full object-cover"
						/>
					</motion.div>
				</motion.div>

				{/* Boilerplate floating image Right - change src here */}
				<motion.div
					initial={{ opacity: 0, y: -100, filter: "blur(8px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
					className="absolute right-[2%] top-[18%] xl:right-8 w-24 h-24 md:w-32 md:h-32 hidden lg:block select-none z-0"
				>
					<motion.div
						initial={{ rotate: 12 }}
						animate={{ y: [0, -10, 0], rotate: [12, 8, 12] }}
						transition={{
							repeat: Infinity,
							duration: 4.8,
							ease: "easeInOut",
						}}
						className="w-full h-full rounded-[24px] overflow-hidden border-0 p-0 bg-transparent"
					>
						<img
							src={DoodleHand}
							alt="Boilerplate skin care display right"
							className="w-full h-full object-cover"
						/>
					</motion.div>
				</motion.div>

				{/* Floating Doodle Left Bottom - Tilted Capsule */}
				<motion.div
					initial={{ opacity: 0, y: -60 }}
					animate={{ opacity: 0.6, y: 0 }}
					transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
					className="absolute left-[30px] bottom-[28%] xl:left-20 hidden lg:block z-0"
				>
					<motion.div
						initial={{ rotate: 25 }}
						animate={{ y: [0, -6, 0] }}
						transition={{
							repeat: Infinity,
							duration: 3,
							ease: "easeInOut",
						}}
						className="w-10 h-5 border border-hairline/80 bg-surface-soft rounded-full shadow-xs"
					/>
				</motion.div>

				{/* Floating Doodle Right Bottom - Pulsing brand red plus/cross symbol */}
				<motion.div
					initial={{ opacity: 0, y: -150 }}
					animate={{ opacity: 0.8, y: 0 }}
					transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
					className="absolute right-[30px] bottom-[30%] xl:right-20 hidden lg:flex items-center justify-center z-0"
				>
					<motion.div
						animate={{ scale: [1, 1.15, 1] }}
						transition={{
							repeat: Infinity,
							duration: 2.7,
							ease: "easeInOut",
						}}
						className="text-primary flex items-center justify-center -rotate-25"
					>
						<IconPlus size={28} stroke={3} />
					</motion.div>
				</motion.div>

				{/* Floating Doodle Left Bottom - Pulsing brand heart icon */}
				<motion.div
					initial={{ opacity: 0, y: -150 }}
					animate={{ opacity: 0.8, y: 0 }}
					transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
					className="absolute left-[30px] bottom-[35%] xl:left-20 hidden lg:flex items-center justify-center z-0"
				>
					<motion.div
						animate={{ scale: [1, 1.15, 1] }}
						transition={{
							repeat: Infinity,
							duration: 2.5,
							ease: "easeInOut",
						}}
						className="text-primary flex items-center justify-center -rotate-25"
					>
						<IconBrandGoogleFit size={36} stroke={3} />
					</motion.div>
				</motion.div>

				{/* Hero Main Content Area (Centred vertically on screen on desktop) */}
				<div className="flex-1 flex flex-col justify-center items-center py-12 md:py-16 z-10 text-center w-full">
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="max-w-[850px] flex flex-col items-center gap-6"
					>
						{/* Pre-title badge */}
						<span className="inline-flex items-center gap-1.5 bg-surface-card border border-hairline rounded-full px-4 py-1.5 font-sans text-xs font-bold text-ink select-none">
							<span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
							AI-Powered Analysis
						</span>

						{/* Highlighted headline using ShinyText back as requested */}
						<h1 className="font-display text-5xl sm:text-6xl md:text-[72px] lg:text-[80px] font-extrabold tracking-[-1.5px] text-ink leading-[1.05] max-w-[850px] select-none flex flex-col items-center gap-2">
							<span>Clear Sight.</span>
							<ShinyText
								text="Better Skin Health"
								speed={2}
								delay={0}
								color="#e60023"
								shineColor="#ffffff"
								spread={120}
								direction="left"
								yoyo={false}
								pauseOnHover={false}
								disabled={false}
								className="text-primary font-extrabold"
							/>
						</h1>

						{/* Custom subtitle */}
						<p className="font-sans text-base md:text-lg text-mute max-w-[620px] leading-relaxed mt-2">
							Welcome to DermaSight, where accurate AI skin analysis and better
							skin health are not just aspirations, but destinations. Analyze
							pigmented skin anomalies instantly.
						</p>

						{/* CTA Button pair */}
						<div className="flex flex-col sm:flex-row items-center gap-3.5 mt-4 w-full sm:w-auto">
							<Link to="/scan" className="w-full sm:w-auto">
								<Button
									variant="primary"
									className="w-full sm:w-auto px-8 h-12 text-base flex items-center justify-center gap-2"
								>
									<IconCamera size={20} stroke={2.5} />
									Scan Skin Now
								</Button>
							</Link>
							<Link to="/library" className="w-full sm:w-auto">
								<Button
									variant="secondary"
									className="w-full sm:w-auto px-8 h-12 text-base flex items-center justify-center gap-2"
								>
									Explore Skin Library
									<IconArrowUpRight size={18} />
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>

				{/* Bottom Capabilities Row (Pinterest-cream styling with Tabler icons) */}
				<div className="w-full mt-auto border-t border-hairline/50 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline/50 animate-fade-in">
					{/* Capability 1 */}
					<div className="flex items-center gap-4 px-6 py-8 hover:bg-surface-soft/30 transition-colors duration-200">
						<div className="flex-shrink-0 w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
							<IconShieldCheck size={24} stroke={2} />
						</div>
						<div className="flex flex-col text-left">
							<h4 className="font-heading-md text-ink text-base font-bold">
								AI Skin Classification
							</h4>
							<p className="font-sans text-xs md:text-sm text-mute leading-normal">
								Convolutional neural network for instant classification of skin
								anomalies.
							</p>
						</div>
					</div>

					{/* Capability 2 */}
					<div className="flex items-center gap-4 px-6 py-8 hover:bg-surface-soft/30 transition-colors duration-200">
						<div className="flex-shrink-0 w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
							<IconActivity size={24} stroke={2} />
						</div>
						<div className="flex flex-col text-left">
							<h4 className="font-heading-md text-ink text-base font-bold">
								Visual Severity Metrics
							</h4>
							<p className="font-sans text-xs md:text-sm text-mute leading-normal">
								Extract boundary, asymmetry, and size parameters for early-stage
								tracking.
							</p>
						</div>
					</div>

					{/* Capability 3 */}
					<div className="flex items-center gap-4 px-6 py-8 hover:bg-surface-soft/30 transition-colors duration-200">
						<div className="flex-shrink-0 w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
							<IconSparkles size={24} stroke={2} />
						</div>
						<div className="flex flex-col text-left">
							<h4 className="font-heading-md text-ink text-base font-bold">
								Smart Gen-AI Analyzer
							</h4>
							<p className="font-sans text-xs md:text-sm text-mute leading-normal">
								Immediate follow-up about triggers and clinical guidelines.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
