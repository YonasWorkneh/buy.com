import axios from "axios";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL (or API_BASE_URL) environment variable."
  );
}

export const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;
