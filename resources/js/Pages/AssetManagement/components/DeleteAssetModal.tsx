import { useState } from "react";
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/Components/shadcnui/table"
import { Label } from "@/Components/shadcnui/label";
import { router } from "@inertiajs/react";
import { format, parseISO } from "date-fns";

interface Location {
    id: number;
    name: string;
}

interface DeleteAssetModalProps {
    asset: {
        id: number;
        name: string;
        specification_details: string;
        location: { id: number; name: string };
        status: string;
        date_acquired: string;
        last_maintained_at: string;
        maintenance_schedule?: {
            id: number;
            asset_id: number;
            interval_unit: string;
            interval_value: number | null;
            month_week: number | null;
            month_weekday: string | null;
            year_day: number | null;
            year_month: number | null;
            last_run_at: string;
            is_active: boolean;
        };
    };
    locations: Location[];
    onClose: () => void;
}

export default function DeleteAssetModal({
    asset,
    locations,
    onClose,
}: DeleteAssetModalProps) {
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/assets/${asset.id}`);
        setTimeout(() => {
            onClose();
        }, 600);
    };

    // Helper function to format maintenance schedule
    const formatMaintenanceSchedule = (schedule: typeof asset.maintenance_schedule) => {
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

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Functional":
                return "bg-green-100 text-green-700 border border-green-300";
            case "Failed":
                return "bg-red-100 text-red-700 border border-red-300";
            case "Under Maintenance":
                return "bg-blue-100 text-blue-700 border border-blue-300";
            case "End of Useful Life":
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    return (
        <Dialog
            open={true}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl max-h-[95vh] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            <span>Delete Asset</span>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {asset.id}</span>
                        </div>
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="px-6 max-h-[70vh] overflow-y-auto">
                    <Table className="w-full rounded-md text-xs xs:text-sm">
                        <TableBody className="flex flex-col">
                            {/* Asset Name and Specification */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label>Asset Name</Label>
                                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Specification</Label>
                                    <p className="text-sm text-muted-foreground">{asset.specification_details}</p>
                                </div>
                            </div>

                            <hr className="my-2" />

                            {/* Location, Condition, and Date Acquired */}
                            <div className="flex flex-col xs:flex-row gap-4 my-4">
                                <div className="space-y-2 flex-[1]">
                                    <Label>Location</Label>
                                    <p className="text-sm text-muted-foreground">{asset.location.name}</p>
                                </div>
                                <div className="space-y-2 flex-[1]">
                                    <Label>Condition</Label>
                                    <p>
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(asset.status)}`}>
                                            {asset.status}
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-2 flex-[1]">
                                    <Label>Date Acquired</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {asset.date_acquired ? format(parseISO(asset.date_acquired), "MM/dd/yyyy") : "Not set"}
                                    </p>
                                </div>
                            </div>

                            {/* Preventive Maintenance Section */}
                            {asset.maintenance_schedule && (
                                <>
                                    <hr className="my-2" />
                                    <div className="space-y-4 mt-6">
                                        <div className="flex items-center bg-secondary p-2 text-white">
                                            <Label className="text-lg font-semibold">
                                                Preventive Maintenance Schedule
                                            </Label>
                                        </div>
                                        <div className="bg-muted/10 px-4 rounded-lg">
                                            <Table>
                                                <TableRow className="border-none">
                                                    <TableHead>Status</TableHead>
                                                    <TableCell>
                                                        <span className={cn("px-2 py-1 rounded text-sm",
                                                            asset.maintenance_schedule?.is_active 
                                                                ? "bg-green-100 text-green-700" 
                                                                : "bg-red-100 text-red-700"
                                                        )}>
                                                            {asset.maintenance_schedule?.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow className="border-none">
                                                    <TableHead>Schedule</TableHead>
                                                    <TableCell>
                                                        {formatMaintenanceSchedule(asset.maintenance_schedule)}
                                                    </TableCell>
                                                </TableRow>
                                            </Table>
                                        </div>
                                    </div>
                                </>
                            )}
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
            </DialogContent>
        </Dialog>
    );
} 