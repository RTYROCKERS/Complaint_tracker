import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import PostsPage from "./Pages/ComplaintPage.jsx";
import HeatMapPage from "./Pages/HeatmapPage.jsx";


function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
