import React, { useState } from "react";

const Sidebar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-row bg-gray-100">
            <div className="flex flex-col w-56 bg-white overflow-hidden">
                {/* Logo */}
                <div className="flex items-center justify-center h-24">
                    <img
                        src="/images/Lvlogo.jpg"
                        alt="Logo"
                        className="h-20 w-auto object-contain"
                    />
                </div>

                {/* Menu Items */}
                <ul className="flex flex-col py-4 flex-grow">
                    {menuItems.map((item) =>
                        item.text === "Work Order Request" ? (
                            <li key={item.text}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex flex-row items-center w-full h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800 focus:outline-none"
                                >
                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                                        <i className={item.icon}></i>
                                    </span>
                                    <span className="text-sm font-medium flex items-center">
                                        {item.text}
                                        <span className="ml-2 text-gray-400">
                                            {isDropdownOpen ? ">" : "˅"}
                                        </span>
                                    </span>
                                </button>

                                {/* Dropdown Items */}
                                {isDropdownOpen && (
                                    <ul className="ml-8">
                                        <li>
                                            <a
                                                href="/submitrequest"
                                                className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                                            >
                                                <span className="text-sm font-medium">
                                                    Submit Request
                                                </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="/requestdetails"
                                                className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                                            >
                                                <span className="text-sm font-medium">
                                                    Request Details
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <li key={item.text}>
                                <a
                                    href={item.href}
                                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                                >
                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                                        <i className={item.icon}></i>
                                    </span>
                                    <span className="text-sm font-medium">
                                        {item.text}
                                    </span>
                                </a>
                            </li>
                        )
                    )}
                </ul>

                {/* Bottom Menu Items (Settings & Logout) */}
                <ul className="py-4">
                    {bottomMenuItems.map((item) => (
                        <li key={item.text}>
                            <a
                                href={item.href}
                                className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                            >
                                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                                    <i className={item.icon}></i>
                                </span>
                                <span className="text-sm font-medium">
                                    {item.text}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const menuItems = [
    { href: "/dashboard", icon: "bx bx-home", text: "Dashboard" },
    { href: "#", icon: "bx bx-music", text: "Work Order Request" },
];

const bottomMenuItems = [
    { href: "#", icon: "bx bx-bell", text: "Settings" },
    { href: "#", icon: "bx bx-log-out", text: "Logout" },
];

export default Sidebar;
