"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/shadcnui/dropdown-menu";
import { router } from '@inertiajs/react';
import { getStatusColor } from "@/utils/getStatusColor";

interface StatusCellProps {
    value: string;
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    row?: any;
}

// Define status transition rules
const STATUS_TRANSITIONS: Record<string, string[]> = {
    "Assigned": ["Pending", "For Budget Request", "Scheduled", "Ongoing", "Completed", "Cancelled"],
    "Scheduled": ["Pending", "Ongoing"],
    "Ongoing": ["Assigned", "Overdue", "Completed", "Cancelled"],
    "Overdue": ["For Budget Request", "Completed", "Cancelled"],
    "Completed": ["Ongoing"],
    "Pending": ["Assigned", "For Budget Request", "Scheduled", "Ongoing", "Completed", "Cancelled"],
    "For Budget Request": ["Pending", "Assigned", "Ongoing", "Completed", "Cancelled"],
    "Cancelled": ["Assigned", "For Budget Request"],
    "Declined": ["Assigned", "For Budget Request"],
};

export function StatusCell({ value, user, row }: StatusCellProps) {
    const handleUpdate = (status: string, rowId: number) => {
        router.put(`/work-orders/${rowId}`, { status });
    };

    // Get available status transitions based on current status
    const getAvailableStatuses = (currentStatus: string): string[] => {
        // If user is maintenance personnel, restrict to basic statuses
        if (user.roles[0].name === "maintenance_personnel") {
            return ["Ongoing", "Completed"];
        }
        
        // Return available transitions for current status
        return STATUS_TRANSITIONS[currentStatus] || [];
    };
    const availableStatuses = getAvailableStatuses(value);
    const canEditStatus = user.permissions.includes("manage work orders") || 
                         (user.roles[0].name === "maintenance_personnel" && 
                          window.route().current("work-orders.assigned-tasks"));

    // If maintenance personnel and status is completed, show static status
    if (user.roles[0].name === "maintenance_personnel" && value === "Completed") {
        return (
            <span
                className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(value)}`}
            >
                {value}
            </span>
        );
    }

    return (
        <DropdownMenu>
            {!canEditStatus ? (
                <span
                    className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(value)}`}
                >
                    {value}
                </span>
            ) : (
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="link"
                        className={`px-2 py-1 !h-6 border rounded flex items-center justify-between gap-1 text-xs hover:no-underline ${getStatusColor(value)}`}
                    >
                        {value}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
            )}
            <DropdownMenuContent align="center">
                {availableStatuses.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => handleUpdate(status, row.original.id)}
                    >
                        {status}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
