import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className=" min-h-screen grid grid-cols-2">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full py-4 z-10 bg-white">
                <div className="px-4 mx-auto max-w-7xl flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <img
                            className="w-auto h-12 rounded-full"
                            src="/images/lvlogo.jpg"
                            alt="La Verdad Christian College Logo"
                        />
                        <span className="text-lg font-semibold text-slate-500">
                            La Verdad Christian College
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        <Link href="/" className="text-sm sm:text-base text-slate-500 hover:text-opacity-80 hover:underline">Home</Link>
                        <Link href="#about" className="text-sm sm:text-base text-slate-500 hover:text-opacity-80 hover:underline">About</Link>
                        <Link href="#features" className="text-sm sm:text-base text-slate-500 hover:text-opacity-80 hover:underline">Features</Link>
                    </nav>

                    {/* Desktop Login Button */}
                    <Link href="/login" className="hidden lg:inline-flex px-5 py-2.5 text-base text-white bg-secondary rounded-full hover:bg-yellow-300">Login</Link>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-slate-500">
                        {menuOpen ? (
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {menuOpen && (
                    <div className="lg:hidden bg-white shadow-md py-4 px-6 absolute top-full left-0 w-full flex flex-col items-center space-y-4">
                        <Link href="/" className="text-slate-500 text-lg hover:text-opacity-80">Home</Link>
                        <Link href="#about" className="text-slate-500 text-lg hover:text-opacity-80">About</Link>
                        <Link href="#features" className="text-slate-500 text-lg hover:text-opacity-80">Features</Link>
                        <Link href="/login" className="px-5 py-2.5 text-base text-white bg-secondary rounded-full hover:bg-yellow-300">Login</Link>
                    </div>
                )}
            </header>
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
            <div className="bg-cover bg-center" style={{ backgroundImage: "url('images/lvbuilding.jpg')" }}>
            </div>
        </div>
    );
}
