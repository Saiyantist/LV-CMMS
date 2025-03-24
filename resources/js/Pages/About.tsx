import React from "react";

const About = () => {
    return (
        <div className="sm:flex items-center max-w-screen-xl mx-auto py-10 px-5">
            <div className="sm:w-1/2 p-10 flex justify-center">
                <div className="image object-center text-center w-full max-w-3xl">
                    <img
                        src="/images/lvbuilding.jpg"
                        alt="About Us"
                        className="w-full h-auto max-h-[800px] min-h-[500px] object-cover rounded-lg"
                    />
                </div>
            </div>

            <div className="sm:w-1/2 p-5">
                <div className="text">
                    <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">
                        About us
                    </span>
                    <h2 className="my-4 font-bold text-3xl sm:text-4xl">
                        About{" "}
                        <span className="text-indigo-600">
                            CMMS with Facility Scheduling
                        </span>
                    </h2>
                    <p className="text-gray-700">
                        Computer Maintenance Management System with Facility
                        Scheduling is designed to streamline the management of
                        computer resources, maintenance tasks, and facility
                        bookings. We aim to provide an efficient and organized
                        platform that helps ensure assets are well-maintained and
                        that facility usage is properly scheduled, supporting a
                        smooth and productive environment for everyone on campus.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
