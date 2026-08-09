export function convertMinutesToMilliseconds(minutes: number): number {
	return minutes * 60 * 1000;
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
