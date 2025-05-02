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
        <div className="min-h-screen bg-gray-100">
            <Sidebar user={user} />

            {/* Wrapper for main content */}
            <div className="flex flex-col md:ml-56 pt-[104px] md:pt-0">
                {/* Top Navbar (Desktop Only) */}
                <nav className="hidden md:flex justify-end border-b border-gray-100 h-16 px-4 bg-white shadow-sm">
                    {/* Josh: Make this into a component if you keep seeing it. 👀 */}
                    <NavLink
                        href={route("profile.edit")}
                        className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300"
                        active={route().current("profile.edit")}
                    >
                        <i className="bx bx-user-circle text-lg" />
                        <span>
                            {user.first_name} {user.last_name}
                        </span>
                    </NavLink>
                </nav>

                {/* Optional Page Header */}
                {header && (
                    <header className="mt-2 max-w-7xl min-w-screen sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className="flex-1 mt-2 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
