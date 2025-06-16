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
    Badge,
    Hash,
    User,
    FileCheck,
    Text,
} from "lucide-react";
import EditBookingsModal from "./EditBookingsModal";

// Extend the Window interface to include Laravel
declare global {
    interface Window {
        Laravel?: {
            user?: {
                id?: number | string;
                roles?: { name: string }[];
                [key: string]: any;
            };
            [key: string]: any;
        };
    }
}

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
    const [showProofModal, setShowProofModal] = useState(false);

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

    const getStatusBadge = (status: string, booking: Booking) => {
        // Compute "On Going" and "Completed" for display
        const today = new Date();
        const start = booking.event_start_date
            ? new Date(booking.event_start_date)
            : null;
        const end = booking.event_end_date
            ? new Date(booking.event_end_date)
            : null;

        let displayStatus = status;
        if (
            status === "Approved" &&
            start &&
            end &&
            today >= start &&
            today <= end
        ) {
            displayStatus = "On Going";
        } else if (status === "Approved" && end && today > end) {
            displayStatus = "Completed";
        }

        switch (displayStatus) {
            case "Completed":
                return (
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">
                        Completed
                    </span>
                );
            case "On Going":
                return (
                    <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
                        On Going
                    </span>
                );
            case "Cancelled":
                return (
                    <span className="inline-block px-2 py-1 rounded bg-orange-500 text-white text-xs font-semibold">
                        Cancelled
                    </span>
                );
            case "Not Started":
                return (
                    <span className="inline-block px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold">
                        Not Started
                    </span>
                );
            default:
                return (
                    <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-semibold">
                        {displayStatus}
                    </span>
                );
        }
    };

    const InfoBlock = ({
        label,
        value,
        icon,
        multiline = false,
        justify = false,
    }: {
        label: string;
        value: string | number;
        icon?: React.ReactNode;
        multiline?: boolean;
        justify?: boolean;
    }) => (
        <div className="space-y-0.5 min-w-0">
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                {icon}
                {label}
            </div>
            <div
                className={`text-sm font-medium text-gray-900 break-words whitespace-pre-line ${
                    multiline
                        ? "max-h-32 overflow-y-auto border border-gray-100 rounded px-2 py-1 bg-gray-50"
                        : ""
                } ${justify ? "text-justify text-left" : ""}`}
            >
                {value || "N/A"}
            </div>
        </div>
    );

    // const canEdit = true; // Removed duplicate declaration

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl w-full rounded-2xl shadow-2xl border border-blue-100 p-0 overflow-hidden bg-white/90">
                    <DialogHeader className="bg-gradient-to-b from-blue-100 via-white to-white px-6 py-4 border-b flex items-center justify-between rounded-t-2xl">
                        <DialogTitle className="text-xl font-bold text-blue-800 text-center w-full tracking-tight">
                            Booking Details
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 transition-colors"
                            aria-label="Close"
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </DialogHeader>

                    <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-white/90 text-base">
                        {/* Proof of Approval at the top */}
                        <div className="space-y-1 mb-4">
                            <div className="text-xs text-blue-700 flex items-center gap-1.5 font-semibold">
                                <FileCheck size={16} />
                                Proof of Approval
                            </div>
                            {booking.proof_of_approval ? (
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-700 break-all font-medium">
                                        {booking.proof_of_approval_original_name
                                            ? booking.proof_of_approval_original_name
                                            : booking.proof_of_approval
                                                  .split("/")
                                                  .pop()}
                                    </span>
                                    <button
                                        className="text-blue-600 underline font-semibold text-sm text-left hover:cursor-pointer hover:text-blue-800 transition"
                                        onClick={() => setShowProofModal(true)}
                                        type="button"
                                    >
                                        View File
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400">
                                    N/A
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoBlock
                                label="Booking ID"
                                value={booking.id}
                                icon={<Hash size={16} />}
                            />
                            <InfoBlock
                                label="Requested By"
                                value={
                                    booking.user
                                        ? booking.user.first_name &&
                                          booking.user.last_name
                                            ? `${booking.user.first_name} ${booking.user.last_name}`
                                            : booking.user.name ||
                                              booking.user.email
                                        : "N/A"
                                }
                                icon={<User size={16} />}
                            />
                            <InfoBlock
                                label="Date Requested"
                                value={formatDate(booking.date)}
                                icon={<CalendarDays size={16} />}
                            />
                            <InfoBlock
                                label="Event Name"
                                value={booking.name}
                                icon={<FileText size={16} />}
                                justify
                            />
                            <InfoBlock
                                label="Department"
                                value={booking.department || "N/A"}
                                icon={<Building2 size={16} />}
                                justify
                            />
                            <InfoBlock
                                label="Participants"
                                value={booking.participants || "N/A"}
                                icon={<Users size={16} />}
                                justify
                            />
                            <InfoBlock
                                label="Event Date"
                                value={
                                    booking.event_start_date &&
                                    booking.event_end_date
                                        ? booking.event_start_date ===
                                          booking.event_end_date
                                            ? formatDate(
                                                  booking.event_start_date
                                              )
                                            : `${formatDate(
                                                  booking.event_start_date
                                              )} - ${formatDate(
                                                  booking.event_end_date
                                              )}`
                                        : "N/A"
                                }
                                icon={<CalendarDays size={16} />}
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
                                icon={<Clock size={16} />}
                            />
                            <InfoBlock
                                label="No. of Participants"
                                value={booking.number_of_participants || "N/A"}
                                icon={<Users size={16} />}
                            />
                        </div>

                        <div className="space-y-4">
                            <InfoBlock
                                label="Description"
                                value={booking.description || "N/A"}
                                icon={<FileText size={16} />}
                                multiline
                                justify
                            />

                            <InfoBlock
                                label="Requested Venue"
                                value={
                                    venues.length ? venues.join(",\n") : "N/A"
                                }
                                icon={<Building2 size={16} />}
                                multiline
                            />
                            <InfoBlock
                                label="Requested Services"
                                value={
                                    requestedServices.length
                                        ? requestedServices.join(",\n")
                                        : "N/A"
                                }
                                icon={<Users size={16} />}
                                multiline
                            />
                            <div>
                                <div className="text-xs text-blue-700 flex items-center gap-1.5 font-semibold">
                                    <Badge size={16} />
                                    Status
                                </div>
                                {getStatusBadge(booking.status, booking)}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-blue-100">
                            {canEdit && (
                                <Button
                                    onClick={() => setShowEdit(true)}
                                    variant="outline"
                                    className="sm:min-w-[120px] rounded-xl border-blue-200"
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                onClick={onClose}
                                className="w-full sm:w-auto sm:min-w-[120px] bg-secondary text-sm text-white hover:bg-primary hover:text-white rounded-xl"
                            >
                                Close
                            </Button>
                        </div>

                        {!canEdit && (
                            <div className="text-xs text-red-500 mt-2 text-center">
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
                onBookingUpdate={handleEditSuccess}
            />

            <Dialog open={showProofModal} onOpenChange={setShowProofModal}>
                <DialogContent className="max-w-md w-full p-0 rounded-2xl shadow-2xl bg-white/90 border border-blue-100">
                    <div className="relative p-6">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowProofModal(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 transition-colors z-10"
                            aria-label="Close"
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        {/* Modal Title */}
                        <div className="flex flex-col items-center mb-4">
                            <BadgeCheck
                                size={22}
                                className="text-blue-500 mb-1"
                            />
                            <span className="font-semibold text-lg text-blue-800">
                                Proof of Approval
                            </span>
                            {booking.proof_of_approval_original_name && (
                                <span className="text-xs text-gray-500 mt-1 text-center break-all">
                                    {booking.proof_of_approval_original_name}
                                </span>
                            )}
                        </div>
                        {/* File Preview */}
                        <div className="flex justify-center items-center bg-blue-50 rounded-xl border border-blue-100 p-3 min-h-[200px] max-h-[350px]">
                            {booking.proof_of_approval &&
                                (/\.(jpg|jpeg|png|gif)$/i.test(
                                    booking.proof_of_approval
                                ) ? (
                                    <img
                                        src={`/storage/${booking.proof_of_approval}`}
                                        alt="Proof of Approval"
                                        className="max-h-72 max-w-full rounded shadow border border-blue-100 object-contain"
                                    />
                                ) : (
                                    <iframe
                                        src={`/storage/${booking.proof_of_approval}`}
                                        title="Proof of Approval"
                                        className="w-full h-72 rounded shadow border border-blue-100 bg-white"
                                    />
                                ))}
                        </div>
                        {/* Download Button */}
                        {booking.proof_of_approval && (
                            <div className="flex justify-center mt-4 gap-2">
                                <a
                                    href={`/storage/${booking.proof_of_approval}`}
                                    download={
                                        booking.proof_of_approval_original_name ||
                                        booking.proof_of_approval
                                            .split("/")
                                            .pop()
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-primary text-white text-sm font-medium shadow transition w-1/2 justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                        />
                                    </svg>
                                    Download
                                </a>
                                <a
                                    href={`/storage/${booking.proof_of_approval}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium shadow transition w-1/2 justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 3h7v7m0 0L10 21l-7-7 11-11z"
                                        />
                                    </svg>
                                    Open in new tab
                                </a>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ViewBookingModal;
