import { useCallback } from "react";
import { useAuth } from "../auth-context/AuthContext";

export function useProtectedFetch() {
	const { accessToken, setAccessToken, setUser } = useAuth();

	const protectedFetch = useCallback(
		async (url: string, options: RequestInit = {}) => {
			const headers = new Headers(options.headers || {});

			// Automatically attach the Authorization Bearer token if it exists
			if (accessToken) {
				headers.set("Authorization", `Bearer ${accessToken}`);
			}

			// Set default Content-Type as application/json if not specified
			if (!headers.has("Content-Type")) {
				headers.set("Content-Type", "application/json");
			}

			const fetchOptions: RequestInit = {
				...options,
				headers,
			};

			const apiUrl = import.meta.env.VITE_API_URL || "";
			// Resolve endpoint URL
			const targetUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;

			let response = await fetch(targetUrl, fetchOptions);

			// If response is unauthorized (e.g. accessToken expired), attempt to refresh
			if (response.status === 401) {
				try {
					const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ token: accessToken }),
					});

					if (refreshResponse.ok) {
						const refreshData = await refreshResponse.json();
						const newAccessToken =
							refreshData.data?.accessToken || refreshData.accessToken;

						if (newAccessToken) {
							// Store the new accessToken manually in localStorage
							localStorage.setItem("accessToken", newAccessToken);

							// Update the authContext state
							if (setAccessToken) {
								setAccessToken(newAccessToken);
							}

							// Re-build headers with the new token
							const retryHeaders = new Headers(options.headers || {});
							retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
							if (!retryHeaders.has("Content-Type")) {
								retryHeaders.set("Content-Type", "application/json");
							}

							// Retry the original request
							response = await fetch(targetUrl, {
								...options,
								headers: retryHeaders,
							});
						} else {
							throw new Error(
								"New access token not found in refresh response.",
							);
						}
					} else {
						throw new Error("Token refresh request failed.");
					}
				} catch (error) {
					console.error(
						"Session expired. Failed to refresh access token:",
						error,
					);
					// Clean up the authContext and localStorage manually
					localStorage.removeItem("accessToken");
					if (setAccessToken) setAccessToken(null);
					if (setUser) setUser(null);
				}
			}

			return response;
		},
		[accessToken, setAccessToken, setUser],
	);

	return protectedFetch;
}
