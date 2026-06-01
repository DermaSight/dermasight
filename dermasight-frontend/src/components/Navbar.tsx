import {
	IconCamera,
	IconGridPattern,
	IconInfoCircle,
	IconMenu2,
	IconSmartHome,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/Button";
import { useAuth } from "@/utils/auth-context/AuthContext";
import { useClickOutside } from "@/utils/click-outside/UseClickOutside";

export const Navbar: React.FC = () => {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const { isAuthenticated, logout, user } = useAuth();
	const profileRef = useRef<HTMLDivElement>(null);

	useClickOutside(profileRef, () => {
		if (isProfileOpen) setIsProfileOpen(false);
	});

	const navLinks = [
		{ path: "/", name: "Home", icon: <IconSmartHome size={18} /> },
		{ path: "/scan", name: "AI Scan", icon: <IconCamera size={18} /> },
		{
			path: "/library",
			name: "Skin Library",
			icon: <IconGridPattern size={18} />,
		},
	];

	const activeIndicator = (
		<motion.div
			layoutId="activeTabIndicator"
			layout="x"
			className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
			transition={{ type: "spring", stiffness: 380, damping: 30 }}
		/>
	);

	return (
		<div className="sticky top-0 z-50 w-full">
			<nav className="w-full h-16 border-b border-hairline/30 glass-chrome">
				<div className="max-w-[1280px] h-full mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center gap-2 select-none group shrink-0"
					>
						<div className="w-8 h-8 rounded-full">
							<img
								src="/logo/dermasight_red_outline.png"
								alt="Logo DermaSight"
							/>
						</div>
						<span className="font-display text-xl font-bold tracking-tight text-ink">
							Derma<span className="text-primary">Sight</span>
						</span>
					</Link>

					{/* Desktop Navigation Links */}
					<div className="hidden md:flex overflow-hidden items-center gap-1 h-full">
						{navLinks.map((link) => {
							const isActive =
								link.path === "/"
									? location.pathname === "/"
									: location.pathname.startsWith(link.path);
							return (
								<Link
									key={link.path}
									to={link.path}
									className={`relative flex items-center gap-1.5 px-4 h-full font-sans text-sm font-bold transition-colors select-none ${
										isActive ? "text-primary" : "text-mute hover:text-ink"
									}`}
								>
									{link.icon}
									{link.name}
									{isActive && activeIndicator}
								</Link>
							);
						})}
					</div>

					{/* CTA Actions */}
					<div className="hidden md:flex items-center gap-2">
						{isAuthenticated ? (
							<div
								className="relative flex justify-center items-center"
								ref={profileRef}
							>
								<Button
									variant="icon"
									onClick={() => setIsProfileOpen(!isProfileOpen)}
									className="flex items-center gap-1 border border-hairline cursor-pointer"
								>
									<IconUser className="text-mute" />
								</Button>
								<AnimatePresence>
									{isProfileOpen && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="absolute top-[140%] bg-surface-card px-6 py-4 w-[150px] flex flex-col justify-start items-start gap-2 rounded-lg text-mute text-sm border border-hairline"
										>
											<Link
												className="hover:text-ink transition-colors"
												to="/profile"
												onClick={() => setIsProfileOpen(false)}
											>
												User Profile
											</Link>
											{user?.role === "ADMIN" && (
												<Link
													className="hover:text-ink transition-colors font-bold text-primary"
													to="/admin/library"
													onClick={() => setIsProfileOpen(false)}
												>
													Library
												</Link>
											)}
											<button
												className="hover:text-ink transition-colors cursor-pointer"
												onClick={() => {
													setIsProfileOpen(false);
													logout();
												}}
												type="button"
											>
												Logout
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<Link to="/sign-in">
								<Button
									variant="secondary"
									className="flex items-center gap-1 cursor-pointer"
								>
									Sign In
								</Button>
							</Link>
						)}
						<Link to="/about">
							<Button
								type="button"
								variant="secondary"
								className="w-10 h-10 !px-0 !py-0 shrink-0 cursor-pointer"
							>
								<IconInfoCircle />
							</Button>
						</Link>
					</div>

					{/* Mobile Toggle */}
					<div className="md:hidden flex items-center gap-2">
						<Link to="/scan">
							<Button
								variant="icon"
								className="text-primary hover:bg-primary/10"
							>
								<IconCamera size={20} stroke={2.5} />
							</Button>
						</Link>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-card hover:bg-secondary-bg text-ink border-none outline-none select-none transition-colors"
						>
							{isOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Side Drawer Scrim overlay */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Scrim Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 top-16 bg-black/40 z-40"
						/>
						{/* Drawer Content */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
							className="fixed top-16 right-0 bottom-0 w-[280px] bg-canvas border-l border-hairline/30 p-6 z-50 flex flex-col gap-6 shadow-xl"
						>
							<div className="flex flex-col gap-2">
								{navLinks.map((link) => {
									const isActive =
										link.path === "/"
											? location.pathname === "/"
											: location.pathname.startsWith(link.path);
									return (
										<Link
											key={link.path}
											to={link.path}
											onClick={() => setIsOpen(false)}
											className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-base font-bold transition-all ${
												isActive
													? "bg-primary/5 text-primary"
													: "text-mute hover:bg-surface-card hover:text-ink"
											}`}
										>
											{link.icon}
											{link.name}
										</Link>
									);
								})}
							</div>

							<div className="border-t border-hairline/30 pt-6 flex flex-col gap-2">
								{isAuthenticated ? (
									<div className="flex flex-col gap-2">
										<Link onClick={() => setIsOpen(false)} to="/profile">
											<Button variant="secondary" className="w-full">
												User Profile
											</Button>
										</Link>
										{user?.role === "ADMIN" && (
											<Link
												onClick={() => setIsOpen(false)}
												to="/admin/library"
											>
												<Button
													variant="secondary"
													className="w-full !text-primary border border-primary/20"
												>
													Library
												</Button>
											</Link>
										)}
										<Button
											onClick={() => {
												setIsOpen(false);
												logout();
											}}
											variant="primary"
											className="w-full"
										>
											Logout
										</Button>
									</div>
								) : (
									<>
										<Link to="/scan" onClick={() => setIsOpen(false)}>
											<Button
												variant="primary"
												className="w-full flex justify-center items-center gap-2"
											>
												<IconCamera size={18} stroke={2.5} />
												Scan Now
											</Button>
										</Link>
										<Link to="/sign-in" onClick={() => setIsOpen(false)}>
											<Button
												variant="secondary"
												className="w-full flex justify-center items-center gap-2"
											>
												Sign In
											</Button>
										</Link>
										<Link to="/sign-up" onClick={() => setIsOpen(false)}>
											<Button
												variant="secondary"
												className="w-full flex justify-center items-center gap-2"
											>
												Sign Up
											</Button>
										</Link>
									</>
								)}
								<Link to="/about" onClick={() => setIsOpen(false)}>
									<Button
										variant="secondary"
										className="w-full flex justify-center items-center gap-2"
									>
										<IconInfoCircle size={18} stroke={2.5} />
										About
									</Button>
								</Link>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};
