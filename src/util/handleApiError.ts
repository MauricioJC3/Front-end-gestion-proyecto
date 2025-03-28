import { AxiosError } from "axios";

export function handleApiError(error: unknown): string {
	if (error instanceof AxiosError) {
		return error.response?.data?.message || "Error de API";
	}
	return "Error desconocido";
}
