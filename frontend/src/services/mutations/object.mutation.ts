import { useMutation } from "@tanstack/react-query";
import { fetcher } from "..";
import { queryClient } from "../../lib/query-client";
import { objectsQueryKey } from "../loaders/objects.loader";

type DeleteObjectParams = {
	bucketName: string;
	key: string;
};

export const useDeleteObject = () => {
	return useMutation({
		mutationFn: async ({ bucketName, key }: DeleteObjectParams) => {
			const response = await fetcher(
				`/cloudflare/buckets/${encodeURIComponent(
					bucketName
				)}/objects/${encodeURIComponent(key)}`,
				{ method: "DELETE" }
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
