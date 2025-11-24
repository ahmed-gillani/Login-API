// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/users/login/", {
        username: email,
        password: password,
      });

      const user = res.data.user;
      const access = res.data.tokens.access;
      const refresh = res.data.tokens.refresh;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid credentials. Try admin@example.com / admin123"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-12">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
            Portal Login
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Facility Management System
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username (email)"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-300"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-300"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login as Portal Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Need help? Contact IT Support.
          </p>
        </div>
      </div>
    </div>
  );
}
