import React from "react";

interface ComplianceSummaryModalProps {
    data: any;
    onClose: () => void;
}

const ComplianceSummaryModal: React.FC<ComplianceSummaryModalProps> = ({
    data,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
                <h2 className="text-center text-lg font-semibold mb-4">
                    Submission Summary
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-start">
                        <strong className="w-1/3 mr-2">Compliance Area:</strong>
                        <span className="text-left w-2/3">
                            {data.complianceArea}
                        </span>
                    </div>
                    <div className="flex justify-start">
                        <strong className="w-1/3 mr-2">Location:</strong>
                        <span className="text-left w-2/3">{data.location}</span>
                    </div>
                    <div className="flex justify-start">
                        <strong className="w-1/3 mr-2">Description:</strong>
                        <span className="text-left w-2/3">
                            {data.description}
                        </span>
                    </div>
                    <div className="flex justify-start">
                        <strong className="w-1/3 mr-2">
                            Safety Protocols:
                        </strong>
                        <span className="text-left w-2/3">
                            {data.safetyProtocols}
                        </span>
                    </div>
                    <div className="flex justify-start">
                        <strong className="w-1/3 mr-2">Target Date:</strong>
                        <span className="text-left w-2/3">
                            {data.targetDate}
                        </span>
                    </div>
                    <div className="flex justify-start">
                        <strong className="w-1/3 mr-2">Priority:</strong>
                        <span className="text-left w-2/3">{data.priority}</span>
                    </div>
                    <div className="flex justify-start">
                        <strong className="w-1/3 mr-2">Assigned To:</strong>
                        <span className="text-left w-2/3">
                            {data.assignedTo.join(", ")}
                        </span>
                    </div>
                    <div className="flex flex-col justify-start">
                        <strong className="w-1/3 mr-2">Attachments:</strong>
                        {data.attachments && data.attachments.length > 0 ? (
                            <div className="mt-2 overflow-x-auto flex space-x-4">
                                {data.attachments.map(
                                    (file: File, index: number) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0"
                                        >
                                            {file.type.startsWith("image/") ? (
                                                <img
                                                    src={URL.createObjectURL(
                                                        file
                                                    )}
                                                    alt={`Attachment ${
                                                        index + 1
                                                    }`}
                                                    className="w-32 h-32 object-cover rounded border"
                                                />
                                            ) : (
                                                <span className="text-blue-600 underline">
                                                    {file.name}
                                                </span>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <span className="ml-1">None</span>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-90"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplianceSummaryModal;
