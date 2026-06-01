export interface PasetoAccessPayload extends Record<string, unknown> {
    sub: string;
    email: string;
    role: string;
    jti: string;
    type: string;
    exp: string;
}

export interface PasetoRefreshPayload extends Record<string, unknown> {
    sub: string;
    jti: string;
    type: string;
}
