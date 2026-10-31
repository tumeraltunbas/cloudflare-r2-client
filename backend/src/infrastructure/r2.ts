import configuration from '../configuration/configuration';
import { CONTENT_TYPES, HTTP_HEADERS, HTTP_METHODS } from '../constants/enums';
import { buildCloudflareRequestUrl, generateBearerToken } from '../utils/str';

interface CloudflareFetchOptions extends RequestInit {
    duplex?: string;
}

export class R2Client {
    async request<T>(
        endpoint: string,
        method: HTTP_METHODS,
        body?: unknown,
        contentType?: CONTENT_TYPES,
        responseType: 'json' | 'response' = 'json',
    ): Promise<T> {
        const { apiUrl, apiVersion, apiToken } = configuration().cloudflare;

        const fetchOptions: CloudflareFetchOptions = {
            method,
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: generateBearerToken(apiToken),
                [HTTP_HEADERS.CONTENT_TYPE]:
                    contentType ?? CONTENT_TYPES.APPLICATION_JSON,
            },
        };

        const httpMethodsWithoutBody = [HTTP_METHODS.GET, HTTP_METHODS.DELETE];

        if (body !== undefined && !httpMethodsWithoutBody.includes(method)) {
            if (contentType === CONTENT_TYPES.APPLICATION_JSON) {
                fetchOptions.body = JSON.stringify(body);
            } else if (contentType === CONTENT_TYPES.APPLICATION_OCTET_STREAM) {
                fetchOptions.body = body as ReadableStream;
                fetchOptions.duplex = 'half';
            }
        }

        const url = buildCloudflareRequestUrl(apiUrl, apiVersion, endpoint);

        const response = await fetch(url, fetchOptions);

        if (responseType === 'response') {
            return response as T;
        }

        const jsonResponse = await response.json();
        return jsonResponse;
    }
}
