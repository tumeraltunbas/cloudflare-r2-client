import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/query-client";
import { fetcher } from "..";

type CreateBucketParams = {
	bucketName: string;
};

type DeleteBucketsParams = {
	bucketNames: string[];
};

export const useCreateBucket = () => {
	return useMutation({
		mutationFn: async ({ bucketName }: CreateBucketParams) => {
			const response = await fetcher(`/cloudflare/buckets`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: bucketName }),
			});

			if (!response.ok) {
				const body = await response.json();
				throw new Error(
					body?.message ?? `Request failed: ${response.status}`
				);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["buckets"] });
		},
	});
};

export const useDeleteBucket = () => {
	return useMutation({
		mutationFn: async ({ bucketNames }: DeleteBucketsParams) => {
			const response = await fetcher(
				"/cloudflare/buckets",
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ names: bucketNames }),
				}
			);

			if (!response.ok) {
				const body = await response.json();
				throw new Error(
					body?.message ?? `Request failed: ${response.status}`
				);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["buckets"] });
		},
	});
};
