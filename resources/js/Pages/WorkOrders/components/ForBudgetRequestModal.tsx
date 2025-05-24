import { useState, useEffect, useRef } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
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

interface ForBudgetRequestModalProps {
    workOrder: {
        id: number;
        location: { id: number; name: string };
        report_description: string;
        requested_at: string;
        requested_by: { id: number; name: string};
        asset: any;
        status: string;
        label: string;
        priority: string;
        remarks: string;
        images: string[];
    };
    locations: Location[];
    user: {
        id: number;
        name: string;
        permissions: string[];
    };
    onClose: () => void;
}

export default function ForBudgetRequestModal({
    workOrder,
    locations,
    user,
    onClose,
}: ForBudgetRequestModalProps) {
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

    const isWorkOrderManager = user.permissions.includes("manage work orders");

    const { data, setData, errors, processing } = useForm({
        location_id: workOrder.location.id,
        report_description: workOrder.report_description,
        asset: workOrder.asset,
        images: [] as File[],
        status: "For Budget Request",
        label: workOrder.label,
        priority: workOrder.priority,
        remarks: workOrder.remarks ?? "",
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (isWorkOrderManager) {
            if (!data.label) newErrors["label"] = "Label is required."
            if (!data.priority) newErrors["priority"] = "Priority is required."
        }

        setLocalErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!validateForm()) return

        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            if (isWorkOrderManager) {
                formData.append("location_id", data.location_id.toString());
                formData.append("report_description", data.report_description || "");
                formData.append("label", data.label || "");
                formData.append("priority", data.priority || "");
                formData.append("status", data.status || "For Budget Request");
                formData.append("remarks", data.remarks || "");
            }
            
            router.post(`/work-orders/${workOrder.id}`, formData, {
                forceFormData: true,
                preserveScroll: true,
            });

            
            setTimeout(() => {
                onClose();
            }, 600);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Something went wrong while updating the work order.';
            router.reload({ 
                only: ['flash'], 
                data: { 
                    error: errorMessage 
                }
            });
        }
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
                if (!activeImageIndex && !isOpen) {
                    onClose()
                }
            }}
        >
            <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold">
                        <span>For Budget Request</span>
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-4 px-6 max-h-[70vh] overflow-y-auto">
                    <Table className="w-full rounded-md">
                        <TableBody>

                            {/* Date Requested */}
                            <TableRow className="border-none">
                                <TableHead className="w-1/4 ">
                                    <Label>Date Requested:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.requested_at}</TableCell>
                            </TableRow>

                            {/* Requested By */}
                            <TableRow className="border-none">
                                <TableHead className="">
                                    <Label>Requested by:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.requested_by.name}</TableCell>
                            </TableRow>

                            {/* Location */}
                            <TableRow className="border-none">
                                <TableHead className="">
                                    <Label>Location:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.location.name}</TableCell>
                            </TableRow>

                            {/* Description */}
                            <TableRow className="border-none">
                                <TableHead className="">
                                    <Label>Description:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.report_description}</TableCell>
                            </TableRow>

                            {/* Asset Detail */}
                            {assetDetails && (
                            <TableRow className="border-none">
                                <TableHead>
                                <Label>Asset</Label>
                                </TableHead>
                                <TableCell>{assetDetails.name} - {assetDetails.location_name}</TableCell>
                            </TableRow>
                            )}

                            {/* Attachment / Images / Photos */}
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

                    {/* Acceptance Fields - Bottom Part */}
                    {isWorkOrderManager && (
                        <form onSubmit={submit}>
                            <div className="py-2">
                                <div className="flex flex-row justify-between gap-4 ">

                                    {/* Label */}
                                    <div className="flex-[1] space-y-2">
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

                                </div>

                            </div>
                        </form>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" onClick={submit}
                        className="bg-primary hover:bg-primary/90 text-white">Accept Partially</Button>
                </DialogFooter>

                {activeImageIndex !== null && (
                <div className={cn("absolute h-[60%] w-[92%] z-[51] bg-black/25 drop-shadow-2xl place-self-center flex items-center justify-center p-4 rounded-lg transition-opacity duration-300 ease-in-out",
                    activeImageIndex !== null ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                    onClick={(e) => e.stopPropagation()}>
                    <Button
                    variant="ghost"
                    className="absolute top-7 right-8 rounded-full h-8 w-8 bg-white/70 hover:bg-white/50 p-0"
                    onClick={(e) => {
                        e.stopPropagation()
                        setActiveImageIndex(null)}}
                    >
                        <X className=" text-black hover:text-black/40 " />
                    </Button>

                    {activeImageIndex > 0 && (
                    <button
                        className="absolute left-4 text-white text-4xl"
                        onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                    >
                        <ChevronLeft className="text-muted h-8 w-8 hover:bg-white/20 rounded"/>
                    </button>
                    )}

                    <img
                        src={workOrder.images[activeImageIndex]}
                        alt={`Preview ${activeImageIndex + 1}`}
                        className="max-h-[90vh] max-w-full object-contain rounded"
                    />

                    <div className="absolute bottom-6 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
                    {activeImageIndex + 1} of {workOrder.images.length}
                    </div>

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
