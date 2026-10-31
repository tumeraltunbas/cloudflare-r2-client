export class CreateBucketReqDto {
    name: string;
}

export class RemoveBucketReqDto {
    name: string;
}

export class ListObjectsReqDto {
    name: string;
}

export class DeleteObjectsParamsReqDto {
    name: string;
}

export class DeleteObjectsBodyReqDto {
    keys: string[];
}

export class UploadObjectReqDto {
    name: string;
}

export class GetObjectReqDto {
    name: string;
    key: string;
}
