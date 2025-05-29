import React, { useEffect, useState, useRef } from "react";
// import { Inertia } from "@inertiajs/inertia";
import DateTimeSelection from "./Date&Time";
import { ArrowRightCircle } from "lucide-react"; // or any icon you use

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
    "Graduation",
];

const participantPlaceholders = [
    "Students",
    "Teachers",
    "Parents",
    "Staff",
    "Community Members",
    "External Participants",
    "Alumni",
    "Volunteers",
    "Event Organizers",
    "Speakers",
    "Panelists",
    "Performers",
    "Audience",
    "Guests",
];

const MAX_EVENT_NAME = 100;
const MAX_DEPARTMENT = 100;
const MAX_EVENT_PURPOSE = 250;
const MAX_PARTICIPANTS = 100;
const MAX_PARTICIPANT_COUNT = 9999;

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

    // State for showing limit indicators
    const [showEventNameLimit, setShowEventNameLimit] = useState(false);
    const [showDepartmentLimit, setShowDepartmentLimit] = useState(false);
    const [showEventPurposeLimit, setShowEventPurposeLimit] = useState(false);
    const [showParticipantsLimit, setShowParticipantsLimit] = useState(false);
    const [showParticipantCountLimit, setShowParticipantCountLimit] =
        useState(false);

    // Add these refs at the top of your component (after useState declarations)
    const eventNameTimeout = useRef<NodeJS.Timeout | null>(null);
    const departmentTimeout = useRef<NodeJS.Timeout | null>(null);
    const eventPurposeTimeout = useRef<NodeJS.Timeout | null>(null);
    const participantsTimeout = useRef<NodeJS.Timeout | null>(null);
    const participantCountTimeout = useRef<NodeJS.Timeout | null>(null);

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
                        <span className="ml-1 font-medium text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        placeholder={eventPlaceholders[eventPHIndex]}
                        value={value.eventName}
                        maxLength={MAX_EVENT_NAME}
                        onChange={(e) => {
                            let val = e.target.value;
                            // Only show indicator if user tries to type past the limit
                            if (val.length > MAX_EVENT_NAME) {
                                val = val.slice(0, MAX_EVENT_NAME);
                                setShowEventNameLimit(true);
                            } else {
                                setShowEventNameLimit(false);
                            }
                            onChange({ ...value, eventName: val });
                        }}
                        onKeyDown={(e) => {
                            if (
                                value.eventName.length === MAX_EVENT_NAME &&
                                e.key.length === 1 && // Only for character input, not control keys
                                !e.ctrlKey &&
                                !e.metaKey &&
                                !e.altKey
                            ) {
                                setShowEventNameLimit(true);
                                if (eventNameTimeout.current)
                                    clearTimeout(eventNameTimeout.current);
                                eventNameTimeout.current = setTimeout(
                                    () => setShowEventNameLimit(false),
                                    3000
                                );
                            }
                        }}
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                    {/* Event Name Limit Indicator */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-1">
                        <span className="text-xs text-gray-500">
                            {value.eventName.length}/{MAX_EVENT_NAME}
                        </span>
                        <span
                            className={`text-xs text-red-500 font-medium w-full sm:w-auto transition-opacity duration-300 ${
                                showEventNameLimit
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none select-none"
                            }`}
                            aria-live="polite"
                        >
                            The event name cannot exceed {MAX_EVENT_NAME}{" "}
                            characters. Please shorten your input.
                        </span>
                    </div>
                </div>

                <div className="relative">
                    {/* <div className="flex flex-col md:flex-row md:items-center mb-2 gap-2"> */}
                    <div>
                        <label
                            htmlFor="department"
                            className="leading-7 text-sm text-black font-bold min-w-max"
                            style={{ minWidth: "120px" }}
                        >
                            Department
                            <span className="ml-1 font-medium text-red-500">
                                *
                            </span>
                        </label>
                    </div>

                    <div className="relative flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            id="department"
                            name="department"
                            autoComplete="off"
                            value={deptInput}
                            maxLength={MAX_DEPARTMENT}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onChange={(e) => {
                                let val = e.target.value;
                                if (val.length > MAX_DEPARTMENT) {
                                    val = val.slice(0, MAX_DEPARTMENT);
                                    setShowDepartmentLimit(true);
                                } else {
                                    setShowDepartmentLimit(false);
                                }
                                setDeptInput(val);
                                setShowSuggestions(true);
                            }}
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
                                    setShowDepartmentLimit(false);
                                }
                                if (
                                    deptInput.length === MAX_DEPARTMENT &&
                                    e.key.length === 1 &&
                                    !e.ctrlKey &&
                                    !e.metaKey &&
                                    !e.altKey
                                ) {
                                    setShowDepartmentLimit(true);
                                    if (departmentTimeout.current)
                                        clearTimeout(departmentTimeout.current);
                                    departmentTimeout.current = setTimeout(
                                        () => setShowDepartmentLimit(false),
                                        3000
                                    );
                                }
                            }}
                            className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base text-gray-700 py-2 px-3 outline-none pr-10"
                            placeholder="Type or select multiple departments"
                        />
                        {/* Mobile submit button */}
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden text-secondary"
                            style={{
                                display: deptInput.trim() ? "block" : "none",
                            }}
                            onMouseDown={(e) => {
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
                                    setDeptInput("");
                                    setShowDepartmentLimit(false);
                                }
                            }}
                            tabIndex={-1}
                        >
                            <ArrowRightCircle className="w-6 h-6" />
                        </button>
                    </div>
                    {/* Department Limit Indicator */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-1">
                        <span className="text-xs text-gray-500">
                            {deptInput.length}/{MAX_DEPARTMENT}
                        </span>
                        <span
                            className={`text-xs text-red-500 font-medium w-full sm:w-auto transition-opacity duration-300 ${
                                showDepartmentLimit
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none select-none"
                            }`}
                            aria-live="polite"
                        >
                            The department name cannot exceed {MAX_DEPARTMENT}{" "}
                            characters. Please shorten your input.
                        </span>
                    </div>
                    {/* Typing hint */}
                    {deptInput && (
                        <div className="text-xs text-gray-500 mt-1">
                            <span className="hidden md:inline">
                                Press{" "}
                                <span className="font-semibold">Enter</span> to
                                add department
                            </span>
                            <span className="inline md:hidden">
                                Tap the{" "}
                                <ArrowRightCircle className="inline w-4 h-4 mb-0.5" />{" "}
                                icon to add department
                            </span>
                        </div>
                    )}
                    {showSuggestions && filteredOptions.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-48 overflow-y-auto shadow-lg">
                            {filteredOptions.map((option) => (
                                <li
                                    key={option}
                                    className="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-black cursor-pointer"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleCheckboxChange(option);
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.department.includes(
                                            option
                                        )}
                                        readOnly
                                        tabIndex={-1}
                                        className="mr-2 pointer-events-none"
                                    />
                                    <span>{option}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Move chips/tags here, outside the input container */}
            {value.department.length > 0 && (
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
                                onClick={() => handleCheckboxChange(dept)}
                                tabIndex={-1}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="relative mb-4">
                <label
                    htmlFor="eventPurpose"
                    className="leading-7 text-sm text-black font-bold"
                >
                    Event Purpose
                    <span className="ml-1 font-medium text-red-500">*</span>
                </label>
                <textarea
                    id="eventPurpose"
                    name="eventPurpose"
                    placeholder="Purpose of the event"
                    value={value.eventPurpose}
                    maxLength={MAX_EVENT_PURPOSE}
                    onChange={(e) => {
                        let val = e.target.value;
                        if (val.length > MAX_EVENT_PURPOSE) {
                            val = val.slice(0, MAX_EVENT_PURPOSE);
                            setShowEventPurposeLimit(true);
                        } else {
                            setShowEventPurposeLimit(false);
                        }
                        onChange({ ...value, eventPurpose: val });
                    }}
                    onKeyDown={(e) => {
                        if (
                            value.eventPurpose.length === MAX_EVENT_PURPOSE &&
                            e.key.length === 1 &&
                            !e.ctrlKey &&
                            !e.metaKey &&
                            !e.altKey
                        ) {
                            setShowEventPurposeLimit(true);
                            if (eventPurposeTimeout.current)
                                clearTimeout(eventPurposeTimeout.current);
                            eventPurposeTimeout.current = setTimeout(
                                () => setShowEventPurposeLimit(false),
                                3000
                            );
                        }
                    }}
                    className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 h-28 text-base outline-none text-gray-700 py-2 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                ></textarea>
                {/* Event Purpose Limit Indicator */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-1">
                    <span className="text-xs text-gray-500">
                        {value.eventPurpose.length}/{MAX_EVENT_PURPOSE}
                    </span>
                    <span
                        className={`text-xs text-red-500 font-medium w-full sm:w-auto transition-opacity duration-300 ${
                            showEventPurposeLimit
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none select-none"
                        }`}
                        aria-live="polite"
                    >
                        The event purpose cannot exceed {MAX_EVENT_PURPOSE}{" "}
                        characters. Please shorten your input.
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                    <label
                        htmlFor="participants"
                        className="leading-7 text-sm text-black font-bold"
                    >
                        Participants
                        <span className="ml-1 font-medium text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="participants"
                        name="participants"
                        placeholder={
                            participantPlaceholders[participantPHIndex]
                        }
                        value={value.participants}
                        maxLength={MAX_PARTICIPANTS}
                        onChange={(e) => {
                            let val = e.target.value;
                            if (val.length > MAX_PARTICIPANTS) {
                                val = val.slice(0, MAX_PARTICIPANTS);
                                setShowParticipantsLimit(true);
                            } else {
                                setShowParticipantsLimit(false);
                            }
                            onChange({ ...value, participants: val });
                        }}
                        onKeyDown={(e) => {
                            if (
                                value.participants.length ===
                                    MAX_PARTICIPANTS &&
                                e.key.length === 1 &&
                                !e.ctrlKey &&
                                !e.metaKey &&
                                !e.altKey
                            ) {
                                setShowParticipantsLimit(true);
                                if (participantsTimeout.current)
                                    clearTimeout(participantsTimeout.current);
                                participantsTimeout.current = setTimeout(
                                    () => setShowParticipantsLimit(false),
                                    3000
                                );
                            }
                        }}
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                    {/* Participants Limit Indicator */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-1">
                        <span className="text-xs text-gray-500">
                            {value.participants.length}/{MAX_PARTICIPANTS}
                        </span>
                        <span
                            className={`text-xs text-red-500 font-medium w-full sm:w-auto transition-opacity duration-300 ${
                                showParticipantsLimit
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none select-none"
                            }`}
                            aria-live="polite"
                        >
                            The participants field cannot exceed{" "}
                            {MAX_PARTICIPANTS} characters. Please shorten your
                            input.
                        </span>
                    </div>
                </div>

                <div className="relative">
                    <label
                        htmlFor="participantCount"
                        className="leading-7 text-sm text-black font-bold"
                    >
                        Number of Participants
                        <span className="ml-1 font-medium text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="participantCount"
                        name="participantCount"
                        value={value.participantCount}
                        onChange={(e) => {
                            const raw = e.target.value;
                            if (/^\d*$/.test(raw)) {
                                let num = Number(raw);
                                if (raw === "") {
                                    onChange({
                                        ...value,
                                        participantCount: "",
                                    });
                                    setShowParticipantCountLimit(false);
                                } else if (
                                    num >= 1 &&
                                    num <= MAX_PARTICIPANT_COUNT
                                ) {
                                    onChange({
                                        ...value,
                                        participantCount: raw,
                                    });
                                    setShowParticipantCountLimit(false);
                                } else if (num > MAX_PARTICIPANT_COUNT) {
                                    onChange({
                                        ...value,
                                        participantCount:
                                            MAX_PARTICIPANT_COUNT.toString(),
                                    });
                                    setShowParticipantCountLimit(true);
                                }
                            }
                        }}
                        onKeyDown={(e) => {
                            if (
                                value.participantCount.length === 4 &&
                                Number(value.participantCount) ===
                                    MAX_PARTICIPANT_COUNT &&
                                e.key.length === 1 &&
                                !e.ctrlKey &&
                                !e.metaKey &&
                                !e.altKey
                            ) {
                                setShowParticipantCountLimit(true);
                                if (participantCountTimeout.current)
                                    clearTimeout(
                                        participantCountTimeout.current
                                    );
                                participantCountTimeout.current = setTimeout(
                                    () => setShowParticipantCountLimit(false),
                                    3000
                                );
                            }
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                    {/* Number of Participants Limit Indicator */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-1">
                        <span className="text-xs text-gray-500">
                            {value.participantCount.length > 0
                                ? value.participantCount
                                : 0}
                            /{MAX_PARTICIPANT_COUNT}
                        </span>
                        <span
                            className={`text-xs text-red-500 font-medium w-full sm:w-auto transition-opacity duration-300 ${
                                showParticipantCountLimit
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none select-none"
                            }`}
                            aria-live="polite"
                        >
                            The number of participants cannot exceed{" "}
                            {MAX_PARTICIPANT_COUNT}.
                        </span>
                    </div>
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
