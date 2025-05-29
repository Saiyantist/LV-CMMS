"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BookingList from "./BookingList";
import { Head, usePage } from "@inertiajs/react";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import { router } from "@inertiajs/react";

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
const EVENT_COLORS = ["bg-destructive", "bg-secondary"];

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

export default function EventCalendar() {
    // Get data from Inertia props
    const { calendarEvents, listEvents } = usePage().props as unknown as {
        calendarEvents: {
            [key: string]: {
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
    const [view, setView] = useState<"calendar" | "list">("calendar");
    const [showScrollUpButton, setShowScrollUpButton] = useState(false);

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

    // Status color mapping (not used for now, replaced by random color)
    // const statusColor = (status: string) => { ... }

    // Status badge for list view
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Completed":
                return (
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                    </span>
                );
            case "In Progress":
                return (
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        In Progress
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

    return (
        <AuthenticatedLayout>
            <Head title="Booking Calendar" />
            <div className="flex flex-col min-h-screen bg-gray-50">
                {/* Header */}
                <div className="border-b bg-white">
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
                                    Event Services Request
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
                    {/* Search bar for list view */}
                    {view === "list" && (
                        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
                            <div className="w-full sm:w-80 relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search Description"
                                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-white"
                                />
                            </div>
                            <button className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 w-full sm:w-auto mt-2 sm:mt-0">
                                Filter
                            </button>
                        </div>
                    )}

                    {/* Calendar View */}
                    {view === "calendar" && (
                        <>
                            {/* Mobile: Vertical list of days with events */}
                            <div className="block md:hidden">
                                <div className="flex flex-col gap-2">
                                    {Array.from(
                                        { length: daysInMonth },
                                        (_, i) => i + 1
                                    ).map((day) => (
                                        <div
                                            key={day}
                                            className={`bg-white rounded-lg shadow border p-3 ${
                                                isToday(day)
                                                    ? "border-2 border-blue-600"
                                                    : ""
                                            }`}
                                        >
                                            <div className="font-semibold text-primary mb-1">
                                                {monthName} {day}, {currentYear}
                                                {isToday(day) && (
                                                    <span className="ml-2 text-xs text-blue-600 font-bold">
                                                        (Today)
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {calendarEvents[day]?.length ? (
                                                    calendarEvents[day].map(
                                                        (event, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`${getRandomColor(
                                                                    day,
                                                                    idx
                                                                )} p-2 rounded text-xs text-white flex flex-col`}
                                                            >
                                                                <span className="font-medium">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </span>
                                                                <span>
                                                                    {event.time}
                                                                </span>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-gray-400 text-xs">
                                                        No events
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
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
                                                ? calendarEvents[dateKey] || []
                                                : [];
                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={`min-h-[80px] sm:min-h-[150px] p-1 sm:p-2 border-r border-b relative ${
                                                        day
                                                            ? isToday(day)
                                                                ? "border-2 border-blue-600"
                                                                : "text-black"
                                                            : "bg-gray-50"
                                                    } ${
                                                        dayIndex === 6
                                                            ? "border-r-0"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="text-base sm:text-xl font-medium mb-1 sm:mb-2">
                                                        {day || ""}
                                                        {day &&
                                                            isToday(day) && (
                                                                <span className="ml-1 text-xs text-blue-600 font-bold">
                                                                    (Today)
                                                                </span>
                                                            )}
                                                    </div>

                                                    {/* This is the event time */}
                                                    <div className="space-y-1 text-center">
                                                        {events.length > 0 ? (
                                                            events.map(
                                                                (
                                                                    event,
                                                                    idx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className={`${
                                                                            day !==
                                                                            null
                                                                                ? getRandomColor(
                                                                                      day,
                                                                                      idx
                                                                                  )
                                                                                : ""
                                                                        } p-1 rounded text-xs text-white`}
                                                                    >
                                                                        <div>
                                                                            {
                                                                                event.title
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                event.time
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
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
            </div>
        </AuthenticatedLayout>
    );
}
