import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../css/Signup.css";

const API = `${process.env.REACT_APP_BACKEND}`;

function Signup({ setToken }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [party, setParty] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateAadhar = (aadhar) => {
    const re = /^[2-9]{1}[0-9]{11}$/; // 12-digit numeric, first digit not 0 or 1
    return re.test(aadhar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!name.trim()) return alert("Name is required");
    if (!address.trim()) return alert("Address is required");
    if (!aadhar.trim()) return alert("Aadhar is required");
    if (!validateAadhar(aadhar)) return alert("Invalid Aadhar number (must be 12 digits, first digit 2-9)");
    if (!email.trim()) return alert("Email is required");
    if (!validateEmail(email)) return alert("Invalid email format");
    if (!password || password.length < 6) return alert("Password must be at least 6 characters");

    try {
      await axios.post(`${API}/auth/signup`, {
        name,
        address,
        aadhar_no: aadhar,
        password,
        role,
        political_party: role === "official" ? party : null,
        email,
      });

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || "Signup failed");
      } else {
        console.error(err);
      }
    };
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">🎪 Join the Circus Caravan</h1>
        <p className="signup-subtitle">Create your account to report and resolve grievances</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="signup-input" required />
          <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="signup-input" required />
          <input type="text" placeholder="Aadhar Number" value={aadhar} onChange={e => setAadhar(e.target.value)} className="signup-input" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="signup-input" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="signup-input" required />

          <select value={role} onChange={e => setRole(e.target.value)} className="signup-input">
            <option value="citizen">Citizen</option>
            <option value="moderator">Moderator</option>
            <option value="official">Official</option>
          </select>

          {role === "official" && (
            <input type="text" placeholder="Political Party (Optional)" value={party} onChange={e => setParty(e.target.value)} className="signup-input" />
          )}

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="signup-link">Log In</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
