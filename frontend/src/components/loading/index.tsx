import { Spinner } from "../ui/spinner";

export const Loading = () => {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
			<Spinner className="h-7 w-7 text-cloudflare-orange" />
			<p className="text-sm font-medium text-ink-500">Loading…</p>
		</div>
	);
};
