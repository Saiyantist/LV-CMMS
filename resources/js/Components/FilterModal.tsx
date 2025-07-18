"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/Components/shadcnui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/shadcnui/select"
import { ColumnDef } from "@tanstack/react-table"

interface ColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
  searchable?: boolean;
  filterable?: boolean;
}

// Change to type instead of interface
type CustomColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: ColumnMeta;
  accessorKey?: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: CustomColumnDef<any, any>[];
  columnFilters: Record<string, any>;
  setColumnFilters: (filters: Record<string, any>) => void;
  data: any[];
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export default function FilterModal({
  isOpen,
  onClose,
  columns,
  columnFilters,
  setColumnFilters,
  data,
  buttonRef,
}: FilterModalProps) {
  // Local state to track filter values before applying
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(columnFilters)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset local filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(columnFilters)

      // Position the modal under the button
      if (buttonRef.current && modalRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect()
        setPosition({
          top: buttonRect.bottom + window.scrollY,
          left: buttonRect.left + window.scrollX - modalRef.current.offsetWidth + buttonRect.width,
        })
      }
    }
  }, [isOpen, columnFilters, buttonRef])

  // Get unique values for a column from the data
  const getUniqueValues = (accessorKey: string) => {
    const keys = accessorKey.split(".")
    const values = data.map((item) => {
      const value = keys.reduce((obj, key) => obj?.[key], item)
      // If the value is an object with name property, return the name
      if (value && typeof value === 'object' && 'name' in value) {
        return value.name
      }
      // Handle boolean values
      if (typeof value === 'boolean') {
        return value ? "Active" : "Inactive"
      }
      return value
    })

    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.toString().localeCompare(b.toString()))
  }

  // Handle filter change
  const handleFilterChange = (columnId: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }))
  }

  // Apply filters
  const applyFilters = () => {
    setColumnFilters(localFilters)
    onClose()
  }

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({})
    setColumnFilters({})
    onClose()
  }

  // Get filterable columns
  const filterableColumns = columns.filter((column) => column.meta?.filterable && column.accessorKey)

  // Custom modal instead of Dialog for positioning
  if (!isOpen) return null

  return (
    <div
      className="fixed z-50 ml-6 2xs:ml-0"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      ref={modalRef}
      data-filter-modal="true"
      onMouseDown={(event) => event.stopPropagation()} // Prevent event propagation
    >
      <div className="bg-white rounded-md shadow-lg border w-80 sm:w-96">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-xl font-semibold">Filter</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="space-y-4 p-4 max-h-[60vh] overflow-y-auto">
          {filterableColumns.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <span className="text-sm italic">
                No available filters for this table
              </span>
            </div>
          ) : (
            filterableColumns.map((column) => {
              const accessorKey = column.accessorKey as string
              const uniqueValues = getUniqueValues(accessorKey)

              return (
                <div key={accessorKey} className="space-y-2">
                  <label className="text-sm font-medium">{column.header?.toString() || accessorKey}</label>
                  <Select
                    value={localFilters[accessorKey] || ""}
                    onValueChange={(value) => handleFilterChange(accessorKey, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {uniqueValues.map((value) => (
                        <SelectItem key={`${accessorKey}-${value}`} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            })
          )}
        </div>

        <div className="flex justify-between p-4 border-t">
          <Button size="sm" className="w-full bg-primary text-white hover:bg-primary/90 mr-2" onClick={applyFilters} disabled={filterableColumns.length === 0}>
            Apply
          </Button>
          <Button size="sm" variant="outline" className="w-full" onClick={clearFilters} disabled={filterableColumns.length === 0}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}