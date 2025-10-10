/* global google */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const API = process.env.REACT_APP_BACKEND;

function Login({ setToken, onLogin }) {
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Initialize GSI only once — popup mode, no FedCM, no One Tap
  useEffect(() => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    console.log("🚀 GSI init — clientId:", clientId, "Origin:", window.location.origin);

    if (!window.google || !clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
      ux_mode: "popup",               // 🔥 forces popup flow
      auto_select: false,             // disables auto One Tap
      use_fedcm_for_prompt: false,    // 🔥 fully disables FedCM
    });
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const id_token = response.credential;
      const res = await axios.post(`${API}/auth/google`, { id_token });
      const data = res.data;
      onLogin(data.token);
      setToken(data.token);
      navigate("/portal");
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Google Authentication failed");
    }
  };

  const handleGoogleButtonClick = () => {
    if (window.google && window.google.accounts.id) {
      window.google.accounts.id.prompt(); // manually open popup
    } else {
      alert("Google Sign-In not loaded properly.");
    }
  };

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

        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleButtonClick}
          className="login-btn"
          style={{ backgroundColor: "#4285F4", marginTop: "0" }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
            style={{ width: "18px", verticalAlign: "middle", marginRight: "10px" }}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
