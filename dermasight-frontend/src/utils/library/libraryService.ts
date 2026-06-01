/* eslint-disable no-useless-escape */
import { useAuth } from "@/utils/auth-context/AuthContext";
import { useCallback } from "react";

export interface APIArticle {
	id: string;
	title: string;
	slug: string;
	tags: string[];
	content: string;
	image: string;
	timeToRead: number;
	authorName: string;
	authorTitle: string;
	authorImage: string;
	createdAt: string;
	updatedAt: string;
}

export interface LibraryArticle {
	id: string;
	title: string;
	slug: string;
	category: string;
	tags: string[];
	description: string;
	imageUrl: string;
	readTime: string;
	timeToRead: number;
	doctorName: string;
	doctorTitle: string;
	doctorAvatar: string;
	content: string; // Keep as raw string for markdown rendering
	createdAt: string;
}

export interface APIArticleResponse {
	status: string;
	message: string;
	data: {
		article: APIArticle;
	};
}

export interface APIArticlesResponse {
	status: string;
	message: string;
	data: {
		articles: APIArticle[];
	};
}

// Map APIArticle format to UI-ready LibraryArticle format
export function mapAPIArticleToLibraryArticle(
	apiArt: APIArticle,
): LibraryArticle {
	// Parse the first tag as category (with fallback)
	const category = apiArt.tags?.[0] || "General";

	// Create description as brief snippet of the content
	const rawContent = apiArt.content || "";

	// Clean markdown tags for a clean plaintext snippet
	const plainSnippet = rawContent
		.replace(/[#*`>_\-\[\]\(\)]/g, "")
		.substring(0, 120)
		.trim();
	const description =
		rawContent.length > 120 ? `${plainSnippet}...` : plainSnippet;

	return {
		id: apiArt.id,
		title: apiArt.title,
		slug: apiArt.slug,
		category,
		tags: apiArt.tags || [],
		description,
		imageUrl:
			apiArt.image ||
			"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=60",
		readTime: `${apiArt.timeToRead || 1} min read`,
		timeToRead: apiArt.timeToRead || 1,
		doctorName: apiArt.authorName || "Dermatology Specialist",
		doctorTitle: apiArt.authorTitle || "Medical Professional",
		doctorAvatar:
			apiArt.authorImage ||
			"https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150&auto=format&fit=crop&q=60",
		content: rawContent,
		createdAt: apiArt.createdAt || new Date().toISOString(),
	};
}

export function useLibraryService() {
	const { accessToken } = useAuth();
	const apiUrl = import.meta.env.VITE_API_URL || "";

	// Helper to get authorization header
	const getAuthHeaders = useCallback(
		(isMultipart = false) => {
			const headers: Record<string, string> = {};
			if (accessToken) {
				headers.Authorization = `Bearer ${accessToken}`;
			}
			if (!isMultipart) {
				headers["Content-Type"] = "application/json";
			}
			return headers;
		},
		[accessToken],
	);

	// 1. Get all articles (Public)
	const fetchArticles = useCallback(async (): Promise<LibraryArticle[]> => {
		const response = await fetch(`${apiUrl}/articles`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			throw new Error(err.message || "Failed to fetch articles");
		}

		const responseJson: APIArticlesResponse = await response.json();
		const apiArticles = responseJson.data?.articles || [];
		return apiArticles.map(mapAPIArticleToLibraryArticle);
	}, [apiUrl]);

	// 2. Get single article by slug (Public)
	const fetchArticleBySlug = useCallback(
		async (slug: string): Promise<LibraryArticle> => {
			const response = await fetch(`${apiUrl}/articles/${slug}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(err.message || "Failed to fetch article details");
			}

			const responseJson: APIArticleResponse = await response.json();
			const apiArticle = responseJson.data?.article;
			if (!apiArticle) {
				throw new Error("Article not found in response payload");
			}
			return mapAPIArticleToLibraryArticle(apiArticle);
		},
		[apiUrl],
	);

	// 3. Create a new article (Admin - Multipart Form)
	const createArticle = useCallback(
		async (formData: FormData): Promise<APIArticle> => {
			const response = await fetch(`${apiUrl}/articles`, {
				method: "POST",
				headers: getAuthHeaders(true),
				body: formData,
			});

			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(err.message || "Failed to create article");
			}

			const responseJson: APIArticleResponse = await response.json();
			return responseJson.data.article;
		},
		[apiUrl, getAuthHeaders],
	);

	// 4. Update an existing article (Admin - Multipart Form)
	const updateArticle = useCallback(
		async (slug: string, formData: FormData): Promise<APIArticle> => {
			const response = await fetch(`${apiUrl}/articles/${slug}`, {
				method: "PUT",
				headers: getAuthHeaders(true),
				body: formData,
			});

			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(err.message || "Failed to update article");
			}

			const responseJson: APIArticleResponse = await response.json();
			return responseJson.data.article;
		},
		[apiUrl, getAuthHeaders],
	);

	// 5. Delete an article by slug (Admin)
	const deleteArticle = useCallback(
		async (slug: string): Promise<void> => {
			const response = await fetch(`${apiUrl}/articles/${slug}`, {
				method: "DELETE",
				headers: getAuthHeaders(false),
			});

			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(err.message || "Failed to delete article");
			}
		},
		[apiUrl, getAuthHeaders],
	);

	return {
		fetchArticles,
		fetchArticleBySlug,
		createArticle,
		updateArticle,
		deleteArticle,
	};
}
