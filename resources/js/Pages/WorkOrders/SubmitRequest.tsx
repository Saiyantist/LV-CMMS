import React, { useState, useMemo } from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ConfirmModal from "@/Components/ConfirmModal";
import { Toaster, toast } from "sonner";
import WOSubmittedModal from "./WOSubmittedModal";
// import { Inertia } from "@inertiajs/inertia";

const SubmitWorkOrder: React.FC = () => {
    const { data, setData, post, reset } = useForm({
        location_id: "",
        report_description: "",
        images: [] as File[],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Add state for success modal
    const [successData, setSuccessData] = useState<{
        location: string;
        description: string;
        images: { url: string; name: string }[];
    }>({
        location: "",
        description: "",
        images: [],
    });

    const user = usePage().props.auth.user;

    // Location and Photo States
    const [locations, setLocations] = useState<{ id: number; name: string }[]>(
        []
    );
    const [filteredLocations, setFilteredLocations] = useState<
        { id: number; name: string }[]
    >([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [typedLocation, setTypedLocation] = useState("");

    const filePreviews = useMemo(
        () =>
            data.images.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            })),
        [data.images]
    );

    // ✅ Validation
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.location_id.trim())
            newErrors.location = "Location is required.";
        if (!data.report_description.trim())
            newErrors.description = "Description is required.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please complete all required fields.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Prepare success data for the modal
        setSuccessData({
            location: data.location_id, // Updated to use location_id
            description: data.report_description,
            images: filePreviews, // Uses file previews for images
        });

        setShowConfirmModal(true); // ✅ Only show confirm modal
    };

    const handleConfirmSubmit = () => {
        setShowConfirmModal(false);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("location_id", data.location_id); // Send the location_id
        formData.append("report_description", data.report_description); // Send the description
        data.images.forEach((image) => formData.append("images[]", image)); // Send images

        router.post("/work-orders", formData, {
            forceFormData: true,
        });

        setTimeout(() => {
            setIsLoading(false);
            toast.success("Work order submitted successfully!"); // ✅ Show success toast only after confirmed

            // Prepare success data for the modal
            setSuccessData({
                location: data.location_id,
                description: data.report_description,
                images: filePreviews,
            });

            setShowSuccessModal(true); // Show success modal after submission

            // Clear form and other states after submission
            reset();
            setErrors({});
            setTypedLocation("");
            setFilteredLocations([]);
            setShowDropdown(false);
        }, 1000);
    };

    const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const typed = e.target.value;
        setTypedLocation(typed);
        setData("location_id", typed); // ✅ Ensures validation works
        if (typed.trim()) {
            setFilteredLocations(
                locations.filter((loc) =>
                    loc.name.toLowerCase().includes(typed.toLowerCase())
                )
            );
            setShowDropdown(true);
        } else {
            setFilteredLocations([]);
            setShowDropdown(false);
        }
    };

    const handleSelectLocation = (loc: { id: number; name: string }) => {
        // setData("location_id", loc.name);
        setData("location_id", loc.id.toString());
        setTypedLocation(loc.name);
        setShowDropdown(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const maxSize = 2 * 1024 * 1024;
            const filteredFiles = Array.from(e.target.files).filter(
                (file) =>
                    allowedTypes.includes(file.type) && file.size <= maxSize
            );
            setData("images", filteredFiles);
        }
    };

    const handleCancel = () => {
        reset();
        setErrors({});
        setTypedLocation("");
        setFilteredLocations([]);
        setShowDropdown(false);
    };

    return (
        <Authenticated>
            <Head title="Submit Work Order" />
            <Toaster position="top-right" richColors />

            <div className="flex h-screen">
                <div className="flex-1 p-8">
                    <section className="text-gray-600 body-font relative">
                        <div className="container mx-auto">
                            <div className="flex flex-col text-center w-full mb-12">
                                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                                    Work Order Request Form
                                </h1>
                            </div>
                            <form
                                onSubmit={handleSubmit}
                                className="lg:w-1/2 md:w-2/3 mx-auto"
                            >
                                <div className="flex flex-wrap -m-2">
                                    {/* Location Input */}
                                    <div className="p-2 w-full">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            className="border p-2 w-full rounded-md text-sm"
                                            value={typedLocation}
                                            onChange={handleLocationInput}
                                            onFocus={() =>
                                                setShowDropdown(true)
                                            }
                                            placeholder="Search or type a new location"
                                        />
                                        {errors.location && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.location}
                                            </p>
                                        )}
                                        {showDropdown &&
                                            filteredLocations.length > 0 && (
                                                <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md shadow bg-white z-10">
                                                    {filteredLocations.map(
                                                        (loc) => (
                                                            <li
                                                                key={loc.id}
                                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                                onClick={() =>
                                                                    handleSelectLocation(
                                                                        loc
                                                                    )
                                                                }
                                                            >
                                                                {loc.name}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                    </div>

                                    {/* Description */}
                                    <div className="p-2 w-full">
                                        <label
                                            htmlFor="description"
                                            className="leading-7 text-sm text-gray-600"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.report_description}
                                            onChange={(e) =>
                                                setData(
                                                    "report_description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Upload Photos */}
                                    <div className="p-2 w-full">
                                        <label
                                            htmlFor="photos"
                                            className="leading-7 text-sm text-gray-600"
                                        >
                                            Upload Photos
                                        </label>
                                        <input
                                            type="file"
                                            id="photos"
                                            name="photos"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                        />
                                    </div>

                                    {/* Image Previews */}
                                    {filePreviews.length > 0 && (
                                        <div className="p-2 w-full grid grid-cols-3 gap-2 overflow-auto max-h-60">
                                            {filePreviews.map((file, index) => (
                                                <img
                                                    key={index}
                                                    src={file.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="p-2 w-full flex flex-wrap justify-center sm:justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="bg-white text-black px-12 py-2 rounded-3xl border-2 hover:bg-red-400 hover:text-white transition"
                                        >
                                            Clear
                                        </button>

                                        <button
                                            type="submit"
                                            className={`text-white bg-secondary border-0 py-2 px-6 sm:px-8 rounded-3xl text-base sm:text-lg transition ${
                                                isLoading
                                                    ? "cursor-not-allowed opacity-50"
                                                    : "hover:bg-primary"
                                            }`}
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? "Submitting..."
                                                : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>

            {showConfirmModal && (
                <ConfirmModal
                    message="Are you sure you want to submit this request?"
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            {/* Success Modal */}
            <WOSubmittedModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                dateRequested={new Date().toLocaleDateString()}
                user={{
                    first_name: user.first_name,
                    last_name: user.last_name,
                }}
                location={successData.location}
                description={successData.description}
                images={successData.images}
            />
        </Authenticated>
    );
};

export default SubmitWorkOrder;
