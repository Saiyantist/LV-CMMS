import React, { useState, useMemo } from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ConfirmModal from "@/Components/ConfirmModal";
import WOSubmittedModal from "./WOSubmittedModal";
import SubmitRequestLayout from "./SubmitRequestLayout";

const SubmitWorkOrder: React.FC = () => {
    const { data, setData, post, reset } = useForm({
        location_id: "",
        report_description: "",
        images: [] as File[],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
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
        setSuccessData({
            location: data.location_id,
            description: data.report_description,
            images: filePreviews,
        });
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirmModal(false);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("location_id", data.location_id);
        formData.append("report_description", data.report_description);
        data.images.forEach((image) => formData.append("images[]", image));

        router.post("/work-orders", formData, {
            forceFormData: true,
        });

        setTimeout(() => {
            setIsLoading(false);
            toast.success("Work order submitted successfully!");
            setSuccessData({
                location: data.location_id,
                description: data.report_description,
                images: filePreviews,
            });
            setShowSuccessModal(true);
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
        setData("location_id", typed);
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

            <SubmitRequestLayout
                data={data}
                errors={errors}
                isLoading={isLoading}
                filePreviews={filePreviews}
                typedLocation={typedLocation}
                showDropdown={showDropdown}
                filteredLocations={filteredLocations}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                handleLocationInput={handleLocationInput}
                handleSelectLocation={handleSelectLocation}
                handleFileChange={handleFileChange}
                setData={setData}
            />

            {showConfirmModal && (
                <ConfirmModal
                    message="Are you sure you want to submit this request?"
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

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
