import React, { useEffect, useState } from "react";
import DateTimeSelection from "./Date&Time";

interface EventDetailsProps {
    value: {
        eventName: string;
        department: string;
        eventPurpose: string;
        participants: string;
        participantCount: string;
    };
    onChange: (val: EventDetailsProps["value"]) => void;
    dateTimeValue: { dateRange: string; timeRange: string };
    onDateTimeChange: (val: { dateRange: string; timeRange: string }) => void;
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
}) => {
    const [eventPHIndex, setEventPHIndex] = useState(0);
    const [participantPHIndex, setParticipantPHIndex] = useState(0);

    const [eventPlaceholder, setEventPlaceholder] = useState(
        eventPlaceholders[0]
    );
    const [participantPlaceholder, setParticipantPlaceholder] = useState(
        participantPlaceholders[0]
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

    useEffect(() => {
        setEventPlaceholder(eventPlaceholders[eventPHIndex]);
    }, [eventPHIndex]);

    useEffect(() => {
        setParticipantPlaceholder(participantPlaceholders[participantPHIndex]);
    }, [participantPHIndex]);

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
                        placeholder={eventPlaceholder}
                        onFocus={() => setEventPlaceholder("")}
                        onBlur={() => {
                            if (!value.eventName)
                                setEventPlaceholder(
                                    eventPlaceholders[eventPHIndex]
                                );
                        }}
                        value={value.eventName}
                        onChange={(e) =>
                            onChange({ ...value, eventName: e.target.value })
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                </div>

                <div className="relative">
                    <label
                        htmlFor="department"
                        className="leading-7 text-sm text-black font-bold"
                    >
                        Department
                    </label>
                    <select
                        id="department"
                        name="department"
                        value={value.department}
                        onChange={(e) =>
                            onChange({ ...value, department: e.target.value })
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-secondary focus:ring-2 focus:ring-indigo-200 text-base text-gray-700 py-2 px-3 outline-none"
                    >
                        <option value="Marketing">Marketing</option>
                        <option value="HR">Human Resources</option>
                        <option value="MIS">MIS</option>
                        <option value="Finance">Finance</option>
                        <option value="">Other</option>
                    </select>
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
                        placeholder={participantPlaceholder}
                        onFocus={() => setParticipantPlaceholder("")}
                        onBlur={() => {
                            if (!value.participants)
                                setParticipantPlaceholder(
                                    participantPlaceholders[participantPHIndex]
                                );
                        }}
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
