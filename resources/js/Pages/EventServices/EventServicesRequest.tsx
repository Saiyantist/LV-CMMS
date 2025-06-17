import type React from "react";
import { useState, useEffect } from "react";
import { Upload, X, FileText, Check } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Gallery, { galleryItems } from "./Stepper/Gallery"; // <-- Add this import
import EventDetails from "./Stepper/EventDetails";
import RequestedServices from "./Stepper/RequestedServices";
import ComplianceAndConsent from "./Stepper/Compliance&Consent";
import EventSummaryModal from "./Stepper/EventSummaryModal";
import { Head, usePage, router } from "@inertiajs/react";

const STORAGE_KEY = "eventServicesStepperState";

function saveStepperState(state: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadStepperState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function clearStepperState() {
    localStorage.removeItem(STORAGE_KEY);
}

function parseDateRange(dateRange: string): { start: string; end: string } {
    if (!dateRange) return { start: "", end: "" };
    const match = dateRange.match(
        /^([A-Za-z]+) (\d{1,2}) - ([A-Za-z]+) (\d{1,2}), (\d{4})$/
    );
    if (!match) return { start: "", end: "" };
    const months = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
    } as Record<string, string>;
    const [, startMonth, startDay, endMonth, endDay, year] = match;
    const start = `${year}-${months[startMonth]}-${startDay.padStart(2, "0")}`;
    const end = `${year}-${months[endMonth]}-${endDay.padStart(2, "0")}`;
    return { start, end };
}

function parseTimeRange(timeRange: string): { start: string; end: string } {
    // Example: "08:00 AM - 10:00 AM"
    // Should return { start: "08:00", end: "10:00" }
    if (!timeRange) return { start: "", end: "" };
    const match = timeRange.match(
        /^(\d{2}:\d{2} [AP]M) - (\d{2}:\d{2} [AP]M)$/
    );
    if (!match) return { start: "", end: "" };
    const [start, end] = [match[1], match[2]].map((t) => {
        let [time, meridian] = t.split(" ");
        let [hour, minute] = time.split(":").map(Number);
        if (meridian === "PM" && hour !== 12) hour += 12;
        if (meridian === "AM" && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
    });
    return { start, end };
}

function formatTime24to12(time: string) {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    return date
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        .replace(/^0/, "");
}

function formatDateYMDToLong(date: string) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function EventServicesRequest() {
    // Step state
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [conflictModal, setConflictModal] = useState<{
        open: boolean;
        message: string;
        conflicts?: any[];
    }>({
        open: false,
        message: "",
        conflicts: [],
    });

    // Step 1: File
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Step 2: Venue
    const [selectedGalleryItem, setSelectedGalleryItem] = useState<
        number[] | null
    >(null);

    // Step 3   : Event Details
    const [eventDetails, setEventDetails] = useState<{
        eventName: string;
        department: string[]; // <-- Change to array
        eventPurpose: string;
        participants: string;
        participantCount: string;
    }>({
        eventName: "",
        department: [], // <-- Initialize as empty array
        eventPurpose: "",
        participants: "",
        participantCount: "",
    });

    //  Date & Time
    const [dateRange, setDateRange] = useState<string>("");
    const [timeRange, setTimeRange] = useState<string>("");

    // Step 4: Requested Services
    const [requestedServices, setRequestedServices] = useState<
        Record<string, string[]>
    >({});

    // Compliance & Consent Modal
    const [dataPrivacyAgreed, setDataPrivacyAgreed] = useState(false);
    const [equipmentPolicyAgreed, setEquipmentPolicyAgreed] = useState(false);
    const [consentChoice, setConsentChoice] = useState("");

    const steps = [
        { id: 1, name: "Proof of Approval" },
        { id: 2, name: "Requested Venue" },
        { id: 3, name: "Event Details" },
        { id: 4, name: "Requested Services" },
        { id: 5, name: "Summary" }, // Step 5 is now the summary page
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            setFilePreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFile(file);
            setFilePreview(URL.createObjectURL(file));
        }
    };

    const removeFile = () => {
        setFile(null);
        setFilePreview(null);
    };

    // Validation and step logic
    const handleContinue = async () => {
        setError(null);
        if (currentStep === 1) {
            if (!file) {
                setError("Please upload a file before continuing.");
                return;
            }
            setCurrentStep(2);
            return;
        }
        if (currentStep === 2) {
            setCurrentStep(3);
            return;
        }
        if (currentStep === 3) {
            const venueRequired =
                selectedGalleryItem && selectedGalleryItem.length > 0;
            if (
                !eventDetails.eventName ||
                !eventDetails.department.length ||
                !eventDetails.eventPurpose ||
                !eventDetails.participants ||
                (venueRequired && !eventDetails.participantCount) ||
                !dateRange ||
                !timeRange
            ) {
                setError(
                    "Please fill out all event details and select date & time."
                );
                return;
            }

            // Parse date and time
            const { start: event_start_date, end: event_end_date } =
                parseDateRange(dateRange);
            const { start: event_start_time, end: event_end_time } =
                parseTimeRange(timeRange);

            // Get selected venue names
            const selectedVenueNames =
                selectedGalleryItem && selectedGalleryItem.length > 0
                    ? galleryItems
                          .filter((item) =>
                              selectedGalleryItem.includes(item.id)
                          )
                          .map((item) => item.title)
                    : [];

            // If no venue selected, allow to proceed
            if (!selectedVenueNames.length) {
                setCurrentStep(4);
                return;
            }

            // --- Double booking check ---
            try {
                const token = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content");
                const res = await fetch("/event-services/check-conflict", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": token || "",
                    },
                    body: JSON.stringify({
                        venues: selectedVenueNames,
                        startDate: event_start_date,
                        endDate: event_end_date,
                        startTime: event_start_time,
                        endTime: event_end_time,
                    }),
                });
                if (!res.ok) throw new Error("Network error");
                const data = await res.json();

                if (data.conflict) {
                    setConflictModal({
                        open: true,
                        conflicts: data.conflicts, // pass the array, not a string
                        message: "", // not used for details anymore
                    });
                    return;
                }

                // No conflict, proceed
                setCurrentStep(4);
            } catch (err) {
                setError("Let's sync things up – please refresh the page.");
            }
            return;
        }
        if (currentStep === 4) {
            setCurrentStep(5);
            return;
        }
        if (currentStep === 5) {
            setShowConsentModal(true);
            return;
        }
    };

    const handleBack = () => {
        // window.scrollTo({ top: 0, behavior: "smooth" });
        setError(null);
        if (showSummary) {
            setShowSummary(false);
            setShowSuccess(false);
            return;
        }
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleBookingSubmit = () => {
        setError(null);
        if (!file) {
            setError(
                "File is required. Please re-upload your proof of approval."
            );
            return;
        }
        if (
            !dataPrivacyAgreed ||
            !equipmentPolicyAgreed ||
            consentChoice !== "agree"
        ) {
            setError("You must agree to all terms and consent to proceed.");
            return;
        }

        // Parse date and time
        const { start: event_start_date, end: event_end_date } =
            parseDateRange(dateRange);
        const { start: event_start_time, end: event_end_time } =
            parseTimeRange(timeRange);

        // Map selected venue IDs to names
        const selectedVenueNames =
            selectedGalleryItem && selectedGalleryItem.length > 0
                ? galleryItems
                      .filter((item) => selectedGalleryItem.includes(item.id))
                      .map((item) => item.title)
                : [];

        // Flatten requested services
        const requestedServicesFlat = Object.values(requestedServices).flat();

        // Build FormData
        const formData = new FormData();
        if (file) {
            formData.append("proof_of_approval", file);
        }

        // Venue (array of names)
        selectedVenueNames.forEach((venue, i) => {
            formData.append(`venue[${i}]`, venue);
        });

        // Event Details
        formData.append("name", eventDetails.eventName);
        formData.append("department", eventDetails.department.join(", ")); // or just eventDetails.department[0]
        formData.append("description", eventDetails.eventPurpose);
        formData.append("participants", eventDetails.participants);
        formData.append(
            "number_of_participants",
            eventDetails.participantCount
        );

        // Date & Time (now in correct format)
        formData.append("event_start_date", event_start_date);
        formData.append("event_end_date", event_end_date);
        formData.append("event_start_time", event_start_time);
        formData.append("event_end_time", event_end_time);

        // Requested Services (flat array)
        requestedServicesFlat.forEach((service, i) => {
            formData.append(`requested_services[${i}]`, service);
        });

        router.post("/event-services", formData, {
            forceFormData: true,
            onError: (errors) =>
                setError("Submission failed. Please check your inputs."),
            onSuccess: () => {
                setShowConsentModal(false);
                setShowSuccess(true);
                clearStepperState(); // <-- Add this line
            },
        });
    };

    // Get user from Inertia page props
    const user = usePage().props.auth.user;

    // Use a Set for easy role checking (like in Dashboard)
    const roleNames = new Set(
        user.roles?.map((role: { name: string }) => role.name)
    );

    // Determine userType based on roles
    const userType = roleNames.has("external_requester")
        ? "external_requester"
        : "internal_requester";

    // Map selected IDs to names
    const selectedVenueNames =
        selectedGalleryItem && selectedGalleryItem.length > 0
            ? galleryItems
                  .filter((item) => selectedGalleryItem.includes(item.id))
                  .map((item) => item.title)
            : [];

    // Flatten requested services for easier display
    const requestedServicesFlat = Object.values(requestedServices).flat();

    // Load state on mount
    useEffect(() => {
        const saved = loadStepperState();
        if (saved) {
            setCurrentStep(saved.currentStep || 1);
            setFile(null);
            setSelectedGalleryItem(saved.selectedGalleryItem || null);
            setEventDetails(
                saved.eventDetails || {
                    eventName: "",
                    department: [],
                    eventPurpose: "",
                    participants: "",
                    participantCount: "",
                }
            );
            setDateRange(saved.dateRange || "");
            setTimeRange(saved.timeRange || "");
            setRequestedServices(saved.requestedServices || {});
        }
    }, []);

    useEffect(() => {
        saveStepperState({
            currentStep,
            file,
            selectedGalleryItem,
            eventDetails,
            dateRange,
            timeRange,
            requestedServices,
        });
    }, [
        currentStep,
        file,
        selectedGalleryItem,
        eventDetails,
        dateRange,
        timeRange,
        requestedServices,
    ]);

    function handleCancelBooking() {
        clearStepperState();
        setCurrentStep(1);
        setFile(null);
        setSelectedGalleryItem(null);
        setEventDetails({
            eventName: "",
            department: [],
            eventPurpose: "",
            participants: "",
            participantCount: "",
        });
        setDateRange("");
        setTimeRange("");
        setRequestedServices({});
        setDataPrivacyAgreed(false);
        setEquipmentPolicyAgreed(false);
        setConsentChoice("");
        setError(null);
        setShowSummary(false);
        setShowSuccess(false);
        setShowConsentModal(false);
    }

    // Warn on page unload if file is uploaded or step is in progress
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Only warn if file is uploaded or any step is in progress
            if (file || currentStep > 1) {
                const message =
                    "Are you sure you want to reload or leave this page? Any unsaved progress will be lost, and you may need to re-upload your proof of approval file.";
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [file, currentStep]);

    return (
        <AuthenticatedLayout>
            <Head title="Event Services" />
            <div className="w-[99%] mx-auto p-4 md:p-6 bg-white min-h-screen">
                {/* Progress Steps */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Event Services</h1>
                    <p className="text-gray-700 text-lg font-medium">
                        Book meeting rooms, event spaces, and equipment for your
                        next event.
                    </p>
                    <p className="text-gray-400 text-m font-medium">
                        NOTE: Please accomplish this form at least three (3)
                        working days before the date of use.
                    </p>
                    <br />
                </div>
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className="flex-1 flex flex-col items-center"
                            >
                                <div className="relative flex items-center w-full justify-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                        currentStep === step.id && !showSuccess
                            ? "bg-secondary text-white"
                            : currentStep > step.id ||
                              (step.id === 5 && showSuccess)
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-400 border border-gray-300"
                    }`}
                                    >
                                        {currentStep > step.id ||
                                        (step.id === 5 && showSuccess) ? (
                                            <Check size={16} />
                                        ) : (
                                            step.id
                                        )}
                                    </div>
                                </div>
                                <span
                                    className={`text-xs mt-2 text-center w-full ${
                                        currentStep === step.id && !showSuccess
                                            ? "text-blue-600 font-semibold"
                                            : ""
                                    }`}
                                >
                                    {step.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Step 1: Proof of Approval */}
                {currentStep === 1 && (
                    <div className="border-t border-gray-200 pt-8">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-medium text-center mb-6">
                                Proof of Approval{" "}
                                <span className="text-red-500">*</span>
                            </h2>
                            <p className="text-center text-gray-600 mb-8">
                                Please upload the request letter signed by the
                                Administrator or the Department Head.
                            </p>
                            {!file ? (
                                <div
                                    className={`border-2 border-dashed rounded-md p-10 flex flex-col items-center justify-center cursor-pointer ${
                                        isDragging
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300"
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        document
                                            .getElementById("file-upload")
                                            ?.click()
                                    }
                                >
                                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-gray-700 font-medium mb-1">
                                        Select a file or drag and drop here
                                    </p>
                                    <p className="text-gray-500 text-sm mb-4">
                                        JPG, PNG or PDF, file size no more than
                                        5MB
                                    </p>
                                    <button>SELECT FILE</button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <div className="border rounded-md p-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FileText className="h-6 w-6 text-gray-500 mr-3" />
                                            <div>
                                                <p
                                                    className="font-medium max-w-[180px] truncate"
                                                    title={file.name}
                                                >
                                                    {(() => {
                                                        const parts =
                                                            file.name.split(
                                                                "."
                                                            );
                                                        if (parts.length === 1)
                                                            return file.name;
                                                        const ext = parts.pop();
                                                        const base =
                                                            parts.join(".");
                                                        return base.length > 18
                                                            ? `${base.slice(
                                                                  0,
                                                                  18
                                                              )}... .${ext}`
                                                            : `${base}.${ext}`;
                                                    })()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {Math.round(
                                                        file.size / 1024
                                                    )}
                                                    kb
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* <div className="text-gray-500 text-sm mt-4">
                                <p>
                                    Kindly use this naming format:
                                    EventDate_EventName
                                </p>
                                <p className="text-gray-400">
                                    Example: 112424_EnglishMonth
                                </p>
                            </div> */}
                        </div>
                    </div>
                )}
                {/* Step 2: Gallery */}
                {currentStep === 2 && (
                    <Gallery
                        selectedId={selectedGalleryItem}
                        onSelect={(id: number[] | null) => {
                            setSelectedGalleryItem(id);
                            setError(null);
                        }}
                    />
                )}
                {/* Step 3: Event Details */}
                {currentStep === 3 && (
                    <EventDetails
                        value={eventDetails}
                        onChange={setEventDetails}
                        dateTimeValue={{ dateRange, timeRange }}
                        onDateTimeChange={({ dateRange, timeRange }) => {
                            setDateRange(dateRange);
                            setTimeRange(timeRange);
                        }}
                        userType={userType}
                        selectedVenueIds={selectedGalleryItem || []}
                    />
                )}
                {/* Step 4: Requested Services */}
                {currentStep === 4 && (
                    <RequestedServices
                        value={requestedServices}
                        onChange={setRequestedServices}
                    />
                )}
                {/* Step 5: Summary */}
                {currentStep === 5 && (
                    <EventSummaryModal
                        onClose={handleBack}
                        onSubmit={() => setShowConsentModal(true)}
                        data={{
                            file,
                            venue: "", // Not needed anymore, handled by selectedVenueIds
                            dateRange,
                            timeRange,
                            eventDetails,
                            requestedServices,
                            dataPrivacyAgreed,
                            equipmentPolicyAgreed,
                            consentChoice,
                            showSuccess,
                        }}
                        selectedVenueIds={selectedGalleryItem}
                    />
                )}

                {showConsentModal && (
                    <ComplianceAndConsent
                        dataPrivacyAgreed={dataPrivacyAgreed}
                        onChangeDataPrivacy={(e) =>
                            setDataPrivacyAgreed(e.target.checked)
                        }
                        equipmentPolicyAgreed={equipmentPolicyAgreed}
                        onChangeEquipmentPolicy={(e) =>
                            setEquipmentPolicyAgreed(e.target.checked)
                        }
                        consentChoice={consentChoice}
                        onConsentChange={(e) =>
                            setConsentChoice(e.target.value)
                        }
                        onClose={() => setShowConsentModal(false)}
                        onSubmit={handleBookingSubmit}
                        isModal
                    />
                )}
                {error && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </div>
                )}
                {/* Navigation Buttons */}
                {!showSuccess && (
                    <div className="mt-16 max-w-2xl mx-auto flex flex-col gap-4">
                        <div className="flex flex-row justify-between gap-4">
                            {/* Hide Back button on step 1 */}
                            {currentStep !== 1 && (
                                <button
                                    className="w-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                                    onClick={handleBack}
                                    disabled={currentStep === 1 && !showSummary}
                                >
                                    Back
                                </button>
                            )}
                            <button
                                className={`${
                                    currentStep !== 1 ? "w-1/2" : "w-full"
                                } px-4 py-2 bg-secondary hover:bg-primary text-white rounded-md`}
                                onClick={handleContinue}
                            >
                                {currentStep === 5 && !showSummary
                                    ? "Continue"
                                    : "Continue"}
                            </button>
                        </div>
                        {/* Hide Cancel Booking on step 1 */}
                        {currentStep !== 1 && (
                            <button
                                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                                onClick={() => setShowCancelConfirm(true)}
                                type="button"
                            >
                                Cancel Booking
                            </button>
                        )}
                    </div>
                )}
            </div>
            {showCancelConfirm && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                    <div className="w-full max-w-sm mx-auto mb-0 md:mb-0 md:mt-0 rounded-t-3xl md:rounded-3xl bg-white shadow-2xl border border-blue-100 p-0 overflow-hidden animate-[slideUp_0.3s_ease]">
                        <div className="p-6 space-y-4">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-2" />
                            <div className="text-lg font-semibold text-gray-900 text-center">
                                Cancel Booking?
                            </div>
                            <div className="text-gray-600 text-center mb-4">
                                Are you sure you want to cancel and clear all
                                your booking data? This action cannot be undone.
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold text-base shadow hover:bg-red-600 transition"
                                    onClick={() => {
                                        setShowCancelConfirm(false);
                                        handleCancelBooking();
                                    }}
                                >
                                    Yes, Cancel Booking
                                </button>
                                <button
                                    className="w-full py-3 rounded-xl bg-gray-100 text-gray-800 font-semibold text-base shadow hover:bg-gray-200 transition"
                                    onClick={() => setShowCancelConfirm(false)}
                                >
                                    No, Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                    <style>
                        {`
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            `}
                    </style>
                </div>
            )}
            {conflictModal.open && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                    <div className="w-full max-w-md mx-auto mb-0 md:mb-0 md:mt-0 rounded-t-3xl md:rounded-3xl bg-white/80 shadow-2xl border border-blue-100 p-0 overflow-hidden animate-[slideUp_0.3s_ease]">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-base font-semibold text-gray-900 text-center w-full">
                                    Booking Conflict
                                </div>
                            </div>
                            {/* Justified intro */}
                            <div className="text-gray-700 text-sm mb-2 text-justify">
                                Sorry, you cannot continue. The following
                                venue(s) are already booked for your selected
                                date and time:
                            </div>
                            {/* Show "Your Request" only once */}
                            <div className="rounded-2xl border border-blue-100 bg-white/70 shadow-inner p-4 mb-2">
                                <div className="text-xs text-gray-500 mb-1 font-medium text-center">
                                    Your Request
                                </div>
                                <div className="flex flex-col gap-1 text-sm">
                                    <div>
                                        <span className="font-semibold">
                                            Venue:
                                        </span>{" "}
                                        {selectedVenueNames.join(", ")}
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            Date:
                                        </span>{" "}
                                        {(() => {
                                            const {
                                                start: userStartDate,
                                                end: userEndDate,
                                            } = parseDateRange(dateRange);
                                            return formatDateYMDToLong(
                                                userStartDate
                                            ) ===
                                                formatDateYMDToLong(
                                                    userEndDate
                                                ) || !userEndDate
                                                ? formatDateYMDToLong(
                                                      userStartDate
                                                  )
                                                : `${formatDateYMDToLong(
                                                      userStartDate
                                                  )} - ${formatDateYMDToLong(
                                                      userEndDate
                                                  )}`;
                                        })()}
                                    </div>
                                    <div>
                                        <span className="font-semibold">
                                            Time:
                                        </span>{" "}
                                        {(() => {
                                            const {
                                                start: userStartTime,
                                                end: userEndTime,
                                            } = parseTimeRange(timeRange);
                                            return formatTime24to12(
                                                userStartTime
                                            ) ===
                                                formatTime24to12(userEndTime) ||
                                                !userEndTime
                                                ? formatTime24to12(
                                                      userStartTime
                                                  )
                                                : `${formatTime24to12(
                                                      userStartTime
                                                  )} - ${formatTime24to12(
                                                      userEndTime
                                                  )}`;
                                        })()}
                                    </div>
                                </div>
                            </div>
                            {/* Conflicting bookings list, scrollable */}
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 ios-scrollbar">
                                {(conflictModal.conflicts || []).map(
                                    (c: any, idx: number) => {
                                        // Parse venue
                                        let venueStr = "";
                                        try {
                                            const v =
                                                typeof c.venue === "string"
                                                    ? JSON.parse(c.venue)
                                                    : c.venue;
                                            venueStr = Array.isArray(v)
                                                ? v.join(", ")
                                                : v;
                                        } catch {
                                            venueStr = Array.isArray(c.venue)
                                                ? c.venue.join(", ")
                                                : c.venue;
                                        }
                                        // Parse date
                                        let [startDate, endDate] = (
                                            c.date || ""
                                        ).split(" to ");
                                        startDate = formatDateYMDToLong(
                                            startDate?.trim() || ""
                                        );
                                        endDate = formatDateYMDToLong(
                                            endDate?.trim() || ""
                                        );
                                        let dateStr =
                                            startDate === endDate || !endDate
                                                ? startDate
                                                : `${startDate} - ${endDate}`;
                                        // Parse time
                                        let [startTime, endTime] = (
                                            c.time || ""
                                        ).split(" to ");
                                        startTime = formatTime24to12(
                                            startTime?.trim() || ""
                                        );
                                        endTime = formatTime24to12(
                                            endTime?.trim() || ""
                                        );
                                        let timeStr =
                                            startTime === endTime || !endTime
                                                ? startTime
                                                : `${startTime} - ${endTime}`;
                                        return (
                                            <div
                                                key={idx}
                                                className="rounded-2xl border border-gray-100 bg-white/60 shadow-inner p-4"
                                            >
                                                <div className="text-xs text-gray-500 mb-1 font-medium text-center">
                                                    Conflicting Booking
                                                </div>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div>
                                                        <span className="font-semibold">
                                                            Venue:
                                                        </span>{" "}
                                                        {venueStr}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">
                                                            Date:
                                                        </span>{" "}
                                                        {dateStr}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">
                                                            Time:
                                                        </span>{" "}
                                                        {timeStr}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">
                                                            Status:
                                                        </span>{" "}
                                                        {c.status}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <div className="text-gray-700 text-sm mb-2 text-center font-medium">
                                Please choose a different venue, date or time.
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 transition"
                                    onClick={() =>
                                        setConflictModal({
                                            open: false,
                                            message: "",
                                            conflicts: [],
                                        })
                                    }
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                    <style>
                        {`
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .ios-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #c7d2fe #f1f5f9;
}
.ios-scrollbar::-webkit-scrollbar {
    width: 6px;
    background: #f1f5f9;
    border-radius: 8px;
}
.ios-scrollbar::-webkit-scrollbar-thumb {
    background: #c7d2fe;
    border-radius: 8px;
}
.ios-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a5b4fc;
}
`}
                    </style>
                </div>
            )}
            {currentStep === 1 && (
                <div className="max-w-2xl mx-auto mb-1">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow text-yellow-800 text-sm font-medium flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-yellow-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                            />
                        </svg>
                        <span>
                            <strong>NOTE!</strong> Refreshing or leaving the
                            page during the process will remove your uploaded
                            file due to browser's limitation. You’ll need to
                            upload it again.
                        </span>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
