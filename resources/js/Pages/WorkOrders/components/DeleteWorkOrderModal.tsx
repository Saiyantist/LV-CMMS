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
import { format } from "date-fns";



interface Location {
    id: number;
    name: string;
}

interface DeleteWorkOrderProps {
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
        attachments: string[];
    };
    locations: Location[];
    user: {
        id: number;
        name: string;
        permissions: string[];
    };
    onClose: () => void;
}

export default function DeleteWorkOrderModal({
    workOrder,
    locations,
    user,
    onClose,
}: DeleteWorkOrderProps) {
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/work-orders/${workOrder.id}`);
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

    return (
        <Dialog
            open={true}
            onOpenChange={(isOpen) => {
                if (!activeImageIndex && !isOpen) {
                onClose()
                }
            }}
        >
            <DialogContent className="w-full sm:max-w-lg lg:max-w-2xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            <span className="text-red-500">Delete</span><span className="-ms-2.5">Work Order</span>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {workOrder.id}</span>
                        </div>
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="px-6 max-h-[55vh] sm:max-h-[65vh] overflow-y-auto">

                    <Table className="w-full rounded-md">
                        <TableBody className="flex flex-col">

                            {/* Date Requested */}
                            <TableRow className="border-none flex flex-row">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Date Requested:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center">
                                    {format(workOrder.requested_at, "MM/dd/yyyy")}
                                </TableCell>
                            </TableRow>

                            {/* Requested By */}
                            <TableRow className="border-none flex flex-row">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Requested by:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center">
                                    {workOrder.requested_by.name}
                                </TableCell>
                            </TableRow>

                            {/* Location */}
                            <TableRow className="border-none flex flex-row">
                            <TableHead className="flex flex-[1] items-center">
                                    <Label>Location:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center">
                                    {workOrder.location.name}
                                </TableCell>
                            </TableRow>

                            {/* Description */}
                            <TableRow className="border-none flex flex-row items-center">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Description:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center max-h-[3.5rem] my-2 overflow-y-auto hover:overflow-y-scroll">{workOrder.report_description}</TableCell>
                            </TableRow>

                            {/* Remarks */}
                            <TableRow className="border-none flex flex-row items-center">    
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Remarks:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center max-h-[3.5rem] my-2 overflow-y-auto hover:overflow-y-scroll">{workOrder.remarks ? (
                                        workOrder.remarks
                                    ) : (
                                        <span className="text-gray-500 italic">No Remarks</span>
                                    )}</TableCell>
                            </TableRow>

                            {/* Status */}
                            <TableRow className="border-none flex flex-row items-center">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Status:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center">
                                    <span className={`rounded-md text-sm border font-medium shadow-sm h-8 px-2 py-1 ${getStatusColor(workOrder.status)}`}>{workOrder.status}</span>
                                </TableCell>
                            </TableRow>

                            {/* Asset */}
                            {assetDetails && (
                            <TableRow className="border-none flex flex-row">
                                <TableHead className="flex flex-[1] items-center">
                                <Label>Asset</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center">
                                    {assetDetails ? (
                                        `${assetDetails?.name} - ${assetDetails?.location_name}`
                                    ) : (
                                        <span className="text-gray-500 italic">No Asset attached</span>
                                    )}
                                </TableCell>
                            </TableRow>
                            )}

                            {/* Attachment / Images / Photos */}
                            <TableRow className="border-none flex flex-row">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Attachment:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[2] xs:flex-[3] items-center">
                                    {workOrder.attachments.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {workOrder.attachments.map((src, index) => (
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
                    src={workOrder.attachments[activeImageIndex]}
                    alt={`Preview ${activeImageIndex + 1}`}
                    className="max-h-[90vh] max-w-full object-contain rounded"
                />

                <div className="absolute bottom-6 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
                {activeImageIndex + 1} of {workOrder.attachments.length}
                </div>

                {/* Right Arrow */}
                {activeImageIndex < workOrder.attachments.length - 1 && (
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
