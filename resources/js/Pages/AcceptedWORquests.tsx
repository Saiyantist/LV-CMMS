import React from "react";

interface WorkOrder {
    id: number;
    dateSubmitted: string;
    fullName: string;
    location: string;
    description: string;
    workOrderType: string;
    label: string;
    targetDate: string;
    priority: string;
    assignTo: string;
    status: string;
}

interface AcceptedWORequestsProps {
    requests: WorkOrder[];
}

const AcceptedWORequests: React.FC<AcceptedWORequestsProps> = ({ requests }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
                <thead className="dark:bg-gray-300">
                    <tr className="text-left">
                        <th className="p-3">ID</th>
                        <th className="p-3">Date Submitted</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Work Order Type</th>
                        <th className="p-3">Label</th>
                        <th className="p-3">Target Date</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Assign To</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <tr
                                key={request.id}
                                className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                            >
                                <td className="p-3">{request.id}</td>
                                <td className="p-3">{request.dateSubmitted}</td>
                                <td className="p-3">{request.fullName}</td>
                                <td className="p-3">{request.location}</td>
                                <td className="p-3">{request.description}</td>
                                <td className="p-3">{request.workOrderType}</td>
                                <td className="p-3">{request.label}</td>
                                <td className="p-3">{request.targetDate}</td>
                                <td className="p-3">{request.priority}</td>
                                <td className="p-3">{request.assignTo}</td>
                                <td className="p-3">{request.status}</td>
                                <td className="p-3 text-center">
                                    <button className="text-white bg-bluebutton px-4 py-2 rounded-md">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={12} className="p-4 text-center text-gray-500">
                                No accepted requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AcceptedWORequests;
