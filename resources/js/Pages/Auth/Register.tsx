import { Head, Link } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";

export default function AccessRegistration() {
    return (
        <div className="min-h-screen bg-[url('/images/lvbuilding.jpg')] bg-cover bg-center relative">
            <Head title="Select User Type" />

            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/50 z-0" />

            {/* NavBar */}
            <div className="relative z-20">
                <NavBar />
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex items-center justify-center min-h-screen pt-32 px-4">
                <div className="bg-transparent p-6 rounded-lg shadow-lg w-full max-w-3xl text-center">
                    <h1 className="text-3xl font-bold mb-8 text-white dark:text-white">
                        Access Registration
                    </h1>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                        {/* External User Card */}
                        <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md shadow-slate-500 min-h-[14rem] flex flex-col items-center justify-between text-center">
                            <div>
                                <h2 className="text-xl font-bold text-secondary dark:text-white">
                                    Guest
                                </h2>
                                <p className="font-semibold text-sm italic text-gray-600 dark:text-gray-300 mb-2">
                                    (External Users)
                                </p>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-6">
                                    If you are not from La Verdad Christian College,
                                    <span className="font-semibold text-secondary"> please register here</span>
                                </p>
                            </div>
                            <Link
                                href={route(
                                    "access.registration-external-user-registration"
                                )}
                                className="mt-4 mx-auto w-40 bg-primary text-white text-xs font-semibold tracking-widest py-3 rounded-full shadow hover:bg-secondary transition"
                            >
                                REGISTER
                            </Link>
                        </div>

                        {/* Internal User Card */}
                        <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md shadow-slate-500 min-h-[14rem] flex flex-col items-center justify-between text-center">
                            <div>
                                <h2 className="text-xl font-bold text-secondary dark:text-white">
                                    LVCC Employees
                                </h2>
                                <p className="font-bold text-sm italic text-gray-600 dark:text-gray-300 mb-2">
                                    (Internal Users)
                                </p>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-6">
                                    If you are an employee of La Verdad Christian College,
                                    <span className="font-semibold text-secondary"> please register here</span>
                                </p>
                            </div>
                            <Link
                                href={route(
                                    "access.registration-internal-user-registration"
                                )}
                                className="mt-4 mx-auto w-40 bg-primary text-white text-xs font-semibold tracking-widest py-3 rounded-full shadow hover:bg-secondary transition"
                            >
                                REGISTER
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 mx-44 bg-primary bg-opacity-60 p-4 rounded-lg hover:bg-opacity-80 transition">
                        <Link
                            href={route("login")}
                            className="text-sm text-white underline hover:text-gray-200 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            Already registered? Login here.
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
