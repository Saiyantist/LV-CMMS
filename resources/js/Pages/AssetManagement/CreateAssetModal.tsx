import React, { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "sonner"; // Importing toast

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: {
        name: string;
        specification: string;
        location: string;
        condition: string;
        dateAcquired: string;
        lastMaintenance?: string; // Optional
        image?: File | null; // Optional
    }) => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [specification, setSpecification] = useState("");
    const [location, setLocation] = useState("");
    const [condition, setCondition] = useState("");
    const [dateAcquired, setDateAcquired] = useState("");
    const [lastMaintenance, setLastMaintenance] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmModal(true); // Show confirmation modal before saving
    };

    const handleConfirmSubmit = () => {
        try {
            // Trigger success toast first
            toast.success("Asset saved successfully!");

            // Simulate saving asset and then close modal after toast
            setTimeout(() => {
                onSave({
                    name,
                    specification,
                    location,
                    condition,
                    dateAcquired,
                    lastMaintenance: lastMaintenance || undefined,
                    image: image || undefined,
                });
                setShowConfirmModal(false); // Close confirmation modal after toast
                onClose(); // Close the main modal after the confirmation
            }, 500); // Give time for the toast to show
        } catch (error) {
            toast.error("Failed to save asset. Please try again.");
            setShowConfirmModal(false); // Ensure the modal closes on failure as well
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-80 md:w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Add New Asset
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Asset Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Specification
                        </label>
                        <select
                            value={specification}
                            onChange={(e) => setSpecification(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Specification</option>
                            <option value="Spec 1">Spec 1</option>
                            <option value="Spec 2">Spec 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Location</option>
                            <option value="Location 1">Location 1</option>
                            <option value="Location 2">Location 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Condition
                        </label>
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Condition</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Date Acquired
                        </label>
                        <input
                            type="date"
                            value={dateAcquired}
                            onChange={(e) => setDateAcquired(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Maintenance
                        </label>
                        <input
                            type="date"
                            value={lastMaintenance}
                            onChange={(e) => setLastMaintenance(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Image Upload Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Asset Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mt-6 flex justify-between gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md w-full sm:w-auto hover:bg-destructive hover:text-white"
                        >
                            Cancel
                        </button>

                        <PrimaryButton
                            type="submit"
                            className="justify-center w-full sm:w-auto bg-secondary hover:bg-primary"
                        >
                            Save Asset
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">
                            Are you sure you want to save this asset?
                        </h2>
                        <div className="flex justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-white text-black border border-gray-500 px-4 py-2 rounded-md hover:bg-destructive hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSubmit}
                                className="bg-secondary hover:bg-primary text-white px-4 py-2 rounded-md"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAssetModal;
