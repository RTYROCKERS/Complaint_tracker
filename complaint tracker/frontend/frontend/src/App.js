import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import ComplaintsPage from "./Pages/ComplaintPage.jsx";

// Optional: Navbar
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      {/* Navbar visible on all pages */}
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          {/* Redirect root to complaints page */}
          <Route path="/" element={<Navigate to="/complaints" />} />

          {/* Complaints page */}
          <Route path="/complaints" element={<ComplaintsPage />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
