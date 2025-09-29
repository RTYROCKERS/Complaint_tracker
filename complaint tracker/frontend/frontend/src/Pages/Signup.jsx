import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Signup({ setToken }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [party, setParty] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const { data } = await axios.post("http://localhost:5000/auth/signup", {
            name,
            address,
            aadhar_no: aadhar,
            password,
            role,
            political_party: role === "official" ? party : null,
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-300 to-yellow-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-300"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-300"
            required
          />
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

          {/* Role dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-300"
          >
            <option value="citizen">Citizen</option>
            <option value="moderator">Moderator</option>
            <option value="official">Official</option>
          </select>

          {/* Extra field if role is official */}
          {role === "official" && (
            <input
              type="text"
              placeholder="Political Party (Optional)"
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-300"
            />
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-600 cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
