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
import { getPriorityColor } from "@/utils/getPriorityColor";

// import FullCalendar from "@fullcalendar/react"; // FullCalendar library
// import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
// import timeGridPlugin from "@fullcalendar/timegrid"; // Week view

export default function AssignedTask({ user, workOrders }: { user: {id: number; roles: { id: number; name: string; }[]; permissions: string[]; }; workOrders: any }) {
    const [activeTab, setActiveTab] = useState("list");

    
    // Define columns for the data table
    const columns: ColumnDef<{ id: number; location?: { name?: string }; }>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: {
                headerClassName: "w-12",
                searchable: true,
            },
        },
        {
            accessorKey: "assigned_at",
            header: "Date Assigned",
            cell: ({ row }) => <div>{row.getValue("assigned_at")}</div>,
            meta: {
                headerClassName: "w-[8rem]",
            },
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => <div>{row.original.location?.name || "N/A"}</div>,
            meta: {
                headerClassName: "max-w-16",
                searchable: true,
                filterable: true,
            },
        },
        {
            accessorKey: "report_description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("report_description")}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "w-[22%]",
                cellClassName: "max-w-16 px-2",
                searchable: true,
            },
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => (
                <div
                    className={`px-2 py-1 rounded ${getPriorityColor(
                        row.getValue("priority")
                    )}`}
                >
                    {row.getValue("priority")}
                </div>
            ),
            meta: {
                headerClassName: "max-w-20",    
                cellClassName: "text-center",    
                filterable: true,
            },
        },
        {
            accessorKey: "scheduled_at",
            header: "Target Date",
            cell: ({ row }) => <div>{row.getValue("scheduled_at")}</div>,
            meta: {
                headerClassName: "max-w-20",
                cellClassName: "text-center",   
                searchable: true,
            },
        },
        {
            accessorKey: "work_order_type",
            header: "Work Order Type",
            cell: ({ row }) => <div>{row.getValue("work_order_type")}</div>,
            enableSorting: false,
            meta: {
                headerClassName: "w-[10rem]",
                filterable: true,
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <StatusCell value={row.getValue("status")} user={user} row={row}/>,
            enableSorting: false,
            meta: {
                filterable: true,
            }
            
        },
        {
            id: "actions",
            header: "Action",
            cell: () => (
                <Button className="bg-primary hover:bg-secondary text-white text-xs h-6 w-14 rounded">
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
                                <Datatable columns={columns} data={workOrders} placeholder="Search here"/>
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
}
