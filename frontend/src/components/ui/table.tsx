import React from "react";
import { cx } from "../../utils/cx";

export interface Column<T> {
	title: string;
	dataIndex: keyof T & string;
	key: string;
	render?: (record: T) => React.ReactNode;
	align?: "left" | "right";
	width?: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	dataSource: T[];
	rowKey: keyof T & string;
	selection?: {
		onSelect: (selectedKey: React.Key) => void;
	};
	emptyState?: React.ReactNode;
}

const SELECTION_COLUMN_WIDTH = "48px";

export function DataTable<T>({
	columns,
	dataSource,
	rowKey,
	selection,
	emptyState,
}: DataTableProps<T>) {
	const [selectedKey, setSelectedKey] = React.useState<React.Key | null>(
		null
	);

	const handleSelect = (key: React.Key) => {
		const nextKey = selectedKey === key ? null : key;
		setSelectedKey(nextKey);
		selection?.onSelect(nextKey ?? "");
	};

	return (
		<div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-line bg-surface-raised">
							{selection && (
								<th
									scope="col"
									className="px-4 py-3"
									style={{ width: SELECTION_COLUMN_WIDTH }}
								>
									<span className="sr-only">Select</span>
								</th>
							)}
							{columns.map((column) => (
								<th
									key={column.key}
									scope="col"
									style={
										column.width
											? { width: column.width }
											: undefined
									}
									className={cx(
										"whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500",
										column.align === "right"
											? "text-right"
											: "text-left"
									)}
								>
									{column.title}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{dataSource.length === 0 && (
							<tr>
								<td
									colSpan={
										columns.length + (selection ? 1 : 0)
									}
									className="px-4 py-12 text-center text-sm text-ink-500"
								>
									{emptyState ?? "Nothing here yet."}
								</td>
							</tr>
						)}

						{dataSource.map((record) => {
							const key = record[rowKey] as React.Key;
							const isSelected = selectedKey === key;

							return (
								<tr
									key={String(key)}
									onClick={() =>
										selection && handleSelect(key)
									}
									className={cx(
										"border-b border-line/70 last:border-b-0 transition-colors duration-100",
										selection && "cursor-pointer",
										isSelected
											? "bg-cloudflare-orange-tint"
											: "hover:bg-surface-raised"
									)}
								>
									{selection && (
										<td className="px-4 py-3.5 align-middle">
											<input
												type="radio"
												name="row-selection"
												checked={isSelected}
												onChange={() =>
													handleSelect(key)
												}
												onClick={(event) =>
													event.stopPropagation()
												}
												aria-label={`Select ${String(
													key
												)}`}
												className="h-4 w-4 cursor-pointer accent-cloudflare-orange"
											/>
										</td>
									)}

									{columns.map((column) => {
										const value = record[column.dataIndex];
										return (
											<td
												key={column.key}
												className={cx(
													"px-4 py-3.5 align-middle text-ink-700",
													column.align === "right"
														? "text-right"
														: "text-left"
												)}
											>
												{column.render
													? column.render(record)
													: String(value ?? "")}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
