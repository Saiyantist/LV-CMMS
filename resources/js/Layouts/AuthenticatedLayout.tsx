import Sidebar from "@/Components/SideBar";
import NavLink from "@/Components/NavLink";
import { PropsWithChildren, ReactNode } from "react";
import { usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Pass user to Sidebar */}
            <Sidebar user={user} />

            <div className="flex-1 flex flex-col">
                <nav className="bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            <div></div>{" "}
                            {/* Empty space to push profile button to the right */}
                            <div className="sm:ms-6 sm:flex sm:items-center">
                                <NavLink
                                    href={route("profile.edit")}
                                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none border border-gray-300 shadow-sm"
                                    active={route().current("profile.edit")}
                                >
                                    <i className="bx bx-user-circle text-lg mr-2" />
                                    {user.first_name} {user.last_name}
                                </NavLink>
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
