"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function DateTimeSelection() {
    // Use current month and year as default
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
    const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
    const [startDate, setStartDate] = useState<number | null>(now.getDate());
    const [endDate, setEndDate] = useState<number | null>(now.getDate());
    const [startTime, setStartTime] = useState<string | null>("6:00 AM");
    const [endTime, setEndTime] = useState<string | null>("9:00 AM");

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

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isPrevMonth: true,
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                isPrevMonth: false,
            });
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 rows of 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isPrevMonth: false,
            });
        }

        return days;
    };

    const generateTimeSlots = () => {
        const slots = [];
        const hours = [
            "6:00",
            "6:30",
            "7:00",
            "7:30",
            "8:00",
            "8:30",
            "9:00",
            "9:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
        ];
        const pmHours = [
            "12:00",
            "12:30",
            "1:00",
            "1:30",
            "2:00",
            "2:30",
            "3:00",
            "3:30",
            "4:00",
            "4:30",
            "5:00",
            "5:30",
            "6:00",
            "6:30",
            "7:00",
            "7:30",
            "8:00",
            "8:30",
            "9:00",
            "9:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
        ];

        // AM slots
        for (const hour of hours) {
            slots.push(`${hour} AM`);
        }

        // PM slots
        for (const hour of pmHours) {
            slots.push(`${hour} PM`);
        }

        return slots;
    };

    const handleDateSelect = (day: number, isStart: boolean) => {
        if (isStart) {
            setStartDate(day);
            // If end date is before new start date, update end date
            if (endDate && day > endDate) {
                setEndDate(day);
            }
        } else {
            setEndDate(day);
            // If start date is after new end date, update start date
            if (startDate && day < startDate) {
                setStartDate(day);
            }
        }
    };

    const handleTimeSelect = (time: string, isStart: boolean) => {
        if (isStart) {
            setStartTime(time);
        } else {
            setEndTime(time);
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

    const calendarDays = generateCalendarDays();
    const timeSlots = generateTimeSlots();
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
                {/* Start Date Calendar */}
                <div>
                    <h3 className="text-lg font-medium mb-4">
                        Start Date <span className="text-red-500">*</span>
                    </h3>
                    <div className="border rounded-md p-2 sm:p-4">
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
                            {/* Days of week */}
                            {daysOfWeek.map((day, index) => (
                                <div
                                    key={`start-dow-${index}`}
                                    className="text-center text-xs sm:text-sm text-gray-500 py-2"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {calendarDays.map((day, index) => (
                                <div
                                    key={`start-day-${index}`}
                                    className={`
                    text-center py-2 rounded-md cursor-pointer text-xs sm:text-base
                    ${!day.isCurrentMonth ? "text-gray-300" : ""}
                    ${
                        day.isCurrentMonth && day.day === startDate
                            ? "bg-blue-900 text-white"
                            : ""
                    }
                    ${
                        day.isCurrentMonth && day.day !== startDate
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
                </div>

                {/* End Date Calendar */}
                <div>
                    <h3 className="text-lg font-medium mb-4">
                        End Date <span className="text-red-500">*</span>
                    </h3>
                    <div className="border rounded-md p-2 sm:p-4">
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
                            {/* Days of week */}
                            {daysOfWeek.map((day, index) => (
                                <div
                                    key={`end-dow-${index}`}
                                    className="text-center text-xs sm:text-sm text-gray-500 py-2"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {calendarDays.map((day, index) => (
                                <div
                                    key={`end-day-${index}`}
                                    className={`
                    text-center py-2 rounded-md cursor-pointer text-xs sm:text-base
                    ${!day.isCurrentMonth ? "text-gray-300" : ""}
                    ${
                        day.isCurrentMonth && day.day === endDate
                            ? "bg-blue-900 text-white"
                            : ""
                    }
                    ${
                        day.isCurrentMonth && isInRange(day.day)
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
                            <select
                                className="w-full max-w-xs border rounded-md px-3 py-2 text-sm"
                                value={startTime ?? ""}
                                onChange={(e) =>
                                    handleTimeSelect(e.target.value, true)
                                }
                            >
                                {generateTimeSlots().map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="bg-transparent-50 p-4 rounded-md">
                        <h3 className="text-center text-lg font-medium mb-2">
                            End Time <span className="text-red-500">*</span>
                        </h3>
                        <div className="flex justify-center">
                            <select
                                className="w-full max-w-xs border rounded-md px-3 py-2 text-sm"
                                value={endTime ?? ""}
                                onChange={(e) =>
                                    handleTimeSelect(e.target.value, false)
                                }
                            >
                                {generateTimeSlots().map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}
