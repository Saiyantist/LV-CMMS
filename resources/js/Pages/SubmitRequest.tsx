import React from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const SubmitRequest: React.FC = () => {
    return (
        <Authenticated>
            <Head title="Submit Request" />

            <div className="flex h-screen">
                {/* Submit Request Form */}
                <div className="flex-1 p-8">
                    <section className="text-gray-600 body-font relative">
                        <div className="container px-5 py-24 mx-auto">
                            <div className="flex flex-col text-center w-full mb-12">
                                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                                    Work Order Request Form
                                </h1>
                            </div>
                            <div className="lg:w-1/2 md:w-2/3 mx-auto">
                                <div className="flex flex-wrap -m-2">
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="name"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                id="name"
                                                name="name"
                                                className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="email"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Requested by
                                            </label>
                                            <input
                                                type="text"
                                                id="email"
                                                name="email"
                                                className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="workOrderType"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Work Order Type
                                            </label>
                                            <select
                                                id="workOrderType"
                                                name="workOrderType"
                                                className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            >
                                                <option value="maintenance">
                                                    Maintenance
                                                </option>
                                                <option value="repair">
                                                    Repair
                                                </option>
                                                <option value="installation">
                                                    Installation
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="location"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-2 w-full">
                                        <div className="relative">
                                            <label
                                                htmlFor="message"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="p-2 w-full">
                                        <div className="relative">
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
                                                className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-2 w-full flex justify-end">
                                        <button className="text-white bg-red-500 border-0 py-2 px-8 focus :outline-none hover:bg-indigo-600 rounded text-lg">
                                            Cancel
                                        </button>

                                        <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Authenticated>
    );
};

export default SubmitRequest;
