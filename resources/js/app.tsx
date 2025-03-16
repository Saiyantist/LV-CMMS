import "./bootstrap";
import "../css/app.css";

import React from "react";
// import DefaultLayout from ""; // Adjust path if necessary
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Ziggy } from "./ziggy";

// Define Ziggy in the global scope
declare global {
    interface Window {
        Ziggy: typeof Ziggy;
    }
}   

window.Ziggy = Ziggy;

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        // Dynamically resolve page components with TypeScript support
        const page = await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        );
        
        // Apply layout if defined, otherwise use a default layout
        const Layout = (page as any).layout ??;
        (page as any).layout = Layout;
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
