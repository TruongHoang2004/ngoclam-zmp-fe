"use client";

import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState";

export interface BaseTableState {
    pagination: PaginationState;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    rowSelection?: RowSelectionState;
}

const defaultTableState: BaseTableState = {
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
    columnFilters: [],
};

interface BaseTableProps<T extends object> {
    data: T[];
    count?: number;
    columns: ColumnDef<T>[];
    tableState?: Partial<BaseTableState>;
    isLoading?: boolean;
    isError?: boolean;
    onTableStateChange?: (newState: BaseTableState) => void;
    renderColumnFilters?: () => React.ReactNode;
    onRowClick?: (row: T) => void;
    showPagination?: boolean;
}

const BaseTable = <T extends object>({
    data,
    columns,
    isLoading = false,
    isError = false,
    tableState = defaultTableState,
    onTableStateChange,
    count = data.length,
    renderColumnFilters,
    onRowClick,
    showPagination = true,
}: BaseTableProps<T>) => {
    const updateTableState = (newState: BaseTableState) => {
        onTableStateChange?.(newState);
    };

    const pageCount = React.useMemo(() => {
        return Math.ceil(count / (tableState.pagination?.pageSize || 10));
    }, [count, tableState.pagination?.pageSize]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            ...tableState,
        },
        pageCount,
        onSortingChange: (updater) => {
            const newSorting =
                typeof updater === "function"
                    ? updater(tableState.sorting ?? [])
                    : updater;
            updateTableState({
                ...tableState,
                sorting: newSorting,
            } as BaseTableState);
        },
        onColumnFiltersChange: (updater) => {
            const newColumnFilters =
                typeof updater === "function"
                    ? updater(tableState.columnFilters ?? [])
                    : updater;
            updateTableState({
                ...tableState,
                columnFilters: newColumnFilters,
            } as BaseTableState);
        },
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function"
                    ? updater(tableState.pagination ?? { pageIndex: 0, pageSize: 10 })
                    : updater;
            updateTableState({
                ...tableState,
                pagination: newPagination,
            } as BaseTableState);
        },
        onRowSelectionChange: (updater) => {
            const newRowSelection =
                typeof updater === "function"
                    ? updater(tableState.rowSelection ?? {})
                    : updater;
            updateTableState({
                ...tableState,
                rowSelection: newRowSelection,
            } as BaseTableState);
        },
        manualPagination: true,
        manualFiltering: true,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }
    if (isError) return <div>Error fetching data</div>;
    if (data.length <= 0)
        return (
            <div className="space-y-4">
                {renderColumnFilters && (
                    <div className="flex items-center gap-4">{renderColumnFilters()}</div>
                )}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <EmptyState />
            </div>
        );

    return (
        <div className="space-y-4">
            {renderColumnFilters && (
                <div className="flex items-center gap-4">{renderColumnFilters()}</div>
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                onClick={
                                    onRowClick ? () => onRowClick(row.original) : undefined
                                }
                                className={onRowClick ? "cursor-pointer" : ""}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {showPagination && (
                <div
                    className={cn(
                        "flex items-center justify-between space-x-2 py-4",
                        tableState ? "visible" : "hidden"
                    )}
                >
                    <div className="flex items-center space-x-2">
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                        Page{" "}
                        <span className="font-medium">
                            {table.getState().pagination.pageIndex + 1}
                        </span>{" "}
                        of <span className="font-medium">{table.getPageCount()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseTable;
