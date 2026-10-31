export function convertBytesToMegabytes(bytes: number): number {
	return +(bytes / (1024 * 1024)).toFixed(2);
}
