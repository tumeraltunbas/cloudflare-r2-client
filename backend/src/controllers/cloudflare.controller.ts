import { FastifyRequest } from 'fastify';
import { CloudflareService } from '../services/cloudflare.service';
import {
    CreateBucketResDto,
    GetObjectResDto,
    ListBucketsResDto,
    ListObjectsResDto,
} from '../models/dtos/project/res/cloudflare';
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

export class CloudflareController {
    private readonly cloudflareService: CloudflareService;

    constructor() {
        this.cloudflareService = new CloudflareService();
    }

    async listBuckets(request: FastifyRequest): Promise<ListBucketsResDto> {
        return this.cloudflareService.listBuckets(request);
    }

    async createBucket(
        request: FastifyRequest<{ Body: CreateBucketReqDto }>,
    ): Promise<CreateBucketResDto> {
        return this.cloudflareService.createBucket(request);
    }

    async deleteBucket(
        request: FastifyRequest<{ Body: RemoveBucketReqDto }>,
    ): Promise<void> {
        return this.cloudflareService.deleteBucket(request);
    }

    async listObjects(
        request: FastifyRequest<{ Params: ListObjectsReqDto }>,
    ): Promise<ListObjectsResDto> {
        return this.cloudflareService.listObjects(request);
    }

    async deleteObjects(
        request: FastifyRequest<{
            Params: DeleteObjectsParamsReqDto;
            Body: DeleteObjectsBodyReqDto;
        }>,
    ): Promise<void> {
        return this.cloudflareService.deleteObjects(request);
    }

    async uploadObject(
        request: FastifyRequest<{ Params: UploadObjectReqDto }>,
    ): Promise<void> {
        return this.cloudflareService.uploadObject(request);
    }

    async getObject(
        request: FastifyRequest<{
            Params: GetObjectsParamsReqDto;
            Body: GetObjectsBodyReqDto;
        }>,
    ): Promise<GetObjectResDto> {
        return this.cloudflareService.getObject(request);
    }
}
