import React, { useState } from "react";
import { toast } from "sonner"; // Importing toast

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: {
        name: string;
        specification: string;
        location: string;
        condition: string;
        dateAcquired: string;
        lastMaintenance?: string; // Optional
        image?: File | null; // Optional
        preventiveMaintenance?: {
            description: string;
            assignTo: string;
            schedule: string;
        };
    }) => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [specification, setSpecification] = useState("");
    const [location, setLocation] = useState("");
    const [condition, setCondition] = useState("");
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
    const [weeklyDays, setWeeklyDays] = useState<string[]>([]); // State for selected weekly days
    const [monthlyFrequency, setMonthlyFrequency] = useState(1); // Default to 1
    const [yearlyMonth, setYearlyMonth] = useState("January"); // Default to January
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
            toast.success("Asset saved successfully!");

            // Simulate saving asset and then close modal after toast
            setTimeout(() => {
                onSave({
                    name,
                    specification,
                    location,
                    condition,
                    dateAcquired,
                    lastMaintenance: lastMaintenance || undefined,
                    image: image || undefined,
                    preventiveMaintenance: isPreventiveMaintenance
                        ? {
                              description,
                              assignTo,
                              schedule,
                          }
                        : undefined,
                });
                setShowConfirmModal(false); // Close confirmation modal after toast
                onClose(); // Close the main modal after the confirmation
            }, 500); // Give time for the toast to show
        } catch (error) {
            toast.error("Failed to save asset. Please try again.");
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
                                Asset Name
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
                                Specification
                            </label>
                            <select
                                value={specification}
                                onChange={(e) =>
                                    setSpecification(e.target.value)
                                }
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Specification</option>
                                <option value="Spec 1">Spec 1</option>
                                <option value="Spec 2">Spec 2</option>
                            </select>
                        </div>
                    </div>

                    {/* Location, Condition, and Date Acquired (side by side) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Location</option>
                                <option value="Location 1">Location 1</option>
                                <option value="Location 2">Location 2</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Condition
                            </label>
                            <select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Condition</option>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date Acquired
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
                                    Description
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
                                    Assign To
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
                                        "Daily",
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
                                    {schedule === "Daily" && (
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
                                    )}

                                    {schedule === "Weekly" && (
                                        <div>
                                            <span className="block mb-2">
                                                Every
                                            </span>
                                            <div className="grid grid-cols-4 gap-2 max-w-md">
                                                {[
                                                    "Sunday",
                                                    "Monday",
                                                    "Tuesday",
                                                    "Wednesday",
                                                    "Thursday",
                                                    "Friday",
                                                    "Saturday",
                                                ].map((day) => (
                                                    <label
                                                        key={day}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={weeklyDays.includes(
                                                                day
                                                            )}
                                                            onChange={() =>
                                                                toggleDay(day)
                                                            }
                                                        />
                                                        <span className="text-sm">
                                                            {day}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {schedule === "Monthly" && (
                                        <div className="flex items-center gap-2">
                                            <span>Every</span>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-20 px-2 py-1 border rounded-md"
                                                value={monthlyFrequency}
                                                onChange={(e) =>
                                                    setMonthlyFrequency(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                            <span>Month(s)</span>
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
                                                className="border rounded-md px-2 py-1"
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
                                                onChange={(e) =>
                                                    setYearlyDay(
                                                        Number(e.target.value)
                                                    )
                                                }
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

                        <button
                            type="submit"
                            className="w-full sm:w-auto rounded-full bg-secondary hover:bg-primary text-white py-2 px-6"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h3 className="text-lg font-semibold mb-4">
                            Are you sure you want to save this asset?
                        </h3>
                        <div className="flex justify-between gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSubmit}
                                className="bg-primary text-white px-4 py-2 rounded-full"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAssetModal;
