import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function Hero() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center text-center px-4"
            style={{ backgroundImage: "url('/images/lvbuilding.jpg')" }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full py-4 z-10 bg-white">
                <div className="px-4 mx-auto max-w-7xl flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <img
                            className="w-auto h-12 rounded-full"
                            src="/images/lvlogo.jpg"
                            alt="La Verdad Christian College Logo"
                        />
                        <span className="text-lg font-semibold text-black">
                            La Verdad Christian College
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        <Link
                            href="/"
                            className="text-sm sm:text-base text-slate-500 transition-all duration-200 hover:text-opacity-80 hover:underline"
                        >
                            Home
                        </Link>
                        <Link
                            href="#about"
                            className="text-sm sm:text-base text-slate-500 transition-all duration-200 hover:text-opacity-80 hover:underline"
                        >
                            About
                        </Link>
                        <Link
                            href="#features"
                            className="text-sm sm:text-base text-slate-500 transition-all duration-200 hover:text-opacity-80 hover:underline"
                        >
                            Features
                        </Link>
                    </nav>

                    {/* Desktop Login Button */}
                    <Link
                        href="/login"
                        className="hidden lg:inline-flex px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-secondary rounded-full"
                    >
                        Login
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden p-2 text-black transition-all duration-200 rounded-md focus:bg-gray-100 hover:bg-gray-100"
                    >
                        {menuOpen ? (
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 8h16M4 16h16"
                                ></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {menuOpen && (
                    <div className="lg:hidden bg-white shadow-md py-4 px-6 absolute top-full left-0 w-full flex flex-col items-center space-y-4">
                        <Link
                            href="/"
                            className="text-black text-lg hover:text-opacity-80"
                        >
                            Home
                        </Link>
                        <Link
                            href="#about"
                            className="text-black text-lg hover:text-opacity-80"
                        >
                            About
                        </Link>
                        <Link
                            href="#features"
                            className="text-black text-lg hover:text-opacity-80"
                        >
                            Features
                        </Link>
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-black rounded-full"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </header>

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
                    className="inline-flex items-center px-6 py-4 mt-8 text-lg font-semibold text-black transition-all duration-200 bg-violet-300 rounded-full hover:bg-yellow-400 focus:bg-yellow-400 shadow-lg"
                >
                    Get Started
                    {/*  */}
                </Link>
            </div>
        </div>
    );
}
