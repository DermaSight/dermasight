import type React from "react";

export const LibraryHeader: React.FC = () => {
	return (
		<div className="text-center md:text-left flex flex-col gap-2">
			<h1 className="font-display-lg text-ink leading-tight select-none">
				Dermatological Library
			</h1>
			<p className="font-sans text-sm text-mute leading-relaxed">
				Explore reliable, dermatologist-reviewed educational articles on skin
				conditions, barrier repair, and sun safety.
			</p>
		</div>
	);
};
