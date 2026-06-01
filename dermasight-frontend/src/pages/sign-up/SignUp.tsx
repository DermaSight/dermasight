import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/utils/auth-context/AuthContext";
import { signUp } from "@/utils/sign-up/signUpService";
import { SEO } from "@/components/seo/SEO";

export default function SignUp() {
	const [isPwVisible, setIsPwVisible] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { setAccessToken } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await signUp(email, password, name);
			localStorage.setItem("accessToken", response.accessToken);
			setAccessToken(response.accessToken);
			navigate("/");
		} catch (error) {
			console.error("Sign up failed", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<SEO
				title="Sign Up - Dermasight"
				description="Register for a free, secure DermaSight account to analyze pigmented skin anomalies, plot lesion progression metrics, and review board-certified physician guides."
				robots="noindex, nofollow"
			/>
			<div className="text-center mb-8">
				<div className="flex justify-center mb-6">
					<div className="h-24 w-24 p-2">
						<img
							src="/logo/dermasight_red_outline.png"
							alt="dermasight-logo"
						></img>
					</div>
				</div>
				<h1 className="font-heading-xl text-ink">Join DermaSight</h1>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<label htmlFor="name" className="text-sm font-semibold text-ink">
						Full Name
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Full name"
						required
						className="py-3 px-4 bg-canvas border border-hairline rounded-2xl text-body-md text-ink placeholder:text-ash outline-none focus:border-ink focus:ring-[4px] focus:ring-focus-outer transition-shadow"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-sm font-semibold text-ink">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email address"
						required
						className="py-3 px-4 bg-canvas border border-hairline rounded-2xl text-body-md text-ink placeholder:text-ash outline-none focus:border-ink focus:ring-[4px] focus:ring-focus-outer transition-shadow"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="password" className="text-sm font-semibold text-ink">
						Password
					</label>
					<div className="relative">
						<input
							type={isPwVisible ? "text" : "password"}
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Create a password"
							required
							className="py-3 px-4 bg-canvas border border-hairline rounded-2xl text-body-md text-ink placeholder:text-ash outline-none focus:border-ink focus:ring-[4px] focus:ring-focus-outer transition-shadow w-full"
						/>
						<button
							type="button"
							className="absolute top-1/2 -translate-y-1/2 right-4 text-ash hover:text-ink transition-colors cursor-pointer"
							onClick={() => setIsPwVisible(!isPwVisible)}
							aria-label={isPwVisible ? "Hide password" : "Show password"}
						>
							{isPwVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
						</button>
					</div>
				</div>

				<div className="mt-2 flex flex-col gap-4">
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-primary hover:bg-primary-pressed text-canvas font-bold text-[16px] py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Creating account..." : "Sign up"}
					</button>

					{/* Go Back Link as requested */}
					<Link
						to="/"
						className="text-center text-sm font-semibold text-mute hover:text-ink transition-colors"
					>
						Go Back
					</Link>
				</div>
			</form>

			<div className="flex items-center my-8">
				<div className="flex-1 border-t border-hairline"></div>
				<span className="px-4 text-sm text-mute font-medium">or</span>
				<div className="flex-1 border-t border-hairline"></div>
			</div>

			<div className="text-center text-sm">
				<span className="text-mute">Already a member? </span>
				<Link
					to="/sign-in"
					className="font-bold text-ink hover:text-primary transition-colors border-b border-ink hover:border-primary pb-0.5"
				>
					Log in
				</Link>
			</div>
		</AuthLayout>
	);
}
