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

    // Separate state for each calendar
    const [startMonth, setStartMonth] = useState<number>(now.getMonth());
    const [startYear, setStartYear] = useState<number>(now.getFullYear());
    const [endMonth, setEndMonth] = useState<number>(now.getMonth());
    const [endYear, setEndYear] = useState<number>(now.getFullYear());

    const [startDate, setStartDate] = useState<number | null>(null);
    const [endDate, setEndDate] = useState<number | null>(null);
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [endDatePrompt, setEndDatePrompt] = useState<string | null>(null);

    // Generate calendar days for each calendar
    const generateCalendarDays = (
        isStart: boolean,
        month: number,
        year: number
    ) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const days = [];
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isPrevMonth: true,
                isDisabled: true,
            });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            let isDisabled = false;
            // Disable days before today (for all previous months)
            if (
                year < now.getFullYear() ||
                (year === now.getFullYear() && month < now.getMonth()) ||
                (year === now.getFullYear() &&
                    month === now.getMonth() &&
                    i < now.getDate())
            ) {
                isDisabled = true;
            }

            // For END calendar: Disable days before the selected start date
            if (!isStart && startDate !== null) {
                const start = new Date(startYear, startMonth, startDate);
                const thisDay = new Date(year, month, i);
                if (thisDay < start) {
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
                isDisabled: true,
            });
        }
        return days;
    };

    // Navigation for each calendar
    const navigateStartMonth = (increment: number) => {
        let newMonth = startMonth + increment;
        let newYear = startYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        setStartMonth(newMonth);
        setStartYear(newYear);
    };
    const navigateEndMonth = (increment: number) => {
        let newMonth = endMonth + increment;
        let newYear = endYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        setEndMonth(newMonth);
        setEndYear(newYear);
    };

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const calendarDaysStart = generateCalendarDays(true, startMonth, startYear);
    const calendarDaysEnd = generateCalendarDays(false, endMonth, endYear);

    // Compose dateRange and timeRange for parent
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
    const getDateRangeString = () => {
        if (!startDate || !endDate) return "";
        return `${months[startMonth]} ${startDate} - ${months[endMonth]} ${endDate}, ${endYear}`;
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
    }, [
        startDate,
        endDate,
        startTime,
        endTime,
        startMonth,
        startYear,
        endMonth,
        endYear,
    ]);

    // End date calendar prompt logic
    useEffect(() => {
        if (!startDate) {
            setEndDatePrompt("Please select a start date first.");
        } else {
            setEndDatePrompt(null);
        }
    }, [startDate]);

    // Format date as "Month Day, Year"
    const formatDate = (month: number, day: number, year: number) =>
        `${months[month]} ${day}, ${year}`;

    // Dropdown options for time (12-hour format with AM/PM)
    const timeOptions: string[] = [];
    for (let h = 6; h < 12; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, "0");
            const min = m.toString().padStart(2, "0");
            timeOptions.push(`${hour}:${min} AM`);
        }
    }
    for (let h = 12; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = (h > 12 ? h - 12 : h).toString().padStart(2, "0");
            const min = m.toString().padStart(2, "0");
            timeOptions.push(`${hour}:${min} PM`);
        }
    }
    timeOptions.push("11:59 AM");

    // Date select handlers
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
        // Only highlight if in the same month/year
        if (startYear === endYear && startMonth === endMonth) {
            return day > startDate && day < endDate;
        }
        return false;
    };

    // Add this useEffect to sync with parent
    useEffect(() => {
        if (value) {
            // Parse dateRange and timeRange to set internal state
            // (You may need to parse the string to set startDate, endDate, etc.)
            // For now, just keep as is if you want to always use parent state
        }
    }, [value?.dateRange, value?.timeRange]);

    return (
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
                                          startMonth,
                                          startDate,
                                          startYear
                                      )
                                    : "Select start date"}
                            </span>
                            <CalendarIcon className="h-5 w-5 ml-2" />
                        </button>
                        {showStartCalendar && (
                            <div className="absolute z-10 bg-white border rounded shadow-md mt-2 w-full p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => navigateStartMonth(-1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <div className="font-medium">
                                        {months[startMonth]} {startYear}
                                    </div>
                                    <button
                                        onClick={() => navigateStartMonth(1)}
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
                                    ? formatDate(endMonth, endDate, endYear)
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
                                        onClick={() => navigateEndMonth(-1)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <div className="font-medium">
                                        {months[endMonth]} {endYear}
                                    </div>
                                    <button
                                        onClick={() => navigateEndMonth(1)}
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
            <div className="w-full">
                <h2 className="text-2xl font-medium mb-2 text-center sm:text-left">
                    Select Time Slot
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 mb-8">
                    <div className="bg-transparent p-4 rounded-md">
                        <label className="block text-left text-lg font-medium mb-2">
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
                        <label className="block text-left text-lg font-medium mb-2">
                            End Time <span className="text-red-500">*</span>
                        </label>

                        <select
                            className="w-full border rounded-md px-3 py-2 text-base"
                            value={endTime || ""}
                            onChange={(e) => setEndTime(e.target.value)}
                            disabled={!startTime}
                        >
                            <option value="" disabled>
                                Select time
                            </option>
                            {timeOptions.map((t) => {
                                // Disable end times that are less than or equal to the selected start time
                                let isDisabled = false;
                                if (
                                    startTime &&
                                    timeOptions.indexOf(t) <=
                                        timeOptions.indexOf(startTime)
                                ) {
                                    isDisabled = true;
                                }
                                return (
                                    <option
                                        key={t}
                                        value={t}
                                        disabled={isDisabled}
                                    >
                                        {t}
                                    </option>
                                );
                            })}
                        </select>

                        <div className="mt-2 w-full text-left">
                            {!startTime && (
                                <div className="text-red-500 text-xs mb-2 text-left">
                                    Please select a Start Time before choosing
                                    an End Time.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}
