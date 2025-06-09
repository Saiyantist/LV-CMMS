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
import ViewComplianceModal from "@/Pages/ComplianceAndSafety/components/ViewComplianceModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/shadcnui/card";
import { formatDate } from "date-fns";

interface ComplianceWorkOrder {
    id: number;
    scheduled_at: string;
    compliance_area: string;
    location: { id: number; name: string };
    assigned_to: { id: number; first_name: string; last_name: string };
    status: string;
    report_description: string;
    requested_at: string;
    requested_by: { id: number; first_name: string; last_name: string };
    approved_at: string;
    approved_by: string;
    remarks: string;
    attachments: string[];
    priority: string;
}

interface ColumnMeta {
    headerClassName?: string;
    cellClassName?: string;
}

interface UpcomingCompliancesTableProps {
    data: ComplianceWorkOrder[];
    locations: { id: number; name: string }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
}

export function UpcomingCompliancesTable({ data, locations, user, maintenancePersonnel }: UpcomingCompliancesTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'scheduled_at', desc: false }]);
    const [selectedCompliance, setSelectedCompliance] = useState<ComplianceWorkOrder | null>(null);

    const columns = useMemo<ColumnDef<ComplianceWorkOrder, any>[]>(() => [
        {
            accessorKey: "scheduled_at",
            header: "Target Date",
            cell: ({ row }) => {
                const date = row.original.scheduled_at;
                return date ? formatDate(date, "MM/dd/yyyy") : "No date set";
            },
            meta: {
                headerClassName: "w-[25%]",
            } as ColumnMeta,
        },
        {
            accessorKey: "compliance_area",
            header: "Compliance Area",
            meta: {
                headerClassName: "w-[25%]",
                cellClassName: "whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            } as ColumnMeta,
            enableSorting: false,
        },
        {
            accessorKey: "location.name",
            header: "Location",
            meta: {
                headerClassName: "w-[25%]",
                cellClassName: "whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            } as ColumnMeta,
            enableSorting: false,
        },
        {
            accessorKey: "assigned_to",
            header: "Assigned to",
            cell: ({ row }) => {
                const assignedTo = row.original.assigned_to;
                return assignedTo ? `${assignedTo.first_name} ${assignedTo.last_name}` : "N/A";
            },
            meta: {
                headerClassName: "w-[25%]",
                cellClassName: "whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
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
            {selectedCompliance && (
                <ViewComplianceModal
                    workOrder={selectedCompliance}
                    locations={locations}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setSelectedCompliance(null)}
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
                                        onClick={() => setSelectedCompliance(row.original)}
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
                                        No upcoming compliances found.
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
                    data.map((compliance) => (
                        <Card
                            key={compliance.id}
                            onClick={() => setSelectedCompliance(compliance)}
                            className="hover:bg-muted hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start text-xs sm:text-base">
                                    <p className="bg-primary rounded-md px-2 py-1 text-xs sm:text-sm text-white">
                                        <span className="font-bold">ID:</span> {compliance.id}
                                    </p>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 pr-8 text-gray-800">
                                    <p>
                                        <span className="font-bold text-primary">Target Date:</span>{" "}
                                        {compliance.scheduled_at ? formatDate(compliance.scheduled_at, "MM/dd/yyyy") : "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Compliance Area:</span>{" "}
                                        {compliance.compliance_area || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Location:</span>{" "}
                                        {compliance.location?.name || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-bold text-primary">Assigned to:</span>{" "}
                                        {compliance.assigned_to ? `${compliance.assigned_to.first_name} ${compliance.assigned_to.last_name}` : "N/A"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        No upcoming compliances found.
                    </div>
                )}
            </div>
        </>
    );
} 