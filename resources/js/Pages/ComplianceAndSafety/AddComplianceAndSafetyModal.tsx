import React, { useState } from "react";
import Select from "react-select";
import ComplianceSummaryModal from "./ComplianceSummaryModal";

interface AddComplianceAndSafetyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
}

const AddComplianceAndSafetyModal: React.FC<
    AddComplianceAndSafetyModalProps
> = ({ isOpen, onClose, onCreate }) => {
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        complianceArea: "",
        location: "",
        description: "",
        safetyProtocols: "",
        targetDate: "",
        priority: "",
    });

    const [attachment, setAttachment] = useState<File[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [showSummary, setShowSummary] = useState(false);
    const [submittedData, setSubmittedData] = useState<any>(null);

    const userOptions = [
        { value: "Joshua", label: "Joshua" },
        { value: "Angelo", label: "Angelo" },
        { value: "Other", label: "Other" },
    ];

    const handleUserChange = (selected: any) => {
        setSelectedUsers(selected);
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const newErrors: any = {};
        if (!formData.complianceArea)
            newErrors.complianceArea = "This field is required";
        if (!formData.location) newErrors.location = "This field is required";
        if (!formData.description)
            newErrors.description = "This field is required";
        if (!formData.safetyProtocols)
            newErrors.safetyProtocols = "This field is required";
        if (!formData.targetDate)
            newErrors.targetDate = "This field is required";
        if (!formData.priority) newErrors.priority = "This field is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setSubmittedData({
                ...formData,
                assignedTo: selectedUsers.map((user) => user.label),
                attachments: attachment,
            });

            setShowSummary(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-lg p-6 shadow-lg overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-center w-full">
                        Add Compliance and Safety
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 absolute right-6"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                <form
                    className="space-y-4"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div>
                        <label className="block text-sm font-medium">
                            Compliance Area
                        </label>
                        <select
                            name="complianceArea"
                            className="mt-1 block w-full border rounded p-2"
                            value={formData.complianceArea}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Area</option>
                            <option value="Audy Lobby">Audy Lobby</option>
                            <option value="LVCC Grounds">LVCC Grounds</option>
                        </select>
                        {errors.complianceArea && (
                            <p className="text-red-500 text-sm">
                                {errors.complianceArea}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Location
                        </label>
                        <select
                            name="location"
                            className="mt-1 block w-full border rounded p-2"
                            value={formData.location}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Location</option>
                            <option value="Building A">Building A</option>
                            <option value="Building B">Building B</option>
                        </select>
                        {errors.location && (
                            <p className="text-red-500 text-sm">
                                {errors.location}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            name="description"
                            className="mt-1 block w-full border rounded p-2"
                            rows={3}
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Safety Protocols
                        </label>
                        <textarea
                            name="safetyProtocols"
                            className="mt-1 block w-full border rounded p-2"
                            rows={3}
                            placeholder="Enter safety protocols"
                            value={formData.safetyProtocols}
                            onChange={handleInputChange}
                        />
                        {errors.safetyProtocols && (
                            <p className="text-red-500 text-sm">
                                {errors.safetyProtocols}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Attachment
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="mt-1 block w-full border rounded p-2"
                            onChange={(e) =>
                                e.target.files &&
                                setAttachment(Array.from(e.target.files))
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Assign To
                        </label>
                        <Select
                            isMulti
                            options={userOptions}
                            value={selectedUsers}
                            onChange={handleUserChange}
                            className="mt-1 block w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Target Date
                        </label>
                        <input
                            type="date"
                            name="targetDate"
                            className="mt-1 block w-full border rounded p-2"
                            value={formData.targetDate}
                            onChange={handleInputChange}
                        />
                        {errors.targetDate && (
                            <p className="text-red-500 text-sm">
                                {errors.targetDate}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Priority
                        </label>
                        <select
                            name="priority"
                            className="mt-1 block w-full border rounded p-2"
                            value={formData.priority}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        {errors.priority && (
                            <p className="text-red-500 text-sm">
                                {errors.priority}
                            </p>
                        )}
                    </div>
                </form>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-90"
                    >
                        Create
                    </button>
                </div>

                {showSummary && submittedData && (
                    <ComplianceSummaryModal
                        data={submittedData}
                        onClose={() => {
                            setShowSummary(false);
                            onCreate();
                            onClose();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AddComplianceAndSafetyModal;
