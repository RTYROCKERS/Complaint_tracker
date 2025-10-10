import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
// Pages
import Intro from "./Pages/Intro.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Portal from "./Pages/Portal.jsx";
import HeatmapPage from "./Pages/HeatmapPage.jsx";
import GroupIndex from "./Pages/GroupIndex.jsx";
import GroupPage from "./Pages/Group.jsx";
import ReportPage from "./Components/Reports/ReportPage.jsx";
import Post from "./Pages/Post.jsx";
// Components
import Navbar from "./Components/Navbar.jsx";
import LiveStatsPage from "./Pages/LiveStatsPage.jsx";
import SLAPage from './Pages/SLAPage.jsx';

const API = `${process.env.REACT_APP_BACKEND}`;

function App() {
  // Initialize token safely
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setToken(null);
  };

  const verifyToken = async (t) => {
    if (!t) {
      handleLogout();
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API}/auth/verify`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.data.valid) {
        setToken(t);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("userId", res.data.user.u_id);
        console.log("User ID:",localStorage.getItem("userId"));
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Verify token on mount
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) verifyToken(t);
    else setLoading(false);
  }, []);

  // Cross-tab storage listener
  useEffect(() => {
    const handleStorageChange = () => {
      const t = localStorage.getItem("token");
      if (t) verifyToken(t);
      else handleLogout();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login handler
  const loginHandler = async (newToken) => {
    localStorage.setItem("token", newToken);
    await verifyToken(newToken);
  };

  if (loading) return <p>Loading...</p>;
  return (
    <Router>
      {token ? (
        <div className="flex flex-col h-screen">
          {/* Navbar (10%) */}
          
            <Navbar />

          {/* Main Content (90%) */}
          <div className="mt-[10%] h-[90%] overflow-y-auto bg-gray-100 p-4">
            <Routes>
              <Route path="/portal" element={<Portal />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
              <Route path="/group" element={<GroupPage />} />
              <Route path="/groupIndex" element={<GroupIndex />} />
              <Route path="/reports" element={<ReportPage />} />
              <Route path="/livestats" element={<LiveStatsPage />} />
              <Route path="/sla" element={<SLAPage />} />
              <Route path="/post/:post_id" element={<Post/>} />
              <Route path="*" element={<Portal />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login setToken={setToken} onLogin={loginHandler} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
