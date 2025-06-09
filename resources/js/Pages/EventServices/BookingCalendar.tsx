import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BookingList from "./BookingList";
import { Head, usePage } from "@inertiajs/react";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import { router } from "@inertiajs/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/shadcnui/tooltip";
import { Dialog, DialogContent } from "@/Components/shadcnui/dialog";

// Helper to get month name and days in month
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function getToday() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth(),
        date: now.getDate(),
    };
}

// Add a palette of nice Tailwind background colors
const EVENT_COLORS = ["bg-secondary"];

// Helper to get a random color based on event index and day (so it's stable per render)
function getRandomColor(day: number, idx: number) {
    // Use a simple hash for stable color per event
    const hash = (day * 31 + idx * 17) % EVENT_COLORS.length;
    return EVENT_COLORS[hash];
}

// Helper to get date string in YYYY-MM-DD
function getDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
    ).padStart(2, "0")}`;
}

// TruncateWithToggle: shows ellipsis if too long, with a "See more"/"See less" toggle
function TruncateWithToggle({
    text,
    max = 30,
}: {
    text: string;
    max?: number;
}) {
    const [expanded, setExpanded] = React.useState(false);
    if (!text) return null;
    if (text.length <= max) return <>{text}</>;
    return (
        <span>
            {expanded ? text : text.slice(0, max) + "..."}
            <button
                type="button"
                className="ml-1 text-blue-600 underline text-xs"
                onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((v) => !v);
                }}
            >
                {expanded ? "See less" : "See more"}
            </button>
        </span>
    );
}

export default function EventCalendar() {
    // Get data from Inertia props
    const { calendarEvents, listEvents } = usePage().props as unknown as {
        calendarEvents: {
            [key: string]: {
                department: string;
                participants: string;
                number_of_participants: string;
                eventEndDate:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                      >
                    | null
                    | undefined;
                description: any;
                eventStartDate:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                      >
                    | null
                    | undefined;
                dateRequested: React.ReactNode;
                venue: React.ReactNode;
                eventDate: React.ReactNode;
                title: string;
                time: string;
                status: string;
            }[];
        };
        listEvents: {
            id: string;
            date: string;
            venue: string;
            eventDate: string;
            time: string;
            name: string;
            status: string;
        }[];
    };

    // Calendar state
    const today = getToday();
    const [currentYear, setCurrentYear] = useState(today.year);
    const [currentMonth, setCurrentMonth] = useState(today.month);
    const [view] = useState<"calendar" | "list">("calendar");
    const [showScrollUpButton, setShowScrollUpButton] =
        useState<boolean>(false);

    // State for mobile event details modal
    const [mobileEventDetails, setMobileEventDetails] = useState<any | null>(
        null
    );

    // Scroll to top logic
    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollUpButton(window.scrollY > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // Calendar calculations
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
    const monthName = MONTHS[currentMonth];

    // Build calendar grid (array of weeks, each week is array of days)
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = [];
    let dayCounter = 1;
    for (let i = 0; i < firstDayOfWeek; i++) week.push(null);
    while (dayCounter <= daysInMonth) {
        week.push(dayCounter);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
        dayCounter++;
    }
    while (week.length < 7) week.push(null);
    if (week.some((d) => d !== null)) weeks.push(week);

    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Status badge for list view
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Completed":
                return (
                    <span className="bg-green-200 text-green-500 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                    </span>
                );
            case "On Going":
                return (
                    <span className="bg-yellow-00 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        On Going
                    </span>
                );
            case "Cancelled":
                return (
                    <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        Cancelled
                    </span>
                );
            case "Not Started":
                return (
                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        Not Started
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {status}
                    </span>
                );
        }
    };

    // Navigation handlers
    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };
    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    };

    // Helper for today's highlight
    const isToday = (day: number) =>
        day === today.date &&
        currentMonth === today.month &&
        currentYear === today.year;

    // After your calendarEvents and daysInMonth are defined
    // const approvedDays = Array.from(
    //     { length: daysInMonth },
    //     (_, i) => i + 1
    // ).filter((day) => {
    //     const dateKey = getDateKey(currentYear, currentMonth, day);
    //     return (
    //         calendarEvents[dateKey] &&
    //         calendarEvents[dateKey].some((event) => event.status === "Approved")
    //     );
    // });

    return (
        <AuthenticatedLayout>
            <Head title="Booking Calendar" />
            <div className="flex flex-col min-h-screen bg-trasparent">
                {/* Header */}
                <div className="bg-trasparent">
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                            <div className="flex space-x-2">
                                <h1 className="text-2xl font-semibold">
                                    Booking Calendar
                                </h1>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.visit(
                                            route("event-services.request") ||
                                                ""
                                        )
                                    }
                                    className="bg-secondary hover:bg-primary/90 text-white rounded-md px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
                                >
                                    <Plus size={18} />
                                    Request Event Services
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-1 rounded-md hover:bg-gray-100"
                                        onClick={goToPrevMonth}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <span className="text-lg font-medium">
                                        {monthName} {currentYear}
                                    </span>
                                    <button
                                        className="p-1 rounded-md hover:bg-gray-100"
                                        onClick={goToNextMonth}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-2 sm:px-4 py-4 flex-1 w-full">
                    {/* Calendar View */}
                    {view === "calendar" && (
                        <>
                            {/* Mobile: List of days with approved events only */}
                            <div className="block md:hidden">
                                <div className="flex flex-col gap-4">
                                    {Array.from(
                                        { length: daysInMonth },
                                        (_, i) => i + 1
                                    ).map((day) => {
                                        const dateKey = getDateKey(
                                            currentYear,
                                            currentMonth,
                                            day
                                        );
                                        const events = (
                                            calendarEvents[dateKey] || []
                                        ).filter(
                                            (event) =>
                                                event.status === "Approved" ||
                                                event.status === "Completed"
                                        );
                                        if (!events.length) return null;
                                        return (
                                            <div
                                                key={day}
                                                className={`rounded-2xl bg-white/90 border border-blue-100 shadow-lg p-4 ${
                                                    isToday(day)
                                                        ? "border-2 border-blue-500"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <span className="text-lg font-bold text-blue-700">
                                                            {monthName} {day}
                                                        </span>
                                                        <span className="ml-2 text-gray-400 text-xs">
                                                            {currentYear}
                                                        </span>
                                                        {isToday(day) && (
                                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                                                Today
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Status badge for the highest priority event of the day */}
                                                    {(() => {
                                                        let badge = null;
                                                        if (
                                                            events.some((e) => {
                                                                if (
                                                                    e.status ===
                                                                        "Approved" &&
                                                                    e.eventStartDate &&
                                                                    e.eventEndDate
                                                                ) {
                                                                    const now =
                                                                        new Date();
                                                                    const start =
                                                                        typeof e.eventStartDate ===
                                                                            "string" ||
                                                                        typeof e.eventStartDate ===
                                                                            "number"
                                                                            ? new Date(
                                                                                  e.eventStartDate
                                                                              )
                                                                            : null;
                                                                    const end =
                                                                        typeof e.eventEndDate ===
                                                                            "string" ||
                                                                        typeof e.eventEndDate ===
                                                                            "number"
                                                                            ? new Date(
                                                                                  e.eventEndDate
                                                                              )
                                                                            : null;
                                                                    if (
                                                                        start &&
                                                                        end &&
                                                                        now >=
                                                                            start &&
                                                                        now <=
                                                                            end
                                                                    )
                                                                        return true;
                                                                }
                                                                return false;
                                                            })
                                                        ) {
                                                            badge = (
                                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">
                                                                    On Going
                                                                </span>
                                                            );
                                                        } else if (
                                                            events.some((e) => {
                                                                if (
                                                                    e.status ===
                                                                        "Approved" &&
                                                                    (typeof e.eventStartDate ===
                                                                        "string" ||
                                                                        typeof e.eventStartDate ===
                                                                            "number")
                                                                ) {
                                                                    const now =
                                                                        new Date();
                                                                    const start =
                                                                        typeof e.eventStartDate ===
                                                                            "string" ||
                                                                        typeof e.eventStartDate ===
                                                                            "number"
                                                                            ? new Date(
                                                                                  e.eventStartDate
                                                                              )
                                                                            : null;
                                                                    if (
                                                                        start &&
                                                                        now <
                                                                            start
                                                                    )
                                                                        return true;
                                                                }
                                                                return false;
                                                            })
                                                        ) {
                                                            badge = (
                                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">
                                                                    Upcoming
                                                                </span>
                                                            );
                                                        } else if (
                                                            events.some((e) => {
                                                                if (
                                                                    e.status ===
                                                                        "Completed" ||
                                                                    (e.status ===
                                                                        "Approved" &&
                                                                        e.eventEndDate &&
                                                                        (typeof e.eventEndDate ===
                                                                            "string" ||
                                                                            typeof e.eventEndDate ===
                                                                                "number") &&
                                                                        new Date() >
                                                                            new Date(
                                                                                e.eventEndDate
                                                                            ))
                                                                ) {
                                                                    return true;
                                                                }
                                                                return false;
                                                            })
                                                        ) {
                                                            badge = (
                                                                <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">
                                                                    Completed
                                                                </span>
                                                            );
                                                        }
                                                        return badge;
                                                    })()}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {events.map(
                                                        (event, idx) => {
                                                            // Compute status
                                                            const todayDate =
                                                                new Date();
                                                            let isOnGoing =
                                                                false;
                                                            let isNowCompleted =
                                                                false;
                                                            let isUpcoming =
                                                                false;
                                                            if (
                                                                event.status ===
                                                                    "Approved" &&
                                                                event.eventStartDate &&
                                                                event.eventEndDate
                                                            ) {
                                                                const start =
                                                                    typeof event.eventStartDate ===
                                                                        "string" ||
                                                                    typeof event.eventStartDate ===
                                                                        "number"
                                                                        ? new Date(
                                                                              event.eventStartDate
                                                                          )
                                                                        : null;
                                                                const end =
                                                                    typeof event.eventEndDate ===
                                                                        "string" ||
                                                                    typeof event.eventEndDate ===
                                                                        "number"
                                                                        ? new Date(
                                                                              event.eventEndDate
                                                                          )
                                                                        : null;
                                                                if (
                                                                    start &&
                                                                    end
                                                                ) {
                                                                    isOnGoing =
                                                                        todayDate >=
                                                                            start &&
                                                                        todayDate <=
                                                                            end;
                                                                    isNowCompleted =
                                                                        todayDate >
                                                                        end;
                                                                    isUpcoming =
                                                                        todayDate <
                                                                        start;
                                                                }
                                                            }
                                                            const isCompleted =
                                                                event.status ===
                                                                    "Completed" ||
                                                                (event.status ===
                                                                    "Approved" &&
                                                                    isNowCompleted);

                                                            const eventBgClass =
                                                                isCompleted
                                                                    ? "bg-gray-200 text-gray-500"
                                                                    : isOnGoing
                                                                    ? "bg-green-100 text-green-700"
                                                                    : isUpcoming
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-secondary text-gray-500";

                                                            // --- Make event clickable to open details modal ---
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    className={`rounded-xl px-4 py-2 flex flex-col shadow-sm text-left transition hover:scale-[1.01] active:scale-100 focus:outline-none ${eventBgClass}`}
                                                                    onClick={() =>
                                                                        setMobileEventDetails(
                                                                            event
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="flex flex-col mt-1 gap-0.5">
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                event.title
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                event.time
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Desktop: 7-column grid calendar */}
                            <div className="hidden sm:block bg-white border rounded-md overflow-x-auto">
                                {/* Weekday Headers */}
                                <div className="grid grid-cols-7 border-b text-xs sm:text-base">
                                    {weekdays.map((day, index) => (
                                        <div
                                            key={index}
                                            className="p-2 sm:p-4 text-center font-medium text-gray-600 border-r last:border-r-0"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7">
                                    {weeks.map((week, weekIndex) =>
                                        week.map((day, dayIndex) => {
                                            const dateKey = day
                                                ? getDateKey(
                                                      currentYear,
                                                      currentMonth,
                                                      day
                                                  )
                                                : null;
                                            const events = dateKey
                                                ? (
                                                      calendarEvents[dateKey] ||
                                                      []
                                                  ).filter(
                                                      (event) =>
                                                          event.status ===
                                                              "Approved" ||
                                                          event.status ===
                                                              "Completed"
                                                  )
                                                : [];

                                            // Sort events by time (earlier first)
                                            const sortedEvents = [
                                                ...events,
                                            ].sort((a, b) => {
                                                // Assume event.time is in "HH:mm" format
                                                if (!a.time || !b.time)
                                                    return 0;
                                                const [aHour, aMin] = a.time
                                                    .split(":")
                                                    .map(Number);
                                                const [bHour, bMin] = b.time
                                                    .split(":")
                                                    .map(Number);
                                                return aHour !== bHour
                                                    ? aHour - bHour
                                                    : aMin - bMin;
                                            });

                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={`min-h-[80px] sm:min-h-[150px] p-1 sm:p-2 relative
    ${
        day
            ? isToday(day)
                ? "border-2 border-blue-500 rounded-2xl bg-white/90 shadow-lg"
                : `border border-blue-100 bg-white/90${
                      dayIndex === 6 ? " border-r-0" : ""
                  }`
            : "bg-gray-50"
    }
`}
                                                >
                                                    <div className="text-base sm:text-xl font-medium mb-1 sm:mb-2">
                                                        {day || ""}
                                                        {day &&
                                                            isToday(day) && (
                                                                <span className="ml-1 text-xs text-blue-500 font-bold">
                                                                    (Today)
                                                                </span>
                                                            )}
                                                    </div>

                                                    {/* This is the event time */}
                                                    <div className="space-y-1 text-center">
                                                        {sortedEvents.length >
                                                        0 ? (
                                                            <TooltipProvider>
                                                                {sortedEvents.map(
                                                                    (
                                                                        event,
                                                                        idx
                                                                    ) => {
                                                                        const todayDate =
                                                                            new Date();

                                                                        // Compute "On Going" and "Completed" for Approved bookings
                                                                        let isOnGoing =
                                                                            false;
                                                                        let isNowCompleted =
                                                                            false;
                                                                        let isUpcoming =
                                                                            false;
                                                                        if (
                                                                            event.status ===
                                                                                "Approved" &&
                                                                            event.eventStartDate &&
                                                                            event.eventEndDate
                                                                        ) {
                                                                            const start =
                                                                                typeof event.eventStartDate ===
                                                                                    "string" ||
                                                                                typeof event.eventStartDate ===
                                                                                    "number"
                                                                                    ? new Date(
                                                                                          event.eventStartDate
                                                                                      )
                                                                                    : null;
                                                                            const end =
                                                                                typeof event.eventEndDate ===
                                                                                    "string" ||
                                                                                typeof event.eventEndDate ===
                                                                                    "number"
                                                                                    ? new Date(
                                                                                          event.eventEndDate
                                                                                      )
                                                                                    : null;
                                                                            if (
                                                                                start &&
                                                                                end
                                                                            ) {
                                                                                isOnGoing =
                                                                                    todayDate >=
                                                                                        start &&
                                                                                    todayDate <=
                                                                                        end;
                                                                                isNowCompleted =
                                                                                    todayDate >
                                                                                    end;
                                                                                isUpcoming =
                                                                                    todayDate <
                                                                                    start;
                                                                            }
                                                                        }

                                                                        // Completed if status is "Completed" or approved but already ended
                                                                        const isCompleted =
                                                                            event.status ===
                                                                                "Completed" ||
                                                                            (event.status ===
                                                                                "Approved" &&
                                                                                isNowCompleted);

                                                                        // Upcoming if approved and start date is in the future
                                                                        // (isUpcoming already computed above)

                                                                        const eventBgClass =
                                                                            isCompleted
                                                                                ? "bg-gray-200 cursor-not-allowed opacity-60"
                                                                                : isOnGoing
                                                                                ? "bg-green-100"
                                                                                : isUpcoming
                                                                                ? "bg-blue-100"
                                                                                : typeof day ===
                                                                                  "number"
                                                                                ? getRandomColor(
                                                                                      day,
                                                                                      idx
                                                                                  )
                                                                                : "bg-secondary";

                                                                        // Always show pointer cursor for hoverable events (not completed)
                                                                        const cursorClass =
                                                                            isCompleted
                                                                                ? "cursor-not-allowed"
                                                                                : "cursor-pointer";

                                                                        return (
                                                                            <Tooltip
                                                                                key={
                                                                                    idx
                                                                                }
                                                                            >
                                                                                <TooltipTrigger
                                                                                    asChild
                                                                                    disabled={
                                                                                        isCompleted
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        className={`${eventBgClass} ${cursorClass} text-black rounded-lg mx-auto my-1 px-2 py-1 flex flex-col items-center shadow-sm max-w-[95%]`}
                                                                                        style={{
                                                                                            minWidth:
                                                                                                "90px",
                                                                                            pointerEvents:
                                                                                                isCompleted
                                                                                                    ? "none"
                                                                                                    : "auto",
                                                                                        }}
                                                                                    >
                                                                                        <div className="font-semibold text-xs text-center mb-0.5 truncate w-full">
                                                                                            {
                                                                                                event.title
                                                                                            }
                                                                                        </div>
                                                                                        <div className="w-4/5 border-t border-black/40 my-1"></div>
                                                                                        <div className="font-mono text-xs text-center tracking-wide">
                                                                                            {
                                                                                                event.time
                                                                                            }
                                                                                        </div>
                                                                                        {isOnGoing && (
                                                                                            <span className="text-xs font-bold text-gray-500 mt-1">
                                                                                                On
                                                                                                Going
                                                                                            </span>
                                                                                        )}
                                                                                        {isUpcoming && (
                                                                                            <span className="text-xs font-bold text-gray-500 mt-1">
                                                                                                Upcoming
                                                                                            </span>
                                                                                        )}
                                                                                        {isCompleted && (
                                                                                            <span className="text-xs font-bold text-gray-700 mt-1">
                                                                                                Completed
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </TooltipTrigger>
                                                                                {!isCompleted && (
                                                                                    <TooltipContent className="z-50 bg-white text-gray-900 rounded-xl shadow-xl p-4 max-w-xs text-xs space-y-2 border border-gray-200">
                                                                                        <div className="font-bold text-base mb-1 text-primary">
                                                                                            {
                                                                                                event.title
                                                                                            }
                                                                                        </div>
                                                                                        <div className="flex flex-col gap-1">
                                                                                            <div>
                                                                                                <span className="font-semibold">
                                                                                                    Venue:
                                                                                                </span>{" "}
                                                                                                {Array.isArray(
                                                                                                    event.venue
                                                                                                )
                                                                                                    ? event.venue
                                                                                                          .filter(
                                                                                                              Boolean
                                                                                                          )
                                                                                                          .join(
                                                                                                              ", "
                                                                                                          )
                                                                                                    : typeof event.venue ===
                                                                                                      "string"
                                                                                                    ? event.venue.replace(
                                                                                                          /[\[\]"]+/g,
                                                                                                          ""
                                                                                                      )
                                                                                                    : "N/A"}
                                                                                            </div>
                                                                                            <div>
                                                                                                <span className="font-semibold">
                                                                                                    Department:
                                                                                                </span>{" "}
                                                                                                {event.department ? (
                                                                                                    <TruncateWithToggle
                                                                                                        text={
                                                                                                            event.department
                                                                                                        }
                                                                                                    />
                                                                                                ) : (
                                                                                                    "N/A"
                                                                                                )}
                                                                                            </div>
                                                                                            <div>
                                                                                                <span className="font-semibold">
                                                                                                    Participants:
                                                                                                </span>{" "}
                                                                                                {event.participants ? (
                                                                                                    <TruncateWithToggle
                                                                                                        text={
                                                                                                            event.participants
                                                                                                        }
                                                                                                    />
                                                                                                ) : (
                                                                                                    "N/A"
                                                                                                )}
                                                                                            </div>
                                                                                            <div>
                                                                                                <span className="font-semibold">
                                                                                                    No.
                                                                                                    of
                                                                                                    Participants:
                                                                                                </span>{" "}
                                                                                                {event.number_of_participants !==
                                                                                                    undefined &&
                                                                                                event.number_of_participants !==
                                                                                                    null ? (
                                                                                                    <TruncateWithToggle
                                                                                                        text={String(
                                                                                                            event.number_of_participants
                                                                                                        )}
                                                                                                    />
                                                                                                ) : (
                                                                                                    "N/A"
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="border-t border-gray-200 my-1"></div>
                                                                                            <>
                                                                                                <span className="font-semibold">
                                                                                                    Description:
                                                                                                </span>
                                                                                                <div className="whitespace-pre-line break-words text-gray-700 mt-0.5">
                                                                                                    {event.description ? (
                                                                                                        <TruncateWithToggle
                                                                                                            text={
                                                                                                                event.description
                                                                                                            }
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <span className="italic text-gray-400">
                                                                                                            No
                                                                                                            description
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </>
                                                                                        </div>
                                                                                    </TooltipContent>
                                                                                )}
                                                                            </Tooltip>
                                                                        );
                                                                    }
                                                                )}
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">
                                                                No events
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* List View */}
                    {view === "list" && (
                        <BookingList
                            listEvents={listEvents}
                            getStatusBadge={getStatusBadge}
                        />
                    )}
                </div>
                {/* Scroll To Top Button */}
                <ScrollToTopButton
                    showScrollUpButton={showScrollUpButton}
                    scrollToTop={scrollToTop}
                />

                {/* Mobile Event Details Modal */}
                <Dialog
                    open={!!mobileEventDetails}
                    onOpenChange={() => setMobileEventDetails(null)}
                >
                    <DialogContent className="max-w-xs w-full rounded-2xl shadow-2xl border border-blue-100 p-0 bg-white/90">
                        <div className="p-6 space-y-4">
                            <div className="text-lg font-bold text-blue-700 mb-2">
                                {mobileEventDetails?.title}
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-semibold">
                                        Venue:
                                    </span>{" "}
                                    {Array.isArray(mobileEventDetails?.venue)
                                        ? mobileEventDetails.venue
                                              .filter(Boolean)
                                              .join(", ")
                                        : typeof mobileEventDetails?.venue ===
                                          "string"
                                        ? mobileEventDetails.venue.replace(
                                              /[\[\]"]+/g,
                                              ""
                                          )
                                        : "N/A"}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Department:
                                    </span>{" "}
                                    {mobileEventDetails?.department || "N/A"}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Participants:
                                    </span>{" "}
                                    {mobileEventDetails?.participants || "N/A"}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        No. of Participants:
                                    </span>{" "}
                                    {mobileEventDetails?.number_of_participants !==
                                        undefined &&
                                    mobileEventDetails?.number_of_participants !==
                                        null
                                        ? String(
                                              mobileEventDetails.number_of_participants
                                          )
                                        : "N/A"}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Description:
                                    </span>
                                    <div className="whitespace-pre-line break-words text-gray-700 mt-0.5">
                                        {mobileEventDetails?.description ? (
                                            <span>
                                                {mobileEventDetails.description}
                                            </span>
                                        ) : (
                                            <span className="italic text-gray-400">
                                                No description
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
