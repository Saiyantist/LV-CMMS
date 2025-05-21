import React from "react";

const Footer = () => {
    return (
        <div className="w-full px-6 lg:px-12 pt-16 bg-primary">
            <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                    <div className="inline-flex items-center">
                        <img
                            src="/images/lvlogo.jpg"
                            alt="La Verdad Christian College Logo"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="ml-2 text-xl font-bold tracking-wide text-gray-200 uppercase">
                            La Verdad Christian College, Inc.
                        </span>
                    </div>
                    {/* <div className="mt-6 lg:max-w-sm">
                        <p className="text-sm text-gray-200">
                            La Verdad Christian College provides students a high
                            quality and carefully defined educational program
                            emphasizing Christian Values, various skills and
                            vast creative activities. Our school aims to be the
                            frontrunner in providing academic excellence and
                            morally upright principles.
                        </p>
                    </div> */}
                </div>
                <div className="space-y-2 text-sm">
                    <p className="text-base font-bold tracking-wide text-gray-200">
                        Contacts
                    </p>
                    <div className="flex">
                        <p className="mr-1 text-gray-200">Phone:</p>
                        <p className="transition-colors duration-300 text-white hover:text-deep-purple-800">
                            09** *** ****
                        </p>
                    </div>
                    <div className="flex">
                        <p className="mr-1 text-gray-200">Email:</p>
                        <p className="transition-colors duration-300 text-white hover:text-deep-purple-800">
                            lvccapalit@gmail.com
                        </p>
                    </div>
                    <div className="flex">
                        <p className="mr-1 text-gray-200">Address:</p>
                        <p className="transition-colors duration-300 text-white hover:text-deep-purple-800">
                            MacArthur Highway, <br /> Sampaloc Apalit, Pampanga.
                        </p>
                    </div>
                </div>
                <div>
                    <span className="text-base font-bold tracking-wide text-gray-200">
                        Social
                    </span>
                    <div className="flex items-center mt-1 space-x-3">
                        <a
                            href="https://www.facebook.com/lvcc.apalit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-transform duration-300 hover:scale-110 flex items-center space-x-2"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="white" // Icon color changed to white
                                className="h-5"
                            >
                                <path
                                    d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 
                    c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22
                    c1.105,0,2-0.895,2-2V2C24,0.895,23.105,0,22,0z"
                                ></path>
                            </svg>
                            <span className="text-gray-200 text-sm">
                                La Verdad Christian College, Inc. - Apalit,
                                Pampanga
                            </span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t border-gray-700 lg:flex-row">
                <p className="text-sm text-gray-200">
                    © Copyright 2025 LVCC Inc. All rights reserved.
                </p>
                <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
                    <li>
                        <a
                            href="/"
                            className="text-sm text-gray-200 transition-colors duration-300 hover:text-deep-purple-accent-400"
                        >
                            F.A.Q
                        </a>
                    </li>
                    <li>
                        <a
                            href="/"
                            className="text-sm text-gray-200 transition-colors duration-300 hover:text-deep-purple-accent-400"
                        >
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a
                            href="/"
                            className="text-sm text-gray-200 transition-colors duration-300 hover:text-deep-purple-accent-400"
                        >
                            Terms & Conditions
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Footer;
