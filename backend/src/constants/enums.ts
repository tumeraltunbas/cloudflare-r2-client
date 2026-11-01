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
    CONTENT_DISPOSITION = 'Content-Disposition',
    X_API_KEY = 'x-api-key',
}

export enum CONTENT_TYPES {
    APPLICATION_JSON = 'application/json',
    APPLICATION_ZIP = 'application/zip',
    APPLICATION_OCTET_STREAM = 'application/octet-stream',
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

export enum RESPONSE_TYPES {
    RAW = 'raw',
    JSON = 'json',
}
