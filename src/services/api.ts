import axios from "axios";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
  baseURL: "http://localhost:3333", // ✔ URL centralizada
  timeout: 15000,
});

// ------------------ INTERCEPTOR PARA ENVIAR TOKEN ------------------

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
