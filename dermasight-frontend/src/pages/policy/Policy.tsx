import type React from "react";
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

const Policy: React.FC = () => {
	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			className="flex flex-col max-w-3xl mx-auto w-full py-8 md:py-12"
		>
			<SEO
				title="Privacy Policy - Dermasight"
				description="Read how DermaSight safeguards your sensitive health data, uploaded skin lesion photographs, and private account credentials using industry-standard cryptography."
			/>
			<header className="mb-12 border-b border-hairline/50 pb-8">
				<h1 className="font-display-lg text-ink mb-4">Privacy Policy</h1>
			</header>

			<article className="flex flex-col gap-10 text-body-text leading-relaxed">
				<section>
					<h2 className="font-heading-lg text-ink mb-4">1. Introduction</h2>
					<p className="mb-4">
						At DermaSight, we take your privacy and the security of your health
						data very seriously. This Privacy Policy describes how we collect,
						use, process, and protect your personal information and sensitive
						skin health data when you use our website, application, and related
						services (collectively, the "Services").
					</p>
					<p>
						By accessing or using our Services, you agree to the collection and
						use of information in accordance with this policy. If you do not
						agree with this policy, please do not use our Services.
					</p>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-4">
						2. Information We Collect
					</h2>
					<p className="mb-3">
						We collect several different types of information to provide and
						improve our Services to you:
					</p>
					<ul className="list-disc pl-5 flex flex-col gap-2 text-mute">
						<li>
							<strong className="text-ink">Personal Data:</strong> Email
							address, first name and last name, date of birth, and usage data.
						</li>
						<li>
							<strong className="text-ink">Health Data (Sensitive):</strong>{" "}
							Photographs of skin conditions uploaded by you, AI analysis
							results, severity scores, and timeline tracking notes.
						</li>
						<li>
							<strong className="text-ink">Usage Data:</strong> Information on
							how the Services are accessed and used, device IP address, browser
							type, and diagnostic data.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-4">
						3. How We Use Your Data
					</h2>
					<p className="mb-3">
						DermaSight uses the collected data for various purposes:
					</p>
					<ul className="list-disc pl-5 flex flex-col gap-2 text-mute">
						<li>
							To provide and maintain our Services, including the AI skin
							feature.
						</li>
						<li>To notify you about changes to our Services.</li>
						<li>To provide customer support and respond to inquiries.</li>
						<li>
							To monitor the usage of our Services and detect, prevent, and
							address technical issues.
						</li>
						<li>
							To improve our AI models (only if you have explicitly opted-in to
							anonymized data sharing).
						</li>
					</ul>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-4">4. Data Security</h2>
					<p>
						The security of your data is critical to us. We implement robust,
						industry-standard security measures to protect your personal and
						health information. However, remember that no method of transmission
						over the Internet, or method of electronic storage is 100% secure.
						While we strive to use commercially acceptable means to protect your
						Personal Data, we cannot guarantee its absolute security.
					</p>
				</section>

				<section>
					<h2 className="font-heading-lg text-ink mb-4">5. Contact Us</h2>
					<p>
						If you have any questions about this Privacy Policy, your data
						rights, or how we handle your sensitive health information, please
						contact our Data Protection Officer at:
						<a
							href="mailto:support@dermasight.my.id"
							className="text-ink font-bold hover:underline ml-1"
						>
							support@dermasight.my.id
						</a>
					</p>
				</section>
			</article>
		</motion.div>
	);
};

export default Policy;
