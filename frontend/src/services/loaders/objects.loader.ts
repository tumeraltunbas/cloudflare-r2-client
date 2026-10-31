import type { LoaderFunctionArgs } from "react-router";
import { fetcher } from "..";
import { queryClient } from "../../lib/query-client";

export function fetchObjectsLoader({ params }: LoaderFunctionArgs) {
	const bucketName = params.name;

	if (!bucketName) {
		throw new Error("Bucket name is missing.");
	}

	return queryClient.ensureQueryData({
		queryKey: ["objects"],
		queryFn: async () => {
			const response = await fetcher(
				`/cloudflare/buckets/${bucketName}/objects`
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
}
