"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateAssetModal from "./components/CreateAssetModal";
import ViewAssetModal from "./components/ViewAssetModal";
import { Datatable } from "@/Components/Datatable";
import type { ColumnDef } from "@tanstack/react-table";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import FlashToast from "@/Components/FlashToast";
import { Button } from "@/Components/shadcnui/button";
import { CirclePlus, Trash, MoreVertical } from "lucide-react";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/shadcnui/dropdown-menu";
import DeleteAssetModal from "./components/DeleteAssetModal";

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

interface MaintenancePersonnel {
    id: number;
    first_name: string;
    last_name: string;
    roles: { id: number; name: string };
}[];

interface Location {
    id: number;
    name: string;
}

const AssetManagement: React.FC = () => {
    const { props } = usePage();

    const assets = props.assets as Asset[];
    const locations = props.locations as Location[];
    const maintenancePersonnel = props.maintenancePersonnel as MaintenancePersonnel[];
    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [viewingAsset, setViewingAsset] = useState<(typeof assets)[0] | null>(null);
    const [showScrollUpButton, setShowScrollUpButton] = useState(false);
    const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);

    const handleScroll = () => {
        setShowScrollUpButton(window.scrollY > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    const handleDelete = (asset: Asset) => {
        setDeletingAsset(asset);
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
            enableSorting: false,
            meta: {
                headerClassName: "w-[12%]",
                searchable: true,
            },
        },
        {
            accessorKey: "specification_details",
            header: "Specification",
            cell: ({ row }) => (
                <div>{row.getValue("specification_details")}</div>
            ),
            enableSorting: false,
            meta: {
                headerClassName: "w-[20%]",
                cellClassName: "max-w-16 text-left px-2 text-left whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
            },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "w-[15%]",
                cellClassName: "whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
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
                headerClassName: "w-[30rem]",
                cellClassName: "flex justify-center",
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
                <div className="flex gap-2 justify-center">
                    {/* Extra Large screens - visible above xl breakpoint */}
                    <div className="hidden xl:flex gap-2">
                        <Button
                            onClick={() => setViewingAsset(row.original)}
                            className="bg-secondary h-6 text-xs rounded-sm"
                        >
                            View
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/75 hover:text-white transition-all duration-200"
                            onClick={() => handleDelete(row.original)}
                        ><Trash />
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
                                <DropdownMenuItem onClick={() => setViewingAsset(row.original)}>
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleDelete(row.original)}
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

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Functional":
                return "bg-green-100 text-green-700 border border-green-300";
            case "Failed":
                return "bg-red-100 text-red-700 border border-red-300";
            case "Under Maintenance":
                return "bg-blue-100 text-blue-700 border border-blue-300";
            case "End of Useful Life":
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Asset Management" />

            {/* Header section*/}
            <header className="mx-auto px-6 md:px-0 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                            Asset Management
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

            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto rounded-md -mt-[4.1rem]">
                <Datatable
                    columns={columns}
                    data={assets}
                    placeholder="Search for ID, Name, Specification, and Location"
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
                            <p>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                                        asset.status
                                    )}`}
                                >
                                    {asset.status}
                                </span>
                            </p>
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
                                onClick={() => handleDelete(asset)}
                                className="flex-1 bg-destructive text-white px-3 py-2 text-sm rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isCreating && (
                <CreateAssetModal
                    locations={locations}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setIsCreating(false)}
                />
            )}

            {viewingAsset && (
                <ViewAssetModal
                    asset={viewingAsset}
                    onClose={() => setViewingAsset(null)}   
                    locations={locations}
                />
            )}

            {deletingAsset && (
                <DeleteAssetModal
                    asset={deletingAsset}
                    locations={locations}
                    onClose={() => setDeletingAsset(null)}
                />
            )}

            <FlashToast />
            {/* Scroll to Top Button */}
            <ScrollToTopButton
                showScrollUpButton={showScrollUpButton}
                scrollToTop={scrollToTop}
            />
        </AuthenticatedLayout>
    );
};

export default AssetManagement;
