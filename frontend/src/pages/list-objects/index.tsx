import React from "react";
import { Link, useLoaderData, useNavigation } from "react-router";
import { formatDate } from "../../utils/time";
import { Loading } from "../../components/loading";
import { Button } from "../../components/ui/button";
import { DataTable, type Column } from "../../components/ui/table";
import { convertBytesToMegabytes } from "../../utils/math";

export interface DataType {
	key: string;
	size: number;
	lastModified: string;
}

const columns: Column<DataType>[] = [
	{
		title: "Key",
		dataIndex: "key",
		key: "key",
		render: (record) => (
			<span className="font-medium text-ink-900">{record.key}</span>
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
			<span className="text-ink-500">{formatDate(record.lastModified)}</span>
		),
	},
];

export const ListObjects = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	const [isObjectActionVisible, setIsObjectActionVisible] =
		React.useState(false);

	const handleObjectSelection = (selectedRowKeys: React.Key[]) => {
		setIsObjectActionVisible(selectedRowKeys.length > 0);
	};

	const handleDownloadObject = () => {
		// TODO: Make API request and trigger object download.
		setIsObjectActionVisible(false);
	};

	const handleDeleteObject = () => {
		// TODO: Make API request and invalidate list objects then.
		setIsObjectActionVisible(false);
	};

	const { objects } = useLoaderData();

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="space-y-6">
			<nav className="flex items-center gap-1.5 text-sm text-ink-500">
				<Link
					to="/buckets"
					className="rounded transition-colors duration-150 hover:text-cloudflare-orange-text"
				>
					Buckets
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
						{objects.length} {objects.length === 1 ? "object" : "objects"} in
						this bucket.
					</p>
				</div>

				<div className="flex items-center gap-2">
					{isObjectActionVisible && (
						<Button variant="danger" onClick={handleDeleteObject}>
							Delete Object
						</Button>
					)}

					{isObjectActionVisible && (
						<Button variant="secondary" onClick={handleDownloadObject}>
							Download Object
						</Button>
					)}
				</div>
			</div>

			<DataTable<DataType>
				columns={columns}
				dataSource={objects}
				rowKey="key"
				selection={{
					onSelect: (selectedKey) =>
						handleObjectSelection(selectedKey ? [selectedKey] : []),
				}}
				emptyState="This bucket has no objects yet."
			/>
		</div>
	);
};
