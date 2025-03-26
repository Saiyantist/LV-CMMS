import { useEffect, useState } from "react";
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
        images: string[]; // assuming images are returned as URLs
    };
    locations: Location[];
    auth: {
        user: {
            id: number;
            name: string;
        };
        permissions: string[];
    }
}

export default function EditWorkOrder({ workOrder, locations, auth }: EditWorkOrderProps) {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]); // For handling image deletions

    const isWOManager = auth.permissions.includes("manage work orders");

    console.log(isWOManager);
    
    const { data, setData, put, errors, processing } = useForm({
        location_id: workOrder.location_id,
        report_description: workOrder.report_description,
        images: [] as File[], // Store images as an array for uploads
        status: workOrder.status,
        work_order_type: workOrder.work_order_type,
        label: workOrder.label,
        priority: workOrder.priority,
        remarks: workOrder.remarks,
    });

    // Handle form submission
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("location_id", data.location_id);
        formData.append("report_description", data.report_description);

        // Handle image files
        data.images.forEach((image) => formData.append("images[]", image));
        deletedImages.forEach((image) => formData.append("deleted_images[]", image)); // send deleted images

        if (isWOManager) {
            formData.append("status", data.status || "");
            formData.append("work_order_type", data.work_order_type || "");
            formData.append("label", data.label || "");
            formData.append("priority", data.priority || "");
            formData.append("remarks", data.remarks || "");
        }

        router.put(`/work-orders/${workOrder.id}`, formData, { forceFormData: true });
    };

    // Handle image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData("images", files);

            const previews = files.map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...previews]);
        }
    };

    // Handle image removal
    const removeImage = (imageUrl: string) => {
        setDeletedImages((prev) => [...prev, imageUrl]); // Mark image for deletion
        setPreviewImages((prev) => prev.filter((src) => src !== imageUrl)); // Remove from preview
    };

    // Clean up image previews on component unmount
    useEffect(() => {
        return () => {
            previewImages.forEach((src) => URL.revokeObjectURL(src));
        };
    }, [previewImages]);

    return (
        <>
            <Head title="Edit Work Order" />
            <form onSubmit={submit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Edit Work Order</h2>

                {/* Location Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <select
                        value={data.location_id}
                        onChange={(e) => setData("location_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                    {errors.location_id && <p className="text-red-500 text-sm">{errors.location_id}</p>}
                </div>

                {/* Report Description */}
                <div className="mb-3">
                    <label className="block font-semibold">Description</label>
                    <textarea
                        value={data.report_description}
                        onChange={(e) => setData("report_description", e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                    {errors.report_description && <p className="text-red-500">{errors.report_description}</p>}
                </div>

                {/* Image Upload */}
                <div className="mb-3">
                    <label className="block font-semibold">Upload Images</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border p-2 w-full rounded" />
                    {errors.images && <p className="text-red-500">{errors.images}</p>}

                    {/* Image Previews */}
                    <div className="flex mt-2 space-x-2">
                        {previewImages.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(src)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {workOrder.images?.map((image, index) => (
                            <div key={index} className="relative">
                                <img src={image} alt="Current" className="w-20 h-20 object-cover rounded-md" />
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

                {isWOManager && (
                    <>
                        {/* Status */}
                        <div>
                            <label className="block font-semibold">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData("status", e.target.value)}
                                className="border p-2 w-full rounded"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Work Order Type */}
                        <div>
                            <label className="block font-semibold">Work Order Type</label>
                            <select
                                value={data.work_order_type}
                                onChange={(e) => setData("work_order_type", e.target.value)}
                                className="border p-2 w-full rounded"
                            >
                                <option value="Work Order">Work Order</option>
                                <option value="Preventive Maintenance">Preventive Maintenance</option>
                                <option value="Compliance">Compliance</option>
                            </select>
                        </div>

                        {/* Label */}
                        <div>
                            <label className="block font-semibold">Label</label>
                            <select
                                value={data.label}
                                onChange={(e) => setData("label", e.target.value)}
                                className="border p-2 w-full rounded"
                            >
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Painting">Painting</option>
                                <option value="Carpentry">Carpentry</option>
                                <option value="No Label">No Label</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block font-semibold">Priority</label>
                            <select
                                value={data.priority}
                                onChange={(e) => setData("priority", e.target.value)}
                                className="border p-2 w-full rounded"
                            >
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block font-semibold">Remarks</label>
                            <textarea
                                value={data.remarks}
                                onChange={(e) => setData("remarks", e.target.value)}
                                className="border p-2 w-full rounded"
                            />
                        </div>
                    </>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
                >
                    {processing ? "Updating..." : "Update Work Order"}
                </button>
            </form>
        </>
    );
}
