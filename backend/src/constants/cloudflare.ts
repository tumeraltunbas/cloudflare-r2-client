import { HTTP_METHODS } from './enums';

export const CLOUDFLARE_R2_ENDPOINTS = {
    bucket: {
        list: {
            method: HTTP_METHODS.GET,
            endpoint: (accountId: string): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets`,
        },
        get: {
            method: HTTP_METHODS.GET,
            endpoint: (accountId: string, bucketName: string): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucketName)}`,
        },
        create: {
            method: HTTP_METHODS.POST,
            endpoint: (accountId: string): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets`,
        },
        delete: {
            method: HTTP_METHODS.DELETE,
            endpoint: (accountId: string, bucketName: string): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucketName)}`,
        },
    },
    object: {
        list: {
            method: HTTP_METHODS.GET,
            endpoint: (accountId: string, bucketName: string): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucketName)}/objects`,
        },
        get: {
            method: HTTP_METHODS.GET,
            endpoint: (
                accountId: string,
                bucketName: string,
                objectKey: string,
            ): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucketName)}/objects/${encodeURIComponent(objectKey)}`,
        },
        delete: {
            method: HTTP_METHODS.DELETE,
            endpoint: (
                accountId: string,
                bucketName: string,
                objectKey: string,
            ): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucketName)}/objects/${encodeURIComponent(objectKey)}`,
        },
        upload: {
            method: HTTP_METHODS.PUT,
            endpoint: (
                accountId: string,
                bucketName: string,
                objectKey: string,
            ): string =>
                `accounts/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucketName)}/objects/${encodeURIComponent(objectKey)}`,
        },
    },
} as const;
