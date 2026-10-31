import React from "react";
import { Link, useLoaderData, useNavigation } from "react-router";
import { formatDate } from "../../utils/time";
import { Loading } from "../../components/loading";
import { Button } from "../../components/ui/button";
import { Modal, TextField } from "../../components/ui/modal";
import { DataTable, type Column } from "../../components/ui/table";

export interface DataType {
	name: string;
	creationDate: string;
}

const columns: Column<DataType>[] = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		render: (record) => (
			<Link
				to={`/buckets/${record.name}/objects`}
				className="font-medium text-cloudflare-orange-text underline-offset-4 hover:underline"
			>
				{record.name}
			</Link>
		),
	},
	{
		title: "Creation Date",
		dataIndex: "creationDate",
		key: "creationDate",
		render: (record) => (
			<span className="text-ink-500">
				{formatDate(record.creationDate)}
			</span>
		),
	},
];

export const ListBuckets = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	const [isCreateBucketModalOpen, setIsCreateBucketModalOpen] =
		React.useState<boolean>(false);
	const [newBucketName, setNewBucketName] = React.useState<string>();
	const [selectedBucketName, setSelectedBucketName] = React.useState<
		string | null
	>();

	const showCreateBucketModal = () => {
		setIsCreateBucketModalOpen(true);
	};

	const hideCreateBucketModal = () => {
		setNewBucketName("");
		setIsCreateBucketModalOpen(false);
	};

	const handleCreateBucketModalSubmit = () => {
		//TODO: Make API request and invalidate list buckets then.
		setNewBucketName("");
		setIsCreateBucketModalOpen(false);
	};

	const handleNewBucketNameChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewBucketName(e.target.value);
	};

	const handleSelectBucket = (selectedKey: React.Key) => {
		if (!selectedKey) {
			setSelectedBucketName(null);
			return;
		}

		setSelectedBucketName(selectedKey as string);
	};

	const { buckets } = useLoaderData();

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-ink-900">
						R2 Buckets
					</h1>
					<p className="mt-1 text-sm text-ink-500">
						{buckets.length}{" "}
						{buckets.length === 1 ? "bucket" : "buckets"} in this
						account.
					</p>
				</div>

				<div className="flex items-center gap-2">
					{selectedBucketName && (
						<Button variant="danger" onClick={() => undefined}>
							Delete Bucket
						</Button>
					)}

					<Button
						variant="primary"
						onClick={() => showCreateBucketModal()}
					>
						Create New Bucket
					</Button>
				</div>
			</div>

			<DataTable<DataType>
				columns={columns}
				dataSource={buckets}
				rowKey="name"
				selection={{
					onSelect: (selectedKey: React.Key) =>
						handleSelectBucket(selectedKey),
				}}
				emptyState="No buckets yet. Create one to get started."
			/>

			<Modal
				open={isCreateBucketModalOpen}
				title="Create New Bucket"
				description="Bucket names must be unique within this account."
				confirmLabel="Create Bucket"
				onConfirm={handleCreateBucketModalSubmit}
				onClose={hideCreateBucketModal}
			>
				<TextField
					label="Bucket Name"
					placeholder="my-bucket"
					value={newBucketName}
					onChange={(e) => handleNewBucketNameChange(e)}
				/>
			</Modal>
		</div>
	);
};
