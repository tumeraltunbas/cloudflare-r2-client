import configuration from '../configuration/configuration';
import {
    CONTENT_TYPES,
    HTTP_HEADERS,
    HTTP_METHODS,
    RESPONSE_TYPES,
} from '../constants/enums';
import { buildCloudflareRequestUrl, generateBearerToken } from '../utils/str';

interface CloudflareFetchOptions extends RequestInit {
    duplex?: string;
}

export class R2Client {
    async request<T>(
        endpoint: string,
        method: HTTP_METHODS,
        body?: unknown,
        contentType: string = CONTENT_TYPES.APPLICATION_JSON,
        responseType: RESPONSE_TYPES = RESPONSE_TYPES.JSON,
    ): Promise<T> {
        const { apiUrl, apiVersion, apiToken } = configuration().cloudflare;

        const fetchOptions: CloudflareFetchOptions = {
            method,
            headers: {
                [HTTP_HEADERS.AUTHORIZATION]: generateBearerToken(apiToken),
                [HTTP_HEADERS.CONTENT_TYPE]: contentType,
            },
        };

        if (method !== HTTP_METHODS.GET && method !== HTTP_METHODS.DELETE) {
            switch (contentType) {
                case CONTENT_TYPES.APPLICATION_JSON:
                    fetchOptions.body = JSON.stringify(body);
                    break;
                default:
                    fetchOptions.body = body as ReadableStream;
                    fetchOptions.duplex = 'half';
                    break;
            }
        }

        const url = buildCloudflareRequestUrl(apiUrl, apiVersion, endpoint);

        const response = await fetch(url, fetchOptions);

        if (responseType === RESPONSE_TYPES.RAW) {
            return response as T;
        }

        const jsonResponse = await response.json();
        return jsonResponse;
    }
}
