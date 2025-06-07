import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/Components/shadcnui/table"
import { Label } from "@/Components/shadcnui/label";
import { getStatusColor } from "@/utils/getStatusColor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/shadcnui/dropdown-menu";
import { router } from "@inertiajs/react";
import { getPriorityColor } from "@/utils/getPriorityColor";
import { format } from "date-fns";



interface Location {
    id: number;
    name: string;
}

interface ViewWorkOrderProps {
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
    locations: { id: number; name: string }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    onClose: () => void;
}

export default function ViewWorkOrderModal({
    workOrder,
    locations,
    user,
    onClose,
}: ViewWorkOrderProps) {
    const isMaintenancePersonnel = user.roles.some(role => role.name === 'maintenance_personnel');
    const isDepartmentHead = user.roles.some(role => role.name === 'department_head');
    const isWorkOrderManager = user.permissions.includes("manage work orders");
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
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

    const getAvailableStatuses = (status: string): string[] => {
        return ["Ongoing", "Completed"];
    }
    const availableStatuses = getAvailableStatuses(workOrder.status);

    const handleUpdate = (status: string, workOrderId: number) => {
        router.put(`/work-orders/${workOrderId}`, { status });
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
                    <DialogTitle className="text-md sm:text-lg font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            <span>Request Details</span>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {workOrder.id}</span>
                        </div>
                        </DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="px-2 sm:px-6 max-h-[70vh] overflow-y-auto">

                    <Table className="w-full rounded-md text-xs xs:text-sm">
                        <TableBody className="flex flex-col">

                            {isMaintenancePersonnel || isWorkOrderManager && (
                                <TableRow className="border-none flex flex-row items-center justify-between w-full">

                                    {/* Requested By */}
                                    <div className="flex-[1] flex">
                                        <TableHead className="flex flex-[1] items-center">
                                            <Label>Requested By:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[1] items-center">{workOrder.requested_by.name}</TableCell>
                                    </div>

                                    {workOrder.assigned_to?.id === user.id ? [

                                    // Status if Work Order Request is Assigned to the Maintenance Personnel = DROPDOWN MENU
                                    <div className="flex-[1] flex gap-8">
                                        <TableHead className="flex flex-[1] items-center">
                                            <Label>Status:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[2] items-center">
                                            {workOrder.status === "Completed" ? [
                                            <span
                                                className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(workOrder.status)}`}
                                            >
                                                {workOrder.status}
                                            </span>
                                            ] : [
                                            <>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="link"
                                                            className={`px-2 !h-7 border rounded flex items-center justify-between gap-1 hover:no-underline ${getStatusColor(workOrder.status)}`}
                                                        >
                                                            {workOrder.status}
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="center">
                                                        {availableStatuses.map((status) => (
                                                            <DropdownMenuItem
                                                                key={status}
                                                                onClick={() => handleUpdate(status, workOrder.id)}
                                                                className="hover:bg-gray-100"
                                                            >
                                                                {status}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </>
                                            ]}
                                        </TableCell>
                                    </div>

                                    ] : [
                                        
                                    // Status if Work Order Request is own = STATIC VIEWING ONLY
                                    <div className="flex-[1] flex gap-8">
                                        <TableHead className="flex flex-[1] items-center">
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

                                    ]}
                                </TableRow>
                            )}
                    
                            <TableRow className="border-none flex flex-row items-center justify-between w-full">

                                {/* Date Requested */}
                                <div className="flex-[1] flex">
                                    <TableHead className="flex flex-[1] items-center">
                                        <Label>Date Requested:</Label>
                                    </TableHead>
                                    <TableCell className="flex flex-[1] items-center">{format(workOrder.requested_at, "MM/dd/yyyy")}</TableCell>
                                </div>  

                                {/* Work Order Type */}
                                {isMaintenancePersonnel && (
                                <div className="flex-[1] flex">
                                    <TableHead className="flex flex-[0.7] items-center">
                                        <Label>Work Order Type:</Label>
                                    </TableHead>
                                    <TableCell className="flex flex-[1] items-center">
                                        {workOrder.work_order_type}
                                    </TableCell>
                                </div>
                                )}

                                {/* Priority */}
                                {isWorkOrderManager && (
                                <div className="flex-[1] flex">
                                    <TableHead className="flex flex-[0.7] items-center">
                                        <Label>Priority:</Label>
                                    </TableHead>
                                    <TableCell className="flex flex-[1] items-start">
                                        <div
                                            className={`px-2 py-1 rounded bg-muted ${getPriorityColor(
                                                workOrder.priority
                                            )}`}
                                        >
                                            {workOrder.priority || "No Priority"}
                                        </div>
                                    </TableCell>
                                </div>
                                )}

                                {/* Status */}
                                {isDepartmentHead && (   
                                    <div className="flex-[1] flex">
                                        <TableHead className="flex flex-[1] items-center">
                                            <Label>Status:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[3] items-center">
                                            <span
                                                className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(workOrder.status)}`}
                                            >
                                                {workOrder.status}
                                            </span>
                                        </TableCell>
                                    </div>
                                )}
                            </TableRow>
                            
                        </TableBody>
                    </Table>

                    {isMaintenancePersonnel || isWorkOrderManager && (
                        <hr className="my-2" />
                    )}

                    <Table className="w-full rounded-md text-xs xs:text-sm">
                        <TableBody className="flex flex-col">
                            {/* Target Date */}
                            <TableRow className="border-none flex flex-row items-center justify-between w-full">
                                <TableHead className="flex flex-[1] items-center">
                                    <Label>Target Date:</Label>
                                </TableHead>
                                <TableCell className="flex flex-[3.3] items-center">
                                    {workOrder.scheduled_at ? [
                                        <span>{format(workOrder.scheduled_at, "MM/dd/yyyy")}</span>
                                    ] : [
                                        <span className="text-gray-500 italic">No date set</span>
                                    ]}
                                </TableCell>
                            </TableRow>

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

                            {isMaintenancePersonnel || isWorkOrderManager && (
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
                            )}

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

                <DialogFooter></DialogFooter>

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
