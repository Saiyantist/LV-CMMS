"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import { Input } from "@/Components/shadcnui/input";
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

export default function MyBookings({ bookings = [] }: { bookings?: any[] }) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState<any[]>(bookings);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterVenue, setFilterVenue] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("");

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
                          {/* ...modal content... */}
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
        },
        {
            accessorKey: "name",
            header: "Event Name",
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
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
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleViewBooking(row.original)}
                    >
                        View
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ];

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto py-6">
                <Head title="My Bookings" />

                <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                        <h1 className="text-2xl font-semibold">My Bookings</h1>
                    </div>
                </header>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                    <div className="border rounded-md p-4 mb-6 shadow-md w-full max-w-md ml-auto">
                        <h3 className="font-semibold text-lg mb-4">Filter</h3>

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
                )}

                {/* Desktop Table View (Datatable) */}
                <div className="hidden md:block border rounded-md overflow-hidden">
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
                                    <div className="w-1/3">
                                        <Button
                                            className="w-full bg-secondary hover:bg-blue-700 text-white"
                                            onClick={() =>
                                                handleViewBooking(booking)
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>

                            
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                        >
                            <ArrowLeft size={16} />
                            Previous
                        </Button>

                        {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={
                                            currentPage === pageNumber
                                                ? "default"
                                                : "outline"
                                        }
                                        className={`w-8 h-8 p-0 ${
                                            currentPage === pageNumber
                                                ? "bg-blue-600"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setCurrentPage(pageNumber)
                                        }
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            }
                        )}

                        {totalPages > 5 && <span>...</span>}

                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ArrowLeft size={16} className="rotate-180" />
                        </Button>
                    </div>
                </div>

                {/* Booking Details Modal */}
                <BookingDetailsModal />
            </div>
        </AuthenticatedLayout>
    );
}
