import { IconArrowLeft, IconBook, IconClock } from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/Button";
import {
	type LibraryArticle,
	useLibraryService,
} from "@/utils/library/libraryService";
import { renderMarkdown } from "@/utils/markdown/markdownParser";
import { SEO } from "@/components/seo/SEO";

export const LibraryDetail: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const { fetchArticleBySlug } = useLibraryService();
	const [article, setArticle] = useState<LibraryArticle | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadArticle = async () => {
			if (!slug) return;
			setLoading(true);
			setError(null);
			try {
				const data = await fetchArticleBySlug(slug);
				setArticle(data);
			} catch (err: unknown) {
				console.error("Failed to load article detail:", err);
				setError(
					err instanceof Error
						? err.message
						: "Failed to load article details.",
				);
			} finally {
				setLoading(false);
			}
		};

		loadArticle();
	}, [slug, fetchArticleBySlug]);

	const pageVariants = {
		initial: { opacity: 0, y: 20 },
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring" as const,
				stiffness: 100,
				damping: 15,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	};

	// 1. Loading Skeleton Layout
	if (loading) {
		return (
			<div className="w-full max-w-[1280px] mx-auto py-8 px-4 flex flex-col gap-6 select-none">
				<SEO
					title="Loading Article - Dermasight"
					description="Please wait while we fetch the latest skin health educational article from our clinical library."
				/>
				{/* Back Button Skeleton */}
				<div className="w-24 h-8 bg-secondary-bg/50 rounded-full animate-pulse" />

				{/* Banner Skeleton */}
				<div className="w-full aspect-[21/9] bg-secondary-bg/50 rounded-[32px] animate-pulse" />

				{/* Metadata Skeleton */}
				<div className="flex gap-2">
					<div className="w-24 h-6 bg-secondary-bg/50 rounded-full animate-pulse" />
					<div className="w-16 h-6 bg-secondary-bg/50 rounded-full animate-pulse" />
				</div>

				{/* Title Skeleton */}
				<div className="w-3/4 h-10 bg-secondary-bg/50 rounded-xl animate-pulse mt-4" />

				{/* Author Skeleton */}
				<div className="flex items-center gap-3 border-b border-hairline/30 pb-4">
					<div className="w-12 h-12 rounded-full bg-secondary-bg/50 animate-pulse" />
					<div className="flex flex-col gap-2">
						<div className="w-32 h-4 bg-secondary-bg/50 rounded animate-pulse" />
						<div className="w-48 h-3 bg-secondary-bg/50 rounded animate-pulse" />
					</div>
				</div>

				{/* Paragraph Skeletons */}
				<div className="flex flex-col gap-4 mt-2">
					<div className="w-full h-4 bg-secondary-bg/50 rounded animate-pulse" />
					<div className="w-full h-4 bg-secondary-bg/50 rounded animate-pulse" />
					<div className="w-5/6 h-4 bg-secondary-bg/50 rounded animate-pulse" />
				</div>
			</div>
		);
	}

	// 2. Error State Layout
	if (error || !article) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="w-full max-w-[600px] mx-auto py-20 px-4 text-center flex flex-col items-center justify-center gap-6"
			>
				<SEO
					title="Article Not Found - Dermasight"
					description="The requested skin care article could not be found. Explore our main skin health library for alternative resources."
					robots="noindex, nofollow"
				/>
				<div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error">
					<IconBook size={32} />
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="font-display text-xl font-bold text-ink">
						Article Not Found
					</h2>
					<p className="font-sans text-sm text-mute max-w-sm leading-relaxed">
						{error ||
							"The article you are trying to view is unavailable or does not exist."}
					</p>
				</div>
				<Link to="/library">
					<Button variant="secondary" className="flex items-center gap-2">
						<IconArrowLeft size={16} />
						Back to Library
					</Button>
				</Link>
			</motion.div>
		);
	}

	// 3. Complete Premium Article Layout
	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			className="w-full max-w-[1280px] mx-auto py-8 px-4 flex flex-col gap-6 md:gap-8 select-text"
		>
			<SEO
				title={`${article.title} - Dermasight`}
				description={article.description}
				keywords={[
					`skin health`,
					`dermatology`,
					`education`,
					...article.tags,
				].join(", ")}
				image={article.imageUrl}
				type="article"
			/>
			{/* Back Link */}
			<motion.div variants={itemVariants} className="flex justify-start">
				<Link to="/library">
					<Button
						variant="secondary"
						className="flex items-center gap-2 bg-surface-card border border-hairline/40 hover:bg-secondary-bg rounded-full !h-9 px-4 active:scale-95"
					>
						<IconArrowLeft size={16} stroke={2.5} />
						Back to Library
					</Button>
				</Link>
			</motion.div>

			{/* Banner Image */}
			<motion.div
				variants={itemVariants}
				className="relative aspect-[21/9] w-full overflow-hidden bg-secondary-bg rounded-[32px] border border-hairline/40 shadow-sm"
			>
				<img
					src={article.imageUrl}
					alt={article.title}
					className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
				/>
				{/* Category Chips Floating */}
				<div className="absolute bottom-4 left-6 z-10 flex flex-wrap gap-2">
					{article.tags.map((tag) => (
						<span
							key={tag}
							className="bg-canvas text-ink text-xs font-bold px-3 py-1 rounded-full shadow-sm font-sans"
						>
							{tag}
						</span>
					))}
					<span className="bg-surface-dark text-canvas text-[11px] font-bold px-3 py-1 rounded-full shadow-sm font-sans flex items-center gap-1">
						<IconClock size={12} />
						{article.readTime}
					</span>
				</div>
			</motion.div>

			{/* Article Title */}
			<motion.h1
				variants={itemVariants}
				className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight tracking-tight mt-2"
			>
				{article.title}
			</motion.h1>

			{/* Doctor/Author Attribution Block */}
			<motion.div
				variants={itemVariants}
				className="flex flex-row items-center justify-between border-b border-hairline/30 pb-5"
			>
				<div className="flex items-center gap-3">
					<img
						src={article.doctorAvatar}
						alt={article.doctorName}
						className="w-12 h-12 rounded-full object-cover border border-hairline"
					/>
					<div>
						<p className="font-sans text-sm font-bold text-ink leading-tight">
							{article.doctorName}
						</p>
						<p className="font-sans text-xs text-mute leading-none mt-1">
							{article.doctorTitle}
						</p>
					</div>
				</div>

				<div className="text-right flex flex-col items-end gap-1 font-sans text-xs text-mute select-none shrink-0">
					<span className="font-bold text-ink">{article.readTime}</span>
					<span className="text-[10px] text-mute leading-none">
						{article.createdAt
							? new Date(article.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})
							: ""}
					</span>
				</div>
			</motion.div>

			{/* Markdown Content Block */}
			<motion.div variants={itemVariants}>
				{renderMarkdown(article.content)}
			</motion.div>

			{/* Medical disclaimer panel */}
			<motion.div
				variants={itemVariants}
				className="mt-6 p-5 rounded-[24px] bg-surface-card border border-hairline/60 flex gap-4 items-start shadow-none"
			>
				<div className="text-primary shrink-0 mt-0.5">
					<IconBook size={22} stroke={2.2} />
				</div>
				<div className="flex-1">
					<h5 className="font-display text-sm font-bold text-ink leading-tight">
						Medical Education Disclaimer
					</h5>
					<p className="font-sans text-xs text-mute mt-1.5 leading-relaxed">
						This library provides general educational resources compiled from
						reliable sources and vetted by board-certified dermatologists. It is
						not intended to provide professional clinical guidance or
						diagnostics. Always consult a qualified physician or professional
						dermatologist for specific skincare concerns, diagnoses, and
						targeted treatment courses.
					</p>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default LibraryDetail;
