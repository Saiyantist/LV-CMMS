import React, { useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/Components/shadcnui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/shadcnui/table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/shadcnui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/Components/shadcnui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Datatable } from "./components/Datatable";
import { StatusCell } from "./components/StatusCell";

// import FullCalendar from "@fullcalendar/react"; // FullCalendar library
// import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
// import timeGridPlugin from "@fullcalendar/timegrid"; // Week view

// Define the WorkOrder interface
interface WorkOrder {
    id: string;
    location: string;
    description: string;
    workOrderType: string;
    dateAssigned: string;
    targetDate: string;
    priority: "High" | "Medium" | "Low" | "Critical";
    status: "Completed" | "On Going" | "Assigned";
}

const AssignedTask: React.FC = () => {
    const [activeTab, setActiveTab] = useState("list");

    // Example work orders data
    const workOrders: WorkOrder[] = [
        {
            id: "1",
            location: "DSR 401",
            description: "Fix the air conditioning unit",
            workOrderType: "Maintenance",
            dateAssigned: "March 02, 2025",
            targetDate: "December 15, 2023",
            priority: "High",
            status: "Completed",
        },
        {
            id: "2",
            location: "DSR 402",
            description: "Repair the broken window",
            workOrderType: "Repair",
            dateAssigned: "March 02, 2025",
            targetDate: "December 20, 2023",
            priority: "Medium",
            status: "On Going",
        },
        {
            id: "3",
            location: "MIS Office",
            description: "Install new network cables",
            workOrderType: "Installation",
            dateAssigned: "March 02, 2025",
            targetDate: "January 10, 2024",
            priority: "Low",
            status: "On Going",
        },
        {
            id: "4",
            location: "DSR 401",
            description: "Replace the ceiling lights",
            workOrderType: "Replacement",
            dateAssigned: "March 02, 2025",
            targetDate: "January 05, 2024",
            priority: "Critical",
            status: "Assigned",
        },
        {
            id: "5",
            location: "DSR 401",
            description: "Paint the office walls",
            workOrderType: "Renovation",
            dateAssigned: "March 02, 2025",
            targetDate: "December 25, 2023",
            priority: "Low",
            status: "Assigned",
        },
        {
            id: "6",
            location: "DSR 401",
            description: "Service the fire extinguishers",
            workOrderType: "Inspection",
            dateAssigned: "March 02, 2025",
            targetDate: "January 15, 2024",
            priority: "Low",
            status: "Assigned",
        },
        {
            id: "7",
            location: "DSR 401",
            description: "Clean the carpet in the lobby",
            workOrderType: "Cleaning",
            dateAssigned: "March 02, 2025",
            targetDate: "December 30, 2023",
            priority: "Low",
            status: "Assigned",
        },
        {
            id: "8",
            location: "DSR 403",
            description: "Fix the leaking faucet",
            workOrderType: "Repair",
            dateAssigned: "March 03, 2025",
            targetDate: "December 18, 2023",
            priority: "Medium",
            status: "On Going",
        },
        {
            id: "9",
            location: "DSR 404",
            description: "Replace the broken door lock",
            workOrderType: "Replacement",
            dateAssigned: "March 03, 2025",
            targetDate: "December 22, 2023",
            priority: "High",
            status: "Assigned",
        },
        {
            id: "10",
            location: "MIS Office",
            description: "Upgrade the server hardware",
            workOrderType: "Upgrade",
            dateAssigned: "March 03, 2025",
            targetDate: "January 12, 2024",
            priority: "Critical",
            status: "On Going",
        },
        {
            id: "11",
            location: "DSR 405",
            description: "Inspect the electrical wiring",
            workOrderType: "Inspection",
            dateAssigned: "March 04, 2025",
            targetDate: "January 08, 2024",
            priority: "Medium",
            status: "Assigned",
        },
        {
            id: "12",
            location: "DSR 406",
            description: "Install new security cameras",
            workOrderType: "Installation",
            dateAssigned: "March 04, 2025",
            targetDate: "January 20, 2024",
            priority: "High",
            status: "On Going",
        },
        {
            id: "13",
            location: "DSR 407",
            description: "Repair the office chairs",
            workOrderType: "Repair",
            dateAssigned: "March 05, 2025",
            targetDate: "December 28, 2023",
            priority: "Low",
            status: "Completed",
        },
        {
            id: "14",
            location: "DSR 408",
            description: "Replace the projector screen",
            workOrderType: "Replacement",
            dateAssigned: "March 05, 2025",
            targetDate: "January 02, 2024",
            priority: "Medium",
            status: "Assigned",
        },
        {
            id: "15",
            location: "DSR 409",
            description: "Clean the office windows",
            workOrderType: "Cleaning",
            dateAssigned: "March 06, 2025",
            targetDate: "December 31, 2023",
            priority: "Low",
            status: "Assigned",
        },
        {
            id: "16",
            location: "DSR 410",
            description: "Inspect the HVAC system",
            workOrderType: "Inspection",
            dateAssigned: "March 06, 2025",
            targetDate: "January 18, 2024",
            priority: "High",
            status: "On Going",
        },
        {
            id: "17",
            location: "DSR 411",
            description: "Fix the broken tiles",
            workOrderType: "Repair",
            dateAssigned: "March 07, 2025",
            targetDate: "December 27, 2023",
            priority: "Medium",
            status: "Completed",
        },
        {
            id: "18",
            location: "DSR 412",
            description: "Replace the office furniture",
            workOrderType: "Replacement",
            dateAssigned: "March 07, 2025",
            targetDate: "January 06, 2024",
            priority: "Critical",
            status: "Assigned",
        },
        {
            id: "19",
            location: "DSR 413",
            description: "Paint the conference room",
            workOrderType: "Renovation",
            dateAssigned: "March 08, 2025",
            targetDate: "December 26, 2023",
            priority: "Low",
            status: "Assigned",
        },
        {
            id: "20",
            location: "DSR 414",
            description: "Install new lighting fixtures",
            workOrderType: "Installation",
            dateAssigned: "March 08, 2025",
            targetDate: "January 14, 2024",
            priority: "High",
            status: "On Going",
        },
        {
            id: "21",
            location: "DSR 415",
            description: "Service the office printers",
            workOrderType: "Maintenance",
            dateAssigned: "March 09, 2025",
            targetDate: "December 29, 2023",
            priority: "Medium",
            status: "Completed",
        },
        {
            id: "22",
            location: "DSR 416",
            description: "Inspect the plumbing system",
            workOrderType: "Inspection",
            dateAssigned: "March 09, 2025",
            targetDate: "January 16, 2024",
            priority: "Critical",
            status: "Assigned",
        },
        {
            id: "23",
            location: "DSR 417",
            description: "Clean the storage room",
            workOrderType: "Cleaning",
            dateAssigned: "March 10, 2025",
            targetDate: "December 24, 2023",
            priority: "Low",
            status: "Assigned",
        },
        {
            id: "24",
            location: "DSR 418",
            description: "Repair the office desks",
            workOrderType: "Repair",
            dateAssigned: "March 10, 2025",
            targetDate: "December 23, 2023",
            priority: "Medium",
            status: "On Going",
        },
        {
            id: "25",
            location: "DSR 419",
            description: "Replace the office carpets",
            workOrderType: "Replacement",
            dateAssigned: "March 11, 2025",
            targetDate: "January 04, 2024",
            priority: "High",
            status: "Assigned",
        },
        {
            id: "26",
            location: "DSR 420",
            description: "Upgrade the office computers",
            workOrderType: "Upgrade",
            dateAssigned: "March 11, 2025",
            targetDate: "January 13, 2024",
            priority: "Critical",
            status: "On Going",
        },
        {
            id: "27",
            location: "DSR 421",
            description: "Inspect the fire alarm system",
            workOrderType: "Inspection",
            dateAssigned: "March 12, 2025",
            targetDate: "January 17, 2024",
            priority: "High",
            status: "Assigned",
        },
        {
            id: "28",
            location: "DSR 422",
            description: "Fix the broken ceiling fan",
            workOrderType: "Repair",
            dateAssigned: "March 12, 2025",
            targetDate: "December 21, 2023",
            priority: "Medium",
            status: "Completed",
        },
        {
            id: "29",
            location: "DSR 423",
            description: "Replace the office blinds",
            workOrderType: "Replacement",
            dateAssigned: "March 13, 2025",
            targetDate: "January 03, 2024",
            priority: "Low",
            status: "Assigned",
        },
        {
            id: "30",
            location: "DSR 424",
            description: "Clean the office pantry",
            workOrderType: "Cleaning",
            dateAssigned: "March 13, 2025",
            targetDate: "December 19, 2023",
            priority: "Low",
            status: "Assigned",
        },
    ];

    // Define columns for the data table
    const columns: ColumnDef<WorkOrder>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => <div>{row.getValue("location")}</div>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("description")}</div>,
        },
        {
            accessorKey: "workOrderType",
            header: "Work Order Type",
            cell: ({ row }) => <div>{row.getValue("workOrderType")}</div>,
        },
        {
            accessorKey: "dateAssigned",
            header: "Date Assigned",
            cell: ({ row }) => <div>{row.getValue("dateAssigned")}</div>,
        },
        {
            accessorKey: "targetDate",
            header: "Target Date",
            cell: ({ row }) => <div>{row.getValue("targetDate")}</div>,
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => <div>{row.getValue("priority")}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <StatusCell value={row.getValue("status")} />,
        },
        {
            id: "actions",
            header: "Action",
            cell: () => (
                <Button className="bg-primary hover:bg-secondary text-white h-8 rounded">
                    View
                </Button>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Assigned Work Orders" />

            <div>
                <header>
                    <h1 className="text-xl font-bold mb-4">Work Orders</h1>
                </header>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-200 text-black rounded-md">
                        <TabsTrigger value="list">List</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                    </TabsList>

                    {/* List View */}
                    <TabsContent value="list">
                        <div className="overflow-x-auto">
                            <Datatable columns={columns} data={workOrders} />
                        </div>
                    </TabsContent>

                    {/* Month View */}
                    {/* <TabsContent value="month">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={workOrders.map((order) => ({
                                title: order.title,
                                date: order.date,
                            }))}
                        />
                    </TabsContent> */}

                    {/* Week View */}
                    {/* <TabsContent value="week">
                        <FullCalendar
                            plugins={[timeGridPlugin]}
                            initialView="timeGridWeek"
                            events={workOrders.map((order) => ({
                                title: order.title,
                                date: order.date,
                            }))}
                        />
                    </TabsContent> */}
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
};

export default AssignedTask;
