import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <Link
          to="/"
          className="font-extrabold text-2xl tracking-wide hover:text-yellow-300 transition-colors"
        >
          Complaint Tracker
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link
            to="/posts"
            className="font-semibold hover:text-yellow-300 transition-colors"
          >
            Posts
          </Link>
          <Link
            to="/complaints"
            className="font-semibold hover:text-yellow-300 transition-colors"
          >
            Complaints
          </Link>
          <Link
            to="/about"
            className="font-semibold hover:text-yellow-300 transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
