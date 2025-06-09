import { useEffect, useState, useRef } from "react";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { format, parseISO, isValid } from "date-fns"; // make sure this is imported
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

interface Location {
    id: number;
    name: string;
}

interface CreateWorkOrderProps {
    locations: Location[];
    assets: {
        id: number;
        name: string;
        location: { id: number; name: string };
    }[];
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    onClose: () => void;
}

export default function CreateWorkOrderModal({
    locations,
    assets,
    maintenancePersonnel,
    user,
    onClose,
}: CreateWorkOrderProps) {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [typedLocation, setTypedLocation] = useState("");
    const [locationId, setLocationId] = useState("");
    const [date, setDate] = useState<Date>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const [showCalendar, setShowCalendar] = useState(false);

    const isWorkOrderManager = user.permissions.includes("manage work orders");

    const { data, setData, post, errors } = useForm({
        location_id: "",
        report_description: "",
        attachments: [] as File[],
        ...(isWorkOrderManager && {
            status: "",
            work_order_type: "Work Order",
            label: "",
            priority: "",
            assigned_to: "",
            remarks: "",
            scheduled_at: "",
            asset_id: "",
        }),
    });

    const validateForm = () => {
        // fix the location and asset errors
        const newErrors: Record<string, string> = {};

        if (!typedLocation.trim())
            newErrors["location_id"] = "Location is required.";
        if (!data.report_description.trim())
            newErrors["report_description"] = "Description is required.";

        if (isWorkOrderManager) {
            if (!data.label) newErrors["label"] = "Label is required.";
            if (!data.scheduled_at)
                newErrors["scheduled_at"] = "Target date is required.";
            if (!data.priority) newErrors["priority"] = "Priority is required.";
            if (!data.assigned_to)
                newErrors["assigned_to"] = "Assigned personnel is required.";
            if (!data.status) newErrors["status"] = "Status is required.";
        }

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /** Handle Form Submission */
    const submit = async (e: React.FormEvent) => {
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
        formData.append("location_id", locationId);
        formData.append("report_description", data.report_description);
        data.attachments.forEach((file) => formData.append("attachments[]", file));

        if (isWorkOrderManager) {
            formData.append("work_order_type", data.work_order_type || "Work Order");
            formData.append("label", data.label || "");
            if (date) formData.append("scheduled_at", format(date, "yyyy-MM-dd"));
            formData.append("priority", data.priority || "");
            formData.append("status", data.status || "");
            formData.append("assigned_to", data.assigned_to || "");
            formData.append("asset_id", data.asset_id || "");
            formData.append("remarks", data.remarks || "");
        }

        // // For Debugging
        // console.log("=== Form Data ===:");
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        router.post("/work-orders", formData, {
            forceFormData: true,
        });
        onClose();
    };

    /** Handle File Previews */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData("attachments", files);

            const previews = files.map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...previews]);
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
            setPreviewImages((prev) => [...prev, ...previews]);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        /** Cleanup for dropdown and image previews */
        return () => {
            previewImages.forEach((src) => URL.revokeObjectURL(src));
        };
    }, [previewImages]);

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold">
                        Create Work Order
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

                <form
                    onSubmit={submit}
                    className="space-y-6 px-6 py-2 max-h-[65vh] overflow-y-auto"
                >
                    {/* Fields */}
                    <div className="px-2 -mt-2 space-y-4">
                        {/* Location */}
                        <SmartDropdown
                            label="Location"
                            required={true}
                            placeholder="Search or type a new location"
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
                            <Label
                                htmlFor="description"
                                className="flex items-center"
                            >
                                Description{" "}
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={data.report_description}
                                onChange={(e) =>
                                    setData(
                                        "report_description",
                                        e.target.value
                                    )
                                }
                                placeholder="Describe your report here..."
                                required
                            />
                            {localErrors.report_description && (
                                <p className="text-red-500 text-xs">
                                    {localErrors.report_description}
                                </p>
                            )}
                        </div>

                        {isWorkOrderManager && (
                            <>
                                <div className="flex flex-row justify-between gap-4 !mt-8">
                                    {/* Label */}
                                    <div className="flex-[1] space-y-2">
                                        <Label
                                            htmlFor="label"
                                            className="flex items-center"
                                        >
                                            Label{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.label}
                                            onValueChange={(value) =>
                                                setData("label", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Label" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="No Label">
                                                    No Label
                                                </SelectItem>
                                                <SelectItem value="HVAC">
                                                    HVAC
                                                </SelectItem>
                                                <SelectItem value="Electrical">
                                                    Electrical
                                                </SelectItem>
                                                <SelectItem value="Plumbing">
                                                    Plumbing
                                                </SelectItem>
                                                <SelectItem value="Painting">
                                                    Painting
                                                </SelectItem>
                                                <SelectItem value="Carpentry">
                                                    Carpentry
                                                </SelectItem>
                                                <SelectItem value="Repairing">
                                                    Repairing
                                                </SelectItem>
                                                <SelectItem value="Welding">
                                                    Welding
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {localErrors.label && (
                                            <p className="text-red-500 text-xs">
                                                {localErrors.label}
                                            </p>
                                        )}
                                    </div>

                                    {/* Target Date */}
                                    <div className="flex-[1] space-y-2">
                                        <Label
                                            htmlFor="scheduled_at"
                                            className="flex items-center"
                                        >
                                            Target Date{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setShowCalendar(!showCalendar)
                                            }
                                            className={cn(
                                                "w-full flex justify-between items-center",
                                                "text-left font-normal",
                                                !data.scheduled_at &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {data.scheduled_at
                                                ? format(
                                                      parseISO(
                                                          data.scheduled_at
                                                      ),
                                                      "MM/dd/yyyy"
                                                  )
                                                : "MM/DD/YYYY"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        {showCalendar && (
                                            <div
                                                className="absolute z-50 bg-white shadow-md border mt-2 -ml-[10rem] md:-ml-[11vw] lg:-ml-[7.5vw] rounded-md"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        data.scheduled_at &&
                                                        isValid(
                                                            parseISO(
                                                                data.scheduled_at
                                                            )
                                                        )
                                                            ? parseISO(
                                                                  data.scheduled_at
                                                              )
                                                            : undefined
                                                    }
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setData(
                                                                "scheduled_at",
                                                                format(
                                                                    date,
                                                                    "yyyy-MM-dd"
                                                                )
                                                            );
                                                            setDate(date);
                                                            setLocalErrors(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    scheduled_at:
                                                                        "",
                                                                })
                                                            );
                                                            setShowCalendar(
                                                                false
                                                            );
                                                        }
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    } // Disable past dates
                                                    initialFocus
                                                />
                                            </div>
                                        )}
                                        {showCalendar && (
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() =>
                                                    setShowCalendar(false)
                                                } // Close calendar on outside click
                                            />
                                        )}
                                        {localErrors.scheduled_at && (
                                            <p className="text-red-500 text-xs">
                                                {localErrors.scheduled_at}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between gap-4 !mt-4">
                                    {/* Priority */}
                                    <div className="flex-[1] space-y-2">
                                        <Label
                                            htmlFor="priority"
                                            className="flex items-center"
                                        >
                                            Priority{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.priority}
                                            onValueChange={(value) =>
                                                setData("priority", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Low">
                                                    Low
                                                </SelectItem>
                                                <SelectItem value="Medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="High">
                                                    High
                                                </SelectItem>
                                                <SelectItem value="Critical">
                                                    Critical
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {localErrors.priority && (
                                            <p className="text-red-500 text-xs">
                                                {localErrors.priority}
                                            </p>
                                        )}
                                    </div>

                                    {/* Assigned To */}
                                    <div className="flex-[2] space-y-2">
                                        <Label
                                            htmlFor="assigned_to"
                                            className="flex items-center"
                                        >
                                            Assign to{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.assigned_to}
                                            onValueChange={(value) =>
                                                setData("assigned_to", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Personnel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {maintenancePersonnel.map(
                                                    (person) => (
                                                        <SelectItem
                                                            key={person.id}
                                                            value={person.id.toString()}
                                                        >
                                                            {person.first_name}{" "}
                                                            {person.last_name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {localErrors.assigned_to && (
                                            <p className="text-red-500 text-xs">
                                                {localErrors.assigned_to}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="flex-[2] space-y-2">
                                        <Label
                                            htmlFor="status"
                                            className="flex items-center"
                                        >
                                            Status{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData("status", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Assigned">
                                                    Assigned
                                                </SelectItem>
                                                <SelectItem value="Ongoing">
                                                    Ongoing
                                                </SelectItem>
                                                <SelectItem value="For Budget Request">
                                                    For Budget Request
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {localErrors.status && (
                                            <p className="text-red-500 text-xs">
                                                {localErrors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Asset */}
                                <SmartDropdown
                                    label="Asset"
                                    placeholder="Search or select an asset"
                                    items={assets}
                                    getLabel={(a) =>
                                        `${a.name} – ${a.location.name}`
                                    }
                                    getValue={(a) => a.id.toString()}
                                    selectedId={data.asset_id || ""}
                                    onChange={(id) => setData("asset_id", id)}
                                    error={localErrors.asset_id}
                                />
                            </>
                        )}

                        {/* Remarks */}
                        {user.permissions.includes("manage work orders") && (
                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Textarea
                                    id="remarks"
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData("remarks", e.target.value)
                                    }
                                    placeholder="Additional notes or comments"
                                />
                                {localErrors.remarks && (
                                    <p className="text-red-500 text-xs">
                                        {localErrors.remarks}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Upload Photos */}
                        <div className="space-y-2 bg">
                            <Label>Upload Photos</Label>
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
                                        e.stopPropagation(); // Prevent modal from closing
                                        handleBrowseClick();
                                    }}
                                >
                                    <div className="text-center">
                                        <p
                                            className={`text-sm mb-1 transition-colors duration-300 ${
                                                isDraggingOver
                                                    ? "text-primary"
                                                    : "text-primary"
                                            }`}
                                        >
                                            {isDraggingOver
                                                ? "Drop files here"
                                                : "Choose a file or drag & drop it here"}
                                        </p>
                                        <p className="text-xs text-secondary/70">
                                            JPEG, JPG, and PNG formats, up to
                                            5MB
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        className={`mt-4 transition-all duration-300 ${
                                            isDraggingOver
                                                ? "bg-blue-100 border-blue-300"
                                                : ""
                                        }`}
                                        disabled={isDraggingOver}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent modal from closing
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
                                        accept="image/jpeg, image/png"
                                        multiple
                                    />
                                </div>

                                {/* Image Previews */}
                                {previewImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mt-4 rounded bg-white p-2">
                                        {previewImages.map((src, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square rounded-md overflow-hidden relative"
                                            >
                                                <img
                                                    src={
                                                        src ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {localErrors.attachments && (
                                    <p className="text-red-500 text-xs">
                                        {localErrors.attachments}
                                    </p>
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
                            onClick={submit}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Create
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
