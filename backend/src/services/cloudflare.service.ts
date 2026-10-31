import { FastifyRequest } from 'fastify';
import {
    CreateBucketResponse,
    GetObjectResponse,
    ListBucketsResponse,
    ListObjectsResponse,
} from '../models/dtos/cloudflare/r2';
import {
    CreateBucketResDto,
    GetObjectResDto,
    ListBucketsResDto,
    ListObjectsResDto,
} from '../models/dtos/project/res/cloudflare';
import { CloudflareRequestClient } from '../request-clients/cloudflare.request-client';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../infrastructure/error/error';
import {
    CreateBucketReqDto,
    DeleteObjectsBodyReqDto,
    DeleteObjectsParamsReqDto,
    GetObjectsBodyReqDto,
    GetObjectsParamsReqDto,
    ListObjectsReqDto,
    RemoveBucketReqDto,
    UploadObjectReqDto,
} from '../models/dtos/project/req/cloudflare';
import { MultipartFile } from '@fastify/multipart';
import { ERROR_CODES } from '../constants/error';
import { CONTENT_TYPES } from '../constants/enums';
import configuration, { FormDataConfig } from '../configuration/configuration';
import JSZip from 'jszip';

export class CloudflareService {
    private readonly cloudflareRequestClient: CloudflareRequestClient;

    constructor() {
        this.cloudflareRequestClient = new CloudflareRequestClient();
    }

    async listBuckets(request: FastifyRequest): Promise<ListBucketsResDto> {
        let listBucketsResponse: ListBucketsResponse = null;

        try {
            listBucketsResponse =
                await this.cloudflareRequestClient.listBuckets();
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - listBuckets - listBuckets',
            );
            throw new ProcessFailureError();
        }

        const listBucketsResDto: ListBucketsResDto = {
            buckets: listBucketsResponse.buckets.map((b) => ({
                name: b.name,
                creationDate: b.creation_date,
            })),
        };

        return listBucketsResDto;
    }

    async createBucket(
        request: FastifyRequest<{ Body: CreateBucketReqDto }>,
    ): Promise<CreateBucketResDto> {
        const { body } = request;

        let createBucketResponse: CreateBucketResponse = null;

        try {
            createBucketResponse =
                await this.cloudflareRequestClient.createBucket(body.name);
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - createBucket - createBucket',
            );
            throw new ProcessFailureError();
        }

        const createBucketResDto: CreateBucketResDto = {
            name: createBucketResponse.name,
        };

        return createBucketResDto;
    }

    async deleteBucket(
        request: FastifyRequest<{ Body: RemoveBucketReqDto }>,
    ): Promise<void> {
        try {
            await this.cloudflareRequestClient.deleteBucket(request.body.names);
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - deleteBucket - deleteBucket',
            );
            throw new ProcessFailureError();
        }

        return undefined;
    }

    async listObjects(
        request: FastifyRequest<{ Params: ListObjectsReqDto }>,
    ): Promise<ListObjectsResDto> {
        const { params } = request;

        let listObjectsResponse: ListObjectsResponse[] = null;

        try {
            listObjectsResponse =
                await this.cloudflareRequestClient.listObjects(params.name);
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - listObjects - listObjects',
            );
            throw new ProcessFailureError();
        }

        const listObjectsResDto: ListObjectsResDto = {
            objects: listObjectsResponse.map((o) => ({
                key: o.key,
                size: o.size,
                lastModified: new Date(o.last_modified),
            })),
        };

        return listObjectsResDto;
    }

    async deleteObjects(
        request: FastifyRequest<{
            Params: DeleteObjectsParamsReqDto;
            Body: DeleteObjectsBodyReqDto;
        }>,
    ): Promise<void> {
        const { params, body } = request;

        try {
            await this.cloudflareRequestClient.deleteObjects(
                params.name,
                body.keys,
            );
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - deleteObject - deleteObject',
            );
            throw new ProcessFailureError();
        }

        return undefined;
    }

    async uploadObject(
        request: FastifyRequest<{ Params: UploadObjectReqDto }>,
    ): Promise<void> {
        const { params } = request;
        const formDataConfig: FormDataConfig = configuration().formData;

        let file: MultipartFile = null;

        try {
            file = await request.file();
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - uploadObject - uploadObject',
            );
            throw new ProcessFailureError();
        }

        if (!file || file.fieldname !== formDataConfig.fieldName) {
            throw new BusinessRuleError(ERROR_CODES.FILE_NOT_FOUND);
        }

        const trimmedObjectKey: string = file.filename.trim();

        try {
            await this.cloudflareRequestClient.uploadObject(
                params.name,
                trimmedObjectKey,
                file.file,
            );
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - uploadObject - uploadObject',
            );
            throw new ProcessFailureError();
        }

        return undefined;
    }

    async getObject(
        request: FastifyRequest<{
            Params: GetObjectsParamsReqDto;
            Body: GetObjectsBodyReqDto;
        }>,
    ): Promise<GetObjectResDto> {
        const { params, body } = request;

        let getObjectResponses: GetObjectResponse[] = null;

        try {
            getObjectResponses = await Promise.all(
                body.keys.map((key) =>
                    this.cloudflareRequestClient.getObject(params.name, key),
                ),
            );
        } catch (error) {
            request.log.error(
                { error },
                'Cloudflare service - getObject - getObject',
            );
            throw new ProcessFailureError();
        }

        const zip = new JSZip();

        body.keys.forEach((key, index) => {
            zip.file(key, getObjectResponses[index].responseBody as Buffer);
        });

        const getObjectResDto: GetObjectResDto = {
            body: await zip.generateAsync({ type: 'nodebuffer' }),
            contentType: CONTENT_TYPES.APPLICATION_ZIP,
        };

        return getObjectResDto;
    }
}
