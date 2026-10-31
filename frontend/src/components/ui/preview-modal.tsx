import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./button";
import { Modal } from "./modal";
import { Spinner } from "./spinner";
import { objectBlobQueryOptions } from "../../services/queries/object.query";
import { getPreviewKind, getFileNameFromKey } from "../../utils/file";

interface PreviewModalProps {
	bucketName: string;
	objectKey: string;
	onClose: () => void;
	onDownload: () => void;
}

function useObjectUrl(blob: Blob | undefined): string | null {
	const [entry, setEntry] = React.useState<{
		blob: Blob;
		url: string;
	} | null>(null);

	React.useEffect(() => {
		if (!blob) {
			return;
		}

		const url = URL.createObjectURL(blob);
		setEntry({ blob, url });

		return () => URL.revokeObjectURL(url);
	}, [blob]);

	return entry && entry.blob === blob ? entry.url : null;
}

export const PreviewModal = ({
	bucketName,
	objectKey,
	onClose,
	onDownload,
}: PreviewModalProps) => {
	const { data, isPending, isError, error, refetch } = useQuery(
		objectBlobQueryOptions(bucketName, objectKey)
	);

	const objectUrl = useObjectUrl(data);
	const previewKind = getPreviewKind(objectKey);

	return (
		<Modal
			open
			title="Object Preview"
			description={getFileNameFromKey(objectKey)}
			confirmLabel="Download"
			cancelLabel="Close"
			size="lg"
			onConfirm={onDownload}
			onClose={onClose}
		>
			<div className="flex min-h-[16rem] items-center justify-center">
				{isPending && (
					<Spinner className="h-7 w-7 text-cloudflare-orange" />
				)}

				{isError && (
					<div className="flex flex-col items-center gap-3 text-center">
						<p className="text-sm text-ink-500">
							{error instanceof Error
								? error.message
								: "Could not load this object."}
						</p>
						<Button variant="secondary" onClick={() => refetch()}>
							Try Again
						</Button>
					</div>
				)}

				{!isPending && !isError && objectUrl && (
					<PreviewBody
						kind={previewKind}
						objectUrl={objectUrl}
						objectKey={objectKey}
					/>
				)}
			</div>
		</Modal>
	);
};

interface PreviewBodyProps {
	kind: ReturnType<typeof getPreviewKind>;
	objectUrl: string;
	objectKey: string;
}

const PreviewBody = ({ kind, objectUrl, objectKey }: PreviewBodyProps) => {
	switch (kind) {
		case "image":
			return (
				<img
					src={objectUrl}
					alt={getFileNameFromKey(objectKey)}
					className="max-h-[65vh] max-w-full rounded-lg object-contain"
				/>
			);

		case "video":
			return (
				<video
					src={objectUrl}
					controls
					className="max-h-[65vh] max-w-full rounded-lg"
				>
					Your browser cannot play this video.
				</video>
			);

		case "pdf":
			return (
				<iframe
					src={objectUrl}
					title={getFileNameFromKey(objectKey)}
					className="h-[65vh] w-full rounded-lg border border-line bg-surface-canvas"
				/>
			);

		default:
			return (
				<div className="text-center">
					<p className="text-sm text-ink-500">
						No preview available for this file type.
					</p>
					<p className="mt-1 text-xs text-ink-400">
						Download it to open it locally.
					</p>
				</div>
			);
	}
};
