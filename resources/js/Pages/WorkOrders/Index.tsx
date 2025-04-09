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
    workOrders, locations, user
}: PageProps<{ workOrders: WorkOrder[]; locations: { id: number; name: string }[]; user: { id: number; name: string; permissions: string[];}}>) {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
            <header className="flex flex-row justify-between px-4 items-center h-16 bg-secondary">
                <h1 className="text-xl font-bold text-white">Work Orders</h1>
                {/* <Link href="/work-orders/create"> */}
                    <PrimaryButton onClick={() => setIsCreating(true)} className="bg-primary">
                        <span className="mr-2 pb-0.5 text-xl">+</span>
                        <span>Add Work Order</span>
                    </PrimaryButton>
                {/* </Link> */}
            </header>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Location</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Priority</th>
                        <th className="border px-4 py-2">Requested At</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workOrders.map((workOrder) => (
                        <tr key={workOrder.id} className="border-t">
                            <td className="border px-4 py-2 text-center">
                                {workOrder.id}
                            </td>
                            <td className="border px-4 py-2">
                                {workOrder.report_description}
                            </td>
                            <td className="border px-4 py-2">
                                {workOrder.location?.name || "N/A"}
                            </td>
                            <td className="border px-4 py-2">
                                {workOrder.status}
                            </td>
                            <td className="border px-4 py-2">
                                {workOrder.priority}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(
                                    workOrder.requested_at
                                ).toLocaleDateString()}
                            </td>
                            <td className="border px-4 py-2">
                                <Link
                                    href={`/work-orders/${workOrder.id}/edit`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AuthenticatedLayout>
    );
}
