export type PreviewKind = "image" | "video" | "pdf" | "unsupported";

const IMAGE_EXTENSIONS = [
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"avif",
	"bmp",
	"svg",
];

const VIDEO_EXTENSIONS = ["mp4", "webm", "ogv", "ogg", "mov", "m4v"];

export function getFileNameFromKey(key: string): string {
	const segments = key.split("/");
	return segments[segments.length - 1] || key;
}

export function getFileExtension(key: string): string {
	const fileName = getFileNameFromKey(key);
	const dotIndex = fileName.lastIndexOf(".");

	if (dotIndex <= 0) {
		return "";
	}

	return fileName.slice(dotIndex + 1).toLowerCase();
}

export function getPreviewKind(key: string): PreviewKind {
	const extension = getFileExtension(key);

	if (IMAGE_EXTENSIONS.includes(extension)) {
		return "image";
	}

	if (VIDEO_EXTENSIONS.includes(extension)) {
		return "video";
	}

	if (extension === "pdf") {
		return "pdf";
	}

	return "unsupported";
}
