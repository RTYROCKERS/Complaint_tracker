import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";
const API = process.env.REACT_APP_BACKEND;

function Login({ setToken, onLogin }) {
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/auth/login`, {
        aadhar_no: aadhar,
        password,
      });
      const data = res.data;
      onLogin(data.token);
      setToken(data.token);
      navigate("/portal");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🎪 Welcome Back to the Caravan</h1>
        <p className="login-subtitle">Enter your details to access the portal</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Aadhar Number"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")} className="login-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
