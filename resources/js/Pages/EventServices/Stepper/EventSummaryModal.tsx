import React from "react";
import {
    CheckCircle2,
    FileText,
    MapPin,
    CalendarClock,
    ClipboardList,
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
            department: string[];
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
    selectedVenueIds?: number[] | null;
}

function shortenFileName(name?: string, maxLen = 30) {
    if (!name) return "";
    if (name.length <= maxLen) return name;
    return name.slice(0, 15) + "..." + name.slice(-10);
}

// Example galleryItems array; replace with your actual data source or import as needed
const exampleGalleryItems = [
    { id: 1, title: "Auditorium" },
    { id: 2, title: "Auditorium Lobby" },
    { id: 3, title: "College Library", subtitle: "Capacities: " },
    { id: 4, title: "Meeting Room", subtitle: "Capacities: " },
    { id: 5, title: "Computer Laboratory A", subtitle: "Capacities: " },
    { id: 6, title: "Computer Laboratory B", subtitle: "Capacities: " },
    { id: 7, title: "EFS Classroom(s) Room #:", subtitle: "Capacities: " },
    { id: 8, title: "LVCC Grounds:", subtitle: "Capacities: " },
    { id: 9, title: "LVCC Main Lobby", subtitle: "Capacities: 700 " },
    {
        id: 10,
        title: "Elementary & High School Library",
        subtitle: "Capacities: ",
    },

    { id: 11, title: "Basketball Court", subtitle: "Capacities: " },
];

const EventSummary: React.FC<EventSummaryProps> = ({
    data,
    selectedVenueIds, // <-- Add this
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
        <div className="w-full px-0 sm:px-4 py-6 space-y-8 bg-gradient-to-b via-white to-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
                    Event Services Summary
                </h2>
                <p className="text-gray-500 text-base">
                    Please review all information before submitting.
                </p>
            </div>

            {/* Step 1: Proof of Approval */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <FileText className="text-blue-600" size={22} />
                    Proof of Approval
                </div>
                {data.file && data.file.name ? (
                    <div className="sm:ml-7 flex items-center border border-blue-100 rounded-xl px-4 py-2 bg-blue-50/60 text-sm shadow-sm">
                        <span className="font-mono font-medium text-blue-900">
                            {shortenFileName(data.file.name)}
                        </span>
                        <span className="ml-2 text-gray-400">
                            {Math.round(data.file.size / 1024)}kb
                        </span>
                    </div>
                ) : (
                    <div className="sm:ml-7 text-gray-400 italic">
                        No file uploaded.
                    </div>
                )}
            </section>

            {/* Step 2: Venue */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <MapPin className="text-green-600" size={22} />
                    Requested Venue
                </div>
                <div
                    className={`sm:ml-7 rounded-xl px-4 py-2 ${
                        selectedVenueIds && selectedVenueIds.length > 0
                            ? "bg-green-50/60 text-gray-700 border border-green-100"
                            : "text-gray-400 italic"
                    }`}
                >
                    {selectedVenueIds && selectedVenueIds.length > 0
                        ? exampleGalleryItems
                              .filter((item) =>
                                  selectedVenueIds.includes(item.id)
                              )
                              .map((item) => item.title)
                              .join(", ")
                        : "N/A"}
                </div>
            </section>

            {/* Step 3: Event Details */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <CalendarClock className="text-purple-600" size={22} />
                    Event Details
                </div>
                <div className="sm:ml-7 space-y-1 text-gray-700 text-sm bg-purple-50/60 border border-purple-100 rounded-xl px-4 py-2 shadow-sm">
                    <div>
                        <strong>Event Name:</strong>{" "}
                        {data.eventDetails?.eventName || "N/A"}
                    </div>
                    <div>
                        <strong>Department:</strong>{" "}
                        {Array.isArray(data.eventDetails?.department)
                            ? data.eventDetails.department.join(", ")
                            : data.eventDetails?.department || "N/A"}
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
                        <strong>Number of Participants:</strong>{" "}
                        {data.eventDetails?.participantCount || "N/A"}
                    </div>
                    <div>
                        <strong>Date & Time:</strong> {data.dateRange}{" "}
                        {data.timeRange && (
                            <span className="text-gray-500">
                                | {data.timeRange}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Step 4: Requested Services */}
            <section className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                    <ClipboardList className="text-orange-600" size={22} />
                    Requested Services
                </div>
                <div className="sm:ml-7 text-sm text-gray-700 space-y-1 bg-orange-50/60 border border-orange-100 rounded-xl px-4 py-2 shadow-sm">
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
