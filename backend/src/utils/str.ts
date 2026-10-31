export function buildCloudflareRequestUrl(
    apiUrl: string,
    version: string,
    endpoint: string,
): string {
    return `${apiUrl}/${version}/${endpoint}`;
}

export function generateBearerToken(apiKey: string): string {
    return `Bearer ${apiKey}`;
}
