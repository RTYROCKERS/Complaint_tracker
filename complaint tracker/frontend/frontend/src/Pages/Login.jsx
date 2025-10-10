import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const API = "http://localhost:5000";

function Login({ setToken, onLogin }) {
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Initialize Google Identity Services
  useEffect(() => {
    /* global google */
    const clientId = "549261398001-k28j8cql0dm971bmh4iaphojjssn5mo0.apps.googleusercontent.com";
    if (!window.google || !clientId) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
    });
  }, []);

  // ✅ Handle Aadhar/password login
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

  // ✅ Handle Google login
  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post(`${API}/auth/google`, {
        id_token: response.credential,
      });

      const data = res.data;
      onLogin(data.token);
      setToken(data.token);
      navigate("/portal");
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Google Authentication failed");
    }
  };

  // ✅ Trigger Google One Tap / Sign-In when button clicked
  const handleGoogleButtonClick = () => {
    /* global google */
    google.accounts.id.prompt(); // shows One Tap prompt
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🎪 Welcome Back to the Caravan</h1>
        <p className="login-subtitle">Enter your details to access the portal</p>

        {/* Normal login form */}
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

        {/* Divider */}
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <span>or</span>
        </div>

        {/* ✅ Styled Google login button */}
        <button
          onClick={handleGoogleButtonClick}
          className="login-btn"
          style={{ backgroundColor: "#4285F4", marginTop: "0" }}
        >
          <span style={{ marginRight: "10px" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              style={{ width: "18px", verticalAlign: "middle" }}
            />
          </span>
          Sign in with Google
        </button>

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
