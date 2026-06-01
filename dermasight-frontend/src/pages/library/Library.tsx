import {
	IconAlertCircle,
	IconArrowRight,
	IconBook,
	IconClock,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/Button";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { PinCard } from "@/components/PinCard";
import { useAuth } from "@/utils/auth-context/AuthContext";
import {
	type LibraryArticle,
	useLibraryService,
} from "@/utils/library/libraryService";
import { SEO } from "@/components/seo/SEO";

export const Library: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { fetchArticles } = useLibraryService();

	const [articles, setArticles] = useState<LibraryArticle[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	// Load Articles on mount
	const loadArticles = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchArticles();
			setArticles(data);
		} catch (err: unknown) {
			console.error("Failed to load library articles:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to connect to the medical library database.",
			);
		} finally {
			setLoading(false);
		}
	}, [fetchArticles]);

	useEffect(() => {
		loadArticles();
	}, [loadArticles]);

	// Filter articles based on search query string
	const filteredArticles = articles.filter((art) => {
		return (
			art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
		);
	});

	// Reset to Page 1 when search query changes
	useEffect(() => {
		setCurrentPage(1);
	}, []);

	// Calculate pagination offsets and indices:
	// Page 1: 1 Featured Hero Card + 4 Grid Cards (indices 0 to 4)
	// Page 2+: 6 Grid Cards (start: 5 + (page - 2) * 6)
	const getPageIndices = (page: number) => {
		if (page === 1) {
			return { start: 0, end: 5 };
		}
		const start = 5 + (page - 2) * 6;
		return { start, end: start + 6 };
	};

	const totalArticles = filteredArticles.length;
	const totalPages =
		totalArticles <= 5 ? 1 : 1 + Math.ceil((totalArticles - 5) / 6);

	const { start, end } = getPageIndices(currentPage);
	const currentSlicedArticles = filteredArticles.slice(start, end);

	// Page 1 layouts
	const newestArticle =
		currentPage === 1 && currentSlicedArticles.length > 0
			? currentSlicedArticles[0]
			: null;
	const gridArticles =
		currentPage === 1 ? currentSlicedArticles.slice(1) : currentSlicedArticles;

	const handleArticleSelect = (slug: string) => {
		navigate(`/library/${slug}`);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

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

	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			className="flex flex-col gap-8 max-w-[1280px] mx-auto w-full select-none"
		>
			<SEO
				title="Library - Dermasight"
				description="Explore our clinical database of skin conditions. Read peer-reviewed articles written and vetted by board-certified dermatologists on symptoms, triggers, and care."
			/>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<LibraryHeader />

				{/* Admin shortcut button */}
				{user?.role === "ADMIN" && (
					<Link
						to="/admin/library"
						className="self-center sm:self-auto shrink-0"
					>
						<Button
							variant="primary"
							className="rounded-full !h-10 px-5 flex items-center gap-1.5 shadow active:scale-95 cursor-pointer font-sans"
						>
							Manage Database
							<IconArrowRight size={16} stroke={2.5} />
						</Button>
					</Link>
				)}
			</div>

			<LibraryFilters
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			{loading ? (
				/* High-aesthetic Pinterest style skeleton card loading grid */
				<div className="flex flex-col gap-8">
					<div className="w-full aspect-[21/9] bg-surface-card rounded-[32px] border border-hairline/20 animate-pulse" />
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse select-none">
						{[1, 2, 4, 5].map((idx) => (
							<div
								key={idx}
								className="w-full bg-surface-card rounded-2xl border border-hairline/20 p-0 mb-2 flex flex-col gap-4 overflow-hidden"
							>
								<div className="w-full aspect-[4/3] bg-secondary-bg/60" />
								<div className="p-4 flex flex-col gap-3">
									<div className="w-3/4 h-5 bg-secondary-bg/60 rounded" />
									<div className="w-1/2 h-3 bg-secondary-bg/60 rounded mt-2" />
								</div>
							</div>
						))}
					</div>
				</div>
			) : error ? (
				/* Error layout */
				<div className="py-16 text-center flex flex-col items-center justify-center gap-4">
					<div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
						<IconAlertCircle size={24} />
					</div>
					<div className="flex flex-col gap-1.5">
						<p className="font-sans text-sm font-bold text-ink">
							Database Connection Error
						</p>
						<p className="font-sans text-xs text-mute max-w-sm leading-relaxed">
							{error}
						</p>
					</div>
					<Button
						variant="secondary"
						onClick={loadArticles}
						className="rounded-full !h-9 px-4 mt-2"
					>
						Retry Loading
					</Button>
				</div>
			) : totalArticles === 0 ? (
				/* Empty search results state */
				<div className="h-64 flex flex-col items-center justify-center text-center gap-2 select-none">
					<div className="w-12 h-12 rounded-full bg-secondary-bg flex items-center justify-center text-mute mb-2">
						<IconBook size={22} />
					</div>
					<p className="font-sans text-sm font-bold text-ink">
						No articles found matching "{searchQuery}"
					</p>
					<p className="font-sans text-xs text-mute">
						Try clearing your search terms or testing different keywords.
					</p>
				</div>
			) : (
				/* Grid contents area */
				<div className="flex flex-col gap-8">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentPage + searchQuery}
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -15 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col gap-8"
						>
							{/* Newest Hero Banner at the top of Page 1 */}
							{currentPage === 1 && newestArticle && (
								// biome-ignore lint/a11y/noStaticElementInteractions: .
								// biome-ignore lint/a11y/useKeyWithClickEvents: .
								<div
									onClick={() => handleArticleSelect(newestArticle.slug)}
									className="group w-full bg-surface-card hover:bg-canvas rounded-[32px] border border-hairline/35 shadow-none hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:grid md:grid-cols-12 items-stretch cursor-pointer select-none"
								>
									{/* Banner Left Image */}
									<div className="relative md:col-span-7 aspect-[16/10] md:aspect-auto min-h-[220px] overflow-hidden bg-secondary-bg">
										<img
											src={newestArticle.imageUrl}
											alt={newestArticle.title}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<div className="absolute top-4 left-4 z-10">
											<span className="bg-canvas text-ink text-xs font-bold px-3 py-1 rounded-full shadow-sm font-sans">
												Newest Publication
											</span>
										</div>
									</div>

									{/* Banner Right Details */}
									<div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between gap-6">
										<div className="flex flex-col gap-4">
											<div className="flex flex-wrap gap-1.5">
												{newestArticle.tags.map((tag) => (
													<span
														key={tag}
														className="bg-canvas/80 text-ink text-[10px] font-bold rounded-full px-2.5 py-0.5 border border-hairline/30"
													>
														{tag}
													</span>
												))}
												<span className="bg-surface-dark text-canvas text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ml-auto">
													<IconClock size={10} />
													{newestArticle.readTime}
												</span>
											</div>

											<h2 className="font-display text-xl md:text-2xl font-bold text-ink leading-tight group-hover:text-primary transition-colors duration-200">
												{newestArticle.title}
											</h2>
											<p className="font-sans text-xs text-mute leading-relaxed">
												{newestArticle.description}
											</p>
											<div className="flex items-center gap-2 text-[10px] md:text-xs text-mute font-sans select-none">
												<span className="font-bold text-charcoal">
													{newestArticle.readTime}
												</span>
												<span className="w-1 h-1 rounded-full bg-ash/45" />
												<span>
													Published on{" "}
													{newestArticle.createdAt
														? new Date(
																newestArticle.createdAt,
															).toLocaleDateString("en-US", {
																year: "numeric",
																month: "long",
																day: "numeric",
															})
														: ""}
												</span>
											</div>
										</div>

										{/* Author info */}
										<div className="flex items-center gap-3 border-t border-hairline/30 pt-4 mt-auto">
											<img
												src={newestArticle.doctorAvatar}
												alt={newestArticle.doctorName}
												className="w-9 h-9 rounded-full object-cover border border-hairline"
											/>
											<div>
												<p className="font-sans text-xs font-bold text-ink leading-none">
													{newestArticle.doctorName}
												</p>
												<p className="font-sans text-[10px] text-mute leading-none mt-1">
													{newestArticle.doctorTitle}
												</p>
											</div>
											<Button
												variant="primary"
												className="rounded-full !h-8 px-4 font-sans text-xs flex items-center gap-1.5 ml-auto shadow active:scale-95"
											>
												Read
												<IconArrowRight size={14} stroke={2.5} />
											</Button>
										</div>
									</div>
								</div>
							)}

							{/* Rest of items in grid-cols-2 */}
							{gridArticles.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									{gridArticles.map((art) => (
										<PinCard
											key={art.id}
											title={art.title}
											imageUrl={art.imageUrl}
											category={art.category}
											readTime={art.readTime}
											doctorName={art.doctorName}
											doctorTitle={art.doctorTitle}
											doctorAvatar={art.doctorAvatar}
											onClick={() => handleArticleSelect(art.slug)}
											className="!mb-0"
										/>
									))}
								</div>
							)}
						</motion.div>
					</AnimatePresence>

					{/* Custom Pagination Pill controls centered at bottom */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-2 mt-8 border-t border-hairline/25 pt-6 select-none">
							{/* Previous Page */}
							<Button
								variant="secondary"
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="rounded-full !h-9 px-4 active:scale-95 text-xs border border-hairline/30"
							>
								Prev
							</Button>

							{/* Page numbers list */}
							<div className="flex items-center gap-1">
								{Array.from({ length: totalPages }).map((_, i) => {
									const pageNum = i + 1;
									const isActive = currentPage === pageNum;
									return (
										<button
											key={pageNum}
											type="button"
											onClick={() => handlePageChange(pageNum)}
											className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors cursor-pointer select-none border-none outline-none active:scale-90 ${
												isActive
													? "bg-primary text-canvas shadow"
													: "bg-surface-card hover:bg-secondary-bg text-ink border border-hairline/20"
											}`}
										>
											{pageNum}
										</button>
									);
								})}
							</div>

							{/* Next Page */}
							<Button
								variant="secondary"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="rounded-full !h-9 px-4 active:scale-95 text-xs border border-hairline/30"
							>
								Next
							</Button>
						</div>
					)}
				</div>
			)}
		</motion.div>
	);
};

export default Library;
