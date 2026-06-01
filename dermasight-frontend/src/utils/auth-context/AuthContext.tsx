/* eslint-disable react-refresh/only-export-components */
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Auth, User } from "./AuthTypes";

const AuthContext = createContext<Auth | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [accessToken, setAccessToken] = useState<string | null>(() =>
		localStorage.getItem("accessToken"),
	);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const logout = () => {
		localStorage.removeItem("accessToken");
		setAccessToken(null);
		window.location.reload();
	};

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/auth/me`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) {
					throw new Error("Failed to fetch user data.");
				}

				const responseJson = await response.json();
				const data: User = responseJson.data.user;
				setUser(data);
			} catch (error) {
				console.error(error);
				setUser(null);
				setAccessToken(null);
				localStorage.removeItem("accessToken");
			} finally {
				setLoading(false);
			}
		};

		if (accessToken) {
			getUser();
		} else {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setUser(null);
			 
			setLoading(false);
		}
	}, [accessToken]);

	return (
		<AuthContext.Provider
			value={{
				user,
				accessToken,
				isAuthenticated: !!user,
				setAccessToken,
				setUser,
				logout,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
