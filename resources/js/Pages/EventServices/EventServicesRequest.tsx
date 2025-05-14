"use client";

import type React from "react";
import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Gallery from "./Gallery";
import DateTimeSelection from "./Date&Time";

export default function EventServicesRequest() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [selectedGalleryItem, setSelectedGalleryItem] = useState<
        number | null
    >(null);

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

    const handleContinue = () => {
        if (currentStep === 1) {
            if (!file) {
                setError("Please upload a file before continuing.");
                return;
            }
            setError(null);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!selectedGalleryItem) {
                setError("Please select a venue to continue.");
                return;
            }
            setError(null);
            setCurrentStep(3);
        } else if (currentStep < steps.length) {
            setError(null);
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setError(null);
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white min-h-screen">
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
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className="flex-1 flex flex-col items-center"
                            >
                                <div className="relative flex items-center w-full justify-center">
                                    <div
                                        className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                            ${
                                                currentStep === step.id
                                                    ? "bg-blue-600 text-white"
                                                    : currentStep > step.id
                                                    ? "bg-black text-white"
                                                    : "bg-white text-gray-400 border border-gray-300"
                                            }`}
                                    >
                                        {step.id}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="absolute top-1/2 left-full w-full h-[1px] bg-gray-300 -translate-y-1/2 z-0"></div>
                                    )}
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
                            {error && (
                                <div className="text-red-500 text-sm mt-2 text-center">
                                    {error}
                                </div>
                            )}
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
                        onSelect={(id: number) => {
                            setSelectedGalleryItem(id);
                            setError(null);
                        }}
                    />
                )}
                {/* Step 3: Date & Time */}
                {currentStep === 3 && <DateTimeSelection />}
                {/* ...other steps can be added here... */}
                {/* Navigation Buttons (always visible) */}
                <div className="flex justify-between mt-16 max-w-2xl mx-auto">
                    <button
                        className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md py-2"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        Back
                    </button>
                    <button
                        className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2"
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                </div>
                {error && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
