import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/shadcnui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/shadcnui/table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
// import FullCalendar from "@fullcalendar/react"; // FullCalendar library
// import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
// import timeGridPlugin from "@fullcalendar/timegrid"; // Week view

const AssignedTask: React.FC = () => {
    const [activeTab, setActiveTab] = useState("list");

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    // Example work orders data
    const workOrders = [
        { id: 1, title: "Fix AC Unit", assignedTo: "User1", date: "2023-10-01" },
        { id: 2, title: "Repair Plumbing", assignedTo: "User1", date: "2023-10-02" },
    ];

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "title", headerName: "Title", width: 200 },
        { field: "assignedTo", headerName: "Assigned To", width: 150 },
        { field: "date", headerName: "Date", width: 150 },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Assigned Work Orders"/>

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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.title}</TableCell>
                                            <TableCell>{order.assignedTo}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
        // <div>
        //     <header>
        //         <h1>Work Orders</h1>
        //     </header>

        //     <Tabs value={activeTab} onChange={handleTabChange} centered>
        //         <Tab label="List" value="list" />
        //         <Tab label="Month" value="month" />
        //         <Tab label="Week" value="week" />
        //     </Tabs>

        //     <div style={{ marginTop: "20px" }}>
        //         {activeTab === "list" && (
        //             <div style={{ height: 400, width: "100%" }}>
        //                 <DataGrid rows={workOrders} columns={columns} pageSize={5} />
        //             </div>
        //         )}

        //         {activeTab === "month" && (
        //             <FullCalendar
        //                 plugins={[dayGridPlugin]}
        //                 initialView="dayGridMonth"
        //                 events={workOrders.map((order) => ({
        //                     title: order.title,
        //                     date: order.date,
        //                 }))}
        //             />
        //         )}

        //         {activeTab === "week" && (
        //             <FullCalendar
        //                 plugins={[timeGridPlugin]}
        //                 initialView="timeGridWeek"
        //                 events={workOrders.map((order) => ({
        //                     title: order.title,
        //                     date: order.date,
        //                 }))}
        //             />
        //         )}
        //     </div>
        // </div>
    );
};

export default AssignedTask;