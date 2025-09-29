import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login({ setToken }) {
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post("http://localhost:5000/auth/login", {
            aadhar_no: aadhar,
            password,
        });

        const data = res.data; // axios already parses JSON

        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/portal");
    } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.error || "Login failed");
    }

    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-300 to-yellow-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Aadhar Number"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-orange-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
