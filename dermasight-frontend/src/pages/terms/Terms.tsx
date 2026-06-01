import type React from "react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { motion } from "motion/react";
import { SEO } from "@/components/seo/SEO";

const pageVariants = {
	initial: { opacity: 0, y: 15 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.35,
			ease: "easeOut" as const,
		},
	},
};

const Terms: React.FC = () => {
	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			className="flex flex-col max-w-3xl mx-auto w-full py-8 md:py-12"
		>
			<SEO
				title="Terms of Service - Dermasight"
				description="Read the user terms, conditions of service use, disclaimer details, and professional guidance limitations regarding the DermaSight AI tool and library."
			/>
			<header className="mb-12 border-b border-hairline/50 pb-8">
				<h1 className="font-display-lg text-ink mb-4">Terms of Service</h1>
			</header>

			<article className="flex flex-col gap-10 text-body-text leading-relaxed">
				<section>
					<h2 className="font-heading-lg text-ink mb-4">
						1. Acceptance of Terms
					</h2>
					<p>
						Welcome to DermaSight. By creating an account, accessing, or using
						our Services, you acknowledge that you have read, understood, and
						agree to be bound by these Terms of Service. If you do not agree to
						these terms, you must not access or use DermaSight.
					</p>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-6">
						2. Medical Disclaimer (Critical)
					</h2>
					<div className="mb-4">
						<MedicalDisclaimer />
					</div>
					<p className="mt-4 text-mute">
						DermaSight does not provide medical diagnoses. The Services are
						intended for educational purposes only. Reliance on any information
						provided by DermaSight, its employees, or others appearing on the
						Services is solely at your own risk. In case of a medical emergency,
						immediately contact emergency personnel (e.g., 911) or go to the
						nearest emergency room.
					</p>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-4">
						3. User Responsibilities
					</h2>
					<p className="mb-3">
						When using DermaSight, you agree that you will:
					</p>
					<ul className="list-disc pl-5 flex flex-col gap-2 text-mute">
						<li>
							Provide accurate and complete information when creating an
							account.
						</li>
						<li>
							Maintain the security of your password and accept responsibility
							for all activities that occur under your account.
						</li>
						<li>
							Not use the Service for any illegal or unauthorized purpose.
						</li>
						<li>
							Not upload images that you do not own or have the right to share,
							particularly images of other people without their explicit
							consent.
						</li>
						<li>
							Not attempt to disrupt, exploit, or gain unauthorized access to
							the Services or servers.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-4">
						4. Intellectual Property
					</h2>
					<p>
						The Services and their original content (excluding User Content
						provided by you), features, and functionality are and will remain
						the exclusive property of DermaSight and its licensors. The Services
						are protected by copyright, trademark, and other laws of both the
						United States and foreign countries. Our trademarks and trade dress
						may not be used in connection with any product or service without
						the prior written consent of DermaSight.
					</p>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-4">
						5. Modifications to the Service
					</h2>
					<p>
						We reserve the right to withdraw or amend our Service, and any
						service or material we provide via the Service, in our sole
						discretion without notice. We will not be liable if for any reason
						all or any part of the Service is unavailable at any time or for any
						period. From time to time, we may restrict access to some parts of
						the Service, or the entire Service, to users, including registered
						users.
					</p>
				</section>
			</article>
		</motion.div>
	);
};

export default Terms;
