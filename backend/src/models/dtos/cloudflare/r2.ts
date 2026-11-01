import { CONTENT_TYPES } from '../../../constants/enums';

export class R2Response<T> {
    errors: R2Error[];
    messages: string[];
    result: T;
    success: boolean;
    result_info: {
        cursor: string;
        per_page: number;
    };
}

export class R2Error {
    code: number;
    message: string;
    documentation_url: string;
    source: {
        pointer: string;
    };
}

export class ListBucketsResponse {
    buckets: GetBucketResponse[];
}

export class GetBucketResponse {
    creation_date: string;
    jurisdiction: string;
    location: string;
    name: string;
    storage_class: string;
}

export class CreateBucketResponse {
    creation_date: string;
    jurisdiction: string;
    location: string;
    name: string;
    storage_class: string;
}

export class CreateBucketRequest {
    name: string;
}

export class DeleteBucketResponse {}

export class ListObjectsResponse {
    custom_metadata: object;
    etag: string;
    http_metadata: {
        cacheControl: string;
        cacheExpiry: string;
        contentDisposition: string;
        contentEncoding: string;
        contentLanguage: string;
        contentType: string;
    };
    key: string;
    last_modified: string;
    size: number;
    ssec: boolean;
    storage_class: string;
}

export class DeleteObjectResponse {
    key: string;
}

export class GetObjectResponse {
    responseBody: Buffer;
    contentType: CONTENT_TYPES;
}
