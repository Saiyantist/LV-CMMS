import React, { useState } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { post } = useForm();
    const currentRoute = route().current();

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
            icon: "bx bx-home",
        },
        {
            text: "Work Order",
            isDropdown: true,
            icon: "bx bx-task",
            children: [
                {
                    href: route("work-orders.index"),
                    text: isWorkOrderManager
                        ? "Work Order Requests"
                        : "Work Order List",
                },
                {
                    href: route("work-orders.assetmanagement"),
                    text: "Asset Management",
                },
                {
                    href: route("work-orders.preventive-maintenance"),
                    text: "Preventive Maintenance",
                },
                {
                    href: route("work-orders.submit-request"),
                    text: "Submit a Request",
                },
            ],
        },
    ];

    const adminItems = user.roles.some((role) => role.name === "super_admin")
        ? [
              {
                  href: route("admin.manage-roles"),
                  icon: "bx bx-user",
                  text: "User Management",
              },
          ]
        : [];

    const bottomMenuItems = [
        { href: "#", icon: "bx bx-bell", text: "Settings" },
    ];

    const isActive = (href: string) => currentRoute === href;

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex fixed min-h-screen max-h-screen bg-primary w-56 flex-col">
                <div className="flex items-center justify-center h-24">
                    <img
                        src="/images/Lvlogo.jpg"
                        alt="Logo"
                        className="h-20 w-auto object-contain rounded-full"
                    />
                </div>

                <ul className="flex flex-col py-4 flex-grow">
                    {menuItems.map((item) =>
                        item.isDropdown ? (
                            <li key={item.text}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex items-center w-full h-12 px-4 text-white hover:text-opacity-80 transition-transform"
                                >
                                    <span className="text-sm font-medium flex items-center justify-between w-full">
                                        <i className={`${item.icon} mr-2`}></i>
                                        {item.text}
                                        <span className="ml-2">
                                            {isDropdownOpen ? "˄" : "˅"}
                                        </span>
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <ul className="ml-4">
                                        {item.children?.map((child) => (
                                            <li key={child.text}>
                                                <Link
                                                    href={child.href}
                                                    className={`block h-10 px-4 text-sm hover:text-opacity-80 ${
                                                        isActive(child.href)
                                                            ? "bg-white text-primary rounded"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    {child.text}
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
                                    className={`flex items-center h-12 px-4 text-sm hover:text-opacity-80 ${
                                        isActive(item.href!)
                                            ? "bg-white text-primary rounded"
                                            : "text-white"
                                    }`}
                                >
                                    <i className={`${item.icon} mr-2`}></i>
                                    {item.text}
                                </Link>
                            </li>
                        )
                    )}

                    {adminItems.map((item) => (
                        <li key={item.text}>
                            <Link
                                href={item.href}
                                className={`flex items-center h-12 px-4 text-sm hover:text-opacity-80 ${
                                    isActive(item.href)
                                        ? "bg-white text-primary rounded"
                                        : "text-white"
                                }`}
                            >
                                <i className={item.icon}></i>
                                <span className="ml-2">{item.text}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Bottom */}
                <ul className="py-4">
                    {bottomMenuItems.map((item) => (
                        <li key={item.text}>
                            <Link
                                href={item.href}
                                className="flex items-center h-12 px-4 text-white text-sm hover:text-opacity-80"
                            >
                                <i className={item.icon}></i>
                                <span className="ml-2">{item.text}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full h-12 px-4 text-white text-sm hover:text-opacity-80"
                        >
                            <i className="bx bx-log-out"></i>
                            <span className="ml-2">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Mobile Top Navbar */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-primary text-white shadow-md z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/images/Lvlogo.jpg"
                            alt="Logo"
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="focus:outline-none"
                    >
                        <i className="bx bx-menu text-2xl" />
                    </button>
                </div>
            </div>

            {/* Mobile Full Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-primary text-white px-4 py-3 mt-16 z-40 fixed top-0 left-0 w-full overflow-y-auto h-[calc(100vh-64px)]">
                    <ul className="space-y-3">
                        {menuItems.map((item) =>
                            item.isDropdown ? (
                                <li key={item.text}>
                                    <button
                                        onClick={() =>
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                        className="w-full text-left py-2 flex justify-between items-center"
                                    >
                                        <span className="flex items-center">
                                            <i className={`${item.icon} mr-2`} />
                                            {item.text}
                                        </span>
                                        <span>
                                            {isDropdownOpen ? "˄" : "˅"}
                                        </span>
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="pl-4 mt-1">
                                            {item.children?.map((child) => (
                                                <li key={child.text}>
                                                    <Link
                                                        href={child.href}
                                                        className={`block py-1 text-sm ${
                                                            isActive(child.href)
                                                                ? "bg-white text-primary rounded"
                                                                : ""
                                                        }`}
                                                    >
                                                        {child.text}
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
                                        className={`block py-2 text-sm flex items-center ${
                                            isActive(item.href!)
                                                ? "bg-white text-primary rounded"
                                                : ""
                                        }`}
                                    >
                                        <i className={`${item.icon} mr-2`} />
                                        {item.text}
                                    </Link>
                                </li>
                            )
                        )}

                        {adminItems.map((item) => (
                            <li key={item.text}>
                                <Link
                                    href={item.href}
                                    className={`block py-2 text-sm flex items-center ${
                                        isActive(item.href)
                                            ? "bg-white text-primary rounded"
                                            : ""
                                    }`}
                                >
                                    <i className={item.icon}></i>
                                    <span className="ml-2">{item.text}</span>
                                </Link>
                            </li>
                        ))}

                        {bottomMenuItems.map((item) => (
                            <li key={item.text}>
                                <Link
                                    href={item.href}
                                    className="block py-2 text-sm"
                                >
                                    <i className={item.icon}></i>
                                    <span className="ml-2">{item.text}</span>
                                </Link>
                            </li>
                        ))}

                        <li>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left py-2 text-red-300"
                            >
                                <i className="bx bx-log-out text-lg mr-2" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default Sidebar;