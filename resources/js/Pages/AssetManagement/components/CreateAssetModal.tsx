import { useEffect, useState, useRef } from "react";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/shadcnui/dialog";
import { Label } from "@/Components/shadcnui/label";
import { Textarea } from "@/Components/shadcnui/textarea";
import { Calendar } from "@/Components/shadcnui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/shadcnui/select";
import { Input } from "@/Components/shadcnui/input";
import { Checkbox } from "@/Components/shadcnui/checkbox";
import SmartDropdown from "@/Components/SmartDropdown";

interface Location {
    id: number;
    name: string;
}

interface CreateAssetModalProps {
    locations: Location[];
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    onClose: () => void;
}

export default function CreateAssetModal({
    locations,
    maintenancePersonnel,
    onClose,
}: CreateAssetModalProps) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [isPreventiveMaintenance, setIsPreventiveMaintenance] = useState(false);
    const [schedule, setSchedule] = useState<"Weekly" | "Monthly" | "Yearly">("Weekly");
    const [weeklyFrequency, setWeeklyFrequency] = useState<number>(0);
    const [monthlyFrequency, setMonthlyFrequency] = useState<number>(1);
    const [monthlyDay, setMonthlyDay] = useState<string>("Monday");
    const [yearlyMonth, setYearlyMonth] = useState<string>("January");
    const [yearlyDay, setYearlyDay] = useState<number | "">(1);
    const [assignedTo, setAssignedTo] = useState<{ id: number; name: string } | null>(null);

    const { data, setData, post, errors } = useForm({
        name: "",
        specification_details: "",
        location_id: "",
        date_acquired: "",
        // description: "",
        schedule: "",
        frequency: "",
        assigned_to: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("specification_details", data.specification_details);``
        formData.append("location_id", data.location_id);
        formData.append("date_acquired", data.date_acquired);
        formData.append("status", "Functional");
        
        if (isPreventiveMaintenance) {
            formData.append("has_preventive_maintenance", "1");
            // formData.append("description", data.description);
            formData.append("schedule", schedule);
            formData.append("assigned_to", assignedTo?.id.toString() || "");
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
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold">
                        Add New Asset
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

                <form onSubmit={handleSubmit} className="px-6 py-2 max-h-[65vh] overflow-y-auto">
                    <div className="px-2 -mt-2 space-y-4">
                        {/* Asset Name and Specification */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center">
                                    Asset Name <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                    placeholder="Enter Asset Name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specification" className="flex items-center">
                                    Specification <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="specification"
                                    value={data.specification_details}
                                    onChange={(e) => setData("specification_details", e.target.value)}
                                    placeholder="Enter Specification"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location and Date Acquired */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location" className="flex items-center">
                                    Location <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Select
                                    value={data.location_id}
                                    onValueChange={(value) => setData("location_id", value)}
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

                            <div className="space-y-2">
                                <Label htmlFor="date_acquired" className="flex items-center">
                                    Date Acquired <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className={cn(
                                        "w-full flex justify-between items-center",
                                        "text-left font-normal",
                                        !data.date_acquired && "text-muted-foreground"
                                    )}
                                >
                                    {data.date_acquired
                                        ? format(parseISO(data.date_acquired), "MM/dd/yyyy")
                                        : "MM/DD/YYYY"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                {showCalendar && (
                                    <div className="absolute z-50 bg-white shadow-md border mt-2 rounded-md">
                                        <Calendar
                                            mode="single"
                                            selected={data.date_acquired ? parseISO(data.date_acquired) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    setData("date_acquired", format(date, "yyyy-MM-dd"));
                                                    setShowCalendar(false);
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preventive Maintenance Toggle */}
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

                        {/* Preventive Maintenance Fields */}
                        {isPreventiveMaintenance && (
                            <div className="flex flex-row w-full gap-4">

                                {/* Description */}
                                {/* <div className="space-y-2">
                                    <Label htmlFor="description" className="flex items-center">
                                        Description <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        required
                                    />
                                </div> */}

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
                                                value={weeklyFrequency || ""}
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
                                                max="31"
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

                                {/* Assign to */}
                                {/* <div className="flex-[1] space-y-2">
                                    <Label htmlFor="assigned_to" className="flex items-center">
                                        Assign to <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Select
                                        value={assignedTo?.id.toString() || ""}
                                        onValueChange={(value) => {
                                            const person = maintenancePersonnel.find(p => p.id.toString() === value);
                                            if (person) {
                                                setAssignedTo({
                                                    id: person.id,
                                                    name: `${person.first_name} ${person.last_name}`
                                                });
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
                        )}
                    </div>
                </form>

                {/* Footer - Buttons */}
                <DialogFooter className="px-6 py-4 border-t">
                    <div className="flex gap-2 xs:flex-row-reverse flex-col">
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Save Asset
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>   
    );
}