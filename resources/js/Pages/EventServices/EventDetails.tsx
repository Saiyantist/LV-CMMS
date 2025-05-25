import React, { useEffect, useState, useRef } from "react";
// import { Inertia } from "@inertiajs/inertia";
import DateTimeSelection from "./Date&Time";

interface EventDetailsProps {
    value: {
        eventName: string;
        department: string[];
        eventPurpose: string;
        participants: string;
        participantCount: string;
    };
    onChange: (val: EventDetailsProps["value"]) => void;
    dateTimeValue: { dateRange: string; timeRange: string };
    onDateTimeChange: (val: { dateRange: string; timeRange: string }) => void;
    userType: "internal_requester" | "external_requester";
}

const eventPlaceholders = [
    "Intramurals",
    "Foundation Week",
    "Campus Clean-Up Drive",
    "Student Council Election",
    "Alumni Homecoming",
];

const participantPlaceholders = [
    "ICT Majors",
    "BAB Students",
    "Senior Highschool",
    "BaBAB",
    "Student Council Officers",
];

const EventDetails: React.FC<EventDetailsProps> = ({
    value,
    onChange,
    dateTimeValue,
    onDateTimeChange,
    userType,
}) => {
    const departmentType =
        userType === "internal_requester" ? "internal" : "external";

    const [eventPHIndex, setEventPHIndex] = useState(0);
    const [participantPHIndex, setParticipantPHIndex] = useState(0);

    // Department auto-suggest state
    const [deptOptions, setDeptOptions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [deptInput, setDeptInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); // NEW

    // Fetch department options from backend
    useEffect(() => {
        fetch(`/departments/${departmentType}`)
            .then((res) => res.json())
            .then((data) => setDeptOptions(data))
            .catch(() => setDeptOptions([]));
    }, [departmentType]);

    const filteredOptions = deptOptions.filter((opt) =>
        opt.toLowerCase().includes(deptInput.toLowerCase())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setEventPHIndex((prev) => (prev + 1) % eventPlaceholders.length);
            setParticipantPHIndex(
                (prev) => (prev + 1) % participantPlaceholders.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Close suggestions on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeptInput(e.target.value);
        setShowSuggestions(true);
    };

    const handleInputFocus = () => setShowSuggestions(true);

    const handleInputBlur = () => {
        setTimeout(() => setShowSuggestions(false), 150);
        // Do not auto-add on blur, only on Enter
    };

    const handleCheckboxChange = (option: string) => {
        let newSelected: string[];
        if (
            Array.isArray(value.department) &&
            value.department.includes(option)
        ) {
            newSelected = value.department.filter((item) => item !== option);
        } else {
            newSelected = [
                ...(Array.isArray(value.department) ? value.department : []),
                option,
            ];
        }
        onChange({ ...value, department: newSelected });
        setDeptInput(""); // <-- Only clear the input after selection!
        // Do NOT close suggestions here
    };

    return (
        <div className="w-full bg-white flex flex-col p-8 rounded">
            <div className="text-center md:text-left">
                <h2 className="text-gray-900 text-2xl mb-2 font-semibold title-font">
                    Complete Your Booking
                </h2>
                <p className="leading-relaxed mb-6 text-gray-600">
                    Please fill out the event details below to proceed with your
                    booking.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                    <label
                        htmlFor="eventName"
                        className="leading-7 text-sm text-black font-bold"
                    >
                        Event Name
                    </label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        placeholder={eventPlaceholders[eventPHIndex]}
                        value={value.eventName}
                        onChange={(e) =>
                            onChange({ ...value, eventName: e.target.value })
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                </div>

                <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center mb-2 gap-2">
                        <label
                            htmlFor="department"
                            className="leading-7 text-sm text-black font-bold min-w-max"
                            style={{ minWidth: "120px" }}
                        >
                            Department
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {value.department.map((dept) => (
                                <span
                                    key={dept}
                                    className="bg-secondary text-white px-2 py-1 rounded text-xs flex items-center"
                                >
                                    {dept}
                                    <button
                                        type="button"
                                        className="ml-1 text-white hover:text-gray-200"
                                        onClick={() =>
                                            handleCheckboxChange(dept)
                                        }
                                        tabIndex={-1}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        id="department"
                        name="department"
                        autoComplete="off"
                        value={deptInput}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                const trimmed = deptInput.trim();
                                if (
                                    trimmed &&
                                    !value.department.includes(trimmed)
                                ) {
                                    const newSelected = [
                                        ...value.department,
                                        trimmed,
                                    ];
                                    onChange({
                                        ...value,
                                        department: newSelected,
                                    });
                                }
                                setDeptInput(""); // Always clear input after Enter
                            }
                        }}
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base text-gray-700 py-2 px-3 outline-none"
                        placeholder="Type or select department/strand"
                    />
                    {showSuggestions && filteredOptions.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-48 overflow-y-auto shadow-lg">
                            {filteredOptions.map((option) => (
                                <li
                                    key={option}
                                    className="flex items-center px-3 py-2 hover:bg-secondary hover:text-white cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.department.includes(
                                            option
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(option)
                                        }
                                        onMouseDown={(e) => e.preventDefault()} // Prevent blur before onChange
                                        className="mr-2"
                                    />
                                    <span>{option}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="relative mb-4">
                <label
                    htmlFor="eventPurpose"
                    className="leading-7 text-sm text-black font-bold"
                >
                    Event Purpose
                </label>
                <textarea
                    id="eventPurpose"
                    name="eventPurpose"
                    placeholder="Purpose of the event"
                    value={value.eventPurpose}
                    onChange={(e) =>
                        onChange({ ...value, eventPurpose: e.target.value })
                    }
                    className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 h-28 text-base outline-none text-gray-700 py-2 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                    <label
                        htmlFor="participants"
                        className="leading-7 text-sm text-black font-bold"
                    >
                        Participants
                    </label>
                    <input
                        type="text"
                        id="participants"
                        name="participants"
                        placeholder={
                            participantPlaceholders[participantPHIndex]
                        }
                        value={value.participants}
                        onChange={(e) =>
                            onChange({ ...value, participants: e.target.value })
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                </div>

                <div className="relative">
                    <label
                        htmlFor="participantCount"
                        className="leading-7 text-sm text-black font-bold"
                    >
                        Number of Participants
                    </label>
                    <input
                        type="text"
                        id="participantCount"
                        name="participantCount"
                        value={value.participantCount}
                        onChange={(e) => {
                            const raw = e.target.value;
                            if (/^\d*$/.test(raw)) {
                                const num = Number(raw);
                                if (raw === "") {
                                    onChange({
                                        ...value,
                                        participantCount: "",
                                    });
                                } else if (num >= 1 && num <= 9999) {
                                    onChange({
                                        ...value,
                                        participantCount: raw,
                                    });
                                }
                            }
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>

            <br />
            <br />
            <hr />

            <div>
                <br />
                <DateTimeSelection
                    value={dateTimeValue}
                    onChange={onDateTimeChange}
                />
            </div>
        </div>
    );
};

export default EventDetails;
