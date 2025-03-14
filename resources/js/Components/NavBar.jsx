import { Link } from "@inertiajs/react";

export default function NavBar() {
  return (
    <div>
      <header>
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
          {/* Logo and school name aligned to the left */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/LVlogo.jpg"
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-lg font-semibold">La Verdad Christian College, Inc.</span>
          </div>

          {/* Navigation links centered */}
          <div className="flex-grow flex justify-center space-x-4">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/about">
              About
            </Link>
            <Link className="nav-link" href="/">
              Features
            </Link>
          </div>

          {/* Login button aligned to the right */}
          <div>
            <Link className="nav-link" href="/login">
              Login
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
