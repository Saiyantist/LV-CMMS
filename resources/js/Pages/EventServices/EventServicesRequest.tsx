"use client";

import type React from "react";
import { useState } from "react";
import { Upload, X, FileText, Check } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Gallery from "./Gallery";
import DateTimeSelection from "./Date&Time";
import EventDetails from "./EventDetails";
import RequestedServices from "./RequestedServices";
import ComplianceAndConsent from "./Compliance&Consent";
import EventSummaryModal from "./EventSummaryModal";

export default function EventServicesRequest() {
    // Step state
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Step 1: File
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Step 2: Venue
    const [selectedGalleryItem, setSelectedGalleryItem] = useState<
        number | null
    >(null);

    // Step 3: Date & Time
    const [dateRange, setDateRange] = useState<string>("");
    const [timeRange, setTimeRange] = useState<string>("");

    // Step 4: Event Details
    const [eventDetails, setEventDetails] = useState<{
        eventName: string;
        department: string;
        eventPurpose: string;
        participants: string;
        participantCount: string;
    }>({
        eventName: "",
        department: "",
        eventPurpose: "",
        participants: "",
        participantCount: "",
    });

    // Step 5: Requested Services
    const [requestedServices, setRequestedServices] = useState<
        Record<string, string[]>
    >({});

    // Step 6: Compliance & Consent
    const [dataPrivacyAgreed, setDataPrivacyAgreed] = useState(false);
    const [equipmentPolicyAgreed, setEquipmentPolicyAgreed] = useState(false);
    const [consentChoice, setConsentChoice] = useState("");

    const steps = [
        { id: 1, name: "Proof of Approval" },
        { id: 2, name: "Requested Venue" },
        { id: 3, name: "Date & Time" },
        { id: 4, name: "Event Details" },
        { id: 5, name: "Requested Services" },
        { id: 6, name: "Compliance and Consent" },
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
            // Make venue selection optional
            setCurrentStep(3);
        } else if (currentStep === 3) {
            if (!dateRange || !timeRange) {
                setError("Please select both date and time.");
                return;
            }
            setCurrentStep(4);
        } else if (currentStep === 4) {
            if (
                !eventDetails.eventName ||
                !eventDetails.department ||
                !eventDetails.eventPurpose ||
                !eventDetails.participants ||
                !eventDetails.participantCount
            ) {
                setError("Please fill out all event details.");
                return;
            }
            setCurrentStep(5);
        } else if (currentStep === 5) {
            setCurrentStep(6);
        } else if (currentStep === 6) {
            if (
                !dataPrivacyAgreed ||
                !equipmentPolicyAgreed ||
                consentChoice !== "agree"
            ) {
                setError("You must agree to all terms and consent to proceed.");
                return;
            }
            setShowSummary(true);
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
            currentStep === step.id
                ? "bg-secondary text-white"
                : currentStep > step.id
                ? "bg-green-500 text-white"
                : "bg-white text-gray-400 border border-gray-300"
        }`}
                                    >
                                        {currentStep > step.id ? (
                                            <Check size={16} />
                                        ) : (
                                            step.id
                                        )}
                                    </div>
                                    {/* {index < steps.length - 1 && (
                                        <div className="absolute top-1/2 left-full w-full h-0 border-t border-dashed border-gray-400 ml-2 z-0"></div>
                                    )} */}
                                </div>

                                <span
                                    className={`text-xs mt-2 text-center w-full ${
                                        currentStep === step.id
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
                        onSelect={(id: number | null) => {
                            setSelectedGalleryItem(id);
                            setError(null);
                        }}
                    />
                )}
                {/* Step 3: Date & Time */}
                {currentStep === 3 && (
                    <DateTimeSelection
                        value={{
                            dateRange,
                            timeRange,
                        }}
                        onChange={({
                            dateRange,
                            timeRange,
                        }: {
                            dateRange: string;
                            timeRange: string;
                        }) => {
                            setDateRange(dateRange);
                            setTimeRange(timeRange);
                        }}
                    />
                )}
                {/* Step 4: Event Details */}
                {currentStep === 4 && (
                    <EventDetails
                        value={eventDetails}
                        onChange={setEventDetails}
                    />
                )}
                {/* Step 5: Requested Services */}
                {currentStep === 5 && (
                    <RequestedServices
                        value={requestedServices}
                        onChange={setRequestedServices}
                    />
                )}
                {/* Step 6: Compliance and Consent */}
                {currentStep === 6 && (
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
                    />
                )}

                {error && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-16 max-w-2xl mx-auto">
                    <button
                        className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md py-2"
                        onClick={handleBack}
                        disabled={currentStep === 1 && !showSummary}
                    >
                        Back
                    </button>
                    <button
                        className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2"
                        onClick={handleContinue}
                    >
                        {currentStep === 6 && !showSummary
                            ? "Review"
                            : "Continue"}
                    </button>
                </div>

                {/* Summary Modal */}
                <EventSummaryModal
                    open={showSummary || showSuccess}
                    onClose={() => {
                        if (showSuccess) {
                            setShowSummary(false);
                            setShowSuccess(false);
                            setCurrentStep(1);
                            // Optionally reset all form data here
                        } else {
                            setShowSummary(false);
                        }
                    }}
                    onSubmit={() => {
                        // On submit, show the success step
                        setShowSuccess(true);
                    }}
                    data={{
                        file,
                        venue: selectedGalleryItem ? "Auditorium" : "",
                        dateRange,
                        timeRange,
                        eventDetails,
                        requestedServices,
                        dataPrivacyAgreed,
                        equipmentPolicyAgreed,
                        consentChoice,
                        showSuccess,
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
