import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthLayout } from "@/components/AuthLayout";
import { SEO } from "@/components/seo/SEO";
import { useAuth } from "@/utils/auth-context/AuthContext";
import { signUp } from "@/utils/sign-up/signUpService";

export default function SignUp() {
	const [isPwVisible, setIsPwVisible] = useState(false);
	const [isCfPwVisible, setIsCfPwVisible] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState<string[]>([]);
	const { setAccessToken } = useAuth();
	const navigate = useNavigate();

	const checkPassword = () => {
		if (password === confirmPassword) {
			return true;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const confirm = checkPassword();

			if (!confirm) {
				setAlertMessage(["Your password confirmation is different."]);
				setAlert(true);
				setIsLoading(false);
				return;
			}

			const response = await signUp(email, password, confirmPassword, name);

			localStorage.setItem("accessToken", response.accessToken);
			setAccessToken(response.accessToken);
			navigate("/");
		} catch (error: any) {
			setAlert(true);
			console.log(error);

			if (error && error.data && Array.isArray(error.data.issues)) {
				setAlertMessage(
					error.data.issues.map((i: any) => i.message || String(i)),
				);
			} else if (error instanceof Error) {
				setAlertMessage([error.message]);
			} else if (error && error.message) {
				setAlertMessage([error.message]);
			} else {
				setAlertMessage([String(error)]);
			}
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
						minLength={1}
						maxLength={100}
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
						maxLength={100}
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
							minLength={8}
							maxLength={255}
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

				<div className="flex flex-col gap-2">
					<label
						htmlFor="confirm-password"
						className="text-sm font-semibold text-ink"
					>
						Confirm Password
					</label>
					<div className="relative overflow-hidden">
						<input
							type={isCfPwVisible ? "text" : "password"}
							id="confirm-password"
							value={confirmPassword}
							minLength={8}
							maxLength={255}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm your password"
							required
							className="py-3 px-4 bg-canvas border border-hairline rounded-2xl text-body-md text-ink placeholder:text-ash outline-none focus:border-ink focus:ring-[4px] focus:ring-focus-outer transition-shadow w-full"
						/>

						<button
							type="button"
							className="absolute top-1/2 -translate-y-1/2 right-4 text-ash hover:text-ink transition-colors cursor-pointer"
							onClick={() => setIsCfPwVisible(!isCfPwVisible)}
							aria-label={isCfPwVisible ? "Hide password" : "Show password"}
						>
							{isCfPwVisible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
						</button>
					</div>
				</div>

				<div className="mt-2 flex flex-col gap-4">
					{alert && (
						<div className="bg-red-100 border border-hairline flex justify-start items-center py-3 px-2 gap-2 text-error rounded-2xl w-full">
							<div className="flex flex-col gap-2">
								{alertMessage.map((message) => {
									return (
										<p key={message} className="text-sm">
											* {message}
										</p>
									);
								})}
							</div>
						</div>
					)}

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
