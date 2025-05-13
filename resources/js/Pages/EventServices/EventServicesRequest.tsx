"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, FileText } from "lucide-react"
// import { Button } from "@/components/ui/button"

export default function EventServicesRequest() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Steps for the progress indicator
  const steps = [
    { id: 1, name: "Proof of Approval", active: true },
    { id: 2, name: "Requested Venue", active: false },
    { id: 3, name: "Date & Time", active: false },
    { id: 4, name: "Event Details", active: false },
    { id: 5, name: "Requested Services", active: false },
    { id: 6, name: "Compliance and Consent", active: false },
  ]

  // File handling functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white min-h-screen">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.active ? "bg-black text-white" : "bg-white text-gray-400 border border-gray-300"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && <div className="h-[1px] bg-gray-300 w-full flex-1 mx-2"></div>}
              </div>
              <span className="text-xs mt-2 text-center">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-medium text-center mb-6">
            Proof of Approval <span className="text-red-500">*</span>
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Please upload the request letter signed by the Administrator or the Department Head.
          </p>

          {/* File Upload Area */}
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-md p-10 flex flex-col items-center justify-center cursor-pointer ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium mb-1">Select a file or drag and drop here</p>
              <p className="text-gray-500 text-sm mb-4">JPG, PNG or PDF, file size no more than 10MB</p>
              {/* <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50">
                SELECT FILE
              </Button> */}
              <button>
                SELECT FILE
              </button>
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
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{Math.round(file.size / 1024)}kb</p>
                  </div>
                </div>
                <button onClick={removeFile} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="text-gray-500 text-sm mt-4">
            <p>Kindly use this naming format: EventDate_EventName</p>
            <p className="text-gray-400">Example: 112424_EnglishMonth</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-16">
            {/* <Button variant="outline" className="px-8">
              Back
            </Button> */}
            <button>
                Back
            </button>
            {/* <Button className="px-8 bg-blue-600 hover:bg-blue-700">Continue</Button> */}
            <button>
                Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
