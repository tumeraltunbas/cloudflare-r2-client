import { fetcher } from "..";
import { queryClient } from "../../lib/query-client";

export function fetchBucketsLoader() {
	return queryClient.ensureQueryData({
		queryKey: ["buckets"],
		queryFn: async () => {
			const response = await fetcher("/cloudflare/buckets");

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
