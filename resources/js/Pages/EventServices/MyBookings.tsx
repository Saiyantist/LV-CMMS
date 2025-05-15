"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import { Input } from "@/Components/shadcnui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/shadcnui/table";
import { Badge } from "@/Components/shadcnui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/shadcnui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
                          <div className="grid grid-cols-2 gap-6 mt-4">
                              <div>
                                  <div className="mb-4">
                                      <p className="font-semibold">Name:</p>
                                      <p>
                                          {selectedBooking.name ||
                                              "Not specified"}
                                      </p>
                                  </div>
                                  <div className="mb-4">
                                      <p className="font-semibold">Email:</p>
                                      <p>
                                          {selectedBooking.email ||
                                              "Not specified"}
                                      </p>
                                  </div>
                                  <div className="mb-4">
                                      <p className="font-semibold">Type:</p>
                                      <p>
                                          {selectedBooking.type ||
                                              "Not specified"}
                                      </p>
                                  </div>
                              </div>
                              <div>
                                  <div className="mb-4">
                                      <p className="font-semibold">Date:</p>
                                      <p>
                                          {selectedBooking.eventDate.replace(
                                              " - ",
                                              " - "
                                          )}
                                      </p>
                                  </div>
                                  <div className="mb-4">
                                      <p className="font-semibold">Day:</p>
                                      <p>
                                          {selectedBooking.day ||
                                              "Not specified"}
                                      </p>
                                  </div>
                                  <div className="mb-4">
                                      <p className="font-semibold">Time:</p>
                                      <p>{selectedBooking.time}</p>
                                  </div>
                                  <div className="mb-4">
                                      <p className="font-semibold">Status:</p>
                                      <div>
                                          {getStatusBadge(
                                              selectedBooking.status
                                          )}
                                      </div>
                                  </div>
                              </div>
                              <div className="col-span-2">
                                  <h3 className="font-semibold text-lg mb-2">
                                      Proof of Approval
                                  </h3>
                                  {selectedBooking.proofOfApproval ? (
                                      <div className="border rounded-md p-3 flex items-center gap-2 mb-4 max-w-md">
                                          <FileText size={18} />
                                          <div className="flex-1">
                                              <p className="text-sm">
                                                  {
                                                      selectedBooking
                                                          .proofOfApproval
                                                          .fileName
                                                  }
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                  {
                                                      selectedBooking
                                                          .proofOfApproval
                                                          .fileSize
                                                  }
                                              </p>
                                          </div>
                                      </div>
                                  ) : (
                                      <p className="text-gray-500">
                                          No proof of approval provided
                                      </p>
                                  )}
                              </div>
                              <div className="col-span-2">
                                  <h3 className="font-semibold text-lg mb-2">
                                      Requested Venue
                                  </h3>
                                  <p className="mb-4">
                                      {selectedBooking.venue}
                                  </p>
                              </div>
                              <div className="col-span-2">
                                  <h3 className="font-semibold text-lg mb-2">
                                      Event Details
                                  </h3>
                                  <div className="space-y-2 mb-4">
                                      <div>
                                          <p className="font-semibold">
                                              Event Name:
                                          </p>
                                          <p>{selectedBooking.name}</p>
                                      </div>
                                      <div>
                                          <p className="font-semibold">
                                              Department:
                                          </p>
                                          <p>
                                              {selectedBooking.department ||
                                                  "Not specified"}
                                          </p>
                                      </div>
                                      <div>
                                          <p className="font-semibold">
                                              Event Purpose:
                                          </p>
                                          <p>
                                              {selectedBooking.eventPurpose ||
                                                  "Not specified"}
                                          </p>
                                      </div>
                                      <div>
                                          <p className="font-semibold">
                                              Participants:
                                          </p>
                                          <p>
                                              {selectedBooking.participants ||
                                                  "Not specified"}
                                          </p>
                                      </div>
                                      <div>
                                          <p className="font-semibold">
                                              Number of Participants:
                                          </p>
                                          <p>
                                              {selectedBooking.numberOfParticipants ||
                                                  "Not specified"}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                              {selectedBooking.requestedServices && (
                                  <div className="col-span-2">
                                      <h3 className="font-semibold text-lg mb-2">
                                          Requested Services
                                      </h3>
                                      <div className="space-y-2 mb-4">
                                          <div>
                                              <p className="font-semibold">
                                                  General Administrative
                                                  Services:
                                              </p>
                                              <p>
                                                  {selectedBooking
                                                      .requestedServices
                                                      .generalAdministrative ||
                                                      "None"}
                                              </p>
                                          </div>
                                          <div>
                                              <p className="font-semibold">
                                                  Communication Office:
                                              </p>
                                              <p>
                                                  {selectedBooking
                                                      .requestedServices
                                                      .communicationOffice ||
                                                      "None"}
                                              </p>
                                          </div>
                                          <div>
                                              <p className="font-semibold">
                                                  Management Information
                                                  Systems:
                                              </p>
                                              <p>
                                                  {selectedBooking
                                                      .requestedServices
                                                      .managementInformationSystems ||
                                                      "None"}
                                              </p>
                                          </div>
                                          <div>
                                              <p className="font-semibold">
                                                  Campus Safety and Security:
                                              </p>
                                              <p>
                                                  {selectedBooking
                                                      .requestedServices
                                                      .campusSafety || "None"}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              )}
                              {selectedBooking.compliance && (
                                  <div className="col-span-2">
                                      <h3 className="font-semibold text-lg mb-2">
                                          Compliance and Consent
                                      </h3>
                                      <div className="space-y-2 mb-4">
                                          <div>
                                              <p className="font-semibold">
                                                  Data Privacy Notice:
                                              </p>
                                              <p>
                                                  {selectedBooking.compliance
                                                      .dataPrivacy ||
                                                      "Not specified"}
                                              </p>
                                          </div>
                                          <div>
                                              <p className="font-semibold">
                                                  Compliance and Consent:
                                              </p>
                                              <p>
                                                  {selectedBooking.compliance
                                                      .complianceAndConsent ||
                                                      "Not specified"}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>,
                  document.body
              )
            : null;

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto py-6">
                <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

                <div className="flex justify-between mb-6">
                    <div className="relative w-80">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <Input
                            className="pl-10 pr-4 py-2 border rounded-full"
                            placeholder="Search Description"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={18} />
                        Filter
                    </Button>
                </div>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                    <div className="border rounded-md p-4 mb-6 shadow-md w-full max-w-md ml-auto">
                        <h3 className="font-semibold text-lg mb-4">Filter</h3>

                        <div className="mb-4">
                            <p className="mb-2">Requested Venue</p>
                            <Select
                                value={filterVenue}
                                onValueChange={setFilterVenue}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select venue" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Venues
                                    </SelectItem>
                                    {uniqueVenues.map((venue) => (
                                        <SelectItem key={venue} value={venue}>
                                            {venue}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-4">
                            <p className="mb-2">Status</p>
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    {uniqueStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                {/* Desktop Table View */}
                <div className="hidden md:block border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Date Requested</TableHead>
                                <TableHead>Requested Venue</TableHead>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Event Date</TableHead>
                                <TableHead>Event Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {getCurrentPageItems().map((booking, index) => (
                                <TableRow key={index}>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>{booking.date}</TableCell>
                                    <TableCell>{booking.venue}</TableCell>
                                    <TableCell>{booking.name}</TableCell>
                                    <TableCell>{booking.eventDate}</TableCell>
                                    <TableCell>{booking.time}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(booking.status)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() =>
                                                handleViewBooking(booking)
                                            }
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col gap-4">
                    {getCurrentPageItems().map((booking, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 bg-white shadow"
                        >
                            <div className="text-sm space-y-2">
                                <div>
                                    <strong>ID:</strong> {booking.id}
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
                                <div>
                                    <strong>Status:</strong>{" "}
                                    {getStatusBadge(booking.status)}
                                </div>
                                <div className="flex justify-end mt-2">
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() =>
                                            handleViewBooking(booking)
                                        }
                                    >
                                        View
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
