import { fetcher } from "..";
import { getFileNameFromKey } from "../../utils/file";

export const objectBlobQueryKey = (bucketName: string, objectKey: string) => [
	"object",
	bucketName,
	objectKey,
];

function buildObjectEndpoint(bucketName: string): string {
	return `/cloudflare/buckets/${encodeURIComponent(
		bucketName
	)}/objects/download`;
}

export async function fetchObjectBlob(
	bucketName: string,
	objectKeys: string[]
): Promise<Blob> {
	const response = await fetcher(buildObjectEndpoint(bucketName), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ keys: objectKeys }),
	});

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
	queryFn: () => fetchObjectBlob(bucketName, [objectKey]),
	staleTime: 0,
	gcTime: 0,
});

export async function downloadObjectFile(
	bucketName: string,
	objectKeys: string[]
): Promise<void> {
	const blob = await fetchObjectBlob(bucketName, objectKeys);
	const objectUrl = URL.createObjectURL(blob);

	const anchor = document.createElement("a");
	anchor.href = objectUrl;
	anchor.download =
		objectKeys.length === 1
			? getFileNameFromKey(objectKeys[0])
			: "objects.zip";

	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();

	// Revoking immediately can cancel the save in some browsers.
	window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
