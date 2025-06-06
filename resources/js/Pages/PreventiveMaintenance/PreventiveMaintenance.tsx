import React, { useState } from "react";
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
import { Trash2, MoreVertical } from "lucide-react";
import DeletePMModal from "./components/DeletePMModal";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcnui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/shadcnui/dropdown-menu";

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
    images: string[];
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
        const { interval_unit, interval_value } = schedule;
        
        let nextDate = new Date(lastDate);
        
        switch (interval_unit) {
            case "weeks":
                nextDate.setDate(lastDate.getDate() + ((interval_value || 1) * 7));
                break;
            case "monthly":
                nextDate.setMonth(lastDate.getMonth() + (interval_value || 1));
                break;
            case "yearly":
                nextDate.setFullYear(lastDate.getFullYear() + (interval_value || 1));
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
            filterable: true,
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
            filterable: true,
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
            filterable: true,
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
            return row.asset.last_maintained_at;

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
            accessorKey: "id",
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
            accessorFn: (row) => row.name,
            enableSorting: true,
            meta: {
                cellClassName: "max-w-[7rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
                filterable: true,
            },
        },
        {
            id: "schedule",
            header: "Schedule",
            accessorFn: (row) => formatMaintenanceSchedule(row.maintenance_schedule),
            enableSorting: true,
            meta: {
                cellClassName: "max-w-[12rem] whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll",
                searchable: true,
            },
        },
        {
            id: "status",
            header: "Status",
            accessorFn: (row) => row.maintenance_schedule?.is_active ? "Active" : "Inactive",
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
            accessorFn: (row) => row.maintenance_schedule?.last_run_at || "-",
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

    return (
        <Authenticated>
            <Head title="Preventive Maintenance" />

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

            <header className="mx-auto px-6 md:px-0 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        Preventive Maintenance
                    </h1>
                </div>
            </header>

            <div className="hidden md:flex">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-gray-200 text-black rounded-md mb-6">
                            <TabsTrigger value="Work Orders">Work Orders</TabsTrigger>
                            <TabsTrigger value="Schedules">Schedules</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto lg:-mt-[3.8rem]">

                {/* Preventive Maintenance Work Orders Datatable */}
                {activeTab === "Work Orders" && (
                <Datatable
                    columns={PMSWorkOrdersColumns}
                    data={workOrders}
                    placeholder="Search for ID, Asset Name, Location, Label, and Assigned to"
                    />
                )}

                {/* Preventive Maintenance Schedules Datatable */}
                {activeTab === "Schedules" && (
                    <Datatable
                        columns={PMSchedulesColumns}
                        data={assetMaintenanceSchedules}
                        placeholder="Search for ID, Asset Name, and Schedule"
                    />
                )}
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

            </div>
        </Authenticated>
    );
};

export default PreventiveMaintenance;

export type { AssetWithMaintenanceSchedule };
