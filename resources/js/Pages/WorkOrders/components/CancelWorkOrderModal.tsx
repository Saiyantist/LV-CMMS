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



interface Location {
    id: number;
    name: string;
}

interface CancelWorkOrderModalProps {
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

export default function CancelWorkOrderModal({
    workOrder,
    locations,
    user,
    onClose,
}: CancelWorkOrderModalProps) {
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
    // const getAssetDetails = (workOrder: any) => {
    //     if (workOrder.asset) {
    //         return {
    //             id: workOrder.asset.id,
    //             name: workOrder.asset.name,
    //             location_id: workOrder.asset.location_id,
    //             location_name: locations.find(
    //                 (loc) => loc.id === workOrder.asset.location_id
    //             )?.name || "No Location",
    //         };
    //     }
    //     return null;
    // };
    
    // const assetDetails = getAssetDetails(workOrder);

    /** Handle Form Submission */
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/work-orders/${workOrder.id}`, { status: "Cancelled" });
        setTimeout(() => {
            onClose();
        }, 600);
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
                            <div className="flex flex-row gap-1.5">
                                <span className="text-red-500">Cancel</span><span>Work Order</span>
                            </div>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {workOrder.id}</span>
                        </div>
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="px-6 max-h-[70vh] overflow-y-auto">

                    <Table className="w-full rounded-md">
                        <TableBody>
                            
                            {/* ID */}
                            <TableRow className="border-none">
                                <TableHead className="w-1/3">
                                    <Label>Work Order ID:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.id}</TableCell>
                            </TableRow>

                            {/* Date Requested */}
                            <TableRow className="border-none">
                                <TableHead className="w-1/4 ">
                                    <Label>Date Requested:</Label>
                                </TableHead>
                                <TableCell className="">{workOrder.requested_at}</TableCell>
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
                                <TableCell className="flex max-h-[100px] my-2 overflow-y-auto hover:overflow-y-scroll">{workOrder.report_description}</TableCell>
                            </TableRow>

                            {/* Status */}
                            <TableRow className="border-none">
                                <TableHead className="">
                                    <Label>Status:</Label>
                                </TableHead>
                                <TableCell className="">
                                    <span className={`rounded-md text-sm border font-medium shadow-sm h-8 px-2 py-1 ${getStatusColor(workOrder.status)}`}>{workOrder.status}</span>
                                </TableCell>
                            </TableRow>

                            {/* Asset */}
                            {/* {assetDetails && (
                            <TableRow className="border-none">
                                <TableHead>
                                <Label>Asset</Label>
                                </TableHead>
                                <TableCell>{assetDetails.name} - {assetDetails.location_name}</TableCell>
                            </TableRow>
                            )} */}

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

                </div>

                {/* Footer - Buttons */}
                <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" onClick={onClose}>Back</Button>
                    <Button variant="destructive" type="submit" onClick={submit}>Cance Work Order</Button>
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
