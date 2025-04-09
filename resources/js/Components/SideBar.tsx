import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";

interface Role {
    name: string;
}

interface User {
    roles: Role[];
    first_name: string;
    last_name: string;
}

interface SidebarProps {
    user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { post } = useForm();

    // Logout Handler
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        post(route("logout"));
    };

    const isWorkOrderManager = user.roles.some(
        (role) => role.name === "WorkOrderManager"
    );

    const menuItems = [
        {
            href: route("dashboard"),
            text: "Dashboard",
        },
        {
            text: "Work Order",
            isDropdown: true,
            children: [
                {
                    href: route("work-orders.index"),
                    text: isWorkOrderManager
                        ? "Work Order Requests"
                        : "Work Order List",
                },
                {
                    href: route("submitrequest"),
                    text: "Submit a Request",
                },
            ],
        },
    ];

    // Admin Item (User Management)
    const adminItems = user.roles.some((role) => role.name === "super_admin")
        ? [
              {
                  href: route("admin.manage-roles"),
                  icon: "bx bx-user", // User Icon
                  text: "User Management",
              },
          ]
        : [];

    // Bottom Menu Items
    const bottomMenuItems = [
        { href: "#", icon: "bx bx-bell", text: "Settings" },
    ];

    return (
        <div className="fixed min-h-screen max-h-screen flex bg-primary">
            <div className="flex flex-col w-56 overflow-hidden">
                {/* Logo */}
                <div className="flex items-center justify-center h-24">
                    <img
                        src="/images/Lvlogo.jpg"
                        alt="Logo"
                        className="h-20 w-auto object-contain rounded-full"
                    />
                </div>

                {/* Menu Items */}
                <ul className="flex flex-col py-4 flex-grow">
                    {menuItems.map((item) =>
                        item.isDropdown ? (
                            <li key={item.text}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex flex-row items-center w-full h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-opacity-80 focus:outline-none"
                                >
                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                                        <i className={item.icon}></i>
                                    </span>
                                    <span className="text-sm font-medium flex items-center">
                                        {item.text}
                                        <span className="ml-2 text-white">
                                            {isDropdownOpen ? "˄" : "˅"}
                                        </span>
                                    </span>
                                </button>

                                {/* Dropdown Items */}
                                {isDropdownOpen && (
                                    <ul className="ml-8">
                                        {item.children?.map((child) => (
                                            <li key={child.text}>
                                                <Link
                                                    href={child.href}
                                                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-opacity-80"
                                                >
                                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                                                        <i
                                                            className={
                                                                child.icon
                                                            }
                                                        ></i>
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {child.text}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <li key={item.text}>
                                <Link
                                    href={item.href!}
                                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-opacity-80"
                                >
                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                                        <i className={item.icon}></i>
                                    </span>
                                    <span className="text-sm font-medium">
                                        {item.text}
                                    </span>
                                </Link>
                            </li>
                        )
                    )}

                    {/* Admin Items (User Management) */}
                    {adminItems.map((item) => (
                        <li key={item.text}>
                            <Link
                                href={item.href}
                                className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-opacity-80"
                            >
                                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                                    <i className={item.icon}></i>
                                </span>
                                <span className="text-sm font-medium">
                                    {item.text}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Bottom Menu Items (Settings & Logout) */}
                <ul className="py-4">
                    {bottomMenuItems.map((item) => (
                        <li key={item.text}>
                            <Link
                                href={item.href}
                                className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-opacity-80"
                            >
                                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                                    <i className={item.icon}></i>
                                </span>
                                <span className="text-sm font-medium">
                                    {item.text}
                                </span>
                            </Link>
                        </li>
                    ))}

                    {/* Logout Button */}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex flex-row items-center w-full h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-opacity-80"
                        >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                                <i className="bx bx-log-out"></i>
                            </span>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
