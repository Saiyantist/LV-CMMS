import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
} from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { Input } from "@/Components/shadcnui/input";
import { router, usePage } from "@inertiajs/react";

const serviceOptions = [
    "Sound System",
    "Projector",
    "Catering",
    "Security",
    "Cleaning",
    // Add more as needed
];

const EditBookingsModal = ({
    open,
    onClose,
    booking,
    venueNames = [],
    onBookingUpdate,
}: {
    open: boolean;
    onClose: () => void;
    booking: any;
    venueNames?: string[];
    onBookingUpdate?: (updatedBooking: any) => void;
}) => {
    const { props } = usePage();
    const user = props.auth?.user || {};
    const userRoles = user.roles?.map((r: any) => r.name) || [];

    const [form, setForm] = useState<any>({});
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<string | null>(null);

    const venueDropdownRef = useRef<HTMLDivElement>(null);
    const servicesDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (booking) {
            const venues = Array.isArray(booking?.venue)
                ? booking?.venue
                : booking?.venue
                ? JSON.parse(booking.venue)
                : [];
            const requestedServices = Array.isArray(booking?.requested_services)
                ? booking?.requested_services
                : booking?.requested_services
                ? JSON.parse(booking.requested_services)
                : [];
            setForm({
                ...booking,
                venue: venues,
                requested_services: requestedServices,
                status: booking.status,
            });
            setPreviewFile(null);
        }
    }, [booking, open]);

    // Dropdown close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                venueDropdownRef.current &&
                !venueDropdownRef.current.contains(event.target as Node)
            ) {
                setVenueDropdownOpen(false);
            }
            if (
                servicesDropdownRef.current &&
                !servicesDropdownRef.current.contains(event.target as Node)
            ) {
                setServicesDropdownOpen(false);
            }
        }
        if (venueDropdownOpen || servicesDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [venueDropdownOpen, servicesDropdownOpen]);

    // Checkbox handler for venues
    const handleVenueCheckbox = (venue: string) => {
        setForm((prev: any) => {
            const selected = prev.venue.includes(venue)
                ? prev.venue.filter((v: string) => v !== venue)
                : [...prev.venue, venue];
            return { ...prev, venue: selected };
        });
    };

    // Checkbox handler for services
    const handleServiceCheckbox = (service: string) => {
        setForm((prev: any) => {
            const selected = prev.requested_services.includes(service)
                ? prev.requested_services.filter((s: string) => s !== service)
                : [...prev.requested_services, service];
            return { ...prev, requested_services: selected };
        });
    };

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, files } = e.target as any;
        if (type === "file") {
            setForm({ ...form, [name]: files[0] });
            if (files && files[0]) {
                const file = files[0];
                if (file.type.startsWith("image/")) {
                    setPreviewFile(URL.createObjectURL(file));
                } else if (file.type === "application/pdf") {
                    setPreviewFile(URL.createObjectURL(file));
                } else {
                    setPreviewFile(null);
                }
            } else {
                setPreviewFile(null);
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        onClose();

        if (!window.confirm("Are you sure you want to save these changes?")) {
            return;
        }

        // Only send changed fields
        const changedFields: any = {};
        Object.keys(form).forEach((key) => {
            const original =
                Array.isArray(form[key]) && Array.isArray(booking[key])
                    ? JSON.stringify(booking[key])
                    : booking[key];
            const current = Array.isArray(form[key])
                ? JSON.stringify(form[key])
                : form[key];
            if (current !== original && form[key] !== undefined) {
                changedFields[key] = form[key];
            }
        });

        router.put(`/event-services/${booking.id}`, changedFields, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => setFormErrors(errors),
            onSuccess: () => {
                fetch(`/event-services/${booking.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (onBookingUpdate) onBookingUpdate(data);
                    });
                onClose();
            },
        });
    };

    if (!booking) return null;

    // Helper to render proof preview
    const renderProofPreview = () => {
        const file = form.proof_of_approval;
        const existing = booking.proof_of_approval;
        if (previewFile && file) {
            if (file.type && file.type.startsWith("image/")) {
                return (
                    <img
                        src={previewFile}
                        alt="Proof Preview"
                        className="mt-2 max-h-40 rounded border"
                    />
                );
            } else if (file.type === "application/pdf") {
                return (
                    <iframe
                        src={previewFile}
                        title="PDF Preview"
                        className="mt-2 w-full h-40 border rounded"
                    />
                );
            }
        } else if (existing) {
            const ext = existing.split(".").pop().toLowerCase();
            if (["jpg", "jpeg", "png"].includes(ext)) {
                return (
                    <img
                        src={`/storage/${existing}`}
                        alt="Proof"
                        className="mt-2 max-h-40 rounded border"
                    />
                );
            } else if (ext === "pdf") {
                return (
                    <iframe
                        src={`/storage/${existing}`}
                        title="PDF Proof"
                        className="mt-2 w-full h-40 border rounded"
                    />
                );
            }
        }
        return null;
    };

    // Only super_admin and communications_officer can edit status
    const canEditStatus =
        userRoles.includes("super_admin") ||
        userRoles.includes("communications_officer");

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full p-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold px-6 pt-6 pb-2 text-center">
                        Edit Booking
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSave}
                    className="space-y-4 px-6 pb-6 pt-2"
                    autoComplete="off"
                >
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {/* Proof of Approval at the top (not sticky) */}
                        {/* <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">
                                Proof of Approval (JPG, PNG, PDF, max 10MB)
                            </label>
                            <Input
                                type="file"
                                name="proof_of_approval"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFormChange}
                                className="text-sm"
                            />
                            {renderProofPreview()}
                            {formErrors.proof_of_approval && (
                                <span className="text-red-500 text-xs mt-1">
                                    {formErrors.proof_of_approval}
                                </span>
                            )}
                        </div> */}
                        {/* Requested Venue Dropdown */}
                        <div
                            className="flex flex-col relative w-full mt-5"
                            ref={venueDropdownRef}
                        >
                            <label className="mb-1 font-medium text-sm">
                                Requested Venue
                            </label>
                            <button
                                type="button"
                                className="border rounded-md px-3 py-2 text-sm text-left bg-white"
                                onClick={() => setVenueDropdownOpen((v) => !v)}
                            >
                                {form.venue && form.venue.length
                                    ? form.venue.join(", ")
                                    : "Select venue(s)"}
                            </button>
                            {venueDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                                    {venueNames.map((venue) => (
                                        <label
                                            key={venue}
                                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.venue.includes(
                                                    venue
                                                )}
                                                onChange={() =>
                                                    handleVenueCheckbox(venue)
                                                }
                                                className="mr-2"
                                            />
                                            {venue}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {formErrors.venue && (
                                <span className="text-red-500 text-xs mt-1">
                                    {formErrors.venue}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Event Name
                                </label>
                                <Input
                                    name="name"
                                    value={form.name || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                    placeholder="Enter event name"
                                />
                                {formErrors.name && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.name}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Department
                                </label>
                                <Input
                                    name="department"
                                    value={form.department || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                    placeholder="Enter department"
                                />
                                {formErrors.department && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.department}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col mt-5">
                            <label className="mb-1 font-medium text-sm">
                                Description
                            </label>
                            <Input
                                name="description"
                                value={form.description || ""}
                                onChange={handleFormChange}
                                className="text-sm h-32"
                                placeholder="Enter purpose"
                            />
                            {formErrors.description && (
                                <span className="text-red-500 text-xs mt-1">
                                    {formErrors.description}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Participants
                                </label>
                                <Input
                                    name="participants"
                                    value={form.participants || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                    placeholder="Enter participants"
                                />
                                {formErrors.participants && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.participants}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Number of Participants
                                </label>
                                <Input
                                    type="number"
                                    name="number_of_participants"
                                    min={1}
                                    max={9999}
                                    value={form.number_of_participants || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                    placeholder="1-9999"
                                />
                                {formErrors.number_of_participants && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.number_of_participants}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Event Start Date
                                </label>
                                <Input
                                    type="date"
                                    name="event_start_date"
                                    value={form.event_start_date || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                />
                                {formErrors.event_start_date && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.event_start_date}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Event End Date
                                </label>
                                <Input
                                    type="date"
                                    name="event_end_date"
                                    value={form.event_end_date || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                />
                                {formErrors.event_end_date && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.event_end_date}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Event Start Time
                                </label>
                                <Input
                                    type="time"
                                    name="event_start_time"
                                    value={form.event_start_time || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                />
                                {formErrors.event_start_time && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.event_start_time}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Event End Time
                                </label>
                                <Input
                                    type="time"
                                    name="event_end_time"
                                    value={form.event_end_time || ""}
                                    onChange={handleFormChange}
                                    className="text-sm"
                                />
                                {formErrors.event_end_time && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.event_end_time}
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Requested Services Dropdown */}
                        <div
                            className="flex flex-col relative w-full mt-5"
                            ref={servicesDropdownRef}
                        >
                            <label className="mb-1 font-medium text-sm">
                                Requested Services
                            </label>
                            <button
                                type="button"
                                className="border rounded-md px-3 py-2 text-sm text-left bg-white"
                                onClick={() =>
                                    setServicesDropdownOpen((v) => !v)
                                }
                            >
                                {form.requested_services &&
                                form.requested_services.length
                                    ? form.requested_services.join(", ")
                                    : "Select service(s)"}
                            </button>
                            {servicesDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                                    {serviceOptions.map((service) => (
                                        <label
                                            key={service}
                                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.requested_services.includes(
                                                    service
                                                )}
                                                onChange={() =>
                                                    handleServiceCheckbox(
                                                        service
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            {service}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {formErrors.requested_services && (
                                <span className="text-red-500 text-xs mt-1">
                                    {formErrors.requested_services}
                                </span>
                            )}
                        </div>
                        {/* Status field for super_admin and comms officer */}
                        {canEditStatus && (
                            <div className="flex flex-col mt-5">
                                <label className="mb-1 font-medium text-sm">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status || ""}
                                    onChange={handleFormChange}
                                    className="border rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="">Select status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                {formErrors.status && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.status}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="min-w-[100px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBookingsModal;
