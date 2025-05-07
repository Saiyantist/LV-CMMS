// ViewWorkOrderModal.tsx
import React from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    workOrder: {
        id: number;
        report_description: string;
        location: { name: string } | null;
        status: string;
        priority: string;
        requested_at: string;
        requested_by: string;
        images: string[];
    };
}

const ViewWorkOrderModal: React.FC<Props> = ({ isOpen, onClose, workOrder }) => {
    if (!isOpen || !workOrder) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Work Order Details</h2>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>ID:</strong> {workOrder.id}</p>
                    <p><strong>Description:</strong> {workOrder.report_description}</p>
                    <p><strong>Location:</strong> {workOrder.location?.name || "N/A"}</p>
                    <p><strong>Status:</strong> {workOrder.status}</p>
                    <p><strong>Priority:</strong> {workOrder.priority}</p>
                    <p><strong>Requested By:</strong> {workOrder.requested_by}</p>
                    <p><strong>Requested At:</strong> {formatDate(workOrder.requested_at)}</p>
                    <div>
                        <strong>Images:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {workOrder.images?.length > 0 ? (
                                workOrder.images.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Work order image ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                ))
                            ) : (
                                <span>No images</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-secondary text-white rounded hover:bg-primary transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewWorkOrderModal;
