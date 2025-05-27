import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Datatable } from "@/Pages/WorkOrders/components/Datatable";
import { ColumnDef } from "@tanstack/react-table";

interface Asset {
    id: number;
    name: string;
    specification_details: string;
    location: { id: number; name: string };
    status: string;
    date_acquired: string;
    last_maintained_at: string;
    has_preventive_maintenance: boolean;
}

const PreventiveMaintenance: React.FC = () => {
    const { props } = usePage();
    const assets = (props.assets as Asset[]) || [];

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

    const filteredAssets = assets
        .filter(asset => asset.has_preventive_maintenance) // Only those with PMS
        .filter(
            (asset) =>
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.specification_details
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                asset.location.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const columns: ColumnDef<Asset>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: { headerClassName: "w-12" },
        },
        {
            accessorKey: "date_acquired",
            header: "Date Acquired",
            cell: ({ row }) => <div>{row.getValue("date_acquired")}</div>,
            meta: { headerClassName: "w-[8rem]" },
        },
        {
            accessorKey: "name",
            header: "Asset Name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "specification_details",
            header: "Specification",
            cell: ({ row }) => <div>{row.getValue("specification_details")}</div>,
            meta: { headerClassName: "w-[23%]" },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "status",
            header: "Condition",
            cell: ({ row }) => <div>{row.getValue("status")}</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "nextSchedule",
            header: "Next Schedule",
            cell: () => <div>TBD</div>,
            meta: { headerClassName: "w-[10rem]" },
        },
        {
            accessorKey: "last_maintained_at",
            header: "Last Maintenance",
            cell: ({ row }) => <div>{row.getValue("last_maintained_at")}</div>,
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
                                    {asset.status}
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
                                        Specification:
                                    </span>{" "}
                                    {asset.specification_details}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Location:
                                    </span>{" "}
                                    {asset.location.name}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Date Acquired:
                                    </span>{" "}
                                    {asset.date_acquired}
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
                                    {asset.last_maintained_at}
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
