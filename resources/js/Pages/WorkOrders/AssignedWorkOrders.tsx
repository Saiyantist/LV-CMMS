import React, { useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/Components/shadcnui/tabs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/Components/shadcnui/button";
import { ColumnDef } from "@tanstack/react-table";

import { Datatable } from "./components/Datatable";
import { StatusCell } from "./components/StatusCell";

// import FullCalendar from "@fullcalendar/react"; // FullCalendar library
// import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
// import timeGridPlugin from "@fullcalendar/timegrid"; // Week view

// Define the WorkOrder interface
interface WorkOrder {
    id: string;
    report_description: string;
    status: "Assigned" | "Ongoing" | "Completed";
    priority: "Low" | "Medium" | "High" | "Critical";
    location: { id: number; name: string };
}
const AssignedTask: React.FC = () => {
    const [activeTab, setActiveTab] = useState("list");
    const user = usePage().props.auth.user;

    const workOrders = usePage().props.workOrders as WorkOrder[];
    const userRole = user.roles[0].name; // Assuming the first role is the primary role

    // Define columns for the data table
    const columns: ColumnDef<WorkOrder>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: {
                headerClassName: "w-12",
            },
        },
        {
            accessorKey: "report_description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("report_description")}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "w-1/2",
            },
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => <div>{row.getValue("priority")}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <StatusCell value={row.getValue("status")} userRole={userRole} />,
            enableSorting: false,
        },
        {
            id: "actions",
            header: "Action",
            cell: () => (
                <Button className="bg-primary hover:bg-secondary text-white text-xs h-8 w-14 rounded">
                    View
                </Button>
            ),
            enableSorting: false,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Assigned Work Orders" />

            <div className="container mx-auto py-4">
                <header>
                    <h1 className="text-xl font-bold">Assigned Work Orders</h1>
                </header>

                {/* Tabs */}
                <div className="relative mt-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-gray-200 text-black rounded-md absolute top-0 left-0 z-10 mb-4">
                            <TabsTrigger value="list">List</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                        </TabsList>

                        {/* List View */}
                        <TabsContent value="list" className="mt-8">
                            <div className="overflow-x-auto">
                                <Datatable columns={columns} data={workOrders} />
                            </div>
                        </TabsContent>

                        {/* Month View */}
                        <TabsContent value="month" className="mt-8">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold mb-4">
                                    Month View
                                </h2>
                                {/* FullCalendar component for month view */}
                                {/* <FullCalendar
                                    plugins={[dayGridPlugin]}
                                    initialView="dayGridMonth"
                                    events={workOrders.map((wo) => ({
                                        title: wo.description,
                                        start: wo.dateAssigned,
                                        end: wo.targetDate,
                                    }))}
                                    eventColor="#378006"
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                                    }}
                                    buttonText={{
                                        today: "Today",
                                        month: "Month",
                                        week: "Week",
                                        day: "Day",
                                    }}
                                    height="auto"
                                    eventClick={(info) => {
                                        alert(
                                            `Event: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end}`
                                        );
                                    }}
                                /> */}
                            </div>
                        </TabsContent>
                        
                        {/* Week View */}
                        <TabsContent value="week" className="mt-8">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold mb-4">
                                    Week View
                                </h2>
                                {/* FullCalendar component for week view */}
                                {/* <FullCalendar
                                    plugins={[timeGridPlugin]}
                                    initialView="timeGridWeek"
                                    events={workOrders.map((wo) => ({
                                        title: wo.description,
                                        start: wo.dateAssigned,
                                        end: wo.targetDate,
                                    }))}
                                    eventColor="#378006"
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "timeGridWeek,timeGridDay",
                                    }}
                                    buttonText={{
                                        today: "Today",
                                        week: "Week",
                                        day: "Day",
                                    }}
                                    height="auto"
                                    eventClick={(info) => {
                                        alert(
                                            `Event: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end}`
                                        );
                                    }}
                                /> */}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AssignedTask;
