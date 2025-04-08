import React, { useState } from "react";

interface ViewPendingModalProps {
    request: {
        dateSubmitted: string;
        fullName: string;
        location: string;
        description: string;
        attachments?: { url: string; name: string }[];
    };
    onClose: () => void;
    onForBudgetApproval: () => void;
    onDecline: () => void;
}

const ViewPendingModal: React.FC<ViewPendingModalProps> = ({
    request,
    onClose,
    onForBudgetApproval,
    onDecline,
}) => {
    const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-[500px] md:w-[600px] lg:w-[700px] relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold mb-6 text-center">
                    Pending Request
                </h2>

                {/* Request Details */}
                <div className="space-y-4 text-sm text-gray-700">
                    <div className="border p-4 rounded-md">
                        <div className="flex mb-2">
                            <strong className="w-1/3">Date Requested:</strong>
                            <span className="ml-2">
                                {request.dateSubmitted}
                            </span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Requested By:</strong>
                            <span className="ml-2">{request.fullName}</span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Location:</strong>
                            <span className="ml-2">{request.location}</span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Description:</strong>
                            <span className="ml-2">{request.description}</span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Attachments:</strong>
                            <div className="ml-2 flex space-x-2 flex-wrap">
                                {request.attachments &&
                                request.attachments.length > 0 ? (
                                    request.attachments.map((file, idx) => (
                                        <img
                                            key={idx}
                                            src={file.url}
                                            alt={file.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    ))
                                ) : (
                                    <span>N/A</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onForBudgetApproval}
                        className="text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-sm"
                    >
                        For Budget Approval
                    </button>
                    <button
                        onClick={onDecline}
                        className="text-white bg-destructive hover:bg-red-600 px-4 py-2 rounded-md text-sm"
                    >
                        Decline
                    </button>
                    <button
                        onClick={() => setShowWorkOrderForm(true)}
                        className="text-white bg-secondary hover:bg-primary px-4 py-2 rounded-md text-sm"
                    >
                        Accept
                    </button>
                </div>

                {/* Work Order Form (Appears Below) */}
                {showWorkOrderForm && (
                    <>
                        <hr className="my-6 border-gray-300" />{" "}
                        {/* Separator Line */}
                        <h2 className="text-lg font-semibold mb-4">
                            Set up Work Order
                        </h2>
                        {/* Work Order Form */}
                        <div className="space-y-4">
                            {/* Row 1 */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Work Order Type
                                    </label>
                                    <select className="w-full border p-2 rounded">
                                        <option>Type A</option>
                                        <option>Type B</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Label
                                    </label>
                                    <select className="w-full border p-2 rounded">
                                        <option>Label 1</option>
                                        <option>Label 2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Target Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Priority
                                    </label>
                                    <select className="w-full border p-2 rounded">
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Assign To
                                    </label>
                                    <select
                                        multiple
                                        className="w-full border p-2 rounded"
                                        size={2}
                                    >
                                        <option>John Doe</option>
                                        <option>Jane Smith</option>
                                        <option>Emily Johnson</option>
                                        <option>Michael Brown</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowWorkOrderForm(false)}
                                className="text-gray-600 border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button className="text-white bg-secondary hover:bg-primary px-4 py-2 rounded-full text-sm">
                                Update
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewPendingModal;
