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
            <main className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="bg-secondary/40 py-12 px-10 rounded shadow shadow-primary w-full max-w-4xl mt-20 text-center">
                    <h1 className="text-3xl font-bold mb-16 text-white dark:text-white">
                        Access Registration
                    </h1>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                        {/* External User Card */}
                        <div className="w-full md:w-1/2 bg-form dark:bg-gray-700 p-6 rounded shadow-lg shadow-primary flex flex-col items-center justify-between text-center">
                            <div>
                                <h2 className="text-xl font-bold text-secondary dark:text-white">
                                    Guest
                                </h2>
                                <p className="font-semibold text-sm italic text-gray-600 dark:text-gray-300 mb-2">
                                    (External User)
                                </p>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-6">
                                    If you are{" "}
                                    <span className="font-semibold text-secondary relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full">
                                        not
                                    </span>
                                    {" "}from La Verdad Christian College
                                </p>
                            </div>
                            <Link
                                href={route(
                                    "access.registration-external-user-registration"
                                )}
                                className="mt-4 mx-auto w-56 bg-secondary text-white text-xs font-semibold uppercase tracking-widest py-3 rounded-lg shadow hover:bg-primary transition"
                            >
                                Register here
                            </Link>
                        </div>

                        {/* Internal User Card */}
                        <div className="w-full md:w-1/2 bg-form dark:bg-gray-700 p-6 rounded shadow-lg shadow-primary flex flex-col items-center justify-between text-center">
                            <div>
                                <h2 className="text-xl font-bold text-secondary dark:text-white">
                                    LVCC Employee
                                </h2>
                                <p className="font-bold text-sm italic text-gray-600 dark:text-gray-300 mb-2">
                                    (Internal User)
                                </p>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-6">
                                    If you are an {" "}
                                    <span className="font-semibold text-secondary relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full">
                                        employee
                                    </span>
                                    {" "}of La Verdad Christian College
                                </p>
                            </div>
                            <Link
                                href={route(
                                    "access.registration-internal-user-registration"
                                )}
                                className="mt-4 mx-auto w-56 bg-secondary text-white text-xs font-semibold uppercase tracking-widest py-3 rounded-lg shadow hover:bg-primary transition"
                            >
                                Register here
                            </Link>
                        </div>
                    </div>

                    {/* <div className="mt-6 flex justify-center">
                        <div className="bg-secondary bg-opacity-30 p-4 rounded-lg hover:bg-opacity-80 transition w-fit">
                            <p className="text-sm text-white dark:text-gray-400">
                                Already registered?{" "}
                                <Link
                                    href={route("login")}
                                    className="underline text-white transition duration-200 ease-in-out hover:text-gray-200 dark:hover:text-gray-100"
                                >
                                    Login here.
                                </Link>
                            </p>
                        </div>
                    </div> */}
                </div>
            </main>
        </div>
    );
}
