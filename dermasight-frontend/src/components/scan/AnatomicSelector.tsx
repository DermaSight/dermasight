import { IconX } from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import type React from "react";
import { Card } from "@/components/Card";
import { type Anatomical, anatomical } from "@/lib/scan/AnatomicalData";
import { Button } from "../Button";

type Returns = React.ReactNode;

interface AnatomicSelectorProps {
	onSelect: (site: Anatomical) => void;
	onClose: () => void;
}

function AnatomicSelector({
	onSelect,
	onClose,
}: AnatomicSelectorProps): Returns {
	const handleClick = (site: string, image: string): Anatomical => {
		const result = {
			site: site,
			image: image,
		};
		onSelect(result);
		return result;
	};

	const parentVariants: Variants = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
			},
		},
	};

	const childVariants: Variants = {
		hidden: {
			opacity: 0,
			y: 15,
			scale: 0.95,
		},
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24,
			},
		},
	};

	return (
		<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
			{/* Backdrop Overlay */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="absolute inset-0 bg-charcoal/40 backdrop-blur-md cursor-pointer"
				onClick={onClose}
			/>

			{/* Modal Card Container */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9, y: 20 }}
				animate={{
					opacity: 1,
					scale: 1,
					y: 0,
					transition: {
						type: "spring",
						duration: 0.4,
						bounce: 0.15,
					},
				}}
				exit={{
					opacity: 0,
					scale: 0.9,
					y: 20,
					transition: {
						duration: 0.25,
					},
				}}
				className="relative z-10 w-full max-w-[500px]"
			>
				<Card
					interactive={false}
					radius="lg"
					className="shadow-2xl p-4 relative"
				>
					<Button
						onClick={onClose}
						variant="icon"
						className="absolute right-2 top-2 shadow-lg"
					>
						<IconX className="h-5 w-5" />
					</Button>
					<Card.Header>
						<div className="flex flex-col gap-1">
							<h3 className="font-display text-lg font-bold text-ink leading-tight">
								Select Anatomical Site
							</h3>
							<p className="font-sans text-xs text-mute leading-normal">
								Choose the body part where the lesion is located to improve scan
								accuracy.
							</p>
						</div>
					</Card.Header>
					<Card.Content>
						<motion.div
							variants={parentVariants}
							initial="hidden"
							animate="show"
							className="grid grid-cols-3 gap-3"
						>
							{anatomical.map((anatomic) => {
								return (
									<motion.button
										variants={childVariants}
										type="button"
										onClick={() => handleClick(anatomic.site, anatomic.image)}
										className="group relative flex flex-col border border-hairline bg-surface-card rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-all duration-200 aspect-square select-none focus-visible:ring-2 focus-visible:ring-focus-outer focus-visible:ring-offset-2"
										key={anatomic.site}
									>
										<span className="absolute bottom-1 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-canvas/50 backdrop-blur-xs text-ink shadow-sm rounded-full px-2.5 py-1 text-[10px] font-sans font-bold select-none group-hover:bg-primary/50 group-hover:text-canvas transition-colors duration-200 w-28">
											{anatomic.site.firstWordUppercase()}
										</span>
										<img
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-115 p-4"
											src={anatomic.image}
											alt={anatomic.site}
										/>
									</motion.button>
								);
							})}
						</motion.div>
					</Card.Content>
				</Card>
			</motion.div>
		</div>
	);
}

export default AnatomicSelector;
