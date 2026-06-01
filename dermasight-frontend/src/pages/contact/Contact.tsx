import {
	IconBrandInstagram,
	IconBrandX,
	IconMail,
	IconMapPin,
	IconCheck,
	IconLoader,
	IconAlertCircle,
} from "@tabler/icons-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
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

const Contact: React.FC = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [topic, setTopic] = useState("general");
	const [message, setMessage] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setIsSubmitted(false);

		try {
			const baseUrl = import.meta.env.VITE_API_URL || "";
			const response = await fetch(`${baseUrl}/contact-us`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					subject: `Contact Form Inquiry: ${topic.toUpperCase()} - from ${firstName} ${lastName}`,
					content: `Sender Info:\nName: ${firstName} ${lastName}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
				}),
			});

			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(
					err.message || "Failed to send message. Please try again.",
				);
			}

			setIsSubmitted(true);
			// Reset form fields
			setFirstName("");
			setLastName("");
			setEmail("");
			setTopic("general");
			setMessage("");
		} catch (err: unknown) {
			console.error("Failed to send contact message:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to connect to the email server.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-8 md:py-12 select-none"
		>
			<SEO
				title="Contact - Dermasight"
				description="Get in touch with DermaSight's medical editors, support agents, or development team for custom inquiries, feedback, or health education collaborations."
			/>
			{/* Header */}
			<div className="flex flex-col gap-4 max-w-2xl">
				<h1 className="font-display-lg text-ink">Help & Support Center</h1>
				<p className="text-body-text text-lg leading-relaxed text-mute">
					Need assistance with your account, have a question about our AI tools,
					or want to report an issue? Our team is here to help.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
				{/* Contact Info Column */}
				<div className="lg:col-span-4 flex flex-col gap-8">
					<div className="flex flex-col gap-6">
						<h3 className="font-heading-md text-ink">Get in Touch</h3>

						<div className="flex items-start gap-4">
							<div className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center text-ink shrink-0">
								<IconMail size={20} />
							</div>
							<div className="flex flex-col">
								<span className="font-bold text-sm text-ink mb-1">
									Email Support
								</span>
								<a
									href="mailto:support@dermasight.my.id"
									className="text-sm text-mute hover:text-ink transition-colors"
								>
									support@dermasight.my.id
								</a>
								<span className="text-xs text-mute mt-1">
									24-48 hour response time
								</span>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center text-ink shrink-0">
								<IconMapPin size={20} />
							</div>
							<div className="flex flex-col">
								<span className="font-bold text-sm text-ink mb-1">Office</span>
								<span className="text-sm text-mute">Jakarta, Indonesia</span>
								<span className="text-xs text-mute mt-1">
									Remote-first team
								</span>
							</div>
						</div>
					</div>

					<div className="h-px w-full bg-hairline/50" />

					<div className="flex flex-col gap-4">
						<h3 className="font-heading-md text-ink">Follow Us</h3>
						<div className="flex items-center gap-3">
							<Button variant="icon" aria-label="X (Twitter)">
								<IconBrandX size={20} />
							</Button>
							<Button variant="icon" aria-label="Instagram">
								<IconBrandInstagram size={20} />
							</Button>
						</div>
					</div>
				</div>

				{/* Form Column */}
				<div className="lg:col-span-8">
					<Card
						bg="surface-card"
						radius="lg"
						interactive={false}
						variant="flat"
					>
						<Card.Content className="p-8 md:p-10">
							<form onSubmit={handleSubmit} className="flex flex-col gap-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex flex-col gap-2">
										<label
											htmlFor="firstName"
											className="font-bold text-sm text-ink"
										>
											First Name
										</label>
										<input
											type="text"
											id="firstName"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
											disabled={loading}
											className="bg-canvas border border-ash text-ink text-sm rounded-2xl px-[15px] py-[11px] h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-outer focus-visible:border-transparent transition-all placeholder:text-ash"
											placeholder="Jane"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label
											htmlFor="lastName"
											className="font-bold text-sm text-ink"
										>
											Last Name
										</label>
										<input
											type="text"
											id="lastName"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
											disabled={loading}
											className="bg-canvas border border-ash text-ink text-sm rounded-2xl px-[15px] py-[11px] h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-outer focus-visible:border-transparent transition-all placeholder:text-ash"
											placeholder="Doe"
										/>
									</div>
								</div>

								<div className="flex flex-col gap-2">
									<label htmlFor="email" className="font-bold text-sm text-ink">
										Email Address
									</label>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={loading}
										className="bg-canvas border border-ash text-ink text-sm rounded-2xl px-[15px] py-[11px] h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-outer focus-visible:border-transparent transition-all placeholder:text-ash"
										placeholder="jane@example.com"
									/>
								</div>

								<div className="flex flex-col gap-2">
									<label htmlFor="topic" className="font-bold text-sm text-ink">
										Topic
									</label>
									<select
										id="topic"
										value={topic}
										onChange={(e) => setTopic(e.target.value)}
										disabled={loading}
										className="bg-canvas border border-ash text-ink text-sm rounded-2xl px-[15px] h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-outer focus-visible:border-transparent transition-all appearance-none cursor-pointer"
									>
										<option value="general">General Inquiry</option>
										<option value="support">Technical Support</option>
										<option value="feedback">Feedback & Suggestions</option>
										<option value="privacy">Privacy & Data</option>
									</select>
								</div>

								<div className="flex flex-col gap-2">
									<label
										htmlFor="message"
										className="font-bold text-sm text-ink"
									>
										Message
									</label>
									<textarea
										id="message"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										required
										disabled={loading}
										rows={5}
										className="bg-canvas border border-ash text-ink text-sm rounded-2xl p-[15px] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-outer focus-visible:border-transparent transition-all placeholder:text-ash resize-y"
										placeholder="How can we help you?"
									/>
								</div>

								<div className="pt-2 flex flex-col gap-4">
									<Button
										type="submit"
										variant="primary"
										disabled={loading}
										className="w-full md:w-auto flex items-center justify-center gap-2"
									>
										{loading ? (
											<>
												<IconLoader className="animate-spin" size={18} />
												Loading...
											</>
										) : (
											"Submit Request"
										)}
									</Button>

									{isSubmitted && (
										<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl flex items-center gap-3 text-sm font-sans font-semibold leading-relaxed animate-fadeIn">
											<IconCheck
												size={20}
												className="shrink-0 text-emerald-500"
											/>
											<span>
												Your request has been successfully delivered! We will
												get back to you soon.
											</span>
										</div>
									)}

									{error && (
										<div className="p-4 bg-error/10 border border-error/20 text-error rounded-2xl flex items-center gap-3 text-sm font-sans font-semibold leading-relaxed animate-fadeIn">
											<IconAlertCircle size={20} className="shrink-0" />
											<span>{error}</span>
										</div>
									)}
								</div>
							</form>
						</Card.Content>
					</Card>
				</div>
			</div>
		</motion.div>
	);
};

export default Contact;
