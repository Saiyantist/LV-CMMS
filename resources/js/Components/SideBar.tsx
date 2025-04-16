import React, { useState } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import {
    Home,
    ClipboardList,
    Wrench,
    ShieldCheck,
    Send,
    User,
    LogOut,
    Menu,
    ChevronDown,
    ChevronUp,
    UserCircle,
    Settings,
} from "lucide-react";

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
            text: "Work Order",
            isDropdown: true,
            icon: <ClipboardList size={16} className="mr-2" />,
            children: [
                {
                    routeName: "work-orders.index",
                    href: route("work-orders.index") || "",
                    text: isWorkOrderManager
                        ? "Work Order Requests"
                        : "Work Order List",
                    icon: <ClipboardList size={14} className="mr-2" />,
                },
                {
                    routeName: "work-orders.assetmanagement",
                    href: route("work-orders.assetmanagement") || "",
                    text: "Asset Management",
                    icon: <Wrench size={14} className="mr-2" />,
                },
                {
                    routeName: "work-orders.preventive-maintenance",
                    href: route("work-orders.preventive-maintenance") || "",
                    text: "Preventive Maintenance",
                    icon: <ShieldCheck size={14} className="mr-2" />,
                },
                {
                    routeName: "work-orders.submit-request",
                    href: route("work-orders.submit-request") || "",
                    text: "Submit a Request",
                    icon: <Send size={14} className="mr-2" />,
                },
            ],
        },
    ];

    const adminItems = user.roles.some((role) => role.name === "super_admin")
        ? [
              {
                  routeName: "admin.manage-roles",
                  href: route("admin.manage-roles") || "",
                  icon: <User size={16} className="mr-2" />,
                  text: "User Management",
              },
          ]
        : [];

    const isActive = (routeName: string) => currentRoute === routeName;

    const renderMenuItem = (item: any) => (
        <li key={item.text}>
            <Link
                href={item.href}
                className={`flex items-center h-12 pr-2 text-sm hover:text-opacity-80 ${
                    isActive(item.routeName)
                        ? "bg-white text-primary border-r-4 border-primary rounded-l-lg pl-6 mr-1 ml-3 rounded-full"
                        : "text-white"
                } ${item.isChild ? "pl-8" : "pl-4"}`}
            >
                {item.icon}
                {item.text}
            </Link>
        </li>
    );

    const renderDropdownMenu = (item: any) => (
        <li key={item.text}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center w-full h-12 pl-4 pr-2 text-white hover:text-opacity-80"
            >
                <span className="text-sm font-medium flex items-center">
                    {item.icon}
                    {item.text}
                    <span className="ml-1">
                        {isDropdownOpen ? (
                            <ChevronUp size={14} />
                        ) : (
                            <ChevronDown size={14} />
                        )}
                    </span>
                </span>
            </button>
            {isDropdownOpen && (
                <ul>
                    {item.children?.map((child) =>
                        renderMenuItem({ ...child, isChild: true })
                    )}
                </ul>
            )}
        </li>
    );

    return (
        <>
            {/* --- Desktop Sidebar --- */}
            <div className="hidden md:flex fixed min-h-screen max-h-screen bg-primary w-56 flex-col">
                <div className="flex items-center justify-center h-24">
                    <img
                        src="/images/Lvlogo.jpg"
                        alt="Logo"
                        className="h-20 w-auto object-contain rounded-full"
                    />
                </div>

                <ul className="flex flex-col py-4 flex-grow">
                    <li>
                        <Link
                            href={route("dashboard")}
                            className={`flex items-center h-12 pl-4 pr-2 text-sm hover:text-opacity-80 ${
                                currentRoute === "dashboard"
                                    ? "bg-white text-primary border-r-4 border-primary rounded-l-lg pl-6 mr-1 ml-3 rounded-full"
                                    : "text-white"
                            }`}
                        >
                            <Home size={16} className="mr-2" />
                            Dashboard
                        </Link>
                    </li>
                    {menuItems.map((item) =>
                        item.isDropdown
                            ? renderDropdownMenu(item)
                            : renderMenuItem(item)
                    )}
                    {adminItems.map(renderMenuItem)}
                </ul>

                <ul className="py-4">
                    <li>
                        <Link
                            href="#"
                            className="flex items-center w-full h-12 pl-4 pr-2 text-white text-sm hover:text-opacity-80"
                        >
                            <Settings size={16} className="mr-2" />
                            <span>Settings</span>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full h-12 pl-4 pr-2 text-white text-sm hover:text-opacity-80"
                        >
                            <LogOut size={16} className="mr-2" />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* --- Mobile Navbar (Unified Layout) --- */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-primary text-white shadow-md z-50">
                <div className="flex flex-col">
                    {/* Top: Logo + Burger */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <img
                            src="/images/Lvlogo.jpg"
                            alt="Logo"
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="focus:outline-none"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Nav Icons */}
                    <div className="flex justify-around px-2 py-2">
                        <Link
                            href={route("dashboard")}
                            className="flex flex-col items-center text-sm hover:text-opacity-80"
                        >
                            <Home size={18} />
                            Dashboard
                        </Link>
                        <Link
                            href={route("profile.edit")}
                            className="flex flex-col items-center text-sm hover:text-opacity-80"
                        >
                            <UserCircle size={18} />
                            Profile
                        </Link>
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="flex flex-col items-center text-sm hover:text-opacity-80"
                            >
                                <ClipboardList size={18} />
                                Work Order
                                {isDropdownOpen ? (
                                    <ChevronUp size={14} />
                                ) : (
                                    <ChevronDown size={14} />
                                )}
                            </button>
                            {isDropdownOpen && (
                                <ul className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-primary text-white rounded shadow-md z-50 w-56 p-2 space-y-1 border border-white border-opacity-20">
                                    {menuItems[0].children?.map((child) =>
                                        renderMenuItem(child)
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Mobile Dropdown (Burger menu) --- */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-[104px] left-2 right-2 z-40 bg-white text-gray-900 rounded-xl shadow-lg p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <ul className="space-y-3">
                        {adminItems.length > 0 && (
                            <>
                                <li className="text-xs text-gray-500 uppercase tracking-wide px-1">
                                    Admin
                                </li>
                                {adminItems.map((item) => (
                                    <li key={item.text}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center text-sm text-gray-800 hover:text-primary"
                                        >
                                            {item.icon}
                                            {item.text}
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}
                        <li className="text-xs text-gray-500 uppercase tracking-wide px-1 mt-3">
                            General
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="flex items-center text-sm text-gray-800 hover:text-primary"
                            >
                                <Settings size={16} className="mr-2" />
                                Settings
                            </Link>
                        </li>

                        <li className="border-t border-gray-200 pt-3 mt-3">
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-sm text-red-500 hover:text-red-700 w-full"
                            >
                                <LogOut size={16} className="mr-2" />
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
