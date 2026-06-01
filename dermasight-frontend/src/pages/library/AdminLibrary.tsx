import {
	IconAlertTriangle,
	IconArrowLeft,
	IconEdit,
	IconExternalLink,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/Button";
import { ArticleFormModal } from "@/components/library/ArticleFormModal";
import { useAuth } from "@/utils/auth-context/AuthContext";
import {
	type LibraryArticle,
	useLibraryService,
} from "@/utils/library/libraryService";
import { SEO } from "@/components/seo/SEO";

export const AdminLibrary: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated, user, loading: authLoading } = useAuth();
	const { fetchArticles, deleteArticle } = useLibraryService();

	const [articles, setArticles] = useState<LibraryArticle[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Modal States
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedArticle, setSelectedArticle] = useState<LibraryArticle | null>(
		null,
	);
	const [articleToDelete, setArticleToDelete] = useState<LibraryArticle | null>(
		null,
	);
	const [deleting, setDeleting] = useState(false);

	// 1. Role Authorization Security Guard
	useEffect(() => {
		if (!authLoading) {
			if (!isAuthenticated || user?.role !== "ADMIN") {
				// Immediate redirect back to public library page
				navigate("/library");
			}
		}
	}, [authLoading, isAuthenticated, user, navigate]);

	// 2. Load Article Database
	const loadArticles = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchArticles();
			setArticles(data);
		} catch (err: unknown) {
			console.error("Failed to load admin articles list:", err);
			setError(
				err instanceof Error ? err.message : "Failed to load database records.",
			);
		} finally {
			setLoading(false);
		}
	}, [fetchArticles]);

	useEffect(() => {
		if (isAuthenticated && user?.role === "ADMIN") {
			loadArticles();
		}
	}, [isAuthenticated, user, loadArticles]);

	// 3. Delete Database Record Action
	const handleDeleteConfirm = async () => {
		if (!articleToDelete) return;
		setDeleting(true);
		try {
			await deleteArticle(articleToDelete.slug);
			// Refresh local state list
			setArticles((prev) =>
				prev.filter((a) => a.slug !== articleToDelete.slug),
			);
			setArticleToDelete(null);
		} catch (err: unknown) {
			console.error("Deletion failed:", err);
			alert(err instanceof Error ? err.message : "Failed to delete article.");
		} finally {
			setDeleting(false);
		}
	};

	const handleOpenCreateModal = () => {
		setSelectedArticle(null);
		setIsFormOpen(true);
	};

	const handleOpenEditModal = (art: LibraryArticle) => {
		setSelectedArticle(art);
		setIsFormOpen(true);
	};

	const pageVariants = {
		initial: { opacity: 0, y: 15 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	};

	if (authLoading || !isAuthenticated || user?.role !== "ADMIN") {
		return (
			<div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
				<SEO
					title="Checking Credentials - Dermasight"
					description="Verifying administrator credentials for secure access to the article database."
					robots="noindex, nofollow"
				/>
				<span className="font-sans text-sm font-bold text-mute animate-pulse">
					Checking Admin Credentials...
				</span>
			</div>
		);
	}

	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			className="max-w-[1280px] mx-auto py-8 px-4 md:px-8 flex flex-col gap-8 w-full select-none"
		>
			<SEO
				title="Admin Library - Dermasight"
				description="Content management dashboard for publishing, editing, or removing clinical skin condition reviews and research articles within the DermaSight educational database."
				robots="noindex, nofollow"
			/>
			{/* Back button and Navigation bar */}
			<div className="flex items-center justify-between">
				<Link to="/library">
					<Button
						variant="secondary"
						className="flex items-center gap-2 bg-canvas border border-hairline/40 hover:bg-surface-card rounded-full !h-9 px-4"
					>
						<IconArrowLeft size={16} stroke={2.5} />
						Public Library
					</Button>
				</Link>
				<span className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
					Admin Console Active
				</span>
			</div>

			{/* Workspace Title Card */}
			<div className="bg-canvas border border-hairline/40 rounded-[32px] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
				<div className="flex flex-col gap-2">
					<h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-none">
						Library Workspace
					</h1>
					<p className="font-sans text-sm text-mute leading-relaxed max-w-lg">
						Manage, edit, publish, or remove clinical and skincare articles in
						the DermaSight database.
					</p>
				</div>
				<Button
					variant="primary"
					onClick={handleOpenCreateModal}
					className="rounded-full !h-11 px-5 flex items-center gap-2 shrink-0 shadow active:scale-95 cursor-pointer"
				>
					<IconPlus size={18} stroke={2.5} />
					Publish Article
				</Button>
			</div>

			{/* Database Records View */}
			<div className="bg-canvas border border-hairline/40 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
				{loading ? (
					<div className="py-20 flex flex-col items-center justify-center gap-2">
						<span className="font-sans text-sm font-bold text-mute animate-pulse">
							Fetching article records...
						</span>
					</div>
				) : error ? (
					<div className="py-16 text-center flex flex-col items-center justify-center gap-4">
						<p className="font-sans text-sm font-bold text-error">{error}</p>
						<Button
							variant="secondary"
							onClick={loadArticles}
							className="rounded-full"
						>
							Retry Connection
						</Button>
					</div>
				) : articles.length === 0 ? (
					<div className="py-20 text-center flex flex-col items-center justify-center gap-3">
						<h3 className="font-display text-base font-bold text-ink">
							No database records
						</h3>
						<p className="font-sans text-xs text-mute max-w-xs leading-relaxed">
							Click the "Publish Article" button above to publish your first
							educational content.
						</p>
					</div>
				) : (
					/* Editorial List Grid/Table */
					<div className="overflow-x-auto">
						<table className="w-full min-w-[700px] border-collapse text-left">
							<thead>
								<tr className="border-b border-hairline bg-surface-card/65 select-none font-sans text-xs font-bold text-mute uppercase tracking-wider">
									<th className="py-4 px-6 w-[80px]">Cover</th>
									<th className="py-4 px-6">Article Info</th>
									<th className="py-4 px-6 w-[180px]">Category / Tags</th>
									<th className="py-4 px-6 w-[160px]">Author</th>
									<th className="py-4 px-6 w-[150px] text-center">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-hairline/40">
								{articles.map((art) => (
									<tr
										key={art.id}
										className="hover:bg-surface-soft/40 transition-colors"
									>
										{/* Banner Thumbnail */}
										<td className="py-4 px-6">
											<div className="w-14 aspect-square rounded-xl overflow-hidden border border-hairline bg-secondary-bg">
												<img
													src={art.imageUrl}
													alt={art.title}
													className="w-full h-full object-cover"
												/>
											</div>
										</td>

										{/* Title & Slug */}
										<td className="py-4 px-6">
											<div className="flex flex-col gap-1 pr-4 max-w-[320px]">
												<span className="font-display text-sm font-bold text-ink leading-tight line-clamp-2">
													{art.title}
												</span>
												<span className="font-mono text-[10px] text-mute select-text">
													/{art.slug}
												</span>
											</div>
										</td>

										{/* Categories tag pills */}
										<td className="py-4 px-6">
											<div className="flex flex-wrap gap-1.5 max-w-[160px]">
												{art.tags.slice(0, 2).map((tag) => (
													<span
														key={tag}
														className="bg-surface-card border border-hairline/40 text-[10px] font-bold text-ink px-2.5 py-0.5 rounded-full"
													>
														{tag}
													</span>
												))}
												{art.tags.length > 2 && (
													<span className="text-[10px] text-mute font-sans font-bold pl-1">
														+{art.tags.length - 2} more
													</span>
												)}
											</div>
										</td>

										{/* Author Attrib */}
										<td className="py-4 px-6">
											<div className="flex items-center gap-2.5 select-text">
												<img
													src={art.doctorAvatar}
													alt={art.doctorName}
													className="w-7 h-7 rounded-full object-cover border border-hairline shrink-0"
												/>
												<div className="flex flex-col min-w-0">
													<span className="font-sans text-xs font-bold text-ink leading-tight truncate max-w-[120px]">
														{art.doctorName}
													</span>
													<span className="font-sans text-[10px] text-mute mt-0.5 truncate max-w-[120px]">
														{art.doctorTitle}
													</span>
												</div>
											</div>
										</td>

										{/* Actions triggers */}
										<td className="py-4 px-6">
											<div className="flex items-center justify-center gap-2">
												{/* Preview */}
												<Link to={`/library/${art.slug}`} target="_blank">
													<Button
														variant="icon"
														className="!w-8 !h-8 text-mute hover:text-ink hover:bg-secondary-bg rounded-full border border-hairline/30"
														title="View article details page"
													>
														<IconExternalLink size={14} />
													</Button>
												</Link>

												{/* Edit */}
												<Button
													variant="icon"
													onClick={() => handleOpenEditModal(art)}
													className="!w-8 !h-8 text-mute hover:text-primary hover:bg-primary/5 rounded-full border border-hairline/30"
													title="Edit article"
												>
													<IconEdit size={14} />
												</Button>

												{/* Delete */}
												<Button
													variant="icon"
													onClick={() => setArticleToDelete(art)}
													className="!w-8 !h-8 text-error hover:text-error hover:bg-error/10 rounded-full border border-error/20"
													title="Delete article"
												>
													<IconTrash size={14} />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Article Editor Form Modal */}
			<ArticleFormModal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				article={selectedArticle}
				onSaveSuccess={loadArticles}
			/>

			{/* Destructive Deletion Confirmation Overlay */}
			<AnimatePresence>
				{articleToDelete && (
					<>
						{/* Conf Scrim */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black z-50 cursor-pointer"
							onClick={() => (deleting ? null : setArticleToDelete(null))}
						/>
						{/* Card box */}
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 15 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 15 }}
								transition={{ type: "spring", duration: 0.3 }}
								className="w-full max-w-[420px] bg-canvas rounded-[32px] p-6 shadow-2xl border border-hairline flex flex-col gap-6"
							>
								<div className="flex gap-4 items-start">
									<div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
										<IconAlertTriangle size={24} stroke={2.2} />
									</div>
									<div className="flex flex-col gap-1">
										<h4 className="font-display text-base font-bold text-ink leading-tight">
											Delete Article?
										</h4>
										<p className="font-sans text-xs text-mute leading-relaxed">
											Are you sure you want to permanently delete{" "}
											<span className="font-bold text-ink">
												"{articleToDelete.title}"
											</span>
											? This database transaction cannot be reversed.
										</p>
									</div>
								</div>

								<div className="flex items-center justify-end gap-2 border-t border-hairline/30 pt-4">
									<Button
										variant="secondary"
										onClick={() => setArticleToDelete(null)}
										disabled={deleting}
										className="rounded-full px-5 h-9 active:scale-95 cursor-pointer text-xs"
									>
										Cancel
									</Button>
									<Button
										variant="primary"
										onClick={handleDeleteConfirm}
										disabled={deleting}
										className="rounded-full px-5 h-9 bg-error text-canvas hover:bg-error-deep border-none active:scale-95 cursor-pointer text-xs flex items-center gap-1.5"
									>
										{deleting ? "Deleting..." : "Yes, Delete"}
									</Button>
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default AdminLibrary;
