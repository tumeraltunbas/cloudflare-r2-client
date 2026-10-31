import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL, fetcher } from "..";
import { queryClient } from "../../lib/query-client";
import { objectsQueryKey } from "../loaders/objects.loader";

type DeleteObjectsParams = {
	bucketName: string;
	keys: string[];
};

type UploadObjectParams = {
	bucketName: string;
	file: File;
	onProgress?: (percent: number) => void;
};

export const useDeleteObject = () => {
	return useMutation({
		mutationFn: async ({ bucketName, keys }: DeleteObjectsParams) => {
			const response = await fetcher(
				`/cloudflare/buckets/${encodeURIComponent(
					bucketName
				)}/objects/remove`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ keys }),
				}
			);

			if (!response.ok) {
				const body = await response.json();
				throw new Error(
					body?.message ?? `Request failed: ${response.status}`
				);
			}
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: objectsQueryKey(variables.bucketName),
			});
		},
	});
};

export function uploadObjectFile(
	bucketName: string,
	file: File,
	onProgress?: (percent: number) => void
): Promise<void> {
	return new Promise((resolve, reject) => {
		const formData = new FormData();
		formData.append("file", file);

		const request = new XMLHttpRequest();
		request.open(
			"POST",
			`${API_BASE_URL}/cloudflare/buckets/${encodeURIComponent(
				bucketName
			)}/objects`
		);

		request.upload.addEventListener("progress", (event) => {
			if (!event.lengthComputable || !onProgress) {
				return;
			}

			onProgress(Math.round((event.loaded / event.total) * 100));
		});

		request.addEventListener("load", () => {
			if (request.status >= 200 && request.status < 300) {
				resolve();
				return;
			}

			reject(
				new Error(
					parseUploadErrorMessage(
						request.responseText,
						request.status
					)
				)
			);
		});

		request.addEventListener("error", () =>
			reject(new Error("Could not reach the server."))
		);

		request.addEventListener("abort", () =>
			reject(new Error("Upload cancelled."))
		);

		request.send(formData);
	});
}

function parseUploadErrorMessage(responseText: string, status: number): string {
	try {
		const body = JSON.parse(responseText);

		if (Array.isArray(body?.messages) && body.messages.length > 0) {
			return body.messages.join(" ");
		}

		if (typeof body?.message === "string" && body.message) {
			return body.message;
		}
	} catch {
		// The response was not JSON, so fall through to the generic message.
	}

	return `Request failed: ${status}`;
}

export const useUploadObject = () => {
	return useMutation({
		mutationFn: async ({
			bucketName,
			file,
			onProgress,
		}: UploadObjectParams) => {
			await uploadObjectFile(bucketName, file, onProgress);
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: objectsQueryKey(variables.bucketName),
			});
		},
	});
};
