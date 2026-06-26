import axios from "axios";
import { useAuthStore } from "../app/store/authStore.js";
import { env } from "../config/env.js";

export const api = axios.create({
  baseURL: env.apiUrl
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const unwrap = (response) => response.data.data;
