// IndexLayout.tsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateWorkOrderModal from "./CreateModal";
import EditWorkOrderModal from "./EditModal";
import ScrollToTopButton from "@/Components/ScrollToTopButton";

interface Props {
    user: any;
    locations: any[];
    filteredWorkOrders: any[];
    tabs: string[];
    activeTab: string;
    isCreating: boolean;
    editingWorkOrder: any;
    showScrollUpButton: boolean;
    handleDelete: (id: number) => void;
    setActiveTab: (tab: string) => void;
    setIsCreating: (val: boolean) => void;
    setEditingWorkOrder: (workOrder: any) => void;
    scrollToTop: () => void;
    getStatusColor: (status: string) => string;
    getPriorityColor: (priority: string) => string;
}

export default function IndexLayout({
    user,
    locations,
    filteredWorkOrders,
    tabs,
    activeTab,
    isCreating,
    editingWorkOrder,
    showScrollUpButton,
    setActiveTab,
    setIsCreating,
    setEditingWorkOrder,
    scrollToTop,
    getStatusColor,
    getPriorityColor,
    handleDelete,
}: Props) {
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
                        <h1 className="text-2xl font-semibold text-center sm:text-left">
                            Work Orders
                        </h1>
                        {(user.permissions.includes("manage work orders") ||
                            user.permissions.includes("super_admin")) && (
                            <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                                <PrimaryButton
                                    onClick={() => setIsCreating(true)}
                                    className="bg-primary text-white hover:bg-secondary transition-all duration-300 
                            text-sm sm:text-base px-5 py-2 rounded-md text-center justify-center w-full sm:w-auto"
                                >
                                    Add Work Order
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Tabs - Desktop */}
            <div className="hidden md:flex mt-4 pl-4">
                <div className="flex overflow-hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 text-sm sm:text-base font-medium transition-colors duration-200 whitespace-nowrap border h-12 border-primary
                ${
                    activeTab === tab
                        ? "bg-primary text-white"
                        : "bg-white text-black hover:bg-gray-100"
                }
                rounded-t-md`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs - Mobile */}
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

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white shadow-lg rounded-md mt-4">
                <table className="w-full table-auto border-collapse text-sm text-gray-700">
                    <thead>
                        <tr className="bg-secondary text-white">
                            <th className="border px-6 py-3 text-auto">ID</th>
                            <th className="border px-6 py-3 text-auto">
                                Description
                            </th>
                            <th className="border px-6 py-3 text-auto">
                                Location
                            </th>
                            <th className="border px-6 py-3 text-auto">
                                Status
                            </th>
                            <th className="border px-6 py-3 text-auto">
                                Priority
                            </th>
                            <th className="border px-6 py-3 text-auto">
                                Requested At
                            </th>
                            <th className="border px-6 py-3 text-auto">
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
                                <td
                                    className={`border px-6 py-4 ${getStatusColor(
                                        workOrder.status
                                    )}`}
                                >
                                    {workOrder.status}
                                </td>
                                <td
                                    className={`border px-6 py-4 ${getPriorityColor(
                                        workOrder.priority
                                    )}`}
                                >
                                    {workOrder.priority}
                                </td>
                                <td className="border px-6 py-4">
                                    {new Date(
                                        workOrder.requested_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="border px-6 py-4 gap-2 flex justify-center">
                                    <PrimaryButton
                                        className="bg-secondary"
                                        onClick={() =>
                                            setEditingWorkOrder(workOrder)
                                        }
                                    >
                                        Edit
                                    </PrimaryButton>
                                    <PrimaryButton
                                        className="bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700 transition"
                                        onClick={() => handleDelete(workOrder.id)}
                                    >
                                        Delete
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
                        className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                    >
                        {/* Info Section */}
                        <div className="space-y-1 pr-8 text-sm text-gray-800">
                            <p>
                                <span className="font-medium">ID:</span>{" "}
                                {workOrder.id}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Description:
                                </span>{" "}
                                {workOrder.report_description}
                            </p>
                            <p>
                                <span className="font-medium">Location:</span>{" "}
                                {workOrder.location?.name || "N/A"}
                            </p>
                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                    className={`${getStatusColor(
                                        workOrder.status
                                    )}`}
                                >
                                    {workOrder.status}
                                </span>
                            </p>
                            <p>
                                <span className="font-medium">Priority:</span>{" "}
                                <span
                                    className={`${getPriorityColor(
                                        workOrder.priority
                                    )}`}
                                >
                                    {workOrder.priority}
                                </span>
                            </p>
                            <p>
                                <span className="font-medium">
                                    Requested At:
                                </span>{" "}
                                {new Date(
                                    workOrder.requested_at
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4 flex justify-end gap-2">
                            <PrimaryButton
                                className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                                onClick={() => setEditingWorkOrder(workOrder)}
                            >
                                Edit
                            </PrimaryButton>
                            <PrimaryButton
                                className="bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700 transition"
                                onClick={() => handleDelete(workOrder.id)}
                            >
                                Delete
                            </PrimaryButton>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scroll to Top Button */}
            <ScrollToTopButton
                showScrollUpButton={showScrollUpButton}
                scrollToTop={scrollToTop}
            />
        </AuthenticatedLayout>
    );
}
