import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Chart from "./Admin/Chart";

export default function Dashboard() {
    const user = usePage().props.auth.user;

    // Hide chart for admin, super admin.
    const roleNames = new Set(
        user.roles?.map((role: { name: string }) => role.name)
    );

    const isSuperAdmin = roleNames.has("super_admin");
    const isGasdCoordinator = roleNames.has("gasd_coordinator");

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 h-full">
                {/* Welcome Card */}
                <div className="overflow-hidden bg-white shadow rounded">
                    <div className="p-4 text-black text-lg sm:text-xl sm:p-6 text-center xs:text-left">
                        Welcome, {user.first_name} {user.last_name}!👋🏻
                    </div>
                </div>

                {/* Chart Section */}
                {(isSuperAdmin || isGasdCoordinator) && (
                    <div className="flex justify-center overflow-hidden bg-green shadow-md rounded-lg p-6">
                        <Chart />
                    </div>
                )}

                <div className="hidden md:block">
                    Card
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
