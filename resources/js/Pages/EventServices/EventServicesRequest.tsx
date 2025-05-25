"use client";

import type React from "react";
import { useState } from "react";
import { Upload, X, FileText, Check } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Gallery from "./Gallery";
// import DateTimeSelection from "./Date&Time";
import EventDetails from "./EventDetails";
import RequestedServices from "./RequestedServices";
import ComplianceAndConsent from "./Compliance&Consent";
import EventSummaryModal from "./EventSummaryModal";
import { usePage } from "@inertiajs/react";

export default function EventServicesRequest() {
    // Step state
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);

    // Step 1: File
    const [file, setFile] = useState<File | null>(null);
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
            setFile(e.target.files[0]);
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
            setFile(e.dataTransfer.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    // Validation and step logic
    const handleContinue = () => {
        setError(null);
        if (currentStep === 1) {
            if (!file) {
                setError("Please upload a file before continuing.");
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setCurrentStep(3);
        } else if (currentStep === 3) {
            if (
                !eventDetails.eventName ||
                !eventDetails.department ||
                !eventDetails.eventPurpose ||
                !eventDetails.participants ||
                !eventDetails.participantCount ||
                !dateRange ||
                !timeRange
            ) {
                setError(
                    "Please fill out all event details and select date & time."
                );
                return;
            }
            setCurrentStep(4);
        } else if (currentStep === 4) {
            setCurrentStep(5);
        } else if (currentStep === 5) {
            // Just open the modal, do not validate here
            setShowConsentModal(true);
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

    return (
        <AuthenticatedLayout>
            <div className="w-[99%] mx-auto p-4 md:p-6 bg-white min-h-screen">
                {/* Progress Steps */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Event Services</h1>
                    <p className="text-gray-700 text-lg font-medium">
                        Book meeting rooms, event spaces, and equipment for your
                        next event.
                    </p>
                    <p className="text-gray-400 text-m font-medium">
                        NOTE: Please accomplish this form at least two (2)
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
                                        10MB
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
                                                <p className="font-medium">
                                                    {file.name}
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
                            {/* {error && (
                                <div className="text-red-500 text-sm mt-2 text-center">
                                    {error}
                                </div>
                            )} */}
                            <div className="text-gray-500 text-sm mt-4">
                                <p>
                                    Kindly use this naming format:
                                    EventDate_EventName
                                </p>
                                <p className="text-gray-400">
                                    Example: 112424_EnglishMonth
                                </p>
                            </div>
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
                        onSubmit={() => {
                            if (
                                !dataPrivacyAgreed ||
                                !equipmentPolicyAgreed ||
                                consentChoice !== "agree"
                            ) {
                                setError(
                                    "You must agree to all terms and consent to proceed."
                                );
                                return;
                            }
                            setShowConsentModal(false);
                            setShowSuccess(true); // or your actual submit logic
                        }}
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
                    <div className="mt-16 max-w-2xl mx-auto flex flex-row justify-between gap-4">
                        <button
                            className="w-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                            onClick={handleBack}
                            disabled={currentStep === 1 && !showSummary}
                        >
                            Back
                        </button>
                        <button
                            className="w-1/2 px-4 py-2 bg-secondary hover:bg-primary text-white rounded-md"
                            onClick={handleContinue}
                        >
                            {currentStep === 5 && !showSummary
                                ? "Continue"
                                : "Continue"}
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
