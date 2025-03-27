import api from "@/config/base";
import { AxiosError } from "axios";

export const logout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || { message: "Error al cerrar sesión" };
    }
  };