import React from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

// I need the controller to get the data from the database

const RequestDetails: React.FC = () => {
    return (
        <Authenticated>
            <Head title="Request Details" />
            <div className="flex h-screen">
                {/* Invoice Table Section */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold leading-tight">
                            Request Details
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col className="w-24" />
                                </colgroup>
                                <thead className="dark:bg-gray-300">
                                    <tr className="text-left">
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Work Order Type</th>
                                        <th className="p-3">Location</th>
                                        <th className="p-3">Description</th>
                                        <th className="p-3">Date Requested</th>
                                        <th className="p-3 text-center">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        {
                                            name: "Joshua Allador",
                                            workordertype: "Maintenance",
                                            location: "EFS 404",
                                            description: "Aircon Malfunction",
                                            daterequested: "March 24, 2025",
                                            status: "Pending",
                                        },
                                    ].map((invoice, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                                        >
                                            <td className="p-3">
                                                {invoice.name}
                                            </td>
                                            <td className="p-3">
                                                {invoice.workordertype}
                                            </td>
                                            <td className="p-3">
                                                {invoice.location}
                                            </td>
                                            <td className="p-3">
                                                {invoice.description}
                                            </td>
                                            <td className="p-3">
                                                {invoice.daterequested}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span
                                                    className={`px-3 py-1 font-semibold rounded-md ${
                                                        invoice.status ===
                                                        "Pending"
                                                            ? "dark:bg-violet-600 dark:text-gray-50"
                                                            : "dark:bg-green-600 dark:text-gray-50"
                                                    }`}
                                                >
                                                    {invoice.status}
                                                </span>
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

export default RequestDetails;
