import type { LoaderFunctionArgs } from "react-router";
import { fetcher } from "..";
import { queryClient } from "../../lib/query-client";

export type ObjectRecord = {
	key: string;
	size: number;
	lastModified: string;
};

export type ListObjectsResponse = {
	objects: ObjectRecord[];
};

export const objectsQueryKey = (bucketName: string) => [
	"objects",
	bucketName,
];

export const objectsQueryOptions = (bucketName: string) => ({
	queryKey: objectsQueryKey(bucketName),
	queryFn: async (): Promise<ListObjectsResponse> => {
		const response = await fetcher(
			`/cloudflare/buckets/${encodeURIComponent(bucketName)}/objects`
		);

		if (!response.ok) {
			const body = await response.json();
			throw new Error(
				body?.message ?? `Request failed: ${response.status}`
			);
		}

		return response.json();
	},
});

export function fetchObjectsLoader({ params }: LoaderFunctionArgs) {
	const bucketName = params.name;

	if (!bucketName) {
		throw new Error("Bucket name is missing.");
	}

	return queryClient.ensureQueryData(objectsQueryOptions(bucketName));
}
