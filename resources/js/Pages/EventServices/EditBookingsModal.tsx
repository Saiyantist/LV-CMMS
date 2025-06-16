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
import { galleryItems } from "./Stepper/Gallery";

// Service groups
const serviceGroups = [
    {
        label: "GENERAL ADMINISTRATIVE SERVICES",
        options: [
            "Maintainer Time",
            "Lighting",
            "Tables",
            "Bathroom Cleaning",
            "Chairs",
            "Aircon",
        ],
    },
    {
        label: "COMMUNICATIONS OFFICE",
        options: [
            "Speaker",
            "Microphone",
            "Audio Mixer",
            "Extension Cord",
            "Projector",
            "HDMI",
            "Photographer",
            "Event Poster",
            "Event Reel",
            "Event Documentation",
        ],
    },
    {
        label: "MANAGEMENT INFORMATION SYSTEMS",
        options: ["Internet"],
    },
    {
        label: "Security",
        options: ["Marshal", "LV DRRT"],
    },
];

// Date validation
const today = new Date();
const minStartDate = new Date(today);
minStartDate.setDate(today.getDate() + 3);
const minStartDateStr = minStartDate.toISOString().split("T")[0];

const MAX_EVENT_NAME = 100;
const MAX_DESCRIPTION = 250;

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

    const [form, setForm] = useState<any>({
        department: booking?.department || "",
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [showEventNameLimit, setShowEventNameLimit] = useState(false);
    const [showParticipantsLimit, setShowParticipantsLimit] = useState(false);
    const [showDescriptionLimit, setShowDescriptionLimit] = useState(false);

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

    // Only super_admin and communications_officer can edit status
    // const canEditStatus =
    //     userRoles.includes("super_admin") ||
    //     userRoles.includes("communications_officer");

    const departmentType = userRoles.includes("internal_requester")
        ? "internal"
        : "external";

    // Number of Participants validation
    const handleParticipantsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val === "") {
            setForm({ ...form, number_of_participants: "" });
            setShowParticipantsLimit(false);
            return;
        }
        let num = Number(val);
        if (num > dynamicMax) {
            setForm({ ...form, number_of_participants: dynamicMax.toString() });
            setShowParticipantsLimit(true);
        } else {
            setForm({ ...form, number_of_participants: val });
            setShowParticipantsLimit(false);
        }
    };

    // State for department selection
    const [deptInput, setDeptInput] = useState("");
    const [showDeptSuggestions, setShowDeptSuggestions] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
        booking?.department
            ? booking.department.split(",").map((d: string) => d.trim())
            : []
    );

    // Update selected departments in form
    useEffect(() => {
        setForm({ ...form, department: selectedDepartments.join(", ") });
        // eslint-disable-next-line
    }, [selectedDepartments]);

    // Handle checkbox
    const handleDeptCheckbox = (dept: string) => {
        setSelectedDepartments((prev) =>
            prev.includes(dept)
                ? prev.filter((d) => d !== dept)
                : [...prev, dept]
        );
    };

    // Handle custom input add
    const handleDeptAdd = () => {
        if (
            deptInput &&
            !selectedDepartments.includes(deptInput) &&
            !deptOptions.includes(deptInput)
        ) {
            setSelectedDepartments([...selectedDepartments, deptInput]);
            setDeptInput("");
            setShowDeptSuggestions(false);
        }
    };

    const [deptOptions, setDeptOptions] = useState<string[]>([]);

    useEffect(() => {
        fetch(`/departments/${departmentType}`)
            .then((res) => res.json())
            .then((data) => setDeptOptions(data))
            .catch(() => setDeptOptions([]));
    }, [departmentType]);

    const filteredDeptOptions = deptOptions.filter((opt) =>
        opt.toLowerCase().includes(deptInput.toLowerCase())
    );

    // Calculate total capacity from selected venues
    const selectedVenues = galleryItems.filter((item) =>
        form.venue?.includes(item.title)
    );

    const totalCapacity = selectedVenues.reduce((sum, venue) => {
        const match = venue.subtitle.match(/(\d+)/);
        return sum + (match ? parseInt(match[1], 10) : 0);
    }, 0);

    const dynamicMax = totalCapacity > 0 ? totalCapacity : 9999; // fallback to 9999 if no venue selected

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            {/* Event Name */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Event Name
                                </label>
                                <Input
                                    name="name"
                                    value={form.name || ""}
                                    maxLength={MAX_EVENT_NAME}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (val.length > MAX_EVENT_NAME) {
                                            val = val.slice(0, MAX_EVENT_NAME);
                                            setShowEventNameLimit(true);
                                        } else {
                                            setShowEventNameLimit(false);
                                        }
                                        setForm({ ...form, name: val });
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            (form.name?.length || 0) ===
                                                MAX_EVENT_NAME &&
                                            e.key.length === 1 &&
                                            !e.ctrlKey &&
                                            !e.metaKey &&
                                            !e.altKey
                                        ) {
                                            setShowEventNameLimit(true);
                                            setTimeout(
                                                () =>
                                                    setShowEventNameLimit(
                                                        false
                                                    ),
                                                2000
                                            );
                                        }
                                    }}
                                    className="text-sm"
                                    placeholder="Enter event name"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">
                                        {form.name?.length || 0}/
                                        {MAX_EVENT_NAME}
                                    </span>
                                    <span
                                        className={`text-xs text-red-500 font-medium transition-opacity duration-300 ${
                                            showEventNameLimit
                                                ? "opacity-100"
                                                : "opacity-0 pointer-events-none select-none"
                                        }`}
                                    >
                                        Max {MAX_EVENT_NAME} characters.
                                    </span>
                                </div>
                                {formErrors.name && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.name}
                                    </span>
                                )}
                            </div>
                            {/* Department */}
                            <div className="flex flex-col relative ">
                                <label className="mb-1 font-medium text-sm">
                                    Department
                                </label>

                                <button
                                    type="button"
                                    className="border rounded-md px-3 py-2 text-sm text-left bg-white"
                                    onClick={() =>
                                        setShowDeptSuggestions((v) => !v)
                                    }
                                >
                                    {selectedDepartments.length ? (
                                        selectedDepartments.join(", ")
                                    ) : (
                                        <span className="text-gray-400">
                                            Select department(s)
                                        </span>
                                    )}
                                </button>
                                {showDeptSuggestions && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto mt-20">
                                        {deptOptions.map((dept) => (
                                            <label
                                                key={dept}
                                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDepartments.includes(
                                                        dept
                                                    )}
                                                    onChange={() =>
                                                        handleDeptCheckbox(dept)
                                                    }
                                                    className="mr-2"
                                                />
                                                {dept}
                                            </label>
                                        ))}
                                        {/* Custom input for new department */}
                                        <div className="flex items-center px-3 py-2 border-t">
                                            <Input
                                                value={deptInput}
                                                onChange={(e) =>
                                                    setDeptInput(e.target.value)
                                                }
                                                className="text-sm flex-1"
                                                placeholder="Add department"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleDeptAdd();
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="ml-2"
                                                onClick={handleDeptAdd}
                                                disabled={!deptInput.trim()}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">
                                        {selectedDepartments.join(", ").length}
                                        /100
                                    </span>
                                </div>
                                {formErrors.department && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.department}
                                    </span>
                                )}
                                {/* Display current value */}
                                <div className="mb-1 text-xs text-blue-700 font-semibold">
                                    Current:{" "}
                                    {booking?.department ? (
                                        booking.department
                                    ) : (
                                        <span className="text-gray-400">
                                            No department selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col mt-5">
                            <label className="mb-1 font-medium text-sm">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description || ""}
                                maxLength={MAX_DESCRIPTION}
                                onChange={(e) => {
                                    let val = e.target.value;
                                    if (val.length > MAX_DESCRIPTION) {
                                        val = val.slice(0, MAX_DESCRIPTION);
                                        setShowDescriptionLimit(true);
                                    } else {
                                        setShowDescriptionLimit(false);
                                    }
                                    setForm({ ...form, description: val });
                                }}
                                onKeyDown={(e) => {
                                    if (
                                        (form.description?.length || 0) ===
                                            MAX_DESCRIPTION &&
                                        e.key.length === 1 &&
                                        !e.ctrlKey &&
                                        !e.metaKey &&
                                        !e.altKey
                                    ) {
                                        setShowDescriptionLimit(true);
                                        setTimeout(
                                            () =>
                                                setShowDescriptionLimit(false),
                                            2000
                                        );
                                    }
                                }}
                                className="text-sm h-32 rounded border border-gray-300 px-3 py-2"
                                placeholder="Enter purpose"
                            />
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">
                                    {form.description?.length || 0}/
                                    {MAX_DESCRIPTION}
                                </span>
                                <span
                                    className={`text-xs text-red-500 font-medium transition-opacity duration-300 ${
                                        showDescriptionLimit
                                            ? "opacity-100"
                                            : "opacity-0 pointer-events-none select-none"
                                    }`}
                                >
                                    Max {MAX_DESCRIPTION} characters.
                                </span>
                            </div>
                            {formErrors.description && (
                                <span className="text-red-500 text-xs mt-1">
                                    {formErrors.description}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            {/* Participants */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    Participants
                                </label>
                                <Input
                                    name="participants"
                                    value={form.participants || ""}
                                    maxLength={100}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (val.length > 100) {
                                            val = val.slice(0, 100);
                                            setShowParticipantsLimit(true);
                                        } else {
                                            setShowParticipantsLimit(false);
                                        }
                                        setForm({ ...form, participants: val });
                                    }}
                                    className="text-sm"
                                    placeholder="Enter participants"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">
                                        {form.participants?.length || 0}/100
                                    </span>
                                    {/* <span
                                        className={`text-xs text-red-500 font-medium transition-opacity duration-300 ${
                                            showParticipantsLimit
                                                ? "opacity-100"
                                                : "opacity-0 pointer-events-none select-none"
                                        }`}
                                    >
                                        Max 100 characters.
                                    </span> */}
                                </div>
                                {formErrors.participants && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.participants}
                                    </span>
                                )}
                            </div>
                            {/* Number of Participants */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-medium text-sm">
                                    No. of Participants
                                </label>
                                <Input
                                    type="number"
                                    name="number_of_participants"
                                    min={1}
                                    max={dynamicMax}
                                    value={form.number_of_participants || ""}
                                    onChange={handleParticipantsChange}
                                    className="text-sm"
                                    placeholder={`1-${dynamicMax}`}
                                    disabled={dynamicMax === 0}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {/* <span className="text-xs text-gray-500">
                                        {form.number_of_participants?.length ||
                                            0}
                                        /{dynamicMax}
                                    </span> */}
                                    <span
                                        className={`text-xs text-red-500 font-medium transition-opacity duration-300 ${
                                            showParticipantsLimit
                                                ? "opacity-100"
                                                : "opacity-0 pointer-events-none select-none"
                                        }`}
                                    >
                                        {dynamicMax === 0
                                            ? "Select at least one venue to enable"
                                            : `The number of participants must not exceed the venue(s) capacity (${dynamicMax}).`}
                                    </span>
                                </div>
                                {formErrors.number_of_participants && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {formErrors.number_of_participants}
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
                                form.requested_services.length ? (
                                    form.requested_services.join(", ")
                                ) : (
                                    <span className="text-gray-400">
                                        Select service(s)
                                    </span>
                                )}
                            </button>
                            {servicesDropdownOpen && (
                                <div className="absolute z-10 mt-20 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                                    {serviceGroups.map((group) => (
                                        <div key={group.label}>
                                            <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                                                {group.label}
                                            </div>
                                            {group.options.map((service) => (
                                                <label
                                                    key={service}
                                                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={form.requested_services?.includes(
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

                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto sm:min-w-[120px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto sm:min-w-[120px] bg-secondary hover:bg-primary text-white"
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
