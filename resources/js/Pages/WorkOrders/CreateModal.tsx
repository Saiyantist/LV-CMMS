import { useEffect, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/shadcnui/dropdown-menu";
import { Button } from "@/Components/shadcnui/button";
import axios from "axios";
import { useRef } from "react";
interface Location {
    id: number;
    name: string;
}

interface CreateWorkOrderProps {
    locations: Location[];
    maintenancePersonnel: { id: number; first_name: string; last_name: string; roles: {id: number; name: string;}}[];
    user: {
        id: number;
        name: string;
        roles: string[];
        permissions: string[];
    };
    onClose: () => void;
}

export default function CreateWorkOrderModal({
    locations,
    maintenancePersonnel,
    user,
    onClose, // for modal, remove all instances if not modal ang paggagamitan along
}: CreateWorkOrderProps) {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [typedLocation, setTypedLocation] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isWorkOrderManager = user.permissions.includes("manage work orders");

    const { data, setData, post, errors } = useForm({
        location_id: "",
        report_description: "",
        images: [] as File[], // Store images as an array
        ...(isWorkOrderManager && {
            status: "Pending",
            work_order_type: "Work Order",
            label: "No Label",
            priority: "",
            assigned_to: "",
            remarks: "",
        }),
    });

    /** Handle Form Submission */
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        let locationId = data.location_id;

        // Check the typed location against existing locations
        const existing = locations.find(loc => loc.name.toLowerCase() === typedLocation.toLowerCase());

        if (existing) {
            locationId = existing.id.toString();
        } else {
            
            const response = await axios.post("/locations", { // Create the new location before creating the work order.
                name: typedLocation.trim(),
            });
            locationId = response.data.id;
        }

        const formData = new FormData();
        formData.append("location_id", locationId);
        formData.append("report_description", data.report_description);
        data.images.forEach((image) => formData.append("images[]", image));

        if (isWorkOrderManager) {
            formData.append("status", data.status || "");
            formData.append("work_order_type", data.work_order_type || "");
            formData.append("label", data.label || "");
            formData.append("priority", data.priority || "");
            formData.append("assigned_to", data.assigned_to || "");
            formData.append("remarks", data.remarks || "");
        }

        router.post("/work-orders", formData, {
            forceFormData: true,
        });
        onClose();
    };

    /** Handle Image Previews */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData("images", files);

            const previews = files.map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...previews]);
        }
    };

    useEffect(() => {
        /** Handle dropdown filtering */
        const search = typedLocation.toLowerCase();
        const matches = locations.filter((loc) =>
            loc.name.toLowerCase().includes(search)
        );
        setFilteredLocations(matches);

        /** Handle click outside dropdown */
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside); // Add event listener to detect clicks outside the dropdown

        /** Cleanup for dropdown and image previews */

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);

            previewImages.forEach((src) => URL.revokeObjectURL(src)); // Revoke object URLs for image previews
        };
    }, [previewImages, typedLocation, locations]);

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-25 backdrop-blur-[1px] flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-3xl md:max-w-xl lg:max-w-2xl p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <form
                    onSubmit={submit}
                    className="space-y-4"
                >
                    <h2 className="px-6 text-xl font-bold text-gray-800">
                        Create Work Order
                    </h2>

                    <hr className="my-4" />

                    <div className="max-h-[75vh] text-sm font-thin overflow-y-auto px-6 space-y-2">
                        {/* Location Search Input */}
                        <div ref={dropdownRef} className="mb-4 relative">
                            <label className="block font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                value={typedLocation}
                                onChange={(e) => {
                                    setTypedLocation(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Search or type a new location"
                                className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                            {showDropdown && (
                                <ul className="absolute z-10 bg-white border w-full rounded shadow max-h-60 overflow-y-auto mt-1">
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

                            {errors.location_id && (
                                <p className="text-red-500 text-sm">
                                    {errors.location_id}
                                </p>
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

                        {/* Report Description */}
                        <div className="">
                            <label className="block font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                value={data.report_description}
                                onChange={(e) =>
                                    setData(
                                        "report_description",
                                        e.target.value
                                    )
                                }
                                className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.report_description && (
                                <p className="text-red-500 text-sm">
                                    {errors.report_description}
                                </p>
                            )}
                        </div>

                        {isWorkOrderManager && (
                            <>
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {/* Work Order Type */}
                                    <div className="flex-1">
                                        <label className="block font-medium text-gray-700">
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
                                            className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
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
                                    <div className="flex-1">
                                        <label className="block font-medium text-gray-700">
                                            Label
                                        </label>
                                        <select
                                            value={data.label}
                                            onChange={(e) =>
                                                setData("label", e.target.value)
                                            }
                                            className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
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

                                    {/* Status */}
                                    <div className="flex-1">
                                        <label className="block font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
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
                                </div>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    {/* Priority */}
                                    <div className="flex-1 mb-4">
                                        <label className="block font-medium text-gray-700">
                                            Priority
                                        </label>
                                        <select
                                            value={data.priority}
                                            onChange={(e) =>
                                                setData(
                                                    "priority",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Priority</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    {/* Assigned to */}
                                    <div className="flex-1 mb-4">
                                        <label className="block font-medium text-gray-700">
                                            Assign to
                                        </label>
                                        <select
                                            value={data.assigned_to}
                                            onChange={(e) =>
                                                setData(
                                                    "assigned_to",
                                                    e.target.value
                                                )
                                            }
                                            className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Personnel</option>
                                            {maintenancePersonnel.map((person) => (
                                                <option key={person.id} value={person.id}>
                                                    {person.first_name} {person.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div className="mb-4">
                                    <label className="block font-medium text-gray-700">
                                        Remarks
                                    </label>
                                    <textarea
                                        value={data.remarks}
                                        onChange={(e) =>
                                            setData("remarks", e.target.value)
                                        }
                                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </>
                        )}

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">
                                Upload Images
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.images && (
                                <p className="text-red-500 text-sm">
                                    {errors.images}
                                </p>
                            )}

                            {/* Image Previews */}
                            <div className="flex mt-4 flex-wrap gap-2">
                                {previewImages.map((src, index) => (
                                    <div
                                        key={index}
                                        className="relative w-24 h-24 border rounded-md overflow-hidden"
                                    >
                                        <img
                                            src={src}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-white text-black px-12 py-2 rounded-3xl border-2 hover:bg-red-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-secondary text-white px-12 py-2 rounded-3xl hover:bg-primary"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
