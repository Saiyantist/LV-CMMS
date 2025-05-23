"use client";

import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
} from "lucide-react";

export default function DateTimeSelection({
    value,
    onChange,
}: {
    value?: { dateRange: string; timeRange: string };
    onChange?: (val: { dateRange: string; timeRange: string }) => void;
}) {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
    const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
    const [startDate, setStartDate] = useState<number | null>(null);
    const [endDate, setEndDate] = useState<number | null>(null);
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [endDatePrompt, setEndDatePrompt] = useState<string | null>(null);
    const [showStartClock, setShowStartClock] = useState(false);
    const [showEndClock, setShowEndClock] = useState(false);
    const [startTimeObj, setStartTimeObj] = useState<Date | null>(null);
    const [endTimeObj, setEndTimeObj] = useState<Date | null>(null);

    const generateCalendarDays = (isStart: boolean) => {
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
            // For start date, disable days before today if current month/year
            let isDisabled = false;
            if (isStart) {
                if (
                    currentYear === now.getFullYear() &&
                    currentMonth === now.getMonth() &&
                    i < now.getDate()
                ) {
                    isDisabled = true;
                }
            } else {
                // For end date, disable if before startDate or before today
                if (
                    startDate &&
                    i < startDate &&
                    currentYear === now.getFullYear() &&
                    currentMonth === now.getMonth()
                ) {
                    isDisabled = true;
                }
                if (
                    currentYear === now.getFullYear() &&
                    currentMonth === now.getMonth() &&
                    i < now.getDate()
                ) {
                    isDisabled = true;
                }
                if (startDate && i < startDate) {
                    isDisabled = true;
                }
            }
            days.push({
                day: i,
                isCurrentMonth: true,
                isPrevMonth: false,
                isDisabled,
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
            setEndDate(null);
            setShowStartCalendar(false);
        } else {
            setEndDate(day);
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
    const calendarDaysStart = generateCalendarDays(true);
    const calendarDaysEnd = generateCalendarDays(false);

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
        return startTime && endTime ? `${startTime} - ${endTime}` : "";
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

    // End date calendar prompt logic
    useEffect(() => {
        if (!startDate) {
            setEndDatePrompt("Please select a start date first.");
        } else {
            setEndDatePrompt(null);
        }
    }, [startDate]);

    // Format date as "Month Day, Year"
    const formatDate = (month: number, day: number, year: number) => {
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
        return `${months[month]} ${day}, ${year}`;
    };

    // Dropdown options for time (12-hour format with AM/PM)
    const timeOptions: string[] = [];

    // AM times: 6:00 AM to 11:30 AM
    for (let h = 6; h < 12; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, "0");
            const min = m.toString().padStart(2, "0");
            timeOptions.push(`${hour}:${min} AM`);
        }
    }

    // PM times: 12:00 PM to 11:30 PM
    for (let h = 12; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = (h > 12 ? h - 12 : h).toString().padStart(2, "0");
            const min = m.toString().padStart(2, "0");
            timeOptions.push(`${hour}:${min} PM`);
        }
    }

    // Add 12:00 AM as the last time
    timeOptions.push("12:00 AM");

    return (
        // <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-medium mb-2 text-center md:text-left">
                    Select Dates
                </h2>
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
                                {startDate !== null
                                    ? formatDate(
                                          currentMonth,
                                          startDate,
                                          currentYear
                                      )
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
                                    {calendarDaysStart.map((day, index) => (
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
                                                    day.day !== startDate &&
                                                    !day.isDisabled
                                                        ? "hover:bg-gray-100"
                                                        : ""
                                                }
                                                ${
                                                    day.isDisabled
                                                        ? "opacity-40 pointer-events-none"
                                                        : ""
                                                }
                                            `}
                                            onClick={() =>
                                                day.isCurrentMonth &&
                                                !day.isDisabled &&
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
                            onClick={() => {
                                if (!startDate) {
                                    setEndDatePrompt(
                                        "Please select a start date before choosing an end date."
                                    );
                                } else {
                                    setShowEndCalendar((v) => !v);
                                }
                            }}
                        >
                            <span>
                                {endDate !== null
                                    ? formatDate(
                                          currentMonth,
                                          endDate,
                                          currentYear
                                      )
                                    : "Select end date"}
                            </span>
                            <CalendarIcon className="h-5 w-5 ml-2" />
                        </button>
                        {endDatePrompt && !showEndCalendar && (
                            <div className="text-red-500 text-xs mt-2">
                                {endDatePrompt}
                            </div>
                        )}
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
                                    {calendarDaysEnd.map((day, index) => (
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
                                                    !isInRange(day.day) &&
                                                    !day.isDisabled
                                                        ? "hover:bg-gray-100"
                                                        : ""
                                                }
                                                ${
                                                    day.isDisabled
                                                        ? "opacity-40 pointer-events-none"
                                                        : ""
                                                }
                                            `}
                                            onClick={() =>
                                                day.isCurrentMonth &&
                                                !day.isDisabled &&
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
                        <label className="block text-center text-lg font-medium mb-2">
                            Start Time <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full border rounded-md px-3 py-2 text-base"
                            value={startTime || ""}
                            onChange={(e) => setStartTime(e.target.value)}
                        >
                            <option value="" disabled>
                                Select time
                            </option>
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="bg-transparent-50 p-4 rounded-md">
                        <label className="block text-center text-lg font-medium mb-2">
                            End Time <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full border rounded-md px-3 py-2 text-base"
                            value={endTime || ""}
                            onChange={(e) => setEndTime(e.target.value)}
                        >
                            <option value="" disabled>
                                Select time
                            </option>
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}
