// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";


export const AuthContext = createContext();


export default function AuthProvider({ children }) {
const [user, setUser] = useState(
JSON.parse(localStorage.getItem("user")) || null
);


// Logout function
const logout = () => {
localStorage.removeItem("access_token");
localStorage.removeItem("refresh_token");
localStorage.removeItem("user");
setUser(null);
// use location replace to avoid back-button returning to protected pages
window.location.href = "/login";
};


// Try to refresh token using refresh token
const refreshToken = async () => {
const refresh = localStorage.getItem("refresh_token");
if (!refresh) return null;


try {
// Note: this call uses the same `api` instance. The request interceptor
// will add Authorization (if access exists) but here we're only sending refresh.
const res = await api.post("/api/users/refresh/", { refresh });


if (res?.data?.access) {
localStorage.setItem("access_token", res.data.access);
return res.data.access;
}
return null;
} catch (err) {
// refresh failed
return null;
}
};


// Response interceptor to auto-refresh on 401
useEffect(() => {
const interceptor = api.interceptors.response.use(
(response) => response,
async (error) => {
const originalRequest = error.config;


// If there is no originalRequest or we already retried, reject
if (!originalRequest) return Promise.reject(error);


// Prevent infinite loop
if (originalRequest._retry) return Promise.reject(error);


if (error.response?.status === 401) {
originalRequest._retry = true;
const newAccess = await refreshToken();
if (newAccess) {
originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
return api(originalRequest);
}
}


return Promise.reject(error);
}
);


return () => api.interceptors.response.eject(interceptor);
}, []);


return (
<AuthContext.Provider value={{ user, setUser, logout }}>
{children}
</AuthContext.Provider>
);
}