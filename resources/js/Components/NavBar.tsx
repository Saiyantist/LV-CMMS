// NavBar.tsx
import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
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
                <nav className="hidden lg:flex items-center space-x-10 scroll-smooth">
                    <a
                        href="/"
                        className="text-sm sm:text-base text-bluetext transition-all duration-200 hover:text-opacity-80 hover:underline"
                    >
                        Home
                    </a>
                    <a
                        href="#about"
                        className="text-sm sm:text-base text-bluetext transition-all duration-200 hover:text-opacity-80 hover:underline"
                    >
                        About
                    </a>
                    <a
                        href="#features"
                        className="text-sm sm:text-base text-bluetext transition-all duration-200 hover:text-opacity-80 hover:underline"
                    >
                        Features
                    </a>
                </nav>

                {/* Desktop Login Button */}
                <Link
                    href="/login"
                    className="hidden lg:inline-flex px-5 py-2.5 text-base font-semibold text-white transition-all duration-300 bg-bluebutton rounded-lg hover:bg-opacity-90 hover:scale-105 focus:bg-opacity-90"
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
                <div className="lg:hidden bg-white shadow-md py-4 px-6 absolute top-full left-0 w-full flex flex-col items-center space-y-4">
                    <a
                        href="/"
                        className="text-black text-lg hover:text-opacity-80"
                    >
                        Home
                    </a>
                    <a
                        href="#about"
                        className="text-black text-lg hover:text-opacity-80"
                    >
                        About
                    </a>
                    <a
                        href="#features"
                        className="text-black text-lg hover:text-opacity-80"
                    >
                        Features
                    </a>
                    <Link
                        href="/login"
                        className="px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-black rounded-full"
                    >
                        Login
                    </Link>
                </div>
            )}
        </header>
    );
}
