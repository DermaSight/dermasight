import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArticlePreviewGrid } from "@/components/home/ArticlePreviewGrid";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { HeroSection } from "@/components/home/HeroSection";
import {
	type LibraryArticle,
	useLibraryService,
} from "@/utils/library/libraryService";
import { SEO } from "@/components/seo/SEO";

const Home: React.FC = () => {
	const navigate = useNavigate();
	const { fetchArticles } = useLibraryService();
	const [articles, setArticles] = useState<LibraryArticle[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadTrendingArticles = async () => {
			try {
				const data = await fetchArticles();
				// Take the 3 newest articles
				setArticles(data.slice(0, 3));
			} catch (err) {
				console.error("Failed to load trending articles:", err);
			} finally {
				setLoading(false);
			}
		};
		loadTrendingArticles();
	}, [fetchArticles]);

	return (
		<>
			<SEO
				title="Dermasight - Clear Sight, Better Skin Health"
				description="An advanced AI-powered skin health platform for instant pigmented anomaly classification, visual severity parameter extraction (symmetry, boundary, diameter), and custom dermatologist-curated educational guidelines."
			/>
			<HeroSection />
			<FeatureShowcase />
			{loading ? (
				<section className="py-12 border-t border-hairline/30 animate-pulse select-none">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
						<div className="flex flex-col gap-2 max-w-[550px] w-full">
							<div className="h-8 w-48 bg-secondary-bg/50 rounded-xl" />
							<div className="h-4 w-80 bg-secondary-bg/40 rounded-lg mt-2.5" />
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="bg-surface-card border border-hairline/25 rounded-[24px] overflow-hidden aspect-[4/3.1] p-0 flex flex-col gap-4"
							>
								<div className="w-full h-[60%] bg-secondary-bg/45" />
								<div className="px-4 pb-4 flex flex-col gap-2.5 flex-1">
									<div className="h-5 w-5/6 bg-secondary-bg/45 rounded-lg" />
									<div className="h-3.5 w-1/2 bg-secondary-bg/35 rounded-md mt-1" />
								</div>
							</div>
						))}
					</div>
				</section>
			) : (
				articles.length > 0 && (
					<ArticlePreviewGrid
						articles={articles}
						onArticleClick={(art) => navigate(`/library/${art.slug}`)}
					/>
				)
			)}
		</>
	);
};

export default Home;
