import { useEffect, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Location {
    id: number;
    name: string;
}

interface CreateWorkOrderProps {
    locations: Location[];
    user: {
        id: number;
        name: string;
        permissions: string[];
    };
    onClose: () => void;
}

export default function CreateWorkOrderModal({
    locations,
    user,
    onClose, // for modal, remove all instances if not modal ang paggagamitan along
}: CreateWorkOrderProps) {
    const [previewImages, setPreviewImages] = useState<string[]>([]);

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
            remarks: "",
        }),
    });

    /** Handle Form Submission */
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("location_id", data.location_id);
        formData.append("report_description", data.report_description);
        data.images.forEach((image) => formData.append("images[]", image));

        if (isWorkOrderManager) {
            formData.append("status", data.status || "");
            formData.append("work_order_type", data.work_order_type || "");
            formData.append("label", data.label || "");
            formData.append("priority", data.priority || "");
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
        return () => {
            previewImages.forEach((src) => URL.revokeObjectURL(src));
        };
    }, [previewImages]);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full xl:max-w-3xl lg:max-w-2xl max-h-auto">
                <form
                    onSubmit={submit}
                    className="p-4 bg-white shadow-md rounded-lg"
                >
                    <div className="flex justify-between items-center p- rounded-t-lg">
                        <h2 className="px-6 text-xl font-bold text-gray-800">
                            Create Work Order
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white rounded-3xl px-2 py-0 border-2 hover:bg-red-400 hover:text-white"
                        >
                            <span className="text-md ">x</span>
                        </button>
                    </div>

                    <hr className="my-4" />

                    <div className="max-h-[70vh] overflow-y-auto px-6">
                        {/* Location Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <select
                                value={data.location_id}
                                onChange={(e) =>
                                    setData("location_id", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a location</option>
                                {locations.map((location) => (
                                    <option
                                        key={location.id}
                                        value={location.id}
                                    >
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                            {errors.location_id && (
                                <p className="text-red-500 text-sm">
                                    {errors.location_id}
                                </p>
                            )}
                        </div>

                        {/* Report Description */}
                        <div className="mb-4">
                            <label className="block font-semibold text-gray-700">
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
                                        <label className="block font-semibold text-gray-700">
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
                                        <label className="block font-semibold text-gray-700">
                                            Label
                                        </label>
                                        <select
                                            value={data.label}
                                            onChange={(e) =>
                                                setData("label", e.target.value)
                                            }
                                            className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                                        >
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
                                            <option value="No Label">
                                                No Label
                                            </option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="flex-1">
                                        <label className="block font-semibold text-gray-700">
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
                                            <option value="Pending">
                                                Pending
                                            </option>
                                            <option value="Assigned">
                                                Assigned
                                            </option>
                                            <option value="Ongoing">
                                                Ongoing
                                            </option>
                                            <option value="Overdue">
                                                Overdue
                                            </option>
                                            <option value="Completed">
                                                Completed
                                            </option>
                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    {/* Priority */}
                                    <div className="flex-1 mb-4">
                                        <label className="block font-semibold text-gray-700">
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
                                            <option value="">
                                                Select Priority
                                            </option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">
                                                Medium
                                            </option>
                                            <option value="High">High</option>
                                            <option value="Critical">
                                                Critical
                                            </option>
                                        </select>
                                    </div>
                                    {/* Assigned to */}
                                    <div className="flex-1 mb-4">
                                        <label className="block font-semibold text-gray-700">
                                            Assigned to
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
                                            <option value="">
                                                Select Priority
                                            </option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">
                                                Medium
                                            </option>
                                            <option value="High">High</option>
                                            <option value="Critical">
                                                Critical
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div className="mb-4">
                                    <label className="block font-semibold text-gray-700">
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
                            <label className="block font-semibold text-gray-700">
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
