import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import CreateWorkOrderModal from "./CreateModal";

interface WorkOrder {
    id: number;
    report_description: string;
    location: { name: string } | null;
    status: string;
    priority: string;
    requested_at: string;
}

export default function WorkOrders({
    workOrders,
    locations,
    user,
}: PageProps<{
    workOrders: WorkOrder[];
    locations: { id: number; name: string }[];
    user: { id: number; name: string; permissions: string[] };
}>) {
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState("Pending");

    const tabs = ["Pending", "Accepted", "For Budget Request", "Declined"];

    // Filter work orders based on the selected tab
    const filteredWorkOrders = workOrders.filter((workOrder) => {
        if (activeTab === "Pending") {
            return workOrder.status === "Pending";
        }
        if (activeTab === "Accepted") {
            return ["Assigned", "Ongoing", "Overdue", "Completed"].includes(
                workOrder.status
            );
        }
        if (activeTab === "For Budget Request") {
            return workOrder.status === "For Budget Request";
        }
        if (activeTab === "Declined") {
            return workOrder.status === "Cancelled";
        }
        return true;
    });

    return (
        <AuthenticatedLayout>
            {isCreating && (
                <CreateWorkOrderModal
                    locations={locations}
                    user={user}
                    onClose={() => setIsCreating(false)}
                />
            )}
            <Head title="Work Orders" />

            {/* Header */}
            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 flex items-center text-black">
                        <h1 className="text-2xl font-semibold mr-6">
                            Work Orders
                        </h1>
                        <PrimaryButton
                            onClick={() => setIsCreating(true)}
                            className="bg-secondary text-white px-5 py-2 rounded-md hover:bg-primary transition-all duration-300"
                        >
                            <span className="mr-2 text-lg">+</span>
                            <span>Add Work Order</span>
                        </PrimaryButton>
                    </div>
                </div>
            </header>

            {/* Tabs (UI only) */}
            <div className="mb-6">
                <div className="inline-flex rounded-md overflow-hidden border border-gray-300">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 text-lg font-medium transition-colors duration-200 ${
                                activeTab === tab
                                    ? "bg-secondary text-white"
                                    : "bg-white text-black hover:bg-gray-100"
                            } ${
                                index !== 0 ? "border-l border-gray-300" : ""
                            } rounded-tl-md rounded-tr-md`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table (filtered based on the active tab) */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-md">
                <table className="w-full table-auto border-collapse text-sm text-gray-700">
                    <thead>
                        <tr className="bg-green-100 text-black">
                            <th className="border px-6 py-3 text-left">ID</th>
                            <th className="border px-6 py-3 text-left">
                                Description
                            </th>
                            <th className="border px-6 py-3 text-left">
                                Location
                            </th>
                            <th className="border px-6 py-3 text-left">
                                Status
                            </th>
                            <th className="border px-6 py-3 text-left">
                                Priority
                            </th>
                            <th className="border px-6 py-3 text-left">
                                Requested At
                            </th>
                            <th className="border px-6 py-3 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWorkOrders.map((workOrder) => (
                            <tr key={workOrder.id} className="hover:bg-gray-50">
                                <td className="border px-6 py-4 text-center">
                                    {workOrder.id}
                                </td>
                                <td className="border px-6 py-4">
                                    {workOrder.report_description}
                                </td>
                                <td className="border px-6 py-4">
                                    {workOrder.location?.name || "N/A"}
                                </td>
                                <td className="border px-6 py-4">
                                    {workOrder.status}
                                </td>
                                <td className="border px-6 py-4">
                                    {workOrder.priority}
                                </td>
                                <td className="border px-6 py-4">
                                    {new Date(
                                        workOrder.requested_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="border px-6 py-4">
                                    <Link
                                        href={`/work-orders/${workOrder.id}/edit`}
                                        className="text-white bg-secondary px-4 py-2 rounded-md hover:bg-secondary/90 transition"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
