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
    row: any
}; 

export function StatusCell({ value, user, row }: StatusCellProps) {

    const handleUpdate = (status: string, rowId: number,) => {
            router.put(`/work-orders/${rowId}`, { status });
    };

    // Define all statuses
    const allStatuses = [
        "Pending",
        "Assigned",
        "Scheduled",
        "Ongoing",
        "Overdue",
        "Completed",
        "For Budget Request",
        "Cancelled",
        "Declined",
    ];

    // Filter statuses based on user role
    const dropDownStatuses =
        user.roles[0].name === "maintenance_personnel"
            ? ["Ongoing", "Completed"] // Restricted statuses for maintenance personnel
            : allStatuses; // All statuses for other roles

    const disableStatus = [
        "Pending",
        "Scheduled",
        "Overdue",
        "Completed",
        "For Budget Request",
        "Cancelled",
        "Declined",
        "Deleted",
    ]

    return (
        <DropdownMenu>
            {disableStatus.includes(value) && !user.permissions.includes("manage work orders") ? (
            <span
                className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(
                value
                )}`}
            >
                {value}
            </span>
            ) : ( window.route && (
                    (user.roles[0].name === "maintenance_personnel" && window.route().current("work-orders.assigned-tasks")) || 
                    (user.permissions.includes("manage work orders") && window.route().current("work-orders.index")) 
                )) ? (
            <DropdownMenuTrigger asChild>
                <Button
                variant={"link"}
                className={`px-2 py-1 !h-6 border rounded flex items-center justify-between gap-1 text-xs hover:no-underline ${getStatusColor(
                    value
                )}`}
                >
                {value}
                <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            ) : (
            <span
                className={`px-2 py-1 h-6 border rounded inline-flex items-center ${getStatusColor(
                value
                )}`}
            >
                {value}
            </span>
            )}
            <DropdownMenuContent align="center">
            {dropDownStatuses.map((status) => (
                <DropdownMenuItem
                key={status}
                onClick={() => {
                    handleUpdate(status, row.original.id);
                }}
                >
                {status}
                </DropdownMenuItem>
            ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
