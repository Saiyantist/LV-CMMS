import React, { useState, useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import SubmitRequestLayout from "@/Layouts/SubmitRequestLayout";
import WOConfirmationModal from "@/Components/WOSubmittedModal";
import ConfirmModal from "@/Components/ConfirmModal";

const SubmitRequest: React.FC = () => {
    // ✅ Form State using Inertia's useForm
    const { data, setData, reset } = useForm({
        location: "",
        description: "",
        photos: [] as File[],
    });

    // ✅ Loading, Error, and Modal States
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // ✅ File Previews - Memoized for Performance
    const filePreviews = useMemo(
        () =>
            data.photos.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            })),
        [data.photos]
    );

    // ✅ Basic Form Validation
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.location.trim()) newErrors.location = "This field is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle Submit Action
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Show confirmation modal before proceeding
        setShowConfirmModal(true);
    };

    // ✅ Handle Confirmation Modal Action
    const handleConfirmSubmit = () => {
        setShowConfirmModal(false);
        setIsLoading(true);

        // Simulate successful submission
        setTimeout(() => {
            setIsLoading(false);
            setShowDetailsModal(true); // Show details modal after confirmation
        }, 1000);
    };

    // ✅ Handle File Change with Validation
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const maxSize = 2 * 1024 * 1024; // 2MB

            const filteredFiles = Array.from(e.target.files).filter(
                (file) =>
                    allowedTypes.includes(file.type) && file.size <= maxSize
            );

            if (filteredFiles.length !== e.target.files.length) {
                alert(
                    "Some files were rejected. Only JPEG/PNG and size below 2MB are allowed."
                );
            }

            setData("photos", filteredFiles);
        }
    };

    // ✅ Handle Cancel Action
    const handleCancel = () => {
        reset(); // Clear the form
        setErrors({}); // Reset errors
    };

    // ✅ Handle Modal Close
    const handleModalClose = () => {
        setShowDetailsModal(false);
        reset(); // Clear the form after submission
    };

    return (
        <Authenticated>
            <Head title="Submit Request" />
            <SubmitRequestLayout
                data={data}
                errors={errors}
                isLoading={isLoading}
                filePreviews={filePreviews}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                handleFileChange={handleFileChange}
                setData={setData}
            />

            {/* ✅ Confirmation Modal */}
            {showConfirmModal && (
                <ConfirmModal
                    message="Are you sure you want to submit this request?"
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            {/* ✅ Details Modal After Submission */}
            {showDetailsModal && (
                <WOConfirmationModal
                    data={data}
                    filePreviews={filePreviews}
                    onClose={handleModalClose}
                />
            )}
        </Authenticated>
    );
};

export default SubmitRequest;
