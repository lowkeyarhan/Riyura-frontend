import axios from "axios";

// Backend API Client
const getBackendUrl = () =>
  process.env.BACKEND_URL || "http://localhost:8080/api";

export const backendClient = axios.create({
  baseURL: getBackendUrl().replace(/\/$/, ""),
  headers: { accept: "application/json" },
});

// API Client
export const apiClient = axios.create({
  baseURL: "",
  headers: { accept: "application/json" },
});
