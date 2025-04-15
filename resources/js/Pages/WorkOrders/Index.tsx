import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { useState, ReactNode } from "react";
import CreateWorkOrderModal from "./CreateModal";
import EditWorkOrderModal from "./EditModal";
import { Hourglass, ClipboardCheck, FileText, Ban } from "lucide-react";

interface WorkOrder {
    id: number;
    report_description: string;
    location: { name: string } | null;
    status: string;
    priority: string;
    requested_at: string;
    location_id: string;
    work_order_type: string;
    label: string;
    remarks: string;
    images: string[];
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
    const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);

    const tabs = ["Pending", "Accepted", "For Budget Request", "Declined"];

    const tabIcons: Record<string, ReactNode> = {
        Pending: <Hourglass className="w-5 h-5 sm:hidden" />,
        Accepted: <ClipboardCheck className="w-5 h-5 sm:hidden" />,
        "For Budget Request": <FileText className="w-5 h-5 sm:hidden" />,
        Declined: <Ban className="w-5 h-5 sm:hidden" />,
    };

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
            <Head title="Work Orders" />

            {/* Modals */}
            {isCreating && (
                <CreateWorkOrderModal
                    locations={locations}
                    user={user}
                    onClose={() => setIsCreating(false)}
                />
            )}

            {editingWorkOrder && (
                <EditWorkOrderModal
                    workOrder={editingWorkOrder}
                    locations={locations}
                    user={user}
                    onClose={() => setEditingWorkOrder(null)}
                />
            )}

            {/* Header */}
            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 flex items-center text-black">
                        <h1 className="text-2xl font-semibold mr-6">
                            Work Orders
                        </h1>
                        <PrimaryButton
                            onClick={() => setIsCreating(true)}
                            className="bg-secondary text-white hover:bg-primary transition-all duration-300 
                                flex items-center justify-center 
                                w-10 h-10 rounded-full sm:w-auto sm:h-auto sm:rounded-md 
                                px-0 sm:px-5 py-0 sm:py-2 gap-0 sm:gap-2"
                        >
                            <span className="text-xl">+</span>
                            <span className="hidden sm:inline">Add Work Order</span>
                        </PrimaryButton>
                    </div>
                </div>
            </header>

            {/* Sticky Tabs */}
            <div className="sticky top-[64px] z-30 bg-whites pt-4 pb-2 shadow-sm sm:top-[72px]">
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm sm:text-base font-medium transition-colors duration-200 rounded-md border ${
                                activeTab === tab
                                    ? "bg-secondary text-white border-secondary"
                                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            <span className="sm:hidden">{tabIcons[tab]}</span>
                            <span className="hidden sm:inline">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table View (Desktop) */}
            <div className="hidden md:block overflow-x-auto bg-white shadow-lg rounded-md mt-4">
                <table className="w-full table-auto border-collapse text-sm text-gray-700">
                    <thead>
                        <tr className="bg-green-100 text-black">
                            <th className="border px-6 py-3 text-left">ID</th>
                            <th className="border px-6 py-3 text-left">Description</th>
                            <th className="border px-6 py-3 text-left">Location</th>
                            <th className="border px-6 py-3 text-left">Status</th>
                            <th className="border px-6 py-3 text-left">Priority</th>
                            <th className="border px-6 py-3 text-left">Requested At</th>
                            <th className="border px-6 py-3 text-left">Actions</th>
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
                                    {new Date(workOrder.requested_at).toLocaleDateString()}
                                </td>
                                <td className="border px-6 py-4">
                                    <PrimaryButton
                                        className="bg-secondary"
                                        onClick={() => setEditingWorkOrder(workOrder)}
                                    >
                                        Edit
                                    </PrimaryButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mt-4 px-4">
                {filteredWorkOrders.map((workOrder) => (
                    <div
                        key={workOrder.id}
                        className="border rounded-lg shadow-md p-4 bg-white flex flex-col gap-4"
                    >
                        <div>
                            <span className="text-sm font-semibold text-gray-500">ID:</span>
                            <div className="text-base font-medium">{workOrder.id}</div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">
                                Description:
                            </span>
                            <div className="text-base">{workOrder.report_description}</div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">
                                Location:
                            </span>
                            <div className="text-base">
                                {workOrder.location?.name || "N/A"}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">Status:</span>
                            <div className="text-base">{workOrder.status}</div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">
                                Priority:
                            </span>
                            <div className="text-base">{workOrder.priority}</div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">
                                Requested At:
                            </span>
                            <div className="text-base">
                                {new Date(workOrder.requested_at).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mt-4 self-end">
                            <PrimaryButton
                                className="bg-secondary px-4 py-1 text-sm"
                                onClick={() => setEditingWorkOrder(workOrder)}
                            >
                                Edit
                            </PrimaryButton>
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
