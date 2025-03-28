import React from "react";

// Define a functional component with proper TypeScript typing
const About: React.FC = () => {
    return (
        <section
            id="about"
            className="sm:flex items-center max-w-screen-xl mx-auto py-10 px-5"
        >
            {/* Left Section with Image */}
            <div className="sm:w-1/2 p-10 flex justify-center">
                <div className="image object-center text-center w-full max-w-3xl">
                    <img
                        src="/images/lvbuilding.jpg"
                        alt="About Us"
                        className="w-full h-auto max-h-[800px] min-h-[500px] object-cover rounded-lg"
                    />
                </div>
            </div>

            {/* Right Section with Text */}
            <div className="sm:w-1/2 p-5">
                <div className="text">
                    <h2 className="my-4 font-bold text-3xl sm:text-4xl text-bluetitle">
                        About Us
                    </h2>

                    {/* Description Text */}
                    <p className="text-bluetext">
                        The Computer Maintenance Management System with Facility
                        Scheduling is designed to streamline the management of
                        computer resources, maintenance tasks, and facility
                        bookings. We aim to provide an efficient and organized
                        platform that ensures assets are well-maintained and
                        that facility usage is properly scheduled, supporting a
                        smooth and productive environment for everyone on
                        campus.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
