import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left Section: Logo + Slogan */}
      <div className="flex items-center gap-3">
        {/* Logo Placeholder */}
        <div className="w-10 h-10 bg-white text-blue-600 flex items-center justify-center font-bold rounded-full">
          Insert Logo Here
        </div>
        {/* Slogan */}
        <span className="font-semibold italic text-sm sm:text-base">
          “Turning Complaints into Solutions”
        </span>
      </div>

      {/* Right Section: Nav Links */}
      <div className="flex gap-6 font-medium">
        <Link to="/complaints" className="hover:text-gray-200">
          Complaints
        </Link>
        <Link to="/reports" className="hover:text-gray-200">
          Reports
        </Link>
        <Link to="/heatmap" className="hover:text-gray-200">
          HeatmapVisualization
        </Link>
        <Link to="/groupIndex" className="hover:text-gray-200">
          ViewGroups
        </Link>
      </div>
    </nav>
  );
}
