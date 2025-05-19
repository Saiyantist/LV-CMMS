"use client";

import type React from "react";
import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateAssetModal from "./CreateAssetModal";
import ViewAssetModal from "./ViewAssetModal";
import { Datatable } from "../WorkOrders/components/Datatable";
import type { ColumnDef } from "@tanstack/react-table";
// import { toast } from "sonner"; I will user this for delete action later.

interface Asset {
    id: number;
    name: string;
    specification_details: string;
    location: {
        id: number;
        name: string;
    };
    status: string;
    date_acquired: string;
    last_maintained_at: string;
    maintenance_histories: {
        id: number;
        downtime_reason: string;
        status: string;
        failed_at: string;
        maintained_at: string;
    };
}

interface Location {
    id: number;
    name: string;
}

const AssetManagement: React.FC = () => {
    const { props } = usePage();

    const assets = props.assets as Asset[]; // Gotten from the controller
    const locations = props.locations as Location[]; // Gotten from the controller

    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [viewingAsset, setViewingAsset] = useState<(typeof assets)[0] | null>(
        null
    );

    const handleCheckboxChange = (assetId: number) => {
        setSelectedAssets((prev) =>
            prev.includes(assetId)
                ? prev.filter((id) => id !== assetId)
                : [...prev, assetId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAssets(assets.map((asset) => asset.id));
        } else {
            setSelectedAssets([]);
        }
    };

    // Define columns for the data table
    const columns: ColumnDef<Asset>[] = [
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
            accessorKey: "name",
            header: "Asset Name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
            meta: {
                headerClassName: "w-[15%]",
                searchable: true,
            },
        },
        {
            accessorKey: "specification_details",
            header: "Specification",
            cell: ({ row }) => (
                <div>{row.getValue("specification_details")}</div>
            ),
            meta: {
                headerClassName: "w-[20%]",
                searchable: true,
            },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            meta: {
                headerClassName: "w-[15%]",
                searchable: true,
                filterable: true,
            },
        },
        {
            accessorKey: "status",
            header: "Condition",
            cell: ({ row }) => (
                <div
                    className={`px-2 py-1 rounded text-center ${getStatusColor(
                        row.getValue("status")
                    )}`}
                >
                    {row.getValue("status")}
                </div>
            ),
            meta: {
                headerClassName: "w-[10%]",
                cellClassName: "text-center",
                filterable: true,
            },
        },
        {
            accessorKey: "date_acquired",
            header: "Date Acquired",
            cell: ({ row }) => <div>{row.getValue("date_acquired")}</div>,
            meta: {
                headerClassName: "w-[12%]",
                cellClassName: "text-center",
            },
        },
        {
            accessorKey: "last_maintained_at",
            header: "Last Maintenance",
            cell: ({ row }) => <div>{row.getValue("last_maintained_at")}</div>,
            meta: {
                headerClassName: "w-[12%]",
                cellClassName: "text-center",
            },
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setViewingAsset(row.original)}
                        className="bg-secondary text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700 transition"
                    >
                        View
                    </button>
                    <button
                        onClick={() => {
                            const confirmed = window.confirm(
                                "Are you sure you want to delete this asset? This action is irreversible and cannot be undone."
                            );
                            if (confirmed) {
                                // Call your delete function here
                            }
                        }}
                        className="bg-destructive text-white px-3 py-1.5 text-sm rounded-md hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Excellent":
                return "bg-green-100 text-green-800";
            case "Good":
                return "bg-blue-100 text-blue-800";
            case "Fair":
                return "bg-yellow-100 text-yellow-800";
            case "Poor":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Authenticated>
            <Head title="Asset Management" />

            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        Asset Management
                    </h1>
                    <PrimaryButton
                        onClick={() => setIsCreating(true)}
                        className="bg-secondary text-white hover:bg-primary transition-all duration-300 text-sm sm:text-base px-5 py-2 rounded-md w-full sm:w-auto text-center justify-center"
                    >
                        Add an Asset
                    </PrimaryButton>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Desktop Table View */}

                <div className="hidden md:block overflow-x-auto rounded-md -mt-[4.1rem]">
                    {" "}
                    <Datatable
                        columns={columns}
                        data={assets}
                        placeholder="Search assets"
                    />
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden flex flex-col gap-4 mt-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                        >
                            <div className="absolute top-3 right-3">
                                <input
                                    type="checkbox"
                                    checked={selectedAssets.includes(asset.id)}
                                    onChange={() =>
                                        handleCheckboxChange(asset.id)
                                    }
                                    className="accent-primary"
                                />
                            </div>
                            <div className="space-y-1 pr-8 text-sm text-gray-800">
                                <p>
                                    <span className="font-medium">ID:</span>{" "}
                                    {asset.id}
                                </p>
                                <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {asset.name}
                                </p>
                                <p>
                                    <span className="font-medium">Spec:</span>{" "}
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
                                        Condition:
                                    </span>{" "}
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                                            asset.status
                                        )}`}
                                    >
                                        {asset.status}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Acquired:
                                    </span>{" "}
                                    {asset.date_acquired}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Last Maintenance:
                                    </span>{" "}
                                    {asset.last_maintained_at}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button
                                    onClick={() => setViewingAsset(asset)}
                                    className="flex-1 bg-secondary text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => {
                                        const confirmed = window.confirm(
                                            "Are you sure you want to delete this asset? This action is irreversible and cannot be undone."
                                        );
                                        if (confirmed) {
                                            // Call your delete function here
                                        }
                                    }}
                                    className="flex-1 bg-destructive text-white px-3 py-2 text-sm rounded-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isCreating && (
                <CreateAssetModal
                    locations={locations}
                    isOpen={isCreating}
                    onClose={() => setIsCreating(false)}
                    onSave={() => setIsCreating(false)}
                />
            )}

            {viewingAsset && (
                <ViewAssetModal
                    data={viewingAsset}
                    onClose={() => setViewingAsset(null)}
                />
            )}
        </Authenticated>
    );
};

export default AssetManagement;
