import { motion } from "motion/react";
import type React from "react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const Layout: React.FC = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		if (pathname) {
			window.scrollTo(0, 0);
		}
	}, [pathname]);

	return (
		<div className="flex flex-col min-h-screen bg-canvas selection:bg-primary/20 selection:text-primary">
			<Navbar />
			<motion.main
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
				className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8"
			>
				<Outlet />
			</motion.main>
			<Footer />
		</div>
	);
};
export default Layout;
