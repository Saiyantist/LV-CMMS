import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Chart from "./Admin/Chart";

export default function Dashboard() {
    const user = usePage().props.auth.user;

    // Hide chart for external_requester
    const isExternalRequester = user.roles?.some?.(
        (role: { name: string }) => role.name === "external_requester"
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Welcome Card */}
                <div className="overflow-hidden bg-white shadow-sm rounded-lg">
                    <div className="p-6 text-black text-lg sm:text-xl text-center sm:text-left">
                        Welcome {user.first_name} {user.last_name}!
                    </div>
                </div>

                {/* Chart Section */}
                {!isExternalRequester && (
                    <div className="flex justify-center overflow-hidden bg-white shadow-sm rounded-lg p-6">
                        <Chart />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
