import { IconBook, IconClock, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { Button } from "@/components/Button";
import type { LibraryArticle } from "@/utils/library/libraryService";

interface ArticleModalProps {
	article: LibraryArticle | null;
	onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
	article,
	onClose,
}) => {
	return (
		<AnimatePresence>
			{article && (
				<>
					{/* Scrim Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.5 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black z-50 cursor-zoom-out"
					/>

					{/* Modal Box */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ type: "spring", duration: 0.4 }}
							className="relative w-full max-w-[800px] bg-canvas rounded-[32px] overflow-hidden shadow-2xl flex flex-col pointer-events-auto max-h-[90vh]"
						>
							{/* Top Close circular button */}
							<div className="absolute top-4 right-4 z-20">
								<Button
									variant="icon"
									onClick={onClose}
									className="bg-canvas/90 backdrop-blur-sm shadow-md"
								>
									<IconX size={20} />
								</Button>
							</div>

							{/* Banner Image */}
							<div className="relative aspect-[21/9] w-full overflow-hidden bg-secondary-bg">
								<img
									src={article.imageUrl}
									alt={article.title}
									className="w-full h-full object-cover"
								/>
								<div className="absolute bottom-4 left-6 z-10 flex gap-2">
									<span className="bg-canvas text-ink text-xs font-bold px-3 py-1 rounded-full shadow-sm font-sans">
										{article.category}
									</span>
									<span className="bg-surface-dark text-canvas text-[11px] font-bold px-3 py-1 rounded-full shadow-sm font-sans flex items-center gap-1">
										<IconClock size={12} />
										{article.readTime}
									</span>
								</div>
							</div>

							{/* Article content scroll zone */}
							<div className="p-6 md:p-8 overflow-y-auto flex flex-col gap-6 select-text">
								{/* Doctor Attribution */}
								<div className="flex items-center gap-3 border-b border-hairline/30 pb-4">
									<img
										src={article.doctorAvatar}
										alt={article.doctorName}
										className="w-12 h-12 rounded-full object-cover border border-hairline"
									/>
									<div>
										<p className="font-sans text-sm font-bold text-ink leading-tight">
											{article.doctorName}
										</p>
										<p className="font-sans text-xs text-mute leading-none mt-0.5">
											{article.doctorTitle}
										</p>
									</div>
								</div>

								{/* Article Title */}
								<h2 className="font-display text-2xl font-bold text-ink leading-tight">
									{article.title}
								</h2>

								{/* Content paragraphs */}
								<div className="flex flex-col gap-4 text-charcoal font-sans text-sm md:text-base leading-relaxed">
									{article.content
										.split(/\n+/)
										.filter((p) => p.trim() !== "")
										.map((para) => (
											<p key={para.slice(0, 50)}>{para}</p>
										))}
								</div>

								{/* Safety footnote */}
								<div className="mt-4 p-4 rounded-2xl bg-surface-card border border-hairline/50 flex gap-3 items-start">
									<div className="text-primary shrink-0 mt-0.5">
										<IconBook size={20} />
									</div>
									<div className="flex-1">
										<h5 className="font-display text-xs font-bold text-ink leading-tight">
											Medical Education Disclaimer
										</h5>
										<p className="font-sans text-[11px] text-mute mt-1 leading-normal">
											This library provides general educational resources
											compiled from reliable sources and vetted by
											dermatologists. It is not intended to be clinical
											guidance. Always consult a physician for individual
											skincare diagnoses and treatment courses.
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};
