import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ListEvent {
    id: string;
    date: string;
    venue: string;
    eventDate: string;
    time: string;
    name: string;
    status: string;
}

interface BookingListProps {
    listEvents: ListEvent[];
    getStatusBadge: (status: string) => React.JSX.Element;
}

const EVENTS_PER_PAGE = 5;

export default function BookingList({
    listEvents,
    getStatusBadge,
}: BookingListProps) {
    const [page, setPage] = React.useState(1);

    const totalPages = Math.ceil(listEvents.length / EVENTS_PER_PAGE);
    const paginatedEvents = listEvents.slice(
        (page - 1) * EVENTS_PER_PAGE,
        page * EVENTS_PER_PAGE
    );

    const goToPage = (p: number) => {
        if (p >= 1 && p <= totalPages) setPage(p);
    };

    React.useEffect(() => {
        // Reset to first page if listEvents changes and page is out of range
        if (page > totalPages) setPage(1);
    }, [listEvents, totalPages, page]);

    return (
        <div>
            {/* Table for md+ screens */}
            <div className="hidden md:block bg-white rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Date Requested
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Requested Venue
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Event Date
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Event Time
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Event Name
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEvents.map((event) => (
                                <tr key={event.id} className="border-b">
                                    <td className="px-4 py-3">{event.date}</td>
                                    <td className="px-4 py-3">{event.venue}</td>
                                    <td className="px-4 py-3">
                                        {event.eventDate}
                                    </td>
                                    <td className="px-4 py-3">{event.time}</td>
                                    <td className="px-4 py-3">{event.name}</td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(event.status)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-start p-4 border-t gap-2">
                    <button
                        className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`px-3 py-1 rounded-md ${
                                page === i + 1
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "border bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => goToPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="flex items-center px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>
            {/* Card list for small screens */}
            <div className="md:hidden flex flex-col gap-4">
                {paginatedEvents.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2"
                    >
                        <div>
                            <span className="font-semibold">
                                Date Requested:{" "}
                            </span>
                            {event.date}
                        </div>
                        <div>
                            <span className="font-semibold">
                                Requested Venue:{" "}
                            </span>
                            {event.venue}
                        </div>
                        <div>
                            <span className="font-semibold">Event Date: </span>
                            {event.eventDate}
                        </div>
                        <div>
                            <span className="font-semibold">Event Time: </span>
                            {event.time}
                        </div>
                        <div>
                            <span className="font-semibold">Event Name: </span>
                            {event.name}
                        </div>
                        <div>
                            <span className="font-semibold">Status: </span>
                            {getStatusBadge(event.status)}
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-start p-4 gap-2">
                    <button
                        className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`px-3 py-1 rounded-md ${
                                page === i + 1
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "border bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => goToPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="flex items-center px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
