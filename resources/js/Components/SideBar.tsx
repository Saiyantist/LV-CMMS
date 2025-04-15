import React, { useState } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import {
    Home,
    ClipboardList,
    Wrench,
    ShieldCheck,
    Send,
    User,
    Bell,
    LogOut,
    MoreVertical,
    ChevronDown,
    ChevronUp,
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
            href: route("dashboard"),
            text: "Dashboard",
            icon: <Home size={16} className="mr-2" />,
        },
        {
            text: "Work Order",
            isDropdown: true,
            icon: <ClipboardList size={16} className="mr-2" />,
            children: [
                {
                    href: route("work-orders.index"),
                    text: isWorkOrderManager
                        ? "Work Order Requests"
                        : "Work Order List",
                    icon: <ClipboardList size={14} className="mr-2" />,
                },
                {
                    href: route("work-orders.assetmanagement"),
                    text: "Asset Management",
                    icon: <Wrench size={14} className="mr-2" />,
                },
                {
                    href: route("work-orders.preventive-maintenance"),
                    text: "Preventive Maintenance",
                    icon: <ShieldCheck size={14} className="mr-2" />,
                },
                {
                    href: route("work-orders.submit-request"),
                    text: "Submit a Request",
                    icon: <Send size={14} className="mr-2" />,
                },
            ],
        },
    ];

    const adminItems = user.roles.some((role) => role.name === "super_admin")
        ? [
              {
                  href: route("admin.manage-roles"),
                  icon: <User size={16} className="mr-2" />,
                  text: "User Management",
              },
          ]
        : [];

    const bottomMenuItems = [
        { href: "#", icon: <Bell size={16} />, text: "Settings" },
    ];

    const isActive = (href: string) => currentRoute === href;

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
                    {menuItems.map((item) =>
                        item.isDropdown ? (
                            <li key={item.text}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex items-center w-full h-12 px-4 text-white hover:text-opacity-80"
                                >
                                    <span className="text-sm font-medium flex items-center justify-between w-full">
                                        {item.icon}
                                        {item.text}
                                        <span className="ml-2">
                                            {isDropdownOpen ? (
                                                <ChevronUp size={14} />
                                            ) : (
                                                <ChevronDown size={14} />
                                            )}
                                        </span>
                                    </span>
                                </button>
                                {isDropdownOpen && (
                                    <ul className="ml-4">
                                        {item.children?.map((child) => (
                                            <li key={child.text}>
                                                <Link
                                                    href={child.href}
                                                    className={`flex items-center h-10 px-4 text-sm hover:text-opacity-80 ${
                                                        isActive(child.href)
                                                            ? "bg-white text-primary rounded"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    {child.icon}
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
                                    {item.icon}
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
                                {item.icon}
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Bottom Items */}
                <ul className="py-4">
                    {bottomMenuItems.map((item) => (
                        <li key={item.text}>
                            <Link
                                href={item.href}
                                className="flex items-center h-12 px-4 text-white text-sm hover:text-opacity-80"
                            >
                                {item.icon}
                                <span className="ml-2">{item.text}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full h-12 px-4 text-white text-sm hover:text-opacity-80"
                        >
                            <LogOut size={16} className="mr-2" />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* --- Mobile Top Navbar --- */}
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
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* --- Mobile Dropdown Menu --- */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-primary text-white px-4 py-2 mt-[64px] z-40 fixed top-0 left-0 w-full overflow-y-auto max-h-[calc(100vh-64px)]">
                    <ul className="space-y-2">
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
                                            {item.icon}
                                            {item.text}
                                        </span>
                                        {isDropdownOpen ? (
                                            <ChevronUp size={14} />
                                        ) : (
                                            <ChevronDown size={14} />
                                        )}
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="pl-4 mt-1 space-y-1">
                                            {item.children?.map((child) => (
                                                <li key={child.text}>
                                                    <Link
                                                        href={child.href}
                                                        className={`flex items-center py-1 text-sm ${
                                                            isActive(child.href)
                                                                ? "bg-white text-primary rounded px-2"
                                                                : ""
                                                        }`}
                                                    >
                                                        {child.icon}
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
                                        className={`flex items-center py-2 text-sm ${
                                            isActive(item.href!)
                                                ? "bg-white text-primary rounded px-2"
                                                : ""
                                        }`}
                                    >
                                        {item.icon}
                                        {item.text}
                                    </Link>
                                </li>
                            )
                        )}

                        {adminItems.map((item) => (
                            <li key={item.text}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center py-2 text-sm ${
                                        isActive(item.href)
                                            ? "bg-white text-primary rounded px-2"
                                            : ""
                                    }`}
                                >
                                    {item.icon}
                                    {item.text}
                                </Link>
                            </li>
                        ))}

                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left py-2 text-red-300"
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
