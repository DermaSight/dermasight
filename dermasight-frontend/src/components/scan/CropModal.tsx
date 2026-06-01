import { IconLoader, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { motion } from "motion/react";
import type React from "react";
import { useCallback, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { Button } from "@/components/Button";
import { getCroppedImg } from "@/utils/scan/cropImage";

interface CropModalProps {
	isOpen: boolean;
	imageSrc: string;
	onConfirm: (croppedImage: string) => void;
	onCancel: () => void;
}

export const CropModal: React.FC<CropModalProps> = ({
	isOpen,
	imageSrc,
	onConfirm,
	onCancel,
}) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const onCropChange = (crop: { x: number; y: number }) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom: number) => {
		setZoom(zoom);
	};

	const onCropComplete = useCallback(
		(_croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[],
	);

	const handleSave = async () => {
		if (!croppedAreaPixels) return;
		setIsProcessing(true);
		try {
			const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
			onConfirm(croppedImage);
		} catch (error) {
			console.error("Failed to crop image:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md">
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
				className="w-full max-w-[500px] bg-canvas rounded-[32px] border border-hairline/60 shadow-2xl p-6 overflow-hidden flex flex-col gap-6 relative"
			>
				{/* Loading overlay during processing */}
				{isProcessing && (
					<div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
						<IconLoader className="animate-spin text-primary" size={32} />
						<p className="font-sans text-sm font-bold text-ink">
							Resizing to 224x224...
						</p>
					</div>
				)}

				{/* Header */}
				<div className="flex flex-col gap-1">
					<h2 className="font-display text-lg font-bold text-ink leading-tight">
						Crop & Center Lesion
					</h2>
					<p className="font-sans text-xs text-mute leading-normal">
						Position the skin condition at the center of the crop square.
					</p>
				</div>

				{/* Cropper Container */}
				<div className="relative w-full h-[320px] bg-surface-card rounded-[24px] overflow-hidden border border-hairline/40">
					<Cropper
						image={imageSrc}
						crop={crop}
						zoom={zoom}
						aspect={1}
						onCropChange={onCropChange}
						onZoomChange={onZoomChange}
						onCropComplete={onCropComplete}
						cropShape="rect"
						showGrid={true}
						classes={{
							containerClassName: "bg-surface-card",
							mediaClassName: "max-w-none",
							cropAreaClassName:
								"border-2 border-primary rounded-2xl shadow-[0_0_0_9999px_rgba(38,38,34,0.65)]",
						}}
					/>
				</div>

				{/* Controls */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-3 bg-surface-card p-3 rounded-2xl border border-hairline/40">
						<IconZoomOut size={18} className="text-mute" />
						<input
							type="range"
							value={zoom}
							min={1}
							max={3}
							step={0.1}
							aria-label="Zoom"
							onChange={(e) => setZoom(Number(e.target.value))}
							className="flex-1 accent-primary h-1.5 bg-hairline rounded-lg cursor-pointer"
						/>
						<IconZoomIn size={18} className="text-mute" />
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<Button
						variant="secondary"
						onClick={onCancel}
						disabled={isProcessing}
						className="flex-1 h-12"
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSave}
						disabled={isProcessing}
						className="flex-1 h-12"
					>
						Confirm Crop
					</Button>
				</div>
			</motion.div>
		</div>
	);
};
