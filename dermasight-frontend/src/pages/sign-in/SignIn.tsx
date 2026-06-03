import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthLayout } from "@/components/AuthLayout";
import { SEO } from "@/components/seo/SEO";
import { useAuth } from "@/utils/auth-context/AuthContext";
import { signIn } from "@/utils/sign-in/signInService";

export default function SignIn() {
	const [isPwVisible, setIsPwVisible] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { setAccessToken } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const data = await signIn(email, password);
			localStorage.setItem("accessToken", data.accessToken);
			setAccessToken(data.accessToken);
			navigate("/"); // Redirect to home on success
		} catch (error) {
			console.error("Sign in failed", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<SEO
				title="Sign In - Dermasight"
				description="Log in to your secure DermaSight account to access saved research, upload skin photographs for AI classification, and review historical scan indices."
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
				<h1 className="font-heading-xl text-ink">Welcome back</h1>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-sm font-semibold text-ink">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						maxLength={255}
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
							minLength={8}
							maxLength={255}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
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
						{isLoading ? "Signing in..." : "Sign in"}
					</button>

					{/* Modified Go Back instead of forgot password as requested */}
					<Link
						to="/"
						className="text-center text-sm font-semibold text-mute hover:text-ink transition-colors"
					>
						Go Back
					</Link>
				</div>
			</form>

			{/* Divider */}
			<div className="flex items-center my-8">
				<div className="flex-1 border-t border-hairline"></div>
				<span className="px-4 text-sm text-mute font-medium">or</span>
				<div className="flex-1 border-t border-hairline"></div>
			</div>

			<div className="text-center text-sm">
				<span className="text-mute">New to DermaSight? </span>
				<Link
					to="/sign-up"
					className="font-bold text-ink hover:text-primary transition-colors border-b border-ink hover:border-primary pb-0.5"
				>
					Create Account
				</Link>
			</div>
		</AuthLayout>
	);
}
