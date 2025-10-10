import React, { useEffect, useState } from "react";
import "../css/Portal.css";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND; // Your backend URL

function Portal() {
  const [user, setUser] = useState(null);

 useEffect(() => {
  const checkUserId = setInterval(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      clearInterval(checkUserId);
      axios
        .get(`${API}/auth/me`, { params: { user_id: userId } })
        .then((res) => setUser(res.data.data))
        .catch((err) => console.error(err));
    }
  }, 500); // check every 0.5s

  return () => clearInterval(checkUserId);
}, []);


  return (
    <div className="portal-container">
      <h1 className="portal-title">WELCOME TO CARAVAN CHRONICLES</h1>

      {user ? (
        <div className="user-card">
          <h2>Hello, {user.name}!</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Aadhar Number:</strong> {user.aadhar_no || "Not Provided"}</p>
        </div>
      ) : (
        <p className="loading-text">Loading your data...</p>
      )}
    </div>
  );
}

export default Portal;
