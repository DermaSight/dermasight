import { IconUser } from "@tabler/icons-react";
import type React from "react";

interface ProfileHeaderProps {
	avatarUrl?: string;
	name: string;
	username: string;
	createdAt?: string | Date | null;
	scansCount: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	avatarUrl,
	name,
	username,
	createdAt,
	scansCount,
}) => {
	let year = 2026;
	if (createdAt) {
		const date =
			typeof createdAt === "string" ? new Date(createdAt) : createdAt;
		if (!Number.isNaN(date.getTime())) {
			year = date.getFullYear();
		}
	}

	return (
		<section className="flex flex-col items-center text-center gap-4 py-6">
			<div className="w-24 h-24 rounded-full border border-hairline bg-surface-card overflow-hidden shadow-sm">
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt="Profile Avatar"
						className="w-full h-full object-cover"
					/>
				) : (
					<IconUser className="h-full w-full p-4" />
				)}
			</div>
			<div>
				<h1 className="font-display text-2xl font-bold text-ink leading-tight select-none">
					{name}
				</h1>
				<p className="font-sans text-xs text-mute mt-1 leading-none">
					@{username} · Member since {year}
				</p>
			</div>

			<div className="flex items-center gap-6 mt-2 text-xs font-sans text-mute select-none">
				<span className="flex items-center gap-1 font-bold">
					<span className="text-ink">{scansCount}</span> Scanned Lesions
				</span>
				<span className="w-1 h-1 rounded-full bg-secondary-bg" />
			</div>
		</section>
	);
};
