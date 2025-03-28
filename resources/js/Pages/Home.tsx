import React from "react";
import Hero from "@/Layouts/Hero"; // Hero Layout
import NavBar from "@/Components/NavBar";
import About from "./About";
import Features from "./Features";
import Footer from "./Footer";
import { Head } from "@inertiajs/react";

const Home = () => {
    return (
        <>
            <Head title="Welcome" />
            <div className="scroll-smooth">
                <NavBar />
                <Hero />
                <About />
                <Features />
                <Footer />
            </div>
        </>
    );
};

export default Home;
