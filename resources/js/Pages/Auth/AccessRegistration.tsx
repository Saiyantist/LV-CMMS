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
                        <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md min-h-[14rem] flex flex-col items-center justify-between text-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-700 dark:text-white">
                                    Guest
                                </h2>
                                <h3 className="text-base font-bold text-gray-600 dark:text-gray-300 mb-2">
                                    (External Users)
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    If you are a guest or an external user,
                                    please register here.
                                </p>
                            </div>
                            <Link
                                href={route("register")}
                                className="mt-4 mx-auto w-40 bg-primary text-white py-2 rounded-full shadow hover:bg-secondary transition"
                            >
                                Register
                            </Link>
                        </div>

                        {/* Internal User Card */}
                        <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md min-h-[14rem] flex flex-col items-center justify-between text-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-700 dark:text-white">
                                    LVCC Employees
                                </h2>
                                <h3 className="text-base font-bold text-gray-600 dark:text-gray-300 mb-2">
                                    (Internal Users)
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    If you are an internal user or an employee
                                    or student of La Verdad Christian College,
                                    please register here.
                                </p>
                            </div>
                            <Link
                                href={route("register")}
                                className="mt-4 mx-auto w-40 bg-primary text-white py-2 rounded-full shadow hover:bg-secondary transition"
                            >
                                Register
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route("login")}
                            className="text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            Already registered? Login here.
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
