import type React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";

interface SEOProps {
	title: string;
	description: string;
	robots?: string;
	keywords?: string;
	image?: string;
	type?: "website" | "article";
}

export const SEO: React.FC<SEOProps> = ({
	title,
	description,
	robots = "index, follow",
	keywords = "skin health, AI skin analysis, dermatology app, skin condition tracker, pigmented skin lesions, DermaSight",
	image = "/logo/logo-dermasight.png",
	type = "website",
}) => {
	const location = useLocation();
	const currentUrl = `${window.location.origin}${location.pathname}${location.search}`;

	useEffect(() => {
		// Update document title
		document.title = title;

		// Helper to update or create meta tags dynamically
		const setMetaTag = (attribute: string, value: string, content: string) => {
			let element = document.querySelector(`meta[${attribute}="${value}"]`);
			if (!element) {
				element = document.createElement("meta");
				element.setAttribute(attribute, value);
				document.head.appendChild(element);
			}
			element.setAttribute("content", content);
		};

		// Standard SEO Tags
		setMetaTag("name", "description", description);
		setMetaTag("name", "robots", robots);
		setMetaTag("name", "keywords", keywords);

		// Open Graph (Facebook / Discord / Slack) Tags
		setMetaTag("property", "og:title", title);
		setMetaTag("property", "og:description", description);
		setMetaTag("property", "og:type", type);
		setMetaTag("property", "og:url", currentUrl);
		setMetaTag(
			"property",
			"og:image",
			image.startsWith("http") ? image : `${window.location.origin}${image}`,
		);

		// Twitter Cards
		setMetaTag("name", "twitter:card", "summary_large_image");
		setMetaTag("name", "twitter:title", title);
		setMetaTag("name", "twitter:description", description);
		setMetaTag(
			"name",
			"twitter:image",
			image.startsWith("http") ? image : `${window.location.origin}${image}`,
		);
	}, [title, description, robots, keywords, image, type, currentUrl]);

	return null;
};

export default SEO;
