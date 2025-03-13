// import { FaBeer } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import Login from "@/Pages/Auth/Login";

export default function NavBar({ children }) {

    return (
        <div> 
        <header>
            <nav>
                <Link className="nav-link" href="/">
                Home
                </Link>
                <Link className="nav-link" href="/about">
                About
                </Link>
                <Link className="nav-link" href="/">
                Features
                </Link>
                <Link className="nav-link" href="/login">
                Login
                </Link>
            </nav>
        </header>

        {/* <main> {children} </main> */}
        </div>
    )
}