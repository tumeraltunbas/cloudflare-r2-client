import React from "react";
import { Link, useNavigation, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../utils/time";
import { Loading } from "../../components/loading";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { DataTable, type Column } from "../../components/ui/table";
import { convertBytesToMegabytes } from "../../utils/math";
import {
	useDeleteObject,
	useUploadObject,
} from "../../services/mutations/object.mutation";
import {
	objectsQueryOptions,
	type ObjectRecord,
} from "../../services/loaders/objects.loader";
import { PreviewModal } from "../../components/ui/preview-modal";
import { UploadModal } from "../../components/ui/upload-modal";
import { downloadObjectFile } from "../../services/queries/object.query";
import { toast } from "sonner";

const buildColumns = (
	onPreview: (objectKey: string) => void
): Column<ObjectRecord>[] => [
	{
		title: "Key",
		dataIndex: "key",
		key: "key",
		render: (record) => (
			<button
				type="button"
				onClick={(event) => {
					event.stopPropagation();
					onPreview(record.key);
				}}
				className="font-medium text-cloudflare-orange-text underline-offset-4 hover:underline"
			>
				{record.key}
			</button>
		),
	},
	{
		title: "Size",
		dataIndex: "size",
		key: "size",
		render: (record) => (
			<span className="tabular-nums text-ink-500">
				{convertBytesToMegabytes(record.size)} MB
			</span>
		),
	},
	{
		title: "Last Modified At",
		dataIndex: "lastModified",
		key: "lastModifiedAt",
		render: (record) => (
			<span className="text-ink-500">
				{formatDate(record.lastModified)}
			</span>
		),
	},
];

export const ListObjects = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	const { name: bucketName } = useParams();
	const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
	const [previewKey, setPreviewKey] = React.useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
	const [isDownloading, setIsDownloading] = React.useState(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
	const [uploadProgress, setUploadProgress] = React.useState(0);
	const [uploadError, setUploadError] = React.useState<string | null>(null);

	const {
		mutate: deleteObject,
		isPending: isDeleting,
		reset: resetDeleteObject,
	} = useDeleteObject();

	const {
		mutate: uploadObject,
		isPending: isUploading,
		reset: resetUploadObject,
	} = useUploadObject();

	const columns = React.useMemo(
		() => buildColumns((objectKey) => setPreviewKey(objectKey)),
		[]
	);

	const handleObjectSelection = (selectedRowKeys: React.Key[]) => {
		setSelectedKeys(selectedRowKeys.map(String));
	};

	const hidePreviewModal = () => {
		setPreviewKey(null);
	};

	const handleDownloadObject = async (
		objectKeys: string[] = selectedKeys
	) => {
		if (!bucketName || objectKeys.length === 0) {
			return;
		}

		setIsDownloading(true);

		try {
			await downloadObjectFile(bucketName, objectKeys);
			setSelectedKeys([]);
			toast.success("Download started.");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Could not download this object."
			);
		} finally {
			setIsDownloading(false);
		}
	};

	const showUploadModal = () => {
		setUploadProgress(0);
		setUploadError(null);
		setIsUploadModalOpen(true);
	};

	const hideUploadModal = () => {
		setIsUploadModalOpen(false);
		setUploadProgress(0);
		setUploadError(null);
		resetUploadObject();
	};

	const handleUploadObject = (file: File) => {
		if (!bucketName) {
			return;
		}

		setUploadProgress(0);
		setUploadError(null);

		uploadObject(
			{
				bucketName,
				file,
				onProgress: setUploadProgress,
			},
			{
				onSuccess: () => {
					toast.success(`Uploaded "${file.name}".`);
					hideUploadModal();
				},
				onError: (error) => {
					setUploadError(
						error instanceof Error
							? error.message
							: "Could not upload this file."
					);
				},
			}
		);
	};

	const showDeleteModal = () => {
		setIsDeleteModalOpen(true);
	};

	const hideDeleteModal = () => {
		setIsDeleteModalOpen(false);
		resetDeleteObject();
	};

	const handleDeleteObject = () => {
		if (!bucketName || selectedKeys.length === 0) {
			return;
		}

		deleteObject(
			{ bucketName, keys: selectedKeys },
			{
				onSuccess: () => {
					setSelectedKeys([]);
					setIsDeleteModalOpen(false);
				},
			}
		);
	};

	const { data, isPending } = useQuery({
		...objectsQueryOptions(bucketName ?? ""),
		enabled: Boolean(bucketName),
	});

	const objects = data?.objects ?? [];

	if (isLoading || (isPending && Boolean(bucketName))) {
		return <Loading />;
	}

	return (
		<div className="space-y-6">
			<nav className="flex items-center gap-3 text-sm text-ink-500">
				<Link
					to="/buckets"
					aria-label="Back to buckets"
					className="inline-flex items-center rounded-md p-1 transition-colors duration-150 hover:bg-surface-overlay hover:text-cloudflare-orange-text"
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 19.5 8.25 12l7.5-7.5"
						/>
					</svg>
				</Link>
				<span className="text-ink-300" aria-hidden="true">
					/
				</span>
				<span className="font-medium text-ink-900">
					{objects.length} objects
				</span>
			</nav>

			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-ink-900">
						Bucket Objects
					</h1>
					<p className="mt-1 text-sm text-ink-500">
						{objects.length}{" "}
						{objects.length === 1 ? "object" : "objects"} in this
						bucket.
					</p>
				</div>

				<div className="flex items-center gap-2">
					{selectedKeys.length > 0 && (
						<Button
							variant="primary"
							onClick={() => handleDownloadObject()}
							disabled={isDownloading}
						>
							{isDownloading
								? "Downloading..."
								: selectedKeys.length === 1
								? "Download Object"
								: "Download Objects"}
						</Button>
					)}

					{selectedKeys.length > 0 && (
						<Button variant="danger" onClick={showDeleteModal}>
							{selectedKeys.length === 1
								? "Delete Object"
								: "Delete Objects"}
						</Button>
					)}

					{selectedKeys.length === 0 && (
						<Button variant="primary" onClick={showUploadModal}>
							Upload Object
						</Button>
					)}
				</div>
			</div>

			<DataTable<ObjectRecord>
				columns={columns}
				dataSource={objects}
				rowKey="key"
				selection={{
					selectedKeys,
					onSelect: (selectedKeys) =>
						handleObjectSelection(selectedKeys),
				}}
				emptyState="This bucket has no objects yet."
			/>

			<Modal
				open={isDeleteModalOpen}
				title={
					selectedKeys.length === 1
						? "Delete Object"
						: "Delete Objects"
				}
				description={
					selectedKeys.length === 1
						? `This permanently deletes "${selectedKeys[0]}" from this bucket. This action cannot be undone.`
						: `This permanently deletes ${selectedKeys.length} objects from this bucket. This action cannot be undone.`
				}
				confirmLabel={
					selectedKeys.length === 1
						? "Delete Object"
						: "Delete Objects"
				}
				pendingLabel="Deleting..."
				confirmVariant="danger"
				isConfirming={isDeleting}
				onConfirm={handleDeleteObject}
				onClose={hideDeleteModal}
			/>

			<UploadModal
				open={isUploadModalOpen}
				onClose={hideUploadModal}
				onUpload={handleUploadObject}
				isUploading={isUploading}
				progress={uploadProgress}
				errorMessage={uploadError}
			/>

			{previewKey && bucketName && (
				<PreviewModal
					bucketName={bucketName}
					objectKey={previewKey}
					onClose={hidePreviewModal}
					onDownload={() => handleDownloadObject([previewKey])}
				/>
			)}
		</div>
	);
};
