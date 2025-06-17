"use client";

import type React from "react";
import { useEffect, useState, useRef, useMemo } from "react";
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
import { CirclePlus, Trash2, MoreVertical, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/shadcnui/dropdown-menu";
import DeleteAssetModal from "./components/DeleteAssetModal";
import { formatDate } from "date-fns";
import { Input } from "@/Components/shadcnui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/shadcnui/popover";
import FilterModal from "@/Components/FilterModal";
import { SelectSeparator } from "@/Components/shadcnui/select";

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
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);
    const [mobileColumnFilters, setMobileColumnFilters] = useState<Record<string, string>>({});
    const mobileFilterButtonRef = useRef<HTMLButtonElement>(null);
    const [mobileSortConfig, setMobileSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({
        key: 'id',
        direction: 'desc'
    });

    const sortOptions = [
        { label: 'ID', value: 'id' },
        { label: 'Date Acquired', value: 'date_acquired' },
        { label: 'Last Maintenance', value: 'last_maintained_at' }
    ];

    const handleScroll = () => {
        setShowScrollUpButton(window.scrollY > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobileFilterModalOpen && mobileFilterButtonRef.current && !mobileFilterButtonRef.current.contains(event.target as Node)) {
                const modalElement = document.querySelector('[data-filter-modal="true"]');
                if (
                    modalElement &&
                    !modalElement.contains(event.target as Node) &&
                    !mobileFilterButtonRef.current.contains(event.target as Node)
                ) {
                    setIsMobileFilterModalOpen(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileFilterModalOpen]);

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
            cell: ({ row }) => <div>{formatDate(row.getValue("date_acquired"), "MM/dd/yyyy")}</div>,
            meta: {
                headerClassName: "w-[12%]",
                cellClassName: "text-center",
            },
        },
        {
            accessorKey: "last_maintained_at",
            header: "Last Maintenance",
            cell: ({ row }) => <div>{formatDate(row.getValue("last_maintained_at"), "MM/dd/yyyy")}</div>,
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
                        ><Trash2 />
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

    // Filter and sort assets based on search query, filters, and sort config
    const filteredMobileAssets = useMemo(() => {
        let filtered = assets.filter((asset) => {
            const matchesSearch = mobileSearchQuery === "" || 
                asset.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                asset.specification_details.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                asset.location.name.toLowerCase().includes(mobileSearchQuery.toLowerCase());

            const matchesFilters = Object.entries(mobileColumnFilters).every(([key, value]) => {
                if (!value || value === "all") return true;
                if (key === "status") return asset.status === value;
                if (key === "location.name") return asset.location.name === value;
                return true;
            });

            return matchesSearch && matchesFilters;
        });

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const { key, direction } = mobileSortConfig;
            let aValue: number | string;
            let bValue: number | string;

            // Handle date sorting
            if (key === 'date_acquired' || key === 'last_maintained_at') {
                const aDate = a[key as keyof Asset] as string;
                const bDate = b[key as keyof Asset] as string;
                aValue = new Date(aDate).getTime();
                bValue = new Date(bDate).getTime();
            } else {
                aValue = a[key as keyof Asset] as number | string;
                bValue = b[key as keyof Asset] as number | string;
            }

            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [assets, mobileSearchQuery, mobileColumnFilters, mobileSortConfig]);

    return (
        <AuthenticatedLayout>
            <Head title="Asset Management" />

            {/* Header */}
            <header className="sticky md:flex top-0 z-40 md:z-0 w-full mx-auto px-0 sm:pb-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start -mt-6 pt-6 text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                            Asset Management
                    </h1>
                    
                    <PrimaryButton
                        onClick={() => setIsCreating(true)}
                        className="bg-secondary text-white hover:bg-primary transition-all duration-300 !text-lg xs:text-lg md:text-base rounded-md w-[98%] sm:w-auto text-center justify-center gap-2"
                    >
                        <span>Add</span>
                        <CirclePlus className="h-5 w-5" />
                    </PrimaryButton>

                    <SelectSeparator className="sm:hidden mt-2 bg-secondary/30"/>
                </div>
            </header>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-md lg:-mt-[4.1rem]">
                <Datatable
                    columns={columns}
                    data={assets}
                    placeholder="Search for ID, Name, Specification, or Location"
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mt-4">

                {/* Search and Filter Controls */}
                <div className="flex items-center gap-2">

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for ID, Name, Specification, or Location"
                            value={mobileSearchQuery}
                            onChange={(event) => setMobileSearchQuery(event.target.value)}
                            className="h-10 w-full pl-8 rounded-md border bg-white/70 focus-visible:bg-white"
                        />
                    </div>

                    {/* Sort */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 gap-1 border rounded-md"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                Sort
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            side="bottom"
                            sideOffset={4}
                            className="w-48 p-2 rounded-md border bg-white shadow-md"
                        >
                            <div className="space-y-2">
                                {sortOptions.map((option) => (
                                    <div key={option.value} className="flex items-center justify-between">
                                        <span className="text-sm">{option.label}</span>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-6 w-6 p-0 ${
                                                    mobileSortConfig.key === option.value && mobileSortConfig.direction === 'asc'
                                                        ? 'bg-primary text-white'
                                                        : ''
                                                }`}
                                                onClick={() => setMobileSortConfig({
                                                    key: option.value,
                                                    direction: 'asc'
                                                })}
                                            >
                                                ↑
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-6 w-6 p-0 ${
                                                    mobileSortConfig.key === option.value && mobileSortConfig.direction === 'desc'
                                                        ? 'bg-primary text-white'
                                                        : ''
                                                }`}
                                                onClick={() => setMobileSortConfig({
                                                    key: option.value,
                                                    direction: 'desc'
                                                })}
                                            >
                                                ↓
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Filter */}
                    <Button
                        ref={mobileFilterButtonRef}
                        variant={Object.keys(mobileColumnFilters).length > 0 ? "default" : "outline"}
                        size="sm"
                        className={`h-10 gap-1 border rounded-md ${
                            Object.keys(mobileColumnFilters).length > 0 ? "bg-primary text-white" : ""
                        }`}
                        onClick={() => setIsMobileFilterModalOpen(!isMobileFilterModalOpen)}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                        {Object.keys(mobileColumnFilters).length > 0 && (
                            <span className="ml-1 rounded-full bg-white text-primary w-5 h-5 flex items-center justify-center text-xs">
                                {Object.values(mobileColumnFilters).filter((value) => value !== "" && value !== "all").length}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Filter Modal */}
                <FilterModal
                    isOpen={isMobileFilterModalOpen}
                    onClose={() => setIsMobileFilterModalOpen(false)}
                    columns={columns}
                    columnFilters={mobileColumnFilters}
                    setColumnFilters={setMobileColumnFilters}
                    data={filteredMobileAssets}
                    buttonRef={mobileFilterButtonRef as React.RefObject<HTMLButtonElement>}
                />

                {filteredMobileAssets.map((asset) => (
                    <div
                        key={asset.id}
                        className="text-xs xs:text-sm bg-white border border-gray-200 rounded-2xl p-4 shadow relative hover:bg-muted transition-all duration-200"
                        onClick={() => setViewingAsset(asset)}
                    >
                        {/* Top row: ID and Status aligned horizontally */}
                        <div className="flex text-gray-800 mb-1">
                            <div className="flex flex-[11] justify-between items-start">
                                {/* ID */}
                                <p>
                                    <span className="font-bold text-primary">ID:</span>{" "}
                                    {asset.id}
                                </p>
                                {/* Status */}
                                <span
                                    className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(
                                        asset.status
                                    )}`}
                                >
                                    {asset.status}
                                </span>
                            </div>
                            {/* More Vertical Button */}
                            <div className="flex flex-[1] justify-end items-center">
                                <Popover>
                                    <PopoverTrigger asChild >
                                        <Button variant="ghost" className="h-6 w-6 p-0 z-10 relative" onClick={(e) => e.stopPropagation()}>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="end"
                                        side="bottom"
                                        sideOffset={4}
                                        className="w-32 p-1 rounded-md border bg-white shadow-md z-50"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* <button
                                            onClick={() => setViewingAsset(asset)}
                                            className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                        >
                                            View
                                        </button> */}
                                        <button
                                            onClick={() => handleDelete(asset)}
                                            className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
                                        >
                                            Delete
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="space-y-1 pr-8 text-gray-800">
                            {/* Name */}
                            <p>
                                <span className="font-bold text-primary">Name:</span>{" "}
                                {asset.name}
                            </p>

                            {/* Specification */}
                            <p className="items-start truncate my-2 overflow-y-auto hover:overflow-y-scroll">
                                <span className="font-bold text-primary">Specification:</span>{" "}
                                {asset.specification_details}
                            </p>

                            {/* Location */}
                            <p>
                                <span className="font-bold text-primary">Location:</span>{" "}
                                {asset.location.name}
                            </p>

                            {/* Date Acquired */}
                            <p>
                                <span className="font-bold text-primary">Date Acquired:</span>{" "}
                                {formatDate(asset.date_acquired, "MM/dd/yyyy")}
                            </p>

                            {/* Last Maintenance */}
                            <p>
                                <span className="font-bold text-primary">Last Maintenance:</span>{" "}
                                {formatDate(asset.last_maintained_at, "MM/dd/yyyy")}
                            </p>
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
