// IndexLayout.tsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcnui/tabs";
import { Button } from "@/Components/shadcnui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import CreateWorkOrderModal from "./components/CreateModal";
import EditWorkOrderModal from "./components/EditWorkOrderModal";
import { StatusCell } from "./components/StatusCell";
import { Datatable } from "@/Components/Datatable";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { getStatusColor } from "@/utils/getStatusColor";
import { prioritySorting } from "@/utils/prioritySorting";
import FlashToast from "@/Components/FlashToast";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AssignWorkOrderModal from "./components/AcceptWorkOrderModal";
import ViewWorkOrderModal from "./components/ViewWorkOrderModal";
import { BookX, CirclePlus, MoreVertical, Search, SlidersHorizontal, SquarePen, Trash2 } from "lucide-react";
import DeclineWorkOrderModal from "./components/DeclineWorkOrderModal";
import CancelWorkOrderModal from "./components/CancelWorkOrderModal";
import ForBudgetRequestModal from "./components/ForBudgetRequestModal";
import DeleteWorkOrderModal from "./components/DeleteWorkOrderModal";
import { Input } from "@/Components/shadcnui/input";
import FilterModal from "@/Components/FilterModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/shadcnui/dropdown-menu";
import {
    Popover,
    PopoverTrigger,
    PopoverContent
  } from "@/Components/shadcnui/popover";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/Components/shadcnui/select";
  

interface Props {
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    locations: { id: number; name: string }[];
    assets: {
        id: number;
        name: string;
        location: { id: number; name: string };
    }[];
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
    requested_by: {
        id: number;
        name: string;
    };
    requested_at: string;
    scheduled_at: string;
    approved_at: string;
    approved_by: string;
    location: {
        id: number;
        name: string;
    };
    images: string[];
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
    assets,
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
}: Props) {
    const isRequesterOrPersonnel =
    user.roles[0].name === "internal_requester" ||
    user.roles[0].name === "department_head" ||
    user.roles[0].name === "maintenance_personnel";
    const isWorkOrderManager = user.permissions.includes("manage work orders");

    const [isViewingWorkOrder, setIsViewingWorkOrder] = useState<any>(null);
    const [acceptingWorkOrder, setAcceptingWorkOrder] = useState<any>(null);
    const [forBudgetRequest, setForBudgetRequest] = useState<any>(null);
    const [decliningWorkOrder, setDecliningWorkOrder] = useState<any>(null);
    const [cancellingWorkOrder, setCancellingWorkOrder] = useState<any>(null);
    const [deletingWorkOrder, setDeletingWorkOrder] = useState<any>(null);
    // const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>([]);
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);
    const [mobileColumnFilters, setMobileColumnFilters] = useState<Record<string, any>>({});
    const mobileFilterButtonRef = useRef<HTMLButtonElement>(null);
    
    // const toggleDescription = (id: number) => {
    //     setExpandedDescriptions((prev) =>
    //         prev.includes(id)
    //             ? prev.filter((item) => item !== id)
    //             : [...prev, id]
    //     );
    // };

    // const filteredMobileWorkOrders = useMemo(() => {
    //     return filteredWorkOrders.filter((workOrder) => {
    //         const searchLower = mobileSearchQuery.toLowerCase();
    //         return (
    //             workOrder.report_description?.toLowerCase().includes(searchLower) ||
    //             workOrder.location?.name?.toLowerCase().includes(searchLower)
    //         );
    //     });
    // }, [filteredWorkOrders, mobileSearchQuery]);

    const filteredMobileWorkOrders = useMemo(() => {
        let filtered = filteredWorkOrders;
    
        // Apply column filters
        if (Object.keys(mobileColumnFilters).length > 0) {
            filtered = filtered.filter((row) => {
                return Object.entries(mobileColumnFilters).every(([key, filterValue]) => {
                    if (!filterValue || filterValue === "all") return true;
                    const keys = key.split(".");
                    const value = keys.reduce((obj, k) => obj?.[k], row as any);
                    return value === filterValue;
                });
            });
        }
    
        // Apply search query
        if (mobileSearchQuery) {
            filtered = filtered.filter((workOrder) => {
                const searchLower = mobileSearchQuery.toLowerCase();
                return (
                    workOrder.report_description?.toLowerCase().includes(searchLower) ||
                    workOrder.location?.name?.toLowerCase().includes(searchLower)
                );
            });
        }
    
        return filtered;
    }, [filteredWorkOrders, mobileSearchQuery, mobileColumnFilters]);

    useEffect(() => {
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
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileFilterModalOpen]);

    const getPlaceholderText = () => {
        
        if (!isWorkOrderManager) {
            return "Search Location or Description";
        }

        switch (activeTab) {
            case "Pending":
                return "Search for ID, Location, Description, and Requested by";
            case "For Budget Request":
                return "Search for ID, Location, Description, Requested by, and Label";
            default:
                return "Search for ID, Location, Description, Label, and Assignee";
        }
    };

    const requesterOrPersonnelColumns: ColumnDef<WorkOrders>[] = [
        {
            accessorKey: "requested_at",
            header: "Date Requested",
            cell: ({ row }) => <div>{row.getValue("requested_at")}</div>,
            meta: { headerClassName: "", cellClassName: "w-[10rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll" },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "",
                cellClassName: "w-[8rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
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
                headerClassName: "w-[20rem]",
                cellClassName: "px-2 text-left whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
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
                cellClassName: "flex justify-center",
                filterable: true,
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-start px-2">
                    {/* Large screens - visible above md breakpoint */}
                    <div className="hidden xl:flex gap-2">
                        {/* View */}
                        <Button
                            className="bg-secondary h-6 text-xs rounded-sm"
                            onClick={() => setIsViewingWorkOrder(row.original)}
                        >
                            View
                        </Button>
                        {row.getValue('status') === "Pending" && (
                            <>
                                {/* Edit */}
                                <Button
                                    variant={"outline"}
                                    size={"icon"}
                                    className="h-6 text-xs text-secondary rounded-sm"
                                    onClick={() => setEditingWorkOrder(row.original)}
                                ><SquarePen />
                                </Button>
                                {/* Cancel */}
                                <Button
                                    variant={"outline"}
                                    size={"icon"}
                                    className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/70 hover:text-white transition-all duration-200"
                                    onClick={() => setCancellingWorkOrder(row.original)}
                                ><BookX />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Medium screens - visible only on md */}
                    <div className="hidden md:flex xl:hidden lg:ml-[50px]">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {/* View */}
                                <DropdownMenuItem onClick={() => setIsViewingWorkOrder(row.original)}>
                                    View
                                </DropdownMenuItem>
                                {row.getValue('status') === "Pending" && (
                                    <>
                                        {/* Edit */}
                                        <DropdownMenuItem onClick={() => setEditingWorkOrder(row.original)}>
                                            Edit
                                        </DropdownMenuItem>
                                        {/* Cancel */}
                                        <DropdownMenuItem 
                                            onClick={() => setCancellingWorkOrder(row.original)}
                                            className="text-destructive"
                                        >
                                            Cancel
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ),
            enableSorting: false,
            meta: {
                cellClassName: "w-[10rem] md:w-[3rem] lg:w-[10rem]",
            }
        },
    ];

    const workOrderManagerColumns: ColumnDef<WorkOrders>[] = [
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
            accessorKey: "requested_at",
            header: "Date Requested",
            cell: ({ row }) => <div>{row.getValue("requested_at")}</div>,
            meta: { 
                headerClassName: "w-[8.5rem]",
                cellClassName: "whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location.name}</div>,
            enableSorting: false,
            meta: {
                cellClassName: "max-w-[6rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
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
                cellClassName: "min-w-[9rem] max-w-[11.5rem] px-1 text-left whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
            },
        },
        // Accepted and Declined tabs
        ...(activeTab !== "Pending" && activeTab !== "For Budget Request"
            ? [
                {
                    accessorKey: "label",
                    header: "Label",
                    cell: ({ row }: { row: Row<WorkOrders> }) => <div>{row.getValue("label")}</div>,
                    enableSorting: false,
                    meta: {
                        cellClassName: "text-center",
                        searchable: true,
                    }
                },
                ...(activeTab === "Accepted" ? [
                    {
                    accessorKey: "scheduled_at",
                    header: "Target Date",
                    cell: ({ row }: { row: Row<WorkOrders> }) => <div>{row.getValue("scheduled_at") || "No date set."}</div>,
                    meta: {
                        cellClassName: "min-w-[7.5rem] max-w-[8rem] text-center",
                    },
                }
                ] : []),
                {
                    accessorKey: "priority",
                    header: "Priority",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
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
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div>{row.original.assigned_to?.name || "Unassigned"}</div>
                    ),
                    enableSorting: false,
                    meta: {
                        cellClassName: "min-w-[7.5rem] max-w-[8rem] text-center",
                        searchable: true,
                        filterable: true,
                    },
                },
                {
                    accessorKey: "status",
                    header: "Status",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <StatusCell
                            value={row.getValue("status")}
                            user={user}
                            row={row}
                        />
                    ),
                    enableSorting: false,
                    meta: {
                        headerClassName: "max-w-10",
                        cellClassName: "flex justify-center",
                        filterable: true,
                    },
                },
                {
                    id: "actions",
                    header: "Action",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div className="flex gap-2 justify-center">
                            {/* Large screens - visible above md breakpoint */}
                            <div className="hidden xl:flex gap-2">
                                <Button
                                    className="bg-secondary h-6 text-xs rounded-sm hover:bg-secondary/80 hover:text-white transition-all duration-200"
                                    onClick={() => setEditingWorkOrder(row.original)}
                                >
                                    Edit
                                </Button>
                                {activeTab === "Declined" && (
                                    <Button
                                        variant={"outline"}
                                        size={"icon"}
                                        className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/75 hover:text-white transition-all duration-200"
                                        onClick={() => setDeletingWorkOrder(row.original)}
                                    ><Trash2 />
                                    </Button>
                                )}
                            </div>

                            {/* Large screens - visible from md to lg */}
                            <div className="hidden md:flex xl:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-5 w-5 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setEditingWorkOrder(row.original)}>
                                            Edit
                                        </DropdownMenuItem>
                                        {activeTab === "Declined" && (
                                            <DropdownMenuItem 
                                                onClick={() => setDeletingWorkOrder(row.original)}
                                                className="text-destructive"
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ),
                    enableSorting: false,
                }
              ]
            : []),
        // Pending and For Budget Request tabs
        ...(activeTab === "Pending" || activeTab === "For Budget Request"
            ? [
                {
                    accessorKey: "requested_by",
                    header: "Requested by",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div>{row.original.requested_by?.name || "N/A"}</div>
                    ),
                    enableSorting: false,
                    meta: {
                        cellClassName: "max-w-[5rem] text-center whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                        searchable: true,
                        filterable: true,
                    },
                },
                ...(activeTab === "For Budget Request" ? [
                    {
                        accessorKey: "label",
                        header: "Label",
                        cell: ({ row }: { row: Row<WorkOrders> }) => <div>{row.getValue("label")}</div>,
                        enableSorting: false,
                        meta: {
                            cellClassName: "text-center",
                            searchable: true,
                        }
                    },
                    // {
                    //     accessorKey: "priority",
                    //     header: "Priority",
                    //     cell: ({ row }: { row: Row<WorkOrders> }) => (
                    //         <div
                    //             className={`px-2 py-1 rounded ${getPriorityColor(
                    //                 row.getValue("priority")
                    //             )}`}
                    //         >
                    //             {row.getValue("priority")}
                    //         </div>
                    //     ),
                    //     sortingFn: prioritySorting,
                    //     meta: {
                    //         headerClassName: "max-w-10",
                    //         cellClassName: "text-center",
                    //         filterable: true,
                    //     },
                    // },
                ] : []),
                {
                    id: "actions",
                    header: "Action",
                    cell: ({ row }: { row: Row<WorkOrders> }) => (
                        <div className="flex gap-2 justify-center">
                            {/* Extra Large screens - visible above xl breakpoint */}
                            <div className="hidden xl:flex gap-2">
                                <Button
                                    className="bg-secondary h-6 text-xs text-white rounded-sm !border-none hover:bg-secondary/80 hover:text-white transition-all duration-200"
                                    onClick={() => setAcceptingWorkOrder(row.original)}
                                >
                                    Accept
                                </Button>
                                {activeTab === "Pending" && (
                                    <Button
                                        className="h-6 text-xs text-white rounded-sm !border-none bg-secondary/65 hover:bg-secondary/80 hover:text-white transition-all duration-200"
                                        onClick={() => setForBudgetRequest(row.original)}
                                    >
                                        Budget Request
                                    </Button>
                                )}
                                <Button
                                    variant={"outline"}
                                    size={"icon"}
                                    className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/75 hover:text-white transition-all duration-200"
                                    onClick={() => setDecliningWorkOrder(row.original)}
                                ><BookX />
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
                                        <DropdownMenuItem onClick={() => setAcceptingWorkOrder(row.original)}>
                                            Accept
                                        </DropdownMenuItem>
                                        {activeTab === "Pending" && (
                                            <DropdownMenuItem onClick={() => setForBudgetRequest(row.original)}>
                                                Budget Request
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem 
                                            onClick={() => setDecliningWorkOrder(row.original)}
                                            className="text-destructive"
                                        >
                                            Decline
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ),
                    enableSorting: false,
                    meta: {
                        cellClassName: "min-w-[7.5rem] max-w-[8rem] text-center",
                    },
                }
            ]
            : [])
    ];

    const columns: ColumnDef<WorkOrders>[] = isRequesterOrPersonnel 
        ? requesterOrPersonnelColumns 
        : isWorkOrderManager 
            ? workOrderManagerColumns 
            : [];

    return (
        <AuthenticatedLayout>
            <Head title="Work Orders" />

            {/* Header */}
            <header className="mx-auto px-0 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        Work Orders
                    </h1>
                    <PrimaryButton
                        onClick={() => setIsCreating(true)}
                        className="bg-secondary text-white hover:bg-primary transition-all duration-300 !text-lg xs:text-lg md:text-base rounded-md w-[98%] sm:w-auto text-center self-center justify-center gap-2"
                    >
                        <span>Create</span>
                        <CirclePlus className="h-5 w-5" />
                    </PrimaryButton>
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
                            <TabsTrigger value="Declined" className="data-[state=active]:bg-red-600/80 hover:bg-red-600/60 hover:text-white duration-200">Declined</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            )}

            {/* Tabs - Mobile */}
            {user.permissions.includes("manage work orders") && (
                <div className="md:hidden gap-2 mt-4">
                    <div className="flex flex-row items-center gap-1">
                        {/* Switch Tabs */}
                        <div className="flex flex-[2] sm:flex-[1] justify-start pl-2">
                            <h2 className="text-sm text-primary font-semibold">
                                Switch Tabs:
                            </h2>
                        </div>
                        {/* Dropdown */}
                        <div className="flex flex-[5]">
                            <Select value={activeTab} onValueChange={setActiveTab}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select tab" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tabs.map((tab) => (
                                        <SelectItem key={tab} value={tab}>
                                            {tab}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Table View */}
            <div
                className={`hidden md:block overflow-x-auto rounded-md lg:-mt-[4.1rem]  ${
                    !user.permissions.includes("manage work orders")
                        && "-mt-[3.8rem]"
                }`}
            >
                <Datatable
                    columns={columns}
                    data={filteredWorkOrders}
                    placeholder={getPlaceholderText()}
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mt-4">

                {/* Search and Filter Controls */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search description or location"
                            value={mobileSearchQuery}
                            onChange={(event) => setMobileSearchQuery(event.target.value)}
                            className="h-10 w-full pl-8 rounded-md border bg-white/70 focus-visible:bg-white"
                        />
                    </div>
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
                    data={filteredWorkOrders}
                    buttonRef={mobileFilterButtonRef as React.RefObject<HTMLButtonElement>}
                />

                {filteredMobileWorkOrders.map((workOrder) => {
                    const description = workOrder.report_description || "";
                    const shouldTruncate = description.length > 25;

                    return (
                        <div
                            key={workOrder.id}
                            className="text-xs xs:text-sm bg-white border border-gray-200 rounded-2xl p-4 shadow relative hover:bg-muted transition-all duration-200"
                            onClick={() => {
                                if(!isWorkOrderManager) {
                                    setIsViewingWorkOrder(workOrder);
                                }
                            }}
                        >
                            {/* Top row: ID and Status aligned horizontally */}
                            <div className="flex text-gray-800 mb-1">
                                <div className="flex flex-[11] justify-between items-start ">
                                    {/* ID */}
                                    <p>
                                        <span className="font-bold text-primary">ID:</span>{" "}
                                        {workOrder.id}
                                    </p>
                                    {/* Status */}
                                    {activeTab !== "For Budget Request" && (
                                        <span
                                            className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(
                                                workOrder.status
                                            )}`}
                                        >
                                            {workOrder.status}
                                        </span>
                                    )}
                                </div>
                                {/* More Vertical Button */}
                                <div className="flex flex-[1] justify-end items-center">
                                    {isWorkOrderManager ? (
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
                                                {/* Pending Tab Actions */}
                                                {(activeTab === "Pending" || activeTab === "For Budget Request") && (
                                                    <>
                                                        <button
                                                            onClick={() => setAcceptingWorkOrder(workOrder)}
                                                            className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                                        >
                                                            Accept
                                                        </button>
                                                        {activeTab === "Pending" && (
                                                            <button
                                                                onClick={() => setForBudgetRequest(workOrder)}
                                                                className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                                            >
                                                                Budget Request
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setDecliningWorkOrder(workOrder)}
                                                            className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                )}

                                                {/* Accepted Tab Actions */}
                                                {activeTab === "Accepted" && (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingWorkOrder(workOrder)}
                                                            className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                    </>
                                                )}

                                                {/* Declined Tab Actions */}
                                                {activeTab === "Declined" && (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingWorkOrder(workOrder)}
                                                            className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingWorkOrder(workOrder)}
                                                            className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
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
                                                    onClick={() => setIsViewingWorkOrder(workOrder)}
                                                    className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                                >
                                                    View
                                                </button>

                                                {workOrder.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => setEditingWorkOrder(workOrder)}
                                                            className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setCancellingWorkOrder(workOrder)}
                                                            className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-1 pr-8 text-gray-800">
                                {/* Date Requested */}
                                <p>
                                    <span className="font-bold text-primary">
                                        Date Requested:
                                    </span>{" "}
                                    {new Date(
                                        workOrder.requested_at
                                    ).toLocaleDateString()}
                                </p>
                                {/* Description */}
                                <p>
                                    <span className="font-bold text-primary">
                                        Description:
                                    </span>{" "}
                                    {shouldTruncate
                                        ? `${description.slice(0, 25)}...`
                                        : description}
                                </p>

                                {/* Location */}
                                <p>
                                    <span className="font-bold text-primary">
                                        Location:
                                    </span>{" "}
                                    {workOrder.location?.name || "N/A"}
                                </p>

                                {/* Priority */}
                                {isWorkOrderManager && (
                                    <p className="flex items-center">
                                        <span className="font-bold text-primary mr-1">
                                            Priority:
                                        </span>
                                        <span className="flex gap-1">
                                            {["low", "med", "high", "crit"].map(
                                                (level) => {
                                                    const normalizedPriority =
                                                        workOrder.priority
                                                            ?.toLowerCase()
                                                            .trim();

                                                    // Mapping for alternate values like "medium" -> "med"
                                                    const priorityAliases: Record<
                                                        string,
                                                        string
                                                    > = {
                                                        low: "low",
                                                        medium: "med",
                                                        med: "med",
                                                        high: "high",
                                                        critical: "crit",
                                                        crit: "crit",
                                                    };

                                                    const current =
                                                        priorityAliases[
                                                            normalizedPriority || ""
                                                        ] || "";

                                                    const isActive =
                                                        current === level;

                                                    const bgColorMap: Record<
                                                        string,
                                                        string
                                                    > = {
                                                        low: "bg-green-100 text-green-800",
                                                        med: "bg-yellow-100 text-yellow-800",
                                                        high: "bg-orange-100 text-orange-800",
                                                        crit: "bg-red-100 text-red-800",
                                                    };

                                                    return (
                                                        <span
                                                            key={level}
                                                            className={`px-2 py-1 text-xs font-semibold border ${
                                                                isActive
                                                                    ? `${bgColorMap[level]} border-transparent`
                                                                    : "bg-gray-100 text-gray-400 border-gray-300"
                                                            }`}
                                                        >
                                                            {level}
                                                        </span>
                                                    );
                                                }
                                            )}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modals */}
            {isCreating && (
                <CreateWorkOrderModal
                    locations={locations}
                    assets={assets}
                    user={user}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setIsCreating(false)}
                />
            )}

            {editingWorkOrder && (
                <EditWorkOrderModal
                    workOrder={editingWorkOrder}
                    locations={locations}
                    assets={assets}
                    user={user}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setEditingWorkOrder(null)}
                />
            )}

            {acceptingWorkOrder && (
                <AssignWorkOrderModal
                    workOrder={acceptingWorkOrder}
                    locations={locations}
                    assets={assets}
                    user={user}
                    maintenancePersonnel={maintenancePersonnel}
                    onClose={() => setAcceptingWorkOrder(null)}
                />
            )}

            {forBudgetRequest && (
                <ForBudgetRequestModal
                    workOrder={forBudgetRequest}
                    locations={locations}
                    user={user}
                    onClose={() => setForBudgetRequest(null)}
                />
            )}

            {isViewingWorkOrder && (
                <ViewWorkOrderModal
                    workOrder={isViewingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setIsViewingWorkOrder(null)}
                />
            )}

            {decliningWorkOrder && (
                <DeclineWorkOrderModal
                    workOrder={decliningWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setDecliningWorkOrder(null)}
                />
            )}

            {cancellingWorkOrder && (
                <CancelWorkOrderModal
                    workOrder={cancellingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setCancellingWorkOrder(null)}
                />
            )}

            {deletingWorkOrder && (
                <DeleteWorkOrderModal
                    workOrder={deletingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setDeletingWorkOrder(null)}
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
}
