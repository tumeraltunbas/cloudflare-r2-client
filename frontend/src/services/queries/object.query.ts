import { fetcher } from "..";
import { getFileNameFromKey } from "../../utils/file";

export const objectBlobQueryKey = (bucketName: string, objectKey: string) => [
	"object",
	bucketName,
	objectKey,
];

function buildObjectEndpoint(bucketName: string, objectKey: string): string {
	return `/cloudflare/buckets/${encodeURIComponent(
		bucketName
	)}/objects/${encodeURIComponent(objectKey)}`;
}

export async function fetchObjectBlob(
	bucketName: string,
	objectKey: string
): Promise<Blob> {
	const response = await fetcher(buildObjectEndpoint(bucketName, objectKey));

	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new Error(body?.message ?? `Request failed: ${response.status}`);
	}

	return response.blob();
}

export const objectBlobQueryOptions = (
	bucketName: string,
	objectKey: string
) => ({
	queryKey: objectBlobQueryKey(bucketName, objectKey),
	queryFn: () => fetchObjectBlob(bucketName, objectKey),
	staleTime: 0,
	gcTime: 0,
});

export async function downloadObjectFile(
	bucketName: string,
	objectKey: string
): Promise<void> {
	const blob = await fetchObjectBlob(bucketName, objectKey);
	const objectUrl = URL.createObjectURL(blob);

	const anchor = document.createElement("a");
	anchor.href = objectUrl;
	anchor.download = getFileNameFromKey(objectKey);

	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();

	// Revoking immediately can cancel the save in some browsers.
	window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
