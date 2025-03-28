import React from "react";
import { Link } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";

export default function Hero() {
    return (
        <div
            className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center text-center px-4"
            style={{ backgroundImage: "url('/images/lvbuilding.jpg')" }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Hero Content */}
            <div className="relative z-10 text-white">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold drop-shadow-lg">
                    Computerized Maintenance
                    <br />
                    Management System
                </h1>
                <p className="mt-4 text-lg sm:text-2xl lg:text-3xl drop-shadow-md">
                    With Facility Scheduling.
                </p>

                <Link
                    href="/register"
                    className="inline-flex items-center px-6 py-3 mt-8 text-lg font-semibold text-white transition-all duration-300 bg-bluebutton rounded-lg hover:bg-opacity-90 hover:scale-105 focus:bg-opacity-90 shadow-lg"
                >
                    Get Started
                </Link>
            </div>
        </div>
    );
}
