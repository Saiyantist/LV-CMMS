"use client";

import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
} from "lucide-react";
import { galleryItems } from './Gallery';

export default function DateTimeSelection({
    value,
    onChange,
}: {
    value?: { dateRange: string; timeRange: string; venues?: number[] };
    onChange?: (val: { dateRange: string; timeRange: string; venues?: number[] }) => void;
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

    const [selectedVenues, setSelectedVenues] = useState<number[]>([]);
    const [timeOptions, setTimeOptions] = useState<string[]>([]);
    const [loadingTimes, setLoadingTimes] = useState(false);

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

            // For Start Date: Only allow dates that are 3 days from today and onwards
            if (isStart) {
                // Only allow dates that are 3 days from today (i.e., today + 3, today + 4, today + 5)
                const minDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + 3
                );
                const thisDay = new Date(year, month, i);
                if (thisDay < minDate) {
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

    // 1. Prop-to-state sync (runs when value changes)
    useEffect(() => {
        const composedDateRange = getDateRangeString();
        const composedTimeRange = getTimeRangeString();

        // Only update if prop is non-empty and different from local state
        if (value?.dateRange && value.dateRange !== composedDateRange) {
            const dateMatch = value.dateRange.match(
                /^([A-Za-z]+) (\d{1,2}) - ([A-Za-z]+) (\d{1,2}), (\d{4})$/
            );
            if (dateMatch) {
                const [, startMonthStr, startDay, endMonthStr, endDay, year] =
                    dateMatch;
                const monthsArr = [
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
                const sMonth = monthsArr.indexOf(startMonthStr);
                const eMonth = monthsArr.indexOf(endMonthStr);

                setStartMonth(sMonth);
                setStartYear(Number(year));
                setStartDate(Number(startDay));
                setEndMonth(eMonth);
                setEndYear(Number(year));
                setEndDate(Number(endDay));
            }
        }

        if (value?.timeRange && value.timeRange !== composedTimeRange) {
            const timeMatch = value.timeRange.match(/^(.+) - (.+)$/);
            if (timeMatch) {
                setStartTime(timeMatch[1]);
                setEndTime(timeMatch[2]);
            }
        }
        // Only run when value changes!
        // eslint-disable-next-line
    }, [value?.dateRange, value?.timeRange]);

    // 2. Notify parent only if value changed (runs when local state changes)
    useEffect(() => {
        if (!onChange) return;
        const newDateRange = startDate && endDate ? getDateRangeString() : "";
        const newTimeRange = startTime && endTime ? getTimeRangeString() : "";
        if (
            value?.dateRange !== newDateRange ||
            value?.timeRange !== newTimeRange
        ) {
            onChange({
                dateRange: newDateRange,
                timeRange: newTimeRange,
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

    // Effect to get selected venues from parent
    useEffect(() => {
        if (value?.venues) {
            setSelectedVenues(value.venues);
        }
    }, [value?.venues]);
    
    // Effect to fetch time options - including availability filtering
    useEffect(() => {
        // Always fetch basic time options on component mount
        fetch('/event-services/time-options')
            .then(res => res.json())
            .then(data => {
                setTimeOptions(data.timeSlots);
            })
            .catch(err => {
                console.error("Error fetching time options:", err);
            });
    }, []);
    
    // Effect to fetch available time slots when venue and date are selected
    useEffect(() => {
        if (selectedVenues?.length > 0 && startDate) {
            setLoadingTimes(true);
            const dateStr = `${startYear}-${(startMonth + 1).toString().padStart(2, '0')}-${startDate.toString().padStart(2, '0')}`;
            
            // Get venue name for the first selected venue
            const venueName = galleryItems.find(item => item.id === selectedVenues[0])?.title;
            if (!venueName) {
                setLoadingTimes(false);
                return;
            }
            
            fetch(`/event-services/time-options?venue=${encodeURIComponent(venueName)}&date=${dateStr}`)
                .then(res => res.json())
                .then(data => {
                    setTimeOptions(data.timeSlots);
                    // Reset selected times if they're no longer valid
                    if (startTime && !data.timeSlots.includes(startTime)) {
                        setStartTime(null);
                    }
                    if (endTime && !data.timeSlots.includes(endTime)) {
                        setEndTime(null);
                    }
                    setLoadingTimes(false);
                })
                .catch(err => {
                    console.error("Error fetching available times:", err);
                    setLoadingTimes(false);
                });
        }
    }, [selectedVenues, startDate, startMonth, startYear]);
    
    // Get available end time options based on start time
    const getAvailableEndTimeOptions = () => {
        if (!startTime) return [];
        
        return timeOptions.filter(t => 
            timeOptions.indexOf(t) > timeOptions.indexOf(startTime)
        );
    };

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
                                {/* 3-day rule indicator */}
                                <div className="mt-2 text-xs text-blue-700 font-medium text-center">
                                    Please note: You may only select a start
                                    date that is at least 3 days from today.
                                    Earlier dates are unavailable for booking.
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
                            className={`w-full border rounded-md px-3 py-2 text-left flex items-center justify-between transition-colors duration-200
            ${
                !startDate ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
            }`}
                            onClick={() => {
                                if (startDate) setShowEndCalendar((v) => !v);
                            }}
                            disabled={!startDate}
                        >
                            <span>
                                {endDate !== null
                                    ? formatDate(endMonth, endDate, endYear)
                                    : "Select end date"}
                            </span>
                            <CalendarIcon className="h-5 w-5 ml-2" />
                        </button>
                        {/* End Date prompt */}
                        {endDatePrompt && !showEndCalendar && (
                            <div className="text-gray-500 text-xs mt-2">
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
                        {loadingTimes && (
                            <div className="mt-2 text-xs text-blue-600">
                                Loading available times...
                            </div>
                        )}
                        {selectedVenues?.length > 0 && startDate && !loadingTimes && (
                            <div className="mt-2 text-xs text-blue-600">
                                Only showing available time slots for the selected venue(s).
                            </div>
                        )}
                    </div>
                    <div className="bg-transparent-50 p-4 rounded-md">
                        <label className="block text-left text-lg font-medium mb-2">
                            End Time <span className="text-red-500">*</span>
                        </label>

                        <select
                            className={`w-full border rounded-md px-3 py-2 text-base transition-colors duration-200
                            ${!startTime ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                            value={endTime || ""}
                            onChange={(e) => setEndTime(e.target.value)}
                            disabled={!startTime}
                        >
                            <option value="" disabled>
                                Select time
                            </option>
                            {getAvailableEndTimeOptions().map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>

                        {/* End Time prompt */}
                        <div className="mt-2 w-full text-left">
                            {!startTime && (
                                <div className="text-gray-500 text-xs mb-2 text-left">
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
