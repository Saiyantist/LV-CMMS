import React from "react";
import { usePage } from "@inertiajs/react";

// Helper function to format date as "Month Day, Year"
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
};

interface ViewAssetModalProps {
    data: {
        id: number;
        name: string;
        specification_details: string;
        location: {
            id: number;
            name: string;
        }
        status: string;
        date_acquired: string;
        last_maintained_at: string;
        imageUrl?: string; // Optional field for image URL
    };
    onClose: () => void;
}

const ViewAssetModal: React.FC<ViewAssetModalProps> = ({ data, onClose }) => {
    const user = usePage().props.auth.user;
    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-[500px] md:w-[600px] lg:w-[700px] relative">
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

                {/* <div className="w-12 h-12 border-2 border-green-500 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div> */}

                <h2 className="text-xl font-semibold mb-4 text-center">
                    Asset Details
                </h2>

                <div className="space-y-4 text-sm text-gray-700">
                    <div className="border p-4 rounded-md">
                        <div className="flex mb-2">
                            <strong className="w-1/3">ID:</strong>
                            <span className="ml-2">{data.id}</span>
                        </div>
                        <div className="flex mb-2">
                            <strong className="w-1/3">Asset Name:</strong>
                            <span className="ml-2">{data.name}</span>
                        </div>
                        <div className="flex mb-2">
                            <strong className="w-1/3">Specification:</strong>
                            <span className="ml-2">{data.specification_details}</span>
                        </div>
                        <div className="flex mb-2">
                            <strong className="w-1/3">Location:</strong>
                            <span className="ml-2">{data.location.name}</span>
                        </div>
                        <div className="flex mb-2">
                            <strong className="w-1/3">Condition:</strong>
                            <span className="ml-2">{data.status}</span>
                        </div>
                        <div className="flex mb-2">
                            <strong className="w-1/3">Date Acquired:</strong>
                            <span className="ml-2">
                                {formatDate(data.date_acquired)}
                            </span>
                        </div>
                        <div className="flex mb-2">
                            <strong className="w-1/3">Last Maintenance:</strong>
                            <span className="ml-2">
                                {formatDate(data.last_maintained_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Image Section moved to bottom */}
                {data.imageUrl && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <strong className="w-1/3">Image:</strong>
                        </div>
                        <div className="mt-2">
                            <img
                                src={data.imageUrl}
                                alt="Asset"
                                className="w-full h-auto rounded-md"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between sm:justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto text-white bg-secondary border-0 py-2 px-4 focus:outline-none hover:bg-primary rounded-full text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewAssetModal;
