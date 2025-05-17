import { useState, useEffect, useRef } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";

interface Location {
    id: number;
    name: string;
}

interface EditWorkOrderProps {
    workOrder: {
        id: number;
        location: { id: number; name: string };
        report_description: string;
        asset: any;
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
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isWorkOrderManager = user.permissions.includes("manage work orders");
    
    const initialLocationName = locations.find((loc) =>
        loc.id === Number(workOrder.location.id))?.name || "";

    const initialLocationId = locations.find((loc) =>
        loc.id === Number(workOrder.location.id))?.id || "";
    
    // Set the default value for the location input
    const [typedLocation, setTypedLocation] = useState<string>(initialLocationName);
    const [newLocation, setNewLocation] = useState<string>("");

    const { data, setData, errors, processing } = useForm({
        location_id: workOrder.location.id,
        report_description: workOrder.report_description,
        asset: workOrder.asset,
        images: [] as File[],
        status: workOrder.status,
        work_order_type: workOrder.work_order_type,
        label: workOrder.label,
        priority: workOrder.priority,
        remarks: workOrder.remarks ?? "",
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        let locationId;

        if (newLocation) {
            const response = await axios.post("/locations", { // Create the new location before creating the work order.
                name: newLocation.trim(),
            });
            locationId = response.data.id;
        }

        else {
            locationId = initialLocationId;
        }

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("location_id", String(locationId));
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
            setData("location_id", (matchedLocation.id));
        } else {
            setNewLocation(value);
        }

        const filtered = locations.filter((loc) =>
            loc.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredLocations(filtered);
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

    const getAssetDetails = (workOrder: any) => {
        if (workOrder.asset) {
            return {
                id: workOrder.asset.id,
                name: workOrder.asset.name,
                location_id: workOrder.asset.location_id,
                location_name: locations.find(
                    (loc) => loc.id === workOrder.asset.location_id
                )?.name || "No Location",
            };
        }
        return null;
    };
    
    const assetDetails = getAssetDetails(workOrder);

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-25 backdrop-blur-[1px] flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-3xl sm:max-w-md lg:max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={submit} className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">
                        Edit Work Order
                    </h2>

                    <hr className="my-4" />

                    {/* Fields */}
                    <div className="max-h-[55vh] overflow-y-auto px-6 space-y-2">

                        {/* Location Search Input */}
                        <div ref={dropdownRef}>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                className="border border-gray-300 p-2 w-full rounded-md text-sm"
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

                            {showDropdown && (
                                <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md shadow bg-white z-10">
                                    {filteredLocations.length > 0 ? (
                                        filteredLocations.map((loc) => (
                                            <li
                                                key={loc.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setData("location_id", loc.id.toString());
                                                    setTypedLocation(loc.name);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                {loc.name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2 text-gray-500 italic">New location will be created</li>
                                    )}
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
                                <p className="text-yellow-500 text-sm">
                                    Location does not exist. If this is correct,
                                    proceed with the custom location.
                                </p>
                            )}

                        {/* Description */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.report_description}
                                onChange={(e) =>
                                    setData("report_description", e.target.value)
                                }
                                className="border border-gray-300 p-2 w-full rounded-md text-sm"
                                required
                            />
                            {errors.report_description && (
                                <p className="text-red-500">
                                    {errors.report_description}
                                </p>
                            )}
                        </div>

                        {/* Asset */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Asset
                            </label>
                            <div className="w-full border border-gray-300 p-2 rounded-md text-sm">
                                {assetDetails ? (
                                    <p>
                                        {assetDetails.name} - {assetDetails.location_name}
                                    </p>
                                ) : (
                                    <p>No Asset Attached.</p>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Upload Images
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border border-gray-300 p-2 w-full rounded-md text-sm"
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
                            <div className="space-y-2">

                                {/* Status */}
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="border border-gray-300 p-2 w-full rounded-md text-sm"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Overdue">Overdue</option>
                                        <option value="Completed">Completed</option>
                                        <option value="For Budget Request">For Budget Request</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Declined">Declined</option>
                                    </select>
                                </div>

                                {/* Work Order Type */}
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
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
                                        className="border border-gray-300 p-2 w-full rounded-md text-sm"
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
                                
                                {/* Label */}
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Label
                                    </label>
                                    <select
                                        value={data.label}
                                        onChange={(e) =>
                                            setData("label", e.target.value)
                                        }
                                        className="border border-gray-300 p-2 w-full rounded-md text-sm"
                                    >
                                                <option value="HVAC">
                                                    HVAC
                                                </option>
                                                <option value="Electrical">
                                                    Electrical
                                                </option>
                                                <option value="Plumbing">
                                                    Plumbing
                                                </option>
                                                <option value="Painting">
                                                    Painting
                                                </option>
                                                <option value="Carpentry">
                                                    Carpentry
                                                </option>
                                                <option value="Repairing">
                                                    Repairing
                                                </option>
                                                <option value="Welding">
                                                    Welding
                                                </option>
                                                <option value="No Label">
                                                    No Label
                                                </option>
                                    </select>
                                </div>
                                
                                {/* Priority */}
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={data.priority}
                                        onChange={(e) =>
                                            setData("priority", e.target.value)
                                        }
                                        className="border border-gray-300 p-2 w-full rounded-md text-sm"
                                    >
                                        <option value="">Select Priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical"> Critical </option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Footer - Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
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
