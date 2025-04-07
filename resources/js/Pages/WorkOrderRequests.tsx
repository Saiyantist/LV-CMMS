import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ViewPendingModal from "@/Components/ViewPendingModal"; // Adjust path if needed

const WorkOrderRequests: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Pending");
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    const requests = [
        {
            id: 1,
            dateSubmitted: "2025-04-04",
            fullName: "Joshua Allador",
            location: "EFS 404",
            description: "Fix the broken light",
            status: "Pending",
            attachments: [
                { url: "https://via.placeholder.com/100", name: "light.jpg" },
            ],
        },
        {
            id: 2,
            dateSubmitted: "2025-04-03",
            fullName: "John Smith",
            location: "MIS Office",
            description: "Aircon not working",
            status: "Accepted",
        },
    ];

    const filteredRequests = requests.filter((req) => req.status === activeTab);

    const tabs = ["Pending", "Accepted", "For Budget Request", "Declined"];

    const handleViewClick = (request: any) => {
        if (activeTab === "Pending") {
            setSelectedRequest(request);
            setShowModal(true);
        } else {
            console.log("You can create a different modal or logic for non-pending requests.");
        }
    };

    return (
        <Authenticated>
            <Head title="Work Order Requests" />
            <div className="flex h-screen">
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
                        {/* Header with Add Button */}
                        <div className="mb-4 flex items-center space-x-4">
                            <h2 className="text-2xl font-semibold leading-tight">
                                Work Order Requests
                            </h2>
                            <button
                                className="bg-bluebutton text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-200 text-sm"
                                onClick={() => console.log("Add Work Order clicked")}
                            >
                                + Add Work Order
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="mb-4">
                            <div className="inline-flex border border-gray-300 rounded-t-md overflow-hidden">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`
                                            px-4 py-2 text-sm font-medium transition-colors duration-200
                                            ${activeTab === tab
                                                ? "bg-bluebutton text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-100"
                                            }
                                            rounded-t-md
                                            ${index !== 0 ? "border-l border-gray-300" : ""}
                                        `}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="dark:bg-gray-300">
                                    <tr className="text-left">
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Date Submitted</th>
                                        <th className="p-3">Full Name</th>
                                        <th className="p-3">Location</th>
                                        <th className="p-3">Description</th>
                                        <th className="p-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map((request) => (
                                            <tr
                                                key={request.id}
                                                className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                                            >
                                                <td className="p-3">{request.id}</td>
                                                <td className="p-3">{request.dateSubmitted}</td>
                                                <td className="p-3">{request.fullName}</td>
                                                <td className="p-3">{request.location}</td>
                                                <td className="p-3">{request.description}</td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        className="text-white bg-bluebutton px-4 py-2 rounded-md"
                                                        onClick={() => handleViewClick(request)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-gray-500">
                                                No {activeTab.toLowerCase()} requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedRequest && (
                <ViewPendingModal
                    request={selectedRequest}
                    onClose={() => setShowModal(false)}
                    onForBudgetApproval={() => {
                        console.log("For Budget Approval clicked", selectedRequest);
                        setShowModal(false);
                    }}
                    onDecline={() => {
                        console.log("Decline clicked", selectedRequest);
                        setShowModal(false);
                    }}
                    onAccept={() => {
                        console.log("Accept clicked", selectedRequest);
                        setShowModal(false);
                    }}
                />
            )}
        </Authenticated>
    );
};

export default WorkOrderRequests;
