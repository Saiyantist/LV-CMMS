import React from "react";
import { usePage } from "@inertiajs/react"; // To access the current user

interface WOSubmittedModalProps {
    data: {
        date: string;
        requestedBy: string;
        location: string;
        description: string;
        photos: File[];
    };
    filePreviews: { url: string; name: string }[];
    onClose: () => void;
    onSubmitAnotherRequest: () => void;
    onViewWorkOrderList: () => void;
}

const WOSubmittedModal: React.FC<WOSubmittedModalProps> = ({
    data,
    filePreviews,
    onClose,
    onSubmitAnotherRequest,
    onViewWorkOrderList,
}) => {
    const user = usePage().props.auth.user;
    const currentDate = new Date().toLocaleDateString();

    const handleViewWorkOrderList = () => {
        // Store the work order data in sessionStorage temporarily
        sessionStorage.setItem(
            "newWorkOrder",
            JSON.stringify({
                dateRequested: currentDate,
                location: data.location,
                description: data.description,
                status: "Pending", // Assuming a "Pending" status
            })
        );
        onViewWorkOrderList(); // Trigger the action to view the Work Order List page
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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

                <div className="w-12 h-12 border-2 border-green-500 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
                </div>

                <h2 className="text-xl font-semibold mb-4 text-center">
                    Work Order Submitted Successfully
                </h2>

                <div className="space-y-4 text-sm text-gray-700">
                    <div className="border p-4 rounded-md">
                        <div className="flex mb-2">
                            <strong className="w-1/3">Date Requested:</strong>
                            <span className="ml-2">{currentDate}</span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Requested By:</strong>
                            <span className="ml-2">{`${user.first_name} ${user.last_name}`}</span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Location:</strong>
                            <span className="ml-2">{data.location}</span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Description:</strong>
                            <span className="ml-2">
                                {data.description || "N/A"}
                            </span>
                        </div>

                        <div className="flex mb-2">
                            <strong className="w-1/3">Attachments:</strong>
                            <div className="ml-2 flex space-x-2">
                                {filePreviews.length > 0
                                    ? filePreviews.map((file, index) => (
                                          <img
                                              key={index}
                                              src={file.url}
                                              alt={file.name}
                                              className="w-20 h-20 object-cover rounded inline-block"
                                          />
                                      ))
                                    : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between sm:justify-end space-x-4 mt-6">
                    {/* <button
                        onClick={onSubmitAnotherRequest}
                        className="w-full sm:w-auto text-white bg-bluebutton border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded-full text-sm"
                    >
                        Submit Another Request
                    </button> */}

                    <button
                        onClick={handleViewWorkOrderList} // Use the handler to store data and navigate
                        className="w-full sm:w-auto text-white bg-secondary border-0 py-2 px-4 focus:outline-none hover:bg-primary rounded-full text-sm"
                    >
                        View Work Order List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WOSubmittedModal;
