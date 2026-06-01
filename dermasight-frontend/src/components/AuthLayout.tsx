import {
	IconHeart,
	IconShieldCheck,
	IconStethoscope,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/utils/auth-context/AuthContext";

interface AuthLayoutProps {
	children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	if (isAuthenticated) return;

	return (
		<div className="min-h-screen bg-surface-soft flex items-center justify-center p-4 md:p-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="bg-canvas w-full max-w-[1024px] min-h-[600px] rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
			>
				{/* Left Side - Illustration/Branding */}
				<div className="bg-surface-card w-full md:w-1/2 p-8 md:p-12 hidden md:flex flex-col items-center justify-center relative">
					{/* Decorative Pinterest-style pill in the corner */}
					<div className="absolute top-8 left-8 bg-canvas text-ink text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-20">
						DermaSight
					</div>

					{/* Illustration / Graphic */}
					<div className="relative w-72 h-72 flex items-center justify-center mb-8">
						<div className="absolute inset-0 bg-success-pale rounded-full opacity-50 blur-3xl"></div>

						{/* Top Health Icon */}
						<motion.div
							initial={{ scale: 0.75, opacity: 0, x: -25 }}
							animate={{
								scale: 1,
								opacity: 1,
								x: 0,
								transition: { delay: 0.2 },
							}}
							whileHover={{ rotate: 45 }}
							className="absolute -top-4 right-8 bg-primary text-canvas p-4 rounded-full rotate-12 z-10 shadow-lg "
						>
							<IconHeart size={32} stroke={1.5} />
						</motion.div>

						{/* Bottom Health Icons */}
						<motion.div
							initial={{ scale: 0.75, opacity: 0, x: 25 }}
							animate={{
								scale: 1,
								opacity: 1,
								x: 0,
								transition: { delay: 0.6 },
							}}
							whileHover={{ rotate: 45 }}
							className="absolute -bottom-2 left-8 bg-focus-outer text-canvas p-5 rounded-full shadow-lg -rotate-6 z-10"
						>
							<IconStethoscope size={36} stroke={1.5} />
						</motion.div>

						{/* Docter Icons */}
						<motion.div
							initial={{ scale: 0.75, opacity: 0, x: -25 }}
							animate={{
								scale: 1,
								opacity: 1,
								x: 0,
								transition: { delay: 0.4 },
							}}
							whileHover={{ rotate: 45 }}
							className="absolute bottom-6 right-0 bg-canvas text-ink p-4 rounded-full shadow-lg rotate-12 z-10"
						>
							<IconShieldCheck
								className="text-primary"
								size={24}
								stroke={1.5}
							/>
						</motion.div>

						{/* 3D Logo in the Middle */}
						<motion.div
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1.25, opacity: 1 }}
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
						>
							<img
								src="/logo/dermasight_3d.png"
								alt="DermaSight 3D Logo"
								className=" object-contain drop-shadow-xl scale-125"
							/>
						</motion.div>
					</div>

					<div className="text-center mt-4">
						<h2 className="font-heading-lg text-ink mb-2">
							Understand Your Skin
						</h2>
						<p className="text-body-md text-mute max-w-xs mx-auto">
							Advanced dermatology insights combined with a beautifully simple
							experience.
						</p>
					</div>
				</div>

				{/* Right Side - Form Container */}
				<div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
						className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center"
					>
						{children}
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

export default AuthLayout;
