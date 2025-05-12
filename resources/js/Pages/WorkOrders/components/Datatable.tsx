"use client";

import { useState } from "react";
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/Components/shadcnui/button";
import { Input } from "@/Components/shadcnui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/shadcnui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function Datatable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>(""); // Single search input

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            // Combine filtering for description, location, and priority
            const searchValue = filterValue.toLowerCase();
            return (
                row.getValue("description")?.toLowerCase().includes(searchValue) ||
                row.getValue("location")?.toLowerCase().includes(searchValue) ||
                row.getValue("priority")?.toLowerCase().includes(searchValue)
            );
        },
    });

    // Get the total number of filtered rows
    const totalFilteredRows = table.getFilteredRowModel().rows.length;

    return (
        <>
            <div className="flex justify-end pb-4">
                <div className="flex items-center gap-2">
                    {/* Combined Search Input */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            value={globalFilter}
                            onChange={(event) =>
                                setGlobalFilter(event.target.value)
                            }
                            className="h-10 w-52 pl-8 rounded-md border"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-1 border rounded-md"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                    </Button>
                </div>
            </div>
            <div className="rounded-md border bg-white">
                <Table className="text-xs">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                onClick={
                                                    header.column.getCanSort()
                                                        ? header.column.getToggleSortingHandler()
                                                        : undefined
                                                }
                                                    className={`flex items-center justify-start ${
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer"
                                                        : "cursor-default"
                                                }`}
                                            >
                                                <span>{flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}</span>
                                                <span className="w-4 ml-2">
                                                    {header.column.getIsSorted() === "asc" && (
                                                        <ChevronUp className="h-4 w-4" />
                                                    )}
                                                    {header.column.getIsSorted() === "desc" && (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}
                                            className="text-muted-foreground">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalFilteredRows > 5 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>

                        {/* Page Buttons */}
                        {(() => {
                            const pageIndex = table.getState().pagination.pageIndex;
                            const pageCount = table.getPageCount();
                            const startPage = Math.max(0, pageIndex - 1); // Show 1 page before the current page
                            const endPage = Math.min(pageCount, pageIndex + 2); // Show 2 pages after the current page

                            return [...Array(pageCount).keys()]
                                .slice(startPage, endPage)
                                .map((page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            pageIndex === page ? "default" : "outline"
                                        }
                                        size="sm"
                                        onClick={() => table.setPageIndex(page)}
                                        // disabled={pageIndex === page} // Disable the current page button
                                        className={
                                            pageIndex === page ? "bg-primary" : ""
                                        }
                                    >
                                        {page + 1}
                                    </Button>
                                ));
                        })()}

                        {/* Next Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="gap-1"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
