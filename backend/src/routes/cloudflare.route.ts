import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest,
} from 'fastify';
import { CloudflareController } from '../controllers/cloudflare.controller';
import {
    CreateBucketResDto,
    ListBucketsResDto,
    ListObjectsResDto,
} from '../models/dtos/project/res/cloudflare';
import { APP_ROUTES } from '../constants/routes';
import {
    CreateBucketReqDto,
    DeleteObjectsBodyReqDto,
    DeleteObjectsParamsReqDto,
    GetObjectReqDto,
    ListObjectsReqDto,
    RemoveBucketReqDto,
    UploadObjectReqDto,
} from '../models/dtos/project/req/cloudflare';
import { CONTENT_TYPES } from '../constants/enums';

export const CloudflareRoutes: FastifyPluginAsync = async (
    fastify: FastifyInstance,
): Promise<void> => {
    const cloudflareController = new CloudflareController();

    fastify.get(
        APP_ROUTES.cloudflare.listBuckets.endpoint,
        async (request: FastifyRequest): Promise<ListBucketsResDto> =>
            cloudflareController.listBuckets(request),
    );

    fastify.post(
        APP_ROUTES.cloudflare.createBucket.endpoint,
        { schema: APP_ROUTES.cloudflare.createBucket.requestDtoSchema },
        async (
            request: FastifyRequest<{ Body: CreateBucketReqDto }>,
        ): Promise<CreateBucketResDto> =>
            cloudflareController.createBucket(request),
    );

    fastify.delete(
        APP_ROUTES.cloudflare.deleteBucket.endpoint,
        {
            schema: APP_ROUTES.cloudflare.deleteBucket.requestDtoSchema,
        },
        async (
            request: FastifyRequest<{ Params: RemoveBucketReqDto }>,
        ): Promise<void> => cloudflareController.deleteBucket(request),
    );

    fastify.get(
        APP_ROUTES.cloudflare.listObjects.endpoint,
        {
            schema: APP_ROUTES.cloudflare.listObjects.requestDtoSchema,
        },
        async (
            request: FastifyRequest<{ Params: ListObjectsReqDto }>,
        ): Promise<ListObjectsResDto> =>
            cloudflareController.listObjects(request),
    );

    fastify.post(
        APP_ROUTES.cloudflare.deleteObject.endpoint,
        {
            schema: APP_ROUTES.cloudflare.deleteObject.requestDtoSchema,
        },
        async (
            request: FastifyRequest<{
                Params: DeleteObjectsParamsReqDto;
                Body: DeleteObjectsBodyReqDto;
            }>,
        ): Promise<void> => cloudflareController.deleteObjects(request),
    );

    fastify.post(
        APP_ROUTES.cloudflare.uploadObject.endpoint,
        {
            schema: APP_ROUTES.cloudflare.uploadObject.requestDtoSchema,
        },
        async (
            request: FastifyRequest<{ Params: UploadObjectReqDto }>,
        ): Promise<void> => cloudflareController.uploadObject(request),
    );

    fastify.get(
        APP_ROUTES.cloudflare.getObject.endpoint,
        {
            schema: APP_ROUTES.cloudflare.getObject.requestDtoSchema,
        },
        async (
            request: FastifyRequest<{ Params: GetObjectReqDto }>,
            reply: FastifyReply,
        ): Promise<void> => {
            const response = await cloudflareController.getObject(request);
            return reply
                .type(CONTENT_TYPES.APPLICATION_OCTET_STREAM)
                .send(response.body);
        },
    );
};
