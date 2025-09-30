import { Link ,useNavigate} from "react-router-dom";

export default function Navbar() {
  const navigate=useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT token
    window.location.reload(); // refresh the page
  };
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left Section: Logo + Slogan */}
      <div className="flex items-center gap-3" style={{ width: "40%" }}>
        {/* Logo Placeholder */}
          <img src="./Logo.jpg" style={{ height: "20%", width: "15%" }} alt="Logo" />
        {/* Slogan */}
        <span className="font-semibold italic text-sm sm:text-base">
          “                Turning Complaints into Solutions                 ”
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
        <Link to="/livestats" className="hover:text-blue-500">
        Live Stats
        </Link>
        <Link to="/sla" className="hover:text-gray-200">
          SLA Tracking
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
