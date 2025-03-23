import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

interface WorkOrder {
    id: number;
    report_description: string;
    location: { name: string } | null;
    status: string;
    priority: string;
    requested_at: string;
}

export default function WorkOrders({ workOrders }: PageProps<{ workOrders: WorkOrder[] }>) {
    return (
        <>
            <Head title="Work Orders"/>
            <h1 className="text-xl font-bold mb-4">Work Orders</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Location</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Priority</th>
                    <th className="border px-4 py-2">Requested At</th>
                </tr>
                </thead>
                <tbody>
                {workOrders.map((workOrder) => (
                    <tr key={workOrder.id} className="border-t">
                    <td className="border px-4 py-2">{workOrder.id}</td>
                    <td className="border px-4 py-2">{workOrder.report_description}</td>
                    <td className="border px-4 py-2">{workOrder.location?.name || "N/A"}</td>
                    <td className="border px-4 py-2">{workOrder.status}</td>
                    <td className="border px-4 py-2">{workOrder.priority}</td>
                    <td className="border px-4 py-2">{new Date(workOrder.requested_at).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}