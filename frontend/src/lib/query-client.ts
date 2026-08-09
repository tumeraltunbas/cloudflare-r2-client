import { QueryCache, QueryClient } from "@tanstack/react-query";
import { convertMinutesToMilliseconds } from "../utils/time";
import { toast } from "sonner";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(error.message || "Something went wrong");
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: convertMinutesToMilliseconds(2),
		},
	},
});
