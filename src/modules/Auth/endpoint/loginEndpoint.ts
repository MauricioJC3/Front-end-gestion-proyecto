import api from "@/config/base";
import { AxiosError } from "axios";

export const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || { message: "Error en la autenticación" };
    }
  };
  