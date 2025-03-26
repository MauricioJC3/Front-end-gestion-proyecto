import axios, { AxiosError } from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// instancia por defecto
const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || { message: "Error en la autenticación" };
  }
};

export const logout = async () => {
  try {
    await api.post("/logout");
    localStorage.removeItem("token");
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || { message: "Error al cerrar sesión" };
  }
};