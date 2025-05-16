// IndexLayout.tsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcnui/tabs";
import { Button } from "@/Components/shadcnui/button";
import { ColumnDef } from "@tanstack/react-table";
import CreateWorkOrderModal from "./CreateModal";
import EditWorkOrderModal from "./EditModal";
import { StatusCell } from "./components/StatusCell";
import { Datatable } from "./components/Datatable";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { getStatusColor } from "@/utils/getStatusColor";
import { prioritySorting } from "@/utils/prioritySorting";

interface Props {
    user: any;
    locations: any[];
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
    requested_at: string;
    scheduled_at: string;
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
    // Define columns for the data table
    let columns: ColumnDef<WorkOrders>[];

    const isRequesterOrPersonnel =
        user.roles[0].name === "internal_requester" ||
        user.roles[0].name === "maintenance_personnel";
    const canManage = user.permissions.includes("manage work orders");

    if (isRequesterOrPersonnel) {
        columns = [
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
                            onClick={() => setEditingWorkOrder(row.original)}
                        >
                            View
                        </Button>
                    </div>
                ),
                enableSorting: false,
            },
        ];
    } else if (canManage) {
        columns = [
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
                meta: { headerClassName: "w-[8rem]" },
            },
            {
                accessorKey: "location.name",
                header: "Location",
                cell: ({ row }) => <div>{row.original.location.name}</div>,
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
                    headerClassName: "w-[23%]",
                    cellClassName: "max-w-16 px-2",
                    searchable: true,
                },
            },
            {
                accessorKey: "scheduled_at",
                header: "Target Date",
                cell: ({ row }) => <div>{row.getValue("scheduled_at")}</div>,
                meta: {
                    headerClassName: "max-w-[6rem]",
                    cellClassName: "text-center",
                    searchable: true,
                },
            },
            {
                accessorKey: "priority",
                header: "Priority",
                cell: ({ row }) => (
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
                cell: ({ row }) => (
                    <div>{row.original.assigned_to?.name || "Unassigned"}</div>
                ),
                meta: {
                    headerClassName: "max-w-32",
                    cellClassName: "text-center",
                    searchable: true,
                    filterable: true,
                },
            },
            ...(activeTab !== "Pending"
                ? [
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
                          enableSorting: false,
                          meta: {
                              headerClassName: "max-w-10",
                              cellClassName: "text-center",
                              filterable: true,
                          },
                      },
                  ]
                : []) /** Hide status if activeTab is "Pending" */,
            {
                id: "actions",
                header: "Action",
                cell: ({ row }) => (
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
            },
        ];
    } else {
        columns = [];
    }

    return (
        <AuthenticatedLayout>
            <Head title="Work Orders" />

            {/* Modals */}
            {isCreating && (
                <CreateWorkOrderModal
                    locations={locations}
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
                    onClose={() => setEditingWorkOrder(null)}
                />
            )}

            {/* Header */}
            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 sm:gap-6 text-black">
                        <h1 className="text-2xl font-semibold text-center sm:text-left">
                            Work Orders
                        </h1>
                        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                            <PrimaryButton
                                onClick={() => setIsCreating(true)}
                                className="bg-secondary text-white hover:bg-primary transition-all duration-300 
                            text-sm sm:text-base px-5 py-2 rounded-md text-center justify-center w-full sm:w-auto"
                            >
                                + Add Work Order
                            </PrimaryButton>
                        </div>
                        {/* )} */}
                    </div>
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
                {filteredWorkOrders.map((workOrder) => (
                    <div
                        key={workOrder.id}
                        className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                    >
                        {/* Info Section */}
                        <div className="space-y-1 pr-8 text-sm text-gray-800">
                            <p>
                                <span className="font-medium">ID:</span>{" "}
                                {workOrder.id}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Description:
                                </span>{" "}
                                {workOrder.report_description}
                            </p>
                            <p>
                                <span className="font-medium">Location:</span>{" "}
                                {workOrder.location?.name || "N/A"}
                            </p>
                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                    className={`${getStatusColor(
                                        workOrder.status
                                    )}`}
                                >
                                    {workOrder.status}
                                </span>
                            </p>
                            <p>
                                <span className="font-medium">Priority:</span>{" "}
                                <span
                                    className={`${getPriorityColor(
                                        workOrder.priority
                                    )}`}
                                >
                                    {workOrder.priority}
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

                        {/* Action Button */}
                        <div className="mt-4 flex justify-end gap-2">
                            <PrimaryButton
                                className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                                onClick={() => setEditingWorkOrder(workOrder)}
                            >
                                Edit
                            </PrimaryButton>
                            <PrimaryButton
                                className="bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700 transition"
                                onClick={() => handleDelete(workOrder.id)}
                            >
                                Delete
                            </PrimaryButton>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scroll to Top Button */}
            <ScrollToTopButton
                showScrollUpButton={showScrollUpButton}
                scrollToTop={scrollToTop}
            />
        </AuthenticatedLayout>
    );
}
