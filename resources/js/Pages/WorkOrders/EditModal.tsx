import { useState, useEffect, useRef } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";

interface Location {
    id: number;
    name: string;
}

interface EditWorkOrderProps {
    workOrder: {
        id: number;
        location_id: string;
        report_description: string;
        status: string;
        work_order_type: string;
        label: string;
        priority: string;
        remarks: string;
        images: string[];
    };
    locations: Location[];
    user: {
        id: number;
        name: string;
        permissions: string[];
    };
    onClose: () => void;
}

export default function EditWorkOrderModal({
    workOrder,
    locations,
    user,
    onClose,
}: EditWorkOrderProps) {
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [typedLocation, setTypedLocation] = useState<string>("");
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isWorkOrderManager = user.permissions.includes("manage work orders");

    // const initialLocation =
    //     locations.find(
    //         (loc) => String(loc.id) === String(workOrder.location_id)
    //     )?.name || workOrder.location_id;

    const initialLocationName =
        locations.find(
            (loc) => String(loc.id) === String(workOrder.location_id)
        )?.name || "";

    const { data, setData, put, errors, processing } = useForm({
        // location_id: initialLocation,
        location_id: workOrder.location_id, // <- use raw ID or string here
        report_description: workOrder.report_description,
        images: [] as File[],
        status: workOrder.status,
        work_order_type: workOrder.work_order_type,
        label: workOrder.label,
        priority: workOrder.priority,
        remarks: workOrder.remarks ?? "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("location_id", data.location_id);
        formData.append("report_description", data.report_description);

        data.images.forEach((image) => formData.append("images[]", image));
        deletedImages.forEach((image) =>
            formData.append("deleted_images[]", image)
        );

        if (isWorkOrderManager) {
            formData.append("status", data.status || "");
            formData.append("work_order_type", data.work_order_type || "");
            formData.append("label", data.label || "");
            formData.append("priority", data.priority || "");
            formData.append("remarks", data.remarks || "");
        }

        router.post(`/work-orders/${workOrder.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
        });
        setTimeout(() => {
            onClose();
        }, 600);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData("images", files);
        }
    };

    const removeImage = (imageUrl: string) => {
        setDeletedImages((prev) => [...prev, imageUrl]);
    };

    const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTypedLocation(value);

        const matchedLocation = locations.find(
            (loc) => loc.name.toLowerCase() === value.toLowerCase()
        );

        // ✅ Submit ID if it's a known location, else submit raw string
        if (matchedLocation) {
            setData("location_id", String(matchedLocation.id));
        } else {
            setData("location_id", value);
        }

        const filtered = locations.filter((loc) =>
            loc.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredLocations(filtered);
    };

    const handleSelectLocation = (loc: Location) => {
        setTypedLocation(loc.name);
        setData("location_id", String(loc.id)); // ✅ backend expects ID
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-3xl sm:max-w-md lg:max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={submit} className="space-y-6">
                    <h2 className="text-xl font-bold mb-4 text-center">
                        Edit Work Order
                    </h2>

                    {/* Location Search Input */}
                    <div ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            type="text"
                            className="border p-2 w-full rounded-md text-sm"
                            value={typedLocation}
                            onChange={handleLocationInput}
                            onFocus={() => {
                                setFilteredLocations(locations);
                                setShowDropdown(true);
                            }}
                            placeholder="Search or type a new location"
                        />
                        {errors.location_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.location_id}
                            </p>
                        )}

                        {showDropdown && filteredLocations.length > 0 && (
                            <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md shadow bg-white z-10">
                                {filteredLocations.map((loc) => (
                                    <li
                                        key={loc.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleSelectLocation(loc)
                                        }
                                    >
                                        {loc.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Checker if typed location is custom */}
                    {typedLocation &&
                        !locations.some(
                            (loc) =>
                                loc.name.toLowerCase() ===
                                typedLocation.toLowerCase()
                        ) && (
                            <p className="text-yellow-500 text-sm mt-2">
                                Location does not exist. If this is correct,
                                proceed with the custom location.
                            </p>
                        )}

                    {/* Description */}
                    <div>
                        <label className="block font-semibold">
                            Description
                        </label>
                        <textarea
                            value={data.report_description}
                            onChange={(e) =>
                                setData("report_description", e.target.value)
                            }
                            className="border p-2 w-full rounded-md text-sm"
                            required
                        />
                        {errors.report_description && (
                            <p className="text-red-500">
                                {errors.report_description}
                            </p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block font-semibold">
                            Upload Images
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border p-2 w-full rounded-md text-sm"
                        />
                        {errors.images && (
                            <p className="text-red-500">{errors.images}</p>
                        )}
                        <div className="flex mt-2 flex-wrap gap-2">
                            {workOrder.images?.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image}
                                        alt="Current"
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(image)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isWorkOrderManager && (
                        <>
                            <div>
                                <label className="block font-semibold">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="border p-2 w-full rounded-md text-sm"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Overdue">Overdue</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold">
                                    Work Order Type
                                </label>
                                <select
                                    value={data.work_order_type}
                                    onChange={(e) =>
                                        setData(
                                            "work_order_type",
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 w-full rounded-md text-sm"
                                >
                                    <option value="Work Order">
                                        Work Order
                                    </option>
                                    <option value="Preventive Maintenance">
                                        Preventive Maintenance
                                    </option>
                                    <option value="Compliance">
                                        Compliance
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold">
                                    Label
                                </label>
                                <select
                                    value={data.label}
                                    onChange={(e) =>
                                        setData("label", e.target.value)
                                    }
                                    className="border p-2 w-full rounded-md text-sm"
                                >
                                    <option value="Electrical">
                                        Electrical
                                    </option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="HVAC">HVAC</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold">
                                    Priority
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={(e) =>
                                        setData("priority", e.target.value)
                                    }
                                    className="border p-2 w-full rounded-md text-sm"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical"> Critical </option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-black hover:bg-destructive hover:text-white py-2 px-4 rounded-md w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-secondary hover:bg-primary text-white py-2 px-4 rounded-md w-full sm:w-auto"
                            disabled={processing}
                        >
                            {processing ? "Saving..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
