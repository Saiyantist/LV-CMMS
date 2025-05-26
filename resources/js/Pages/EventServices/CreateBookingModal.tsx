import React, { useState } from "react";
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

const CreateBookingModal: React.FC<Props> = ({ open, onClose, venueNames }) => {
    const [form, setForm] = useState({
        name: "",
        venue: "",
        event_date: "",
        time: "",
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        router.post("/event-services", form, {
            onError: (errors) => setFormErrors(errors),
            onSuccess: () => {
                setForm({ name: "", venue: "", event_date: "", time: "" });
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold mb-4">
                        Create Booking
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">
                            Event Name
                        </label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
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
                            {venueNames.map((venue) => (
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
                            Event Date
                        </label>
                        <Input
                            type="date"
                            name="event_date"
                            value={form.event_date}
                            onChange={handleFormChange}
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
                        <Input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleFormChange}
                            required
                        />
                        {formErrors.time && (
                            <div className="text-red-500 text-sm">
                                {formErrors.time}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
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
