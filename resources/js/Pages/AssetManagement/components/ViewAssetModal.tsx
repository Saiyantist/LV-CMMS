import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { format, parseISO, set } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, History, X } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/shadcnui/dialog";
import { Label } from "@/Components/shadcnui/label";
import { Input } from "@/Components/shadcnui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/shadcnui/select";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/Components/shadcnui/table";
import { Calendar } from "@/Components/shadcnui/calendar";
import { Switch } from "@/Components/shadcnui/switch";

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
    asset: {
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
        maintenance_schedule?: {
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
    };
    // maintenancePersonnel: {
    //     id: number;
    //     first_name: string;
    //     last_name: string;
    //     roles: { id: number; name: string };
    // }[];
    onClose: () => void;
    locations: {
        id: number;
        name: string;
    }[];
}

const ViewAssetModal: React.FC<ViewAssetModalProps> = ({
    asset,
    // maintenancePersonnel,   
    onClose,
    locations,
}) => {
    const user = usePage().props.auth.user;
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({ ...asset });
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isPreventiveMaintenance, setIsPreventiveMaintenance] = useState(!!asset.maintenance_schedule);
    const [isActive, setIsActive] = useState(asset.maintenance_schedule?.is_active || false);

    // Initialize schedule state based on existing maintenance schedule
    const [schedule, setSchedule] = useState<"Weekly" | "Monthly" | "Yearly">(() => {
        if (!asset.maintenance_schedule) return "Weekly";
        const unit = asset.maintenance_schedule.interval_unit;
        if (unit === 'weeks') return "Weekly";
        if (unit === 'monthly') return "Monthly";
        if (unit === 'yearly') return "Yearly";
        return "Weekly";
    });

    // Initialize frequency states based on existing maintenance schedule
    const [weeklyFrequency, setWeeklyFrequency] = useState<number>(() => 
        asset.maintenance_schedule?.interval_value || 1
    );
    const [monthlyFrequency, setMonthlyFrequency] = useState<number>(() => 
        asset.maintenance_schedule?.month_week || 1
    );
    const [monthlyDay, setMonthlyDay] = useState<string>(() => {
        if (!asset.maintenance_schedule?.month_weekday) return "Monday";
        return asset.maintenance_schedule.month_weekday.charAt(0).toUpperCase() + 
               asset.maintenance_schedule.month_weekday.slice(1);
    });
    const [yearlyMonth, setYearlyMonth] = useState<string>(() => {
        if (!asset.maintenance_schedule?.year_month) return "January";
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[asset.maintenance_schedule.year_month - 1];
    });
    const [yearlyDay, setYearlyDay] = useState<number | "">(() => 
        asset.maintenance_schedule?.year_day || 1
    );

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
            setTimeout(() => {
            axios
                .get(`/asset-maintenance-history/${asset.id}`)
                .then((res) => {
                    setHistory(res.data);
                })
                .catch((err) => {
                    console.error("Failed to fetch history", err);
                    setHistory([]);
                    })
                    .finally(() => setLoadingHistory(false));
            }, 100);
        }
    }, [isHistoryOpen, asset.id]);

    // Helper function to format maintenance schedule
    const formatMaintenanceSchedule = (schedule: typeof asset.maintenance_schedule) => {
        if (!schedule) return 'No schedule';
        
        const { interval_unit, interval_value, month_week, month_weekday, year_month, year_day } = schedule;
        
        if (interval_unit === 'weeks' && interval_value) {
            return `Every ${interval_value} week${interval_value > 1 ? 's' : ''}`;
        }
        
        if (interval_unit === 'monthly' && month_week && month_weekday) {
            return `Every ${getOrdinalSuffix(month_week)} ${month_weekday.charAt(0).toUpperCase() + month_weekday.slice(1)} of the month`;
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

    const { data, setData, post, errors } = useForm({
        name: editableData.name,
        specification_details: editableData.specification_details,
        location_id: editableData.location.id.toString(),
        date_acquired: editableData.date_acquired,
        status: editableData.status,
        schedule: asset.maintenance_schedule?.interval_unit || "",
        frequency: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("huwag", "1");
        formData.append("id", asset.id.toString());
        formData.append("name", data.name);
        formData.append("specification_details", data.specification_details);
        formData.append("location_id", data.location_id);
        formData.append("date_acquired", data.date_acquired);
        formData.append("status", "Functional");
        
        if (isPreventiveMaintenance) {
            formData.append("has_preventive_maintenance", "1");
            formData.append("is_active",
                asset.maintenance_schedule ? isActive.toString() : "null"
            );
            formData.append("schedule", schedule);
            switch (schedule) {
                case "Weekly":
                    formData.append("weeklyFrequency", weeklyFrequency.toString());
                    break;
        
                case "Monthly":
                    formData.append("monthlyFrequency", monthlyFrequency.toString());
                    formData.append("monthlyDay", monthlyDay); // e.g., "Tuesday"
                    break;
        
                case "Yearly":
                    formData.append("yearlyMonth", yearlyMonth); // e.g., "March"
                    formData.append("yearlyDay", yearlyDay.toString()); // e.g., "15"
                    break;
            }
        }

        router.post("/assets", formData, {
            forceFormData: true,
        });
        setTimeout(() => {
            setIsEditing(false);
        }, 1000);
    };

    const getDaysInMonth = (month: string, year: number): number => {
        const months: { [key: string]: number } = {
            "January": 0, "February": 1, "March": 2, "April": 3,
            "May": 4, "June": 5, "July": 6, "August": 7,
            "September": 8, "October": 9, "November": 10, "December": 11
        };
        
        // Check if it's a leap year for February
        const isLeapYear = (year: number) => {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        };
        
        const monthIndex = months[month];
        if (monthIndex === undefined) return 31; // Default to 31 if month is invalid
        
        if (monthIndex === 1) { // February
            return isLeapYear(year) ? 29 : 28;
        }
        
        // Months with 30 days: April, June, September, November
        const monthsWith30Days = [3, 5, 8, 10];
        return monthsWith30Days.includes(monthIndex) ? 30 : 31;
    };

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            {isEditing ? [
                                <span>Editing Asset Details</span>
                            ] : [
                                <span>Asset Details</span>
                            ]}
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {asset.id}</span>
                        </div>
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-3 border rounded-full h-6 w-6"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                {!isHistoryOpen ? (
                    <div className="px-6 py-2 max-h-[65vh] overflow-y-auto">
                        <div className="px-2 -mt-2 space-y-4">
                            {/* Asset Name and Specification */}
                            <div className="grid grid-cols-1 gap-4 ">
                                {/* Asset Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center">
                                        Asset Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="name"
                                            value={editableData.name}
                                            onChange={(e) => setEditableData({
                                                ...editableData,
                                                name: e.target.value
                                            })}
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground !mt-4">{editableData.name}</p>
                                    )}
                                </div>

                                {/* Specification */}
                                <div className="space-y-2">
                                    <Label htmlFor="specification" className="flex items-center">
                                        Specification
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="specifipcation"
                                            value={editableData.specification_details}
                                            onChange={(e) => setEditableData({
                                                ...editableData,
                                                specification_details: e.target.value
                                            })}
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground !mt-4">{editableData.specification_details}</p>
                                    )}
                                </div>
                            </div>
                            <hr className="!my-4"/>
                            {/* Location, Condition, and Date Acquired */}
                            <div className="flex flex-col xs:flex-row gap-2 !my-6">
                                {/* Location */}
                                <div className="space-y-2 flex flex-row flex-[1] xs:flex-col">
                                    <Label htmlFor="location" className="flex flex-[1] items-center">
                                        Location
                                    </Label>
                                    {isEditing ? (
                                        <div className="!mt-3">
                                            <Select
                                                value={editableData.location.id.toString()}
                                                onValueChange={(value) => {
                                                    const selectedLocation = locations.find(loc => loc.id.toString() === value);
                                                    if (selectedLocation) {
                                                        setEditableData({
                                                            ...editableData,
                                                            location: {
                                                                id: selectedLocation.id,
                                                                name: selectedLocation.name
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations.map((loc) => (
                                                        <SelectItem key={loc.id} value={loc.id.toString()}>
                                                            {loc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <div className="!mb-2 flex flex-[2]">
                                            <p className="text-sm text-muted-foreground">{editableData.location.name}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Condition */}
                                <div className="space-y-2 flex flex-row flex-[1] xs:flex-col">
                                    <Label htmlFor="condition" className="flex flex-[1] items-center">
                                        Condition
                                    </Label>
                                    {isEditing ? (
                                    <div className="!mt-3">
                                        <Select
                                            value={editableData.status}
                                            onValueChange={(value) => setEditableData({
                                                ...editableData,
                                                status: value
                                            })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Functional">Functional</SelectItem>
                                                <SelectItem value="Failed">Failed</SelectItem>
                                                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                                                <SelectItem value="End of Useful Life">End of Useful Life</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    ) : (
                                        <div className="!mb-2 flex flex-[2]">
                                            <p>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                                                        editableData.status
                                                    )}`}
                                                >
                                                    {editableData.status}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Date Acquired */}
                                <div className="space-y-2 flex flex-row flex-[1] xs:flex-col">
                                    <Label htmlFor="date_acquired" className="flex flex-[1] items-center">
                                        Date Acquired
                                    </Label>
                                    {isEditing ? (
                                        <div className="!mt-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowCalendar(!showCalendar)}
                                                className={cn(
                                                    "w-full flex justify-between items-center",
                                                    "text-left font-normal",
                                                    !editableData.date_acquired && "text-muted-foreground"
                                                )}
                                            >
                                                {editableData.date_acquired
                                                    ? format(parseISO(editableData.date_acquired), "MM/dd/yyyy")
                                                    : "MM/DD/YYYY"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                            {showCalendar && (
                                                <div className="absolute z-50 bg-white shadow-md border mt-2 rounded-md">
                                                    <Calendar
                                                        mode="single"
                                                        selected={editableData.date_acquired ? parseISO(editableData.date_acquired) : undefined}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                setEditableData({
                                                                    ...editableData,
                                                                    date_acquired: format(date, "yyyy-MM-dd")
                                                                });
                                                                setShowCalendar(false);
                                                            }
                                                        }}
                                                        initialFocus
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                    <div className="!mb-2 flex flex-[2]">
                                        <p className="text-sm text-muted-foreground">
                                            {editableData.date_acquired ? format(parseISO(editableData.date_acquired), "MM/dd/yyyy") : "Not set"}
                                        </p>
                                    </div>
                                    )}
                                </div>
                            </div>

                            {(asset.maintenance_schedule || isEditing) && (
                                <hr />
                            )}
                            
                            {/* Preventive Maintenance Section - Only show when not editing */}
                            {!isEditing && asset.maintenance_schedule && (
                                <div className="space-y-4 mt-6">
                                    <div className="flex items-center bg-secondary p-2 text-white">
                                        <Label className="text-lg font-semibold">
                                            Preventive Maintenance Schedule
                                        </Label>
                                    </div>
                                    <div className="bg-muted/10 px-4 rounded-lg">
                                        <Table>
                                            <TableRow className="border-none">
                                                <TableHead>Status</TableHead>
                                                <TableCell>
                                                    <span className={cn("px-2 py-1 rounded text-sm",
                                                        asset.maintenance_schedule?.is_active 
                                                            ? "bg-green-100 text-green-700" 
                                                            : "bg-red-100 text-red-700"
                                                    )}>
                                                        {asset.maintenance_schedule?.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="border-none">
                                                <TableHead>Schedule</TableHead>
                                                <TableCell>
                                                    {formatMaintenanceSchedule(asset.maintenance_schedule)}
                                                </TableCell>
                                            </TableRow>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {/* Preventive Maintenance Edit Section */}
                            {isEditing && (
                                <>  
                                    {/* Preventive Maintenance Toggle */}
                                    {!asset.maintenance_schedule && (
                                        <div className="flex items-center !mt-8">
                                            <label
                                                className={`relative inline-flex items-center cursor-pointer ${
                                                    isPreventiveMaintenance ? "text-primary" : ""
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={isPreventiveMaintenance}
                                                    onChange={() =>
                                                        setIsPreventiveMaintenance(!isPreventiveMaintenance)
                                                    }
                                                />
                                                <span
                                                    className={`w-11 h-6 bg-gray-200 rounded-full inline-flex items-center p-1 transition-colors duration-200 ease-in-out ${
                                                        isPreventiveMaintenance
                                                            ? "bg-secondary"
                                                            : ""
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-200 ease-in-out ${
                                                            isPreventiveMaintenance
                                                                ? "translate-x-5"
                                                                : "translate-x-0"
                                                        }`}
                                                    />
                                                </span>
                                            </label>
                                            <label className="ml-2 text-sm font-medium text-gray-700">
                                                Set Preventive Maintenance Schedule
                                            </label>
                                        </div>
                                        
                                    )}

                                    {/* Preventive Maintenance Fields */}
                                    {isPreventiveMaintenance && (
                                        <>
                                            {asset.maintenance_schedule && (
                                                <div className="flex flex-row gap-2 items-center text-sm">
                                                    <Switch
                                                        checked={isActive}
                                                        onCheckedChange={setIsActive}
                                                    />
                                                    <Label className="flex items-center text-sm font-medium text-gray-700">Toggle Active Status</Label>
                                                </div>
                                            )}
                                            <div className="flex flex-row w-full gap-4">
                                                {/* Schedule */}
                                                <div className="flex-[1] space-y-2 text-sm">
                                                    <Label className="flex items-center">Set Schedule <span className="text-red-500 ml-1">*</span></Label>
                                                    <div className="flex flex-row w-full sm:w-auto overflow-hidden">
                                                        {["Weekly", "Monthly", "Yearly"].map((type) => (
                                                            <Button
                                                                key={type}
                                                                type="button"
                                                                variant={"outline"}
                                                                className={`flex-1 ${schedule === type ? "bg-secondary text-white hover:bg-secondary/90 hover:text-white" : ""}`}
                                                                onClick={() => setSchedule(type as "Weekly" | "Monthly" | "Yearly")}
                                                            >
                                                                {type}
                                                            </Button>
                                                        ))}
                                                    </div>
                
                                                    {/* Schedule-specific fields */}
                                                    {schedule === "Weekly" && (
                                                        <div className="flex items-center gap-2 !mt-4">
                                                            <span>Every</span>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max="3"
                                                                required
                                                                className="w-16"
                                                                value={weeklyFrequency || "1"}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === "") {
                                                                        setWeeklyFrequency(0);
                                                                    } else {
                                                                        const numberValue = Number(value);
                                                                        if (numberValue >= 1 && numberValue <= 99) {
                                                                            setWeeklyFrequency(numberValue);
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <span>Week(s)</span>
                                                        </div>
                                                    )}
                
                                                    {schedule === "Monthly" && (
                                                        <div className="flex items-center gap-2 !mt-4 flex-wrap">
                                                            <span>On the</span>
                                                            <Select
                                                                value={monthlyFrequency.toString()}
                                                                onValueChange={(value) => setMonthlyFrequency(Number(value))}
                                                            >
                                                                <SelectTrigger className="w-20">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[1, 2, 3, 4].map((week) => (
                                                                        <SelectItem key={week} value={week.toString()}>
                                                                            {week}
                                                                            {week === 1 ? "st" : week === 2 ? "nd" : week === 3 ? "rd" : "th"}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                
                                                            <span>Of</span>
                
                                                            <Select
                                                                value={monthlyDay}
                                                                onValueChange={setMonthlyDay}
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                                                                        <SelectItem key={day} value={day}>
                                                                            {day}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}
                
                                                    {schedule === "Yearly" && (
                                                        <div className="flex items-center gap-2 !mt-4 flex-wrap">
                                                            <span>Every</span>
                                                            <Select
                                                                value={yearlyMonth}
                                                                onValueChange={setYearlyMonth}
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[
                                                                        "January", "February", "March", "April", "May", "June",
                                                                        "July", "August", "September", "October", "November", "December"
                                                                    ].map((month) => (
                                                                        <SelectItem key={month} value={month}>
                                                                            {month}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <span>on day</span>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max={getDaysInMonth(yearlyMonth, new Date().getFullYear())}
                                                                className="w-20"
                                                                value={yearlyDay}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === "") {
                                                                        setYearlyDay("");
                                                                        return;
                                                                    }
                                                                    const num = Number(value);
                                                                    if (!isNaN(num)) {
                                                                        if (num < 1) {
                                                                            setYearlyDay(1);
                                                                        } else if (num > getDaysInMonth(yearlyMonth, new Date().getFullYear())) {
                                                                            setYearlyDay(getDaysInMonth(yearlyMonth, new Date().getFullYear()));
                                                                        } else {
                                                                            setYearlyDay(num);
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                
                                                {/* Assign to */}
                                                {/* <div className="flex-[1] space-y-2">
                                                    <Label htmlFor="assigned_to" className="flex items-center">
                                                        Assign to <span className="text-red-500 ml-1">*</span>
                                                    </Label>
                                                    <Select
                                                        value={data.assigned_to.toString() || ""}
                                                        onValueChange={(value) => {
                                                            const person = maintenancePersonnel.find(p => p.id.toString() === value);
                                                            if (person) {
                                                                setData("assigned_to", person.id.toString());
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Personnel" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {maintenancePersonnel.map((person) => (
                                                                <SelectItem key={person.id} value={person.id.toString()}>
                                                                    {person.first_name} {person.last_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div> */}
                                            </div>
                                        </>
                                    )}            
                                </>
                            )}

                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-2 max-h-[65vh] overflow-y-auto">
                        <h3 className="text-lg mb-4 text-center">
                            Asset Maintenance History
                        </h3>
                        {loadingHistory ? (
                            <p className="text-center text-muted-foreground">
                                Loading history...
                            </p>
                        ) : history.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                No maintenance history available.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {history.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border p-4 rounded-md bg-muted"
                                    >
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="space-y-2">
                                                <Label>Status</Label>
                                                <p>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${getStatusColor(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Downtime Reason</Label>
                                                <p className="text-muted-foreground">{item.downtime_reason}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Failed at</Label>
                                                <p className="text-muted-foreground">{formatDate(item.failed_at)}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Maintained at</Label>
                                                {item.maintained_at ? (
                                                    <p className="text-muted-foreground">
                                                        {formatDate(item.maintained_at)}
                                                    </p>
                                                )   : (
                                                    <p className="text-muted-foreground italic">
                                                        Not yet maintained
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="px-6 py-4 border-t">
                        {isHistoryOpen ? (
                            <Button
                                variant="outline"
                                className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                                onClick={() => setIsHistoryOpen(false)}
                            >
                                Back to Details
                            </Button>
                        ) : isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditableData(asset);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel Editing
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                                    onClick={(e) => {
                                        router.put(
                                            route("assets.update", asset.id), editableData, {onSuccess: () => {setIsEditing(false)}}
                                        );

                                        if (isPreventiveMaintenance) {
                                            handleSubmit(e);
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsHistoryOpen(true)}
                                >
                                    <span>
                                        <History/>
                                    </span>
                                    Show History
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            </>
                        )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewAssetModal;
