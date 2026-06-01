export interface SignUpResponse {
	accessToken: string;
	[key: string]: unknown;
}

export async function signUp(
	email: string,
	password: string,
	name: string,
): Promise<SignUpResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/auth/register`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, name }),
			credentials: "include",
		},
	);

	const parseResponse = await response.json();

	if (!response.ok) {
		throw new Error(parseResponse.message || "Failed to sign in");
	}

	const data = parseResponse.data as SignUpResponse;

	return data;
}
