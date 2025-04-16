import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* NavBar */}
            <header className="fixed top-0 left-0 w-full py-4 z-50 bg-white">
                <div className="px-4 mx-auto max-w-7xl flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <img
                            className="w-auto h-12 rounded-full"
                            src="/images/lvlogo.jpg"
                            alt="La Verdad Christian College Logo"
                        />
                        <Link
                            href="/"
                            className="text-lg font-light text-bluetitle"
                        >
                            La Verdad Christian College
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10 scroll-smooth">
                        <Link
                            href="/"
                            className="text-sm sm:text-base text-black font-semibold transition-all duration-200 hover:text-opacity-80 hover:underline"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#about"
                            className="text-sm sm:text-base text-bluetitle transition-all duration-200 hover:text-opacity-80 hover:underline"
                        >
                            About
                        </Link>
                        <Link
                            href="/#features"
                            className="text-sm sm:text-base text-bluetitle transition-all duration-200 hover:text-opacity-80 hover:underline"
                        >
                            Features
                        </Link>
                    </nav>

                    {/* Desktop Login Button */}
                    <Link
                        href="/login"
                        className="hidden lg:inline-flex px-5 py-2.5 text-base font-semibold text-white transition-all duration-300 bg-secondary rounded-lg hover:bg-opacity-90 hover:bg-primary"
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
                                />
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
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {menuOpen && (
                    <div className="lg:hidden bg-white shadow-md py-4 px-6 absolute top-full left-0 w-full flex flex-col items-center space-y-4 z-50">
                        <Link
                            href="/"
                            className="text-black font-semibold text-lg hover:text-opacity-80"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#about"
                            className="text-bluetitle text-lg hover:text-opacity-80"
                        >
                            About
                        </Link>
                        <Link
                            href="/#features"
                            className="text-bluetitle text-lg hover:text-opacity-80"
                        >
                            Features
                        </Link>
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-base transition-all duration-200 font-semibold text-white bg-secondary rounded-full hover:bg-opacity-90 hover:scale-105 focus:bg-opacity-90 focus:scale-105"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </header>

            {/* Background dimmer when menu is open */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}
