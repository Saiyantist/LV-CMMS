"use client"

import { useMemo, useState, useRef, useEffect } from "react";
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
import FilterModal from "./FilterModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  placeholder?: string
}

export function Datatable<TData, TValue>({ columns, data, placeholder = "Search" }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({})
  const filterButtonRef = useRef<HTMLButtonElement>(null)

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

  // Get only filterable columns
  const filterableColumns = useMemo(
    () => columns.filter((col) => col.meta?.filterable && col.accessorKey) as ColumnDef<TData, TValue>[],
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
          const value = keys.reduce((obj, k) => obj?.[k], row)
          return value === filterValue
        })
      })
    }

    // Then apply search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        searchableColumns.some((col) => {
          const keys = (col.accessorKey as string).split(".")
          const value = keys.reduce((obj, key) => obj?.[key], item)
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
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        buttonRef={filterButtonRef}
      />

      {/* Datatable */}
      <div className="rounded-md border bg-white overflow-auto">
        <Table className="text-xs">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`h-10 font-bold text-primary bg-stone-50 ${header.column.columnDef.meta?.headerClassName || ""}`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={`flex items-center justify-center ${
                          header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span>
                          {header.column.getIsSorted() === "asc" && <ChevronUp className="h-4 w-4" />}
                          {header.column.getIsSorted() === "desc" && <ChevronDown className="h-4 w-4" />}
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-6">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`text-muted-foreground ${cell.column.columnDef.meta?.cellClassName || ""}`}
                    >
                      <span className="flex items-center justify-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
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
          </div>
        </div>
      )}
    </>
  )
}