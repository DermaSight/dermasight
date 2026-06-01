import { IconCamera, IconLoader } from "@tabler/icons-react";
import { AnimatePresence } from "motion/react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/Button";
import type { Anatomical } from "@/lib/scan/AnatomicalData";
import { anatomical } from "@/lib/scan/AnatomicalData";
import AnatomicSelector from "./AnatomicSelector";

interface ScanActionsProps {
	isScanning: boolean;
	onStartScan: (site: string) => void;
}

export const ScanActions: React.FC<ScanActionsProps> = ({
	isScanning,
	onStartScan,
}) => {
	const [anatomicalSite, setAnatomicalSite] = useState<Anatomical>(
		anatomical[1],
	);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="flex flex-col md:flex-row items-center justify-center mx-auto gap-3 md:w-150 w-full">
			<Button
				variant="primary"
				disabled={isScanning}
				onClick={() => onStartScan(anatomicalSite.site)}
				className="md:flex-1 flex justify-center items-center gap-2 h-12 w-full"
			>
				{isScanning ? (
					<>
						<IconLoader className="animate-spin" size={18} />
						Scanning Lesion Data...
					</>
				) : (
					<>
						<IconCamera size={18} stroke={2.5} />
						Begin Diagnosis Scan
					</>
				)}
			</Button>
			{
				<Button
					onClick={() => setIsOpen(!isOpen)}
					variant="secondary"
					className="px-6 h-12 flex gap-2 md:flex-1 w-full"
				>
					<img
						src={anatomicalSite.image}
						alt={anatomicalSite.site}
						className="w-6 h-6"
					></img>
					{anatomicalSite.site.firstWordUppercase()}
				</Button>
			}

			<AnimatePresence>
				{isOpen && (
					<AnatomicSelector
						onSelect={(site) => {
							setAnatomicalSite(site);
							setIsOpen(false);
						}}
						onClose={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};
