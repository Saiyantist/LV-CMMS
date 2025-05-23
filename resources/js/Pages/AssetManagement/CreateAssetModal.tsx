import React, { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "sonner"; // Importing toast
import { router } from "@inertiajs/react";

interface AddAssetModalProps {
    locations: Location[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: {
        name: string;
        specification_details: string;
        location_id: string;
        status: string;
        date_acquired: string;
        last_maintained_at?: string; // Optional
        image?: File | null; // Optional
        preventiveMaintenance?: {
            description: string;
            assignTo: string;
            schedule: string;
        };
    }) => void;
}

interface Location {
    id: number;
    name: string;
}

export default function AddAssetModal({
    locations,
    isOpen,
    onClose,
    onSave,
}: AddAssetModalProps) {
    const [name, setName] = useState("");
    const [specificationDetails, setSpecificationDetails] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [dateAcquired, setDateAcquired] = useState("");
    const [lastMaintenance, setLastMaintenance] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Preventive Maintenance state
    const [isPreventiveMaintenance, setIsPreventiveMaintenance] =
        useState(false);
    const [description, setDescription] = useState("");
    const [assignTo, setAssignTo] = useState("");
    const [schedule, setSchedule] = useState("");
    const [dailyFrequency, setDailyFrequency] = useState(1); // Default to 1
    // const [weeklyDays, setWeeklyDays] = useState<string[]>([]); // State for selected weekly days
    const [weeklyFrequency, setWeeklyFrequency] = useState(1);
    const [monthlyFrequency, setMonthlyFrequency] = useState(1); // Default to 1
    const [yearlyMonth, setYearlyMonth] = useState("January"); // Default to January
    const [monthlyDay, setMonthlyDay] = useState("Sunday");

    const [yearlyDay, setYearlyDay] = useState(1); // Default to 1

    const toggleDay = (day: string) => {
        setWeeklyDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmModal(true); // Show confirmation modal before saving
    };

    const handleConfirmSubmit = () => {
        try {
            // Trigger success toast first
            toast.success("Saving asset...");

            // Prepare the form data
            const formData = new FormData();
            formData.append("name", name);
            formData.append("specification_details", specificationDetails);
            formData.append("location_id", location);
            formData.append("status", status);
            formData.append("date_acquired", dateAcquired);
            if (lastMaintenance) {
                formData.append("last_maintained_at", lastMaintenance);
            }
            if (image) {
                formData.append("image", image);
            }
            if (isPreventiveMaintenance) {
                formData.append("has_preventive_maintenance", "1");
                formData.append(
                    "preventiveMaintenance",
                    JSON.stringify({
                        description,
                        assignTo,
                        schedule,
                    })
                );
            }

            // Use Inertia's post method to send the data
            router.post("/assets", formData, {
                onSuccess: () => {
                    toast.success("Asset saved successfully!");
                    setShowConfirmModal(false); // Close confirmation modal
                    onClose(); // Close the main modal
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error(
                        "Failed to save asset. Please check the form and try again."
                    );
                },
            });
        } catch (error) {
            // Handle unexpected errors
            console.error(error);
            toast.error("An unexpected error occurred. Please try again.");
            setShowConfirmModal(false); // Ensure the modal closes on failure as well
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-80 md:w-96 lg:w-[600px] xl:w-[800px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Add New Asset
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Asset Name and Specification (side by side) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Asset Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Specification{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={specificationDetails}
                                onChange={(e) =>
                                    setSpecificationDetails(e.target.value)
                                } // Update the specification state
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                placeholder="Enter Specification"
                                required
                            />
                        </div>
                    </div>

                    {/* Location, Condition, and Date Acquired (side by side) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)} // Update the location state
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Location</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Condition{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Condition</option>
                                <option value="Functional">Functional</option>
                                <option value="Failed">Failed</option>
                                <option value="Under Maintenance">
                                    Under Maintenance
                                </option>
                                <option value="End of Useful Life">
                                    End of Useful Life
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date Acquired{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={dateAcquired}
                                onChange={(e) =>
                                    setDateAcquired(e.target.value)
                                }
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Asset Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <br />

                    {/* Preventive Maintenance Toggle */}
                    <div className="flex items-center mt-4">
                        <label
                            className={`relative inline-flex items-center cursor-pointer ${
                                isPreventiveMaintenance ? "text-primary" : ""
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isPreventiveMaintenance}
                                onChange={() =>
                                    setIsPreventiveMaintenance(
                                        !isPreventiveMaintenance
                                    )
                                }
                            />
                            <span
                                className={`w-11 h-6 bg-gray-200 rounded-full inline-flex items-center p-1 transition-colors duration-200 ease-in-out ${
                                    isPreventiveMaintenance
                                        ? "bg-green-500"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-200 ease-in-out ${
                                        isPreventiveMaintenance
                                            ? "translate-x-5"
                                            : "translate-x-0"
                                    }`}
                                />
                            </span>
                        </label>
                        <label className="ml-2 text-sm font-medium text-gray-700">
                            Set Preventive Maintenance Schedule
                        </label>
                    </div>

                    <br />

                    {/* Preventive Maintenance Fields */}
                    {isPreventiveMaintenance && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <hr />
                                <br />
                                <div className="text-center font-bold text-lg">
                                    <h1>Preventive Maintenance Schedule</h1>
                                </div>

                                <label className="block text-sm font-medium text-gray-700">
                                    <br />
                                    Description{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Assign To{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={assignTo}
                                    onChange={(e) =>
                                        setAssignTo(e.target.value)
                                    }
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Person</option>
                                    <option value="Person 1">Person 1</option>
                                    <option value="Person 2">Person 2</option>
                                </select>
                            </div>

                            <div>
                                {/* Toggle Group */}
                                <div className="flex flex-wrap sm:inline-flex w-full sm:w-auto rounded-md overflow-hidden border border-gray-300">
                                    {[
                                        // "Daily",
                                        "Weekly",
                                        "Monthly",
                                        "Yearly",
                                    ].map((type, index) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setSchedule(type)}
                                            className={`w-1/4 sm:w-auto px-4 py-2 text-sm font-medium ${
                                                schedule === type
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            } ${
                                                index !== 0
                                                    ? "border-l border-white"
                                                    : ""
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>

                                {/* Conditional Fields */}
                                <div className="mt-4">
                                    {/* {schedule === "Daily" && (
                                        <div className="flex items-center gap-2">
                                            <span>Every</span>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-20 px-2 py-1 border rounded-md"
                                                value={dailyFrequency}
                                                onChange={(e) =>
                                                    setDailyFrequency(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                            <span>Day(s)</span>
                                        </div>
                                    )} */}

                                    {schedule === "Weekly" && (
                                        <div className="flex items-center gap-2">
                                            <span>Every</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max="99"
                                                className="w-20 px-2 py-1 border rounded-md"
                                                value={
                                                    weeklyFrequency === 0
                                                        ? ""
                                                        : weeklyFrequency
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    if (value === "") {
                                                        setWeeklyFrequency(0); // or you can set to null depending on your logic
                                                    } else {
                                                        const numberValue =
                                                            Number(value);
                                                        if (
                                                            numberValue >= 1 &&
                                                            numberValue <= 99
                                                        ) {
                                                            setWeeklyFrequency(
                                                                numberValue
                                                            );
                                                        }
                                                    }
                                                }}
                                            />
                                            <span>Week(s)</span>
                                        </div>
                                    )}

                                    {schedule === "Monthly" && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span>On the</span>

                                            {/* Week Number (1st–4th) */}
                                            <select
                                                className="w-32 sm:w-40 px-2 py-1 border rounded-md"
                                                value={monthlyFrequency}
                                                onChange={(e) =>
                                                    setMonthlyFrequency(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >
                                                {[1, 2, 3, 4].map((week) => (
                                                    <option
                                                        key={week}
                                                        value={week}
                                                    >
                                                        {week}
                                                        {week === 1
                                                            ? "st"
                                                            : week === 2
                                                            ? "nd"
                                                            : week === 3
                                                            ? "rd"
                                                            : "th"}{" "}
                                                        week
                                                    </option>
                                                ))}
                                            </select>

                                            <span>Of</span>

                                            {/* Day of the Week */}
                                            <select
                                                className="w-32 sm:w-40 px-2 py-1 border rounded-md"
                                                value={monthlyDay}
                                                onChange={(e) =>
                                                    setMonthlyDay(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {[
                                                    "Sunday",
                                                    "Monday",
                                                    "Tuesday",
                                                    "Wednesday",
                                                    "Thursday",
                                                    "Friday",
                                                    "Saturday",
                                                ].map((day) => (
                                                    <option
                                                        key={day}
                                                        value={day}
                                                    >
                                                        {day}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {schedule === "Yearly" && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span>Every</span>
                                            <select
                                                value={yearlyMonth}
                                                onChange={(e) =>
                                                    setYearlyMonth(
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded-md px-2 py-1 w-32 sm:w-40"
                                            >
                                                {[
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
                                                ].map((month) => (
                                                    <option
                                                        key={month}
                                                        value={month}
                                                    >
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                            <span>on day</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max="31"
                                                className="w-20 px-2 py-1 border rounded-md"
                                                value={yearlyDay}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    // Allow empty string for clearing
                                                    if (value === "") {
                                                        setYearlyDay("");
                                                        return;
                                                    }

                                                    // Parse number and clamp it between 1 and 31
                                                    const num = Number(value);
                                                    if (!isNaN(num)) {
                                                        if (num < 1) {
                                                            setYearlyDay(1);
                                                        } else if (num > 31) {
                                                            setYearlyDay(31);
                                                        } else {
                                                            setYearlyDay(num);
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex sm:justify-end justify-between gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white text-black border border-gray-300 px-4 py-2 rounded-full w-full sm:w-auto hover:bg-destructive hover:text-white"
                        >
                            Cancel
                        </button>

                        <PrimaryButton
                            type="submit"
                            className="justify-center w-full sm:w-auto bg-secondary hover:bg-primary"
                        >
                            Save Asset
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">
                            Are you sure you want to save this asset?
                        </h2>
                        <div className="flex justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-white text-black border border-gray-500 px-4 py-2 rounded-md hover:bg-destructive hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-md"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
