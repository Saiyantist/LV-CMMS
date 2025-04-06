import React from "react";

interface SubmitRequestLayoutProps {
    data: {
        date: string;
        requestedBy: string;
        workOrderType: string;
        location: string;
        description: string;
        photos: File[];
    };
    errors: { [key: string]: string };
    isLoading: boolean;
    filePreviews: { url: string; name: string }[];
    handleSubmit: (e: React.FormEvent) => void;
    handleCancel: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setData: (key: string, value: any) => void;
}

const SubmitRequestLayout: React.FC<SubmitRequestLayoutProps> = ({
    data,
    errors,
    isLoading,
    filePreviews,
    handleSubmit,
    handleCancel,
    handleFileChange,
    setData,
}) => {
    return (
        <div className="flex h-screen">
            <div className="flex-1 p-8">
                <section className="text-gray-600 body-font relative">
                    <div className="container px-5 py-24 mx-auto">
                        <div className="flex flex-col text-center w-full mb-12">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                                Work Order Request Form
                            </h1>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="lg:w-1/2 md:w-2/3 mx-auto"
                        >
                            <div className="flex flex-wrap -m-2">
                                {/* Date Input */}
                                <div className="p-2 w-1/2">
                                    <label
                                        htmlFor="date"
                                        className="leading-7 text-sm text-gray-600"
                                    >
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={data.date}
                                        onChange={(e) =>
                                            setData("date", e.target.value)
                                        }
                                        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                        aria-required="true"
                                        aria-invalid={errors.date ? "true" : "false"}
                                    />
                                    {errors.date && (
                                        <p className="text-red-500 text-sm">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>

                                {/* Requested By */}
                                <div className="p-2 w-1/2">
                                    <label
                                        htmlFor="requestedBy"
                                        className="leading-7 text-sm text-gray-600"
                                    >
                                        Requested by{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="requestedBy"
                                        name="requestedBy"
                                        value={data.requestedBy}
                                        onChange={(e) =>
                                            setData("requestedBy", e.target.value)
                                        }
                                        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                    {errors.requestedBy && (
                                        <p className="text-red-500 text-sm">
                                            {errors.requestedBy}
                                        </p>
                                    )}
                                </div>

                                {/* Work Order Type */}
                                <div className="p-2 w-1/2">
                                    <label
                                        htmlFor="workOrderType"
                                        className="leading-7 text-sm text-gray-600"
                                    >
                                        Work Order Type
                                    </label>
                                    <select
                                        id="workOrderType"
                                        name="workOrderType"
                                        value={data.workOrderType}
                                        onChange={(e) =>
                                            setData("workOrderType", e.target.value)
                                        }
                                        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    >
                                        <option value="maintenance">Maintenance</option>
                                        <option value="repair">Repair</option>
                                        <option value="installation">
                                            Installation
                                        </option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="p-2 w-1/2">
                                    <label
                                        htmlFor="location"
                                        className="leading-7 text-sm text-gray-600"
                                    >
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData("location", e.target.value)
                                        }
                                        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                    {errors.location && (
                                        <p className="text-red-500 text-sm">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="p-2 w-full">
                                    <label
                                        htmlFor="description"
                                        className="leading-7 text-sm text-gray-600"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData("description", e.target.value)
                                        }
                                        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                {/* Upload Photos */}
                                <div className="p-2 w-full">
                                    <label
                                        htmlFor="photos"
                                        className="leading-7 text-sm text-gray-600"
                                    >
                                        Upload Photos
                                    </label>
                                    <input
                                        type="file"
                                        id="photos"
                                        name="photos"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    />
                                </div>

                                {/* Image Previews */}
                                {filePreviews.length > 0 && (
                                    <div className="p-2 w-full grid grid-cols-3 gap-2">
                                        {filePreviews.map((file, index) => (
                                            <img
                                                key={index}
                                                src={file.url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Submit and Cancel Buttons */}
                                <div className="p-2 w-full flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className={`text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none rounded text-lg ${
                                            isLoading
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-indigo-600"
                                        }`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SubmitRequestLayout;
