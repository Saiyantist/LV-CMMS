"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Datatable } from "@/Pages/WorkOrders/components/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/Components/shadcnui/badge";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
} from "@/Components/shadcnui/dialog";
import { createPortal } from "react-dom";
import { router } from "@inertiajs/react";
import CreateBookingModal from "./CreateBookingModal";
import ViewBookingModal from "./ViewBookingModal";

// Define the booking type
interface Booking {
    id: number | string;
    date: string;
    venue: string;
    name: string;
    eventDate: string;
    time: string;
    status: "Completed" | "In Progress" | "Cancelled" | "Not Started";
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
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // const [isFilterOpen, setIsFilterOpen] = useState(false); 
        // ‼️ Heyya JOSH, you can refer sa nagawa kong search and filter (for MOBILE) sa IndexLayout.tsx
        // Kasi dito, inayos ko na 'yung search and filter for desktop (datatable).
        // Sa desktop, just add meta { filterable: true } in the column definition of desired column.

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState<any[]>(bookings);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterVenue, setFilterVenue] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState({
        name: "",
        venue: "",
        event_date: "",
        time: "",
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    // Get unique venues for filter dropdown
    const uniqueVenues = Array.from(
        new Set(bookings.map((booking) => booking.venue))
    );

    // Get unique statuses for filter dropdown
    const uniqueStatuses = Array.from(
        new Set(bookings.map((booking) => booking.status))
    );

    // Apply filters and search
    useEffect(() => {
        let result = bookings;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (booking) =>
                    (booking.name || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (booking.venue || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply venue filter
        if (filterVenue) {
            result = result.filter((booking) => booking.venue === filterVenue);
        }

        // Apply status filter
        if (filterStatus) {
            result = result.filter(
                (booking) => booking.status === filterStatus
            );
        }

        setFilteredBookings(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchQuery, filterVenue, filterStatus, bookings]);

    const handleViewBooking = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status: Booking["status"]) => {
        switch (status) {
            case "Completed":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
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
            case "Not Started":
                return (
                    <Badge className="bg-red-500 text-white hover:bg-red-500">
                        Not Started
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleClearFilters = () => {
        setFilterVenue("");
        setFilterStatus("");
    };

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredBookings.slice(startIndex, endIndex);
    };

    // Modal rendering using portal for overlay effect
    const BookingDetailsModal = () =>
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
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id")}</div>,
            meta: { headerClassName: "w-[80px]" },
        },
        {
            accessorKey: "date",
            header: "Date Requested",
            cell: ({ row }) => <div>{row.getValue("date")}</div>,
        },
        {
            accessorKey: "venue",
            header: "Requested Venue",
            cell: ({ row }) => <div>{row.getValue("venue")}</div>,
            meta: {
                searchable: true,
            },
        },
        {
            accessorKey: "name",
            header: "Event Name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
            meta: {
                searchable: true,
            },
        },
        {
            accessorKey: "eventDate",
            header: "Event Date",
            cell: ({ row }) => <div>{row.getValue("eventDate")}</div>,
        },
        {
            accessorKey: "time",
            header: "Event Time",
            cell: ({ row }) => <div>{row.getValue("time")}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.getValue("status")),
            meta: {
                filterable: true,
            }
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Button
                        className="bg-secondary hover:bg-primary text-white"
                        onClick={() => handleViewBooking(row.original)}
                    >
                        View
                    </Button>
                    <Button
                        className="bg-destructive hover:bg-red-700 text-white"
                        onClick={() => handleDeleteBooking(row.original)}
                    >
                        Delete
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    // Handle form input change
    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        router.post("/event-services", form, {
            onError: (errors) => setFormErrors(errors),
            onSuccess: () => {
                setShowCreateModal(false);
                setForm({ name: "", venue: "", event_date: "", time: "" });
            },
        });
    };

    // Delete handler
    const handleDeleteBooking = (booking: Booking) => {
        if (confirm("Are you sure you want to delete this booking?")) {
            router.delete(`/event-services/${booking.id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Bookings" />
            <div className="container mx-auto py-6">

                <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                        <h1 className="text-2xl font-semibold">My Bookings</h1>
                        <Button
                            className="bg-secondary hover:bg-primary text-white"
                            onClick={() => setShowCreateModal(true)}
                        >
                            + Create Booking
                        </Button>
                    </div>
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

                {/* Filter Dropdown */}
                {/* {isFilterOpen && (
                    <div className="border rounded-md p-4 mb-6 shadow-md w-full max-w-md ml-auto">
                        <h3 className="font-semibold text-lg mb-4">Filters</h3>

                        <div className="mb-4">
                            <p className="mb-2">Requested Venue</p>
                            <select
                                className="w-full border rounded-md px-3 py-2"
                                value={filterVenue}
                                onChange={(e) => setFilterVenue(e.target.value)}
                            >
                                <option value="">All Venues</option>
                                {uniqueVenues.map((venue) => (
                                    <option key={venue} value={venue}>
                                        {venue}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <p className="mb-2">Status</p>
                            <select
                                className="w-full border rounded-md px-3 py-2"
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                            >
                                <option value="">All Statuses</option>
                                {uniqueStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <Button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => setIsFilterOpen(false)}
                            >
                                Apply
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleClearFilters}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                )} */}

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
                                    {booking.date}
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
                                    {booking.eventDate}
                                </div>
                                <div>
                                    <strong>Event Time:</strong> {booking.time}
                                </div>

                                <div className="flex justify-end mt-2 w-full">
                                    <div className="flex w-full space-x-2">
                                        <Button
                                            className="w-1/2 bg-secondary hover:bg-primary text-white"
                                            onClick={() =>
                                                handleViewBooking(booking)
                                            }
                                        >
                                            View
                                        </Button>
                                        <Button
                                            className="w-1/2 bg-destructive hover:bg-red-700 text-white"
                                            onClick={() =>
                                                handleDeleteBooking(booking)
                                            }
                                        >
                                            Delete
                                        </Button>
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
                />
            </div>
        </AuthenticatedLayout>
    );
}
