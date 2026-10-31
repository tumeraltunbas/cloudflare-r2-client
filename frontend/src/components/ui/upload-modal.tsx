import React from "react";
import { cx } from "../../utils/cx";
import { Button } from "./button";
import { Modal } from "./modal";
import { Spinner } from "./spinner";
import { convertBytesToMegabytes } from "../../utils/math";

/** Mirrors the backend multipart limit in `configuration().formData`. */
const MAX_UPLOAD_SIZE_IN_BYTES = 300 * 1024 * 1024;

const MAX_UPLOAD_SIZE_IN_MEGABYTES = convertBytesToMegabytes(
	MAX_UPLOAD_SIZE_IN_BYTES
);

interface UploadModalProps {
	open: boolean;
	onClose: () => void;
	onUpload: (file: File) => void;
	isUploading: boolean;
	progress: number;
	errorMessage?: string | null;
}

export const UploadModal = ({ open, ...props }: UploadModalProps) => {
	if (!open) {
		return null;
	}

	return <UploadModalBody {...props} />;
};

type UploadModalBodyProps = Omit<UploadModalProps, "open">;

const UploadModalBody = ({
	onClose,
	onUpload,
	isUploading,
	progress,
	errorMessage,
}: UploadModalBodyProps) => {
	const [file, setFile] = React.useState<File | null>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const [validationError, setValidationError] = React.useState<string | null>(
		null
	);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const clearFile = () => {
		setFile(null);

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const selectFile = (candidate: File | undefined) => {
		if (!candidate) {
			return;
		}

		if (candidate.size > MAX_UPLOAD_SIZE_IN_BYTES) {
			clearFile();
			setValidationError(
				`"${candidate.name}" is ${convertBytesToMegabytes(
					candidate.size
				)} MB. The limit is ${MAX_UPLOAD_SIZE_IN_MEGABYTES} MB.`
			);
			return;
		}

		setValidationError(null);
		setFile(candidate);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);

		if (isUploading) {
			return;
		}

		selectFile(event.dataTransfer.files?.[0]);
	};

	const handleConfirm = () => {
		if (!file || isUploading) {
			return;
		}

		onUpload(file);
	};

	const message = validationError ?? errorMessage ?? null;

	return (
		<Modal
			open
			size="xl"
			title="Upload Object"
			description="Add one file to this bucket."
			confirmLabel="Upload"
			pendingLabel={`Uploading ${progress}%`}
			isConfirming={isUploading}
			confirmDisabled={!file}
			onConfirm={handleConfirm}
			onClose={onClose}
		>
			<div
				onDragOver={(event) => {
					event.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={cx(
					"flex min-h-[18rem] flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center transition-colors duration-150",
					isDragging
						? "border-cloudflare-orange bg-cloudflare-orange-tint"
						: "border-line bg-surface-canvas"
				)}
			>
				<input
					ref={inputRef}
					id="upload-object-input"
					type="file"
					disabled={isUploading}
					onChange={(event) => selectFile(event.target.files?.[0])}
					className="sr-only"
				/>

				{file ? (
					<div className="w-full space-y-1">
						<p className="truncate text-base font-medium text-ink-900">
							{file.name}
						</p>
						<p className="text-sm text-ink-500">
							{convertBytesToMegabytes(file.size)} MB
							{file.type ? ` · ${file.type}` : ""}
						</p>
					</div>
				) : (
					<>
						<p className="text-base text-ink-700">
							Drag a file here, or{" "}
							<label
								htmlFor="upload-object-input"
								className="cursor-pointer font-medium text-cloudflare-orange-text underline-offset-4 hover:underline"
							>
								browse
							</label>
							.
						</p>
						<p className="mt-2 text-sm text-ink-500">
							One file at a time, up to{" "}
							{MAX_UPLOAD_SIZE_IN_MEGABYTES} MB.
						</p>
					</>
				)}

				{file && !isUploading && (
					<Button
						variant="ghost"
						className="mt-3"
						onClick={clearFile}
					>
						Choose a different file
					</Button>
				)}
			</div>

			<dl className="mt-4 grid gap-x-6 gap-y-2 rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm sm:grid-cols-2">
				<div className="flex items-baseline justify-between gap-3 sm:block">
					<dt className="text-ink-500">Maximum file size</dt>
					<dd className="font-medium text-ink-900">
						{MAX_UPLOAD_SIZE_IN_MEGABYTES} MB
					</dd>
				</div>
				<div className="flex items-baseline justify-between gap-3 sm:block">
					<dt className="text-ink-500">Files per upload</dt>
					<dd className="font-medium text-ink-900">1</dd>
				</div>
				<div className="flex items-baseline justify-between gap-3 sm:block">
					<dt className="text-ink-500">Object key</dt>
					<dd className="font-medium text-ink-900">
						The file name
					</dd>
				</div>
				<div className="flex items-baseline justify-between gap-3 sm:block">
					<dt className="text-ink-500">Existing key</dt>
					<dd className="font-medium text-ink-900">
						Overwritten
					</dd>
				</div>
			</dl>

			{isUploading && (
				<div className="mt-4">
					<div
						role="progressbar"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={progress}
						className="h-1.5 w-full overflow-hidden rounded-full bg-surface-overlay"
					>
						<div
							className="h-full rounded-full bg-cloudflare-orange transition-[width] duration-200"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className="mt-2 flex items-center gap-2 text-xs text-ink-500">
						<Spinner className="h-3.5 w-3.5 text-cloudflare-orange" />
						Uploading {progress}%
					</div>
				</div>
			)}

			{message && (
				<p className="mt-4 text-sm text-danger-700">{message}</p>
			)}
		</Modal>
	);
};
