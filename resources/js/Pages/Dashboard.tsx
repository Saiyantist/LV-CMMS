import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Chart from "./Admin/Chart";

export default function Dashboard() {
    const user = usePage().props.auth.user;

    // Hide chart for admin, super admin.
    const roleNames = new Set(
        user.roles?.map((role: { name: string }) => role.name)
    );

    const isExternalRequester = roleNames.has("external_requester");
    const isInternalRequester = roleNames.has("internal_requester");
    const isMaintenancePersonnel = roleNames.has("maintenance_personnel");

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Welcome Card */}
                <div className="overflow-hidden bg-white shadow-lg rounded-lg">
                    <div className="p-6 text-black text-lg sm:text-xl text-center sm:text-left">
                        Welcome {user.first_name} {user.last_name}!
                    </div>
                </div>

                {/* Chart Section */}
                {!isExternalRequester &&
                    !isInternalRequester &&
                    !isMaintenancePersonnel && (
                        <div className="flex justify-center overflow-hidden bg-white shadow-xl rounded-lg p-6">
                            <Chart />
                        </div>
                    )}
            </div>
        </AuthenticatedLayout>
    );
}
