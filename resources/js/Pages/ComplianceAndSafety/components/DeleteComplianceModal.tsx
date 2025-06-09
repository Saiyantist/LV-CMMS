import React from "react";
import { router } from "@inertiajs/react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/shadcnui/dialog";
import { Label } from "@/Components/shadcnui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@/Components/shadcnui/table";
import { getStatusColor } from "@/utils/getStatusColor";
import { getPriorityColor } from "@/utils/getPriorityColor";

interface DeleteComplianceModalProps {
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
    };
    onClose: () => void;
}

const DeleteComplianceModal: React.FC<DeleteComplianceModalProps> = ({
    workOrder,
    onClose,
}) => {
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(route("work-orders.compliance-and-safety.destroy", workOrder.id));
        setTimeout(() => {
            onClose();
        }, 600);
    };

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            <span className="text-red-500">Delete</span><span className="-ms-2.5">Compliance and Safety</span>
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

                <div className="px-6 py-2 max-h-[55vh] sm:max-h-[65vh] overflow-y-auto">
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
                                            {format(parseISO(workOrder.requested_at), "MM/dd/yyyy")}
                                        </TableCell>
                                    </div>

                                    {/* Status */}
                                    <div className="flex-[3] flex xs:gap-8">
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
                                </TableRow>

                                {/* Row 2 */}
                                <TableRow className="border-none flex flex-col xs:flex-row xs:items-center xs:justify-between w-full">
                                    {/* Target Date */}
                                    <div className="flex-[4] flex">
                                            <TableHead className="flex flex-[1] items-center">
                                                <Label>Target Date:</Label>
                                            </TableHead>
                                            <TableCell className="flex flex-[2] xs:flex-[1] lg:flex-[2] items-center">
                                            {workOrder.scheduled_at
                                                ? format(parseISO(workOrder.scheduled_at), "MM/dd/yyyy")
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
                                                    workOrder.priority
                                                )}`}
                                            >
                                                {workOrder.priority}
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
                                            {workOrder.compliance_area}
                                        </TableCell>
                                    </div>

                                    {/* Location */}
                                    <div className="flex-[3] flex xs:gap-8">
                                        <TableHead className="flex flex-[1] items-center">
                                            <Label>Location:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[2] items-center">
                                            {workOrder.location.name}
                                        </TableCell>
                                    </div>
                                </TableRow>

                                {/* Description */}
                                <TableRow className="border-none flex flex-row items-center justify-between w-full">
                                <TableHead className="flex flex-[2.2] xs:flex-[1] items-center">
                                            <Label>Description:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[4.5] items-start max-h-[3.5rem] my-2 overflow-y-auto hover:overflow-y-scroll">
                                        {workOrder.report_description}
                                    </TableCell>
                                </TableRow>

                                {/* Safety Protocols */}
                                <TableRow className="border-none flex flex-row items-center justify-between w-full">
                                <TableHead className="flex flex-[2.2] xs:flex-[1] items-center">
                                            <Label>Safety Protocols:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[4.5] items-start max-h-[3.5rem] my-2 overflow-y-auto hover:overflow-y-scroll">
                                        {workOrder.remarks || <span className="text-gray-500 italic">No safety protocols specified</span>}
                                    </TableCell>
                                </TableRow>

                                {/* Assigned To */}
                                <TableRow className="border-none flex flex-row items-center justify-between w-full">
                                <TableHead className="flex flex-[2.2] xs:flex-[1] items-center">
                                            <Label>Assigned To:</Label>
                                        </TableHead>
                                        <TableCell className="flex flex-[4.5] items-center">
                                        {workOrder.assigned_to
                                            ? `${workOrder.assigned_to.first_name} ${workOrder.assigned_to.last_name}`
                                            : "Unassigned"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="bg-destructive hover:bg-destructive/90 text-white" onClick={submit}>Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteComplianceModal; 