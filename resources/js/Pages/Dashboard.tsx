import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import Overview from "./Admin/Overview";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/shadcnui/card";
import { getStatusColor } from "@/utils/getStatusColor";
import { useState } from "react";
import ViewWorkOrderModal from "./WorkOrders/components/ViewWorkOrderModal";
import EventServicesDashboard from "./EventServices/EventServicesDashboard";
import { UpcomingWorkOrdersTable } from "@/Components/UpcomingWorkOrdersTable";
import { UpcomingPreventiveMaintenanceTable } from "@/Components/UpcomingPreventiveMaintenanceTable";
import { UpcomingCompliancesTable } from "@/Components/UpcomingCompliancesTable";

interface DashboardProps {
    workOrderRequests: {
        id: number;
        location: { id: number; name: string };
        report_description: string;
        requested_at: string;
        requested_by: { id: number; name: string };
        status: string;
        attachments: string[];
    }[];
    assignedWorkOrders: [];
    pendingWorkOrders: [];
    declinedWorkOrders: [];
    upcomingWorkOrders: [];
    upcomingPreventiveMaintenance: [];
    locations: { id: number; name: string }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
    maintenancePersonnel: {
        id: number;
        first_name: string;
        last_name: string;
        roles: { id: number; name: string };
    }[];
    assets: any[];
    workOrders: any[];
    maintenanceSchedules: any[];
    upcomingCompliances: {
        id: number;
        scheduled_at: string;
        compliance_area: string;
        location: { id: number; name: string };
        assigned_to: { id: number; first_name: string; last_name: string };
        status: string;
        report_description: string;
        requested_at: string;
        requested_by: { id: number; first_name: string; last_name: string };
        approved_at: string;
        approved_by: string;
        remarks: string;
        attachments: string[];
        priority: string;
    }[];
}

export default function Dashboard({
    workOrderRequests,
    assignedWorkOrders,
    pendingWorkOrders,
    declinedWorkOrders,
    upcomingWorkOrders,
    upcomingPreventiveMaintenance,
    upcomingCompliances,
    locations,
    user,
    maintenancePersonnel,
}: DashboardProps) {
    const [isViewingWorkOrder, setIsViewingWorkOrder] = useState<any>(null);

    const roleNames = new Set(
        user.roles?.map((role: { name: string }) => role.name)
    );

    const isDepartmentHead = roleNames.has("department_head");
    const isMaintenancePersonnel = roleNames.has("maintenance_personnel");
    const isGasdCoordinator = roleNames.has("gasd_coordinator");
    const isCommunicationsOfficer = roleNames.has("communications_officer");
    const isSuperAdmin = roleNames.has("super_admin");

    // Tab state for super admin
    const [activeTab, setActiveTab] = useState<"cmms" | "eventservices">(
        "cmms"
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {isViewingWorkOrder && (
                <ViewWorkOrderModal
                    workOrder={isViewingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setIsViewingWorkOrder(null)}
                />
            )}

            {/* Super Admin */}
            {isSuperAdmin ? (
                <div className="space-y-4">
                    {/* Welcome Card */}
                    <Card className="overflow-hidden bg-white shadow-sm rounded">
                        <div className="p-4 text-black text-lg sm:text-xl sm:p-6 text-center xs:text-left">
                            Welcome, {user.name}!👋🏻
                        </div>
                    </Card>
                    <div className="flex gap-2 mb-6">
                        <button
                            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
                                activeTab === "cmms"
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("cmms")}
                        >
                            CMMS
                        </button>
                        <button
                            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
                                activeTab === "eventservices"
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("eventservices")}
                        >
                            Event Services
                        </button>
                    </div>
                    {activeTab === "cmms" ? (
                        <div className="space-y-6 h-full">    
                            {/* Overview */}
                            <Card className="flex justify-center overflow-hidden bg-primary p-6 shadow-sm rounded">
                                <Overview />
                            </Card>
    
                            {/* Upcoming Work Orders and Preventive Maintenance */}
                            <div className="flex flex-col xl:flex-row gap-4">
                                {/* Work Orders */}
                                <Card className="flex justify-start overflow-hidden shadow-sm rounded w-full p-4 max-h-[20rem] overflow-y-auto scrollbar-hide hover:overflow-y-scroll">
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Upcoming Work Orders
                                            </h1>
                                            <Link
                                                href={route(
                                                    "work-orders.index"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                        <UpcomingWorkOrdersTable
                                            data={upcomingWorkOrders}
                                            locations={locations}
                                            user={user}
                                        />
                                    </div>
                                </Card>
                                {/* Preventive Maintenance */}
                                <Card className="flex justify-start overflow-hidden shadow-sm rounded w-full max-h-[20rem]">
                                    <div className="flex flex-col gap-4 p-4 w-full">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Upcoming Preventive Maintenance
                                            </h1>
                                            <Link
                                                href={route(
                                                    "work-orders.preventive-maintenance"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                        <UpcomingPreventiveMaintenanceTable
                                            data={
                                                upcomingPreventiveMaintenance
                                            }
                                            locations={locations}
                                            user={user}
                                        />
                                    </div>
                                </Card>
                            </div>
    
                            {/* Upcoming Compliances */}
                            <div>
                                <Card className="flex justify-start overflow-hidden shadow-sm rounded w-full max-h-[20rem]">
                                    <div className="flex flex-col gap-4 p-4 w-full">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Upcoming Compliances
                                            </h1>
                                            <Link
                                                href={route(
                                                    "work-orders.compliance-and-safety"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                        <UpcomingCompliancesTable
                                            data={upcomingCompliances}
                                            locations={locations}
                                            user={user}
                                            maintenancePersonnel={maintenancePersonnel}
                                        />
                                    </div>
                                </Card>
                            </div>
                        </div>
                     ) : activeTab === "eventservices" ? (
                        <EventServicesDashboard bookings={[]} />
                     ) : (
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                No active tab
                            </h1>
                        </div>
                     )}
                </div>
            ) : isCommunicationsOfficer ? (
                <EventServicesDashboard bookings={[]} />
            ) : (
                <div className="space-y-6 h-full">
                    {/* Welcome Card */}
                    <Card className="overflow-hidden bg-white shadow-sm rounded">
                        <div className="p-4 text-black text-lg sm:text-xl sm:p-6 text-center xs:text-left">
                            Welcome, {user.name}!👋🏻
                        </div>
                    </Card>

                    {/* GASD Coordinator */}
                    {isGasdCoordinator && (
                        <>
                            {/* Overview */}
                            <Card className="flex justify-center overflow-hidden bg-primary p-6 shadow-sm rounded">
                                <Overview />
                            </Card>

                            {/* Upcoming Work Orders and Preventive Maintenance */}
                            <div className="flex flex-col xl:flex-row gap-4">
                                {/* Work Orders */}
                                <Card className="flex justify-start overflow-hidden shadow-sm rounded w-full p-4 max-h-[20rem] overflow-y-auto scrollbar-hide hover:overflow-y-scroll">
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Upcoming Work Orders
                                            </h1>
                                            <Link
                                                href={route(
                                                    "work-orders.index"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                        <UpcomingWorkOrdersTable
                                            data={upcomingWorkOrders}
                                            locations={locations}
                                            user={user}
                                        />
                                    </div>
                                </Card>
                                {/* Preventive Maintenance */}
                                <Card className="flex justify-start overflow-hidden shadow-sm rounded w-full max-h-[20rem]">
                                    <div className="flex flex-col gap-4 p-4 w-full">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Upcoming Preventive Maintenance
                                            </h1>
                                            <Link
                                                href={route(
                                                    "work-orders.preventive-maintenance"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                        <UpcomingPreventiveMaintenanceTable
                                            data={upcomingPreventiveMaintenance}
                                            locations={locations}
                                            user={user}
                                        />
                                    </div>
                                </Card>
                            </div>

                            {/* Upcoming Compliances */}
                            <div>
                                <Card className="flex justify-start overflow-hidden shadow-sm rounded w-full max-h-[20rem]">
                                    <div className="flex flex-col gap-4 p-4 w-full">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Upcoming Compliances
                                            </h1>
                                            <Link
                                                href={route(
                                                    "work-orders.compliance-and-safety"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                        <UpcomingCompliancesTable
                                            data={upcomingCompliances}
                                            locations={locations}
                                            user={user}
                                            maintenancePersonnel={maintenancePersonnel}
                                        />
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* Internal Requesters */}
                    {(isMaintenancePersonnel || isDepartmentHead) && (
                        <>
                            {/* Work Orders Statistics */}
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                {/* Department Head - Total Work Order Requests */}
                                {isDepartmentHead && (
                                <Card className="w-full text-white bg-primary hover:shadow-lg hover:scale-105 transition-all duration-300">
                                    <Link href={route("work-orders.index")}>
                                        <CardHeader>
                                            <CardTitle>
                                                My Work Order Requests
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold text-white">
                                                {workOrderRequests.length}
                                            </p>
                                        </CardContent>
                                    </Link>
                                </Card>
                                )}

                                {/* Maintenance Personnel - Total Assigned Tasks */}
                                {isMaintenancePersonnel && (
                                <Card className="w-full text-white bg-primary hover:shadow-lg hover:scale-105 transition-all duration-300">
                                    <Link href={route("work-orders.assigned-tasks")}>
                                        <CardHeader>
                                            <CardTitle>
                                                My Assigned Tasks
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold text-white">
                                                {assignedWorkOrders.length}
                                            </p>
                                        </CardContent>
                                    </Link>
                                </Card>
                                )}

                                {/* My Pending and Declined Work Orders */}
                                <div className="flex w-full gap-4">
                                    <Card className="w-full text-white bg-secondary/50 hover:shadow-lg hover:scale-105 hover:bg-secondary transition-all duration-300">
                                        <CardHeader>
                                            <CardTitle>
                                                Pending Work Orders
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {pendingWorkOrders.length}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="w-full text-white bg-destructive/70 hover:shadow-lg hover:scale-105 hover:bg-destructive transition-all duration-300">
                                        <CardHeader>
                                            <CardTitle>
                                                Declined Work Orders
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {declinedWorkOrders.length}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {isMaintenancePersonnel && (
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Maintenance Personnel - Assigned to me */}
                                <Card className="w-full md:w-[49.2%]">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-primary text-base sm:text-md flex justify-between items-center">
                                            Assigned to me
                                            <Link
                                                href={route(
                                                    "work-orders.assigned-tasks"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 max-h-[18rem] overflow-y-auto">
                                        {assignedWorkOrders
                                            .filter((workOrder: any) => 
                                                workOrder.assigned_to?.id === user.id
                                            )
                                            .sort((a: any, b: any) => new Date(b.scheduled_at).getTime() -
                                                    new Date(a.scheduled_at).getTime())
                                            .slice(0, 3) // Limiter on how many assigned tasks to show
                                            .map((workOrder: any) => (
                                                <Card
                                                    key={workOrder.id}
                                                    onClick={() => {setIsViewingWorkOrder(workOrder);}}
                                                    className="hover:bg-muted hover:shadow-lg transition-all duration-300 cursor-pointer"
                                                >
                                                    <CardHeader>
                                                        <CardTitle className="flex justify-between items-start text-xs">
                                                            <p className="bg-primary rounded-md px-2 py-1 text-xs text-white">
                                                                <span className="font-bold">ID:</span>{" "}{workOrder.id}
                                                            </p>
                                                            <span className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(workOrder.status)}`}>
                                                                {workOrder.status}
                                                            </span>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {/* Info Section */}
                                                        <div className="space-y-2 pr-8 text-gray-800 text-xs sm:text-sm">
                                                            {/* Date Requested */}
                                                            <p>
                                                                <span className="font-bold text-primary">
                                                                    Date
                                                                    Requested:
                                                                </span>{" "}
                                                                {new Date(
                                                                    workOrder.requested_at
                                                                ).toLocaleDateString()}
                                                            </p>

                                                            {/* Location */}
                                                            <p>
                                                                <span className="font-bold text-primary">
                                                                    Location:
                                                                </span>{" "}
                                                                {workOrder
                                                                    .location
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </p>

                                                            {/* Description */}
                                                            <p className="items-start truncate my-2 overflow-y-auto hover:overflow-y-scroll">
                                                                <span className="font-bold text-primary ">
                                                                    Description:
                                                                </span>{" "}
                                                                {
                                                                    workOrder.report_description
                                                                }
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </CardContent>
                                </Card>

                                {/* Maintenance Personnel - My Recent Work Orders */}
                                <Card className="w-full md:w-[49.2%]">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-primary text-base sm:text-md flex justify-between items-center">
                                            My Recent Work Orders
                                            <Link
                                                href={route(
                                                    "work-orders.index"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 max-h-[18rem] overflow-y-auto">
                                        {workOrderRequests
                                            .sort(
                                                (a: any, b: any) =>
                                                    new Date(
                                                        b.requested_at
                                                    ).getTime() -
                                                    new Date(
                                                        a.requested_at
                                                    ).getTime()
                                            )
                                            .slice(0, 3) // Limiter on how many of my work orders to show
                                            .map((workOrder: any) => (
                                                <Card
                                                    key={workOrder.id}
                                                    onClick={() => {setIsViewingWorkOrder(workOrder);}}
                                                    className="hover:bg-muted hover:shadow-lg transition-all duration-300 cursor-pointer"
                                                >
                                                    <CardHeader>
                                                        <CardTitle className="flex justify-between items-start text-xs">
                                                            <p className="bg-primary rounded-md px-2 py-1 text-xs text-white">
                                                                <span className="font-bold">ID:</span>{" "}{workOrder.id}
                                                            </p>
                                                            <span className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(workOrder.status)}`}>
                                                                {workOrder.status}
                                                            </span>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {/* Info Section */}
                                                        <div className="space-y-2 pr-8 text-gray-800 text-xs sm:text-sm">
                                                            {/* Date Requested */}
                                                            <p>
                                                                <span className="font-bold text-primary">
                                                                    Date
                                                                    Requested:
                                                                </span>{" "}
                                                                {new Date(
                                                                    workOrder.requested_at
                                                                ).toLocaleDateString()}
                                                            </p>

                                                            {/* Location */}
                                                            <p>
                                                                <span className="font-bold text-primary">
                                                                    Location:
                                                                </span>{" "}
                                                                {workOrder
                                                                    .location
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </p>

                                                            {/* Description */}
                                                            <p className="items-start truncate my-2 overflow-y-auto hover:overflow-y-scroll">
                                                                <span className="font-bold text-primary ">
                                                                    Description:
                                                                </span>{" "}
                                                                {
                                                                    workOrder.report_description
                                                                }
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </CardContent>
                                </Card>
                            </div>
                            )}

                            {/* Department Head - My Recent Work Orders */}
                                {isDepartmentHead && (
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle className="text-primary text-base sm:text-md flex justify-between items-center">
                                            My Recent Work Orders
                                            <Link
                                                href={route(
                                                    "work-orders.index"
                                                )}
                                                className="text-sm underline text-primary hover:text-primary/80 mr-1"
                                            >
                                                View All
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 max-h-[25rem] overflow-y-auto">
                                        {workOrderRequests
                                            .sort(
                                                (a: any, b: any) =>
                                                    new Date(
                                                        b.requested_at
                                                    ).getTime() -
                                                    new Date(
                                                        a.requested_at
                                                    ).getTime()
                                            )
                                            .slice(0, 3)
                                            .map((workOrder: any) => (
                                                <Card
                                                    key={workOrder.id}
                                                    onClick={() => {setIsViewingWorkOrder(workOrder);}}
                                                    className="hover:bg-muted hover:shadow-lg transition-all duration-300 cursor-pointer"
                                                >
                                                    <CardHeader>
                                                        <CardTitle className="flex justify-between items-start text-xs">
                                                            <p className="bg-primary rounded-md px-2 py-1 text-xs text-white">
                                                                <span className="font-bold">
                                                                    ID:
                                                                </span>{" "}
                                                                {workOrder.id}
                                                            </p>
                                                            <span
                                                                className={`font-semibold px-2.5 py-1 border rounded ${getStatusColor(
                                                                    workOrder.status
                                                                )}`}
                                                            >
                                                                {
                                                                    workOrder.status
                                                                }
                                                            </span>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {/* Info Section */}
                                                        <div className="space-y-2 pr-8 text-gray-800">
                                                            {/* Date Requested */}
                                                            <p>
                                                                <span className="font-bold text-primary">
                                                                    Date
                                                                    Requested:
                                                                </span>{" "}
                                                                {new Date(
                                                                    workOrder.requested_at
                                                                ).toLocaleDateString()}
                                                            </p>

                                                            {/* Location */}
                                                            <p>
                                                                <span className="font-bold text-primary">
                                                                    Location:
                                                                </span>{" "}
                                                                {workOrder
                                                                    .location
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </p>

                                                            {/* Description */}
                                                            <p className="items-start truncate my-2 overflow-y-auto hover:overflow-y-scroll">
                                                                <span className="font-bold text-primary ">
                                                                    Description:
                                                                </span>{" "}
                                                                {
                                                                    workOrder.report_description
                                                                }
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
