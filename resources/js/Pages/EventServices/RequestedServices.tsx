import React, { useState, useRef, useEffect } from "react";

const servicesCategories = [
    {
        label: "GASD",
        heading: "GENERAL ADMINISTRATIVE SERVICES",
        coordinator: "Coordinator: Mr. Eric Bolano",
        options: [
            "Maintainer Time",
            "Lighting",
            "Tables",
            "Bathroom Cleaning",
            "Chairs",
            "Aircon",
        ],
    },
    {
        label: "COMMS OFFICE",
        heading: "COMMUNICATIONS OFFICE",
        coordinator: "Officer: Ms. Edyssa Pamela Belandres",
        options: [
            "Speaker",
            "Microphone",
            "Audio Mixer",
            "Extension Cord",
            "Projector",
            "HDMI",
            "Photographer",
            "Event Poster",
            "Event Reel",
            "Event Documentation",
        ],
    },
    {
        label: "MIS",
        heading: "MANAGEMENT INFORMATION SYSTEMS",
        coordinator: "Coordinator: Mr. Isagani Donato Jr.",
        options: ["Internet"],
    },
    {
        label: "Security",
        heading: "CAMPUS SAFETY AND SECURITY",
        coordinator: "Coordinator: Mr. Eric Bolano",
        options: ["Marshal", "LV DRRT"],
    },
];

const RequestedServices = () => {
    const [selectedServices, setSelectedServices] = useState<
        Record<string, string[]>
    >({});
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
        null
    );
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex((prev) => (prev === index ? null : index));
    };

    const handleCheckboxChange = (category: string, service: string) => {
        setSelectedServices((prev) => {
            const current = prev[category] || [];
            return {
                ...prev,
                [category]: current.includes(service)
                    ? current.filter((item) => item !== service)
                    : [...current, service],
            };
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                openDropdownIndex !== null &&
                dropdownRefs.current[openDropdownIndex] &&
                !dropdownRefs.current[openDropdownIndex]?.contains(
                    event.target as Node
                )
            ) {
                setOpenDropdownIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdownIndex]);

    return (
        <div className="w-[99%] mx-auto p-6 bg-white rounded">
            <h2 className="text-gray-900 text-2xl mb-2 font-semibold">
                Select Services
            </h2>
            <p className="text-gray-600 mb-6">
                Please select the services you require for your event.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {servicesCategories.map((category, index) => (
                    <div
                        key={category.label}
                        className="relative space-y-2"
                        ref={(el) => { dropdownRefs.current[index] = el; }}
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-800 uppercase">
                                {category.heading}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                                {category.coordinator}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => toggleDropdown(index)}
                            className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {selectedServices[category.label]?.length
                                ? selectedServices[category.label].join(", ")
                                : "Select Services"}
                        </button>

                        {openDropdownIndex === index && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto">
                                {category.options.map((service) => (
                                    <label
                                        key={service}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedServices[
                                                    category.label
                                                ]?.includes(service) || false
                                            }
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    category.label,
                                                    service
                                                )
                                            }
                                            className="mr-2 text-indigo-600"
                                        />
                                        <span className="text-gray-700">
                                            {service}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 text-sm text-gray-600">
                <strong>Selected Services:</strong>
                <ul className="list-disc list-inside mt-2">
                    {Object.entries(selectedServices).map(
                        ([category, services]) =>
                            services.length ? (
                                <li key={category}>
                                    <strong>{category}:</strong>{" "}
                                    {services.join(", ")}
                                </li>
                            ) : null
                    )}
                    {Object.values(selectedServices).every(
                        (s) => s.length === 0
                    ) && <li>None</li>}
                </ul>
            </div>
        </div>
    );
};

export default RequestedServices;
