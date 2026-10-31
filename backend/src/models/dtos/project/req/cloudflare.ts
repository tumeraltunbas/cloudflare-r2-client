export class CreateBucketReqDto {
    name: string;
}

export class RemoveBucketReqDto {
    names: string[];
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

export class GetObjectsParamsReqDto {
    name: string;
}

export class GetObjectsBodyReqDto {
    keys: string[];
}
