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
        | "In Progress"
        | "Cancelled"
        // | "Not Started"
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
        "Completed",
        "In Progress",
        "Cancelled",
        "Rejected",
    ];
    const [activeTab, setActiveTab] = useState<Booking["status"]>("Pending");

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
        let result = bookings;

        // Parse venue/requested_services if needed
        result = result.map((booking) => ({
            ...booking,
            venue: Array.isArray(booking.venue)
                ? booking.venue
                : booking.venue
                ? JSON.parse(booking.venue)
                : [],
            requestedServices: Array.isArray(booking.requested_services)
                ? booking.requested_services
                : booking.requested_services
                ? JSON.parse(booking.requested_services)
                : [],
        }));

        // Filter by tab (status) for admin roles
        if (isAdmin && activeTab) {
            result = result.filter((booking) => booking.status === activeTab);
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
    }, [searchQuery, filterVenue, filterStatus, bookings, isAdmin, activeTab]);

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
            case "In Progress":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        In Progress
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

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredBookings.slice(startIndex, endIndex);
    };

    // Modal rendering using portal for overlay effect
    // const BookingDetailsModal = () =>
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
                const venuesStr =
                    typeof venues === "string" ? venues : String(venues ?? "");
                return (
                    <div title={venuesStr}>
                        {venuesStr && venuesStr.length > 25
                            ? venuesStr.slice(0, 25) + "..."
                            : venuesStr}
                    </div>
                );
            },
            meta: { searchable: true },
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
                            ? `${formatDate(start)} - ${formatDate(end)}`
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
                const statusOptions: Booking["status"][] = [
                    "Pending",
                    "Approved",
                    "Rejected",
                    "Cancelled",
                    "Completed",
                    "In Progress",
                ];
                const statusStyles: Record<string, React.CSSProperties> = {
                    Pending: { background: "#e0f2fe", color: "#0369a1" },
                    Approved: { background: "#e0e7ff", color: "#4338ca" },
                    Rejected: { background: "#ef4444", color: "#fff" },
                    Cancelled: { background: "#f97316", color: "#fff" },
                    Completed: { background: "#bbf7d0", color: "#166534" },
                    "In Progress": { background: "#fef9c3", color: "#854d0e" },
                };
                return (
                    <div className="relative inline-flex items-center">
                        <select
                            className="rounded px-2 py-1 border text-xs pr-6 appearance-none"
                            value={booking.status}
                            onChange={(e) =>
                                handleStatusChange(
                                    booking,
                                    e.target.value as Booking["status"]
                                )
                            }
                            disabled={!isAdmin}
                            style={
                                statusStyles[booking.status] || {
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
                        <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex items-center ml-1">
                            <ChevronDown className="w-4 h-4 text-black" />
                        </span>
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
                return (
                    <div className="flex justify-center space-x-2">
                        <Button
                            className="bg-secondary text-xs hover:bg-primary text-white"
                            onClick={() => handleViewBooking(booking)}
                            disabled={!canEdit}
                        >
                            View
                        </Button>
                        {isAdmin ? (
                            <Button
                                className="bg-destructive text-xs hover:bg-red-700 text-white"
                                onClick={() => handleDeleteBooking(booking)}
                            >
                                Delete
                            </Button>
                        ) : (
                            <Button
                                className="bg-orange-500 text-xs hover:bg-orange-600 text-white"
                                onClick={() => handleCancelBooking(booking)}
                                disabled={booking.status !== "Pending"}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                );
            },
            enableSorting: false,
        },
    ];

    // Delete handler
    const handleDeleteBooking = (booking: Booking) => {
        if (confirm("Are you sure you want to delete this booking?")) {
            router.delete(`/event-services/${booking.id}`);
        }
    };

    // Cancel handler
    const handleCancelBooking = (booking: Booking) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            router.put(
                `/event-services/${booking.id}`,
                { status: "Cancelled" },
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        }
    };

    // Add this handler in your component:
    const handleStatusChange = (
        booking: Booking,
        newStatus: Booking["status"]
    ) => {
        // Optionally, show a loading indicator or optimistic UI update
        router.put(
            `/event-services/${booking.id}`,
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Optionally refetch or update local state
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

    return (
        <AuthenticatedLayout>
            <Head title="Bookings" />
            <div className="container mx-auto py-6">
                <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                        <h1 className="text-2xl font-semibold">
                            {isAdmin &&
                            userRoles.includes("communications_officer")
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
                        <div className="mt-4">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
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
                    {getCurrentPageItems().map((booking, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 bg-white shadow"
                        >
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <strong>ID:</strong> {booking.id}
                                    </div>
                                    <div className="rounded-full">
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </div>

                                <div>
                                    <strong>Date Requested:</strong>{" "}
                                    {formatDate(booking.date)}
                                </div>
                                <div>
                                    <strong>Requested Venue:</strong>{" "}
                                    {booking.venue}
                                </div>
                                <div>
                                    <strong>Event Name:</strong> {booking.name}
                                </div>
                                <div>
                                    <strong>Event Date:</strong>{" "}
                                    {formatDate(booking.eventDate)}
                                </div>
                                <div>
                                    <strong>Event Time:</strong>{" "}
                                    {formatTime(booking.time)}
                                </div>

                                <div className="flex justify-end mt-2 w-full">
                                    <div className="flex w-full space-x-1">
                                        <Button
                                            className="w-1/2 bg-secondary hover:bg-primary text-white"
                                            onClick={() =>
                                                handleViewBooking(booking)
                                            }
                                            disabled={
                                                !isAdmin &&
                                                booking.status !== "Pending"
                                            }
                                        >
                                            View
                                        </Button>
                                        {isAdmin ? (
                                            <Button
                                                className="w-1/2 bg-destructive hover:bg-red-700 text-white"
                                                onClick={() =>
                                                    handleDeleteBooking(booking)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white"
                                                onClick={() =>
                                                    handleCancelBooking(booking)
                                                }
                                                disabled={
                                                    booking.status !== "Pending"
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
