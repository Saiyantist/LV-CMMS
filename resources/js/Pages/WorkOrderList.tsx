import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const WorkOrderList: React.FC = () => {
    const [workOrders, setWorkOrders] = useState<any[]>([]);

    useEffect(() => {
        // Fetch work orders from sessionStorage if available
        const storedWorkOrder = sessionStorage.getItem("newWorkOrder");
        if (storedWorkOrder) {
            const parsedWorkOrder = JSON.parse(storedWorkOrder);
            setWorkOrders((prevOrders) => [...prevOrders, parsedWorkOrder]);
            sessionStorage.removeItem("newWorkOrder"); // Clear sessionStorage after using the data
        }
    }, []);

    return (
        <Authenticated>
            <Head title="Work Order List" />
            <div className="flex h-screen">
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold leading-tight">
                            Work Order List
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="dark:bg-gray-300">
                                    <tr className="text-left">
                                        <th className="p-3">Date Requested</th>
                                        <th className="p-3">Location</th>
                                        <th className="p-3">Description</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workOrders.map((workOrder, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                                        >
                                            <td className="p-3">
                                                {workOrder.dateRequested}
                                            </td>
                                            <td className="p-3">
                                                {workOrder.location}
                                            </td>
                                            <td className="p-3">
                                                {workOrder.description}
                                            </td>
                                            <td className="p-3">
                                                <span
                                                    className={`px-3 py-1 font-semibold rounded-md ${
                                                        workOrder.status ===
                                                        "Pending"
                                                            ? "dark:bg-violet-600 dark:text-gray-50"
                                                            : "dark:bg-green-600 dark:text-gray-50"
                                                    }`}
                                                >
                                                    {workOrder.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    className="text-white bg-bluebutton px-4 py-2 rounded-md"
                                                    onClick={() => {
                                                        // Logic for viewing details
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
};

export default WorkOrderList;
