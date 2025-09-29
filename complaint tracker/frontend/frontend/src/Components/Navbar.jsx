import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">Complaint Tracker</Link>
      <div className="flex gap-4">
        <Link to="/complaints">Complaints</Link>
      </div>
    </nav>
  );
}
