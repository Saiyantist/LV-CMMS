import { useState, useRef, useEffect, useMemo } from "react";
import { Tabs } from "@/Components/shadcnui/tabs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/Components/shadcnui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Datatable } from "@/Components/Datatable";
import { StatusCell } from "./components/StatusCell";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { prioritySorting } from "@/utils/prioritySorting";
import FlashToast from "@/Components/FlashToast";
import { statusSorting } from "@/utils/statusSorting";
import ViewWorkOrderModal from "./components/ViewWorkOrderModal";
import { Search, SlidersHorizontal, ArrowUpDown, MoreVertical } from "lucide-react";
import { Input } from "@/Components/shadcnui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/shadcnui/popover";
import FilterModal from "@/Components/FilterModal";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/getStatusColor";
import { SelectSeparator } from "@/Components/shadcnui/select";
import { clearLine } from "readline";

// import FullCalendar from "@fullcalendar/react"; // FullCalendar library
// import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
// import timeGridPlugin from "@fullcalendar/timegrid"; // Week view

interface WorkOrder {
    id: number;
    assigned_at: string;
    location?: {
        name?: string;
    };
    report_description: string;
    work_order_type: string;
    priority: string;
    scheduled_at: string;
    status: string;
}

export default function AssignedWorkOrders({
    user,
    locations,
    workOrders,
}: {
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    locations: { id: number; name: string }[];
    workOrders: WorkOrder[];
}) {
    const [activeTab, setActiveTab] = useState("list");
    const [isViewingWorkOrder, setIsViewingWorkOrder] = useState<any>(null);
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

    // Define columns for the data table
    const columns: ColumnDef<{ id: number; location?: { name?: string } }>[] = [
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
            accessorKey: "assigned_at",
            header: "Date Assigned",
            cell: ({ row }) => <div>{row.getValue("assigned_at")}</div>,
            meta: { 
                // headerClassName: "",
                cellClassName: "min-w-[8rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            },
        },
        {
            accessorKey: "scheduled_at",
            header: "Target Date",
            cell: ({ row }) => <div>{row.getValue("scheduled_at")}</div>,
            meta: {
                // headerClassName: "max-w-20",
                cellClassName: "min-w-[7.5rem]",
            },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => (
                <div>{row.original.location?.name || "N/A"}</div>
            ),
            enableSorting: false,
            meta: {
                cellClassName: "max-w-[8rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
                filterable: true,
            },
        },
        {
            accessorKey: "report_description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("report_description")}</div>,
            enableSorting: false,
            meta: {
                cellClassName: "max-w-[18rem] px-2 text-left whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
            },
        },
        {
            accessorKey: "work_order_type",
            header: "Work Order Type",
            cell: ({ row }) => <div>{row.getValue("work_order_type")}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "min-w-[10rem]",
                cellClassName: "text-secondary/50 font-semibold",
                filterable: true,
            },
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => (
                <div
                    className={`px-4 py-1 rounded ${getPriorityColor(
                        row.getValue("priority")
                    )}`}
                >
                    {row.getValue("priority")}
                </div>
            ),
            sortingFn: prioritySorting,
            meta: {
                // headerClassName: "w-24",
                // cellClassName: "max-w-24 flex justify-center",
                filterable: true,
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
            sortingFn: statusSorting,
            meta: {
                // cellClassName: "flex justify-center",
                filterable: true,
            },
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <Button
                    className="bg-primary h-6 text-xs rounded-sm"
                    onClick={() => setIsViewingWorkOrder(row.original)}
                >
                    View
                </Button>
            ),
            enableSorting: false,
        },
    ];

    const sortOptions = [
        { label: 'ID', value: 'id' },
        { label: 'Date Assigned', value: 'assigned_at' },
        { label: 'Target Date', value: 'scheduled_at' },
        { label: 'Priority', value: 'priority' },
        { label: 'Status', value: 'status' }
    ];

    // Filter and sort work orders based on search query, filters, and sort config
    const filteredMobileWorkOrders = useMemo(() => {
        let filtered = workOrders.filter((workOrder: WorkOrder) => {
            const matchesSearch = mobileSearchQuery === "" || 
                workOrder.id.toString().includes(mobileSearchQuery) ||
                workOrder.location?.name?.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                workOrder.report_description.toLowerCase().includes(mobileSearchQuery.toLowerCase());

            const matchesFilters = Object.entries(mobileColumnFilters).every(([key, value]) => {
                if (!value || value === "all") return true;
                if (key === "status") return workOrder.status === value;
                if (key === "work_order_type") return workOrder.work_order_type === value;
                if (key === "location.name") return workOrder.location?.name === value;
                if (key === "priority") return workOrder.priority === value;
                return true;
            });

            return matchesSearch && matchesFilters;
        });

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const { key, direction } = mobileSortConfig;
            let aValue: number | string;
            let bValue: number | string;

            if (key === 'priority') {
                const order = { Low: 1, Medium: 2, High: 3, Critical: 4 };
                aValue = order[a.priority as keyof typeof order] ?? 0;
                bValue = order[b.priority as keyof typeof order] ?? 0;
            } else if (key === 'assigned_at' || key === 'scheduled_at') {
                aValue = new Date(a[key as keyof WorkOrder] as string).getTime();
                bValue = new Date(b[key as keyof WorkOrder] as string).getTime();
            } else if (key === 'id') {
                aValue = a.id;
                bValue = b.id;
            } else {
                aValue = a[key as keyof WorkOrder] as string;
                bValue = b[key as keyof WorkOrder] as string;
            }

            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [workOrders, mobileSearchQuery, mobileColumnFilters, mobileSortConfig]);


    return (
        <AuthenticatedLayout>
            <Head title="Assigned Work Orders" />

            {/* Header */}
            <header className="sticky top-0 z-40 md:z-0 w-full mx-auto px-0 sm:pb-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start -mt-6 pt-6 text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold">
                        Assigned Tasks
                    </h1>

                    <SelectSeparator className="sm:hidden mt-2 bg-secondary/30"/>
                </div>
            </header>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-md lg:-mt-[3.3rem]">
                <Datatable
                    columns={columns}
                    data={workOrders}
                    placeholder="Search ID, Location or Description"
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
                            placeholder="Search ID or Location"
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

                {filteredMobileWorkOrders.map((order: WorkOrder) => (
                    <div
                        key={order.id}
                        className="text-xs xs:text-sm bg-white border border-gray-200 rounded-2xl p-4 shadow relative hover:bg-muted transition-all duration-200"
                        onClick={() => setIsViewingWorkOrder(order)}
                    >
                        {/* Top row: ID and Status aligned horizontally */}
                        <div className="flex text-gray-800 mb-1">
                            <div className="flex flex-[11] justify-between items-start">
                                {/* ID */}
                                <p>
                                    <span className="font-bold text-primary">ID:</span>{" "}
                                    {order.id}
                                </p>
                                {/* Status */}
                                <span
                                    className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            {/* More Vertical Button */}
                            {/* <div className="flex flex-[1] justify-end items-center">
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
                                            onClick={() => setIsViewingWorkOrder(order)}
                                            className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                        >
                                            View
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </div> */}
                        </div>

                        {/* Info Section */}
                        <div className="space-y-1 pr-8 text-gray-800">
                            {/* Date Assigned */}
                            <p>
                                <span className="font-bold text-primary">Date Assigned:</span>{" "}
                                {order.assigned_at ? (
                                    format(new Date(order.assigned_at), "yyyy-MM-dd")
                                ) : (
                                    <span className="text-muted-foreground italic">No date set</span>
                                )}
                            </p>

                            {/* Target Date */}
                            <p>
                                <span className="font-bold text-primary">Target Date:</span>{" "}
                                {order.scheduled_at ? (
                                    format(new Date(order.scheduled_at), "yyyy-MM-dd")
                                ) : (
                                    <span className="text-muted-foreground italic">No date set</span>
                                )}
                            </p>

                            {/* Location */}
                            <p>
                                <span className="font-bold text-primary">Location:</span>{" "}
                                {order.location?.name || "N/A"}
                            </p>

                            {/* Description */}
                            {/* <p>
                                <span className="font-bold text-primary">Description:</span>{" "}
                                {order.report_description}
                            </p> */}

                            {/* Work Order Type */}
                            <p>
                                <span className="font-bold text-primary">Type:</span>{" "}
                                <span className="text-secondary font-semibold">{order.work_order_type}</span>
                            </p>

                            {/* Priority */}
                            <p>
                                <span className="font-bold text-primary">Priority:</span>{" "}
                                <span className={`px-2 py-1 rounded ${getPriorityColor(order.priority)}`}>
                                    {order.priority}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {isViewingWorkOrder && (
                <ViewWorkOrderModal
                    workOrder={isViewingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setIsViewingWorkOrder(null)}
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
