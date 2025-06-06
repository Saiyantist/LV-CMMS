import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/shadcnui/card";
import { Button } from "@/Components/shadcnui/button";
import { Badge } from "@/Components/shadcnui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/shadcnui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/shadcnui/table";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";

interface Booking {
    id: number | string;
    date: string;
    venue: string[];
    name: string;
    department?: string;
    event_start_date?: string;
    event_end_date?: string;
    event_start_time?: string;
    event_end_time?: string;
    status: string;
}

interface Props {
    bookings: Booking[];
}

const allStatuses = [
    "Pending",
    "Approved",
    "Rejected",
    "Cancelled",
    "Completed",
];

const statusColors: Record<string, string> = {
    Pending: "#fbbf24",
    Approved: "#34d399",
    Rejected: "#a3a3a3",
    Cancelled: "#f87171",
    Completed: "#16A34A",
};

const statusBadgeClasses: Record<string, string> = {
    Completed: "bg-green-200 text-green-800 hover:bg-green-200",
    Cancelled: "bg-orange-500 text-white hover:bg-orange-500",
    Rejected: "bg-red-500 text-white hover:bg-red-500",
    Pending: "bg-sky-100 text-sky-700 hover:bg-sky-200",
    Approved: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    default: "bg-gray-200 text-gray-800",
};

const getStatusCounts = (statuses: string[]) => {
    const counts: Record<string, number> = {};
    allStatuses.forEach((status) => (counts[status] = 0));
    statuses.forEach((status) => {
        if (counts.hasOwnProperty(status)) {
            counts[status]++;
        }
    });
    return counts;
};

const getChartOptions = (labels: string[], data: number[]) => ({
    series: data,
    colors: labels.map((label) => statusColors[label]),
    chart: {
        height: 320,
        width: "100%",
        type: "donut",
    },
    stroke: {
        colors: ["transparent"],
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontFamily: "Inter, sans-serif",
                        offsetY: 20,
                    },
                    total: {
                        showAlways: true,
                        show: true,
                        label: "Total Bookings",
                        fontFamily: "Inter, sans-serif",
                        formatter: function (w: any) {
                            const sum = w.globals.seriesTotals.reduce(
                                (a: number, b: number) => a + b,
                                0
                            );
                            return `${sum}`;
                        },
                    },
                    value: {
                        show: true,
                        fontFamily: "Inter, sans-serif",
                        offsetY: -20,
                        formatter: function (value: number) {
                            return `${value}`;
                        },
                    },
                },
                size: "80%",
            },
        },
    },
    labels,
    dataLabels: { enabled: false },
    legend: { show: false },
});

export default function EventServicesDashboard({
    bookings: initialBookings = [],
}: Props) {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);

    useEffect(() => {
        if (!initialBookings || initialBookings.length === 0) {
            axios.get("/api/event-services/bookings").then((res) => {
                setBookings(res.data);
            });
        }
    }, [initialBookings]);

    const [statusCounts, setStatusCounts] = useState<Record<string, number>>(
        {}
    );

    useEffect(() => {
        axios
            .get("/api/event-services/status-counts")
            .then((res) => setStatusCounts(res.data))
            .catch(() => setStatusCounts({}));
    }, []);

    // Stats for cards
    const statsData = [
        {
            title: "Total Bookings",
            value: Object.values(statusCounts).reduce((a, b) => a + b, 0),
        },
        {
            title: "Pending Requests",
            value: statusCounts["Pending"] || 0,
        },
        { title: "Approved", value: statusCounts["Approved"] || 0 },
        { title: "Cancelled", value: statusCounts["Cancelled"] || 0 },
    ];

    // Top Departments
    const departmentCounts: Record<string, number> = {};
    bookings.forEach((b) => {
        if (b.department) {
            const depts = b.department.split(",").map((d) => d.trim());
            depts.forEach((dept) => {
                departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
            });
        }
    });
    const topDepartments = Object.entries(departmentCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([department, bookings], i) => ({
            rank: i + 1,
            department,
            bookings,
        }));

    // Recently Booked Venues (bar graph)
    const venueCounts: Record<string, number> = {};
    bookings.forEach((b) => {
        b.venue.forEach((v) => {
            venueCounts[v] = (venueCounts[v] || 0) + 1;
        });
    });

    const getStatusBadge = (status: string) => (
        <Badge
            className={statusBadgeClasses[status] || statusBadgeClasses.default}
        >
            {status}
        </Badge>
    );

    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<ApexCharts | null>(null);
    const [statuses, setStatuses] = useState<string[]>([]);

    useEffect(() => {
        axios
            .get("/api/event-services/statuses")
            .then((res) =>
                setStatuses(
                    res.data.map((row: { status: string }) => row.status)
                )
            )
            .catch(() => setStatuses([]));
    }, []);

    useEffect(() => {
        if (statuses.length === 0) return;

        const counts = getStatusCounts(statuses);
        const data = allStatuses.map((status) => counts[status]);

        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.updateOptions(
                    getChartOptions(allStatuses, data),
                    true,
                    true
                );
                chartInstance.current.updateSeries(data);
            } else {
                chartInstance.current = new ApexCharts(
                    chartRef.current,
                    getChartOptions(allStatuses, data)
                );
                chartInstance.current.render();
            }
        }

        return () => {
            chartInstance.current?.destroy();
            chartInstance.current = null;
        };
    }, [statuses]);

    // Calculate total bookings for percentage
    const totalStatuses = statuses.length;
    const statusPercentages: Record<string, number> = {};
    allStatuses.forEach((status) => {
        const count = statuses.filter((s) => s === status).length;
        statusPercentages[status] =
            totalStatuses > 0 ? Math.round((count / totalStatuses) * 100) : 0;
    });

    function truncateText(text: string, maxLength = 20) {
        if (!text) return "";
        return text.length > maxLength
            ? text.slice(0, maxLength) + "..."
            : text;
    }

    const handleViewBooking = (booking: any) => {
        alert(`View booking: ${booking.eventName}`);
    };

    return (
        <div className="min-h-screen bg-white p-6">
            {/* <AuthenticatedLayout> */}
            <Head title="Event Services Dashboard" />
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Event Services Dashboard
                    </h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                This Month
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>This Month</DropdownMenuItem>
                            <DropdownMenuItem>Last Month</DropdownMenuItem>
                            <DropdownMenuItem>This Quarter</DropdownMenuItem>
                            <DropdownMenuItem>Last Quarter</DropdownMenuItem>
                            <DropdownMenuItem>This Year</DropdownMenuItem>
                            <DropdownMenuItem>Custom Range</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="text-sm font-medium text-gray-600 mb-2">
                                    {stat.title}
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Departments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                Top Departments
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                                Departments with the highest number of bookings
                            </p>
                        </CardHeader>
                        <CardContent>
                            <ul className="divide-y divide-gray-200">
                                {topDepartments.length === 0 && (
                                    <li className="py-2 text-gray-400 italic">
                                        No data available.
                                    </li>
                                )}
                                {topDepartments.map((dept) => (
                                    <li
                                        key={dept.rank}
                                        className="flex justify-between items-center py-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-gray-500 w-6">
                                                {dept.rank}.
                                            </span>
                                            <span className="text-gray-900">
                                                {dept.department}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-blue-700">
                                            {dept.bookings}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Recently Booked Venues Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                Booking Satistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-center justify-center my-8 gap-6">
                                <div
                                    ref={chartRef}
                                    className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px]"
                                />
                                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                                    {allStatuses.map((status) => (
                                        <div
                                            key={status}
                                            className="flex items-center gap-2"
                                        >
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        statusColors[status],
                                                }}
                                            />
                                            <span className="text-sm text-gray-700">
                                                {status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {statusPercentages[status]}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Approved Bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Upcoming Approved Bookings
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            The 5 nearest upcoming approved bookings
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Date Requested
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Requested Venue
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Event Name
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Event Date
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Event Time
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings
                                    .filter(
                                        (b) =>
                                            b.status === "Approved" &&
                                            b.event_start_date &&
                                            new Date(b.event_start_date) >=
                                                new Date()
                                    )
                                    .sort(
                                        (a, b) =>
                                            new Date(
                                                a.event_start_date ?? ""
                                            ).getTime() -
                                            new Date(
                                                b.event_start_date ?? ""
                                            ).getTime()
                                    )
                                    .slice(0, 5)
                                    .map((booking, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">
                                                {booking.date
                                                    ? new Date(
                                                          booking.date
                                                      ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                              year: "numeric",
                                                              month: "long",
                                                              day: "numeric",
                                                          }
                                                      )
                                                    : ""}
                                            </TableCell>
                                            <TableCell>
                                                {booking.venue.join(", ")}
                                            </TableCell>
                                            <TableCell>
                                                <span title={booking.name}>
                                                    {truncateText(booking.name)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {booking.event_start_date &&
                                                booking.event_end_date
                                                    ? (() => {
                                                          const format = (
                                                              dateStr: string
                                                          ) =>
                                                              new Date(
                                                                  dateStr
                                                              ).toLocaleDateString(
                                                                  "en-US",
                                                                  {
                                                                      year: "numeric",
                                                                      month: "long",
                                                                      day: "numeric",
                                                                  }
                                                              );
                                                          return booking.event_start_date ===
                                                              booking.event_end_date
                                                              ? format(
                                                                    booking.event_start_date
                                                                )
                                                              : `${format(
                                                                    booking.event_start_date
                                                                )} - ${format(
                                                                    booking.event_end_date
                                                                )}`;
                                                      })()
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {booking.event_start_time &&
                                                booking.event_end_time
                                                    ? (() => {
                                                          const format = (
                                                              timeStr: string
                                                          ) => {
                                                              if (
                                                                  timeStr
                                                                      .toLowerCase()
                                                                      .includes(
                                                                          "am"
                                                                      ) ||
                                                                  timeStr
                                                                      .toLowerCase()
                                                                      .includes(
                                                                          "pm"
                                                                      )
                                                              ) {
                                                                  return timeStr;
                                                              }
                                                              const [h, m] =
                                                                  timeStr.split(
                                                                      ":"
                                                                  );
                                                              const date =
                                                                  new Date();
                                                              date.setHours(
                                                                  Number(h),
                                                                  Number(m)
                                                              );
                                                              return date.toLocaleTimeString(
                                                                  "en-US",
                                                                  {
                                                                      hour: "numeric",
                                                                      minute: "2-digit",
                                                                      hour12: true,
                                                                  }
                                                              );
                                                          };
                                                          return booking.event_start_time ===
                                                              booking.event_end_time
                                                              ? format(
                                                                    booking.event_start_time
                                                                )
                                                              : `${format(
                                                                    booking.event_start_time
                                                                )} - ${format(
                                                                    booking.event_end_time
                                                                )}`;
                                                      })()
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStatusBadge(booking.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-secondary hover:bg-primary text-white"
                                                        onClick={() =>
                                                            handleViewBooking(
                                                                booking
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            {/* </AuthenticatedLayout> */}
        </div>
    );
}
