import { JAVASCRIPT_DATA_TYPES } from './enums';

export const GLOBAL_PREFIX = '/cloudflare';

export const APP_ROUTES = {
    cloudflare: {
        listBuckets: {
            endpoint: '/buckets',
        },
        createBucket: {
            endpoint: '/buckets',
            requestDtoSchema: {
                body: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        name: {
                            type: JAVASCRIPT_DATA_TYPES.STRING,
                            transform: ['trim'],
                            minLength: 1,
                        },
                    },
                    required: ['name'],
                },
            },
        },
        deleteBucket: {
            endpoint: '/buckets',
            requestDtoSchema: {
                body: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        names: {
                            type: JAVASCRIPT_DATA_TYPES.ARRAY,
                            items: {
                                type: JAVASCRIPT_DATA_TYPES.STRING,
                                transform: ['trim'],
                                minLength: 1,
                            },
                            minItems: 1,
                        },
                    },
                    required: ['names'],
                },
            },
        },
        listObjects: {
            endpoint: '/buckets/:name/objects',
            requestDtoSchema: {
                params: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        name: {
                            type: JAVASCRIPT_DATA_TYPES.STRING,
                            transform: ['trim'],
                            minLength: 1,
                        },
                    },
                    required: ['name'],
                },
            },
        },
        deleteObject: {
            endpoint: '/buckets/:name/objects/remove',
            requestDtoSchema: {
                params: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        name: {
                            type: JAVASCRIPT_DATA_TYPES.STRING,
                            transform: ['trim'],
                            minLength: 1,
                        },
                    },
                    required: ['name'],
                },
                body: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        keys: {
                            type: JAVASCRIPT_DATA_TYPES.ARRAY,
                            items: {
                                type: JAVASCRIPT_DATA_TYPES.STRING,
                                transform: ['trim'],
                                minLength: 1,
                            },
                        },
                    },
                    required: ['keys'],
                },
            },
        },
        uploadObject: {
            endpoint: '/buckets/:name/objects',
            requestDtoSchema: {
                params: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        name: {
                            type: JAVASCRIPT_DATA_TYPES.STRING,
                            transform: ['trim'],
                            minLength: 1,
                        },
                    },
                    required: ['name'],
                },
            },
        },
        getObject: {
            endpoint: '/buckets/:name/objects/download',
            requestDtoSchema: {
                params: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        name: {
                            type: JAVASCRIPT_DATA_TYPES.STRING,
                            transform: ['trim'],
                            minLength: 1,
                        },
                    },
                    required: ['name'],
                },
                body: {
                    type: JAVASCRIPT_DATA_TYPES.OBJECT,
                    properties: {
                        keys: {
                            type: JAVASCRIPT_DATA_TYPES.ARRAY,
                            items: {
                                type: JAVASCRIPT_DATA_TYPES.STRING,
                                transform: ['trim'],
                                minLength: 1,
                            },
                            minItems: 1,
                        },
                    },
                    required: ['keys'],
                },
            },
        },
    },
} as const;
