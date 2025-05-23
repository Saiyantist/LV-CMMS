import React from "react";
import { CheckCircle2 } from "lucide-react";

interface EventSummaryProps {
    onSubmit: () => void;
    onClose: () => void;
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
        requestedServices: Record<string, string[]>;
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

const EventSummary: React.FC<EventSummaryProps> = ({
    onClose,
    onSubmit,
    data,
}) => {
    // Success step (still a non-modal view)
    if (data.showSuccess) {
        return (
            <div className="w-full mx-auto bg-white rounded-lg p-6 mt-10">
                <div className="flex justify-center">
                    <CheckCircle2 className="text-green-600" size={80} />
                </div>
                <h2 className="text-2xl font-bold mt-4 mb-2 text-center text-gray-900">
                    Booked successfully!
                </h2>
                <p className="text-gray-500 text-center mb-8">
                    Event Service Request submitted successfully. You can
                    monitor the status in "My Bookings" page.
                </p>
                <div className="flex gap-4 w-full justify-center">
                    <button
                        className="px-8 py-2 border border-gray-400 rounded-lg text-gray-900 bg-white hover:bg-gray-100 transition"
                        onClick={() => window.location.reload()}
                    >
                        Add Another Booking
                    </button>
                    <a
                        href="/event-services/my-bookings"
                        className="px-8 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition text-center"
                    >
                        My Bookings
                    </a>
                </div>
            </div>
        );
    }

    // --- MAIN SUMMARY --- (Non-modal)
    return (
        <div className="w-full mx-auto bg-white rounded-lg my-8">
            <h2 className="text-2xl font-bold mb-2 text-center">
                Event Services Summary
            </h2>
            <p className="text-gray-600 text-center mb-6">
                Please make sure all Event Services details are correct before
                submitting.
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
                {/* 3. Event Details (with Date & Time) */}
                <div>
                    <div className="flex items-center gap-2 font-semibold">
                        <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                            3
                        </span>
                        Event Details
                    </div>
                    <div className="ml-8 mt-1 space-y-1 text-md">
                        <div>
                            <span className="font-semibold">Event Name:</span>{" "}
                            {data.eventDetails?.eventName}
                        </div>
                        <div>
                            <span className="font-semibold">Department:</span>{" "}
                            {data.eventDetails?.department}
                        </div>
                        <div>
                            <span className="font-semibold">
                                Event Purpose:
                            </span>{" "}
                            {data.eventDetails?.eventPurpose}
                        </div>
                        <div>
                            <span className="font-semibold">Participants:</span>{" "}
                            {data.eventDetails?.participants}
                        </div>
                        <div>
                            <span className="font-semibold">
                                Number of Participants:
                            </span>{" "}
                            {data.eventDetails?.participantCount}
                        </div>
                        <div>
                            <span className="font-semibold">Date & Time:</span>{" "}
                            {data.dateRange}{" "}
                            {data.timeRange && `| ${data.timeRange}`}
                        </div>
                    </div>
                </div>
                {/* 4. Requested Services */}
                <div>
                    <div className="flex items-center gap-2 font-semibold">
                        <span className="rounded-full border border-black w-6 h-6 flex items-center justify-center text-sm font-bold">
                            4
                        </span>
                        Requested Services
                    </div>
                    <div className="ml-8 mt-1 text-md">
                        {data.requestedServices &&
                        Object.keys(data.requestedServices).length > 0 ? (
                            Object.entries(data.requestedServices).map(
                                ([service, items]) => (
                                    <div key={service}>
                                        <strong>{service}:</strong>{" "}
                                        {items.join(", ")}
                                    </div>
                                )
                            )
                        ) : (
                            <div>None</div>
                        )}
                    </div>
                </div>
                {/* 5. Compliance and Consent */}
            </div>
        </div>
    );
};

export default EventSummary;
