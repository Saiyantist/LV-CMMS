import React from "react";
import Hero from "@/Layouts/Hero"; // Hero Layout
import About from "./About";
import Features from "./Features";
import Footer from "./Footer";

const Home = () => {
    return (
        <div className="scroll-smooth">
            <Hero /> {/* This is your existing home page hero section */}
            {/* Add an ID to the About section */}
            <div id="about">
                <About />
            </div>
            <div>
                <Features />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Home;
