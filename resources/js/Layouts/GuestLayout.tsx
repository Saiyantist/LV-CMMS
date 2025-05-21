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
                    bg-white dark:bg-gray-900 p-6
                    relative
                    bg-[url('/images/lvbuilding.jpg')] bg-cover bg-center
                    md:bg-none
                    mt-16
                "
            >
                {/* Optional overlay for readability on mobile */}
                <div
                    className="absolute inset-0 bg-black/50 md:hidden"
                    aria-hidden="true"
                />

                <div className="flex flex-col items-center w-full">
                    {/* Log in Header */}
                    <div className="relative text-center px-6 sm:px-8 sm:py-2">
                        <h1 className="text-3xl sm:text-5xl font-bold text-white sm:text-primary">
                            CMMS
                        </h1>
                    </div>

                    {/* Form content with rounded corners only for small screens */}
                    <div className="relative z-10 mt-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-4 sm:rounded-sm md:rounded-none">
                        {children}
                    </div>
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