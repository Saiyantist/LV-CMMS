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
        <div className="min-h-screen max-w-auto bg-gray-100">
            <Sidebar user={user} />

            <div className="flex flex-col ml-56">

                {/* Top Nav bar for Authenticated */}
                <nav className="border-b border-gray-100 self-end h-16 px-4">
                { /* This can be turned into a component, kung makita mo ito josh, do this. if u ignore it'll refelct on u. */}
                    <NavLink
                        href={route("profile.edit")}
                        className="flex flex-col rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none border border-gray-300 shadow-sm"
                        active={route().current("profile.edit")}
                        >
                        <i className="bx bx-user-circle text-lg mr-2" />
                        {user.first_name} {user.last_name}
                    </NavLink>

                {/* Gelo: your implementation was not the best way and a bad practicce, merong self-end sa tw. */}

                </nav>

                {header && (
                    <header className="mt-2 max-w-7xl min-w-screen sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 mt-2 px-6">{children}</main>
            </div>
        </div>
    );
}
