import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import AddComplianceAndSafetyModal from "./components/AddComplianceAndSafetyModal";
import { Datatable } from "@/Components/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

const ComplianceAndSafety: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [viewingItem, setViewingItem] = useState<any | null>(null);
    const [editing, setEditing] = useState(false);
    const [editableItem, setEditableItem] = useState<any>({});

    // Move complianceData to state for frontend manipulation
    const [complianceData, setComplianceData] = useState([
        {
            id: 1,
            dateSubmitted: "2024-05-10",
            complianceArea: "Fire Safety Inspection",
            location: "Warehouse A",
            assignedTo: "Joshua Smith",
            targetDate: "2024-06-01",
            status: "On Going",
        },
        {
            id: 2,
            dateSubmitted: "2024-04-22",
            complianceArea: "Electrical Safety Audit",
            location: "Main Office",
            assignedTo: "Maria Garcia",
            targetDate: "2024-05-15",
            status: "Completed",
        },
        {
            id: 3,
            dateSubmitted: "2024-05-01",
            complianceArea: "Equipment Maintenance Check",
            location: "Factory Floor 3",
            assignedTo: "Liam Johnson",
            targetDate: "2024-06-10",
            status: "On Going",
        },
        {
            id: 4,
            dateSubmitted: "2024-04-15",
            complianceArea: "Chemical Handling Review",
            location: "Lab 2",
            assignedTo: "Sophia Lee",
            targetDate: "2024-05-30",
            status: "Pending",
        },
        {
            id: 5,
            dateSubmitted: "2024-03-30",
            complianceArea: "Emergency Drill Assessment",
            location: "Headquarters",
            assignedTo: "Ethan Martinez",
            targetDate: "2024-04-10",
            status: "Completed",
        },
    ]);

    // Delete function: remove items from state
    const handleDeleteItems = (idsToDelete: number[]) => {
        setComplianceData((prev) =>
            prev.filter((item) => !idsToDelete.includes(item.id))
        );
        // Also clear selection and viewing/editing states if affected
        setSelectedRows([]);
        if (viewingItem && idsToDelete.includes(viewingItem.id)) {
            setViewingItem(null);
            setEditing(false);
        }
    };

    // Save edit function: update item in state
    const handleSaveEdit = () => {
        setComplianceData((prev) =>
            prev.map((item) =>
                item.id === editableItem.id ? editableItem : item
            )
        );
        setViewingItem(editableItem);
        setEditing(false);
    };

    const columns: ColumnDef<(typeof complianceData)[0]>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="cursor-pointer"
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRows(complianceData.map((d) => d.id));
                        } else {
                            setSelectedRows([]);
                        }
                    }}
                    checked={
                        selectedRows.length > 0 &&
                        selectedRows.length === complianceData.length
                    }
                />
            ),
            cell: ({ row }) => {
                const id = row.original.id;
                return (
                    <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={selectedRows.includes(id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedRows((prev) => [...prev, id]);
                            } else {
                                setSelectedRows((prev) =>
                                    prev.filter((val) => val !== id)
                                );
                            }
                        }}
                    />
                );
            },
            enableSorting: false,
            meta: { headerClassName: "w-12 text-center" },
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: { headerClassName: "w-12" },
        },
        {
            accessorKey: "dateSubmitted",
            header: "Date Submitted",
            cell: ({ row }) => <div>{row.getValue("dateSubmitted")}</div>,
            meta: { headerClassName: "w-[8rem]" },
        },
        {
            accessorKey: "complianceArea",
            header: "Compliance Area",
            cell: ({ row }) => <div>{row.getValue("complianceArea")}</div>,
            meta: { headerClassName: "w-[12rem]" },
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => <div>{row.getValue("location")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "assignedTo",
            header: "Assigned To",
            cell: ({ row }) => <div>{row.getValue("assignedTo")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "targetDate",
            header: "Target Date",
            cell: ({ row }) => <div>{row.getValue("targetDate")}</div>,
            meta: { headerClassName: "w-[8rem]" },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <div>{row.getValue("status")}</div>,
            meta: { headerClassName: "w-[8rem]" },
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex justify-center items-center gap-2">
                    <button
                        className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition"
                        onClick={() => {
                            setViewingItem(row.original);
                            setEditableItem(row.original);
                            setEditing(false);
                        }}
                    >
                        View
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    return (
        <Authenticated>
            <Head title="Compliance and Safety" />

            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold">
                        Compliance and Safety
                    </h1>
                    <PrimaryButton
                        onClick={() => setIsCreating(true)}
                        className="bg-secondary text-white hover:bg-primary transition-all duration-300 text-sm sm:text-base px-5 py-2 rounded-md text-center justify-center w-full sm:w-auto"
                    >
                        + Add
                    </PrimaryButton>
                </div>
            </header>

            <div className="p-4">
                {selectedRows.length > 0 && (
                    <div className="hidden sm:flex mb-4">
                        <button
                            onClick={() => {
                                const confirmed = window.confirm(
                                    `Are you sure you want to delete the selected items: ${selectedRows.join(
                                        ", "
                                    )}?`
                                );
                                if (confirmed) {
                                    handleDeleteItems(selectedRows);
                                }
                            }}
                            className="flex items-center gap-2 bg-destructive text-white px-4 py-2 rounded-md hover:opacity-90 transition"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <Datatable
                        columns={columns}
                        data={complianceData}
                        placeholder="Search here"
                    />
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden flex flex-col gap-4 mt-4">
                    {complianceData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                        >
                            <div className="flex justify-between items-start text-sm text-gray-800 mb-1">
                                <p>
                                    <span className="font-medium">ID:</span>{" "}
                                    {item.id}
                                </p>
                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                                    {item.status}
                                </span>
                            </div>

                            <div className="space-y-1 pr-8 text-sm text-gray-800">
                                <p>
                                    <span className="font-medium">
                                        Compliance Area:
                                    </span>{" "}
                                    {item.complianceArea}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Location:
                                    </span>{" "}
                                    {item.location}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Assigned To:
                                    </span>{" "}
                                    {item.assignedTo}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Date Submitted:
                                    </span>{" "}
                                    {item.dateSubmitted}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Target Date:
                                    </span>{" "}
                                    {item.targetDate}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="w-1/2 bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition"
                                    onClick={() => {
                                        setViewingItem(item);
                                        setEditableItem(item);
                                        setEditing(false);
                                    }}
                                >
                                    View
                                </button>
                                <button
                                    className="w-1/2 bg-destructive text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition"
                                    onClick={() => {
                                        const confirmed = window.confirm(
                                            `Are you sure you want to delete item ID ${item.id}?`
                                        );
                                        if (confirmed) {
                                            handleDeleteItems([item.id]);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isCreating && (
                <AddComplianceAndSafetyModal
                    isOpen={isCreating}
                    onClose={() => setIsCreating(false)}
                    onCreate={() => setIsCreating(false)}
                />
            )}

            {viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative">
                        <h2 className="text-xl font-semibold mb-4">
                            Compliance & Safety Details
                        </h2>

                        <div className="space-y-3 text-gray-800 text-sm">
                            {/* ID - non-editable even in edit mode */}
                            <div>
                                <label className="block font-semibold mb-1">
                                    ID
                                </label>
                                <input
                                    type="text"
                                    value={editableItem.id}
                                    disabled
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                                />
                            </div>

                            {/* Editable fields when editing, else read-only */}
                            <div>
                                <label className="block font-semibold mb-1">
                                    Date Submitted
                                </label>
                                <input
                                    type="date"
                                    value={editableItem.dateSubmitted}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev: any) => ({
                                            ...prev,
                                            dateSubmitted: e.target.value,
                                        }))
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
                                    Compliance Area
                                </label>
                                <input
                                    type="text"
                                    value={editableItem.complianceArea}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev: any) => ({
                                            ...prev,
                                            complianceArea: e.target.value,
                                        }))
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
                                    value={editableItem.location}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev: any) => ({
                                            ...prev,
                                            location: e.target.value,
                                        }))
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
                                    value={editableItem.assignedTo}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev: any) => ({
                                            ...prev,
                                            assignedTo: e.target.value,
                                        }))
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
                                    Target Date
                                </label>
                                <input
                                    type="date"
                                    value={editableItem.targetDate}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev: any) => ({
                                            ...prev,
                                            targetDate: e.target.value,
                                        }))
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
                                    value={editableItem.status}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEditableItem((prev: any) => ({
                                            ...prev,
                                            status: e.target.value,
                                        }))
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
                                    <button
                                        onClick={() => {
                                            setEditing(true);
                                        }}
                                        className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-90 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setViewingItem(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Close
                                    </button>
                                </>
                            )}

                            {editing && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleSaveEdit();
                                        }}
                                        className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setEditableItem(viewingItem);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Authenticated>
    );
};

export default ComplianceAndSafety;
