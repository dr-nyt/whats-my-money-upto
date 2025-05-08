"use client";
import { Table as TableT, ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, SortingState, getSortedRowModel, Row } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { CSSProperties, use, useCallback, useEffect, useState } from "react";
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from "@mynaui/icons-react";

interface TableRowStyleRuleT<TData> {
	column: keyof TData;
	expression: ">=" | ">" | "==" | "<" | "<=";
	value: string | number;
	style: CSSProperties;
}
interface DataTableUIPropsT<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	dataP: Promise<TData[]>
	sortingState?: SortingState
	paginationSize?: "full" | number;
	hiddenColumns?: (keyof TData)[];
	styleRules?: TableRowStyleRuleT<TData>[];
}
export function DataTableUI<TData, TValue>({ columns, dataP, sortingState = [], paginationSize = "full", hiddenColumns = [], styleRules = [] }: DataTableUIPropsT<TData, TValue>) {
	const data = use(dataP);

	const [sorting, setSorting] = useState<SortingState>(sortingState);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: paginationSize === "full" ? undefined : getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		initialState: {
			pagination: { pageSize: paginationSize === "full" ? data.length : 10 },
		},
		state: { sorting },
	});

	useEffect(() => {
		(hiddenColumns && hiddenColumns.length) && table.setColumnVisibility(hideColumns(hiddenColumns));
	}, [hiddenColumns, table]);

	const hideColumns = (keys: (keyof TData)[]): { [key: string]: boolean } => {
		return keys.reduce((acc, key) => {
			acc[key as string] = false;
			return acc;
		}, {} as { [key: string]: boolean });
	};

	const getRowStyle = useCallback((row: Row<TData>): CSSProperties => {
		const rowStyle: CSSProperties = styleRules.reduce((style, rule) => {
			let newRule: CSSProperties = {};
			if (rule.expression === ">") newRule = row.original[rule.column] > rule.value ? rule.style : {};
			else if (rule.expression === ">=") newRule = row.original[rule.column] >= rule.value ? rule.style : {};
			else if (rule.expression === "==") newRule = row.original[rule.column] == rule.value ? rule.style : {};
			else if (rule.expression === "<=") newRule = row.original[rule.column] <= rule.value ? rule.style : {};
			else if (rule.expression === "<") newRule = row.original[rule.column] < rule.value ? rule.style : {};
			return { ...style, ...newRule };
		}, {});
		return rowStyle;
	}, [styleRules]);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								style={getRowStyle(row)}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{paginationSize !== "full" && <DataTableUIPagination table={table} />}
		</div>
	)
}


interface DataTableUIPaginationPropsT<TData> {
	table: TableT<TData>
}
export function DataTableUIPagination<TData>({ table }: DataTableUIPaginationPropsT<TData>) {
	return (
		<div className="flex items-center justify-between px-2">
			<div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronDoubleLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronDoubleRight />
					</Button>
				</div>
			</div>
		</div>
	)
}
