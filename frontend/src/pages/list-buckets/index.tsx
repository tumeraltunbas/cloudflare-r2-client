import { LoadingOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table/interface";
import React from "react";
import { Link, useLoaderData, useNavigation } from "react-router";
import { formatDate } from "../../utils/time";

export interface DataType {
	name: string;
	creationDate: string;
}

const columns: ColumnsType<DataType> = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		render: (text: string) => (
			<Link to={`/buckets/${text}/objects`}>{text}</Link>
		),
	},
	{
		title: "Creation Date",
		dataIndex: "creationDate",
		key: "creationDate",
		render: (dateString: string) => formatDate(dateString),
	},
];

export const ListBuckets = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	const [isCreateBucketModalOpen, setIsCreateBucketModalOpen] =
		React.useState<boolean>(false);
	const [newBucketName, setNewBucketName] = React.useState<string>();
	const [isDeleteBucketButtonVisible, setDeleteBucketButtonVisible] =
		React.useState<boolean>(false);

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

	const showDeleteBucketButton = () => {
		setDeleteBucketButtonVisible(true);
	};

	const { buckets } = useLoaderData();

	if (isLoading) {
		return (
			<div className="flex h-screen">
				<Spin
					indicator={<LoadingOutlined spin />}
					size="large"
					style={{ color: "white" }}
					className="m-auto"
				/>
			</div>
		);
	}

	return (
		<div>
			<div className="flex justify-between">
				<h1 className="text-white text-2xl font-bold mb-4">
					R2 Buckets
				</h1>

				<div className="flex gap-2">
					{isDeleteBucketButtonVisible && (
						<Button
							variant="solid"
							color="danger"
							className="mb-4"
							onClick={() => undefined}
						>
							Delete Bucket
						</Button>
					)}

					<Button
						variant="solid"
						className="mb-4"
						onClick={() => showCreateBucketModal()}
					>
						Create New Bucket
					</Button>
				</div>
			</div>

			<Table<DataType>
				columns={columns}
				dataSource={buckets}
				rowSelection={{
					type: "radio",
					onSelect: () => showDeleteBucketButton(),
				}}
				rowKey="name"
			/>

			<Modal
				title="Create New Bucket"
				open={isCreateBucketModalOpen}
				onOk={handleCreateBucketModalSubmit}
				onCancel={hideCreateBucketModal}
			>
				<Input
					placeholder="Bucket Name"
					value={newBucketName}
					onChange={(e) => handleNewBucketNameChange(e)}
				/>
			</Modal>
		</div>
	);
};
