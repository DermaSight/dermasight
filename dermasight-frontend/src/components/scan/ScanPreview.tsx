import { IconCloudUpload, IconSparkles, IconX } from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { Button } from "@/components/Button";

interface ScanPreviewProps {
	imageFile: string | null;
	isScanning: boolean;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onReset: () => void;
}

export const ScanPreview: React.FC<ScanPreviewProps> = ({
	imageFile,
	isScanning,
	onFileChange,
	onReset,
}) => {
	return (
		<div className="relative aspect-square w-full max-w-[560px] max-h-[560px] mx-auto rounded-[32px] bg-surface-card border border-hairline/60 p-2 overflow-hidden flex flex-col items-center justify-center">
			{imageFile ? (
				<div className="relative w-full h-full rounded-[24px] overflow-hidden bg-canvas flex items-center justify-center">
					<img
						src={imageFile}
						alt="Preview"
						className="w-full h-full object-cover"
					/>
					<Button
						onClick={onReset}
						variant="icon"
						className="absolute right-4 top-4"
					>
						<IconX className="h-5 w-5" />
					</Button>

					{/* High-tech scanner overlays */}
					{isScanning && (
						<>
							{/* Ambient scan mask overlay */}
							<div className="absolute inset-0 bg-primary/10 transition-opacity" />

							{/* Moving Laser line loop using Framer Motion */}
							<motion.div
								initial={{ top: 0 }}
								animate={{ top: "100%" }}
								transition={{
									duration: 1.5,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "reverse",
									ease: "easeInOut",
								}}
								className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_8px_#e60023] z-20"
							/>

							{/* Animated central bounding box scanner */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="absolute w-48 h-48 rounded-2xl flex items-center justify-center z-10"
							>
								<span className="bg-primary/80 backdrop-blur-sm text-canvas font-sans font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
									<IconSparkles size={10} />
									Analyzing...
								</span>
							</motion.div>
						</>
					)}
				</div>
			) : (
				<label className="w-full h-full border-2 border-dashed border-hairline hover:border-primary/40 rounded-[24px] cursor-pointer flex flex-col items-center justify-center gap-3 p-8 text-center transition-colors">
					<input
						type="file"
						accept="image/*"
						onChange={onFileChange}
						className="hidden"
					/>
					<div className="w-16 h-16 rounded-full bg-canvas flex items-center justify-center text-primary shadow-sm">
						<IconCloudUpload size={28} />
					</div>
					<div>
						<p className="font-display text-base font-bold text-ink leading-tight">
							Drag and drop skin image
						</p>
						<p className="font-sans text-xs text-mute mt-1 leading-normal">
							Supports JPEG, PNG up to 10MB
						</p>
					</div>
					<Button variant="secondary" className="mt-2 pointer-events-none">
						Browse Local Files
					</Button>
				</label>
			)}
		</div>
	);
};
