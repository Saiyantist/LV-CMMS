import React, { useState, useMemo, useEffect, useRef } from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ConfirmModal from "@/Components/ConfirmModal";
import WOSubmittedModal from "./WOSubmittedModal";
import SubmitRequestLayout from "./SubmitRequestLayout";
import axios from "axios";

const SubmitWorkOrder: React.FC = () => {
    const { props } = usePage();
    const user = usePage().props.auth.user;

    const dropdownRef = useRef<HTMLDivElement>(null);

    const locations = props.locations as { id: number; name: string }[];
    const { data, setData, reset } = useForm({
        location_id: "",
        report_description: "",
        images: [] as File[],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [filteredLocations, setFilteredLocations] = useState<{ id: number; name: string }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [typedLocation, setTypedLocation] = useState("");
    const [submittedData, setSubmittedData] = useState({
        location: "",
        description: "",
        images: [] as { url: string; name: string }[],
    });

    const filePreviews = useMemo(
        () =>
            data.images.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            })),
        [data.images]
    );

    useEffect(() => {
        /** Filter locations based on typed input */
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

                return () => {
            document.removeEventListener("mousedown", handleClickOutside);

        };
    }, [typedLocation, locations]);

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

    const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
        e.preventDefault();
        if (!validateForm()) return false;

        // Show confirmation modal
        setShowConfirmModal(true);
        return true;
    };

    const handleConfirmSubmit = async () => {
        setIsLoading(true); // Start loading
        setShowConfirmModal(false); // Close the confirmation modal

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

        try {
            // Simulate a successful submission to the backend
            await axios.post("/work-orders", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Store submitted data before resetting the form
            setSubmittedData({
                location: typedLocation,
                description: data.report_description,
                images: filePreviews, // Include file previews in submitted data
            });

            setIsLoading(false);
            setShowSuccessModal(true); // Show the success modal
            toast.success("Work order submitted successfully!"); // Show success toast
            reset(); // Reset the form
            setErrors({});
            setTypedLocation("");
            setFilteredLocations([]);
            setShowDropdown(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("Failed to submit the work order. Please try again."); // Show error toast
        }
    };

    const handleLocationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const typed = e.target.value;
        setTypedLocation(typed);
        setData("location_id", typed);

        if (typed.trim()) {
            const matches = locations.filter((loc) =>
                loc.name.toLowerCase().includes(typed.toLowerCase())
            );
            setFilteredLocations(matches); // Update filtered locations
            setShowDropdown(true); // Show dropdown when input is not empty
        } else {
            setFilteredLocations(locations); // Show all locations if input is empty
            setShowDropdown(false); // Collapse dropdown if input is cleared
        }
    };

    const handleFocusInput = () => {
        setFilteredLocations(locations); // Show all locations on focus
        setShowDropdown(true);
    };

    const handleSelectLocation = (loc: { id: number; name: string }) => {
        setData("location_id", loc.id.toString());
        setTypedLocation(loc.name);
        setShowDropdown(false); // Collapse dropdown on selection
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

            <SubmitRequestLayout
                data={{
                    ...data,
                    user: {
                        id: user.id,
                        name: `${user.first_name} ${user.last_name}`,
                    },
                }}
                errors={errors}
                isLoading={isLoading}
                filePreviews={filePreviews}
                typedLocation={typedLocation}
                showDropdown={showDropdown}
                filteredLocations={filteredLocations}
                dropdownRef={dropdownRef}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                handleLocationInput={handleLocationInput}
                handleSelectLocation={handleSelectLocation}
                handleFileChange={handleFileChange}
                setData={setData}
                onFocusInput={handleFocusInput} // Pass focus handler
            />

            {/* ConfirmModal */}
            {showConfirmModal && (
                <ConfirmModal
                    message="Are you sure you want to submit this request?"
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            <WOSubmittedModal
                isOpen={showSuccessModal}
                dateRequested={new Date().toISOString()} // Use the current date as the request date
                user={{
                    first_name: user.first_name,
                    last_name: user.last_name,
                }} // Pass user details
                location={submittedData.location || "No location provided"} // Use submitted data for location
                description={
                    submittedData.description || "No description provided"
                } // Use submitted data for description
                images={submittedData.images || []} // Use submitted data for images
                onClose={() => {
                    setShowSuccessModal(false); // Close modal handler
                    window.location.reload(); // Refresh the page
                }}
                // onViewWorkOrders={() => {
                //     console.log("View Work Orders clicked"); // Add a handler for onViewWorkOrders
                // }}
            />
        </Authenticated>
    );
};

export default SubmitWorkOrder;
