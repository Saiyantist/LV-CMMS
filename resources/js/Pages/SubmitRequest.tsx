import React, { useState, useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import SubmitRequestLayout from "@/Layouts/SubmitRequestLayout";

const SubmitRequest: React.FC = () => {
    // ✅ Form State using Inertia's useForm
    const { data, setData, post, reset } = useForm({
        date: "",
        requestedBy: "",
        workOrderType: "maintenance",
        location: "",
        description: "",
        photos: [] as File[],
    });

    // ✅ Loading and Error States
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        if (!data.date) newErrors.date = "This field is required.";
        if (!data.requestedBy.trim())
            newErrors.requestedBy = "This field is required.";
        if (!data.location.trim()) newErrors.location = "This field is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle Submit Action
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        // 🚨 No backend configured yet, so we'll simulate a successful response
        setTimeout(() => {
            alert("Request submitted successfully!");
            reset(); // Reset form
            setIsLoading(false);
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
        </Authenticated>
    );
};

export default SubmitRequest;
