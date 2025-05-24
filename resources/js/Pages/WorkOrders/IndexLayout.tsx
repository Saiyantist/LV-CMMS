// IndexLayout.tsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcnui/tabs";
import { Button } from "@/Components/shadcnui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import CreateWorkOrderModal from "./components/CreateModal";
import EditWorkOrderModal from "./components/EditModal";
import { StatusCell } from "./components/StatusCell";
import { Datatable } from "./components/Datatable";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { getStatusColor } from "@/utils/getStatusColor";
import { prioritySorting } from "@/utils/prioritySorting";
import FlashToast from "@/Components/FlashToast";
import React, { useState } from "react";
import AssignWorkOrderModal from "./components/AssignWorkOrderModal";
import ViewWorkOrderModal from "./components/ViewWorkOrderModal";
import { BookX, SquarePen } from "lucide-react";
import DeclineWorkOrderModal from "./components/DeclineWorkOrderModal";
import CancelWorkOrderModal from "./components/CancelWorkOrderModal";

interface Props {
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    locations: { id: number; name: string }[];
    assets: {
        id: number;
        name: string;
        location: { id: number; name: string };
    }[];
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    filteredWorkOrders: any[];
    tabs: string[];
    activeTab: string;
    isCreating: boolean;
    editingWorkOrder: any;
    showScrollUpButton: boolean;
    handleDelete: (id: number) => void;
    setActiveTab: (tab: string) => void;
    setIsCreating: (val: boolean) => void;
    setEditingWorkOrder: (workOrder: any) => void;
    scrollToTop: () => void;
}

interface WorkOrders {
    id: number;
    report_description: string;
    work_order_type: string;
    label: string;
    priority: string;
    remarks: string;
    requested_by: {
        id: number;
        name: string;
    };
    requested_at: string;
    scheduled_at: string;
    approved_at: string;
    approved_by: string;
    location: {
        id: number;
        name: string;
    };
    images: string;
    asset: {
        id: number;
        name: string;
        specification_details: string;
        status: string;
        location_id: number;
    }[];
    assigned_to: {
        id: number;
        name: string;
    };
}

export default function IndexLayout({
    user,
    locations,
    assets,
    maintenancePersonnel,
    filteredWorkOrders,
    tabs,
    activeTab,
    isCreating,
    editingWorkOrder,
    showScrollUpButton,
    setActiveTab,
    setIsCreating,
    setEditingWorkOrder,
    scrollToTop,
    handleDelete,
}: Props) {
    const isRequesterOrPersonnel =
    user.roles[0].name === "internal_requester" ||
    user.roles[0].name === "maintenance_personnel";
    const isWorkOrderManager = user.permissions.includes("manage work orders");

    const [isViewingWorkOrder, setIsViewingWorkOrder] = useState<any>(null);
    const [acceptingWorkOrder, setAcceptingWorkOrder] = useState<any>(null);
    const [decliningWorkOrder, setDecliningWorkOrder] = useState<any>(null);
    const [cancellingWorkOrder, setCancellingWorkOrder] = useState<any>(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>(
        []
    );

    const toggleDescription = (id: number) => {
        setExpandedDescriptions((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const requesterOrPersonnelColumns: ColumnDef<WorkOrders>[] = [
        {
            accessorKey: "requested_at",
            header: "Date Requested",
            cell: ({ row }) => <div>{row.getValue("requested_at")}</div>,
            meta: { headerClassName: "w-1/8" },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            meta: {
                headerClassName: "max-w-1/8",
                searchable: true,
                filterable: true,
            },
        },
        {
            accessorKey: "report_description",
            header: "Description",
            cell: ({ row }) => (
                <div>{row.getValue("report_description")}</div>
            ),
            enableSorting: false,
            meta: {
                headerClassName: "w-1/2",
                cellClassName: "max-w-16 px-2 text-left",
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
            meta: {
                cellClassName: "text-center",
                filterable: true,
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        className="bg-primary h-6 text-xs rounded-sm"
                        onClick={() => setIsViewingWorkOrder(row.original)}
                    >
                        View
                    </Button>
                    { row.getValue('status') === "Pending" && (
                    <>
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            className="h-6 text-xs rounded-sm"
                            onClick={() => setEditingWorkOrder(row.original)}
                        ><SquarePen />
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/70 hover:text-white transition-all duration-200"
                            onClick={() => setCancellingWorkOrder(row.original)}
                        ><BookX />
                        </Button>
                    </>
                    )}
                </div>
            ),
            enableSorting: false,
        },
    ];

    const workOrderManagerColumns: ColumnDef<WorkOrders>[] = [
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
            accessorKey: "requested_at",
            header: "Date Requested",
            cell: ({ row }) => <div>{row.getValue("requested_at")}</div>,
            meta: { headerClassName: "w-[7.5rem]" },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "w-[10rem]",
                searchable: true,
                filterable: true,
            },
        },
        {
            accessorKey: "report_description",
            header: "Description",
            cell: ({ row }) => (
                <div>{row.getValue("report_description")}</div>
            ),
            enableSorting: false,
            meta: {
                headerClassName: "min-w-[15rem]",
                cellClassName: "max-w-16 px-2",
                searchable: true,
            },
        },
        ...(activeTab !== "Pending" && activeTab !== "For Budget Request"
            ? [
                {
                    accessorKey: "label",
                    header: "Label",
                    cell: ({ row }: { row: Row<WorkOrders> }) => <div>{row.getValue("label")}</div>,
                    enableSorting: false,
                    meta: {
                        cellClassName: "text-center",
                        searchable: true,
                    }
                },
                {
                    accessorKey: "scheduled_at",
                    header: "Target Date",
                    cell: ({ row }: { row: Row<WorkOrders> }) => <div>{row.getValue("scheduled_at")}</div>,
                    meta: {
                        headerClassName: "max-w-[6rem]",
                        cellClassName: "text-center",
                        searchable: true,
                    },
                },
                {
                    accessorKey: "priority",
                    header: "Priority",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div
                            className={`px-2 py-1 rounded ${getPriorityColor(
                                row.getValue("priority")
                            )}`}
                        >
                            {row.getValue("priority")}
                        </div>
                    ),
                    sortingFn: prioritySorting,
                    meta: {
                        headerClassName: "max-w-20",
                        cellClassName: "text-center",
                        filterable: true,
                    },
                },
                {
                    accessorKey: "assigned_to.name",
                    header: "Assigned to",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div>{row.original.assigned_to?.name || "Unassigned"}</div>
                    ),
                    enableSorting: false,
                    meta: {
                        headerClassName: "max-w-32",
                        cellClassName: "text-center",
                        searchable: true,
                        filterable: true,
                    },
                },
                {
                    accessorKey: "status",
                    header: "Status",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <StatusCell
                            value={row.getValue("status")}
                            user={user}
                            row={row}
                        />
                    ),
                    enableSorting: false,
                    meta: {
                        headerClassName: "max-w-10",
                        cellClassName: "text-center",
                        filterable: true,
                    },
                },
              ]
            : []),
        ...(activeTab === "Pending" || activeTab === "For Budget Request"
            ? [
                {
                    accessorKey: "requested_by",
                    header: "Requested by",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div>{row.original.requested_by?.name || "N/A"}</div>
                    ),
                    enableSorting: false,
                },
                {
                    id: "actions",
                    header: "Action",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div className="flex gap-2">
                            <Button
                                variant={"outline"}
                                className="bg-primary h-6 text-xs text-white rounded-sm !border-none hover:bg-primary/85 hover:text-white transition-all duration-200"
                                onClick={() => setAcceptingWorkOrder(row.original)}
                            >
                                Accept
                            </Button>
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/75 hover:text-white transition-all duration-200"
                                onClick={() => setDecliningWorkOrder(row.original)}
                            ><BookX />
                            </Button>
                        </div>
                    ),
                    enableSorting: false,
                }
            ]
            : [
                {
                    id: "actions",
                    header: "Action",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div className="flex gap-2">
                            <Button
                                className="bg-primary h-6 text-xs rounded-sm"
                                onClick={() => setEditingWorkOrder(row.original)}
                            >
                                Edit
                            </Button>
                            <Button
                                className="bg-red-600 h-6 text-white text-xs rounded-sm hover:bg-red-800 transition"
                                onClick={() => handleDelete(row.original.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    ),
                    enableSorting: false,
                }
            ])
    ];

    const columns: ColumnDef<WorkOrders>[] = isRequesterOrPersonnel 
        ? requesterOrPersonnelColumns 
        : isWorkOrderManager 
            ? workOrderManagerColumns 
            : [];

    return (
        <AuthenticatedLayout>
            <Head title="Work Orders" />

            {/* Modals */}
            {isCreating && (
                <CreateWorkOrderModal
                    locations={locations}
                    assets={assets}
                    user={user}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setIsCreating(false)}
                />
            )}
            {editingWorkOrder && (
                <EditWorkOrderModal
                    workOrder={editingWorkOrder}
                    locations={locations}
                    user={user}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setEditingWorkOrder(null)}
                />
            )}

            {acceptingWorkOrder && (
                <AssignWorkOrderModal
                    workOrder={acceptingWorkOrder}
                    locations={locations}
                    user={user}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setAcceptingWorkOrder(null)}
                />
            )}

            {isViewingWorkOrder && (
                <ViewWorkOrderModal
                    workOrder={isViewingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setIsViewingWorkOrder(null)}
                />
            )}

            {decliningWorkOrder && (
                <DeclineWorkOrderModal
                    workOrder={decliningWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setDecliningWorkOrder(null)}
                />
            )}

            {cancellingWorkOrder && (
                <CancelWorkOrderModal
                    workOrder={cancellingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setCancellingWorkOrder(null)}
                />
            )}
            <FlashToast />

            {/* Header */}
            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        Work Orders
                    </h1>
                    <PrimaryButton
                        onClick={() => setIsCreating(true)}
                        className="bg-secondary text-white hover:bg-primary transition-all duration-200 text-sm sm:text-base px-5 py-2 rounded-md w-full sm:w-auto text-center justify-center"
                    >
                        + Add Work Order
                    </PrimaryButton>
                </div>
            </header>

            {/* Tabs - Desktop */}
            {user.permissions.includes("manage work orders") && (
                <div className="hidden md:flex">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-gray-200 text-black rounded-md mb-6">
                            <TabsTrigger value="Pending">Pending</TabsTrigger>
                            <TabsTrigger value="Accepted">Accepted</TabsTrigger>
                            <TabsTrigger value="For Budget Request">
                                For Budget Request
                            </TabsTrigger>
                            <TabsTrigger value="Declined">Declined</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            )}

            {/* Tabs - Mobile */}
            {user.permissions.includes("manage work orders") && (
                <div className="md:hidden flex justify-end px-4 mt-4">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    >
                        {tabs.map((tab) => (
                            <option key={tab} value={tab}>
                                {tab}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Desktop Table View */}
            <div
                className={`hidden md:block overflow-x-auto rounded-md -mt-[4.1rem] ${
                    !user.permissions.includes("manage work orders")
                        ? "!-mt-[0.7rem]"
                        : ""
                }`}
            >
                <Datatable
                    columns={columns}
                    data={filteredWorkOrders}
                    placeholder="Search here"
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mt-4 px-4">
                {filteredWorkOrders.map((workOrder) => {
                    const description = workOrder.report_description || "";
                    const shouldTruncate = description.length > 25;
                    const priorities = ["Low", "Medium", "High", "Critical"];
                    const shortLabels = {
                        Low: "L",
                        Medium: "M",
                        High: "H",
                        Critical: "C",
                    };

                    return (
                        <div
                            key={workOrder.id}
                            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                        >
                            {/* Top row: ID and Status aligned horizontally */}
                            <div className="flex justify-between items-start text-sm text-gray-800 mb-1">
                                <p>
                                    <span className="font-medium">ID:</span>{" "}
                                    {workOrder.id}
                                </p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                                        workOrder.status
                                    )}`}
                                >
                                    {workOrder.status}
                                </span>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-1 pr-8 text-sm text-gray-800">
                                <p>
                                    <span className="font-medium">
                                        Description:
                                    </span>{" "}
                                    {shouldTruncate
                                        ? `${description.slice(0, 25)}...`
                                        : description}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Location:
                                    </span>{" "}
                                    {workOrder.location?.name || "N/A"}
                                </p>
                                <p className="flex items-center text-sm">
                                    <span className="font-medium mr-1">
                                        Priority:
                                    </span>
                                    <span className="flex gap-1">
                                        {["low", "med", "high", "crit"].map(
                                            (level) => {
                                                const normalizedPriority =
                                                    workOrder.priority
                                                        ?.toLowerCase()
                                                        .trim();

                                                // Mapping for alternate values like "medium" -> "med"
                                                const priorityAliases: Record<
                                                    string,
                                                    string
                                                > = {
                                                    low: "low",
                                                    medium: "med",
                                                    med: "med",
                                                    high: "high",
                                                    critical: "crit",
                                                    crit: "crit",
                                                };

                                                const current =
                                                    priorityAliases[
                                                        normalizedPriority || ""
                                                    ] || "";

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
                                            }
                                        )}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Requested At:
                                    </span>{" "}
                                    {new Date(
                                        workOrder.requested_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-end gap-2">
                                <PrimaryButton
                                    className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                                    onClick={() =>
                                        setEditingWorkOrder(workOrder)
                                    }
                                >
                                    View
                                </PrimaryButton>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll to Top Button */}
            <ScrollToTopButton
                showScrollUpButton={showScrollUpButton}
                scrollToTop={scrollToTop}
            />
        </AuthenticatedLayout>
    );
}
