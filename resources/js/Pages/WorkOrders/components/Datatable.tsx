"use client"

import { useMemo, useState, useRef, useEffect } from "react";
import {
    type ColumnDef as BaseColumnDef,
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
    ChevronsUpDown,
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
import FilterModal from "./FilterModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/shadcnui/select";
import { usePage } from "@inertiajs/react";
import { User } from "@/types";

interface ColumnMeta<TData> {
  headerClassName?: string;
  cellClassName?: string;
  searchable?: boolean;
  filterable?: boolean;
}

export type ColumnDef<TData, TValue> = BaseColumnDef<TData, TValue> & {
  meta?: ColumnMeta<TData>;
  accessorKey?: string;
};

interface DataTableProps<TData extends { priority?: string; status?: string; [key: string]: any }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  placeholder?: string
}


export function Datatable<TData extends { priority?: string; status?: string; [key: string]: any }, TValue>({ columns, data, placeholder = "Search" }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({})
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const user = usePage().props.user as User;

  const isWorkOrderManager = user?.permissions.some((permission: string) =>["manage work orders"].includes(permission));
  const isMaintenancePersonnel = user?.roles.some((role) => role.name === "maintenance_personnel");

  const canSeeCriticalOrOverdue = (row: TData) => {
    if (isWorkOrderManager) {
      return (row.original.priority === "Critical" || row.original.status === "Overdue")
    } else if (isMaintenancePersonnel && row.original.assigned_to?.id === user.id) {
      return (row.original.priority === "Critical" || row.original.status === "Overdue")
    }
    return false
  }
  // Close filter modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterModalOpen && filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
        const modalElement = document.querySelector('[data-filter-modal="true"]')
        if (
            modalElement &&
            !modalElement.contains(event.target as Node) &&
            !filterButtonRef.current.contains(event.target as Node)
        ){
          setIsFilterModalOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterModalOpen])

  // Get only searchable columns
  const searchableColumns = useMemo(
    () => columns.filter((col) => col.meta?.searchable && col.accessorKey) as ColumnDef<TData, TValue>[],
    [columns],
  )

  // Apply search filtering
  const filteredData = useMemo(() => {
    let filtered = data

    // Apply column filters first
    if (Object.keys(columnFilters).length > 0) {
      filtered = filtered.filter((row) => {
        return Object.entries(columnFilters).every(([key, filterValue]) => {
          if (!filterValue || filterValue === "all") return true

          const keys = key.split(".")
          const value = keys.reduce((obj, k) => obj?.[k], row as any)
          return value === filterValue
        })
      })
    }

    // Then apply search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        searchableColumns.some((col) => {
          if (!col.accessorKey) return false;
          const keys = col.accessorKey.split(".")
          const value = keys.reduce((obj, key) => obj?.[key], item as any)
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        }),
      )
    }

    return filtered
  }, [data, searchQuery, searchableColumns, columnFilters])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater({ pageSize, pageIndex }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  })

  // Get the total number of filtered rows
  const totalFilteredRows = table.getFilteredRowModel().rows.length

  // Check if any filters are active
  const hasActiveFilters = Object.values(columnFilters).some((value) => value !== "" && value !== "all")

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex justify-end pb-4 mt-1">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-52 pl-8 rounded-md border bg-white/70 focus-visible:bg-white"
            />
          </div>
          <Button
            ref={filterButtonRef}
            variant={hasActiveFilters ? "default" : "outline"}
            size="sm"
            className={`h-10 gap-1 border rounded-md ${hasActiveFilters ? "bg-primary text-white" : ""}`}
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-white text-primary w-5 h-5 flex items-center justify-center text-xs">
                {Object.values(columnFilters).filter((value) => value !== "" && value !== "all").length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        columns={columns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        data={data}
        buttonRef={filterButtonRef as React.RefObject<HTMLButtonElement>}
      />

      {/* Datatable */}
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table className="text-xs">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`h-10 font-bold text-primary bg-stone-50 ${(header.column.columnDef.meta as ColumnMeta<TData>)?.headerClassName || ""}`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={`flex items-center justify-center gap-1 ${
                          header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span>
                          {header.column.getCanSort() && !header.column.getIsSorted() ? <ChevronsUpDown className="h-3 w-3"/> : null}
                          {header.column.getIsSorted() === "asc" && <ChevronUp className="h-3 w-3" />}
                          {header.column.getIsSorted() === "desc" && <ChevronDown className="h-3 w-3" />}
                        </span>
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
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
                  data-state={row.getIsSelected() && "selected"} 
                  className={`h-6 hover:font-medium ${
                    (canSeeCriticalOrOverdue(row as any)) 
                      ? "bg-red-50 hover:bg-red-100" 
                      : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`text-muted-foreground text-center hover:text-primary ${(cell.column.columnDef.meta as ColumnMeta<TData>)?.cellClassName || ""}`}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-md text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalFilteredRows > 10 && (
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
              const pageIndex = table.getState().pagination.pageIndex
              const pageCount = table.getPageCount()
              const startPage = Math.max(0, pageIndex - 1)
              const endPage = Math.min(pageCount, pageIndex + 2)

              return [...Array(pageCount).keys()].slice(startPage, endPage).map((page) => (
                <Button
                  key={page}
                  variant={pageIndex === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(page)}
                  className={pageIndex === page ? "bg-primary" : ""}
                >
                  {page + 1}
                </Button>
              ))
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-[75px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 25, 30].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>
      )}
    </>
  )
}