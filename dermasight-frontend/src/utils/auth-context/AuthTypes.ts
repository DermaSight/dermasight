export interface User {
	id: string;
	email: string;
	name: string;
	role: "MEMBER" | "ADMIN";
	createdAt: string;
	UpdatedAt: string;
}

export interface Auth {
	user: User | null;
	isAuthenticated: boolean;
	accessToken: string | null;
	setAccessToken: (token: string | null) => void;
	setUser: (user: User | null) => void;
	logout: () => void;
	loading: boolean;
}
