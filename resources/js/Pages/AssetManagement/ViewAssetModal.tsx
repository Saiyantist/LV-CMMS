import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/Components/shadcnui/table";

// Helper function to format date as "Month Day, Year"
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
};

interface ViewAssetModalProps {
    data: {
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
        imageUrl?: string;
    };
    preventiveMaintenanceWorkOrders: {
        id: number;
        report_description: string;
        location_id: number;
        work_order_type: string;
        label: string;
        priority: string;
        requested_by: number;
        requested_at: string;
        assigned_to: number;
        scheduled_at: string;
        asset_id: number;
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
        };
    }[];
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    onClose: () => void;
}

const ViewAssetModal: React.FC<ViewAssetModalProps> = ({
    data,
    preventiveMaintenanceWorkOrders,
    maintenancePersonnel,   
    onClose 
}) => {
    const user = usePage().props.auth.user;
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({ ...data });
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // New state for fetched history data and loading indicator
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const handleChange = (field: string, value: any) => {
        setEditableData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Fetch maintenance history when history view is opened
    useEffect(() => {
        if (isHistoryOpen) {
            setLoadingHistory(true);
            axios
                .get(`/asset-maintenance-history/${data.id}`)
                .then((res) => {
                    setHistory(res.data);
                })
                .catch((err) => {
                    console.error("Failed to fetch history", err);
                    setHistory([]);
                })
                .finally(() => setLoadingHistory(false));
        }
    }, [isHistoryOpen, data.id]);

    // Helper function to format maintenance schedule
    const formatMaintenanceSchedule = (schedule: typeof preventiveMaintenanceWorkOrders[0]['maintenance_schedule']) => {
        if (!schedule) return 'No schedule';
        
        const { interval_unit, interval_value, month_week, month_weekday, year_month, year_day } = schedule;
        
        if (interval_unit === 'weeks' && interval_value) {
            return `Every ${interval_value} week${interval_value > 1 ? 's' : ''}`;
        }
        
        if (interval_unit === 'monthly' && month_week && month_weekday) {
            return `Every ${getOrdinalSuffix(month_week)} ${month_weekday} of the month`;
        }
        
        if (interval_unit === 'yearly' && year_month && year_day) {
            const month = new Date(2000, year_month - 1).toLocaleString('default', { month: 'long' });
            return `Every ${month} ${getOrdinalSuffix(year_day)}`;
        }
        
        return 'No schedule';
    };

    // Helper function to get ordinal suffix
    const getOrdinalSuffix = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // Find the maintenance schedule for this asset
    const assetMaintenanceSchedule = preventiveMaintenanceWorkOrders.find(
        workOrder => workOrder.asset_id === data.id
    )?.maintenance_schedule;

    const assetPMWorkOrder = preventiveMaintenanceWorkOrders.find(
        workOrder => workOrder.asset_id === data.id
    );

    const assignedTo = (() => {
        const assignedTo = maintenancePersonnel.find(
            personnel => personnel.id === assetPMWorkOrder?.assigned_to
        );
        return assignedTo?.first_name + ' ' + assignedTo?.last_name;
    })();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl relative mx-auto"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">
                    Asset Details
                </h2>

                {!isHistoryOpen && (
                    <>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="border p-4 rounded-md">
                                {[
                                    {
                                        label: "ID",
                                        value: data.id,
                                        editable: false,
                                    },
                                    {
                                        label: "Asset Name",
                                        value: editableData.name,
                                        editable: true,
                                        field: "name",
                                    },
                                    {
                                        label: "Specification",
                                        value: editableData.specification_details,
                                        editable: true,
                                        field: "specification_details",
                                    },
                                    {
                                        label: "Location",
                                        value: editableData.location.name,
                                        editable: true,
                                        field: "location",
                                        isLocation: true,
                                    },
                                    {
                                        label: "Condition",
                                        value: editableData.status,
                                        editable: true,
                                        field: "status",
                                    },
                                    {
                                        label: "Date Acquired",
                                        value: editableData.date_acquired,
                                        editable: true,
                                        field: "date_acquired",
                                        isDate: true,
                                    },
                                    {
                                        label: "Last Maintenance",
                                        value: editableData.last_maintained_at,
                                        editable: true,
                                        field: "last_maintained_at",
                                        isDate: true,
                                    },
                                ].map(
                                    (
                                        {
                                            label,
                                            value,
                                            editable,
                                            field,
                                            isLocation,
                                            isDate,
                                        },
                                        idx
                                    ) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col sm:flex-row sm:items-center mb-4"
                                        >
                                            <strong className="sm:w-1/3 mb-1 sm:mb-0">
                                                {label}:
                                            </strong>
                                            <div className="sm:flex-1">
                                                {!isEditing || !editable ? (
                                                    <span className="sm:ml-2 block">
                                                        {isDate && !isEditing
                                                            ? formatDate(
                                                                  value as string
                                                              )
                                                            : value}
                                                    </span>
                                                ) : isLocation ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            editableData
                                                                .location.name
                                                        }
                                                        onChange={(e) =>
                                                            setEditableData({
                                                                ...editableData,
                                                                location: {
                                                                    ...editableData.location,
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }
                                                        className="border px-3 py-2 rounded-md w-full"
                                                    />
                                                ) : isDate ? (
                                                    <input
                                                        type="date"
                                                        value={value as string}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                field!,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border px-3 py-2 rounded-md w-full"
                                                    />
                                                ) : field === "status" ? (
                                                    <select
                                                        value={
                                                            editableData.status
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "status",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border px-3 py-2 rounded-md w-full"
                                                    >
                                                        <option value="Scheduled">
                                                            Scheduled
                                                        </option>
                                                        <option value="Under Maintenance">
                                                            Under Maintenance
                                                        </option>
                                                        <option value="End of Useful Life">
                                                            End of Useful Life
                                                        </option>
                                                        <option value="Failed">
                                                            Failed
                                                        </option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={value as string}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                field!,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border px-3 py-2 rounded-md w-full"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}

                                {assetMaintenanceSchedule && (
                                <>
                                    <hr />
                                    <div className="pt-4 space-y-2">
                                        <h1 className="text-base font-semibold">
                                            Preventive Maintenance Scheduling
                                        </h1>
                                        <div className="flex flex-col sm:flex-row sm:items-center rounded">
                                            <Table>

                                                {/* Status */}
                                                <TableRow className="border-none flex items-center justify-start w-full">
                                                    <TableHead className="flex flex-[1] items-center">
                                                        Status
                                                    </TableHead>
                                                    <TableCell className="flex flex-[3.3] items-center">
                                                        <span className={`px-2 py-1 rounded text-sm ${assetMaintenanceSchedule?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {assetMaintenanceSchedule?.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Schedule */}
                                                <TableRow className="border-none flex items-center justify-start w-full">
                                                    <TableHead className="flex flex-[1] items-center">
                                                        Schedule
                                                    </TableHead>
                                                    <TableCell className="flex flex-[3.3] items-center">
                                                        {assetMaintenanceSchedule ? formatMaintenanceSchedule(assetMaintenanceSchedule) : 'No schedule'}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Description */}
                                                <TableRow className="border-none flex items-center justify-start w-full">
                                                    <TableHead className="flex flex-[1] items-center">
                                                        Description
                                                    </TableHead>
                                                    <TableCell className="flex flex-[3.3] items-center">
                                                        {assetPMWorkOrder?.report_description || 'No description'}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Assigned to */}
                                                <TableRow className="border-none flex items-center justify-start w-full">
                                                    <TableHead className="flex flex-[1] items-center">
                                                        Assgined to
                                                    </TableHead>
                                                    <TableCell className="flex flex-[3.3] items-center">
                                                            {assignedTo || 'Not assigned'}
                                                    </TableCell>
                                                </TableRow>


                                            </Table>
                                        </div>
                                    </div>
                                </>
                                    
                                )}

                            </div>
                        </div>

                        {data.imageUrl && (
                            <div className="mt-6">
                                <strong className="w-1/3">Image:</strong>
                                <div className="mt-2">
                                    <img
                                        src={data.imageUrl}
                                        alt="Asset"
                                        className="w-full h-auto rounded-md"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full sm:w-auto text-white bg-secondary border-0 py-2 px-4 focus:outline-none hover:bg-primary rounded-md text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setIsHistoryOpen(true)}
                                        className="w-full sm:w-auto text-white bg-secondary border-0 py-2 px-4 focus:outline-none hover:bg-primary rounded-md text-sm"
                                    >
                                        History
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            router.put(
                                                route("assets.update", data.id),
                                                editableData,
                                                {
                                                    onSuccess: () => {
                                                        setIsEditing(false);
                                                    },
                                                    onError: (errors) => {
                                                        console.error(errors);
                                                    },
                                                }
                                            );
                                        }}
                                        className="w-full sm:w-auto text-white bg-secondary border-0 py-2 px-4 focus:outline-none hover:bg-primary rounded-md text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditableData(data);
                                            setIsEditing(false);
                                        }}
                                        className="w-full sm:w-auto text-gray-700 bg-gray-200 border-0 py-2 px-4 focus:outline-none hover:bg-gray-300 rounded-md text-sm"
                                    >
                                        Back
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* History View */}
                {isHistoryOpen && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Asset Maintenance History
                        </h3>
                        {loadingHistory ? (
                            <p className="text-center text-gray-500">
                                Loading history...
                            </p>
                        ) : history.length === 0 ? (
                            <p className="text-center text-gray-500">
                                No maintenance history available.
                            </p>
                        ) : (
                            <div className="space-y-3 text-sm text-gray-700">
                                {history.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border p-4 rounded-md bg-gray-50"
                                    >
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            {item.status}
                                        </p>
                                        <p>
                                            <strong>Downtime Reason:</strong>{" "}
                                            {item.downtime_reason}
                                        </p>
                                        <p>
                                            <strong>Failed at:</strong>{" "}
                                            {formatDate(item.failed_at)}
                                        </p>
                                        <p>
                                            <strong>Maintained at:</strong>{" "}
                                            {item.maintained_at ? formatDate(item.maintained_at) : 'Not (yet) maintained'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="text-white bg-secondary border-0 py-2 px-6 focus:outline-none hover:bg-primary rounded-md text-sm"
                            >
                                Back to Details
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAssetModal;
