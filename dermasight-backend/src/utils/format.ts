export const formatErr = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;
