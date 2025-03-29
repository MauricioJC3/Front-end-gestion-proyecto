import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
	const darkMode = ref(localStorage.getItem("darkMode") === "true");

	const toggleDarkMode = () => {
		darkMode.value = !darkMode.value;
		localStorage.setItem("darkMode", darkMode.value.toString()); // 🔥 Convertir a string
	};

	return { darkMode, toggleDarkMode };
});
