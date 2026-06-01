/* eslint-disable react-hooks/set-state-in-effect */
import { IconCamera, IconFileText, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/utils/auth-context/AuthContext";
import {
	type LibraryArticle,
	useLibraryService,
} from "@/utils/library/libraryService";

interface ArticleFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	article: LibraryArticle | null; // Null means "Create", otherwise "Edit"
	onSaveSuccess: () => void;
}

export const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
	isOpen,
	onClose,
	article,
	onSaveSuccess,
}) => {
	const { user } = useAuth();
	const { createArticle, updateArticle } = useLibraryService();

	const [title, setTitle] = useState("");
	const [tagsInput, setTagsInput] = useState("");
	const [timeToRead, setTimeToRead] = useState<number>(5);
	const [content, setContent] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [authorTitle, setAuthorTitle] = useState("");

	// Cover Image File States
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

	// Author Avatar File States
	const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);
	const [authorImagePreviewUrl, setAuthorImagePreviewUrl] = useState<
		string | null
	>(null);

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Helpers to check if image previews are valid non-empty, non-placeholder URLs/strings
	const hasCoverImage = !!(
		imagePreviewUrl &&
		!imagePreviewUrl.includes("undefined") &&
		!imagePreviewUrl.includes("null") &&
		imagePreviewUrl.trim() !== ""
	);

	const hasAuthorImage = !!(
		authorImagePreviewUrl &&
		!authorImagePreviewUrl.includes("undefined") &&
		!authorImagePreviewUrl.includes("null") &&
		authorImagePreviewUrl.trim() !== ""
	);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const authorFileInputRef = useRef<HTMLInputElement>(null);
	const mdFileInputRef = useRef<HTMLInputElement>(null);

	// Prefill form values based on mode (Edit vs Create)
	useEffect(() => {
		if (isOpen) {
			setError(null);
			setImageFile(null);
			setAuthorImageFile(null);
			if (article) {
				// Edit mode pre-fills
				setTitle(article.title);
				setTagsInput(article.tags.join(", "));
				setTimeToRead(article.timeToRead);
				setContent(article.content);
				setAuthorName(article.doctorName);
				setAuthorTitle(article.doctorTitle);
				setAuthorImagePreviewUrl(article.doctorAvatar);
				setImagePreviewUrl(article.imageUrl);
			} else {
				// Create mode pre-fills
				setTitle("");
				setTagsInput("");
				setTimeToRead(5);
				setContent("");
				setAuthorName(user?.name || "");
				setAuthorTitle("Board-Certified Dermatologist");
				setAuthorImagePreviewUrl(null);
				setImagePreviewUrl(null);
			}
		}
	}, [isOpen, article, user]);

	// Handle Image File Selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setImageFile(file);
			setImagePreviewUrl(URL.createObjectURL(file));
		}
		e.target.value = "";
	};

	// Handle Author Profile Image File Selection
	const handleAuthorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setAuthorImageFile(file);
			setAuthorImagePreviewUrl(URL.createObjectURL(file));
		}
		e.target.value = "";
	};

	// Handle Markdown File Import
	const handleMdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				const text = event.target?.result as string;
				setContent(text);
			};
			reader.onerror = () => {
				setError("Failed to read markdown file.");
			};
			reader.readAsText(file);
		}
	};

	// Form Submission Handler
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!title.trim()) {
			setError("Title is required.");
			return;
		}
		if (!content.trim()) {
			setError("Content body is required.");
			return;
		}
		if (!article && !imageFile) {
			setError("Cover image is required for new articles.");
			return;
		}
		if (!article && !authorImageFile) {
			setError("Author avatar image is required for new articles.");
			return;
		}

		setSubmitting(true);
		try {
			// Construct Multipart Form Data
			const formData = new FormData();
			formData.append("title", title.trim());

			// Parse tags
			const tagsArray = tagsInput
				.split(",")
				.map((t) => t.trim())
				.filter((t) => t !== "");
			formData.append("tags", JSON.stringify(tagsArray));

			formData.append("content", content.trim());
			formData.append("timeToRead", String(timeToRead));
			formData.append(
				"authorName",
				authorName.trim() || "Dermatology Specialist",
			);
			formData.append(
				"authorTitle",
				authorTitle.trim() || "Medical Professional",
			);

			// Attach Cover Photo
			if (imageFile) {
				formData.append("image", imageFile);
			}

			// Attach Author Profile Avatar Photo
			if (authorImageFile) {
				formData.append("authorImage", authorImageFile);
			}

			if (article) {
				// Update
				await updateArticle(article.slug, formData);
			} else {
				// Create
				await createArticle(formData);
			}

			onSaveSuccess();
			onClose();
		} catch (err: unknown) {
			console.error("Form action failed:", err);
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while saving the article.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const triggerFileSelect = () => {
		fileInputRef.current?.click();
	};

	const triggerAuthorFileSelect = () => {
		authorFileInputRef.current?.click();
	};

	const triggerMdFileSelect = () => {
		mdFileInputRef.current?.click();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Scrim Background */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.5 }}
						exit={{ opacity: 0 }}
						onClick={submitting ? undefined : onClose}
						className="fixed inset-0 bg-black z-50 cursor-pointer"
					/>

					{/* Modal Dialog */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ type: "spring", duration: 0.4 }}
							className="relative w-full max-w-[700px] bg-canvas rounded-[32px] overflow-hidden shadow-2xl flex flex-col pointer-events-auto max-h-[90vh]"
						>
							{/* Modal Header */}
							<div className="flex items-center justify-between border-b border-hairline/30 px-6 py-4">
								<h3 className="font-display text-lg font-bold text-ink">
									{article ? "Edit Library Article" : "Create New Article"}
								</h3>
								<Button
									variant="icon"
									onClick={onClose}
									disabled={submitting}
									className="hover:bg-secondary-bg"
								>
									<IconX size={20} />
								</Button>
							</div>

							{/* Form Content Scrolling Zone */}
							<form
								onSubmit={handleSubmit}
								className="p-6 overflow-y-auto flex flex-col gap-5"
							>
								{error && (
									<div className="p-3.5 bg-error/5 border border-error/20 rounded-2xl text-error text-xs font-sans font-semibold leading-relaxed">
										{error}
									</div>
								)}

								{/* 1. Title Input */}
								<div className="flex flex-col gap-1.5">
									<label
										htmlFor="article-title"
										className="font-sans text-xs font-bold text-ink uppercase tracking-wider"
									>
										Article Title
									</label>
									<input
										id="article-title"
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="e.g. Acne Prevention Strategies"
										className="w-full h-11 px-4 border border-ash/40 rounded-2xl font-sans text-sm outline-none focus:border-ink focus:ring-2 focus:ring-focus-outer/15 transition-all"
										required
										disabled={submitting}
									/>
								</div>

								{/* 2. Cover Photo Dragzone */}
								<div className="flex flex-col gap-1.5">
									<span className="font-sans text-xs font-bold text-ink uppercase tracking-wider">
										Cover Banner Image
									</span>
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										accept="image/png, image/jpeg"
										className="hidden"
									/>

									{hasCoverImage ? (
										<div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden group border border-hairline bg-secondary-bg">
											<img
												src={imagePreviewUrl || ""}
												alt="Selected cover preview"
												className="w-full h-full object-cover"
												onError={() => setImagePreviewUrl(null)}
											/>
											<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												<Button
													type="button"
													variant="overlay"
													onClick={triggerFileSelect}
													disabled={submitting}
													className="flex items-center gap-1.5 cursor-pointer shadow"
												>
													<IconCamera size={16} />
													Change Cover
												</Button>
											</div>
										</div>
									) : (
										<button
											type="button"
											onClick={triggerFileSelect}
											disabled={submitting}
											className="w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-ash/30 hover:border-ash bg-surface-card flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] select-none"
										>
											<div className="w-10 h-10 rounded-full bg-canvas shadow-sm flex items-center justify-center text-mute border border-hairline/40">
												<IconCamera size={20} />
											</div>
											<div className="text-center">
												<p className="font-sans text-xs font-bold text-ink">
													Upload cover photo
												</p>
												<p className="font-sans text-[10px] text-mute mt-0.5">
													JPEG or PNG, recommended 21:9 aspect, max 10MB
												</p>
											</div>
										</button>
									)}
								</div>

								{/* 3. Tags & Reading Time */}
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div className="flex flex-col gap-1.5 sm:col-span-2">
										<label
											htmlFor="article-tags"
											className="font-sans text-xs font-bold text-ink uppercase tracking-wider"
										>
											Tags (Comma separated)
										</label>
										<input
											id="article-tags"
											type="text"
											value={tagsInput}
											onChange={(e) => setTagsInput(e.target.value)}
											placeholder="e.g. Acne, Skincare Tips, Dry Skin"
											className="w-full h-11 px-4 border border-ash/40 rounded-2xl font-sans text-sm outline-none focus:border-ink focus:ring-2 focus:ring-focus-outer/15 transition-all"
											disabled={submitting}
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<label
											htmlFor="article-read-time"
											className="font-sans text-xs font-bold text-ink uppercase tracking-wider"
										>
											Read Time (Minutes)
										</label>
										<input
											id="article-read-time"
											type="number"
											value={timeToRead}
											onChange={(e) =>
												setTimeToRead(Math.max(1, Number(e.target.value)))
											}
											min="1"
											className="w-full h-11 px-4 border border-ash/40 rounded-2xl font-sans text-sm outline-none focus:border-ink focus:ring-2 focus:ring-focus-outer/15 transition-all"
											required
											disabled={submitting}
										/>
									</div>
								</div>

								{/* 4. Article Body Content with Markdown Import */}
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<label
											htmlFor="article-content"
											className="font-sans text-xs font-bold text-ink uppercase tracking-wider"
										>
											Article Markdown Content
										</label>
										<input
											type="file"
											ref={mdFileInputRef}
											onChange={handleMdFileChange}
											accept=".md"
											className="hidden"
										/>
										<Button
											type="button"
											variant="secondary"
											onClick={triggerMdFileSelect}
											disabled={submitting}
											className="rounded-full !h-8 px-3.5 flex items-center gap-1.5 text-xs border border-hairline/35 font-sans"
										>
											<IconFileText size={14} />
											Import Markdown (.md)
										</Button>
									</div>
									<textarea
										id="article-content"
										value={content}
										onChange={(e) => setContent(e.target.value)}
										placeholder="Write or import the Markdown content for your article here. Supports # Headers, **bold**, *italics*, and lists."
										rows={8}
										className="w-full p-4 border border-ash/40 rounded-2xl font-mono text-xs outline-none focus:border-ink focus:ring-2 focus:ring-focus-outer/15 transition-all resize-y min-h-[160px] leading-relaxed"
										required
										disabled={submitting}
									/>
								</div>

								{/* 5. Author Block Section with File Uploader */}
								<div className="border-t border-hairline/30 pt-4 flex flex-col gap-4">
									<span className="font-sans text-[11px] font-bold text-mute uppercase tracking-widest leading-none">
										Reviewing Author Information
									</span>

									<div className="flex flex-col sm:flex-row gap-4 items-center border border-hairline/30 p-4 rounded-2xl bg-surface-card/30">
										{/* Circular Avatar Selector */}
										<div className="flex flex-col gap-4 shrink-0 items-center">
											<span className="font-sans text-[9px] font-bold text-mute uppercase tracking-wider">
												Avatar Profile
											</span>
											<input
												type="file"
												ref={authorFileInputRef}
												onChange={handleAuthorFileChange}
												accept="image/*"
												className="hidden"
											/>

											{hasAuthorImage ? (
												<button
													type="button"
													onClick={triggerAuthorFileSelect}
													disabled={submitting}
													className="relative w-16 h-16 rounded-full overflow-hidden border border-hairline bg-secondary-bg group cursor-pointer p-0 text-left outline-none"
												>
													<img
														src={authorImagePreviewUrl || ""}
														alt="Author avatar"
														className="w-full h-full object-cover"
														onError={() => setAuthorImagePreviewUrl(null)}
													/>
													<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
														<IconCamera size={14} className="text-canvas" />
													</div>
												</button>
											) : (
												<button
													type="button"
													onClick={triggerAuthorFileSelect}
													disabled={submitting}
													className="w-16 h-16 rounded-full border-2 border-dashed border-ash/30 hover:border-ash bg-canvas flex items-center justify-center text-mute cursor-pointer transition-all active:scale-[0.98]"
												>
													<IconCamera />
												</button>
											)}
										</div>

										{/* Inputs */}
										<div className="flex-1 w-full flex flex-col gap-3">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div className="flex flex-col gap-1.5">
													<label
														htmlFor="author-name"
														className="font-sans text-[10px] font-bold text-ink uppercase tracking-wider"
													>
														Author Name
													</label>
													<input
														id="author-name"
														type="text"
														value={authorName}
														onChange={(e) => setAuthorName(e.target.value)}
														placeholder="e.g. Dr. Jane Carter"
														className="w-full h-10 px-3.5 border border-ash/40 rounded-xl font-sans text-xs outline-none focus:border-ink focus:ring-2 focus:ring-focus-outer/10 transition-all"
														required
														disabled={submitting}
													/>
												</div>

												<div className="flex flex-col gap-1.5">
													<label
														htmlFor="author-title"
														className="font-sans text-[10px] font-bold text-ink uppercase tracking-wider"
													>
														Author Title / Credentials
													</label>
													<input
														id="author-title"
														type="text"
														value={authorTitle}
														onChange={(e) => setAuthorTitle(e.target.value)}
														placeholder="e.g. Board-Certified Dermatologist"
														className="w-full h-10 px-3.5 border border-ash/40 rounded-xl font-sans text-xs outline-none focus:border-ink focus:ring-2 focus:ring-focus-outer/10 transition-all"
														required
														disabled={submitting}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Action Buttons Footer */}
								<div className="border-t border-hairline/30 pt-5 flex items-center justify-end gap-2">
									<Button
										type="button"
										variant="secondary"
										onClick={onClose}
										disabled={submitting}
										className="rounded-full px-5 h-10 active:scale-95 cursor-pointer"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										variant="primary"
										disabled={submitting}
										className="rounded-full px-6 h-10 active:scale-95 cursor-pointer shadow-md"
									>
										{submitting
											? "Saving..."
											: article
												? "Save Changes"
												: "Publish Article"}
									</Button>
								</div>
							</form>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};
