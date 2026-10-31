import configuration, {
    CloudflareConfig,
} from '../configuration/configuration';
import { CLOUDFLARE_R2_ENDPOINTS } from '../constants/cloudflare';
import { CONTENT_TYPES, HTTP_HEADERS } from '../constants/enums';
import { R2Client } from '../infrastructure/r2';
import {
    CreateBucketRequest,
    CreateBucketResponse,
    DeleteBucketResponse,
    DeleteObjectResponse,
    GetObjectResponse,
    ListBucketsResponse,
    ListObjectsResponse,
    R2Response,
} from '../models/dtos/cloudflare/r2';

export class CloudflareRequestClient {
    private readonly r2Client: R2Client;
    private readonly cloudflareConfig: CloudflareConfig;

    constructor() {
        this.r2Client = new R2Client();
        this.cloudflareConfig = configuration().cloudflare;
    }

    async listBuckets(): Promise<ListBucketsResponse> {
        const listBucketsInfo = CLOUDFLARE_R2_ENDPOINTS.bucket.list;
        const method = listBucketsInfo.method;
        const endpoint = listBucketsInfo.endpoint(
            this.cloudflareConfig.accountId,
        );

        const response: R2Response<ListBucketsResponse> =
            await this.r2Client.request(endpoint, method);

        if (!response.success) {
            throw response.errors;
        }

        return response.result;
    }

    async createBucket(bucketName: string): Promise<CreateBucketResponse> {
        const createBucketInfo = CLOUDFLARE_R2_ENDPOINTS.bucket.create;
        const method = createBucketInfo.method;
        const endpoint = createBucketInfo.endpoint(
            this.cloudflareConfig.accountId,
        );

        const body: CreateBucketRequest = {
            name: bucketName,
        };

        const response: R2Response<CreateBucketResponse> =
            await this.r2Client.request(
                endpoint,
                method,
                body,
                CONTENT_TYPES.APPLICATION_JSON,
            );

        if (!response.success) {
            throw response.errors;
        }

        return response.result;
    }

    async deleteBucket(bucketNames: string[]): Promise<void> {
        await Promise.all(
            bucketNames.map((bucketName) =>
                this.deleteBucketByName(bucketName),
            ),
        );
    }

    private async deleteBucketByName(
        bucketName: string,
    ): Promise<DeleteBucketResponse> {
        const deleteBucketInfo = CLOUDFLARE_R2_ENDPOINTS.bucket.delete;
        const method = deleteBucketInfo.method;
        const endpoint = deleteBucketInfo.endpoint(
            this.cloudflareConfig.accountId,
            bucketName,
        );

        const response: R2Response<DeleteBucketResponse> =
            await this.r2Client.request(endpoint, method);

        if (!response.success) {
            throw response.errors;
        }

        return response.result;
    }

    async listObjects(bucketName: string): Promise<ListObjectsResponse[]> {
        const listObjectsInfo = CLOUDFLARE_R2_ENDPOINTS.object.list;
        const method = listObjectsInfo.method;
        const endpoint = listObjectsInfo.endpoint(
            this.cloudflareConfig.accountId,
            bucketName,
        );

        const response: R2Response<ListObjectsResponse[]> =
            await this.r2Client.request(endpoint, method);

        if (!response.success) {
            throw response.errors;
        }

        return response.result;
    }

    async deleteObjects(
        bucketName: string,
        objectKeys: string[],
    ): Promise<void> {
        const deleteObjectInfo = CLOUDFLARE_R2_ENDPOINTS.object.delete;
        const method = deleteObjectInfo.method;

        const endpoints = objectKeys.map((key) =>
            deleteObjectInfo.endpoint(
                this.cloudflareConfig.accountId,
                bucketName,
                key,
            ),
        );

        const responses: R2Response<DeleteObjectResponse>[] = await Promise.all(
            endpoints.map((endpoint) =>
                this.r2Client.request<R2Response<DeleteObjectResponse>>(
                    endpoint,
                    method,
                ),
            ),
        );

        const errors = responses
            .filter((response) => !response.success)
            .flatMap((response) => response.errors);

        if (errors.length > 0) {
            throw errors;
        }

        return;
    }

    async uploadObject(
        bucketName: string,
        objectKey: string,
        fileStream: unknown,
    ): Promise<void> {
        const uploadObjectInfo = CLOUDFLARE_R2_ENDPOINTS.object.upload;
        const method = uploadObjectInfo.method;
        const endpoint = uploadObjectInfo.endpoint(
            this.cloudflareConfig.accountId,
            bucketName,
            objectKey,
        );

        const response: R2Response<void> = await this.r2Client.request(
            endpoint,
            method,
            fileStream,
            CONTENT_TYPES.APPLICATION_OCTET_STREAM,
        );

        if (!response.success) {
            throw response.errors;
        }

        return undefined;
    }

    async getObject(
        bucketName: string,
        objectKey: string,
    ): Promise<GetObjectResponse> {
        const getObjectInfo = CLOUDFLARE_R2_ENDPOINTS.object.get;
        const endpoint = getObjectInfo.endpoint(
            this.cloudflareConfig.accountId,
            bucketName,
            objectKey,
        );

        const response = await this.r2Client.request<Response>(
            endpoint,
            getObjectInfo.method,
            undefined,
            undefined,
            'response',
        );

        if (!response.ok) {
            const errorResponse = await response.json();
            throw errorResponse;
        }

        const contentType: CONTENT_TYPES = response.headers.get(
            HTTP_HEADERS.CONTENT_TYPE,
        ) as CONTENT_TYPES;

        const responseBody = Buffer.from(await response.arrayBuffer());

        const getObjectResponse: GetObjectResponse = {
            responseBody,
            contentType,
        };

        return getObjectResponse;
    }
}
