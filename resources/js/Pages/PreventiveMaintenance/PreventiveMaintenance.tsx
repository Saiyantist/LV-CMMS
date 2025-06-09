import React, { useState, useRef, useEffect, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Datatable } from "@/Components/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/shadcnui/button";
import ViewPMModal from "./components/ViewPMModal";
import EditPMModal from "./components/EditPMModal";
import EditPMScheduleModal from "./components/EditPMScheduleModal";
import FlashToast from "@/Components/FlashToast";
import { getStatusColor } from "@/utils/getStatusColor";
import { Trash2, MoreVertical, Search, SlidersHorizontal, ChevronDown, ArrowUpDown } from "lucide-react";
import DeletePMModal from "./components/DeletePMModal";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcnui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/shadcnui/dropdown-menu";
import { formatDate } from "date-fns";
import { Input } from "@/Components/shadcnui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/shadcnui/popover";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/Components/shadcnui/select";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import FilterModal from "@/Components/FilterModal";

interface WorkOrders {
    id: number;
    report_description: string;
    work_order_type: string;
    label: string;
    priority: string;
    remarks: string;
    status: string;
    requested_by: { id: number; first_name: string; last_name: string};
    requested_at: string;
    scheduled_at: string;
    approved_at: string;
    approved_by: string;
    location: {
        id: number;
        name: string;
    };
    attachments: string[];
    asset: {
        id: number;
        name: string;
        specification_details: string;
        status: string;
        location: {
            id: number;
            name: string;
        };
        last_maintained_at: string;
        maintenance_schedule: {
            id: number;
            asset_id: number;
            interval_unit: string;
            interval_value: number | null;
            month_week: number | null;
            month_weekday: string | null;
            year_day: number | null;
            year_month: number | null;
            last_run_at: string;
            is_active: boolean;
        } | null;
    } | null;
    assigned_to: {
        id: number;
        name: string;
    } | null;
}

interface User {
    id: number;
    name: string;
    roles: { name: string }[];
    permissions: string[];
}

interface AssetWithMaintenanceSchedule {
    id: number;
    name: string;
    specification_details: string;
    status: string;
    location: {
        id: number;
        name: string;
    };
    last_maintained_at: string;
    maintenance_schedule: MaintenanceSchedule;
}

interface MaintenanceSchedule {
    id: number;
    asset_id: number;
    interval_unit: string;
    interval_value: number | null;
    month_week: number | null;
    month_weekday: string | null;
    year_day: number | null;
    year_month: number | null;
    last_run_at: string;
    is_active: boolean;
}

interface Locations {
    id: number;
    name: string;
}[]

interface MaintenancePersonnel {
    id: number;
    first_name: string;
    last_name: string;
    roles: { id: number; name: string };
}
interface Assets {
    id: number;
    name: string;
    location: { id: number; name: string };
}

const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const formatMaintenanceSchedule = (schedule: MaintenanceSchedule | null): string => {
    if (!schedule) return 'No schedule';
    
    const { interval_unit, interval_value, month_week, month_weekday, year_month, year_day } = schedule;
    
    if (interval_unit === 'weeks' && interval_value) {
        return `Every ${interval_value} week${interval_value > 1 ? 's' : ''}`;
    }
    
    if (interval_unit === 'monthly' && month_week && month_weekday) {
        return `Every ${getOrdinalSuffix(month_week)} ${month_weekday.charAt(0).toUpperCase() + month_weekday.slice(1)} of month`;
    }
    
    if (interval_unit === 'yearly' && year_month && year_day) {
        const month = new Date(2000, year_month - 1).toLocaleString('default', { month: 'long' });
        return `Every ${month} ${getOrdinalSuffix(year_day)}`;
    }
    
    return 'No schedule';
};

const computeNextScheduledDate = (schedule: MaintenanceSchedule | null, lastMaintainedAt: string | null): string => {
    if (!schedule || !lastMaintainedAt) return "-";
    
    try {
        const lastDate = new Date(lastMaintainedAt);
        const { interval_unit, interval_value, month_week, month_weekday, year_month, year_day } = schedule;
        
        let nextDate = new Date(lastDate);
        
        switch (interval_unit) {
            case "weeks":
                // Add specified number of weeks to last maintained date
                nextDate.setDate(lastDate.getDate() + ((interval_value || 1) * 7));
                break;
                
            case "monthly":
                if (!month_week || !month_weekday) return "-";
                
                // Move to next month
                nextDate.setMonth(lastDate.getMonth() + 1);
                nextDate.setDate(1); // Start from first day of month
                
                // Find the specified week and weekday
                const targetWeek = month_week;
                const targetWeekday = month_weekday.toLowerCase();
                const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const targetWeekdayIndex = weekdays.indexOf(targetWeekday);
                
                if (targetWeekdayIndex === -1) return "-";
                
                // Find first occurrence of the weekday in the month
                while (nextDate.getDay() !== targetWeekdayIndex) {
                    nextDate.setDate(nextDate.getDate() + 1);
                }
                
                // Move to the specified week
                nextDate.setDate(nextDate.getDate() + ((targetWeek - 1) * 7));
                break;
                
            case "yearly":
                if (!year_month || !year_day) return "-";
                
                // Move to next year if current month is past or equal to target month
                if (lastDate.getMonth() + 1 >= year_month) {
                    nextDate.setFullYear(lastDate.getFullYear() + 1);
                }
                
                // Set to specified month and day
                nextDate.setMonth(year_month - 1); // JavaScript months are 0-based
                nextDate.setDate(year_day);
                break;
                
            default:
                return "-";
        }
        
        return nextDate.toLocaleDateString();
    } catch (error) {
        console.error("Error computing next scheduled date:", error);
        return "-";
    }
};

const PreventiveMaintenance: React.FC = () => {
    const { props } = usePage();
    const assets = (props.assets as Assets[]) || [];
    const maintenancePersonnel = (props.maintenancePersonnel as MaintenancePersonnel[]) || [];
    const workOrders = (props.workOrders as WorkOrders[]) || [];
    const assetMaintenanceSchedules = (props.maintenanceSchedules as AssetWithMaintenanceSchedule[]) || [];
    const user = (props.user as User) || {};
    const locations = (props.locations as Locations[]) || [];
    
    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isViewingPM, setIsViewPM] = useState<any>(null);
    const [isEditingPM, setIsEditingPM] = useState<any>(null);
    const [isDeletingPM, setIsDeletingPM] = useState<any>(null);
    const [isEditingPMSchedule, setIsEditingPMSchedule] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Work Orders");
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [mobileColumnFilters, setMobileColumnFilters] = useState<Record<string, string>>({});
    const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);
    const mobileFilterButtonRef = useRef<HTMLButtonElement>(null);
    const [showScrollUpButton, setShowScrollUpButton] = useState(false)
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

    const PMSWorkOrdersColumns: ColumnDef<WorkOrders>[] = [
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
        id: "asset",
        header: "Asset Name",
        accessorFn: (row) => {
            if (!row.asset) return "-";
            return `${row.asset?.name}`;
        },
        enableSorting: false,
        meta: {
            cellClassName: "max-w-[7rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            searchable: true,
        },
    },
    {
        id: "location",
        header: "Location",
        accessorFn: (row) => {
            if (!row.location) return "-";
            return `${row.location?.name || "No Location"}`;
        },
        enableSorting: false,
        meta: {
            cellClassName: "max-w-[8rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            searchable: true,
        },
    },
    {
        id: "label",
        header: "Label",
        accessorKey: "label",
        enableSorting: false,
        meta: {
            cellClassName: "max-w-[4.2rem]",
            searchable: true,
            filterable: true,
        },
    },
    {
        id: "assigned_to",
        header: "Assigned to",
        accessorFn: (row) => {
            if (!row.assigned_to) return "Unassigned";
            return row.assigned_to?.name;
        },
        enableSorting: false,
        meta: {
            cellClassName: "max-w-[10rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            searchable: true,
        },
    },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            return (
                <span
                    className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(row.original.status)}`}
                >
                    {row.original.status}
                </span>
            );
        },
        enableSorting: false,
        meta: {
            headerClassName: "max-w-[5rem]",
            cellClassName: "flex justify-center",
            filterable: true,
        },
    },
    {
        id: "scheduled_at",
        header: "Scheduled Date",
        accessorFn: (row) => {
            if (!row.scheduled_at) return "-";
            return row.scheduled_at;
        },
        meta: {
            cellClassName: "max-w-[5rem]",
        },
    },
    {
        id: "last_maintained_at",
        header: "Last Maintained",
        accessorFn: (row) => {
            if (!row.asset?.last_maintained_at) return "-";
            return formatDate(row.asset.last_maintained_at, "MM/dd/yyyy");

        },
        meta: {
            cellClassName: "max-w-[5rem]",
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return <div className="flex gap-2 justify-center">
                {/* Extra Large screens - visible above xl breakpoint */}
                <div className="hidden xl:flex gap-2">
                    <Button
                        className="bg-secondary h-6 text-xs rounded-sm"
                        onClick={() => setIsViewPM(row.original)}
                    >
                        View
                    </Button>
                    <Button
                        className="bg-secondary h-6 text-xs rounded-sm"
                        onClick={() => setIsEditingPM(row.original)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="h-6 text-xs text-white rounded-sm bg-destructive hover:bg-destructive/75 hover:text-white transition-all duration-200"
                        onClick={() => setIsDeletingPM(row.original)}
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
                            <DropdownMenuItem onClick={() => setIsViewPM(row.original)}>
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsEditingPM(row.original)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setIsDeletingPM(row.original)}
                                className="text-destructive"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        },
        enableSorting: false,
    }

    ];

    const PMSchedulesColumns: ColumnDef<AssetWithMaintenanceSchedule>[] = [
        {
            id: "id",
            accessorKey: "maintenance_schedule.id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: {
                cellClassName: "w-12",
                searchable: true,
            },
            enableSorting: true,
        },
        {
            id: "asset",
            header: "Asset Name",
            accessorKey: "name",
            accessorFn: (row) => row.name,
            enableSorting: false,
            meta: {
                cellClassName: "max-w-[7rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
            },
        },
        {
            id: "schedule",
            header: "Schedule",
            accessorFn: (row) => formatMaintenanceSchedule(row.maintenance_schedule),
            enableSorting: false,
            meta: {
                cellClassName: "max-w-[12rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
            },
        },
        {
            id: "maintenance_schedule.is_active",
            header: "Status",
            accessorKey: "maintenance_schedule.is_active",
            enableSorting: true,
            cell: ({ row }) => {
                const status = row.original.maintenance_schedule?.is_active ? "Active" : "Inactive";
                return (
                    <span
                        className={`px-2 py-1 h-6 border rounded inline-flex items-center ${
                            status === "Active" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                    >
                        {status}
                    </span>
                );
            },
            meta: {
                headerClassName: "w-20",
                cellClassName: "flex justify-center",
                filterable: true,
                filterOptions: [
                    { label: "All", value: "all" },
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" }
                ]
            },
        },
        {
            id: "scheduled_at",
            header: "Next Scheduled",
            accessorFn: (row) => computeNextScheduledDate(row.maintenance_schedule, row.last_maintained_at),
            enableSorting: true,
            meta: {
                cellClassName: "max-w-[8rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            },
        },
        {
            id: "last_run_at",
            header: "Last Run",
            accessorFn: (row) => {
                if (!row.maintenance_schedule?.last_run_at) return "-";
                return formatDate(row.maintenance_schedule.last_run_at, "MM/dd/yyyy");
    
            },
            enableSorting: true,
            meta: {
                cellClassName: "max-w-[8rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return <div className="flex gap-2 justify-center px-2">
                    <Button
                        className="bg-secondary h-6 text-xs rounded-sm"
                        onClick={() => setIsEditingPMSchedule(row.original)}
                    >
                        Edit
                    </Button>
                </div>
            },
            enableSorting: false,
        }
    ];

    const tabs = ["Work Orders", "Schedules"];

    const sortOptions = activeTab === "Work Orders" ? [
        { label: 'ID', value: 'id' },
        { label: 'Scheduled Date', value: 'scheduled_at' }
    ] : [
        { label: 'ID', value: 'id' },
        { label: 'Next Scheduled', value: 'next_scheduled' },
        { label: 'Last Run', value: 'last_run_at' }
    ];

    // Filter and sort work orders based on search query, filters, and sort config
    const filteredMobileWorkOrders = useMemo(() => {
        let filtered = workOrders.filter((workOrder) => {
            const matchesSearch = mobileSearchQuery === "" || 
                workOrder.id.toString().includes(mobileSearchQuery) ||
                workOrder.asset?.name?.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                workOrder.location?.name?.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                workOrder.label?.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
                workOrder.assigned_to?.name?.toLowerCase().includes(mobileSearchQuery.toLowerCase());

            const matchesFilters = Object.entries(mobileColumnFilters).every(([key, value]) => {
                if (!value || value === "all") return true;
                if (key === "status") return workOrder.status === value;
                if (key === "location.name") return workOrder.location?.name === value;
                if (key === "label") return workOrder.label === value;
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
                const aDate = a[key] as string;
                const bDate = b[key] as string;
                aValue = aDate ? new Date(aDate).getTime() : 0;
                bValue = bDate ? new Date(bDate).getTime() : 0;
            } else {
                aValue = a[key as keyof WorkOrders] as number | string;
                bValue = b[key as keyof WorkOrders] as number | string;
            }

            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [workOrders, mobileSearchQuery, mobileColumnFilters, mobileSortConfig]);

    // Filter and sort schedules based on search query, filters, and sort config
    const filteredMobileSchedules = useMemo(() => {
        let filtered = assetMaintenanceSchedules.filter((schedule) => {
            const matchesSearch = mobileSearchQuery === "" || 
                schedule.maintenance_schedule?.id.toString().includes(mobileSearchQuery) ||
                schedule.name.toLowerCase().includes(mobileSearchQuery.toLowerCase());

            const matchesFilters = Object.entries(mobileColumnFilters).every(([key, value]) => {
                if (!value || value === "all") return true;
                if (key === "maintenance_schedule.is_active") {
                    const status = schedule.maintenance_schedule?.is_active ? "Active" : "Inactive";
                    return status === value;
                }
                return true;
            });

            return matchesSearch && matchesFilters;
        });

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const { key, direction } = mobileSortConfig;
            let aValue: number | string;
            let bValue: number | string;

            if (key === 'id') {
                aValue = a.maintenance_schedule?.id || 0;
                bValue = b.maintenance_schedule?.id || 0;
            } else if (key === 'next_scheduled') {
                const aDate = computeNextScheduledDate(a.maintenance_schedule, a.last_maintained_at);
                const bDate = computeNextScheduledDate(b.maintenance_schedule, b.last_maintained_at);
                aValue = aDate === "-" ? 0 : new Date(aDate).getTime();
                bValue = bDate === "-" ? 0 : new Date(bDate).getTime();
            } else if (key === 'last_run_at') {
                const aDate = a.maintenance_schedule?.last_run_at;
                const bDate = b.maintenance_schedule?.last_run_at;
                aValue = aDate ? new Date(aDate).getTime() : 0;
                bValue = bDate ? new Date(bDate).getTime() : 0;
            } else {
                aValue = a[key as keyof AssetWithMaintenanceSchedule] as number | string;
                bValue = b[key as keyof AssetWithMaintenanceSchedule] as number | string;
            }

            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [assetMaintenanceSchedules, mobileSearchQuery, mobileColumnFilters, mobileSortConfig]);

    // Set default sort config based on active tab
    useEffect(() => {
        if (activeTab === "Work Orders") {
            setMobileSortConfig({
                key: 'scheduled_at',
                direction: 'desc'
            });
        } else {
            setMobileSortConfig({
                key: 'id',
                direction: 'desc'
            });
        }
    }, [activeTab]);

    return (
        <Authenticated>
            <Head title="Preventive Maintenance" />

            {/* Header */}
            <header className="sticky top-0 z-40 md:z-0 w-full mx-auto px-0 sm:pb-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start -mt-6 pt-6 text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold">
                        Preventive Maintenance
                    </h1>

                    <SelectSeparator className="sm:hidden mt-2 bg-secondary/30"/>
                </div>
            </header>

            {/* Tabs - Desktop */}
            <div className="hidden md:flex">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-200 text-black rounded-md mb-6">
                        <TabsTrigger value="Work Orders">Work Orders</TabsTrigger>
                        <TabsTrigger value="Schedules">Schedules</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Tabs - Mobile */}
            <div className="md:hidden gap-2 mt-4">
                <div className="flex flex-row items-center gap-1">
                    {/* Switch Tabs */}
                    <div className="flex xs:flex-[1.5] sm:flex-[1] justify-start px-2">
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

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto lg:-mt-[3.8rem]">
                {/* Preventive Maintenance Work Orders Datatable */}
                {activeTab === "Work Orders" && (
                    <Datatable
                        columns={PMSWorkOrdersColumns}
                        data={workOrders}
                        placeholder="Search for ID, Asset Name, Location, Label, or Assigned to"
                    />
                )}

                {/* Preventive Maintenance Schedules Datatable */}
                {activeTab === "Schedules" && (
                    <Datatable
                        columns={PMSchedulesColumns}
                        data={assetMaintenanceSchedules}
                        placeholder="Search for ID or Asset Name"
                    />
                )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mt-4">
                {/* Search and Filter Controls */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={activeTab === "Work Orders" ? "Search for ID, Asset Name, Location, Label, or Assigned to" : "Search for ID or Asset Name"}
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
                    columns={activeTab === "Work Orders" ? PMSWorkOrdersColumns : PMSchedulesColumns}
                    columnFilters={mobileColumnFilters}
                    setColumnFilters={setMobileColumnFilters}
                    data={activeTab === "Work Orders" ? workOrders : assetMaintenanceSchedules}
                    buttonRef={mobileFilterButtonRef as React.RefObject<HTMLButtonElement>}
                />

                {/* Work Orders Mobile Cards */}
                {activeTab === "Work Orders" && filteredMobileWorkOrders.map((workOrder) => {
                    const description = workOrder.report_description || "";

                    return (
                        <div
                            key={workOrder.id}
                            className="text-xs xs:text-sm bg-white border border-gray-200 rounded-2xl p-4 shadow relative hover:bg-muted transition-all duration-200"
                            onClick={() => setIsViewPM(workOrder)}
                        >
                            {/* Top row: ID and Status aligned horizontally */}
                            <div className="flex text-gray-800 mb-1">
                                <div className="flex flex-[11] justify-between items-start">
                                    {/* ID */}
                                    <p>
                                        <span className="font-bold text-primary">ID:</span>{" "}
                                        {workOrder.id}
                                    </p>
                                    {/* Status */}
                                    <span
                                        className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(
                                            workOrder.status
                                        )}`}
                                    >
                                        {workOrder.status}
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
                                                onClick={() => setIsEditingPM(workOrder)}
                                                className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setIsDeletingPM(workOrder)}
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
                                
                                {/* Scheduled Date */}
                                <p>
                                    <span className="font-bold text-primary">
                                        Scheduled Date:
                                    </span>{" "}
                                    {workOrder.scheduled_at ? formatDate(workOrder.scheduled_at, "MM/dd/yyyy") : "No date set"}
                                </p>

                                {/* Asset Name */}
                                <p>
                                    <span className="font-bold text-primary">
                                        Asset:
                                    </span>{" "}
                                    {workOrder.asset?.name || "N/A"}
                                </p>

                                {/* Location */}
                                <p>
                                    <span className="font-bold text-primary">
                                        Location:
                                    </span>{" "}
                                    {workOrder.location?.name || "N/A"}
                                </p>

                                {/* Assigned To */}
                                <p>
                                    <span className="font-bold text-primary">
                                        Assigned to:
                                    </span>{" "}
                                    {workOrder.assigned_to?.name || "Unassigned"}
                                </p>

                            </div>
                        </div>
                    );
                })}

                {/* Schedules Mobile Cards */}
                {activeTab === "Schedules" && filteredMobileSchedules.map((schedule) => (
                    <div
                        key={schedule.id}
                        className="text-xs xs:text-sm bg-white border border-gray-200 rounded-2xl p-4 shadow relative hover:bg-muted transition-all duration-200"
                        onClick={() => setIsEditingPMSchedule(schedule)}
                    >
                        {/* Top row: ID and Status aligned horizontally */}
                        <div className="flex text-gray-800 mb-1">
                            <div className="flex flex-[11] justify-between items-start">
                                {/* ID */}
                                <p>
                                    <span className="font-bold text-primary">ID:</span>{" "}
                                    {schedule.maintenance_schedule?.id}
                                </p>
                                {/* Status */}
                                <span
                                    className={`font-semibold px-2.5 py-1 border rounded ${
                                        schedule.maintenance_schedule?.is_active
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-gray-100 text-gray-800 border-gray-200"
                                    }`}
                                >
                                    {schedule.maintenance_schedule?.is_active ? "Active" : "Inactive"}
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
                                            onClick={() => setIsEditingPMSchedule(schedule)}
                                            className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                                        >
                                            Edit
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="space-y-1 pr-8 text-gray-800">
                            {/* Asset Name */}
                            <p>
                                <span className="font-bold text-primary">
                                    Asset:
                                </span>{" "}
                                {schedule.name}
                            </p>

                            {/* Schedule */}
                            <p>
                                <span className="font-bold text-primary">
                                    Schedule:
                                </span>{" "}
                                {formatMaintenanceSchedule(schedule.maintenance_schedule)}
                            </p>

                            {/* Next Scheduled */}
                            <p>
                                <span className="font-bold text-primary">
                                    Next Scheduled:
                                </span>{" "}
                                {computeNextScheduledDate(schedule.maintenance_schedule, schedule.last_maintained_at)}
                            </p>

                            {/* Last Run */}
                            <p>
                                <span className="font-bold text-primary">
                                    Last Run:
                                </span>{" "}
                                {schedule.maintenance_schedule?.last_run_at 
                                    ? formatDate(schedule.maintenance_schedule.last_run_at, "MM/dd/yyyy")
                                    : "Not run yet"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {isViewingPM && (
                <ViewPMModal
                    workOrder={isViewingPM}
                    locations={locations}
                    user={user}
                    onClose={() => setIsViewPM(null)}
                />
            )}

            {isEditingPM && (
                <EditPMModal
                    workOrder={isEditingPM}
                    locations={locations}
                    assets={assets}
                    maintenancePersonnel={maintenancePersonnel}
                    user={user}
                    onClose={() => setIsEditingPM(null)}
                />
            )}

            {isDeletingPM && (
                <DeletePMModal
                    workOrder={isDeletingPM}
                    locations={locations}
                    user={user}
                    onClose={() => setIsDeletingPM(null)}
                />
            )}

            {isEditingPMSchedule && (
                <EditPMScheduleModal
                    schedule={isEditingPMSchedule}
                    locations={locations}
                    onClose={() => setIsEditingPMSchedule(null)}
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

export default PreventiveMaintenance;

export type { AssetWithMaintenanceSchedule };
