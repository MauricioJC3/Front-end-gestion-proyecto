/**
 * Formatea una fecha para mostrar en la interfaz con formato completo
 * @param {string|Date} dateString - La fecha a formatear
 * @param {boolean} includeWeekday - Si se debe incluir el día de la semana
 * @returns {string} - Fecha formateada o texto por defecto si no hay fecha
 */
export const formatDate = (
	dateString: string | Date,
	includeWeekday = true,
): string => {
	if (!dateString) return "Sin fecha";

	const options: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};

	if (includeWeekday) {
		options.weekday = "short";
	}

	return new Date(dateString).toLocaleString("es-ES", options);
};

/**
 * Formatea una fecha/hora para la API en formato YYYY-MM-DD HH:MM:SS
 * @param {string|Date} dateTimeString - La fecha a formatear
 * @returns {string|null} - Fecha formateada para la API o null si no hay fecha
 */
export const formatDateForApi = (
	dateTimeString: string | Date,
): string | null => {
	if (!dateTimeString) return null;

	// Usar el formato ISO para asegurar que no hay problemas con zonas horarias
	const date = new Date(dateTimeString);

	// Formatear la fecha en el formato requerido por la API (YYYY-MM-DD HH:MM:SS)
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Formatea una fecha/hora para mostrar en la interfaz con formato simplificado
 * @param {string|Date} dateTimeString - La fecha a formatear
 * @returns {string} - Fecha formateada o cadena vacía si no hay fecha
 */
export const formatDateTime = (dateTimeString: string | Date): string => {
	if (!dateTimeString) return "";

	const date = new Date(dateTimeString);
	const options: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	};

	return new Intl.DateTimeFormat("es-ES", options).format(date);
};

/**
 * Verifica si una fecha de vencimiento está próxima (en los próximos 3 días)
 * @param {string|Date} dateString - La fecha a verificar
 * @returns {boolean} - true si la fecha está en los próximos 3 días
 */
export const isDueDateSoon = (dateString: string | Date): boolean => {
	if (!dateString) return false;

	const today = new Date();
	const dueDate = new Date(dateString);
	const diffTime = dueDate.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays <= 3 && diffDays >= 0;
};

/**
 * Calcula la diferencia en días entre la fecha actual y una fecha dada
 * @param {string|Date} dateString - La fecha para calcular la diferencia
 * @returns {number|null} - Diferencia en días o null si no hay fecha
 */
export const getDaysDifference = (dateString: string | Date): number | null => {
	if (!dateString) return null;

	const today = new Date();
	const targetDate = new Date(dateString);
	const diffTime = targetDate.getTime() - today.getTime();
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
