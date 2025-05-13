"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/shadcnui/dropdown-menu";

interface StatusCellProps {
    value: string;
    userRole: string; // Add userRole to determine the role
}

export function StatusCell({ value, userRole }: StatusCellProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-gray-100 text-gray-800 border-gray-300";
            case "Assigned":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Scheduled":
                return "bg-purple-100 text-purple-800 border-purple-300";
            case "Ongoing":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Overdue":
                return "bg-red-100 text-red-800 border-red-300";
            case "Completed":
                return "bg-green-100 text-green-800 border-green-300";
            case "For Budget Request":
                return "bg-orange-100 text-orange-800 border-orange-300";
            case "Cancelled":
                return "bg-gray-200 text-gray-600 border-gray-400";
            case "Declined":
                return "bg-pink-100 text-pink-800 border-pink-300";
            case "Deleted":
                return "bg-black text-white border-black";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
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
        "Deleted",
    ];

    // Filter statuses based on user role
    const statuses =
        userRole === "maintenance_personnel"
            ? ["Assigned", "Ongoing", "Completed"] // Restricted statuses for maintenance personnel
            : allStatuses; // All statuses for other roles

    return (
        <DropdownMenu>
            {userRole === "maintenance_personnel" ? (
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className={`px-2.5 py-1 h-8 border rounded flex items-center justify-between gap-1 ${getStatusColor(
                            value
                        )}`}
                    >
                        {value}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
            ) : (
                <span
                    className={`px-2.5 py-1 h-8 border rounded inline-flex items-center ${getStatusColor(
                        value
                    )}`}
                >
                    {value}
                </span>
            )}
            <DropdownMenuContent align="end">
                {statuses.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => console.log(`Status changed to ${status}`)}
                    >
                        {status}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
