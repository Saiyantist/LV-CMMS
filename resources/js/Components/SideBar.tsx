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
    UserCircle,
    Settings,
    BriefcaseBusiness,
    Calendar,
    Book,
    CalendarCog,
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { post } = useForm();
    const currentRoute = route().current();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        post(route("logout"));
    };

    const isWorkOrderRequester = user.permissions.some((permission) =>
        ["request work orders", "view own work orders", "cancel own work orders",]
        .includes(permission));
    const isEventServiceRequester = user.permissions.some((permission) => 
        ['request event services', 'view own event services', 'cancel own event services']
        .includes(permission));
    const isMaintenancePersonnel = user.roles.some((role) => role.name === "maintenance_personnel");
    const isWorkOrderManager = user.permissions.some((permission) => permission === "manage work orders");
    const isEventServicesManager = user.permissions.some((permission) => permission === "manage event services");
    const isSuperAdmin = user.roles.some((role) => role.name === "super_admin");

    const menuItems = !isSuperAdmin
        ? [
        ...(isMaintenancePersonnel
            ? [
                  {
                      routeName: "work-orders.assigned-tasks",
                      href: route("work-orders.assigned-tasks") || "",
                      text: "Assigned Tasks",
                      icon: <BriefcaseBusiness size={16} className="mr-2" />,
                  },
              ]
            : []),

        ...( isWorkOrderRequester && !isWorkOrderManager
            ? [
                {
                    routeName: "work-orders.index",
                    href: route("work-orders.index") || "",
                    text: "My Work Orders",
                    icon: <ClipboardList size={16} className="mr-2" />,
                },
              ]
            : []),

        ... ( isEventServiceRequester || isEventServicesManager
            ? [
                {
                    routeName: "booking-calendar",
                    href: route("booking-calendar") || "",
                    text: "Booking Calendar",
                    icon: <Calendar size={16} className="mr-2" />,
                },
                {   // Exclude this from side bar, include this and the 'work-orders.submit-request' in the Breadcrumbs component
                    routeName: "event-services.request",
                    href: route("event-services.request") || "",
                    text: "Event Services Request (temp)",
                    icon: <FileText size={16} className="mr-2" />,
                },
                {
                    routeName: "event-services.my-bookings",
                    href: route("event-services.my-bookings") || "",
                    text: "My Bookings",
                    icon: <Book size={16} className="mr-2" />,
                },
              ]
            : []),
        ]
        : [];

    const hasRoute = (name: string) => {
        return typeof route().has === "function" ? route().has(name) : false;
    };

    const workOrderAdminItems = [
        hasRoute("assets.index") && {
            routeName: "work-orders.index",
            href: route("work-orders.index") || "",
            text: "Work Order Requests",
            icon: <ClipboardList size={16} className="mr-2" />,
        },
        hasRoute("assets.index") && {
            routeName: "assets.index",
            href: route("assets.index") || "",
            text: "Asset Management",
            icon: <Wrench size={14} className="mr-2" />,
        },
        hasRoute("work-orders.preventive-maintenance") && {
            routeName: "work-orders.preventive-maintenance",
            href: route("work-orders.preventive-maintenance") || "",
            text: "Preventive Maintenance",
            icon: <ShieldCheck size={14} className="mr-2" />,
        },
        hasRoute("work-orders.compliance-and-safety") && {
            routeName: "work-orders.compliance-and-safety",
            href: route("work-orders.compliance-and-safety") || "",
            text: "Compliance and Safety",
            icon: <FileText size={14} className="mr-2" />,
        },
    ].filter(Boolean);

    // Insert the following routes if there are pages na.
    const eventServicesAdminItems = [
        {
            routeName: "",
            href: "",
            text: "Requests Management",
            icon: <CalendarCog size={16} className="mr-2" />,
        },
        {
            routeName: "",
            href: "",
            text: "Venue Management",
            icon: <FileText size={16} className="mr-2" />,
        },
    ];

    const superAdminItems = 
    [
        hasRoute("admin.manage-roles") && {
            routeName: "admin.manage-roles",
            href: route("admin.manage-roles") || "",
            icon: <User size={16} className="mr-2" />,
            text: "User Management",
        },
    ]
    
    const adminItems = isSuperAdmin ? [...workOrderAdminItems, ...eventServicesAdminItems, ...superAdminItems]
            : isWorkOrderManager
                ? workOrderAdminItems : isEventServicesManager
                ? eventServicesAdminItems : [];
            
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
                    {item.children?.map((child: any) =>
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
                <div className="flex items-center justify-center mt-4 py-4">
                    <img
                        src="/images/Lvlogo.jpg"
                        alt="Logo"
                        className="h-16 w-auto object-contain rounded-full"
                    />
                </div>

                {/* Top Links */}
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
                    {menuItems.map(renderMenuItem)}
                    {adminItems.map(renderMenuItem)}
                </ul>

                {/* Bottom Links */}
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

            {/* --- Mobile Navbar --- */}
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
                    <div className="relative mb-6">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute left-0 top-1 text-sm flex items-center text-white hover:text-opacity-80"
                        >
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

                    <div className="space-y-1 border-t border-white border-opacity-20 pt-4">
                        {menuItems.map(renderMenuItem)}
                    </div>

                    {adminItems.length > 0 && (
                        <div className="border-t border-white border-opacity-20 pt-4 mt-4 space-y-1">
                            {adminItems.map(renderMenuItem)}
                        </div>
                    )}

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
