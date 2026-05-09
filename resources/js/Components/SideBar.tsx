import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    ClipboardList,
    Wrench,
    ShieldCheck,
    FileText,
    User,
    LogOut,
    Menu,
    UserCircle,
    // Settings,
    BriefcaseBusiness,
    Calendar,
    Book,
    CalendarCog,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    UsersRound,
    CalendarDays,
    Building,
} from "lucide-react";
// import { Button } from "./shadcnui/button";

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
    // Only one dropdown open at a time
    const [openDropdown, setOpenDropdown] = useState<
        "workOrders" | "eventServices" | null
    >(null);
    const { post } = useForm();
    const currentRoute = route().current();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        post(route("logout"));
    };

    const isWorkOrderRequester = user.permissions.some((permission) =>
        [
            "request work orders",
            "view own work orders",
            "cancel own work orders",
        ].includes(permission)
    );
    const isEventServiceRequester = user.permissions.some((permission) =>
        [
            "request event services",
            "view own event services",
            "cancel own event services",
        ].includes(permission)
    );
    const isMaintenancePersonnel = user.roles.some(
        (role) => role.name === "maintenance_personnel"
    );
    const isWorkOrderManager = user.permissions.some(
        (permission) => permission === "manage work orders"
    );
    const isEventServicesManager = user.permissions.some(
        (permission) => permission === "manage event services"
    );
    const isSuperAdmin = user.roles.some((role) => role.name === "super_admin");

    const menuItems = !isSuperAdmin
        ? [
              ...(isMaintenancePersonnel
                  ? [
                        {
                            routeName: "work-orders.assigned-tasks",
                            href: route("work-orders.assigned-tasks") || "",
                            text: "Assigned Tasks",
                            icon: (
                                <BriefcaseBusiness
                                    size={16}
                                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                />
                            ),
                        },
                    ]
                  : []),

              ...((isWorkOrderRequester && !isWorkOrderManager)
                  ? [
                        {
                            routeName: "work-orders.index",
                            href: route("work-orders.index") || "",
                            text: "My Work Orders",
                            icon: (
                                <ClipboardList
                                    size={16}
                                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                />
                            ),
                        },
                    ]
                  : []),

              ...(((isEventServiceRequester || isWorkOrderRequester) && !isEventServicesManager) 
                  ? [
                        {
                            routeName: "booking-calendar",
                            href: route("booking-calendar") || "",
                            text: "Booking Calendar",
                            icon: (
                                <CalendarDays
                                    size={16}
                                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                />
                            ),
                        },
                        {
                            // Exclude this from side bar, include this and the 'work-orders.submit-request' in the Breadcrumbs component
                            routeName: "event-services.request",
                            href: route("event-services.request") || "",
                            text: "Event Services Request",
                            icon: (
                                <FileText
                                    size={16}
                                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                />
                            ),
                        },
                        {
                            routeName: "event-services.my-bookings",
                            href: route("event-services.my-bookings") || "",
                            text: user.roles.some(
                                (r) => r.name === "communications_officer"
                            )
                                ? "Requests Management"
                                : user.roles.some(
                                      (r) => r.name === "gasd_coordinator"
                                  )
                                ? "Event Services"
                                : "My Bookings",
                            icon: user.roles.some(
                                (r) => r.name === "communications_officer"
                            ) ? (
                                <CalendarCog
                                    size={16}
                                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                />
                            ) : (
                                <Book
                                    size={16}
                                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                />
                            ),
                        },
                    ]
                  : []),
          ]
        : [];

    const hasRoute = (name: string) => {
        return typeof route().has === "function" ? route().has(name) : false;
    };

    const workOrderAdminItems = [
        hasRoute("work-orders.index") && {
            routeName: "work-orders.index",
            href: route("work-orders.index") || "",
            text: "Work Order Requests",
            icon: (
                <ClipboardList
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        hasRoute("assets.index") && {
            routeName: "assets.index",
            href: route("assets.index") || "",
            text: "Asset Management",
            icon: (
                <Wrench
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        hasRoute("work-orders.preventive-maintenance") && {
            routeName: "work-orders.preventive-maintenance",
            href: route("work-orders.preventive-maintenance") || "",
            text: "Preventive Maintenance",
            icon: (
                <ShieldCheck
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        hasRoute("work-orders.compliance-and-safety") && {
            routeName: "work-orders.compliance-and-safety",
            href: route("work-orders.compliance-and-safety") || "",
            text: "Compliance and Safety",
            icon: (
                <FileText
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },

        // {
        //     routeName: "event-services.my-bookings",
        //     href: route("event-services.my-bookings") || "",
        //     text: user.roles.some((r) => r.name === "communications_officer")
        //         ? "Requests Management"
        //         : user.roles.some((r) => r.name === "gasd_coordinator")
        //         ? "Event Services"
        //         : "My Bookings",
        //     icon: user.roles.some(
        //         (r) => r.name === "communications_officer"
        //     ) ? (
        //         <CalendarCog
        //             size={16}
        //             className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
        //         />
        //     ) : (
        //         <Book
        //             size={16}
        //             className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
        //         />
        //     ),
        // },
    ].filter(Boolean);

    // Insert the following routes if there are pages na.
    const eventServicesAdminItems = [
        {
            routeName: "booking-calendar",
            href: route("booking-calendar") || "",
            text: "Booking Calendar",
            icon: (
                <CalendarDays
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        {
            // Exclude this from side bar, include this and the 'work-orders.submit-request' in the Breadcrumbs component
            routeName: "event-services.request",
            href: route("event-services.request") || "",
            text: "Event Services Request",
            icon: (
                <FileText
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        {
            routeName: "event-services.my-bookings",
            href: route("event-services.my-bookings") || "",
            text: user.roles.some((r) => r.name === "communications_officer")
                ? "Requests Management"
                : user.roles.some((r) => r.name === "gasd_coordinator")
                ? "Event Services"
                : "My Bookings",
            icon: user.roles.some(
                (r) => r.name === "communications_officer"
            ) ? (
                <CalendarCog
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ) : (
                <Book
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        // {
        //     routeName: "",
        //     href: "",
        //     text: "Requests Management",
        //     icon: (
        //         <CalendarCog
        //             size={16}
        //             className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
        //         />
        //     ),
        // },
        // {
        //     routeName: "",
        //     href: "",
        //     text: "Venue Management",
        //     icon: (
        //         <FileText
        //             size={16}
        //             className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
        //         />
        //     ),
        // },
    ];

    const superAdminItems = [
        hasRoute("admin.manage-roles") && {
            routeName: "admin.manage-roles",
            href: route("admin.manage-roles") || "",
            icon: (
                <UsersRound
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
            text: "User Management",
        },
    ];

    const adminItems = isSuperAdmin
        ? [
              ...workOrderAdminItems,
              ...eventServicesAdminItems,
              ...superAdminItems,
          ]
        : isWorkOrderManager
        ? workOrderAdminItems
        : isEventServicesManager
        ? eventServicesAdminItems
        : [];

    // Work Orders dropdown items for super admin
    const workOrdersDropdownItems = [
        {
            routeName: "work-orders.index",
            href: route("work-orders.index") || "",
            text: "Work Order Requests",
            icon: (
                <ClipboardList
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        {
            routeName: "assets.index",
            href: route("assets.index") || "",
            text: "Asset Management",
            icon: (
                <Wrench
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        {
            routeName: "work-orders.preventive-maintenance",
            href: route("work-orders.preventive-maintenance") || "",
            text: "Preventive Maintenance",
            icon: (
                <ShieldCheck
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        {
            routeName: "work-orders.compliance-and-safety",
            href: route("work-orders.compliance-and-safety") || "",
            text: "Compliance and Safety",
            icon: (
                <FileText
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
    ].filter((item) => item.href);

    // Event Services dropdown items for super admin
    const eventServicesDropdownItems = [
        {
            routeName: "booking-calendar",
            href: route("booking-calendar") || "",
            text: "Booking Calendar",
            icon: (
                <CalendarDays
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        {
            routeName: "event-services.request",
            href: route("event-services.request") || "",
            text: "Event Services Request",
            icon: (
                <FileText
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        {
            routeName: "event-services.my-bookings",
            href: route("event-services.my-bookings") || "",
            text: user.roles.some(
                (r) => r.name === "communications_officer" || "super_admin"
            )
                ? "Requests Management"
                : "My Bookings",
            icon: user.roles.some(
                (r) => r.name === "communications_officer"
            ) ? (
                <CalendarCog
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ) : (
                <Book
                    size={16}
                    className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                />
            ),
        },
        // {
        //     routeName: "",
        //     href: "",
        //     text: "Requests Management",
        //     icon: (
        //         <CalendarCog
        //             size={16}
        //             className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
        //         />
        //     ),
        // },
        // {
        //     routeName: "",
        //     href: "",
        //     text: "Venue Management",
        //     icon: (
        //         <FileText
        //             size={16}
        //             className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
        //         />
        //     ),
        // },
    ];

    // User Management tab for super admin
    const userManagementItem =
        isSuperAdmin && hasRoute("admin.manage-roles")
            ? {
                  routeName: "admin.manage-roles",
                  href: route("admin.manage-roles") || "",
                  icon: (
                      <UsersRound
                          size={16}
                          className="mr-4 md:mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                      />
                  ),
                  text: "User Management",
              }
            : null;

    // Keep only one dropdown open at a time, and auto-open if a child is active
    React.useEffect(() => {
        if (isSuperAdmin) {
            if (
                workOrdersDropdownItems.some(
                    (item) => item.routeName && currentRoute === item.routeName
                )
            ) {
                setOpenDropdown("workOrders");
            } else if (
                eventServicesDropdownItems.some(
                    (item) => item.routeName && currentRoute === item.routeName
                )
            ) {
                setOpenDropdown("eventServices");
            }
        }
        // eslint-disable-next-line
    }, [currentRoute]);

    const isActive = (routeName: string) => currentRoute === routeName;

    const renderMenuItem = (item: any) => (
        <li key={item.text}>
            <Link
                href={item.href}
                className={`flex items-center text-sm xs:text-base md:text-sm h-12 pr-2 hover:text-opacity-80 ${
                    isActive(item.routeName)
                        ? "bg-white text-primary border-r-4 border-primary rounded-l-lg pl-4 mr-1 ml-3 rounded-full"
                        : "text-white"
                } pl-4`}
            >
                {item.icon}
                {item.text}
            </Link>
        </li>
    );

    // Helper for dropdown animation
    const Dropdown = ({
        open,
        children,
    }: {
        open: boolean;
        children: React.ReactNode;
    }) => (
        <ul
            className={`ml-4 transition-all duration-300 ease-in-out overflow-hidden ${
                open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
            style={{ transitionProperty: "max-height, opacity" }}
        >
            {children}
        </ul>
    );

    return (
        <>
            {/* --- Desktop Sidebar --- */}
            <div className="hidden md:flex fixed min-h-screen max-h-screen bg-primary w-56 flex-col">
                <div className="flex items-center justify-center mt-4 py-4">
                    <img
                        src="/images/lvlogo.jpg"
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
                            <LayoutDashboard
                                size={16}
                                className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                            />
                            Dashboard
                        </Link>
                    </li>
                    {/* Super Admin Dropdowns */}
                    {isSuperAdmin ? (
                        <>
                            {/* Work Orders Dropdown */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenDropdown(
                                            openDropdown === "workOrders"
                                                ? null
                                                : "workOrders"
                                        )
                                    }
                                    className="flex items-center w-full h-12 pl-4 pr-2 text-white text-sm hover:text-opacity-80 focus:outline-none"
                                >
                                    <Building
                                        size={16}
                                        className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                    />
                                    Work Orders
                                    <span className="ml-auto">
                                        {openDropdown === "workOrders" ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </span>
                                </button>
                                <Dropdown open={openDropdown === "workOrders"}>
                                    {workOrdersDropdownItems.map((item) =>
                                        renderMenuItem(item)
                                    )}
                                </Dropdown>
                            </li>
                            {/* Event Services Dropdown */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenDropdown(
                                            openDropdown === "eventServices"
                                                ? null
                                                : "eventServices"
                                        )
                                    }
                                    className="flex items-center w-full h-12 pl-4 pr-2 text-white text-sm hover:text-opacity-80 focus:outline-none"
                                >
                                    <CalendarCog
                                        size={16}
                                        className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                    />
                                    Event Services
                                    <span className="ml-auto">
                                        {openDropdown === "eventServices" ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </span>
                                </button>
                                <Dropdown
                                    open={openDropdown === "eventServices"}
                                >
                                    {eventServicesDropdownItems.map((item) =>
                                        renderMenuItem(item)
                                    )}
                                </Dropdown>
                            </li>
                        </>
                    ) : (
                        // <>
                        //     {menuItems.map(renderMenuItem)}
                        //     {adminItems.map(renderMenuItem)}
                        // </>

                        // Fixes the duplicated items for comms officer
                        <>
                            {adminItems.length > 0
                                ? adminItems.map(renderMenuItem)
                                : menuItems.map(renderMenuItem)}
                        </>
                    )}
                </ul>

                {/* Bottom Links */}
                <ul className="py-4">
                    {isSuperAdmin && userManagementItem && (
                        <li>
                            <Link
                                href={userManagementItem.href}
                                className={`flex items-center w-full h-12 pl-4 pr-2 text-sm hover:text-opacity-80 ${
                                    isActive(userManagementItem.routeName)
                                        ? "bg-white text-primary border-r-4 border-primary rounded-l-lg pl-4 mr-1 ml-3 rounded-full"
                                        : "text-white"
                                }`}
                                style={
                                    isActive(userManagementItem.routeName)
                                        ? {
                                              boxShadow:
                                                  "0 0 0 1px #fff, 0 0 0 4px #fff",
                                          }
                                        : undefined
                                }
                            >
                                {userManagementItem.icon}
                                <span>{userManagementItem.text}</span>
                            </Link>
                        </li>
                    )}
                    <li>
                        {/* <Link
                            href="#"
                            className="flex items-center w-full h-12 pl-4 pr-2 text-white text-sm hover:text-opacity-80"
                        >
                            <Settings
                                size={16}
                                className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                            />
                            <span>Settings</span>
                        </Link> */}
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full h-12 pl-4 pr-2 text-white text-sm hover:text-opacity-80"
                        >
                            <LogOut
                                size={16}
                                className="mr-2 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                            />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* --- Mobile Navbar --- */}
            <div className="md:hidden fixed bottom-0 w-full bg-primary text-white shadow-md z-50">
                <div className="flex items-center justify-between px-2 py-3 h-16 xs:h-[4.2rem]">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`flex flex-col items-center text-xs sm:text-sm px-4 xs:px-8 py-1 transition ${
                            mobileMenuOpen
                                ? "bg-white text-primary"
                                : "text-white hover:text-opacity-80"
                        }`}
                    >
                        <Menu className="w-6 h-6 xs:w-7 xs:h-7" />
                        Menu
                    </button>
                    <Link
                        href={route("dashboard")}
                        className={`flex flex-col items-center text-xs sm:text-sm px-4 xs:px-8 py-1 rounded-md transition ${
                            currentRoute === "dashboard"
                                ? "bg-white text-primary"
                                : "text-white hover:text-opacity-80"
                        }`}
                    >
                        <LayoutDashboard
                            size={16}
                            className="w-6 h-6 xs:w-7 xs:h-7"
                        />
                        Dashboard
                    </Link>
                    {isWorkOrderRequester
                        ? [
                              <>
                                  <Link
                                      href={route("work-orders.index")}
                                      className={`flex flex-col items-center text-xs sm:text-sm text-center px-4 xs:px-8 py-1 rounded-md transition ${
                                          currentRoute === "work-orders.index"
                                              ? "bg-white text-primary"
                                              : "text-white hover:text-opacity-80"
                                      }`}
                                  >
                                      <Building
                                          size={16}
                                          className="w-6 h-6 xs:w-7 xs:h-7"
                                      />
                                      Work Orders
                                  </Link>
                                  {isEventServiceRequester && (
                                      <Link
                                          href={route(
                                              "event-services.my-bookings"
                                          )}
                                          className={`flex flex-col items-center text-xs sm:text-sm text-center px-4 xs:px-8 py-1 rounded-md transition ${
                                              currentRoute ===
                                              "event-services.my-bookings"
                                                  ? "bg-white text-primary"
                                                  : "text-white hover:text-opacity-80"
                                          }`}
                                      >
                                          <Book
                                              size={16}
                                              className="w-6 h-6 xs:w-7 xs:h-7"
                                          />
                                          Bookings
                                      </Link>
                                  )}
                              </>,
                          ]
                        : isMaintenancePersonnel ? [
                              <>
                                  <Link
                                      href={route("work-orders.assigned-tasks")}
                                      className={`flex flex-col items-center text-xs sm:text-sm text-center px-4 xs:px-8 py-1 rounded-md transition ${
                                          currentRoute ===
                                          "work-orders.assigned-tasks"
                                              ? "bg-white text-primary"
                                              : "text-white hover:text-opacity-80"
                                      }`}
                                  >
                                      <BriefcaseBusiness
                                          size={16}
                                          className="w-6 h-6 xs:w-7 xs:h-7"
                                      />
                                      My Tasks
                                  </Link>
                              </>,
                          ] : [
                              <>
                                  <Link
                                      href={route("event-services.my-bookings")}
                                      className={`flex flex-col items-center text-xs sm:text-sm text-center px-4 xs:px-8 py-1 rounded-md transition ${
                                          currentRoute ===
                                          "event-services.my-bookings"
                                              ? "bg-white text-primary"
                                              : "text-white hover:text-opacity-80"
                                      }`}
                                  >
                                      <Book
                                          size={16}
                                          className="w-6 h-6 xs:w-7 xs:h-7"
                                      />
                                      My Bookings
                                  </Link>
                              </>,
                          ]}
                    <Link
                        href={route("profile.edit")}
                        className={`flex flex-col items-center text-xs sm:text-sm px-4 xs:px-8 py-1 rounded-md transition ${
                            currentRoute === "profile.edit"
                                ? "bg-white text-primary"
                                : "text-white hover:text-opacity-80"
                        }`}
                    >
                        <UserCircle
                            size={16}
                            className="w-6 h-6 xs:w-7 xs:h-7"
                        />
                        Profile
                    </Link>
                </div>
            </div>

            {/* --- Mobile Burger Full Page Overlay --- */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-0 left-0 w-full h-full bg-primary text-white text-md xs:text-lg z-50 p-5 pt-6 overflow-y-auto flex flex-col justify-between">
                    {/* Top content */}
                    <div>
                        <div className="relative mb-6">
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute left-0 top-0 flex items-center text-white hover:text-opacity-80"
                            >
                                <ArrowLeft
                                    size={16}
                                    className="w-6 h-6 xs:w-7 xs:h-7 mr-4"
                                />
                                Back
                            </button>

                            <hr className="absolute mt-12 w-full" />
                            <Link
                                href={route("dashboard")}
                                className="flex justify-center pt-20 py-4"
                            >
                                <img
                                    src="/images/lvlogo.jpg"
                                    alt="Logo"
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            </Link>
                        </div>

                        {/* Super Admin Dropdowns */}
                        {isSuperAdmin ? (
                            <>
                                {/* Work Orders Dropdown */}
                                <div className="border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenDropdown(
                                                openDropdown === "workOrders"
                                                    ? null
                                                    : "workOrders"
                                            )
                                        }
                                        className="flex items-center w-full px-4 py-3 text-white text-base xs:text-lg hover:bg-white hover:text-primary rounded-lg transition focus:outline-none"
                                    >
                                        <Building
                                            size={16}
                                            className="mr-4 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                        />
                                        Work Orders
                                        <span className="ml-auto">
                                            {openDropdown === "workOrders" ? (
                                                <ChevronUp size={16} />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )}
                                        </span>
                                    </button>
                                    <Dropdown
                                        open={openDropdown === "workOrders"}
                                    >
                                        {workOrdersDropdownItems.map((item) =>
                                            renderMenuItem(item)
                                        )}
                                    </Dropdown>
                                </div>

                                {/* Event Services Dropdown */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenDropdown(
                                                openDropdown === "eventServices"
                                                    ? null
                                                    : "eventServices"
                                            )
                                        }
                                        className="flex items-center w-full px-4 py-3 text-white text-base xs:text-lg hover:bg-white hover:text-primary rounded-lg transition focus:outline-none"
                                    >
                                        <Calendar
                                            size={16}
                                            className="mr-4 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                                        />
                                        Event Services
                                        <span className="ml-auto">
                                            {openDropdown ===
                                            "eventServices" ? (
                                                <ChevronUp size={16} />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )}
                                        </span>
                                    </button>
                                    <Dropdown
                                        open={openDropdown === "eventServices"}
                                    >
                                        {eventServicesDropdownItems.map(
                                            (item) => renderMenuItem(item)
                                        )}
                                    </Dropdown>
                                </div>
                            </>
                        ) : (
                            <>
                                {adminItems.length > 0 && (
                                    <div className="border-t pt-4 mt-4 space-y-1 list-none">
                                        {adminItems.map(renderMenuItem)}
                                    </div>
                                )}
                                <div className="space-y-1 border-t pt-4 list-none">
                                    {menuItems.map(renderMenuItem)}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom content */}
                    <div className="border-t pt-4 mt-4 space-y-1 list-none ">
                        {isSuperAdmin && userManagementItem && (
                            <Link
                                href={userManagementItem.href}
                                className={`flex items-center px-4 py-3 text-base xs:text-lg hover:bg-white hover:text-primary rounded-lg transition ${
                                    isActive(userManagementItem.routeName)
                                        ? "bg-white text-primary"
                                        : ""
                                }`}
                            >
                                {userManagementItem.icon}
                                {userManagementItem.text}
                            </Link>
                        )}
                        {/* <Link
                            href="#"
                            className="flex items-center px-4 py-3 hover:bg-white hover:text-primary rounded-lg transition"
                        >
                            <Settings
                                size={16}
                                className="mr-4 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                            />
                            Settings
                        </Link> */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-3 text-red-300 hover:bg-white hover:text-red-500 rounded-lg w-full transition"
                        >
                            <LogOut
                                size={16}
                                className="mr-4 w-6 h-6 xs:w-7 xs:h-7 md:w-4 md:h-4"
                            />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
