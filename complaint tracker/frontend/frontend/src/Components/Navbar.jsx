import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.reload();
  };
  const handleBack = () => {
    navigate(-1); // go back in history
  };
  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <button
          onClick={handleBack}
          className="back-btn"
        >
          ← Back
        </button>
        <img src="./Logo.jpg" alt="Logo" className="navbar-logo" />
        <span className="navbar-slogan">
          Complaint hain toh hum hai :)
        </span>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <Link to="/reports">Reports</Link>
        <Link to="/heatmap">Heatmap Visualization</Link>
        <Link to="/groupIndex">View Groups</Link>
        <Link to="/livestats">Live Stats</Link>
        <Link to="/sla">SLA Tracking</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
