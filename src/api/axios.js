// src/api/axios.js
import axios from "axios";


const api = axios.create({
baseURL: "https://3-149-121-205.nip.io",
timeout: 15000,
headers: {
"Content-Type": "application/json",
},
});


// Auto-add Bearer token if present
api.interceptors.request.use((config) => {
const token = localStorage.getItem("access_token");
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});


export default api;