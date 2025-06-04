import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcnui/dialog";
import { Label } from "@/Components/shadcnui/label";
import { Switch } from "@/Components/shadcnui/switch";
import { Button } from "@/Components/shadcnui/button";
import { Input } from "@/Components/shadcnui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/shadcnui/select";
import { AssetWithMaintenanceSchedule } from "../PreventiveMaintenance";
import { X } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@/Components/shadcnui/table"
import { router } from "@inertiajs/react";
import { toast } from "sonner"; // hmm

interface Location {
    id: number;
    name: string;
}

interface EditPMScheduleModalProps {
    schedule: AssetWithMaintenanceSchedule;
    locations: Location[];
    onClose: () => void;
}

const EditPMScheduleModal: React.FC<EditPMScheduleModalProps> = ({ schedule, onClose }) => {
    const [isActive, setIsActive] = useState(schedule.maintenance_schedule?.is_active || false);
    const [scheduleType, setScheduleType] = useState<"Weekly" | "Monthly" | "Yearly">(() => {
        if (!schedule.maintenance_schedule) return "Weekly";
        switch (schedule.maintenance_schedule.interval_unit) {
            case "weeks": return "Weekly";
            case "monthly": return "Monthly";
            case "yearly": return "Yearly";
            default: return "Weekly";
        }
    });
    const [weeklyFrequency, setWeeklyFrequency] = useState(schedule.maintenance_schedule?.interval_value || 1);
    const [monthlyFrequency, setMonthlyFrequency] = useState(schedule.maintenance_schedule?.month_week || 1);
    const [monthlyDay, setMonthlyDay] = useState<string>(() => {
        if (!schedule.maintenance_schedule?.month_weekday) return "Monday";
        return schedule.maintenance_schedule.month_weekday.charAt(0).toUpperCase() + 
               schedule.maintenance_schedule.month_weekday.slice(1);
    });
    const [yearlyMonth, setYearlyMonth] = useState(() => {
        if (!schedule.maintenance_schedule?.year_month) return "January";
        return new Date(2000, schedule.maintenance_schedule.year_month - 1).toLocaleString('default', { month: 'long' });
    });
    const [yearlyDay, setYearlyDay] = useState(schedule.maintenance_schedule?.year_day || 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("is_active", isActive.toString());
            formData.append("schedule", scheduleType);

            switch (scheduleType) {
                case "Weekly":
                    formData.append("weeklyFrequency", weeklyFrequency.toString());
                    break;
                case "Monthly":
                    formData.append("monthlyFrequency", monthlyFrequency.toString());
                    formData.append("monthlyDay", monthlyDay);
                    break;
                case "Yearly":
                    formData.append("yearlyMonth", yearlyMonth);
                    formData.append("yearlyDay", yearlyDay.toString());
                    break;
            }
            // For Debugging
            console.log("=== Form Data ===:");
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            router.post(route("work-orders.preventive-maintenance.update-schedule", schedule.id), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    toast.error("Failed to update maintenance schedule"); // Hmm
                    console.error(errors);
                }
            });
        } catch (error) {
            toast.error("An error occurred while updating the schedule"); // Hmm
            console.error(error);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            <span>Edit Preventive Maintenance Schedule for Asset</span>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {schedule.id}</span>
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

                <div className="px-6 py-2 max-h-[65vh] overflow-y-auto">
                    {/* Asset Details Section */}
                    <Table className="w-full rounded-md text-xs xs:text-sm">
                        <TableBody>
                            {/* Asset Name */}
                            <TableRow className="border-none">
                                <TableHead className="w-1/4">
                                    <Label>Asset Name:</Label>
                                </TableHead>
                                <TableCell>{schedule.name}</TableCell>
                            </TableRow>

                            {/* Specification */}
                            <TableRow className="border-none">
                                <TableHead>
                                    <Label>Specification:</Label>
                                </TableHead>
                                <TableCell>{schedule.specification_details}</TableCell>
                            </TableRow>

                            {/* Location */}
                            <TableRow className="border-none">
                                <TableHead>
                                    <Label>Location:</Label>
                                </TableHead>
                                <TableCell>{schedule.location.name}</TableCell>
                            </TableRow>

                            {/* Status */}
                            <TableRow className="border-none">
                                <TableHead>
                                    <Label>Status:</Label>
                                </TableHead>
                                <TableCell>{schedule.status}</TableCell>
                            </TableRow>

                            {/* Last Maintained */}
                            <TableRow className="border-none">
                                <TableHead>
                                    <Label>Last Maintained:</Label>
                                </TableHead>
                                <TableCell>{schedule.last_maintained_at || "Never"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <hr className="my-4" />

                    {/* Schedule Settings */}
                    <div className="space-y-6">
                        {/* Toggle Active Status */}
                        <div className="flex flex-row gap-2 items-center">
                            <Switch
                                checked={isActive}
                                onCheckedChange={setIsActive}
                            />
                            <Label className="flex items-center text-sm font-medium text-gray-700">Toggle Active Status</Label>
                        </div>

                        {/* Schedule Type Selection */}
                        <div className="space-y-2">
                            <Label className="flex items-center">Set Schedule <span className="text-red-500 ml-1">*</span></Label>
                            <div className="flex flex-row w-full sm:w-auto overflow-hidden">
                                {["Weekly", "Monthly", "Yearly"].map((type) => (
                                    <Button
                                        key={type}
                                        type="button"
                                        variant={"outline"}
                                        className={`flex-1 ${scheduleType === type ? "bg-secondary text-white hover:bg-secondary/90 hover:text-white" : ""}`}
                                        onClick={() => setScheduleType(type as "Weekly" | "Monthly" | "Yearly")}
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>

                            {/* Schedule-specific fields */}
                            {scheduleType === "Weekly" && (
                                <div className="flex items-center gap-2 !mt-4">
                                    <span>Every</span>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="3"
                                        required
                                        className="w-16"
                                        value={weeklyFrequency}
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

                            {scheduleType === "Monthly" && (
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

                            {scheduleType === "Yearly" && (
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
                                        max="31"
                                        className="w-20"
                                        value={yearlyDay}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "") {
                                                setYearlyDay(1);
                                                return;
                                            }
                                            const num = Number(value);
                                            if (!isNaN(num)) {
                                                if (num < 1) {
                                                    setYearlyDay(1);
                                                } else if (num > 31) {
                                                    setYearlyDay(31);
                                                } else {
                                                    setYearlyDay(num);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                <DialogFooter className="px-6 py-4 border-t">
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                    </Button>
                    <Button onClick={(e) => {
                        handleSubmit(e);
                    }}>
                        Save
                    </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPMScheduleModal; 