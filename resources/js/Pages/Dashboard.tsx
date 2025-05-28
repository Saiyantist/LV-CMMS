import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Chart from "./Admin/Chart";
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

interface DashboardProps {
    workOrderRequests: {
        id: number;
        location: { id: number; name: string };
        report_description: string;
        requested_at: string;
        requested_by: { id: number; name: string };
        status: string;
        images: string[];
    }[];
    pendingWorkOrders: [];
    declinedWorkOrders: [];
    locations: { id: number; name: string }[];
    user: {
        id: number;
        name: string;
        roles: { name: string }[];
        permissions: string[];
    };
}

export default function Dashboard({
    workOrderRequests,
    pendingWorkOrders,
    declinedWorkOrders,
    locations,
    user,
}: DashboardProps) {
    const [isViewingWorkOrder, setIsViewingWorkOrder] = useState<any>(null);

    // Hide chart for admin, super admin.
    const roleNames = new Set(
        user.roles?.map((role: { name: string }) => role.name)
    );

    const isSuperAdmin = roleNames.has("super_admin");
    const isGasdCoordinator = roleNames.has("gasd_coordinator");
    const isCommunicationsOfficer = roleNames.has("communications_officer");

    // Assume you receive `bookings` as a prop from the backend
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

            {isCommunicationsOfficer ? (
                <EventServicesDashboard bookings={[]} />
            ) : (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 h-full">
                    {/* Welcome Card */}
                    <Card className="overflow-hidden bg-white shadow rounded">
                        <div className="p-4 text-black text-lg sm:text-xl sm:p-6 text-center xs:text-left">
                            Welcome, {user.name}!👋🏻
                        </div>
                    </Card>

                    {/* Chart Section */}
                    {(isSuperAdmin || isGasdCoordinator) && (
                        <Card className="flex justify-center overflow-hidden bg-green p-6">
                            <Chart />
                        </Card>
                    )}

                    {/* My Work Orders */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        {/* Total Work Order Requests */}
                        <Card className="w-full text-white bg-primary hover:shadow-lg hover:scale-105 transition-all duration-300">
                            <CardHeader>
                                <CardTitle>My Work Order Requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-white">
                                    {workOrderRequests.length}
                                </p>
                            </CardContent>
                        </Card>

                        <div className="flex w-full gap-4">
                            <Card className="w-full text-white bg-secondary/50 hover:shadow-lg hover:scale-105 hover:bg-secondary transition-all duration-300">
                                <CardHeader>
                                    <CardTitle>Pending Work Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {pendingWorkOrders.length}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="w-full text-white bg-destructive/70 hover:shadow-lg hover:scale-105 hover:bg-destructive transition-all duration-300">
                                <CardHeader>
                                    <CardTitle>Declined Work Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {declinedWorkOrders.length}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* My Recent Work Orders */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 text-xs sm:text-sm">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="text-primary text-base sm:text-lg">
                                    My Recent Work Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-[25rem] overflow-y-auto">
                                {workOrderRequests
                                    .sort(
                                        (a: any, b: any) =>
                                            new Date(b.requested_at).getTime() -
                                            new Date(a.requested_at).getTime()
                                    )
                                    .slice(0, 3)
                                    .map((workOrder: any) => (
                                        <Card
                                            key={workOrder.id}
                                            onClick={() => {
                                                setIsViewingWorkOrder(
                                                    workOrder
                                                );
                                            }}
                                            className="hover:bg-muted hover:shadow-lg transition-all duration-300"
                                        >
                                            <CardHeader>
                                                <CardTitle className="flex justify-between items-start text-xs sm:text-base">
                                                    <p className="bg-primary rounded-md px-2 py-1 text-xs sm:text-sm text-white">
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
                                                        {workOrder.status}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {/* Info Section */}
                                                <div className="space-y-2 pr-8 text-gray-800">
                                                    {/* Date Requested */}
                                                    <p>
                                                        <span className="font-bold text-primary">
                                                            Date Requested:
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
                                                        {workOrder.location
                                                            ?.name || "N/A"}
                                                    </p>

                                                    {/* Description */}
                                                    <p className="items-start max-h-[100px] my-2 overflow-y-auto hover:overflow-y-scroll">
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
                    
                </div>
            )}
        </AuthenticatedLayout>
    );
}
