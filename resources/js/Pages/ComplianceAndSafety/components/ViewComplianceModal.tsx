import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { format, parseISO } from "date-fns";
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
import { Input } from "@/Components/shadcnui/input";
import { Textarea } from "@/Components/shadcnui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/shadcnui/select";
import { Calendar } from "@/Components/shadcnui/calendar";
import SmartDropdown from "@/Components/SmartDropdown";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@/Components/shadcnui/table";
import { getStatusColor } from "@/utils/getStatusColor";
import { getPriorityColor } from "@/utils/getPriorityColor";
import axios from "axios";

interface ViewComplianceModalProps {
    workOrder: {
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
    };
    locations: {
        id: number;
        name: string;
    }[];
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    onClose: () => void;
}

const ViewComplianceModal: React.FC<ViewComplianceModalProps> = ({
    workOrder,
    locations,
    maintenancePersonnel,
    onClose,
}) => {
    const user = usePage().props.auth.user;
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({ ...workOrder });
    const [showCalendar, setShowCalendar] = useState(false);
    const [typedLocation, setTypedLocation] = useState(workOrder.location.name.toString());
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const [deletedAttachments, setDeletedAttachments] = useState<number[]>([]);

    const handleChange = (field: string, value: any) => {
        setEditableData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDeleteAttachment = async (attachmentId: number) => {
        try {
            await axios.delete(route('attachments.destroy', attachmentId));
            setDeletedAttachments(prev => [...prev, attachmentId]);
            setEditableData(prev => ({
                ...prev,
                attachments: prev.attachments.filter(att => att.id !== attachmentId)
            }));
        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
    };

    const { data, setData, post, errors } = useForm({
        compliance_area: editableData.compliance_area,
        location_id: editableData.location.id.toString(),
        report_description: editableData.report_description,
        remarks: editableData.remarks,
        scheduled_at: editableData.scheduled_at,
        priority: editableData.priority,
        assigned_to: editableData.assigned_to?.id?.toString() || "",
        deleted_attachments: deletedAttachments
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!editableData.compliance_area.trim())
            newErrors["compliance_area"] = "Compliance area is required.";
        if (!editableData.report_description.trim())
            newErrors["report_description"] = "Description is required.";
        if (!editableData.scheduled_at)
            newErrors["scheduled_at"] = "Target date is required.";
        if (!editableData.priority)
            newErrors["priority"] = "Priority is required.";
        if (!editableData.assigned_to?.id)
            newErrors["assigned_to"] = "Assigned personnel is required.";
        if (!editableData.status)
            newErrors["status"] = "Status is required.";
        if (!typedLocation.trim())
            newErrors["location_id"] = "Location is required.";

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        let locationId = editableData.location.id.toString();

        // Check the typed location against existing locations
        const existing = locations.find(
            (loc) => loc.name.toLowerCase() === typedLocation.toLowerCase()
        );

        if (existing) {
            locationId = existing.id.toString();
        } else if (existing === undefined) {
            const response = await axios.post("/locations", {
                name: typedLocation.trim(),
            });

            locationId = response.data.id;
        }
        
        const formData = {
            compliance_area: editableData.compliance_area,
            location_id: locationId,
            report_description: editableData.report_description,
            remarks: editableData.remarks,
            scheduled_at: editableData.scheduled_at,
            priority: editableData.priority,
            assigned_to: editableData.assigned_to?.id?.toString() || "",
            status: editableData.status
        };

        router.put(
            route("work-orders.compliance-and-safety.update", workOrder.id),
            formData,
            {
                onSuccess: () => {
                    setIsEditing(false);
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl sm:max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            {isEditing ? (
                                <span>Editing Compliance and Safety</span>
                            ) : (
                                <span>Compliance and Safety</span>
                            )}
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {workOrder.id}</span>
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

                <div className="px-4 py-1 max-h-[45vh] sm:max-h-[65vh] overflow-y-auto">
                    {isEditing ? (
                        // Editing Section
                        <form onSubmit={handleSubmit}>
                            <div className="p-2 -mt-2 space-y-4">

                                <div className="flex flex-row gap-4">
                                    {/* Compliance Area */}
                                    <div className="flex-[2] space-y-2">
                                        <Label htmlFor="compliance_area" className="flex items-center">
                                            Compliance Area <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={editableData.compliance_area}
                                            onValueChange={(value) => handleChange("compliance_area", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Compliance Area" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Fire Safety Compliance">Fire Safety Compliance</SelectItem>
                                                <SelectItem value="Plumbing and Sanitation">Plumbing and Sanitation</SelectItem>
                                                <SelectItem value="Structural Safety">Structural Safety</SelectItem>
                                                <SelectItem value="Occupational Safety and Health">Occupational Safety and Health</SelectItem>
                                                <SelectItem value="Accessibility Compliance">Accessibility Compliance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {localErrors.compliance_area && (
                                            <p className="text-red-500 text-xs">{localErrors.compliance_area}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="flex-[1] space-y-2">
                                        <Label htmlFor="status" className="flex items-center">
                                            Status <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={editableData.status}
                                            onValueChange={(value) => handleChange("status", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {workOrder.status === "Pending" && (
                                                    <>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="Assigned">Assigned</SelectItem>
                                                        <SelectItem value="For Budget Request">For Budget Request</SelectItem>
                                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                    </>
                                                )}
                                                {workOrder.status === "Assigned" && (
                                                    <>
                                                        <SelectItem value="Assigned">Assigned</SelectItem>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="For Budget Request">For Budget Request</SelectItem>
                                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                    </>
                                                )}
                                                {workOrder.status === "Scheduled" && (
                                                    <>
                                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                    </>
                                                )}
                                                {workOrder.status === "Ongoing" && (
                                                    <>
                                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                        <SelectItem value="Assigned">Assigned</SelectItem>
                                                        <SelectItem value="Overdue">Overdue</SelectItem>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                    </>
                                                )}
                                                {workOrder.status === "Overdue" && (
                                                    <>
                                                        <SelectItem value="Overdue">Overdue</SelectItem>
                                                        <SelectItem value="For Budget Request">For Budget Request</SelectItem>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                    </>
                                                )}
                                                {workOrder.status === "Completed" && (
                                                    <>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                    </>
                                                )}
                                                {workOrder.status === "Cancelled" && (
                                                    <>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                        <SelectItem value="Assigned">Assigned</SelectItem>
                                                        <SelectItem value="For Budget Request">For Budget Request</SelectItem>
                                                    </>
                                                )}
                                                {workOrder.status === "Declined" && (
                                                    <>
                                                        <SelectItem value="Declined">Declined</SelectItem>
                                                        <SelectItem value="Assigned">Assigned</SelectItem>
                                                        <SelectItem value="For Budget Request">For Budget Request</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {localErrors.status && (
                                            <p className="text-red-500 text-xs">{localErrors.status}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <SmartDropdown
                                    label="Location"
                                    required={true}
                                    placeholder={editableData.location.name}
                                    items={locations}
                                    getLabel={(loc) => loc.name}
                                    getValue={(loc) => loc.id.toString()}
                                    selectedId={editableData.location.id.toString()}
                                    onChange={(id) => {
                                        const selectedLocation = locations.find(
                                            (loc) => loc.id.toString() === id
                                        );
                                        setTypedLocation(selectedLocation?.name || ""); // Show readable name in input
                                        setData("location_id", id); // Submit actual ID
                                    }}
                                    onTextChange={(text) => setTypedLocation(text)}
                                    error={localErrors.location_id}
                                />

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="flex items-center">
                                        Description <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={editableData.report_description}
                                        onChange={(e) => handleChange("report_description", e.target.value)}
                                        placeholder="Describe the compliance issue..."
                                        required
                                    />
                                    {localErrors.report_description && (
                                        <p className="text-red-500 text-xs">{localErrors.report_description}</p>
                                    )}
                                </div>

                                {/* Safety Protocols */}
                                <div className="space-y-2">
                                    <Label htmlFor="remarks">Safety Protocols</Label>
                                    <Textarea
                                        id="remarks"
                                        value={editableData.remarks}
                                        onChange={(e) => handleChange("remarks", e.target.value)}
                                        placeholder="Enter safety protocols and procedures..."
                                    />
                                </div>

                                <div className="flex flex-row justify-between gap-4">
                                    {/* Target Date */}
                                    <div className="relative flex-[1] space-y-2">
                                        <Label htmlFor="scheduled_at" className="flex items-center">
                                            Target Date <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowCalendar(!showCalendar)}
                                            className={cn(
                                                "w-full flex justify-between items-center",
                                                "text-left font-normal",
                                                !editableData.scheduled_at && "text-muted-foreground"
                                            )}
                                        >
                                            {editableData.scheduled_at
                                                ? format(parseISO(editableData.scheduled_at), "MM/dd/yyyy")
                                                : "MM/DD/YYYY"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        {showCalendar && (
                                            <div className="absolute z-50 !-mt-[20.5rem] bg-white shadow-md border rounded-md">
                                                <Calendar
                                                    mode="single"
                                                    selected={editableData.scheduled_at ? parseISO(editableData.scheduled_at) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            handleChange("scheduled_at", format(date, "yyyy-MM-dd"));
                                                            setShowCalendar(false);
                                                        }
                                                    }}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                />
                                            </div>
                                        )}
                                        {localErrors.scheduled_at && (
                                            <p className="text-red-500 text-xs">{localErrors.scheduled_at}</p>
                                        )}
                                    </div>

                                    {/* Priority */}
                                    <div className="flex-[1] space-y-2">
                                        <Label htmlFor="priority" className="flex items-center">
                                            Priority <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={editableData.priority}
                                            onValueChange={(value) => handleChange("priority", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {localErrors.priority && (
                                            <p className="text-red-500 text-xs">{localErrors.priority}</p>
                                        )}
                                    </div>

                                    {/* Assigned To */}
                                    <div className="flex-[2] space-y-2">
                                        <Label htmlFor="assigned_to" className="flex items-center">
                                            Assign to <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={editableData.assigned_to?.id?.toString()}
                                            onValueChange={(value) => {
                                                const selectedPerson = maintenancePersonnel.find(
                                                    (person) => person.id.toString() === value
                                                );
                                                if (selectedPerson) {
                                                    handleChange("assigned_to", {
                                                        id: selectedPerson.id,
                                                        first_name: selectedPerson.first_name,
                                                        last_name: selectedPerson.last_name,
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
                                        {localErrors.assigned_to && (
                                            <p className="text-red-500 text-xs">{localErrors.assigned_to}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Attachments in Edit Mode */}
                                <div className="space-y-2">
                                    <Label>Attachments</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {editableData.attachments && editableData.attachments.length > 0 ? (
                                            editableData.attachments.map((attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {attachment.path.split('/').pop()}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                PDF Document
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <a
                                                            href={`/storage/${attachment.path}`}
                                                            download
                                                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteAttachment(attachment.id)}
                                                            className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                                        >
                                                            <X className="h-5 w-5 text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic">No attachments</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        // Viewing Section
                        <div className="space-y-4">
                            <Table className="w-full rounded-md text-xs xs:text-sm">
                                <TableBody className="flex flex-col">
                                    {/* Row 1 */}
                                    <TableRow className="border-none flex flex-col xs:flex-row xs:items-center xs:justify-between w-full">

                                        {/* Date Requested */}
                                        <div className="flex-[4] flex">
                                            <TableHead className="flex flex-[1] items-center">
                                                <Label>Date Requested:</Label>
                                            </TableHead>
                                            <TableCell className="flex flex-[2] xs:flex-[1] lg:flex-[2] items-center">
                                                {format(parseISO(editableData.requested_at), "MM/dd/yyyy")}
                                            </TableCell>
                                        </div>

                                        {/* Status */}
                                        <div className="flex-[3] flex xs:gap-8">
                                            <TableHead className="flex flex-[1] items-center">
                                                <Label>Status:</Label>
                                            </TableHead>
                                            <TableCell className="flex flex-[2] items-center">
                                                <span
                                                    className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(editableData.status)}`}
                                                >
                                                    {editableData.status}
                                                </span>
                                            </TableCell>
                                        </div>
                                    </TableRow>

                                    {/* Row 2 */}
                                    <TableRow className="border-none flex flex-col xs:flex-row xs:items-center xs:justify-between w-full">

                                        {/* Target Date */}
                                        <div className="flex-[4] flex">
                                            <TableHead className="flex flex-[1] items-center">
                                                <Label>Target Date:</Label>
                                            </TableHead>
                                            <TableCell className="flex flex-[2] xs:flex-[1] lg:flex-[2] items-center">
                                                {editableData.scheduled_at
                                                    ? format(parseISO(editableData.scheduled_at), "MM/dd/yyyy")
                                                    : "Not set"}
                                            </TableCell>
                                        </div>

                                        {/* Priority */}
                                        <div className="flex-[3] flex xs:gap-8">
                                            <TableHead className="flex flex-[1] items-center">
                                                <Label>Priority:</Label>
                                            </TableHead>
                                            <TableCell className="flex flex-[2] items-center">
                                                <div
                                                    className={`px-2 py-1 rounded bg-muted ${getPriorityColor(
                                                        editableData.priority
                                                    )}`}
                                                >
                                                    {editableData.priority}
                                                </div>
                                            </TableCell>
                                        </div>
                                    </TableRow>

                                    <hr className="my-2" />

                                    {/* Row 3 */}
                                    <TableRow className="border-none flex flex-col xs:flex-row xs:items-center xs:justify-between w-full">

                                        {/* Compliance Area */}
                                        <div className="flex-[4] flex">
                                            <TableHead className="flex flex-[1] items-center">
                                                <Label>Compliance Area:</Label>
                                            </TableHead>
                                            <TableCell className="flex flex-[2] xs:flex-[1] lg:flex-[2] items-center">
                                                {editableData.compliance_area}
                                            </TableCell>
                                        </div>

                                        {/* Location */}
                                        <div className="flex-[3] flex xs:gap-8">
                                            <TableHead className="flex flex-[1] items-center">
                                                <Label>Location:</Label>
                                            </TableHead>
                                            <TableCell className="flex flex-[2] items-center">
                                                {editableData.location.name}
                                            </TableCell>
                                        </div>
                                    </TableRow>

                                    {/* Description */}
                                    <TableRow className="border-none flex flex-row items-center justify-between w-full">
                                        <TableHead className="flex flex-[2.2] xs:flex-[1] items-center">
                                            <Label>Description:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[4.5] items-start max-h-[3.5rem] my-2 overflow-y-auto hover:overflow-y-scroll">
                                            {editableData.report_description}
                                        </TableCell>
                                    </TableRow>

                                    {/* Safety Protocols */}
                                    <TableRow className="border-none flex flex-row items-center justify-between w-full">
                                        <TableHead className="flex flex-[2.2] xs:flex-[1] items-center">
                                            <Label>Safety Protocols:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[4.5] items-start max-h-[3.5rem] my-2 overflow-y-auto hover:overflow-y-scroll">
                                            {editableData.remarks || <span className="text-gray-500 italic">No safety protocols specified</span>}
                                        </TableCell>
                                    </TableRow>

                                    {/* Assigned To */}
                                    <TableRow className="border-none flex flex-row items-center justify-between w-full">
                                        <TableHead className="flex flex-[2.2] xs:flex-[1] items-center">
                                            <Label>Assigned To:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[4.5] items-center">
                                            {editableData.assigned_to
                                                ? `${editableData.assigned_to.first_name} ${editableData.assigned_to.last_name}`
                                                : "Unassigned"}
                                        </TableCell>
                                    </TableRow>

                                    {/* Attachments */}
                                    <TableRow className="border-none flex flex-row items-start justify-between w-full">
                                        <TableHead className="flex flex-[2.2] xs:flex-[1] items-center">
                                            <Label>Attachments:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[4.5] flex-col gap-2">
                                            {editableData.attachments && editableData.attachments.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-2">
                                                    {editableData.attachments.map((attachment) => (
                                                        <a
                                                            key={attachment.id}
                                                            href={`/storage/${attachment.path}`}
                                                            download
                                                            className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {attachment.path.split('/').pop()}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    PDF Document
                                                                </p>
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic">No attachments</span>
                                            )}
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {!window.location.pathname.includes('/dashboard') ? [
                    <DialogFooter className="px-6 pt-2 pb-4 border-t">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditableData(workOrder);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                                    onClick={handleSubmit}
                                >
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </DialogFooter>
                ] : [
                    <DialogFooter></DialogFooter>
                ]}
            </DialogContent>
        </Dialog>
    );
};

export default ViewComplianceModal; 