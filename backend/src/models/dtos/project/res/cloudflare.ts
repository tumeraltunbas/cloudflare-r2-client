export class ListBucketsResDto {
    buckets: {
        name: string;
        creationDate: string;
    }[];
}

export class CreateBucketResDto {
    name: string;
}

export class ListObjectsResDto {
    objects: {
        key: string;
        size: number;
        lastModified: Date;
    }[];
}

export class GetObjectResDto {
    body: unknown;
    contentType: string;
    fileName?: string;
}
