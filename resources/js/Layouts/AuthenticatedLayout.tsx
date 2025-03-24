import Sidebar from "@/Components/SideBar";
import Dropdown from "@/Components/Dropdown";
import { PropsWithChildren, ReactNode, useState } from "react";
import { usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar here */}
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <nav className="border-b border-gray-100 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                {/* Add any other nav items if needed */}
                              <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                              {user.roles.some((role) => role.name === 'super_admin') && (
                                <NavLink
                                    href={route('admin.manage-roles')}
                                    active={route().current('admin.manage-roles')}
                                >
                                    User Management
                                </NavLink>
                              )}
                              </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.first_name} {user.last_name}
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("profile.edit")}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("logout")} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className="flex-1 py-12 px-6">{children}</main>
            </div>
        </div>
    );
}
