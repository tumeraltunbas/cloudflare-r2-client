export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export enum HTTP_HEADERS {
    AUTHORIZATION = 'Authorization',
    CONTENT_TYPE = 'Content-Type',
    X_API_KEY = 'x-api-key',
}

export enum CONTENT_TYPES {
    APPLICATION_JSON = 'application/json',
    APPLICATION_OCTET_STREAM = 'application/octet-stream',
    APPLICATION_PDF = 'application/pdf',
    IMAGE_JPEG = 'image/jpeg',
    IMAGE_JPG = 'image/jpeg',
    IMAGE_PNG = 'image/png',
    IMAGE_GIF = 'image/gif',
    IMAGE_WEBP = 'image/webp',
    IMAGE_SVG = 'image/svg+xml',
    TEXT_PLAIN = 'text/plain',
}

export enum HTTP_STATUS_CODES {
    INTERNAL_SERVER_ERROR = 500,
    UNPROCESSABLE_CONTENT = 422,
    OK = 200,
    BAD_REQUEST = 400,
}

export enum JAVASCRIPT_DATA_TYPES {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    OBJECT = 'object',
    ARRAY = 'array',
}
