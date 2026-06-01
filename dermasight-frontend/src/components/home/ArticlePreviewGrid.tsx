import { IconArrowUpRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { Link } from "react-router";
import { Button } from "@/components/Button";
import { PinCard } from "@/components/PinCard";
import type { LibraryArticle } from "@/utils/library/libraryService";

interface ArticlePreviewGridProps {
	articles: LibraryArticle[];
	onArticleClick: (article: LibraryArticle) => void;
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring" as const,
			stiffness: 100,
			damping: 15,
		},
	},
};

export const ArticlePreviewGrid: React.FC<ArticlePreviewGridProps> = ({
	articles,
	onArticleClick,
}) => {
	return (
		<section className="py-12 border-t border-hairline/30">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
				<div className="flex flex-col gap-2 max-w-[550px]">
					<h2 className="font-heading-xl text-ink">Educational Insights</h2>
					<p className="font-sans text-sm text-mute leading-relaxed">
						Read beautifully styled skincare guidelines, allergen triggers, and
						winter preventive tips reviewed by dermatologists.
					</p>
				</div>
				<Link to="/library" className="shrink-0">
					<Button variant="secondary" className="flex items-center gap-1.5">
						View Full Library
						<IconArrowUpRight size={16} />
					</Button>
				</Link>
			</div>

			{/* Grid Layout (3 Column desktop / 2 Column tablet / 1 Column Mobile) */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, margin: "-80px" }}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
			>
				{articles.map((art) => (
					<motion.div
						key={art.id}
						variants={itemVariants}
						className="h-full flex flex-col"
					>
						<PinCard
							title={art.title}
							imageUrl={art.imageUrl}
							category={art.category}
							readTime={art.readTime}
							doctorName={art.doctorName}
							doctorTitle={art.doctorTitle}
							doctorAvatar={art.doctorAvatar}
							onClick={() => onArticleClick(art)}
						/>
					</motion.div>
				))}
			</motion.div>
		</section>
	);
};
