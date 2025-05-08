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
}

export function StatusCell({ value }: StatusCellProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800 border-green-300";
            case "On Going":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Assigned":
                return "bg-blue-100 text-blue-800 border-blue-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    return (
    <DropdownMenu>
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
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => console.log("Status changed to Completed")}
                >
                    Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => console.log("Status changed to On Going")}
                >
                    On Going
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => console.log("Status changed to Assigned")}
                >
                    Assigned
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
