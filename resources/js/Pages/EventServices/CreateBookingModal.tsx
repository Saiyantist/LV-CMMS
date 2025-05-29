import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
} from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { Input } from "@/Components/shadcnui/input";
import { router } from "@inertiajs/react";

interface Props {
    open: boolean;
    onClose: () => void;
    venueNames: string[];
}

const serviceOptions = [
    "Sound System",
    "Projector",
    "Catering",
    "Security",
    "Cleaning",
    // Add more as needed
];

const CreateBookingModal: React.FC<Props> = ({ open, onClose, venueNames }) => {
    const [form, setForm] = useState<any>({
        name: "",
        venue: [],
        department: "",
        description: "",
        participants: "",
        number_of_participants: "",
        event_start_date: "",
        event_end_date: "",
        event_start_time: "",
        event_end_time: "",
        requested_services: [],
        proof_of_approval: null,
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

    // Refs for dropdowns
    const venueDropdownRef = useRef<HTMLDivElement>(null);
    const servicesDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
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
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v, i) => {
                    if (
                        v !== undefined &&
                        v !== null &&
                        typeof v !== "object"
                    ) {
                        data.append(`${key}[${i}]`, v);
                    }
                });
            } else if (
                value !== null &&
                value !== undefined &&
                (typeof value === "string" || value instanceof Blob)
            ) {
                data.append(key, value);
            }
        });
        router.post("/event-services", data, {
            forceFormData: true,
            onError: (errors) => setFormErrors(errors),
            onSuccess: () => {
                setForm({
                    name: "",
                    venue: [],
                    department: "",
                    description: "",
                    participants: "",
                    number_of_participants: "",
                    event_start_date: "",
                    event_end_date: "",
                    event_start_time: "",
                    event_end_time: "",
                    requested_services: [],
                    proof_of_approval: null,
                });
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full p-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold px-6 pt-6 pb-2 text-center">
                        Create Booking
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleFormSubmit}
                    className="space-y-4 px-6 pb-6 pt-2"
                    autoComplete="off"
                >
                    {/* Scrollable content */}
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {/* Proof of Approval at the top (not sticky) */}
                        <div className="flex flex-col">
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
                            {formErrors.proof_of_approval && (
                                <span className="text-red-500 text-xs mt-1">
                                    {formErrors.proof_of_approval}
                                </span>
                            )}
                        </div>

                        {/* Requested Venue Dropdown */}
                        <div
                            className="flex flex-col relative w-full mt-5"
                            ref={venueDropdownRef}
                        >
                            <label className="mb-1 font-medium text-sm">
                                Requested Venue{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                className="border rounded-md px-3 py-2 text-sm text-left bg-white"
                                onClick={() => setVenueDropdownOpen((v) => !v)}
                            >
                                {form.venue.length
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
                                    Event Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    required
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
                                    value={form.department}
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
                                value={form.description}
                                onChange={handleFormChange}
                                className="text-sm h-32" // Increased height here
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
                                    value={form.participants}
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
                                    value={form.number_of_participants}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                            value === "" ||
                                            (/^\d{1,4}$/.test(value) &&
                                                parseInt(value) <= 9999)
                                        ) {
                                            handleFormChange(e);
                                        }
                                    }}
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
                                    Event Start Date{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    name="event_start_date"
                                    value={form.event_start_date}
                                    onChange={handleFormChange}
                                    required
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
                                    Event End Date{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    name="event_end_date"
                                    value={form.event_end_date}
                                    onChange={handleFormChange}
                                    required
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
                                    Event Start Time{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="time"
                                    name="event_start_time"
                                    value={form.event_start_time}
                                    onChange={handleFormChange}
                                    required
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
                                    Event End Time{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="time"
                                    name="event_end_time"
                                    value={form.event_end_time}
                                    onChange={handleFormChange}
                                    required
                                    className="text-sm"
                                />
                                {formErrors.event_end_time && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.event_end_time}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full mt-5">
                            {/* Requested Services Dropdown */}
                            <div
                                className="flex flex-col relative w-full"
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
                                    {form.requested_services.length
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
                        </div>
                        
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
                            Submit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateBookingModal;
