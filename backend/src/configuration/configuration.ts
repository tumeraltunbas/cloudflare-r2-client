import dotenv from 'dotenv';
import { convertMegabytesToBytes } from '../utils/math';

dotenv.config();

export default (): Configuration => ({
    application: {
        port: parseInt(process.env.PORT) ?? 3000,
    },
    cloudflare: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: process.env.CLOUDFLARE_API_TOKEN,
        apiUrl: 'https://api.cloudflare.com/client',
        apiVersion: 'v4',
    },
    formData: {
        maxFileSize: convertMegabytesToBytes(300),
        maxFileCount: 1,
        fieldName: 'file',
    },
    baseUrl: {
        clientBaseUrl: process.env.CLIENT_BASE_URL,
    },
});

interface Configuration {
    application: ApplicationConfig;
    cloudflare: CloudflareConfig;
    formData: FormDataConfig;
    baseUrl: BaseUrlConfig;
}

export interface ApplicationConfig {
    port: number;
}

export interface CloudflareConfig {
    accountId: string;
    apiToken: string;
    apiUrl: string;
    apiVersion: string;
}

export interface FormDataConfig {
    maxFileSize: number;
    maxFileCount: number;
    fieldName: string;
}

export interface BaseUrlConfig {
    clientBaseUrl: string;
}
