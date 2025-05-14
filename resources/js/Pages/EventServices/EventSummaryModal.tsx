import React from "react";
import { CheckCircle2 } from "lucide-react";

interface EventSummaryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    data: {
        file?: File | null;
        venue?: string;
        dateRange?: string;
        timeRange?: string;
        eventDetails?: {
            eventName: string;
            department: string;
            eventPurpose: string;
            participants: string;
            participantCount: string;
        };
        requestedServices?: string[];
        dataPrivacyAgreed?: boolean;
        equipmentPolicyAgreed?: boolean;
        consentChoice?: string;
        showSuccess?: boolean;
    };
}

function shortenFileName(name: string, maxLen = 20) {
    if (name.length <= maxLen) return name;
    return name.slice(0, 10) + "..." + name.slice(-7);
}

const EventSummaryModal: React.FC<EventSummaryModalProps> = ({
    open,
    onClose,
    onSubmit,
    data,
}) => {
    if (!open) return null;

    // Success step
    if (data.showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative flex flex-col items-center justify-center min-h-[350px] md:min-h-[300px]">
                    <CheckCircle2 className="text-green-600" size={80} />
                    <h2 className="text-2xl font-bold mt-4 mb-2 text-center text-gray-900">
                        Facility booked successfully!
                    </h2>
                    <p className="text-gray-500 text-center mb-8">
                        Event Service Request submitted successfully. You can
                        monitor the status in "My Bookings" page
                    </p>
                    <div className="flex gap-4 w-full justify-center">
                        <button
                            className="px-8 py-2 border border-gray-400 rounded-lg text-gray-900 bg-white hover:bg-gray-100 transition"
                            onClick={onClose}
                        >
                            Add Another Booking
                        </button>
                        <a
                            href="/my-bookings"
                            className="px-8 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition text-center"
                        >
                            My Bookings
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto min-h-[300px]">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-2 text-center">
                    Facility Scheduling Summary
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Please make sure all facility scheduling details are correct
                    before submitting.
                </p>
                <div className="space-y-6">
                    {/* 1. Proof of Approval */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold">
                            <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                                1
                            </span>
                            Proof of Approval
                        </div>
                        {data.file && (
                            <div className="mt-2 ml-8 flex items-center border rounded px-3 py-2 bg-gray-50">
                                <span className="font-mono text-sm font-medium">
                                    {shortenFileName(data.file.name)}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">
                                    {Math.round(data.file.size / 1024)}kb
                                </span>
                            </div>
                        )}
                    </div>
                    {/* 2. Requested Venue */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold">
                            <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                                2
                            </span>
                            Requested Venue
                        </div>
                        <div className="ml-8 mt-1">{data.venue}</div>
                    </div>
                    {/* 3. Date & Time */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold">
                            <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                                3
                            </span>
                            Date & Time
                        </div>
                        <div className="ml-8 mt-1">
                            {data.dateRange} | {data.timeRange}
                        </div>
                    </div>
                    {/* 4. Event Details */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold">
                            <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                                4
                            </span>
                            Event Details
                        </div>
                        <div className="ml-8 mt-1 space-y-1 text-sm">
                            <div>
                                <span className="font-semibold">
                                    Event Name:
                                </span>{" "}
                                {data.eventDetails?.eventName}
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Department:
                                </span>{" "}
                                {data.eventDetails?.department}
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Event Purpose:
                                </span>{" "}
                                {data.eventDetails?.eventPurpose}
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Participants:
                                </span>{" "}
                                {data.eventDetails?.participants}
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Number of Participants:
                                </span>{" "}
                                {data.eventDetails?.participantCount}
                            </div>
                        </div>
                    </div>
                    {/* 5. Requested Services */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold">
                            <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                                5
                            </span>
                            Requested Services
                        </div>
                        <div className="ml-8 mt-1 text-sm">
                            {data.requestedServices &&
                            data.requestedServices.length > 0
                                ? data.requestedServices
                                      .filter(Boolean)
                                      .join(", ")
                                : "None"}
                        </div>
                    </div>
                    {/* 6. Compliance and Consent */}
                    <div>
                        <div className="flex items-center gap-2 font-semibold">
                            <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                                6
                            </span>
                            Compliance and Consent
                        </div>
                        <div className="ml-8 mt-1 text-sm">
                            <div>
                                <span className="font-semibold">
                                    Data Privacy Notice:
                                </span>{" "}
                                {data.dataPrivacyAgreed
                                    ? "Agreed"
                                    : "Not Agreed"}
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Compliance and Consent:
                                </span>{" "}
                                {data.equipmentPolicyAgreed &&
                                data.consentChoice === "agree"
                                    ? "Agreed"
                                    : "Not Agreed"}
                            </div>
                        </div>
                    </div>
                    {/* 7. Success (hidden, only shown after submit) */}
                </div>
                <div className="flex justify-between mt-8">
                    <button
                        className="px-8 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                        onClick={onClose}
                    >
                        Back
                    </button>
                    <button
                        className="px-8 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md"
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventSummaryModal;
