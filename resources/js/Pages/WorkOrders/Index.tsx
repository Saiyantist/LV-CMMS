import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { useState, ReactNode, useEffect } from "react";
import CreateWorkOrderModal from "./CreateModal";
import EditWorkOrderModal from "./EditModal";

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
    const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(
        null
    );
    const [showScrollUpButton, setShowScrollUpButton] = useState(false);

    const tabs = ["Pending", "Accepted", "For Budget Request", "Declined"];

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

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollUpButton(true);
        } else {
            setShowScrollUpButton(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 sm:gap-6 text-black">
                        {/* Title */}
                        <h1 className="text-2xl font-semibold text-center sm:text-left">
                            Work Orders
                        </h1>

                        {/* Button */}
                        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                            <PrimaryButton
                                onClick={() => setIsCreating(true)}
                                className="bg-secondary text-white hover:bg-primary transition-all duration-300 
                        text-sm sm:text-base px-5 py-2 rounded-md text-center justify-center w-full sm:w-auto"
                            >
                                Add Work Order
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs - Desktop View */}
            <div className="hidden md:flex divide-x divide-gray-300 border border-gray-300 rounded-md overflow-hidden mx-4 mt-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full px-3 py-2 text-sm sm:text-base text-center font-medium transition-colors duration-200 ${
                            activeTab === tab
                                ? "bg-secondary text-white"
                                : "bg-white text-black hover:bg-gray-100"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tabs - Mobile Dropdown */}
            <div className="md:hidden flex justify-end px-4 mt-4">
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                >
                    {tabs.map((tab) => (
                        <option key={tab} value={tab}>
                            {tab}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table View (Desktop) */}
            <div className="hidden md:block overflow-x-auto bg-white shadow-lg rounded-md mt-4">
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
                                    <PrimaryButton
                                        className="bg-secondary"
                                        onClick={() =>
                                            setEditingWorkOrder(workOrder)
                                        }
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
                            <span className="text-sm font-semibold text-gray-500">
                                ID:
                            </span>
                            <div className="text-base font-medium">
                                {workOrder.id}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">
                                Description:
                            </span>
                            <div className="text-base">
                                {workOrder.report_description}
                            </div>
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
                            <span className="text-sm font-semibold text-gray-500">
                                Status:
                            </span>
                            <div className="text-base">{workOrder.status}</div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">
                                Priority:
                            </span>
                            <div className="text-base">
                                {workOrder.priority}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-gray-500">
                                Requested At:
                            </span>
                            <div className="text-base">
                                {new Date(
                                    workOrder.requested_at
                                ).toLocaleDateString()}
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

            {/* Scroll Up Button */}
            {showScrollUpButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 bg-secondary text-white p-3 rounded-full shadow-lg"
                >
                    ↑
                </button>
            )}
        </AuthenticatedLayout>
    );
}
