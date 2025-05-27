import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import {
    FileText,
    CalendarDays,
    Clock,
    Users,
    BadgeCheck,
    Building2,
} from "lucide-react";
import EditBookingsModal from "./EditBookingsModal";

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

interface Booking {
    id: number | string;
    date: string;
    venue: string | string[];
    name: string;
    department?: string;
    description?: string;
    participants?: string;
    number_of_participants?: number;
    event_start_date?: string;
    event_end_date?: string;
    event_start_time?: string;
    event_end_time?: string;
    requested_services?: string | string[];
    proof_of_approval?: string;
    status: string;
    [key: string]: any;
}

interface Props {
    open: boolean;
    onClose: () => void;
    booking: Booking | null;
    venueNames?: string[];
    canEdit: boolean;
    onBookingUpdate?: (updatedBooking: Booking) => void;
}

const ViewBookingModal: React.FC<Props> = ({
    open,
    onClose,
    booking,
    venueNames = [],
    canEdit,
    onBookingUpdate,
}) => {
    const [showEdit, setShowEdit] = useState(false);

    // This function will close both modals
    const handleEditSuccess = (updatedBooking: any) => {
        setShowEdit(false); // Close Edit modal
        if (onBookingUpdate) onBookingUpdate(updatedBooking); // Update parent state
        onClose(); // Close View modal
    };

    if (!booking) return null;

    const venues = Array.isArray(booking.venue)
        ? booking.venue
        : booking.venue
        ? JSON.parse(booking.venue)
        : [];
    const requestedServices = Array.isArray(booking.requested_services)
        ? booking.requested_services
        : booking.requested_services
        ? JSON.parse(booking.requested_services)
        : [];

    const InfoBlock = ({
        label,
        value,
        icon,
    }: {
        label: string;
        value: string | number;
        icon?: React.ReactNode;
    }) => (
        <div className="space-y-0.5">
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                {icon}
                {label}
            </div>
            <div className="text-sm font-medium text-gray-900">
                {value || "N/A"}
            </div>
        </div>
    );

    // const canEdit = true; // Removed duplicate declaration

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl w-full rounded-lg shadow-xl border border-gray-200 p-0 overflow-hidden">
                    <DialogHeader className="bg-blue-50 px-5 py-3 border-b">
                        <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                            Booking Summary
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto bg-white text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoBlock
                                label="Booking ID"
                                value={booking.id}
                                icon={<BadgeCheck size={14} />}
                            />
                            <InfoBlock
                                label="Date Requested"
                                value={formatDate(booking.date)}
                                icon={<CalendarDays size={14} />}
                            />
                            <InfoBlock
                                label="Event Name"
                                value={booking.name}
                                icon={<FileText size={14} />}
                            />
                            <InfoBlock
                                label="Department"
                                value={booking.department || "N/A"}
                                icon={<Building2 size={14} />}
                            />
                            <InfoBlock
                                label="Participants"
                                value={booking.participants || "N/A"}
                                icon={<Users size={14} />}
                            />
                            <InfoBlock
                                label="No. of Participants"
                                value={booking.number_of_participants || "N/A"}
                                icon={<Users size={14} />}
                            />
                            <InfoBlock
                                label="Event Date"
                                value={
                                    booking.event_start_date &&
                                    booking.event_end_date
                                        ? `${formatDate(
                                              booking.event_start_date
                                          )} to ${formatDate(
                                              booking.event_end_date
                                          )}`
                                        : "N/A"
                                }
                                icon={<CalendarDays size={14} />}
                            />
                            <InfoBlock
                                label="Event Time"
                                value={
                                    booking.event_start_time &&
                                    booking.event_end_time
                                        ? `${formatTime(
                                              booking.event_start_time
                                          )} - ${formatTime(
                                              booking.event_end_time
                                          )}`
                                        : "N/A"
                                }
                                icon={<Clock size={14} />}
                            />
                        </div>

                        <div className="space-y-3">
                            <InfoBlock
                                label="Description"
                                value={booking.description || "N/A"}
                            />
                            <InfoBlock
                                label="Requested Venue"
                                value={
                                    venues.length ? venues.join(", ") : "N/A"
                                }
                            />
                            <InfoBlock
                                label="Requested Services"
                                value={
                                    requestedServices.length
                                        ? requestedServices.join(", ")
                                        : "N/A"
                                }
                            />
                            <div className="space-y-0.5">
                                <div className="text-xs text-gray-500">
                                    Proof of Approval
                                </div>
                                {booking.proof_of_approval ? (
                                    <a
                                        href={`/storage/${booking.proof_of_approval}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline font-semibold text-sm"
                                    >
                                        View File
                                    </a>
                                ) : (
                                    <div className="text-sm font-medium text-gray-900">
                                        N/A
                                    </div>
                                )}
                            </div>
                            <InfoBlock label="Status" value={booking.status} />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                            {canEdit && (
                                <Button
                                    onClick={() => setShowEdit(true)}
                                    variant="outline"
                                    className="min-w-[100px]"
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="secondary"
                                className="w-full sm:w-auto text-sm text-white"
                                onClick={onClose}
                            >
                                ❌ Close
                            </Button>
                        </div>

                        {!canEdit && (
                            <div className="text-xs text-red-500 mt-2">
                                You can only edit bookings that are still
                                pending.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <EditBookingsModal
                open={showEdit}
                onClose={() => setShowEdit(false)}
                booking={booking}
                venueNames={venueNames}
                // Use handleEditSuccess to close both modals and update state
                onBookingUpdate={handleEditSuccess}
            />
        </>
    );
};

export default ViewBookingModal;
