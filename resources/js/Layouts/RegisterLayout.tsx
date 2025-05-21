import { PropsWithChildren } from "react";
import NavBar from "@/Components/NavBar";

interface RegisterLayoutProps extends PropsWithChildren {
    width?: string;
}

export default function Register({ children, width = "" }: RegisterLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar at the top always */}
            <NavBar />

            {/* Background image with centered modal */}
            <main
                className="
                    relative flex-1 flex items-center justify-center
                    bg-gray-100 dark:bg-gray-900 p-6
                    bg-[url('/images/lvbuilding.jpg')] bg-cover bg-center
                "
            >
                {/* Overlay for readability */}
                <div
                    className="absolute inset-0 bg-black/50 md:bg-black/30 md:backdrop-brightness-90"
                    aria-hidden="true"
                />

                {/* Centered form content with top margin */}
                <div className={`relative z-10 mt-16 bg-form p-4 shadow-md rounded dark:bg-gray-800 max-h-[85vh] ${width}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
