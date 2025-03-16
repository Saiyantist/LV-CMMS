import React from "react";

const About = () => {
    return (
        <div className="sm:flex items-center max-w-screen-xl mx-auto py-10 px-5">
            <div className="sm:w-1/2 p-10">
                <div className="image object-center text-center">
                    <img src="/images/lvbuilding.jpg" alt="About Us" />
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
                        Scheduling is designed to streamline the mnagement of
                        computer resource, maintenance task, and facility
                        bookings. We aim to provide an efficient and organized
                        platform that helps ensure asset are well-maintained and
                        that facility usage is properly scheduled, supporting a
                        smooth nd productive environment for everyone on campus
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
