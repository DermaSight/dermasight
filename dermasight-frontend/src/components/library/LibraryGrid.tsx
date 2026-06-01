import { motion } from "motion/react";
import type React from "react";
import { PinCard } from "@/components/PinCard";
import type { LibraryArticle } from "@/utils/library/libraryService";

interface LibraryGridProps {
	articles: LibraryArticle[];
	onArticleSelect: (article: LibraryArticle) => void;
	searchQuery: string;
	activeCategory: string;
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring" as const,
			stiffness: 120,
			damping: 18,
		},
	},
};

export const LibraryGrid: React.FC<LibraryGridProps> = ({
	articles,
	onArticleSelect,
	searchQuery,
	activeCategory,
}) => {
	if (articles.length === 0) {
		return (
			<div className="h-64 flex flex-col items-center justify-center text-center gap-2">
				<p className="font-sans text-base font-bold text-ink">
					No articles found matching "{searchQuery}"
				</p>
				<p className="font-sans text-xs text-mute">
					Try switching categories or clearing your search input.
				</p>
			</div>
		);
	}

	return (
		<motion.div
			key={activeCategory + searchQuery}
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="masonry-col-1 sm:masonry-col-2 lg:masonry-col-3 gap-6"
		>
			{articles.map((art) => (
				<motion.div
					key={art.id}
					variants={cardVariants}
					className="masonry-item w-full"
				>
					<PinCard
						title={art.title}
						imageUrl={art.imageUrl}
						category={art.category}
						readTime={art.readTime}
						doctorName={art.doctorName}
						doctorTitle={art.doctorTitle}
						doctorAvatar={art.doctorAvatar}
						onClick={() => onArticleSelect(art)}
						className="!mb-0"
					/>
				</motion.div>
			))}
		</motion.div>
	);
};
