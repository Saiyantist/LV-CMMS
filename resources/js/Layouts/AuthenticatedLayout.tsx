import Sidebar from "@/Components/SideBar";
import NavLink from "@/Components/NavLink";
import { PropsWithChildren, ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Bell, CircleUser } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar user={{ ...user, permissions: user.permissions ?? [] }} />

            {/* Wrapper for main content */}
            <div className="flex flex-col md:ml-56 pt-[104px] md:pt-0">
                {/* Top Navbar (Desktop Only) */}
                <nav className="hidden md:flex justify-end space-x-1 h-12 px-4 bg-white shadow-sm sticky top-0 z-10">
                    {/* Josh: Make this into a component if you keep seeing it. 👀 */}
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="self-center rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={(e) => {console.log("open notifications")}}>
                    <Bell />
                    </Button>

                    <Link
                        href={route("profile.edit")}
                        className={`self-center ${
                            route().current("profile.edit") ? "" : ""
                        }`}
                    >
                        <Button
                            variant={"ghost"}
                            className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium ${
                                route().current("profile.edit") ? "border border-primary text-primaryg" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <CircleUser />
                            <span>
                                {user.first_name} {user.last_name}
                            </span>
                        </Button>
                    </Link>
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
                <main className="flex-1 mt-2 px-4 sm:px-6 lg:px-8 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
