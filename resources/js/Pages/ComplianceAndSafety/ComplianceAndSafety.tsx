import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import AddComplianceAndSafetyModal from "./AddComplianceAndSafetyModal";
const ComplianceAndSafety: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <Authenticated>
            <Head title="Compliance and Safety" />

            <div className="p-4">
                <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 sm:gap-6 text-black">
                            <h1 className="text-2xl font-semibold text-center sm:text-left">
                                Compliance and Safety
                            </h1>

                            <div className="w-full sm:w-auto flex sm:ml-4 justify-center sm:justify-start">
                                <PrimaryButton
                                    onClick={() => setIsCreating(true)}
                                    className="bg-secondary text-white hover:bg-primary transition-all duration-300 text-sm sm:text-base px-5 py-2 rounded-md"
                                >
                                    + Add
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200">
                        <thead className="bg-secondary dark:bg-gray-800">
                            <tr>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    ID
                                </th>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    Date Submitted
                                </th>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    Compliance Area
                                </th>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    Location
                                </th>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    Assigned Toa
                                </th>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    Target Date
                                </th>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    Status
                                </th>
                                <th className="bg-secondary text-white border p-3 text-sm font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Replace with your data */}
                            <tr className="border-b text-center align-middle">
                                <td className="p-2">1</td>
                                <td className="p-2">2023-01-01</td>
                                <td className="p-2">Fire Safety Inspection</td>
                                <td className="p-2">Location 1</td>
                                <td className="p-2">Joshua</td>
                                <td className="p-2">TBD</td>
                                <td className="p-2">On Going</td>
                                <td className="p-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <button className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                            Edit
                                        </button>
                                        <button className="bg-destructive text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden flex flex-col gap-4 mt-4">
                    {/* Replace with your data */}
                    <div className="border rounded-2xl p-4 shadow-md bg-white">
                        <div className="text-sm text-gray-800 space-y-1 pr-8">
                            <p>
                                <strong>ID:</strong> 1
                            </p>
                            <p>
                                <strong>Date Submitted:</strong> 2023-01-01
                            </p>
                            <p>
                                <strong>Name:</strong> Fire Safety Inspection
                            </p>
                            <p>
                                <strong>Description:</strong> Location 1
                            </p>
                            <p>
                                <strong>Assign To:</strong> Assigned
                            </p>
                            <p>
                                <strong>Status:</strong> On Going
                            </p>
                            <p>
                                <strong>Next Schedule:</strong> TBD
                            </p>
                        </div>
                        <div className="mt-4 flex justify-between gap-2">
                            <button className="flex-1 bg-secondary text-white px-3 py-2 text-sm rounded-md hover:opacity-90 transition">
                                Edit
                            </button>
                            <button className="flex-1 bg-destructive text-white px-3 py-2 text-sm rounded-md hover:opacity-90 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Compliance and Safety Modal */}
            {isCreating && (
                <AddComplianceAndSafetyModal
                    isOpen={isCreating}
                    onClose={() => setIsCreating(false)}
                    onCreate={() => {
                        // Add your logic for creating compliance and safety here
                        // console.log("Compliance and Safety created");
                        setIsCreating(false);
                    }}
                />
            )}
        </Authenticated>
    );
};

export default ComplianceAndSafety;
