/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import type React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
	content,
	className = "",
}) => {
	return (
		<div
			className={`markdown-body flex flex-col gap-4 text-charcoal font-sans text-sm md:text-base leading-relaxed select-text ${className}`}
		>
			<Markdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					// Custom visual styling maps for native HTML elements under Pinterest design constraints
					h1: ({ node, ...props }) => (
						<h1
							className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight mt-8 mb-3.5"
							{...props}
						/>
					),
					h2: ({ node, ...props }) => (
						<h2
							className="font-display text-xl md:text-2xl font-bold text-ink leading-tight mt-6.5 border-b border-hairline/35 pb-2 mb-3"
							{...props}
						/>
					),
					h3: ({ node, ...props }) => (
						<h3
							className="font-display text-lg md:text-xl font-bold text-ink leading-tight mt-5 mb-2 flex items-center gap-1.5"
							{...props}
						/>
					),
					p: ({ node, ...props }) => (
						<p
							className="font-sans text-sm md:text-base text-charcoal leading-relaxed mb-4 whitespace-pre-wrap"
							{...props}
						/>
					),
					ul: ({ node, ...props }) => (
						<ul className="my-3 flex flex-col gap-0.5 list-none" {...props} />
					),
					li: ({ node, ...props }) => (
						<li
							className="font-sans text-sm md:text-base text-charcoal leading-relaxed mb-1.5 list-disc ml-5"
							{...props}
						/>
					),
					ol: ({ node, ...props }) => (
						<ol
							className="my-3 flex flex-col gap-0.5 list-decimal ml-5"
							{...props}
						/>
					),
					blockquote: ({ node, ...props }) => (
						<blockquote
							className="border-l-4 border-primary pl-4 py-2.5 my-4 bg-surface-card/65 rounded-r-2xl pr-4 text-mute text-xs md:text-sm font-sans italic"
							{...props}
						/>
					),
					a: ({ node, ...props }) => (
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-primary-pressed hover:underline font-bold transition-all"
							{...props}
						/>
					),
					pre: ({ node, ...props }) => (
						<pre
							className="bg-surface-card border border-hairline/55 rounded-2xl p-4 font-mono text-xs overflow-x-auto my-4 text-charcoal leading-relaxed"
							{...props}
						/>
					),
					code: ({ node, ...props }) => (
						<code
							className="bg-surface-card border border-hairline/40 rounded px-1.5 py-0.5 font-mono text-xs text-primary font-bold"
							{...props}
						/>
					),
				}}
			>
				{content}
			</Markdown>
		</div>
	);
};

/**
 * Helper function to render Markdown content using the react-markdown library with GFM and Raw HTML support.
 *
 * @param content The raw markdown string
 * @param className Optional CSS classes for the container div
 */
export function renderMarkdown(content: string, className = "") {
	return <MarkdownRenderer content={content} className={className} />;
}

export default MarkdownRenderer;
