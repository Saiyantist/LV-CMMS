import React from "react";

const Features: React.FC = () => {
    return (
        <div className="h-screen bg-white text-gray-800">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
                    Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden">
                        <img
                            src="images/laptop.png"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 md:p-6">
                            <h3 className="text-xl font-semibold text-indigo-500 mb-2">
                                Work Order
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Our systen simplifies maintenance requests
                                through a Work Order feature that allows users
                                to easily create, track, and manage repair or
                                service requests for equipment. With real-time
                                updates, status monitoring, and automated
                                notificationsm, the process ensures quick
                                response times and organized task handling from
                                request submission to completion.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden">
                        <img
                            src="images/laptop.png"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 md:p-6">
                            <h3 className="text-xl font-semibold text-purple-500 mb-2">
                                Asset Management
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Nemo totam praesentium,
                                deserunt consectetur repudiandae iure non
                                eligendi tenetur quidem beatae laboriosam quam
                                officia aut ipsa sapiente rem iusto eaque velit.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden">
                        <img
                            src="images/laptop.png"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 md:p-6">
                            <h3 className="text-xl font-semibold text-cyan-500 mb-2">
                                Preventive Maintenance
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Tempora libero, nulla
                                repudiandae, praesentium maxime ab temporibus
                                placeat facilis laudantium tempore cum! Officiis
                                temporibus enim quae consectetur perspiciatis
                                dolores? Placeat, eaque!
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden">
                        <img
                            src="images/laptop.png"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 md:p-6">
                            <h3 className="text-xl font-semibold text-cyan-500 mb-2">
                                Preventive Maintenance
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Tempora libero, nulla
                                repudiandae, praesentium maxime ab temporibus
                                placeat facilis laudantium tempore cum! Officiis
                                temporibus enim quae consectetur perspiciatis
                                dolores? Placeat, eaque!
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden">
                        <img
                            src="images/laptop.png"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 md:p-6">
                            <h3 className="text-xl font-semibold text-cyan-500 mb-2">
                                Preventive Maintenance
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Tempora libero, nulla
                                repudiandae, praesentium maxime ab temporibus
                                placeat facilis laudantium tempore cum! Officiis
                                temporibus enim quae consectetur perspiciatis
                                dolores? Placeat, eaque!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
