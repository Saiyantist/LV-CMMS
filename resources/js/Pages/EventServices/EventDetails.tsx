import React from "react";

interface EventDetailsProps {
    value: {
        eventName: string;
        department: string;
        eventPurpose: string;
        participants: string;
        participantCount: string;
    };
    onChange: (val: EventDetailsProps["value"]) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ value, onChange }) => {
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
                        className="leading-7 text-sm text-gray-600"
                    >
                        Event Name
                    </label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={value.eventName}
                        onChange={(e) =>
                            onChange({ ...value, eventName: e.target.value })
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                </div>

                <div className="relative">
                    <label
                        htmlFor="department"
                        className="leading-7 text-sm text-gray-600"
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
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base text-gray-700 py-2 px-3 outline-none"
                    >
                        <option value="">Select Department</option>
                        <option value="marketing">Marketing</option>
                        <option value="hr">Human Resources</option>
                        <option value="it">IT</option>
                        <option value="finance">Finance</option>
                    </select>
                </div>
            </div>

            <div className="relative mb-4">
                <label
                    htmlFor="eventPurpose"
                    className="leading-7 text-sm text-gray-600"
                >
                    Event Purpose
                </label>
                <textarea
                    id="eventPurpose"
                    name="eventPurpose"
                    value={value.eventPurpose}
                    onChange={(e) =>
                        onChange({ ...value, eventPurpose: e.target.value })
                    }
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-28 text-base outline-none text-gray-700 py-2 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                    <label
                        htmlFor="participants"
                        className="leading-7 text-sm text-gray-600"
                    >
                        Participants
                    </label>
                    <input
                        type="text"
                        id="participants"
                        name="participants"
                        value={value.participants}
                        onChange={(e) =>
                            onChange({ ...value, participants: e.target.value })
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                </div>

                <div className="relative">
                    <label
                        htmlFor="participantCount"
                        className="leading-7 text-sm text-gray-600"
                    >
                        Number of Participants
                    </label>
                    <input
                        type="number"
                        id="participantCount"
                        name="participantCount"
                        max={10000}
                        value={value.participantCount}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                participantCount: e.target.value,
                            })
                        }
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-6 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
