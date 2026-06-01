export interface SignInResponse {
	accessToken: string;
	[key: string]: unknown;
}

export async function signIn(
	email: string,
	password: string,
): Promise<SignInResponse> {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
		credentials: "include",
	});

	const parseResponse = await response.json();

	if (!response.ok) {
		throw new Error(parseResponse.message || "Failed to sign in");
	}

	const data = parseResponse.data as SignInResponse;

	return data;
}
