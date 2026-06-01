import {
	IconActivity,
	IconArrowUpRight,
	IconShieldCheck,
	IconSparkles,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { Link } from "react-router";
import CapabilitesOne from "@/assets/home/capabilities-1.png";
import CapabilitesTwo from "@/assets/home/capabilities-2.png";
import CapabilitesThree from "@/assets/home/capabilities-3.png";
import { Button } from "@/components/Button";

const featureRowVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut" as const,
		},
	},
};

const FEATURES = [
	{
		title: "Intelligent AI Pigmented Skin Classification",
		desc: "Harness a highly optimized Convolutional Neural Network (CNN) built to classify pigmented skin anomalies (Melanoma, Melanocytic Nevi, Basal Cell Carcinoma) instantly with diagnostic confidence metrics.",
		color: "bg-primary/5 border-primary/20",
		icon: <IconShieldCheck className="text-primary" size={32} />,
		image: CapabilitesOne,
	},
	{
		title: "Dermatological Severity Indexing",
		desc: "Extract advanced visual metrics like color irregularity, boundary asymmetry, and diameter size to formulate an early-stage severity indicator scoring with a percentage.",
		color: "bg-surface-card border-hairline",
		icon: <IconActivity className="text-ink" size={32} />,
		image: CapabilitesTwo,
	},
	{
		title: "Smart Gen-AI Analyzer",
		desc: "A safe, pre-prompted Generative AI dermatologist analyzer built directly into your reports. Immediate follow-up questions about triggers, first aid guidelines, and clinical next steps.",
		color: "bg-primary/5 border-primary/20",
		icon: <IconSparkles className="text-primary" size={32} />,
		image: CapabilitesThree,
	},
];

export const FeatureShowcase: React.FC = () => {
	return (
		<section className="flex flex-col gap-16 md:gap-24 py-12 border-t border-hairline/30">
			<div className="text-center max-w-[600px] mx-auto flex flex-col gap-2">
				<h2 className="font-heading-xl text-ink">Advanced Capabilities</h2>
				<p className="font-sans text-sm text-mute leading-relaxed">
					Our core feature sets work in unison to provide visual insights,
					metric scoring, and immediate safe medical education.
				</p>
			</div>

			<div className="flex flex-col gap-16 md:gap-24">
				{FEATURES.map((feat, idx) => {
					const isEven = idx % 2 === 0;
					return (
						<motion.div
							key={feat.title}
							variants={featureRowVariants}
							initial="hidden"
							whileInView="show"
							viewport={{ once: true, margin: "-100px" }}
							className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${
								isEven ? "" : "lg:flex-row-reverse"
							}`}
						>
							{/* Image Card Container */}
							<div className="w-full lg:w-1/2">
								<div className="relative rounded-[32px] overflow-hidden bg-canvas border border-hairline/50 p-2 shadow-none hover:shadow-lg transition-all duration-300 flex items-center justify-center">
									<img
										src={feat.image}
										alt={feat.title}
										className="object-contain h-full w-full"
									/>
								</div>
							</div>

							{/* Description Panel */}
							<div className="w-full lg:w-1/2 flex flex-col items-start gap-4">
								<div
									className={`p-3 rounded-2xl border ${feat.color} flex items-center justify-center shrink-0`}
								>
									{feat.icon}
								</div>
								<h3 className="font-heading-lg text-ink">{feat.title}</h3>
								<p className="font-sans text-base text-mute leading-relaxed">
									{feat.desc}
								</p>
								<Link to="/scan">
									<Button
										variant="secondary"
										className="flex items-center gap-1 mt-2"
									>
										Try Scanning Now
										<IconArrowUpRight size={16} />
									</Button>
								</Link>
							</div>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
};
