    import NavBar from "@/Components/NavBar";
import About from "./About";
import Features from "./Features";
import Footer from "./Footer";
import { Head, Link } from "@inertiajs/react";

const Home = () => {
    return (
        <>
            <Head title="Welcome" />
            <div className="scroll-smooth">
                <NavBar />

                {/* First Section*/}

                <div
                    className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center text-center px-4"
                    style={{ backgroundImage: "url('/images/lvbuilding.jpg')" }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-70"></div>

                    {/* Hero Content */}
                    <div className="relative text-white">
                        <h1 className="text-2xl sm:text-4xl lg:text-[3.25rem] font-bold drop-shadow-lg">
                            Computerized Maintenance
                            <br />
                            Management System
                        </h1>
                        <p className="mt-4 text-lg sm:text-2xl lg:text-3xl drop-shadow-md">
                            With Event Services
                        </p>

                        <Link
                            href="/register"
                            className="inline-flex items-center px-6 py-3 mt-8 text-lg font-semibold text-white transition-all duration-300 bg-secondary rounded-lg hover:bg-opacity-90 hover:scale-105 focus:bg-opacity-90 shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                <About />
                <Features />
                <Footer />
            </div>
        </>
    );
};

export default Home;
