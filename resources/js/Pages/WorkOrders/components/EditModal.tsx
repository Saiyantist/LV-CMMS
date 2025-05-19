import { useState, useEffect, useRef } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import { format, parseISO, isValid } from "date-fns"; // make sure this is imported
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { CalendarIcon, ChevronLeft, ChevronLeftSquare, ChevronRight, ChevronRightSquare, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/Components/shadcnui/table"
import { Label } from "@/Components/shadcnui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/shadcnui/select";
import { Calendar } from "@/Components/shadcnui/calendar";
import { Input } from "@/Components/shadcnui/input";


interface Location {
    id: number;
    name: string;
}

interface EditWorkOrderProps {
    workOrder: {
        id: number;
        location: { id: number; name: string };
        report_description: string;
        requested_at: string;
        requested_by: { id: number; name: string};
        asset: any;
        status: string;
        work_order_type: string;
        label: string;
        priority: string;
        scheduled_at: string;
        assigned_to: { id: number; name: string; };
        approved_at: string;
        approved_by: string;
        remarks: string;
        images: string[];
    };
    locations: Location[];
    maintenancePersonnel: { id: number; first_name: string; last_name: string; roles: {id: number; name: string;}}[];
    user: {
        id: number;
        name: string;
        permissions: string[];
    };
    onClose: () => void;
}

export default function EditWorkOrderModal({
    workOrder,
    locations,
    maintenancePersonnel,
    user,
    onClose,
}: EditWorkOrderProps) {
    const initialLocationName = locations.find((loc) =>
        loc.id === Number(workOrder.location.id))?.name || "";
    const initialLocationId = locations.find((loc) =>
        loc.id === Number(workOrder.location.id))?.id || "";

    const [typedLocation, setTypedLocation] = useState<string>(initialLocationName);
    const [newLocation, setNewLocation] = useState<string>("");
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
    const [date, setDate] = useState<Date>()
    const [showCalendar, setShowCalendar] = useState(false)
    const [showApprovalCalendar, setShowApprovalCalendar] = useState(false)
    const [approvedDate, setApprovedDate] = useState<Date>()
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({}) // NOT FINISHED
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isWorkOrderManager = user.permissions.includes("manage work orders");

    const { data, setData, errors, processing } = useForm({
        location_id: workOrder.location.id,
        report_description: workOrder.report_description,
        asset: workOrder.asset,
        images: [] as File[],
        status: workOrder.status,
        work_order_type: workOrder.work_order_type,
        label: workOrder.label,
        assigned_to: workOrder.assigned_to ?? "",
        priority: workOrder.priority,
        remarks: workOrder.remarks ?? "",
        scheduled_at: workOrder.scheduled_at ?? "",
        approved_at: workOrder.approved_at ?? "",
        approved_by: workOrder.approved_by ?? "",
    });

    const validateForm = () => {

        // fix the location and asset errors
        const newErrors: Record<string, string> = {}

        if (!typedLocation.trim()) newErrors["location_id"] = "Location is required."
        if (!data.report_description.trim()) newErrors["report_description"] = "Description is required."

        if (isWorkOrderManager) {
            if (!data.work_order_type) newErrors["work_order_type"] = "Work order type is required."
            if (!data.label) newErrors["label"] = "Label is required."
            if (!data.scheduled_at) newErrors["scheduled_at"] = "Target date is required."
            if (!data.approved_at) newErrors["approved_at"] = "Approval date is required."
            if (!data.priority) newErrors["priority"] = "Priority is required."
            if (!data.assigned_to) newErrors["assigned_to"] = "Assigned personnel is required."
            if (!data.approved_by) newErrors["approved_by"] = "Approver's name is required."
            if (!data.status) newErrors["status"] = "Status is required."
        }

        setLocalErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    /** Handle Form Submission */
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return

        let locationId;

        if (newLocation) {
            const response = await axios.post("/locations", { // Create the new location before creating the work order.
                name: newLocation.trim(),
            });
            locationId = response.data.id;
        }

        else {
            locationId = initialLocationId;
        }

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("location_id", String(locationId));
        formData.append("report_description", data.report_description);

        data.images.forEach((image) => formData.append("images[]", image));
        deletedImages.forEach((image) =>
            formData.append("deleted_images[]", image)
        );

        if (isWorkOrderManager) {
            formData.append("work_order_type", data.work_order_type || "");
            formData.append("label", data.label || "");
            if (date) formData.append("scheduled_at", format(date, "yyyy-MM-dd"))
            formData.append("assigned_to", data.assigned_to?.id?.toString() || "")
            formData.append("priority", data.priority || "");
            formData.append("status", data.status || "");
            if (approvedDate) formData.append("approved_at", format(approvedDate, "yyyy-MM-dd"))
            formData.append("approved_by", data.approved_by || "");
            formData.append("remarks", data.remarks || "");
        }

        router.post(`/work-orders/${workOrder.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
        });
        setTimeout(() => {
            onClose();
        }, 600);
    };

    /** Handle Image Previews */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData("images", files);
        }
    };

    const removeImage = (imageUrl: string) => {
        setDeletedImages((prev) => [...prev, imageUrl]);
    };

    const getAssetDetails = (workOrder: any) => {
        if (workOrder.asset) {
            return {
                id: workOrder.asset.id,
                name: workOrder.asset.name,
                location_id: workOrder.asset.location_id,
                location_name: locations.find(
                    (loc) => loc.id === workOrder.asset.location_id
                )?.name || "No Location",
            };
        }
        return null;
    };
    
    const assetDetails = getAssetDetails(workOrder);

    return (
            <Dialog
                open={true}
                onOpenChange={(isOpen) => {
                    // Only allow dialog to close if preview is not active
                    if (!activeImageIndex && !isOpen) {
                    onClose()
                    }
                }}
            >
            <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold">Work Order</DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-4 px-6 max-h-[70vh] overflow-y-auto">

                    <Table className="w-full rounded-md">
                        <TableBody>
                            <TableRow className="border-none">
                                <TableHead className="w-1/4 ">
                                    <Label>Date Requested:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.requested_at}</TableCell>
                            </TableRow>

                            <TableRow className="border-none">
                                <TableHead className="">
                                    <Label>Requested by:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.requested_by.name}</TableCell>
                            </TableRow>

                            <TableRow className="border-none">
                                <TableHead className="">
                                    <Label>Description:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.report_description}</TableCell>
                            </TableRow>

                            {/* Asset */}
                            {assetDetails && (
                            <TableRow className="border-none">
                                <TableHead>
                                <Label>Asset</Label>
                                </TableHead>
                                <TableCell>{assetDetails.name} - {assetDetails.location_name}</TableCell>
                            </TableRow>
                            )}

                            {/* Attachment/Images */}
                            <TableRow className="border-none">
                                <TableHead className="">
                                    <Label>Attachment:</Label>
                                </TableHead>
                                <TableCell className="">
                                    {workOrder.images.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {workOrder.images.map((src, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                                                onClick={() => setActiveImageIndex(index)}
                                            >
                                                <img
                                                src={src}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                />
                                            </div>
                                            ))}
                                        </div>
                                        ) : (
                                        <span className="text-gray-500 italic">No attachments</span>
                                        )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <hr />

                    {isWorkOrderManager && (
                        <form onSubmit={submit}>
                            <div className="py-2">

                                {/* Row 1 */}
                                <div className="flex flex-row justify-between gap-4 ">
                                    
                                    {/* Work Order Type */}
                                    <div className="flex-[2] space-y-2">
                                        <Label htmlFor="work_order_type" className="flex items-center">
                                            Work Order Type <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={data.work_order_type}
                                            onValueChange={(value) => setData("work_order_type", value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Work Order Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Work Order">Work Order</SelectItem>
                                                <SelectItem value="Preventive Maintenance">Preventive Maintenance</SelectItem>
                                                <SelectItem value="Compliance">Compliance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        
                                    {localErrors.work_order_type && (
                                        <p className="text-red-500 text-xs">{localErrors.work_order_type}</p>
                                    )}
                                    </div>

                                    {/* Label */}
                                    <div className="flex-[2] space-y-2">
                                        <Label htmlFor="label" className="flex items-center">
                                            Label <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={data.label}
                                            onValueChange={(value) => setData("label", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Label" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="No Label">No Label</SelectItem>
                                                <SelectItem value="HVAC">HVAC</SelectItem>
                                                <SelectItem value="Electrical">Electrical</SelectItem>
                                                <SelectItem value="Plumbing">Plumbing</SelectItem>
                                                <SelectItem value="Painting">Painting</SelectItem>
                                                <SelectItem value="Carpentry">Carpentry</SelectItem>
                                                <SelectItem value="Repairing">Repairing</SelectItem>
                                                <SelectItem value="Welding">Welding</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    {localErrors.label && (
                                        <p className="text-red-500 text-xs">{localErrors.label}</p>
                                    )}
                                    </div>

                                    {/* Target Date */}
                                    <div className="flex-[1] space-y-2">
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
                                                !data.scheduled_at && "text-muted-foreground"
                                            )}
                                        >
                                            {data.scheduled_at
                                                ? format(data.scheduled_at, "MM/dd/yyyy")
                                                : "MM/DD/YYYY"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        {showCalendar && (
                                            <div
                                                className="absolute z-50 bg-white shadow-md border !-mt-[44vh] -ml-[6.5rem] rounded-md"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                    data.scheduled_at && isValid(parseISO(data.scheduled_at))
                                                        ? parseISO(data.scheduled_at)
                                                        : undefined
                                                    }
                                                    onSelect={(date) => {
                                                    if (date) {
                                                        setData("scheduled_at", format(date, "yyyy-MM-dd"))
                                                        setDate(date)
                                                        setLocalErrors((prev) => ({ ...prev, scheduled_at: "" }))
                                                        setShowCalendar(false)
                                                    }
                                                    }}
                                                    disabled={(date) => date < new Date()} // Disable past dates
                                                    initialFocus
                                                />
                                            </div>
                                        )}
                                        {showCalendar && (
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowCalendar(false)} // Close calendar on outside click
                                            />
                                        )}
                                        {localErrors.scheduled_at && (
                                            <p className="text-red-500 text-xs">{localErrors.scheduled_at}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Row 2 */}
                                <div className="flex flex-row justify-between gap-4 !mt-4">
                                    {/* Priority */}
                                    <div className="flex-[1] space-y-2">
                                        <Label htmlFor="priority" className="flex items-center">
                                            Priority <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={data.priority}
                                            onValueChange={(value) => setData("priority", value)}
                                        >
                                            <SelectTrigger className="w-full">
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
                                            value={data.assigned_to?.id?.toString()}
                                            onValueChange={(value) => setData("assigned_to", { id: parseInt(value), name: "" })}
                                        >
                                            <SelectTrigger className="w-full">
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

                                    {/* Status */}
                                    <div className="flex-[2] space-y-2">
                                        <Label htmlFor="status" className="flex items-center">
                                            Status <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData("status", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Assigned">Assigned</SelectItem>
                                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                <SelectItem value="Overdue">Overdue</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="For Budget Request">For Budget Request</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                <SelectItem value="Declined">Declined</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    {localErrors.status && (
                                        <p className="text-red-500 text-xs">{localErrors.status}</p>
                                    )}
                                    </div>
                                    
                                </div>

                                {/* Only SHOW this row if the work order status is "FOR BUDGET REQUEST" */}

                                {/* Row 3 */}
                                <div className="flex flex-row justify-between gap-4 !mt-4">
                                    {/* Approval Date */}
                                    <div className="flex-[1] space-y-2">
                                        <Label htmlFor="approved_at" className="flex items-center">
                                            Approval Date <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowApprovalCalendar(!showApprovalCalendar)}
                                            className={cn(
                                            "w-full flex justify-between items-center",
                                            "text-left font-normal",
                                            !data.approved_at && "text-muted-foreground"
                                            )}
                                        >
                                            {data.approved_at
                                            ? format(data.approved_at, "MM/dd/yyyy")
                                            : "MM/DD/YYYY"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>

                                        {showApprovalCalendar && (
                                            <div
                                            className="absolute z-50 bg-white shadow-md border !-mt-[46vh] rounded-md"
                                            onClick={(e) => e.stopPropagation()}
                                            >
                                            <Calendar
                                                mode="single"
                                                selected={
                                                data.approved_at && isValid(parseISO(data.approved_at))
                                                    ? parseISO(data.approved_at)
                                                    : undefined
                                                }
                                                onSelect={(date) => {
                                                if (date) {
                                                    setData("approved_at", format(date, "yyyy-MM-dd"))
                                                    setApprovedDate(date)
                                                    setShowApprovalCalendar(false)
                                                }
                                                }}
                                                disabled={(date) => date > new Date()} // Optional: disallow future dates
                                                initialFocus
                                            />
                                            </div>
                                        )}
                                        {showApprovalCalendar && (
                                            <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowApprovalCalendar(false)} // close on outside click
                                            />
                                        )}
                                        {localErrors.approved_at && (
                                            <p className="text-red-500 text-xs">{localErrors.approved_at}</p>
                                        )}
                                    </div>

                                    {/* Approved by */}
                                    <div className="flex-[2] space-y-2">
                                        <Label htmlFor="approved_by" className="flex items-center">
                                            Approved by <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="approved_by"
                                            value={data.approved_by}
                                            onChange={(e) => setData("approved_by", e.target.value)}
                                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter approver's name"
                                        />
     
                                    {localErrors.approved_by && (
                                        <p className="text-red-500 text-xs">{localErrors.approved_by}</p>
                                    )}
                                    </div>
                                </div>

                            </div>
                        </form>
                    )}
                </div>
                {/* Footer - Buttons */}
                <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" onClick={submit}
                        className="bg-primary hover:bg-primary/90 text-white">Save Changes</Button>
                </DialogFooter>

            {activeImageIndex !== null && (
            <div className={cn("absolute h-[60%] w-[92%] z-[51] bg-black/25 drop-shadow-2xl place-self-center flex items-center justify-center p-4 rounded-lg transition-opacity duration-300 ease-in-out",
                activeImageIndex !== null ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
                onClick={(e) => e.stopPropagation()}>
                {/* Exit button */}
                <Button
                variant="ghost"
                className="absolute top-7 right-8 rounded-full h-8 w-8 bg-white/70 hover:bg-white/50 p-0"
                onClick={(e) => {
                    e.stopPropagation()
                    setActiveImageIndex(null)}}
                >
                    <X className=" text-black hover:text-black/40 " />
                </Button>

                {/* Left Arrow */}
                {activeImageIndex > 0 && (
                <button
                    className="absolute left-4 text-white text-4xl"
                    onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                >
                    <ChevronLeft className="text-muted h-8 w-8 hover:bg-white/20 rounded"/>
                </button>
                )}

                {/* Image */}
                <img
                    src={workOrder.images[activeImageIndex]}
                    alt={`Preview ${activeImageIndex + 1}`}
                    className="max-h-[90vh] max-w-full object-contain rounded"
                />

                <div className="absolute bottom-6 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
                {activeImageIndex + 1} of {workOrder.images.length}
                </div>

                {/* Right Arrow */}
                {activeImageIndex < workOrder.images.length - 1 && (
                <button
                    className="absolute right-4 text-white text-4xl"
                    onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                >
                    <ChevronRight className="text-muted h-8 w-8 hover:bg-white/20 rounded"/>
                </button>
                )}
            </div>
            )}
            </DialogContent>
        </Dialog>
    );
}
