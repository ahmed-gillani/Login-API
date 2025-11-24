// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { FaUser, FaBuilding, FaUserShield, FaChartLine } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const callProtected = async () => {
    try {
      const res = await api.get("/protected");
      alert("Protected response: " + JSON.stringify(res.data));
    } catch (err) {
      alert("Error: " + (err?.response?.status || err.message));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">
          Loading user... If this persists, please login again.
        </p>
      </div>
    );
  }

  // Example chart data
  const data = [
    { name: "Jan", apiCalls: 30 },
    { name: "Feb", apiCalls: 45 },
    { name: "Mar", apiCalls: 60 },
    { name: "Apr", apiCalls: 50 },
    { name: "May", apiCalls: 70 },
    { name: "Jun", apiCalls: 90 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Welcome, {user.first_name}!
            </h1>
            <p className="text-indigo-200 text-lg">
              Facility Management Dashboard
            </p>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              onClick={callProtected}
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
            >
              Call API
            </button>
            <button
              onClick={logout}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <FaUser className="text-indigo-500 w-10 h-10" />
            <div>
              <p className="text-gray-500">Username</p>
              <p className="text-gray-900 font-bold">{user.username}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <FaBuilding className="text-purple-500 w-10 h-10" />
            <div>
              <p className="text-gray-500">Facility</p>
              <p className="text-gray-900 font-bold">{user.facility?.name}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <FaUserShield className="text-pink-500 w-10 h-10" />
            <div>
              <p className="text-gray-500">Role</p>
              <p className="text-gray-900 font-bold">{user.role?.name}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <FaChartLine className="text-green-500 w-10 h-10" />
            <div>
              <p className="text-gray-500">Email</p>
              <p className="text-gray-900 font-bold">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">API Calls Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="apiCalls" stroke="#6366F1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
