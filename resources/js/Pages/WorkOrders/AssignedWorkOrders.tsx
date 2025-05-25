import { useState } from "react";
import { Tabs } from "@/Components/shadcnui/tabs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/Components/shadcnui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Datatable } from "./components/Datatable";
import { StatusCell } from "./components/StatusCell";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { prioritySorting } from "@/utils/prioritySorting";
import FlashToast from "@/Components/FlashToast";
import { statusSorting } from "@/utils/statusSorting";
import ViewWorkOrderModal from "./components/ViewWorkOrderModal";
import { CircleEllipsis } from "lucide-react";

// import FullCalendar from "@fullcalendar/react"; // FullCalendar library
// import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
// import timeGridPlugin from "@fullcalendar/timegrid"; // Week view

export default function AssignedWorkOrders({
    user,
    locations,
    workOrders,
}: {
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    locations: { id: number; name: string }[];
    workOrders: any;
}) {
    const [activeTab, setActiveTab] = useState("list");
    const [isViewingWorkOrder, setIsViewingWorkOrder] = useState<any>(null);

    // Define columns for the data table
    const columns: ColumnDef<{ id: number; location?: { name?: string } }>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: {
                headerClassName: "w-12",
                searchable: true,
            },
        },
        {
            accessorKey: "assigned_at",
            header: "Date Assigned",
            cell: ({ row }) => <div>{row.getValue("assigned_at")}</div>,
            meta: {
                headerClassName: "w-[8rem]",
            },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => (
                <div>{row.original.location?.name || "N/A"}</div>
            ),
            enableSorting: false,
            meta: {
                headerClassName: "max-w-16",
                searchable: true,
                filterable: true,
            },
        },
        {
            accessorKey: "report_description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("report_description")}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "w-[22%]",
                cellClassName: "max-w-16 px-2 text-left whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
            },
        },
        {
            accessorKey: "work_order_type",
            header: "Work Order Type",
            cell: ({ row }) => <div>{row.getValue("work_order_type")}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "w-[10rem]",
                filterable: true,
                searchable: true,
            },
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => (
                <div
                    className={`px-4 py-1 rounded ${getPriorityColor(
                        row.getValue("priority")
                    )}`}
                >
                    {row.getValue("priority")}
                </div>
            ),
            sortingFn: prioritySorting,
            meta: {
                headerClassName: "w-24",
                cellClassName: "max-w-24 flex justify-center",
                filterable: true,
            },
        },
        {
            accessorKey: "scheduled_at",
            header: "Target Date",
            cell: ({ row }) => <div>{row.getValue("scheduled_at")}</div>,
            meta: {
                headerClassName: "max-w-20",
                searchable: true,
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <StatusCell
                    value={row.getValue("status")}
                    user={user}
                    row={row}
                />
            ),
            sortingFn: statusSorting,
            meta: {
                cellClassName: "flex justify-center",
                filterable: true,
            },
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <Button
                    className="bg-primary h-6 text-xs rounded-sm"
                    onClick={() => setIsViewingWorkOrder(row.original)}
                >
                    View
                </Button>
            ),
            enableSorting: false,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Assigned Work Orders" />

            <FlashToast />

            {isViewingWorkOrder && (
                <ViewWorkOrderModal
                    workOrder={isViewingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setIsViewingWorkOrder(null)}
                />
            )}

            <div className="container mx-auto py-4">
                <header className="flex justify-center sm:justify-start">
                    <h1 className="text-xl font-bold">Assigned Work Orders</h1>
                </header>

                {/* Tabs */}
                <div className="relative mt-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {/* Desktop Table View */}
                        <div className="hidden sm:block">
                            <Datatable
                                columns={columns}
                                data={workOrders}
                                placeholder="Search here"
                            />
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden flex flex-col gap-4 mt-20">
                            {workOrders.map((order: any) => {
                                // Priority styling logic from IndexLayout.tsx
                                const normalizedPriority = (
                                    order.priority || ""
                                )
                                    .toLowerCase()
                                    .trim();
                                const priorityAliases: Record<string, string> =
                                    {
                                        low: "low",
                                        medium: "med",
                                        med: "med",
                                        high: "high",
                                        critical: "crit",
                                        crit: "crit",
                                    };
                                const current =
                                    priorityAliases[normalizedPriority] || "";

                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                                    >
                                        <div className="flex justify-between items-start text-sm text-gray-800 mb-1">
                                            <p>
                                                <span className="font-medium">
                                                    ID:
                                                </span>{" "}
                                                {order.id}
                                            </p>
                                            <span
                                                className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(
                                                    order.priority
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1 pr-8 text-sm text-gray-800">
                                            <p>
                                                <span className="font-medium">
                                                    Location:
                                                </span>{" "}
                                                {order.location?.name || "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Description:
                                                </span>{" "}
                                                {order.report_description}
                                            </p>
                                            <p className="flex items-center text-sm">
                                                <span className="font-medium mr-1">
                                                    Priority:
                                                </span>
                                                <span className="flex gap-1">
                                                    {[
                                                        "low",
                                                        "med",
                                                        "high",
                                                        "crit",
                                                    ].map((level) => {
                                                        const isActive =
                                                            current === level;
                                                        const bgColorMap: Record<
                                                            string,
                                                            string
                                                        > = {
                                                            low: "bg-green-100 text-green-800",
                                                            med: "bg-yellow-100 text-yellow-800",
                                                            high: "bg-orange-100 text-orange-800",
                                                            crit: "bg-red-100 text-red-800",
                                                        };
                                                        return (
                                                            <span
                                                                key={level}
                                                                className={`px-2 py-1 text-xs font-semibold border ${
                                                                    isActive
                                                                        ? `${bgColorMap[level]} border-transparent`
                                                                        : "bg-gray-100 text-gray-400 border-gray-300"
                                                                }`}
                                                            >
                                                                {level}
                                                            </span>
                                                        );
                                                    })}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Date Assigned:
                                                </span>{" "}
                                                {order.assigned_at}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Target Date:
                                                </span>{" "}
                                                {order.scheduled_at}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Type:
                                                </span>{" "}
                                                {order.work_order_type}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex justify-between gap-2">
                                            <button className="flex-1 bg-secondary text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 transition">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
