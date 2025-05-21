import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Datatable } from "@/Pages/WorkOrders/components/Datatable";
import { ColumnDef } from "@tanstack/react-table";

const PreventiveMaintenance: React.FC = () => {
    const assets = [
        {
            id: 1,
            name: "Asset 1",
            specification: "Spec 1",
            location: "Location 1",
            condition: "Good",
            dateAcquired: "2023-01-01",
            lastMaintenance: "2023-04-10",
        },
        {
            id: 2,
            name: "Asset 2",
            specification: "Spec 2",
            location: "Location 2",
            condition: "Fair",
            dateAcquired: "2022-06-15",
            lastMaintenance: "2023-02-20",
        },
    ];

    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleCheckboxChange = (assetId: number) => {
        setSelectedAssets((prevSelected) =>
            prevSelected.includes(assetId)
                ? prevSelected.filter((id) => id !== assetId)
                : [...prevSelected, assetId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAssets(assets.map((asset) => asset.id));
        } else {
            setSelectedAssets([]);
        }
    };

    const filteredAssets = assets.filter(
        (asset) =>
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.specification
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            asset.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: ColumnDef<(typeof assets)[0]>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: { headerClassName: "w-12" },
        },
        {
            accessorKey: "dateAcquired",
            header: "Date Submitted",
            cell: ({ row }) => <div>{row.getValue("dateAcquired")}</div>,
            meta: { headerClassName: "w-[8rem]" },
        },
        {
            accessorKey: "name",
            header: "Asset Name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "specification",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("specification")}</div>,
            meta: { headerClassName: "w-[23%]" },
        },
        {
            accessorKey: "location",
            header: "Assign To",
            cell: ({ row }) => <div>{row.getValue("location")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "condition",
            header: "Status",
            cell: ({ row }) => <div>{row.getValue("condition")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "nextSchedule",
            header: "Next Schedule",
            cell: () => <div>TBD</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "lastMaintenance",
            header: "Last Maintenance",
            cell: ({ row }) => <div>{row.getValue("lastMaintenance")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            id: "actions",
            header: "Action",
            cell: () => (
                <div className="flex gap-2 justify-center">
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
            <Head title="Preventive Maintenance" />

            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold">
                        Preventive Maintenance
                    </h1>
                </div>
            </header>

            <div className="p-4">
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <Datatable
                        columns={columns}
                        data={filteredAssets}
                        placeholder="Search here"
                    />
                </div>

                {/* Mobile Search Input */}
                <div className="sm:hidden mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden flex flex-col gap-4 mt-4">
                    {filteredAssets.map((asset) => (
                        <div
                            key={asset.id}
                            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                        >
                            {/* Top row: ID and Status aligned horizontally */}
                            <div className="flex justify-between items-start text-sm text-gray-800 mb-1">
                                <p>
                                    <span className="font-medium">ID:</span>{" "}
                                    {asset.id}
                                </p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800`}
                                >
                                    {asset.condition}
                                </span>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-1 pr-8 text-sm text-gray-800">
                                <p>
                                    <span className="font-medium">
                                        Asset Name:
                                    </span>{" "}
                                    {asset.name}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Description:
                                    </span>{" "}
                                    {asset.specification}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Assign To:
                                    </span>{" "}
                                    {asset.location}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Date Submitted:
                                    </span>{" "}
                                    {asset.dateAcquired}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Next Schedule:
                                    </span>{" "}
                                    TBD
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Last Maintenance:
                                    </span>{" "}
                                    {asset.lastMaintenance}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 w-full">
                                <div className="flex gap-2">
                                    <button className="w-1/2 bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                        Edit
                                    </button>
                                    <button className="w-1/2 bg-destructive text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Authenticated>
    );
};

export default PreventiveMaintenance;
