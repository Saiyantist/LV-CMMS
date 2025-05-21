import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import AddComplianceAndSafetyModal from "./AddComplianceAndSafetyModal";
import { Datatable } from "../WorkOrders/components/Datatable";
import { ColumnDef } from "@tanstack/react-table";

const ComplianceAndSafety: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);

    // Sample data for the table
    const complianceData = [
        {
            id: 1,
            dateSubmitted: "2023-01-01",
            complianceArea: "Fire Safety Inspection",
            location: "Location 1",
            assignedTo: "Joshua",
            targetDate: "TBD",
            status: "On Going",
        },
    ];

    // Datatable columns (UI only)
    const columns: ColumnDef<(typeof complianceData)[0]>[] = [
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
            cell: () => (
                <div className="flex justify-center items-center gap-2">
                    <button className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                        Edit
                    </button>
                    <button className="bg-destructive text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                        Delete
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
                {/* Desktop Table (Datatable UI) */}
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
                            {/* Top row: ID and Status aligned horizontally */}
                            <div className="flex justify-between items-start text-sm text-gray-800 mb-1">
                                <p>
                                    <span className="font-medium">ID:</span>{" "}
                                    {item.id}
                                </p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800`}
                                >
                                    {item.status}
                                </span>
                            </div>

                            {/* Info Section */}
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

                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-end gap-2">
                                <button className="w-1/2 bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                    Edit
                                </button>
                                <button className="w-1/2 bg-destructive text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Compliance and Safety Modal */}
            {isCreating && (
                <AddComplianceAndSafetyModal
                    isOpen={isCreating}
                    onClose={() => setIsCreating(false)}
                    onCreate={() => {
                        setIsCreating(false);
                    }}
                />
            )}
        </Authenticated>
    );
};

export default ComplianceAndSafety;
