import { useState } from "react";
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/Components/shadcnui/table"
import { Label } from "@/Components/shadcnui/label";
import { getStatusColor } from "@/utils/getStatusColor";
import { router } from "@inertiajs/react";
import { getPriorityColor } from "@/utils/getPriorityColor";



interface Location {
    id: number;
    name: string;
}

interface DeletePMProps {
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
    user: {
        id: number;
        name: string;
        permissions: string[];
    };
    onClose: () => void;
}

export default function DeletePMModal({
    workOrder,
    locations,
    user,
    onClose,
}: DeletePMProps) {
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/work-orders/preventive-maintenance/${workOrder.id}`);
        setTimeout(() => {
            onClose();
        }, 600);
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

    // Helper function to format maintenance schedule
    const formatMaintenanceSchedule = (schedule: any) => {
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
                    <DialogTitle className="text-xl font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                        <span className="text-red-500">Delete</span><span className="-ms-2.5">Preventive Maintenance</span>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {workOrder.id}</span>
                        </div>
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="px-6 max-h-[70vh] overflow-y-auto">

                <Table className="w-full rounded-md text-xs xs:text-sm">
                    <TableBody className="flex flex-col">
                        {/* Row 1 */}
                        
                        {/* Asset */}
                        {assetDetails && (
                        <TableRow className="border-none flex flex-row items-center justify-between w-full">
                            <TableHead className="flex flex-[1] items-center">
                            <Label>Asset</Label>
                            </TableHead>
                            <TableCell className="flex flex-[3.3] items-center whitespace-nowrap overflow-x-auto scrollbar-hide hover:overflow-x-scroll">
                                {assetDetails ? (
                                    `${assetDetails?.name} - ${assetDetails?.location_name}`
                                ) : (
                                    <span className="text-gray-500 italic">No Asset attached</span>
                                )}
                            </TableCell>
                        </TableRow>
                        )}

                        {/* Schedule */}
                        <TableRow className="border-none flex items-center">
                            <TableHead className="flex flex-[1] items-center">
                                <Label className="text-muted-foreground">Preventive Maintenance Schedule:</Label>
                            </TableHead>
                            <TableCell className="flex flex-[1] items-center">
                                <span className="bg-secondary/70 border border-secondary text-white rounded p-1 px-4">
                                    {workOrder.asset?.maintenance_schedule ? formatMaintenanceSchedule(workOrder.asset.maintenance_schedule) : "-"}
                                </span>
                            </TableCell>
                        </TableRow>

                        <hr className="my-2" />

                        {/* Row 2 */}
                        <TableRow className="border-none flex flex-row items-center justify-between w-full">
                            {/* Date Generated */}
                            <div className="flex-[1] flex">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Date Generated:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[1] items-center">{workOrder.requested_at}</TableCell>
                            </div>  
                                {/* Status */}
                                <div className="flex-[1] flex">
                                    <TableHead className="flex flex-[0.7] items-center">
                                        <Label>Status:</Label>
                                    </TableHead>
                                    <TableCell className="flex flex-[2] items-center">
                                        <span
                                            className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(workOrder.status)}`}
                                        >
                                            {workOrder.status}
                                        </span>
                                    </TableCell>
                                </div>
                        </TableRow>

                        {/* Row 3 */}
                        <TableRow className="border-none flex flex-row items-center justify-end w-full">

                            {/* Scheduled Date */}
                            <div className="flex-[1] flex">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Scheduled Date:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[1] items-center">{workOrder.scheduled_at ? workOrder.scheduled_at : "-"}</TableCell>
                            </div>  
                            {/* Priority */}
                            <div className="flex-[1] flex">
                                <TableHead className="flex flex-[0.7] items-center">
                                    <Label>Priority:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] items-start">
                                    <div
                                        className={`px-2 py-1 rounded bg-muted ${getPriorityColor(
                                            workOrder.priority
                                        )}`}
                                    >
                                        {workOrder.priority || "No Priority"}
                                    </div>
                                </TableCell>
                            </div>

                        </TableRow>
                    </TableBody>
                </Table>

                <hr className="my-2" />

                <Table className="w-full rounded-md text-xs xs:text-sm">
                    <TableBody className="flex flex-col">
                        {/* Location */}
                        <TableRow className="border-none flex flex-row items-center justify-between w-full">
                            <TableHead className="flex flex-[1] items-center">
                                <Label>Location:</Label>
                            </TableHead>
                            <TableCell className="flex flex-[3.3] items-center">{workOrder.location.name}</TableCell>
                        </TableRow>

                        {/* Description */}
                        <TableRow className="border-none flex flex-row items-center justify-between w-full">
                            <TableHead className="flex flex-[1] items-center">
                                <Label>Description:</Label>
                            </TableHead>
                            <TableCell className="flex flex-[3.3] items-start max-h-[100px] my-2 overflow-y-auto hover:overflow-y-scroll">{workOrder.report_description}</TableCell>
                        </TableRow>

                        {/* Label */}
                        <TableRow className="border-none flex flex-row items-center justify-between w-full">
                            <TableHead className="flex flex-[1] items-center">
                                <Label>Label:</Label>
                            </TableHead>
                            <TableCell className="flex flex-[3.3] items-start max-h-[100px] my-2 overflow-y-auto hover:overflow-y-scroll">{workOrder.label}</TableCell>
                        </TableRow>

                        <TableRow className="border-none flex flex-row items-center justify-between w-full">
                            <TableHead className="flex flex-[1] items-center">
                                <Label>Remarks:</Label>
                            </TableHead>
                            <TableCell className="flex flex-[3.3] items-center">
                                {workOrder.remarks ? (
                                    workOrder.remarks
                                ) : (
                                    <span className="text-gray-500 italic">No Remarks</span>
                                )}
                            </TableCell>
                        </TableRow>

                        {/* Attachment/Images */}
                        <TableRow className="border-none flex flex-row items-center justify-between w-full">
                            <TableHead className="flex flex-[1] items-center">
                                <Label>Attachment:</Label>
                            </TableHead>
                            <TableCell className="flex flex-[3.3] items-center">
                                {workOrder.images && workOrder.images.length > 0 ? (
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

                </div>

                {/* Footer - Buttons */}
                <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" onClick={submit}
                        className="bg-destructive hover:bg-destructive/90 text-white">
                            Delete
                    </Button>
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
