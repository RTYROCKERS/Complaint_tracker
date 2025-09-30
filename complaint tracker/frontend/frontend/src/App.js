import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
// Pages
import ComplaintsPage from "./Pages/ComplaintPage.jsx";
import Intro from "./Pages/Intro.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Portal from "./Pages/Portal.jsx";
import HeatmapPage from "./Pages/HeatmapPage.jsx";
import GroupIndex from "./Pages/GroupIndex.jsx";
import GroupPage from "./Pages/Group.jsx";
import ReportPage from "./Components/Reports/ReportPage.jsx";
// Components
import Navbar from "./Components/Navbar.jsx";
import LiveStatsPage from "./Pages/LiveStatsPage.jsx";
import SLAPage from './Pages/SLAPage.jsx';
function App() {
  // Initialize token safely
  const [token, setToken] = useState(null);

  // Read token from localStorage on mount
  useEffect(() => {
    const verifyToken = async (t) => {
      try {
        const res = await axios.get("http://localhost:5000/auth/verify", {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.data.valid) setToken(t);
        else throw new Error();
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      }
    };

    const token = localStorage.getItem("token");
    if (token) verifyToken(token);

    const handleStorageChange = () => {
      const t = localStorage.getItem("token");
      if (t) verifyToken(t);
      else setToken(null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (
    <Router>
      {token ? (
        <>
          <Navbar />
          <div className="min-h-screen bg-gray-100 p-4">
            <Routes>
              <Route path="/portal" element={<Portal />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
              <Route path="/group" element={<GroupPage />} />
              <Route path="/groupIndex" element={<GroupIndex />} />
              <Route path="/reports" element={<ReportPage />} />
              <Route path="/livestats" element={<LiveStatsPage />} />
              <Route path="/sla" element={<SLAPage />} />
              <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
