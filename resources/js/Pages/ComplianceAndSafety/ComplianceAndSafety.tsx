import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateComplianceModal from "./components/CreateComplianceModal";
import { Datatable } from "@/Components/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/shadcnui/button";
import { Trash2, MoreVertical, CirclePlus } from "lucide-react";
import { getStatusColor } from "@/utils/getStatusColor";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/shadcnui/dropdown-menu";
import FlashToast from "@/Components/FlashToast";
import { prioritySorting } from "@/utils/prioritySorting";
import { format } from "date-fns";

interface WorkOrder {
    id: number;
    compliance_area: string;
    location: {
        id: number;
        name: string;
    };
    report_description: string;
    remarks: string;
    scheduled_at: string;
    priority: string;
    status: string;
    assigned_to: {
        id: number;
        first_name: string;
        last_name: string;
    };
    requested_by: {
        id: number;
        first_name: string;
        last_name: string;
    };
    requested_at: string;
    attachments: {
        id: number;
        path: string;
        file_type: string;
    }[];
}

interface Props {
    workOrders: WorkOrder[];
    locations: { id: number; name: string }[];
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
}

const ComplianceAndSafety: React.FC<Props> = ({ workOrders, locations, maintenancePersonnel, user }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [viewingItem, setViewingItem] = useState<WorkOrder | null>(null);
    const [editing, setEditing] = useState(false);
    const [editableItem, setEditableItem] = useState<WorkOrder | null>(null);

    const columns: ColumnDef<WorkOrder>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: {
                cellClassName: "w-12",
                searchable: true,
            },
        },
        {
            accessorKey: "compliance_area",
            header: "Compliance Area",
            cell: ({ row }) => <div>{row.getValue("compliance_area")}</div>,
            meta: {
                cellClassName: "max-w-[10rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
                filterable: true,
            },
            enableSorting: false,
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            meta: {
                cellClassName: "max-w-[8rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
                filterable: true,
            },
            enableSorting: false,
        },
        // {
        //     accessorKey: "report_description",
        //     header: "Description",
        //     cell: ({ row }) => <div>{row.getValue("report_description")}</div>,
        //     meta: {
        //         cellClassName: "max-w-[16rem] text-left whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
        //         searchable: true,
        //     },
        //     enableSorting: false,
        // },
        // {
        //     accessorKey: "priority",
        //     header: "Priority",
        //     cell: ({ row }) => (
        //         <div className={`px-2 py-1 rounded ${getPriorityColor(row.getValue("priority"))}`}>
        //             {row.getValue("priority")}
        //         </div>
        //     ),
        //     sortingFn: prioritySorting,
        //     meta: {
        //         cellClassName: "text-center",
        //         filterable: true,
        //     },
        // },
        {
            accessorKey: "assigned_to",
            header: "Assigned To",
            cell: ({ row }) => {
                const assignedTo = row.original.assigned_to;
                return <div>{assignedTo ? `${assignedTo.first_name} ${assignedTo.last_name}` : "Unassigned"}</div>;
            },
            meta: {
                cellClassName: "max-w-[10rem]",
            },
        },
        {
            accessorKey: "scheduled_at",
            header: "Target Date",
            cell: ({ row }) => <div>{format(new Date(row.getValue("scheduled_at")), "yyyy-MM-dd")}</div>,
            meta: {
                cellClassName: "max-w-[8rem]",
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className={`px-2 py-1 rounded ${getStatusColor(row.getValue("status"))}`}>
                    {row.getValue("status")}
                </div>
            ),
            meta: {
                cellClassName: "max-w-[8rem] text-center",
                filterable: true,
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center">
                    {/* Extra Large screens - visible above xl breakpoint */}
                    <div className="hidden xl:flex gap-2">
                        <Button
                            className="bg-secondary h-6 text-xs rounded-sm"
                            onClick={() => {
                                setViewingItem(row.original);
                                setEditableItem(row.original);
                                setEditing(false);
                            }}
                        >
                            View
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/75 hover:text-white transition-all duration-200"
                            onClick={() => {
                                const confirmed = window.confirm(
                                    `Are you sure you want to delete item ID ${row.original.id}?`
                                );
                                if (confirmed) {
                                    // TODO: Implement delete functionality
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Medium screens - visible from md to lg */}
                    <div className="hidden md:flex xl:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-5 w-5 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                    setViewingItem(row.original);
                                    setEditableItem(row.original);
                                    setEditing(false);
                                }}>
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => {
                                        const confirmed = window.confirm(
                                            `Are you sure you want to delete item ID ${row.original.id}?`
                                        );
                                        if (confirmed) {
                                            // TODO: Implement delete functionality
                                        }
                                    }}
                                    className="text-destructive"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ),
            enableSorting: false,
        },
    ];

    return (
        <Authenticated>
            <Head title="Compliance and Safety" />

            <header className="mx-auto px-6 md:px-0 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        Compliance and Safety
                    </h1>
                    <PrimaryButton
                        onClick={() => setIsCreating(true)}
                        className="bg-secondary text-white hover:bg-primary transition-all duration-300 text-base xs:text-lg md:text-base rounded-md w-full sm:w-auto text-center justify-center gap-2"
                    >
                        <span>Add</span>
                        <CirclePlus className="h-5 w-5" />
                    </PrimaryButton>
                </div>
            </header>

            {/* Desktop Table */}
            <div className="hidden sm:block lg:-mt-[4.1rem] overflow-x-auto">
                <Datatable
                    columns={columns}
                    data={workOrders}
                    placeholder="Search for ID, Compliance Area, and Location"
                />
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col gap-4 mt-4">
                {Array.isArray(workOrders) && workOrders.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                    >
                        <div className="flex justify-between items-start text-sm text-gray-800 mb-1">
                            <p>
                                <span className="font-medium">ID:</span>{" "}
                                {item.id}
                            </p>
                            <span className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="space-y-1 pr-8 text-sm text-gray-800">
                            <p>
                                <span className="font-medium">
                                    Compliance Area:
                                </span>{" "}
                                {item.compliance_area}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Location:
                                </span>{" "}
                                {item.location.name}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Description:
                                </span>{" "}
                                {item.report_description}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Priority:
                                </span>{" "}
                                <span className={`px-2 py-1 rounded ${getPriorityColor(item.priority)}`}>
                                    {item.priority}
                                </span>
                            </p>
                            <p>
                                <span className="font-medium">
                                    Assigned To:
                                </span>{" "}
                                {item.assigned_to ? `${item.assigned_to.first_name} ${item.assigned_to.last_name}` : "Unassigned"}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Target Date:
                                </span>{" "}
                                {item.scheduled_at}
                            </p>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                className="w-1/2 bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition"
                                onClick={() => {
                                    setViewingItem(item);
                                    setEditableItem(item);
                                    setEditing(false);
                                }}
                            >
                                View
                            </Button>
                            <Button
                                className="w-1/2 bg-destructive text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition"
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Are you sure you want to delete item ID ${item.id}?`
                                    );
                                    if (confirmed) {
                                        // TODO: Implement delete functionality
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {isCreating && (
                <CreateComplianceModal
                    locations={locations}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setIsCreating(false)}
                />
            )}

            {viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative">
                        <h2 className="text-xl font-semibold mb-4">
                            Compliance & Safety Details
                        </h2>

                        <div className="space-y-3 text-gray-800 text-sm">
                            <div>
                                <label className="block font-semibold mb-1">
                                    ID
                                </label>
                                <input
                                    type="text"
                                    value={editableItem?.id}
                                    disabled
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Compliance Area
                                </label>
                                <input
                                    type="text"
                                    value={editableItem?.compliance_area}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev) => prev ? {
                                            ...prev,
                                            compliance_area: e.target.value,
                                        } : null)
                                    }
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={editableItem?.location.name}
                                    disabled={!editing}
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={editableItem?.report_description}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev) => prev ? {
                                            ...prev,
                                            report_description: e.target.value,
                                        } : null)
                                    }
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Safety Protocols
                                </label>
                                <textarea
                                    value={editableItem?.remarks}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev) => prev ? {
                                            ...prev,
                                            remarks: e.target.value,
                                        } : null)
                                    }
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Priority
                                </label>
                                <input
                                    type="text"
                                    value={editableItem?.priority}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev) => prev ? {
                                            ...prev,
                                            priority: e.target.value,
                                        } : null)
                                    }
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Assigned To
                                </label>
                                <input
                                    type="text"
                                    value={editableItem?.assigned_to ? `${editableItem.assigned_to.first_name} ${editableItem.assigned_to.last_name}` : "Unassigned"}
                                    disabled={!editing}
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Target Date
                                </label>
                                <input
                                    type="date"
                                    value={editableItem?.scheduled_at}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev) => prev ? {
                                            ...prev,
                                            scheduled_at: e.target.value,
                                        } : null)
                                    }
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Status
                                </label>
                                <input
                                    type="text"
                                    value={editableItem?.status}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev) => prev ? {
                                            ...prev,
                                            status: e.target.value,
                                        } : null)
                                    }
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        editing
                                            ? "border-gray-300"
                                            : "border-transparent bg-gray-100"
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                            {!editing && (
                                <>
                                    <Button
                                        onClick={() => {
                                            setEditing(true);
                                        }}
                                        className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-90 transition"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => setViewingItem(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Close
                                    </Button>
                                </>
                            )}

                            {editing && (
                                <>
                                    <Button
                                        onClick={() => {
                                            // TODO: Implement save functionality
                                            setEditing(false);
                                        }}
                                        className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setEditing(false);
                                            setEditableItem(viewingItem);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <FlashToast />
        </Authenticated>
    );
};

export default ComplianceAndSafety;
