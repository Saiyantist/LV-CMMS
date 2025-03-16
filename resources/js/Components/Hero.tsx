import React from "react";
import { Link } from "@inertiajs/react";

export default function Hero() {
    return (
        <div className="bg-white">
            <header className="bg-white bg-opacity-100">
                <div className="px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <div className="flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <img
                                    className="w-auto h-12"
                                    src="/images/lvlogo.jpg"
                                    alt="La Verdad Christian College Logo"
                                />
                                <span className="text-lg font-semibold text-black">
                                    La Verdad Christian College
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
                        >
                            <svg
                                className="block w-6 h-6"
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
                            <svg
                                className="hidden w-6 h-6"
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
                        </button>

                        <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
                            <a
                                href="#"
                                title=""
                                className="text-base text-black transition-all duration-200 hover:text-opacity-80 hover:underline"
                            >
                                Home
                            </a>
                            <a
                                href="#"
                                title=""
                                className="text-base text-black transition-all duration-200 hover:text-opacity-80 hover:underline"
                            >
                                About
                            </a>
                            <a
                                href="#"
                                title=""
                                className="text-base text-black transition-all duration-200 hover:text-opacity-80 hover:underline"
                            >
                                Features
                            </a>
                        </div>

                        <Link
                            href="/login"
                            className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-black rounded-full"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            <section className="bg-white py-10 sm:py-16 lg:py-24">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            <h1 className="mt-4 text-2xl font-bold text-black lg:mt-8 sm:text-4xl xl:text-5xl">
                                Computerized Maintenance Management System
                            </h1>
                            <p className="mt-4 text-lg text-black lg:mt-8 sm:text-2xl xl:text-3xl">
                                With Facility Scheduling.
                            </p>

                            <Link
                                href="/register"
                                className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 bg-violet-300 rounded-full lg:mt-16 hover:bg-yellow-400 focus:bg-yellow-400"
                            >
                                Get Started
                                <svg
                                    className="w-6 h-6 ml-8 -mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </Link>
                        </div>

                        <div>
                            <img
                                className="w-full"
                                src="/images/laptop.png"
                                alt="Laptop Image"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
