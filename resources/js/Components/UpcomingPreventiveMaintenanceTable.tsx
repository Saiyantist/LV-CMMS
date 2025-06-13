import { useMemo, useState } from "react";
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/shadcnui/table";
import ViewPMModal from "@/Pages/PreventiveMaintenance/components/ViewPMModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/shadcnui/card";
import { formatDate } from "date-fns";

interface PreventiveMaintenance {
    id: number;
    asset: {
        id: number;
        name: string;
        last_maintained_at: string;
        maintenance_schedule?: {
            id: number;
            asset_id: number;
            interval_unit: string;
            interval_value: number | null;
            month_week: number | null;
            month_weekday: string | null;
            year_day: number | null;
            year_month: number | null;
            last_run_at: string;
            is_active: boolean;
        };
    };
    assigned_to: { id: number; name: string };
    scheduled_at: string;
    location: { id: number; name: string };
    report_description: string;
    requested_at: string;
    requested_by: { id: number; name: string };
    status: string;
    work_order_type: string;
    label: string;
    priority: string;
    approved_at: string;
    approved_by: string;
    remarks: string;
    images: string[];
}

interface ColumnMeta {
    headerClassName?: string;
    cellClassName?: string;
}

interface UpcomingPreventiveMaintenanceTableProps {
    data: PreventiveMaintenance[];
    locations: { id: number; name: string }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
}

export function UpcomingPreventiveMaintenanceTable({ data, locations, user }: UpcomingPreventiveMaintenanceTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'scheduled_at', desc: false }]);
    const [selectedPM, setSelectedPM] = useState<PreventiveMaintenance | null>(null);

    const columns = useMemo<ColumnDef<PreventiveMaintenance, any>[]>(() => [
        {
            accessorKey: "scheduled_at",
            header: "Scheduled Date",
            cell: ({ row }) => {
                const date = row.original.scheduled_at;
                return date ? formatDate(date, "MM/dd/yyyy") : "N/A";
            },
            meta: {
                headerClassName: "w-[25%]",
            } as ColumnMeta,
        },
        {
            accessorKey: "asset.name",
            header: "Asset",
            meta: {
                headerClassName: "w-[20%]",
                cellClassName: "whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            } as ColumnMeta,
            enableSorting: false,
        },
        {
            accessorKey: "assigned_to.name",
            header: "Assigned to",
            meta: {
                headerClassName: "w-[25%]",
            } as ColumnMeta,
            enableSorting: false,
        },
        {
            id: "last_maintained_at",
            header: "Last Maintained",
            accessorFn: (row) => row.asset?.last_maintained_at,
            cell: ({ row }) => {
                const date = row.original.asset?.last_maintained_at;
                return date ? formatDate(date, "MM/dd/yyyy") : "N/A";
            },
            meta: {
                headerClassName: "w-[25%]",
            } as ColumnMeta,
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            {selectedPM && (
                <ViewPMModal
                    workOrder={selectedPM}
                    locations={locations}
                    user={user}
                    onClose={() => setSelectedPM(null)}
                />
            )}
            {/* Table View - Hidden on md screens */}
            <div className="space-y-4 h-[10rem] hidden md:block">
                <div className="rounded-b border bg-white overflow-x-auto">
                    <Table className="text-xs">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={`h-10 text-white bg-primary ${(header.column.columnDef.meta as ColumnMeta)?.headerClassName || ""}`}
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
                                        className="h-6 hover:font-medium cursor-pointer"
                                        onClick={() => setSelectedPM(row.original)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={`text-muted-foreground text-center hover:text-primary ${(cell.column.columnDef.meta as ColumnMeta)?.cellClassName || ""}`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-md text-center">
                                        No upcoming preventive maintenance found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Card View - Shown on md screens */}
            <div className="md:hidden space-y-4 max-h-[20rem] overflow-y-auto scrollbar-hide hover:overflow-y-scroll">
                {data.length > 0 ? (
                    data.map((pm) => (
                        <Card
                            key={pm.id}
                            onClick={() => setSelectedPM(pm)}
                            className="hover:bg-muted hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start text-xs sm:text-base">
                                    <p className="bg-primary rounded-md px-2 py-1 text-xs sm:text-sm text-white">
                                        <span className="font-bold">ID:</span> {pm.id}
                                    </p>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 pr-8 text-gray-800">
                                    <p>
                                        <span className="font-bold text-primary">Scheduled:</span>{" "}
                                        {new Date(pm.scheduled_at).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Asset:</span>{" "}
                                        {pm.asset?.name || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Last Maintained:</span>{" "}
                                        {pm.asset?.last_maintained_at ? formatDate(pm.asset.last_maintained_at, "MM/dd/yyyy") : "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Assigned to:</span>{" "}
                                        {pm.assigned_to?.name || "N/A"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        No upcoming preventive maintenance found.
                    </div>
                )}
            </div>
        </>
    );
} 