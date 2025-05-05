import { PropsWithChildren } from "react";
import NavBar from "@/Components/NavBar";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col md:grid md:grid-cols-2">
            {/* Navbar */}
            <NavBar />

            {/* Form Section */}
            <main
                className="
                    flex-1 flex flex-col items-center justify-center
                    bg-gray-100 dark:bg-gray-900 p-6
                    relative
                    bg-[url('/images/lvbuilding.jpg')] bg-cover bg-center
                    md:bg-none
                "
            >
                {/* Optional overlay for readability on mobile */}
                <div
                    className="absolute inset-0 bg-black/50 md:hidden"
                    aria-hidden="true"
                />

                {/* Form content with rounded corners only for small screens */}
                <div className="relative z-10 mt-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white px-4 py-8 shadow-md sm:rounded-3xl md:rounded-none dark:bg-gray-800">
                    {children}
                </div>
            </main>

            {/* Image only for larger screens */}
            <section
                className="hidden md:block h-full bg-cover bg-center"
                style={{ backgroundImage: `url('/images/lvbuilding.jpg')` }}
                aria-label="Company building"
            >
                <span className="sr-only">Company office building</span>
            </section>
        </div>
    );
}