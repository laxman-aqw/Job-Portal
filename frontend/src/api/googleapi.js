import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const googleAuth = (code) => api.get(`/api/users/google?code=${code}`);
