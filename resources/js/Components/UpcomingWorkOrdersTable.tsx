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
import ViewWorkOrderModal from "@/Pages/WorkOrders/components/ViewWorkOrderModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/shadcnui/card";
// import { getStatusColor } from "@/utils/getStatusColor";
import { getPriorityColor } from "@/utils/getPriorityColor";

interface WorkOrder {
    id: number;
    location: { id: number; name: string };
    report_description: string;
    requested_at: string;
    requested_by: { id: number; name: string };
    asset: any;
    status: string;
    work_order_type: string;
    label: string;
    priority: string;
    scheduled_at: string;
    assigned_to: { id: number; name: string };
    approved_at: string;
    approved_by: string;
    remarks: string;
    attachments: string[];
}

interface ColumnMeta {
    headerClassName?: string;
    cellClassName?: string;
}

interface UpcomingWorkOrdersTableProps {
    data: WorkOrder[];
    locations: { id: number; name: string }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
}

export function UpcomingWorkOrdersTable({ data, locations, user }: UpcomingWorkOrdersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'scheduled_at', desc: false }]);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

    const columns = useMemo<ColumnDef<WorkOrder, any>[]>(() => [
        {
            accessorKey: "scheduled_at",
            header: "Target Date",
            meta: {
                headerClassName: "w-[15%]",
            } as ColumnMeta,
            enableSorting: false,
        },
        {
            accessorKey: "requested_at",
            header: "Requested",
            meta: {
                headerClassName: "w-[15%]",
            } as ColumnMeta,
        },
        {
            accessorKey: "location.name",
            header: "Location",
            meta: {
                headerClassName: "w-[10%]",
                cellClassName: "whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            } as ColumnMeta,
            enableSorting: false,
        },
        // {
        //     accessorKey: "status",
        //     header: "Status",
        //     cell: ({ row }) => (
        //         <span className={`px-2 py-1 border rounded ${getStatusColor(row.original.status)}`}>
        //             {row.original.status}
        //         </span>
        //     ),
        //     meta: {
        //         headerClassName: "w-[15%]",
        //     } as ColumnMeta,
        // },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => (
                <span className={`px-2 py-1 border rounded ${getPriorityColor(row.original.priority)}`}>
                    {row.original.priority}
                </span>
            ),
            meta: {
                headerClassName: "w-[10%]",
            } as ColumnMeta,
        },
        {
            accessorKey: "assigned_to.name",
            header: "Assigned to",
            meta: {
                headerClassName: "w-[15%]",
                cellClassName: "",
            } as ColumnMeta,
            enableSorting: false,
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
            {selectedWorkOrder && (
                <ViewWorkOrderModal
                    workOrder={selectedWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setSelectedWorkOrder(null)}
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
                                        onClick={() => setSelectedWorkOrder(row.original)}
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
                                        No upcoming work orders found.
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
                    data.map((workOrder) => (
                        <Card
                            key={workOrder.id}
                            onClick={() => setSelectedWorkOrder(workOrder)}
                            className="hover:bg-muted hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start text-xs sm:text-base">
                                    <p className="bg-primary rounded-md px-2 py-1 text-xs sm:text-sm text-white">
                                        <span className="font-bold">ID:</span> {workOrder.id}
                                    </p>
                                    <span className={`font-semibold px-2.5 py-1 border rounded ${getPriorityColor(workOrder.priority)}`}>
                                        {workOrder.priority}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 pr-8 text-gray-800">
                                    <p>
                                        <span className="font-bold text-primary">Target Date:</span>{" "}
                                        {new Date(workOrder.scheduled_at).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Asset:</span>{" "}
                                        {workOrder.asset?.name || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Location:</span>{" "}
                                        {workOrder.location?.name || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Assigned to:</span>{" "}
                                        {workOrder.assigned_to?.name || "N/A"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        No upcoming work orders found.
                    </div>
                )}
            </div>
        </>
    );
} 