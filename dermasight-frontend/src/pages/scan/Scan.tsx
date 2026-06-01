import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CropModal } from "@/components/scan/CropModal";
import { ScanActions } from "@/components/scan/ScanActions";
import { ScanHeader } from "@/components/scan/ScanHeader";
import { ScanPreview } from "@/components/scan/ScanPreview";
import { useScanService } from "@/utils/scan/scanService";
import { SEO } from "@/components/seo/SEO";

export const Scan: React.FC = () => {
	const navigate = useNavigate();
	const { scanImage } = useScanService();
	const [imageFile, setImageFile] = useState<string | null>(null);
	const [tempImageFile, setTempImageFile] = useState<string | null>(null);
	const [isCropModalOpen, setIsCropModalOpen] = useState(false);
	const [isScanning, setIsScanning] = useState(false);

	// Reset upload selection
	const handleReset = () => {
		setImageFile(null);
		setTempImageFile(null);
		setIsScanning(false);
	};

	// Start scanning via live API endpoint then redirect to result page
	const handleStartScan = async (site: string) => {
		if (!imageFile) return;
		setIsScanning(true);

		try {
			// Trigger the real predict API endpoint
			const result = await scanImage(imageFile, site);

			// Navigate to /result with secure authorization state guard
			navigate("/result", {
				state: { scanResult: result.data, allowed: true },
			});
		} catch (error) {
			console.error("Scan prediction failed:", error);
			alert("Scan prediction failed. Please try again.");
			setIsScanning(false);
		}
	};

	// Handle simulated file change
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setTempImageFile(reader.result as string);
				setIsCropModalOpen(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCropConfirm = (croppedImageUrl: string) => {
		setImageFile(croppedImageUrl);
		setIsCropModalOpen(false);
		setTempImageFile(null);
	};

	const handleCropCancel = () => {
		setIsCropModalOpen(false);
		setTempImageFile(null);
	};

	return (
		<div className="max-w-[1280px] mx-auto flex flex-col gap-8 w-full">
			<SEO
				title="Scan - Dermasight"
				description="Instantly analyze pigmented skin lesions using our multi-modal AI classifier. Upload a clear photograph, specify the anatomic site, and receive comprehensive early-stage risk classifications."
			/>
			<ScanHeader />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="flex flex-col gap-4"
			>
				<ScanPreview
					imageFile={imageFile}
					isScanning={isScanning}
					onFileChange={handleFileChange}
					onReset={handleReset}
				/>

				{imageFile && (
					<ScanActions isScanning={isScanning} onStartScan={handleStartScan} />
				)}
			</motion.div>

			<AnimatePresence>
				{isCropModalOpen && tempImageFile && (
					<CropModal
						isOpen={isCropModalOpen}
						imageSrc={tempImageFile}
						onConfirm={handleCropConfirm}
						onCancel={handleCropCancel}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Scan;
