import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import NavBar from '@/Components/NavBar';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen grid grid-cols-2">
            {/* Navbar */}
            <NavBar />

            {/* Left side - Form */}
            <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-rose-500" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-lg sm:rounded-lg dark:bg-gray-800">
                    {children}
                </div>
            </div>

            {/* Right side - Background Image */}
            <div
                className="bg-cover bg-center"
                style={{ backgroundImage: "url('images/lvbuilding.jpg')" }}
            ></div>
        </div>
    );
}
