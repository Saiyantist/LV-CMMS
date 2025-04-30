import React from "react";
import { Check } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    dateRequested: string;
    user: {
        first_name: string;
        last_name: string;
    };
    location: string;
    description: string;
    images: { url: string; name: string }[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const WOSubmittedModal: React.FC<Props> = ({
    isOpen,
    onClose,
    dateRequested,
    user,
    location,
    description,
    images,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl relative">
                {/* Check icon in green thin circle */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center bg-white">
                        <Check className="text-green-500 w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-center mt-2">
                        Work Order Submitted Successfully
                    </h2>
                </div>

                {/* Details section */}
                <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center mb-4">
                        <strong className="w-36 mr-6">Date Requested:</strong>
                        <span>{formatDate(dateRequested)}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <strong className="w-36 mr-6">Requester Name:</strong>
                        <span>{`${user.first_name} ${user.last_name}`}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <strong className="w-36 mr-6">Location:</strong>
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <strong className="w-36 mr-6">Description:</strong>
                        <span>{description}</span>
                    </div>

                    {/* Attachments */}
                    <div className="flex items-start mb-4">
                        <strong className="w-36 mr-6">Attachments:</strong>
                        <div className="grid grid-cols-2 gap-2">
                            {images.length > 0 ? (
                                images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        alt={img.name || `Attachment ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                ))
                            ) : (
                                <span className="text-sm text-gray-500 mt-1">No attachments provided.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="mt-6 text-right">
                    <button
                        className="px-4 py-2 bg-secondary text-white rounded hover:bg-primary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WOSubmittedModal;
