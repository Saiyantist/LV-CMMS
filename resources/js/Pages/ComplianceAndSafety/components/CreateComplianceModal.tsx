import { useEffect, useState, useRef } from "react";
import { router, useForm } from "@inertiajs/react";
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
import SmartDropdown from "@/Components/SmartDropdown";
import axios from "axios";

interface Location {
    id: number;
    name: string;
}

interface CreateComplianceModalProps {
    locations: Location[];
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    onClose: () => void;
}

export default function CreateComplianceModal({
    locations,
    maintenancePersonnel,
    onClose,
}: CreateComplianceModalProps) {
    const [previewFiles, setPreviewFiles] = useState<string[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [typedLocation, setTypedLocation] = useState("");
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    const { data, setData, post, errors } = useForm({
        compliance_area: "",
        location_id: "",
        report_description: "",
        remarks: "",
        scheduled_at: "",
        priority: "",
        assigned_to: "",
        attachments: [] as File[],
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!typedLocation.trim()) newErrors["location_id"] = "Location is required.";
        if (!data.compliance_area) newErrors["compliance_area"] = "Compliance area is required.";
        if (!data.location_id) newErrors["location_id"] = "Location is required.";
        if (!data.report_description) newErrors["report_description"] = "Description is required.";
        if (!data.scheduled_at) newErrors["scheduled_at"] = "Target date is required.";
        if (!data.priority) newErrors["priority"] = "Priority is required.";
        if (!data.assigned_to) newErrors["assigned_to"] = "Assigned personnel is required.";

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        let locationId = data.location_id;

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

        const formData = new FormData();
        formData.append("work_order_type", "Compliance");
        formData.append("compliance_area", data.compliance_area);
        formData.append("location_id", locationId);
        formData.append("report_description", data.report_description);
        formData.append("remarks", data.remarks);
        formData.append("scheduled_at", data.scheduled_at);
        formData.append("priority", data.priority);
        formData.append("assigned_to", data.assigned_to);
        formData.append("status", "Assigned");

        data.attachments.forEach((file) => {
            formData.append("attachments[]", file);
        });

        // For Debugging
        console.log("=== Form Data ===:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        router.post(route("work-orders.compliance-and-safety.store"), formData, {
            forceFormData: true,
        });
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData("attachments", files);

            const previews = files.map((file) => URL.createObjectURL(file));
            setPreviewFiles((prev) => [...prev, ...previews]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            setData("attachments", [...data.attachments, ...files]);

            const previews = files.map((file) => URL.createObjectURL(file));
            setPreviewFiles((prev) => [...prev, ...previews]);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        return () => {
            previewFiles.forEach((src) => URL.revokeObjectURL(src));
        };
    }, [previewFiles]);

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold">
                        Create Compliance Work Order
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

                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-2 max-h-[65vh] overflow-y-auto">
                    <div className="px-2 -mt-2 space-y-4">
                        {/* Compliance Area */}
                        <div className="space-y-2">
                            <Label htmlFor="compliance_area" className="flex items-center">
                                Compliance Area <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Select
                                value={data.compliance_area}
                                onValueChange={(value) => setData("compliance_area", value)}
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

                        {/* Location */}
                        <SmartDropdown
                            label="Location"
                            required={true}
                            placeholder="Search or select a location"
                            items={locations}
                            getLabel={(loc) => loc.name}
                            getValue={(loc) => loc.id.toString()}
                            selectedId={data.location_id}
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
                                value={data.report_description}
                                onChange={(e) => setData("report_description", e.target.value)}
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
                                value={data.remarks}
                                onChange={(e) => setData("remarks", e.target.value)}
                                placeholder="Enter safety protocols and procedures..."
                            />
                        </div>

                        <div className="flex flex-row justify-between gap-4">
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
                                        ? format(parseISO(data.scheduled_at), "MM/dd/yyyy")
                                        : "MM/DD/YYYY"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                {showCalendar && (
                                    <div className="absolute z-50 bg-white shadow-md border mt-2 rounded-md">
                                        <Calendar
                                            mode="single"
                                            selected={data.scheduled_at ? parseISO(data.scheduled_at) : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    setData("scheduled_at", format(date, "yyyy-MM-dd"));
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
                                    value={data.priority}
                                    onValueChange={(value) => setData("priority", value)}
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
                                    value={data.assigned_to}
                                    onValueChange={(value) => setData("assigned_to", value)}
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

                        {/* File Upload */}
                        <div className="space-y-2">
                            <Label>Attachments</Label>
                            <div className="p-4 bg-muted rounded">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                                        isDraggingOver
                                            ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-md"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white"
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBrowseClick();
                                    }}
                                >
                                    <div className="text-center">
                                        <p className={`text-sm mb-1 transition-colors duration-300 ${
                                            isDraggingOver ? "text-primary" : "text-primary"
                                        }`}>
                                            {isDraggingOver ? "Drop files here" : "Choose a file or drag & drop it here"}
                                        </p>
                                        <p className="text-xs text-secondary/70">
                                            PDF, JPEG, JPG, and PNG formats, up to 5MB
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        className={`mt-4 transition-all duration-300 ${
                                            isDraggingOver ? "bg-blue-100 border-blue-300" : ""
                                        }`}
                                        disabled={isDraggingOver}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBrowseClick();
                                        }}
                                    >
                                        Browse File
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,image/jpeg,image/png"
                                        multiple
                                    />
                                </div>

                                {/* File Previews */}
                                {previewFiles.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mt-4 rounded bg-white p-2">
                                        {previewFiles.map((src, index) => (
                                            <div key={index} className="aspect-square rounded-md overflow-hidden relative">
                                                <img
                                                    src={src}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer - Buttons */}
                <DialogFooter className="px-6 py-4 border-t">
                    <div className="flex gap-2 xs:flex-row flex-col">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Create Work Order
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 