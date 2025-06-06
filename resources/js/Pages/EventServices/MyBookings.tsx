import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Datatable } from "@/Components/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/Components/shadcnui/badge";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
} from "@/Components/shadcnui/dialog";
import { createPortal } from "react-dom";
import { router, usePage } from "@inertiajs/react";
import CreateBookingModal from "./CreateBookingModal";
import ViewBookingModal from "./ViewBookingModal";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcnui/tabs";

// Define the booking type
export interface Booking {
    id: number | string;
    date: string;
    venue: string;
    name: string;
    eventDate: string;
    time: string;
    status:
        | "Completed"
        | "On Going"
        | "Cancelled"
        | "Pending"
        | "Rejected"
        | "Approved";

    // Additional fields for view modal
    email?: string;
    type?: string;
    day?: string;
    proofOfApproval?: {
        fileName: string;
        fileSize: string;
    };
    department?: string;
    eventPurpose?: string;
    participants?: string;
    numberOfParticipants?: number;
    requestedServices?: {
        generalAdministrative?: string;
        communicationOffice?: string;
        managementInformationSystems?: string;
        campusSafety?: string;
    };
    compliance?: {
        dataPrivacy?: string;
        complianceAndConsent?: string;
    };
    [key: string]: any;
}

export default function MyBookings({
    bookings = [],
    venueNames = [],
}: {
    bookings?: any[];
    venueNames?: string[];
}) {
    const { props } = usePage();
    const user = props.auth?.user || {};
    const userRoles = user.roles?.map((r: any) => r.name) || [];
    const isAdmin =
        userRoles.includes("super_admin") ||
        userRoles.includes("communications_officer");

    // Tabs logic
    const bookingTabs: Booking["status"][] = [
        "Pending",
        "Approved",
        "On Going",
        "Completed",
        "Cancelled",
        "Rejected",
    ];
    const [activeTab, setActiveTab] = useState<Booking["status"]>("Pending");
    const handleTabChange = (value: string) => {
        setActiveTab(value as Booking["status"]);
    };

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState<any[]>(bookings);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterVenue] = useState<string>("");
    const [filterStatus] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        let result = bookings.map((booking) => {
            // Compute if booking is "On Going"
            const today = new Date();
            const start = booking.event_start_date
                ? new Date(booking.event_start_date)
                : null;
            const end = booking.event_end_date
                ? new Date(booking.event_end_date)
                : null;
            const isOngoing =
                booking.status === "Approved" &&
                start &&
                end &&
                today >= start &&
                today <= end;

            return {
                ...booking,
                displayStatus: isOngoing ? "On Going" : booking.status,
            };
        });

        // Filter by tab (status) for admin roles
        if (isAdmin && activeTab) {
            if (activeTab === "On Going") {
                result = result.filter(
                    (booking) => booking.displayStatus === "On Going"
                );
            } else {
                result = result.filter(
                    (booking) => booking.displayStatus === activeTab
                );
            }
        }

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (booking) =>
                    (booking.name || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (Array.isArray(booking.venue)
                        ? booking.venue.join(", ")
                        : booking.venue || ""
                    )
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply venue filter
        if (filterVenue) {
            result = result.filter((booking) =>
                Array.isArray(booking.venue)
                    ? booking.venue.includes(filterVenue)
                    : booking.venue === filterVenue
            );
        }

        // Apply status filter (for non-admins, or if you want to allow further filtering)
        if (filterStatus) {
            result = result.filter(
                (booking) => booking.status === filterStatus
            );
        }

        setFilteredBookings(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [
        searchQuery,
        filterVenue,
        filterStatus,
        bookings,
        isAdmin,
        activeTab,
        showCreateModal,
        isModalOpen,
    ]);

    const handleViewBooking = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status: Booking["status"]) => {
        switch (status) {
            case "Completed":
                return (
                    <Badge className="bg-green-200 text-green-800 hover:bg-green-200">
                        Completed
                    </Badge>
                );
            case "On Going":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        On Going
                    </Badge>
                );
            case "Cancelled":
                return (
                    <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                        Cancelled
                    </Badge>
                );
            case "Rejected":
                return (
                    <Badge className="bg-red-500 text-white hover:bg-red-500">
                        Rejected
                    </Badge>
                );
            case "Pending":
                return (
                    <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200">
                        Pending
                    </Badge>
                );
            case "Approved":
                return (
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                        Approved
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-200 text-gray-800">
                        {status}
                    </Badge>
                );
        }
    };
    
    isModalOpen && selectedBooking
        ? createPortal(
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                      <button
                          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                          onClick={() => setIsModalOpen(false)}
                          aria-label="Close"
                      >
                          ×
                      </button>
                      <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                              <ArrowLeft
                                  className="cursor-pointer"
                                  onClick={() => setIsModalOpen(false)}
                              />
                              {selectedBooking?.name}
                          </DialogTitle>
                      </DialogHeader>
                  </div>
              </div>,
              document.body
          )
        : null;

    // Datatable columns (UI only)
    const columns: ColumnDef<Booking>[] = [
        {
            accessorKey: "date",
            header: "Date Requested",
            cell: ({ row }) => <div>{formatDate(row.getValue("date"))}</div>,
        },
        {
            accessorKey: "venue",
            header: "Requested Venue",
            cell: ({ row }) => {
                let venues = Array.isArray(row.original.venue)
                    ? row.original.venue.join(", ")
                    : row.getValue("venue");
                // Remove brackets and quotes if present
                let venuesStr =
                    typeof venues === "string" ? venues : String(venues ?? "");
                venuesStr = venuesStr
                    .replace(/^\["|"\]$/g, "")
                    .replace(/","/g, ", ");
                return (
                    <div title={venuesStr}>
                        {venuesStr && venuesStr.length > 25
                            ? venuesStr.slice(0, 25) + "..."
                            : venuesStr}
                    </div>
                );
            },
            // meta: { searchable: false, filterable: true }, // Remove
        },
        {
            accessorKey: "name",
            header: "Event Name",
            cell: ({ row }) => {
                const name = row.getValue("name") as string;
                return (
                    <div title={name}>
                        {name && name.length > 25
                            ? name.slice(0, 25) + "..."
                            : name}
                    </div>
                );
            },
            meta: {
                searchable: true,
            },
        },
        {
            accessorKey: "eventDate",
            header: "Event Date",
            cell: ({ row }) => {
                const start = row.original.event_start_date;
                const end = row.original.event_end_date;
                return (
                    <div>
                        {start && end
                            ? start === end
                                ? formatDate(start)
                                : `${formatDate(start)} - ${formatDate(end)}`
                            : "N/A"}
                    </div>
                );
            },
        },
        {
            accessorKey: "time",
            header: "Event Time",
            cell: ({ row }) => {
                const start = row.original.event_start_time;
                const end = row.original.event_end_time;
                return (
                    <div>
                        {start && end
                            ? `${formatTime(start)} - ${formatTime(end)}`
                            : "N/A"}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const booking = row.original;

                // Compute display status for dropdown
                const today = new Date();
                const start = booking.event_start_date
                    ? new Date(booking.event_start_date)
                    : null;
                const end = booking.event_end_date
                    ? new Date(booking.event_end_date)
                    : null;

                let displayStatus: Booking["status"] = booking.status;
                if (
                    booking.status === "Approved" &&
                    start &&
                    end &&
                    today >= start &&
                    today <= end
                ) {
                    displayStatus = "On Going";
                } else if (
                    booking.status === "Approved" &&
                    end &&
                    today > end
                ) {
                    displayStatus = "Completed";
                }

                const statusOptions: Booking["status"][] = [
                    "Pending",
                    displayStatus === "On Going" ? "On Going" : "Approved",
                    "Rejected",
                    "Cancelled",
                    // "Completed", // <-- Removed from dropdown options
                ];

                const statusStyles: Record<string, React.CSSProperties> = {
                    Pending: { background: "#e0f2fe", color: "#0369a1" },
                    Approved: { background: "#e0e7ff", color: "#4338ca" },
                    "On Going": { background: "#fef9c3", color: "#854d0e" },
                    Rejected: { background: "#ef4444", color: "#fff" },
                    Cancelled: { background: "#f97316", color: "#fff" },
                    Completed: { background: "#bbf7d0", color: "#166534" },
                };

                // Remove dropdown in "On Going" and "Completed" tab/status
                if (
                    activeTab === "On Going" ||
                    displayStatus === "On Going" ||
                    activeTab === "Completed" ||
                    displayStatus === "Completed"
                ) {
                    return (
                        <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={
                                statusStyles[displayStatus] || {
                                    background: "#e5e7eb",
                                    color: "#374151",
                                }
                            }
                        >
                            {displayStatus}
                        </span>
                    );
                }

                return (
                    <div className="relative inline-flex items-center">
                        <select
                            className="rounded px-2 py-1 border text-xs pr-6 appearance-none"
                            value={displayStatus}
                            onChange={(e) =>
                                handleStatusChange(
                                    booking,
                                    e.target.value as Booking["status"]
                                )
                            }
                            disabled={!isAdmin}
                            style={
                                statusStyles[displayStatus] || {
                                    background: "#e5e7eb",
                                    color: "#374151",
                                }
                            }
                        >
                            {statusOptions.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                    style={
                                        statusStyles[status] || {
                                            background: "#e5e7eb",
                                            color: "#374151",
                                        }
                                    }
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                        {isAdmin && (
                            <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex items-center ml-1">
                                <ChevronDown className="w-4 h-4 text-black" />
                            </span>
                        )}
                    </div>
                );
            },
            meta: {
                filterable: true,
            },
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => {
                const booking = row.original;
                const canEdit = isAdmin || booking.status === "Pending";
                const hideDelete = ["Pending", "Approved", "On Going"].includes(
                    activeTab
                );

                return (
                    <div className="flex justify-center space-x-2">
                        <Button
                            className="bg-secondary text-xs hover:bg-primary text-white"
                            onClick={() => handleViewBooking(booking)}
                            disabled={!canEdit}
                        >
                            View
                        </Button>
                        {isAdmin && !hideDelete ? (
                            <Button
                                className="bg-destructive text-xs hover:bg-red-700 text-white"
                                onClick={() =>
                                    openConfirm(
                                        "Are you sure you want to delete this booking?",
                                        () => handleDeleteBooking(booking)
                                    )
                                }
                            >
                                Delete
                            </Button>
                        ) : !isAdmin ? (
                            <Button
                                className="bg-orange-500 text-xs hover:bg-orange-600 text-white"
                                onClick={() =>
                                    openConfirm(
                                        "Are you sure you want to cancel this booking?",
                                        () => handleCancelBooking(booking)
                                    )
                                }
                                disabled={booking.status !== "Pending"}
                            >
                                Cancel
                            </Button>
                        ) : null}
                    </div>
                );
            },

            enableSorting: false,
        },
    ];

    // Delete handler
    const handleDeleteBooking = (booking: Booking) => {
        router.delete(`/event-services/${booking.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setFilteredBookings((prev) =>
                    prev.filter((b) => b.id !== booking.id)
                );
            },
        });
    };

    // Cancel handler
    const handleCancelBooking = (booking: Booking) => {
        router.put(
            `/event-services/${booking.id}`,
            { status: "Cancelled" },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setFilteredBookings((prev) =>
                        prev.map((b) =>
                            b.id === booking.id
                                ? {
                                      ...b,
                                      status: "Cancelled",
                                      displayStatus: "Cancelled",
                                  }
                                : b
                        )
                    );
                },
            }
        );
    };

    // Status change handler
    const handleStatusChange = (
        booking: Booking,
        newStatus: Booking["status"]
    ) => {
        router.put(
            `/event-services/${booking.id}`,
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setFilteredBookings((prev) =>
                        prev.map((b) =>
                            b.id === booking.id
                                ? {
                                      ...b,
                                      status: newStatus,
                                      displayStatus: newStatus,
                                  }
                                : b
                        )
                    );
                },
            }
        );
    };

    // Format date as "Month Day, Year"
    function formatDate(dateString: string) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    // Format time as "hh:mm AM/PM"
    function formatTime(timeString: string) {
        if (!timeString) return "";
        const [hour, minute] = timeString.split(":");
        const date = new Date();
        date.setHours(Number(hour), Number(minute));
        return date.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    // iOS-like confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        message: string;
        onConfirm: (() => void) | null;
    }>({ open: false, message: "", onConfirm: null });

    // Helper to open confirmation modal
    const openConfirm = (message: string, onConfirm: () => void) => {
        setConfirmModal({ open: true, message, onConfirm });
    };

    // Helper to close confirmation modal
    const closeConfirm = () => {
        setConfirmModal({ open: false, message: "", onConfirm: null });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bookings" />
            <div className="container mx-auto py-6">
                <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                        <h1 className="text-2xl font-semibold">
                            {(isAdmin &&
                                userRoles.includes("communications_officer")) ||
                            userRoles.includes("super_admin")
                                ? "Requests Management"
                                : "My Bookings"}
                        </h1>
                        <Button
                            className="bg-secondary hover:bg-primary text-white"
                            onClick={() =>
                                router.visit("/event-services/request")
                            }
                        >
                            + Create Booking
                        </Button>
                    </div>
                    {/* Tabs for super admin & communications officer */}
                    {isAdmin && (
                        <>
                            {/* Desktop Tabs */}
                            <div className="hidden md:block mt-4">
                                <Tabs
                                    value={activeTab}
                                    onValueChange={handleTabChange}
                                >
                                    <TabsList className="bg-transparent text-black rounded-md mb-6 flex flex-wrap justify-start">
                                        {bookingTabs.map((tab) => (
                                            <TabsTrigger
                                                key={tab}
                                                value={tab}
                                                className="data-[state=active]:bg-secondary data-[state=active]:text-white"
                                            >
                                                {tab}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                            {/* Mobile Dropdown */}
                            <div className="md:hidden flex justify-end px-4 mt-4">
                                <select
                                    value={activeTab}
                                    onChange={(e) =>
                                        handleTabChange(e.target.value)
                                    }
                                    className="border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                                >
                                    {bookingTabs.map((tab) => (
                                        <option key={tab} value={tab}>
                                            {tab}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </header>

                <CreateBookingModal
                    open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    venueNames={
                        venueNames.length
                            ? venueNames
                            : [
                                  "Auditorium",
                                  "Auditorium Lobby",
                                  "College Library",
                                  "Meeting Room",
                                  "Training Room A",
                                  "Computer Laboratory A",
                                  "Computer Laboratory B",
                                  "EFS Classroom(s) Room #:",
                                  "LVCC Grounds",
                                  "LVCC  Main Lobby",
                                  "Elementary & High School Library",
                                  "Basketball Court",
                              ]
                    }
                />

                {/* iOS-like Confirmation Modal */}
                <Dialog open={confirmModal.open} onOpenChange={closeConfirm}>
                    <DialogContent className="max-w-xs rounded-2xl p-6 bg-white/90 text-center shadow-xl border border-blue-100">
                        <div className="text-lg font-semibold text-gray-800 mb-4">
                            {confirmModal.message}
                        </div>
                        <div className="flex justify-center gap-3 mt-2">
                            <Button
                                className="flex-1 rounded-xl bg-gray-100 text-gray-800 font-semibold shadow-none border border-gray-200"
                                onClick={closeConfirm}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 rounded-xl bg-blue-600 text-white font-semibold shadow"
                                onClick={() => {
                                    if (confirmModal.onConfirm)
                                        confirmModal.onConfirm();
                                    closeConfirm();
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Desktop Table View (Datatable) */}
                <div className="hidden md:block -mt-16 overflow-hidden">
                    <Datatable
                        columns={columns as any}
                        data={filteredBookings}
                        placeholder="Search Bookings"
                    />
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col gap-4">
                    {filteredBookings.map((booking, index) => {
                        // Venue formatting: remove [" "] and ellipsis if > 25 chars
                        let venues = Array.isArray(booking.venue)
                            ? booking.venue.join(", ")
                            : booking.venue;
                        let venuesStr =
                            typeof venues === "string"
                                ? venues
                                : String(venues ?? "");
                        venuesStr = venuesStr
                            .replace(/^\["|"\]$/g, "")
                            .replace(/","/g, ", ");
                        if (venuesStr.length > 25) {
                            venuesStr = venuesStr.slice(0, 25) + "...";
                        }

                        // Event Date formatting (single or range)
                        let eventDate = "N/A";
                        if (
                            booking.event_start_date &&
                            booking.event_end_date
                        ) {
                            eventDate =
                                booking.event_start_date ===
                                booking.event_end_date
                                    ? formatDate(booking.event_start_date)
                                    : `${formatDate(
                                          booking.event_start_date
                                      )} - ${formatDate(
                                          booking.event_end_date
                                      )}`;
                        }

                        // Event Time formatting (single or range)
                        let eventTime = "N/A";
                        if (
                            booking.event_start_time &&
                            booking.event_end_time
                        ) {
                            eventTime = `${formatTime(
                                booking.event_start_time
                            )} - ${formatTime(booking.event_end_time)}`;
                        }

                        // Hide Delete button for Pending, Approved, On Going tabs
                        const hideDelete = [
                            "Pending",
                            "Approved",
                            "On Going",
                        ].includes(activeTab);

                        return (
                            <div
                                key={index}
                                className="rounded-2xl p-4 bg-white/80 backdrop-blur-md shadow-lg border border-blue-100"
                                style={{
                                    boxShadow:
                                        "0 8px 32px 0 rgba(52, 120, 246, 0.10)",
                                }}
                            >
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="font-semibold text-blue-700">
                                            #{booking.id}
                                        </div>
                                        <div className="rounded-full">
                                            {getStatusBadge(
                                                (booking.status ===
                                                    "Approved" &&
                                                    booking.event_start_date &&
                                                    booking.event_end_date &&
                                                    (() => {
                                                        const today =
                                                            new Date();
                                                        const start = new Date(
                                                            booking.event_start_date
                                                        );
                                                        const end = new Date(
                                                            booking.event_end_date
                                                        );
                                                        if (
                                                            today >= start &&
                                                            today <= end
                                                        )
                                                            return "On Going";
                                                        if (today > end)
                                                            return "Completed";
                                                        return booking.status;
                                                    })()) ||
                                                    booking.status
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Date Requested:
                                        </span>{" "}
                                        <span className="font-medium">
                                            {formatDate(booking.date)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Venue:
                                        </span>{" "}
                                        <span
                                            className="font-medium"
                                            title={venuesStr}
                                        >
                                            {venuesStr}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Event:
                                        </span>{" "}
                                        <span className="font-medium">
                                            {booking.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Event Date:
                                        </span>{" "}
                                        <span className="font-medium">
                                            {eventDate}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Event Time:
                                        </span>{" "}
                                        <span className="font-medium">
                                            {eventTime}
                                        </span>
                                    </div>
                                    <div className="flex justify-end mt-3 w-full">
                                        <div className="flex w-full space-x-2">
                                            {/* Pending Tab: [Approved][View][Reject] */}
                                            {isAdmin &&
                                            activeTab === "Pending" ? (
                                                <>
                                                    <Button
                                                        className="w-1/3 rounded-md sm:rounded-xl bg-secondary hover:bg-primary text-white font-semibold shadow"
                                                        onClick={() =>
                                                            handleViewBooking(
                                                                booking
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        className="w-1/3 rounded-md sm:rounded-xl bg-green-500 hover:bg-green-700 text-white font-semibold shadow"
                                                        onClick={() =>
                                                            openConfirm(
                                                                "Are you sure you want to approve this booking?",
                                                                () =>
                                                                    handleStatusChange(
                                                                        booking,
                                                                        "Approved"
                                                                    )
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        className="w-1/3 rounded-md sm:rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
                                                        onClick={() =>
                                                            openConfirm(
                                                                "Are you sure you want to reject this booking?",
                                                                () =>
                                                                    handleStatusChange(
                                                                        booking,
                                                                        "Rejected"
                                                                    )
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : isAdmin &&
                                              activeTab === "Approved" ? (
                                                <>
                                                    <Button
                                                        className="w-1/2 rounded-md sm:rounded-xl bg-secondary hover:bg-primary text-white font-semibold shadow"
                                                        onClick={() =>
                                                            handleViewBooking(
                                                                booking
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        className="w-1/2 rounded-md sm:rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow"
                                                        onClick={() =>
                                                            openConfirm(
                                                                "Are you sure you want to cancel this booking?",
                                                                () =>
                                                                    handleStatusChange(
                                                                        booking,
                                                                        "Cancelled"
                                                                    )
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : isAdmin &&
                                              activeTab === "On Going" ? (
                                                <>
                                                    <Button
                                                        className="w-1/2 rounded-md sm:rounded-xl bg-secondary hover:bg-primary text-white font-semibold shadow"
                                                        onClick={() =>
                                                            handleViewBooking(
                                                                booking
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        className="w-1/2 rounded-md sm:rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow"
                                                        onClick={() =>
                                                            openConfirm(
                                                                "Are you sure you want to cancel this booking?",
                                                                () =>
                                                                    handleStatusChange(
                                                                        booking,
                                                                        "Cancelled"
                                                                    )
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                // Default: original logic for other tabs and non-admins
                                                <>
                                                    <Button
                                                        className={`${
                                                            (isAdmin &&
                                                                !hideDelete) ||
                                                            (!isAdmin &&
                                                                booking.status ===
                                                                    "Pending")
                                                                ? "w-1/2"
                                                                : "w-full"
                                                        } rounded-md sm:rounded-xl bg-secondary hover:bg-primary text-white font-semibold shadow`}
                                                        onClick={() =>
                                                            handleViewBooking(
                                                                booking
                                                            )
                                                        }
                                                        disabled={
                                                            !isAdmin &&
                                                            booking.status !==
                                                                "Pending"
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                    {isAdmin && !hideDelete ? (
                                                        <Button
                                                            className="w-1/2 rounded-md sm:rounded-xl bg-destructive hover:bg-destructive text-white font-semibold shadow"
                                                            onClick={() =>
                                                                openConfirm(
                                                                    "Are you sure you want to delete this booking?",
                                                                    () =>
                                                                        handleDeleteBooking(
                                                                            booking
                                                                        )
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    ) : (
                                                        !isAdmin && (
                                                            <Button
                                                                className="w-1/2 rounded-md sm:rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow"
                                                                onClick={() =>
                                                                    openConfirm(
                                                                        "Are you sure you want to cancel this booking?",
                                                                        () =>
                                                                            handleCancelBooking(
                                                                                booking
                                                                            )
                                                                    )
                                                                }
                                                                disabled={
                                                                    booking.status !==
                                                                    "Pending"
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <ViewBookingModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    booking={selectedBooking}
                    venueNames={venueNames}
                    canEdit={isAdmin || selectedBooking?.status === "Pending"}
                />
            </div>
        </AuthenticatedLayout>
    );
}
