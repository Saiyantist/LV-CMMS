import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Datatable } from "@/Components/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/shadcnui/button";
import ViewPMModal from "./components/ViewPMModal";
import EditPMModal from "./components/EditPMModal";
import FlashToast from "@/Components/FlashToast";
import { getStatusColor } from "@/utils/getStatusColor";
import { Trash } from "lucide-react";
import DeletePMModal from "./components/DeletePMModal";

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
        first_name: string;
        last_name: string;
    } | null;
}

interface User {
    id: number;
    name: string;
    roles: { name: string }[];
    permissions: string[];
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

const PreventiveMaintenance: React.FC = () => {
    const { props } = usePage();
    const assets = (props.assets as Assets[]) || [];
    const maintenancePersonnel = (props.maintenancePersonnel as MaintenancePersonnel[]) || [];
    const workOrders = (props.workOrders as WorkOrders[]) || [];
    const maintenanceSchedules = (props.maintenanceSchedules as MaintenanceSchedule[]) || [];
    const user = (props.user as User) || {};
    const locations = (props.locations as Locations[]) || [];

    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isViewingPM, setIsViewPM] = useState<any>(null);
    const [isEditingPM, setIsEditingPM] = useState<any>(null);
    const [isDeletingPM, setIsDeletingPM] = useState<any>(null);

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
        header: "Assigned To",
        accessorFn: (row) => {
            if (!row.assigned_to) return "Unassigned";
            return row.assigned_to?.first_name + " " + row.assigned_to?.last_name;
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
            headerClassName: "w-20",
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
            return <div className="flex gap-2 justify-center px-2">
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
                ><Trash />
                </Button>
            </div>
        }
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

            <FlashToast />

            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        Preventive Maintenance
                    </h1>
                </div>
            </header>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto -mt-[3.5rem]">

                {/* Preventive Maintenance Work Orders Datatable */}
                <Datatable
                    columns={PMSWorkOrdersColumns}
                    data={workOrders}
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

            </div>
        </Authenticated>
    );
};

export default PreventiveMaintenance;
