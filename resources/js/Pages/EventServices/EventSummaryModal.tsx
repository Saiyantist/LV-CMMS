import React from "react";
import {
    CheckCircle2,
    FileText,
    MapPin,
    CalendarClock,
    ClipboardList,
    ShieldCheck,
} from "lucide-react";

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

function shortenFileName(name: string, maxLen = 30) {
    if (name.length <= maxLen) return name;
    return name.slice(0, 15) + "..." + name.slice(-10);
}

const EventSummary: React.FC<EventSummaryProps> = ({
    onClose,
    onSubmit,
    data,
}) => {
    if (data.showSuccess) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl p-8 mt-10 text-center">
                <div className="flex justify-center">
                    <CheckCircle2 className="text-green-600" size={80} />
                </div>
                <h2 className="text-3xl font-semibold mt-4 text-gray-900">
                    Booking Successful!
                </h2>
                <p className="text-gray-600 mt-2 mb-6">
                    Your Event Service Request has been submitted successfully.
                    You can track it in the "My Bookings" page.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        className="px-6 py-2 border border-gray-400 rounded-md text-gray-800 bg-white hover:bg-gray-100 transition"
                        onClick={() => window.location.reload()}
                    >
                        Add Another Booking
                    </button>
                    <a
                        href="/event-services/my-bookings"
                        className="px-6 py-2 rounded-md bg-secondary text-white hover:bg-primary transition"
                    >
                        My Bookings
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto bg-white rounded-xl p-8 mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Event Services Summary
                </h2>
                <p className="text-gray-500">
                    Please review all information before submitting.
                </p>
            </div>

            {/* Step 1: Proof of Approval */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <FileText className="text-blue-600" size={20} />
                    Proof of Approval
                </div>
                {data.file ? (
                    <div className="ml-7 flex items-center border rounded px-3 py-2 bg-gray-50 text-sm">
                        <span className="font-mono font-medium">
                            {shortenFileName(data.file.name)}
                        </span>
                        <span className="ml-2 text-gray-400">
                            {Math.round(data.file.size / 1024)}kb
                        </span>
                    </div>
                ) : (
                    <div className="ml-7 text-gray-400 italic">
                        No file uploaded.
                    </div>
                )}
            </section>

            {/* Step 2: Venue */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <MapPin className="text-green-600" size={20} />
                    Requested Venue
                </div>
                <div className="ml-7 text-gray-700">{data.venue || "N/A"}</div>
            </section>

            {/* Step 3: Event Details */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <CalendarClock className="text-purple-600" size={20} />
                    Event Details
                </div>
                <div className="ml-7 space-y-1 text-gray-700 text-sm">
                    <div>
                        <strong>Event Name:</strong>{" "}
                        {data.eventDetails?.eventName || "N/A"}
                    </div>
                    <div>
                        <strong>Department:</strong>{" "}
                        {data.eventDetails?.department || "N/A"}
                    </div>
                    <div>
                        <strong>Event Purpose:</strong>{" "}
                        {data.eventDetails?.eventPurpose || "N/A"}
                    </div>
                    <div>
                        <strong>Participants:</strong>{" "}
                        {data.eventDetails?.participants || "N/A"}
                    </div>
                    <div>
                        <strong>Count:</strong>{" "}
                        {data.eventDetails?.participantCount || "N/A"}
                    </div>
                    <div>
                        <strong>Date & Time:</strong> {data.dateRange}{" "}
                        {data.timeRange && `| ${data.timeRange}`}
                    </div>
                </div>
            </section>

            {/* Step 4: Requested Services */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <ClipboardList className="text-orange-600" size={20} />
                    Requested Services
                </div>
                <div className="ml-7 text-sm text-gray-700 space-y-1">
                    {Object.keys(data.requestedServices).length > 0 ? (
                        Object.entries(data.requestedServices).map(
                            ([category, items]) => (
                                <div key={category}>
                                    <strong>{category}:</strong>{" "}
                                    {items.join(", ")}
                                </div>
                            )
                        )
                    ) : (
                        <div className="italic text-gray-400">None</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EventSummary;
