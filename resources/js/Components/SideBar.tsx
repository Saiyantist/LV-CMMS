import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import {
    Home,
    ClipboardList,
    Wrench,
    ShieldCheck,
    FileText,
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
    permissions: Array<string>;
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

    const isWorkOrderManager = user.permissions.some(
        (permission) => permission === "manage work orders"
    );
    const isSuperAdmin = user.roles.some((role) => role.name === "super_admin");
    const isGasdCoordinator = user.roles.some(
        (role) => role.name === "gasd_coordinator"
    );

    const menuItems = [
        // Check if the user is not an external_requester before rendering "Work Order"
        ...(user.roles.some((role) => role.name !== "external_requester")
            ? [
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
                              icon: (
                                  <ClipboardList size={16} className="mr-2" />
                              ),
                          },
                          // Hide "Submit a Request" for WorkOrderManager, super_admin, and gasd_coordinator
                          ...(isWorkOrderManager ||
                          isSuperAdmin ||
                          isGasdCoordinator
                              ? []
                              : [
                                    {
                                        routeName: "work-orders.submit-request",
                                        href:
                                            route(
                                                "work-orders.submit-request"
                                            ) || "",
                                        text: "Submit a Request",
                                        icon: (
                                            <Send size={14} className="mr-2" />
                                        ),
                                    },
                                ]),
                      ],
                  },
              ]
            : []),
    ];

    const adminItems =
        isSuperAdmin || isWorkOrderManager
            ? [
                  {
                      routeName: "work-orders.asset-management",
                      href: route("work-orders.asset-management") || "",
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
                      routeName: "work-orders.compliance-and-safety",
                      href: route("work-orders.compliance-and-safety") || "",
                      text: "Compliance and Safety",
                      icon: <FileText size={14} className="mr-2" />,
                  },
                  isSuperAdmin && {
                      routeName: "admin.manage-roles",
                      href: route("admin.manage-roles") || "",
                      icon: <User size={16} className="mr-2" />,
                      text: "User Management",
                  },
              ]
            : [];

    // Menu item rendering logic remains the same
    const isActive = (routeName: string) => currentRoute === routeName;

    const renderMenuItem = (item: any) => (
        <li key={item.text}>
            <Link
                href={item.href}
                className={`flex items-center h-12 pr-2 text-sm hover:text-opacity-80 ${
                    isActive(item.routeName)
                        ? "bg-white text-primary border-r-4 border-primary rounded-l-lg pl-4 mr-1 ml-3 rounded-full"
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
                                    ? "bg-white text-primary border-r-4 border-primary rounded-l-lg pl-4 mr-1 ml-3 rounded-full"
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

            {/* --- Mobile Navbar (Updated Layout with Active Tab Styling) --- */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-primary text-white shadow-md z-50">
                <div className="flex items-center justify-between px-4 py-3 h-14">
                    <Link
                        href={route("dashboard")}
                        className={`flex flex-col items-center text-sm px-3 py-1 rounded-md transition ${
                            currentRoute === "dashboard"
                                ? "bg-white text-primary"
                                : "text-white hover:text-opacity-80"
                        }`}
                    >
                        <Home size={20} />
                        Dashboard
                    </Link>
                    <Link
                        href={route("profile.edit")}
                        className={`flex flex-col items-center text-sm px-3 py-1 rounded-md transition ${
                            currentRoute === "profile.edit"
                                ? "bg-white text-primary"
                                : "text-white hover:text-opacity-80"
                        }`}
                    >
                        <UserCircle size={20} />
                        Profile
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`focus:outline-none flex flex-col items-center text-sm px-3 py-1 rounded-md transition ${
                            mobileMenuOpen
                                ? "bg-white text-primary"
                                : "text-white hover:text-opacity-80"
                        }`}
                    >
                        <Menu size={22} />
                        Menu
                    </button>
                </div>
            </div>

            {/* --- Mobile Burger Full Page Overlay --- */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-0 left-0 w-full h-full bg-primary text-white z-50 p-5 pt-6 overflow-y-auto">
                    {/* Top Row: Back Button + Centered Logo */}
                    <div className="relative mb-6">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute left-0 top-1 text-sm flex items-center text-white hover:text-opacity-80"
                        >
                            <ChevronDown size={20} className="mr-1 rotate-90" />
                            Back
                        </button>
                        <div className="flex justify-center">
                            <img
                                src="/images/Lvlogo.jpg"
                                alt="Logo"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Work Order Dropdown */}
                    <div className="space-y-1 border-t border-white border-opacity-20 pt-4">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full text-left flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-white hover:text-primary rounded-lg transition"
                        >
                            <span className="flex items-center">
                                <ClipboardList size={18} className="mr-2" />
                                Work Order
                            </span>
                            {isDropdownOpen ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </button>
                        {isDropdownOpen && (
                            <ul className="space-y-1 mt-1">
                                {menuItems[0].children?.map((child) => (
                                    <li key={child.text}>
                                        <Link
                                            href={child.href}
                                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition ${
                                                isActive(child.routeName)
                                                    ? "bg-white text-primary"
                                                    : "hover:bg-white hover:text-primary"
                                            }`}
                                        >
                                            {child.icon}
                                            {child.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Admin Items (if any) */}
                    {adminItems.length > 0 && (
                        <div className="border-t border-white border-opacity-20 pt-4 mt-4 space-y-1">
                            {adminItems.map((item) => (
                                <Link
                                    key={item.text}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm rounded-lg transition ${
                                        isActive(item.routeName)
                                            ? "bg-white text-primary"
                                            : "hover:bg-white hover:text-primary"
                                    }`}
                                >
                                    {item.icon}
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Settings and Logout */}
                    <div className="border-t border-white border-opacity-20 pt-4 mt-4 space-y-1">
                        <Link
                            href="#"
                            className="flex items-center px-4 py-3 text-sm hover:bg-white hover:text-primary rounded-lg transition"
                        >
                            <Settings size={16} className="mr-2" />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-3 text-sm text-red-300 hover:bg-white hover:text-red-500 rounded-lg w-full transition"
                        >
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
