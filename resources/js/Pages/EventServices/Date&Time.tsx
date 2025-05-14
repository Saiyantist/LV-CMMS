"use client";

import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Calendar as CalendarIcon,
} from "lucide-react";

export default function DateTimeSelection({
    value,
    onChange,
}: {
    value?: { dateRange: string; timeRange: string };
    onChange?: (val: { dateRange: string; timeRange: string }) => void;
}) {
    // Use current month and year as default
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
    const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
    const [startDate, setStartDate] = useState<number | null>(now.getDate());
    const [endDate, setEndDate] = useState<number | null>(now.getDate());
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [startTime, setStartTime] = useState<string>("06:00");
    const [endTime, setEndTime] = useState<string>("09:00");

    const generateCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();
        const daysInPrevMonth = new Date(
            currentYear,
            currentMonth,
            0
        ).getDate();
        const days = [];
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isPrevMonth: true,
            });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                isPrevMonth: false,
            });
        }
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isPrevMonth: false,
            });
        }
        return days;
    };

    const handleDateSelect = (day: number, isStart: boolean) => {
        if (isStart) {
            setStartDate(day);
            if (endDate && day > endDate) {
                setEndDate(day);
            }
            setShowStartCalendar(false);
        } else {
            setEndDate(day);
            if (startDate && day < startDate) {
                setStartDate(day);
            }
            setShowEndCalendar(false);
        }
    };

    const isInRange = (day: number) => {
        if (!startDate || !endDate) return false;
        return day > startDate && day < endDate;
    };

    const formatMonthYear = () => {
        const months = [
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
        return `${months[currentMonth]} ${currentYear}`;
    };

    const navigateMonth = (increment: number) => {
        let newMonth = currentMonth + increment;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const calendarDays = generateCalendarDays();

    // Time picker handlers
    const handleTimeChange = (val: string, isStart: boolean) => {
        if (isStart) {
            setStartTime(val);
        } else {
            setEndTime(val);
        }
    };

    // Compose dateRange and timeRange for parent
    const getDateRangeString = () => {
        if (!startDate || !endDate) return "";
        const months = [
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
        return `${months[currentMonth]} ${startDate} - ${endDate}, ${currentYear}`;
    };
    const getTimeRangeString = () => {
        return `${startTime} - ${endTime}`;
    };

    // Notify parent on change
    useEffect(() => {
        if (onChange) {
            onChange({
                dateRange: startDate && endDate ? getDateRangeString() : "",
                timeRange: startTime && endTime ? getTimeRangeString() : "",
            });
        }
        // eslint-disable-next-line
    }, [startDate, endDate, startTime, endTime, currentMonth, currentYear]);

    return (
        <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-medium mb-2">Select Dates</h2>
                <p className="text-gray-600">
                    Choose when you would like to book [Auditorium Lobby]
                </p>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-12">
                {/* Start Date Picker */}
                <div>
                    <h3 className="text-lg font-medium mb-4">
                        Start Date <span className="text-red-500">*</span>
                    </h3>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full border rounded-md px-3 py-2 text-left flex items-center justify-between"
                            onClick={() => setShowStartCalendar((v) => !v)}
                        >
                            <span>
                                {startDate
                                    ? `${formatMonthYear()} ${startDate}, ${currentYear}`
                                    : "Select start date"}
                            </span>
                            <CalendarIcon className="h-5 w-5 ml-2" />
                        </button>
                        {showStartCalendar && (
                            <div className="absolute z-10 bg-white border rounded shadow-md mt-2 w-full p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => navigateMonth(-1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <div className="font-medium">
                                        {formatMonthYear()}
                                    </div>
                                    <button
                                        onClick={() => navigateMonth(1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {daysOfWeek.map((day, index) => (
                                        <div
                                            key={`start-dow-${index}`}
                                            className="text-center text-xs sm:text-sm text-gray-500 py-2"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                    {calendarDays.map((day, index) => (
                                        <div
                                            key={`start-day-${index}`}
                                            className={`
                                                text-center py-2 rounded-md cursor-pointer text-xs sm:text-base
                                                ${
                                                    !day.isCurrentMonth
                                                        ? "text-gray-300"
                                                        : ""
                                                }
                                                ${
                                                    day.isCurrentMonth &&
                                                    day.day === startDate
                                                        ? "bg-blue-900 text-white"
                                                        : ""
                                                }
                                                ${
                                                    day.isCurrentMonth &&
                                                    day.day !== startDate
                                                        ? "hover:bg-gray-100"
                                                        : ""
                                                }
                                            `}
                                            onClick={() =>
                                                day.isCurrentMonth &&
                                                handleDateSelect(day.day, true)
                                            }
                                        >
                                            {day.day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* End Date Picker */}
                <div>
                    <h3 className="text-lg font-medium mb-4">
                        End Date <span className="text-red-500">*</span>
                    </h3>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full border rounded-md px-3 py-2 text-left flex items-center justify-between"
                            onClick={() => setShowEndCalendar((v) => !v)}
                        >
                            <span>
                                {endDate
                                    ? `${formatMonthYear()} ${endDate}, ${currentYear}`
                                    : "Select end date"}
                            </span>
                            <CalendarIcon className="h-5 w-5 ml-2" />
                        </button>
                        {showEndCalendar && (
                            <div className="absolute z-10 bg-white border rounded shadow-md mt-2 w-full p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => navigateMonth(-1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <div className="font-medium">
                                        {formatMonthYear()}
                                    </div>
                                    <button
                                        onClick={() => navigateMonth(1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {daysOfWeek.map((day, index) => (
                                        <div
                                            key={`end-dow-${index}`}
                                            className="text-center text-xs sm:text-sm text-gray-500 py-2"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                    {calendarDays.map((day, index) => (
                                        <div
                                            key={`end-day-${index}`}
                                            className={`
                                                text-center py-2 rounded-md cursor-pointer text-xs sm:text-base
                                                ${
                                                    !day.isCurrentMonth
                                                        ? "text-gray-300"
                                                        : ""
                                                }
                                                ${
                                                    day.isCurrentMonth &&
                                                    day.day === endDate
                                                        ? "bg-blue-900 text-white"
                                                        : ""
                                                }
                                                ${
                                                    day.isCurrentMonth &&
                                                    isInRange(day.day)
                                                        ? "bg-blue-100"
                                                        : ""
                                                }
                                                ${
                                                    day.isCurrentMonth &&
                                                    day.day !== endDate &&
                                                    !isInRange(day.day)
                                                        ? "hover:bg-gray-100"
                                                        : ""
                                                }
                                            `}
                                            onClick={() =>
                                                day.isCurrentMonth &&
                                                handleDateSelect(day.day, false)
                                            }
                                        >
                                            {day.day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr />
            <br />

            {/* Time Selection */}
            <div className="mb-12">
                <h2 className="text-2xl font-medium mb-2">Select Time Slot</h2>
                <p className="text-gray-600 mb-6">
                    Choose your start and end times
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8">
                    <div className="bg-transparent p-4 rounded-md">
                        <h3 className="text-center text-lg font-medium mb-2">
                            Start Time <span className="text-red-500">*</span>
                        </h3>
                        <div className="flex justify-center">
                            <input
                                type="time"
                                className="w-full max-w-xs border rounded-md px-3 py-2 text-sm"
                                value={startTime}
                                onChange={(e) =>
                                    handleTimeChange(e.target.value, true)
                                }
                            />
                        </div>
                    </div>
                    <div className="bg-transparent-50 p-4 rounded-md">
                        <h3 className="text-center text-lg font-medium mb-2">
                            End Time <span className="text-red-500">*</span>
                        </h3>
                        <div className="flex justify-center">
                            <input
                                type="time"
                                className="w-full max-w-xs border rounded-md px-3 py-2 text-sm"
                                value={endTime}
                                onChange={(e) =>
                                    handleTimeChange(e.target.value, false)
                                }
                            />
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}
