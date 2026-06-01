import {
	IconArrowUp,
	IconBrandInstagram,
	IconBrandX,
	IconMail,
} from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import type React from "react";
import { Link } from "react-router";
import { useAuth } from "@/utils/auth-context/AuthContext";

export const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	const { isAuthenticated } = useAuth();

	const parentVariants: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				delayChildren: 0.2,
				staggerChildren: 0.2,
			},
		},
	};

	const childVariants: Variants = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
		},
	};

	return (
		<motion.footer
			variants={parentVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true }}
			className="w-full bg-canvas pt-8 font-sans flex flex-col"
		>
			{/* Floating Card Container */}
			<motion.div variants={childVariants} className="w-full mx-auto">
				<div className="w-full bg-surface-card text-ink overflow-hidden border-t border-hairline flex flex-col">
					{/* Main Content Grid */}
					<div className="w-full max-w-[1280px] mx-auto p-8 md:p-12 lg:p-16 flex flex-col md:flex-row justify-between gap-12 md:gap-8">
						{/* Left Side: Brand, Description, Socials, Back to Top */}
						<div className="flex flex-col gap-6 md:max-w-md w-full">
							<div className="flex items-center gap-3 select-none">
								<div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-canvas border border-hairline/50">
									<img
										src="/logo/dermasight_red_outline.png"
										alt="DermaSight Logo"
										className="w-6 h-6 object-contain"
									/>
								</div>
								<span className="font-display text-xl font-bold tracking-tight text-ink">
									DermaSight
								</span>
							</div>

							<p className="text-sm leading-relaxed text-mute">
								Empowering users with advanced AI multi-modal tools to improve
								skin health tracking, analysis, and dermatologist-informed
								insights.
							</p>

							{/* Social Media Links */}
							<div className="flex items-center gap-4 text-mute mt-2">
								<a
									href="https://x.com"
									aria-label="X (Twitter)"
									className="hover:text-ink hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
								>
									<IconBrandX size={20} />
								</a>
								<a
									href="mailto:support@dermasight.my.id"
									aria-label="Email"
									className="hover:text-ink hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
								>
									<IconMail size={20} />
								</a>
								<a
									href="https://instagram.com"
									aria-label="Instagram"
									className="hover:text-ink hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
								>
									<IconBrandInstagram size={20} />
								</a>
							</div>

							{/* Back to Top Button */}
							<button
								type="button"
								onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
								className="mt-2 w-fit bg-secondary-bg hover:bg-secondary-pressed text-ink font-bold text-xs rounded-2xl h-10 px-4 flex items-center gap-2 transition-all duration-150 cursor-pointer select-none"
							>
								<IconArrowUp size={14} />
								BACK TO TOP
							</button>
						</div>

						{/* Right Side: Site Map & Legal Lists */}
						<div className="flex flex-col sm:flex-row gap-12 sm:gap-16 md:gap-24 lg:gap-32 sm:pr-4">
							{/* Site Map Column */}
							<div className="flex flex-col gap-5 min-w-[120px]">
								<h5 className="text-xs font-bold text-ink tracking-widest uppercase">
									Site Map
								</h5>
								<ul className="flex flex-col gap-3.5 p-0 m-0 list-none">
									<li>
										<Link
											to="/"
											className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
										>
											Home
										</Link>
									</li>
									<li>
										<Link
											to="/scan"
											className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
										>
											AI Scan
										</Link>
									</li>
									<li>
										<Link
											to="/library"
											className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
										>
											Skin Library
										</Link>
									</li>
									{isAuthenticated ? (
										<li>
											<Link
												to="/profile"
												className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
											>
												User Profile
											</Link>
										</li>
									) : (
										<>
											<li>
												<Link
													to="/sign-in"
													className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
												>
													Sign In
												</Link>
											</li>
											<li>
												<Link
													to="/sign-up"
													className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
												>
													Sign Up
												</Link>
											</li>
										</>
									)}
								</ul>
							</div>

							{/* Legal Column */}
							<div className="flex flex-col gap-5 min-w-[120px]">
								<h5 className="text-xs font-bold text-ink tracking-widest uppercase">
									Legal
								</h5>
								<ul className="flex flex-col gap-3.5 p-0 m-0 list-none">
									<li>
										<Link
											to="/about"
											className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
										>
											About DermaSight
										</Link>
									</li>
									<li>
										<Link
											to="/policy"
											className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
										>
											Privacy Policy
										</Link>
									</li>
									<li>
										<Link
											to="/terms"
											className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
										>
											Terms of Service
										</Link>
									</li>
									<li>
										<Link
											to="/contact"
											className="text-sm font-medium text-mute hover:text-ink hover:underline transition-colors duration-150 block"
										>
											Help & Support Center
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Full-width Copyright Accent Bottom Row */}
			<motion.div
				variants={childVariants}
				className="w-full bg-primary py-4 px-6 text-center select-none"
			>
				<p className="text-[10px] sm:text-xs font-semibold tracking-wider text-white uppercase m-0 leading-none">
					Copyright &copy; {currentYear} DermaSight. All Rights Reserved.
				</p>
			</motion.div>
		</motion.footer>
	);
};
