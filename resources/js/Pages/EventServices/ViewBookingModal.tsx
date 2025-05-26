import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogHeader,
} from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";

interface Booking {
    id: number | string;
    date: string;
    venue: string;
    name: string;
    eventDate: string;
    time: string;
    status: string;
    [key: string]: any;
}

interface Props {
    open: boolean;
    onClose: () => void;
    booking: Booking | null;
    venueNames?: string[];
}

const statusOptions = [
    "Pending",
    "Completed",
    "In Progress",
    "Cancelled",
    "Not Started",
];

const ViewBookingModal: React.FC<Props> = ({
    open,
    onClose,
    booking,
    venueNames = [],
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: booking?.name || "",
        venue: booking?.venue || "",
        event_date: booking?.eventDate || "",
        time: booking?.time || "",
        status: booking?.status || "Pending",
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Sync form when booking changes
    React.useEffect(() => {
        if (booking) {
            setForm({
                name: booking.name || "",
                venue: booking.venue || "",
                event_date: booking.eventDate || "",
                time: booking.time || "",
                status: booking.status || "Pending",
            });
        }
    }, [booking]);

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => setIsEditing(true);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        if (booking) {
            router.put(`/event-services/${booking.id}`, form, {
                onError: (errors) => setFormErrors(errors),
                onSuccess: () => {
                    setIsEditing(false);
                    onClose();
                },
            });
        }
    };

    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <ArrowLeft
                            className="cursor-pointer"
                            onClick={onClose}
                        />
                        {isEditing ? "Edit Booking" : booking.name}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-2 mt-4">
                    <div>
                        <strong>ID:</strong> {booking.id}
                    </div>
                    <div>
                        <strong>Date Requested:</strong> {booking.date}
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-2">
                            <div>
                                <label className="block mb-1 font-medium">
                                    Requested Venue
                                </label>
                                <select
                                    name="venue"
                                    value={form.venue}
                                    onChange={handleFormChange}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                >
                                    <option value="">Select Venue</option>
                                    {(venueNames.length
                                        ? venueNames
                                        : [
                                              "Auditorium",
                                              "Auditorium Lobby",
                                              "College Library",
                                              "Meeting Room",
                                              "Training Room A",
                                              "Computer Laboratory A",
                                              "Computer Laboratory B",
                                              "EFS Classroom(s) Room #:",
                                              "LVCC Grounds",
                                              "LVCC  Main Lobby",
                                              "Elementary & High School Library",
                                              "Basketball Court",
                                          ]
                                    ).map((venue) => (
                                        <option key={venue} value={venue}>
                                            {venue}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.venue && (
                                    <div className="text-red-500 text-sm">
                                        {formErrors.venue}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Event Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                {formErrors.name && (
                                    <div className="text-red-500 text-sm">
                                        {formErrors.name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Event Date
                                </label>
                                <input
                                    type="date"
                                    name="event_date"
                                    value={form.event_date}
                                    onChange={handleFormChange}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                {formErrors.event_date && (
                                    <div className="text-red-500 text-sm">
                                        {formErrors.event_date}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Event Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={form.time}
                                    onChange={handleFormChange}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                {formErrors.time && (
                                    <div className="text-red-500 text-sm">
                                        {formErrors.time}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleFormChange}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.status && (
                                    <div className="text-red-500 text-sm">
                                        {formErrors.status}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-6 space-x-2">
                                <Button
                                    type="submit"
                                    className="bg-blue-600 text-white"
                                >
                                    Save
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div>
                                <strong>Requested Venue:</strong>{" "}
                                {booking.venue}
                            </div>
                            <div>
                                <strong>Event Name:</strong> {booking.name}
                            </div>
                            <div>
                                <strong>Event Date:</strong> {booking.eventDate}
                            </div>
                            <div>
                                <strong>Event Time:</strong> {booking.time}
                            </div>
                            <div>
                                <strong>Status:</strong> {booking.status}
                            </div>
                            <div className="flex justify-end mt-6 space-x-2">
                                <Button
                                    onClick={handleEdit}
                                    className="text-white bg-secondary hover:bg-primary"
                                >
                                    Edit
                                </Button>
                                <Button onClick={onClose} variant="outline">
                                    Close
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewBookingModal;
