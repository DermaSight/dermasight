import {
	IconBrain,
	IconHeartRateMonitor,
	IconShieldLock,
} from "@tabler/icons-react";
import type React from "react";
import { Card } from "@/components/Card";
import { motion } from "motion/react";
import { SEO } from "@/components/seo/SEO";

const pageVariants = {
	initial: { opacity: 0, y: 15 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.35,
			ease: "easeOut" as const,
		},
	},
};

const About: React.FC = () => {
	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			className="flex flex-col gap-16 max-w-4xl mx-auto w-full select-none"
		>
			<SEO
				title="About - Dermasight"
				description="Learn about the team of full-stack developers, AI engineers, and data scientists behind DermaSight. Empowering user skin health with multi-modal AI tracking and public education."
			/>
			{/* Hero Section */}
			<section className="flex flex-col gap-6 text-center pt-8 md:pt-12">
				<h1 className="font-display-lg text-ink">
					Empowering Skin Health with AI
				</h1>
				<p className="text-body-text text-lg leading-relaxed max-w-2xl mx-auto">
					DermaSight is an advanced multi-modal tool designed to improve skin
					health tracking, provide educational insights, and bridge the gap
					between individuals and professional dermatological care.
				</p>
			</section>

			{/* Hero Video Block */}
			<div className="w-full aspect-video bg-surface-card rounded-2xl overflow-hidden border border-hairline/25 shadow-sm">
				<video
					src="/logo/dermasight-video.mp4"
					autoPlay
					muted
					playsInline
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Core Pillars */}
			<section className="flex flex-col gap-8">
				<h2 className="font-heading-xl text-ink text-center">
					Our Core Pillars
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card
						bg="surface-card"
						radius="md"
						interactive={false}
						variant="flat"
						className="h-full"
					>
						<Card.Content className="flex flex-col gap-4">
							<div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center text-ink shadow-sm border border-hairline/20">
								<IconBrain size={24} />
							</div>
							<h3 className="font-heading-md text-ink">AI-Powered Analysis</h3>
							<p className="text-sm text-mute leading-relaxed">
								Utilizing advanced machine learning models to provide
								early-stage severity scoring and educational resources based on
								visual input.
							</p>
						</Card.Content>
					</Card>

					<Card
						bg="surface-card"
						radius="md"
						interactive={false}
						variant="flat"
						className="h-full"
					>
						<Card.Content className="flex flex-col gap-4">
							<div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center text-ink shadow-sm border border-hairline/20">
								<IconHeartRateMonitor size={24} />
							</div>
							<h3 className="font-heading-md text-ink">Continuous Tracking</h3>
							<p className="text-sm text-mute leading-relaxed">
								Monitor skin condition changes over time with a structured
								timeline, helping you and your doctor make informed decisions.
							</p>
						</Card.Content>
					</Card>

					<Card
						bg="surface-card"
						radius="md"
						interactive={false}
						variant="flat"
						className="h-full"
					>
						<Card.Content className="flex flex-col gap-4">
							<div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center text-ink shadow-sm border border-hairline/20">
								<IconShieldLock size={24} />
							</div>
							<h3 className="font-heading-md text-ink">Privacy First</h3>
							<p className="text-sm text-mute leading-relaxed">
								Your health data is highly sensitive. We implement strict
								privacy controls to ensure your personal information and images
								remain secure.
							</p>
						</Card.Content>
					</Card>
				</div>
			</section>

			{/* Team Section */}
			<section className="flex flex-col gap-8 select-none">
				<div className="flex flex-col gap-2 text-center">
					<h2 className="font-heading-xl text-ink">Meet the Team</h2>
					<p className="font-sans text-xs md:text-sm text-mute leading-relaxed max-w-md mx-auto">
						The passionate developers, AI engineers, and data scientists behind
						DermaSight.
					</p>
					<span className="inline-flex items-center self-center bg-primary/10 text-primary text-[10px] md:text-xs font-bold px-3.5 py-1 rounded-full font-sans mt-2 shadow-sm">
						Team ID: CC26-PSU233
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
					{[
						{ name: "M. Faridh Maulana", role: "Full Stack Developer" },
						{
							name: "Mustaqim Nawahhudi Ma’arif",
							role: "Full Stack Developer",
						},
						{ name: "Lalu Olfata Vedora Zurji", role: "AI Engineer" },
						{ name: "Muhammad Arya Hidayat", role: "AI Engineer" },
						{ name: "Sindi Prasetiyani", role: "Data Scientist" },
						{ name: "Abhi Shek Kumar", role: "Data Scientist" },
					].map((member) => (
						<Card
							key={member.name}
							bg="surface-card"
							radius="md"
							interactive={false}
							variant="flat"
							className="h-full border border-hairline/35 shadow-none hover:shadow-sm transition-all duration-300"
						>
							<Card.Content className="flex flex-col gap-2 p-5 text-center">
								<h4 className="font-display text-xs md:text-sm font-bold text-ink leading-tight">
									{member.name}
								</h4>
								<p className="font-sans text-[10px] md:text-xs text-mute leading-none mt-0.5">
									{member.role}
								</p>
							</Card.Content>
						</Card>
					))}
				</div>
			</section>

			{/* Team/Mission statement */}
			<section className="bg-surface-soft rounded-[32px] p-8 md:p-12 text-center flex flex-col gap-6 border border-hairline/25">
				<h2 className="font-heading-lg text-ink">Our Mission</h2>
				<p className="text-body-text leading-relaxed max-w-2xl mx-auto">
					We believe everyone deserves access to high-quality information about
					their skin health. While we are not a replacement for medical
					professionals, we strive to be the ultimate companion tool providing
					immediate insights, actionable educational resources, and a structured
					history to share with your dermatologist.
				</p>
			</section>

			{/* Supported By Section */}
			<section className="flex flex-col gap-6 text-center py-2 select-none border-b border-hairline/20 pb-12">
				<span className="font-sans text-[10px] font-bold text-mute uppercase tracking-widest leading-none">
					Supported By
				</span>
				<div className="bg-surface-dark rounded-2xl p-6 md:p-8 flex flex-wrap items-center justify-center gap-8 md:gap-14 shadow-inner border border-hairline/20">
					<img
						src="/logo/logo-dicoding.png"
						alt="Dicoding Logo"
						className="h-8 md:h-9 w-auto object-contain hover:scale-105 transition-transform duration-200 brightness-0 invert"
					/>
					<img
						src="/logo/logo-codingcamp.png"
						alt="Coding Camp Logo"
						className="h-8 md:h-9 w-auto object-contain hover:scale-105 transition-transform duration-200"
					/>
					<img
						src="/logo/logo-dbs-foundation.png"
						alt="DBS Foundation Logo"
						className="h-10 md:h-11 w-auto object-contain hover:scale-105 transition-transform duration-200"
					/>
				</div>
			</section>
		</motion.div>
	);
};

export default About;
