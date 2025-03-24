import React from "react";
import Hero from "@/Layouts/Hero"; // Hero Layout
import About from "./About";
import Features from "./Features";
import Footer from "./Footer";
import { Head } from "@inertiajs/react";

const Home = () => {
    return (
        <>
        <Head title="Welcome"/>
        <div className="scroll-smooth">
            <Hero />
            {/* This is your existing home page hero section */}
            <About />
            <Features />
            <Footer />
        </div>
        </>
    );
};

export default Home;
