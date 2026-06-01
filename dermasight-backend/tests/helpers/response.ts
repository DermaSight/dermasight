export interface ApiResponse<T = any> {
    status: "success" | "failed";
    message: string;
    data: T;
}

export async function parseResponse<T = any>(res: Response): Promise<ApiResponse<T>> {
    return res.json() as Promise<ApiResponse<T>>;
}
