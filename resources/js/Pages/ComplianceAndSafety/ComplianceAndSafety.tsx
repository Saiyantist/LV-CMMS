import React, { useState, useRef, useEffect, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateComplianceModal from "./components/CreateComplianceModal";
import ViewComplianceModal from "./components/ViewComplianceModal";
import DeleteComplianceModal from "./components/DeleteComplianceModal";
import { Datatable } from "@/Components/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/shadcnui/button";
import { Trash2, MoreVertical, CirclePlus, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { getStatusColor } from "@/utils/getStatusColor";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/shadcnui/dropdown-menu";
import FlashToast from "@/Components/FlashToast";
import { prioritySorting } from "@/utils/prioritySorting";
import { format } from "date-fns";
import { Input } from "@/Components/shadcnui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/shadcnui/popover";
import FilterModal from "@/Components/FilterModal";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import { SelectSeparator } from "@/Components/shadcnui/select";

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
    const [deletingItem, setDeletingItem] = useState<WorkOrder | null>(null);
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);
    const [mobileColumnFilters, setMobileColumnFilters] = useState<Record<string, string>>({});
    const mobileFilterButtonRef = useRef<HTMLButtonElement>(null);
    const [showScrollUpButton, setShowScrollUpButton] = useState(false);
    const [mobileSortConfig, setMobileSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({
        key: 'scheduled_at',
        direction: 'desc'
    });

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
            enableSorting: false
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
                                setDeletingItem(row.original);
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
                                        setDeletingItem(row.original);
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

    // Filter and sort work orders based on search query, filters, and sort config
    const filteredMobileWorkOrders = useMemo(() => {
        let filtered = workOrders.filter((workOrder) => {
            const matchesSearch = mobileSearchQuery === "" || 
                workOrder.compliance_area.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                workOrder.location.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                workOrder.report_description.toLowerCase().includes(mobileSearchQuery.toLowerCase());

            const matchesFilters = Object.entries(mobileColumnFilters).every(([key, value]) => {
                if (!value || value === "all") return true;
                if (key === "status") return workOrder.status === value;
                if (key === "location.name") return workOrder.location.name === value;
                return true;
            });

            return matchesSearch && matchesFilters;
        });

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const { key, direction } = mobileSortConfig;
            let aValue: number | string;
            let bValue: number | string;

            if (key === 'scheduled_at') {
                aValue = new Date(a.scheduled_at).getTime();
                bValue = new Date(b.scheduled_at).getTime();
            } else if (key === 'id') {
                aValue = a.id;
                bValue = b.id;
            } else if (key === 'status') {
                aValue = a.status;
                bValue = b.status;
            } else {
                aValue = a[key as keyof WorkOrder] as number | string;
                bValue = b[key as keyof WorkOrder] as number | string;
            }

            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [workOrders, mobileSearchQuery, mobileColumnFilters, mobileSortConfig]);

    const sortOptions = [
        { label: 'ID', value: 'id' },
        { label: 'Target Date', value: 'scheduled_at' },
        { label: 'Status', value: 'status' }
    ];

    return (
        <Authenticated>
            <Head title="Compliance and Safety" />

            {/* Header */}
            <header className="sticky md:flex top-0 z-40 md:z-0 w-full mx-auto px-0 sm:pb-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start -mt-6 pt-6 text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        Compliance and Safety
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

            {/* Desktop Table */}
            <div className="hidden md:block lg:-mt-[4.1rem] overflow-x-auto">
                <Datatable
                    columns={columns}
                    data={workOrders}
                    placeholder="Search for ID, Compliance Area, or Location"
                />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4 mt-4">
                {/* Search and Filter Controls */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for ID, Compliance Area, or Location"
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
                    data={filteredMobileWorkOrders}
                    buttonRef={mobileFilterButtonRef as React.RefObject<HTMLButtonElement>}
                />

                {filteredMobileWorkOrders.map((item) => (
                    <div
                        key={item.id}
                        className="text-xs xs:text-sm bg-white border border-gray-200 rounded-2xl p-4 shadow relative hover:bg-muted transition-all duration-200"
                        onClick={() => {
                            setViewingItem(item);
                            setEditableItem(item);
                            setEditing(false);
                        }}
                    >
                        {/* Top row: ID and Status aligned horizontally */}
                        <div className="flex text-gray-800 mb-1">
                            <div className="flex flex-[11] justify-between items-start">
                                {/* ID */}
                                <p>
                                    <span className="font-bold text-primary">ID:</span>{" "}
                                    {item.id}
                                </p>
                                {/* Status */}
                                <span
                                    className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(
                                        item.status
                                    )}`}
                                >
                                    {item.status}
                                </span>
                            </div>
                            {/* More Vertical Button */}
                            <div className="flex flex-[1] justify-end items-center">
                                <Popover>
                                    <PopoverTrigger asChild>
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
                                        <button
                                            onClick={() => setDeletingItem(item)}
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
                            {/* Target Date */}
                            <p>
                                <span className="font-bold text-primary">Target Date:</span>{" "}
                                {item.scheduled_at ? (
                                    format(item.scheduled_at, "yyyy-MM-dd")
                                ) : (
                                    <span className="text-muted-foreground italic">No date set</span>
                                )}
                            </p>

                            {/* Compliance Area */}
                            <p>
                                <span className="font-bold text-primary">Compliance Area:</span>{" "}
                                {item.compliance_area}
                            </p>

                            {/* Location */}
                            <p>
                                <span className="font-bold text-primary">Location:</span>{" "}
                                {item.location.name}
                            </p>

                            {/* Priority */}
                            <p>
                                <span className="font-bold text-primary">Priority:</span>{" "}
                                <span className={`px-2 py-1 rounded ${getPriorityColor(item.priority)}`}>
                                    {item.priority}
                                </span>
                            </p>

                            {/* Assigned To */}
                            <p>
                                <span className="font-bold text-primary">Assigned To:</span>{" "}
                                {item.assigned_to ? `${item.assigned_to.first_name} ${item.assigned_to.last_name}` : "Unassigned"}
                            </p>
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
                <ViewComplianceModal
                    workOrder={viewingItem}
                    locations={locations}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => {
                        setViewingItem(null);
                        setEditableItem(null);
                        setEditing(false);
                    }}
                />
            )}

            {deletingItem && (
                <DeleteComplianceModal
                    workOrder={deletingItem}
                    onClose={() => setDeletingItem(null)}
                />
            )}

            <FlashToast />

            {/* Scroll to Top Button */}
            <ScrollToTopButton
                showScrollUpButton={showScrollUpButton}
                scrollToTop={scrollToTop}
            />
        </Authenticated>
    );
};

export default ComplianceAndSafety;