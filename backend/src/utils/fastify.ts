import fastifyMultipart from '@fastify/multipart';
import { CloudflareRoutes } from '../routes/cloudflare.route';
import { FastifyInstance } from 'fastify';
import { GLOBAL_PREFIX } from '../constants/routes';
import configuration, { FormDataConfig } from '../configuration/configuration';
import cors from '@fastify/cors';
import { HTTP_METHODS } from '../constants/enums';

export function registerFastifyPlugins(server: FastifyInstance): void {
    const formDataConfig: FormDataConfig = configuration().formData;
    const baseUrlConfig = configuration().baseUrl;

    server.register(cors, {
        origin: baseUrlConfig.clientBaseUrl,
        credentials: true,
        methods: Object.values(HTTP_METHODS),
    });

    server.register(fastifyMultipart, {
        limits: {
            fileSize: formDataConfig.maxFileSize,
            files: formDataConfig.maxFileCount,
        },
    });

    server.register(CloudflareRoutes, { prefix: GLOBAL_PREFIX });
}
