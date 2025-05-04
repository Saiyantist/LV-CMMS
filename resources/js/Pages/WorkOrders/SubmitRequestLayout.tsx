import React from "react";

interface Props {
    data: {
        location_id: string;
        report_description: string;
        images: File[];
    };
    errors: { [key: string]: string };
    isLoading: boolean;
    filePreviews: { url: string; name: string }[];
    typedLocation: string;
    showDropdown: boolean;
    filteredLocations: { id: number; name: string }[];
    handleSubmit: (e: React.FormEvent) => void;
    handleCancel: () => void;
    handleLocationInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectLocation: (loc: { id: number; name: string }) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setData: (key: string, value: any) => void;
}

const SubmitRequestLayout: React.FC<Props> = ({
    data,
    errors,
    isLoading,
    filePreviews,
    typedLocation,
    showDropdown,
    filteredLocations,
    handleSubmit,
    handleCancel,
    handleLocationInput,
    handleSelectLocation,
    handleFileChange,
    setData,
}) => {
    return (
        <div className="flex h-screen">
            <div className="flex-1 p-8">
                <section className="text-gray-600 body-font relative">
                    <div className="container mx-auto">
                        <div className="flex flex-col text-center w-full mb-12">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                                Work Order Request Form
                            </h1>
                        </div>
                        <form onSubmit={handleSubmit} className="lg:w-1/2 md:w-2/3 mx-auto">
                            <div className="flex flex-wrap -m-2">
                                <div className="p-2 w-full">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        className="border p-2 w-full rounded-md text-sm"
                                        value={typedLocation}
                                        onChange={handleLocationInput}
                                        onFocus={() => {}}
                                        placeholder="Search or type a new location"
                                    />
                                    {errors.location && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.location}
                                        </p>
                                    )}
                                    {showDropdown && filteredLocations.length > 0 && (
                                        <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md shadow bg-white z-10">
                                            {filteredLocations.map((loc) => (
                                                <li
                                                    key={loc.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelectLocation(loc)}
                                                >
                                                    {loc.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="p-2 w-full">
                                    <label htmlFor="description" className="leading-7 text-sm text-gray-600">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.report_description}
                                        onChange={(e) =>
                                            setData("report_description", e.target.value)
                                        }
                                        className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="p-2 w-full">
                                    <label htmlFor="photos" className="leading-7 text-sm text-gray-600">
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

                                {filePreviews.length > 0 && (
                                    <div className="p-2 w-full grid grid-cols-3 gap-2 overflow-auto max-h-60">
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

                                <div className="p-2 w-full flex flex-wrap justify-center sm:justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-white text-black px-12 py-2 rounded-3xl border-2 hover:bg-red-400 hover:text-white transition"
                                    >
                                        Clear
                                    </button>

                                    <button
                                        type="submit"
                                        className={`text-white bg-secondary border-0 py-2 px-6 sm:px-8 rounded-3xl text-base sm:text-lg transition ${
                                            isLoading
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-primary"
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
