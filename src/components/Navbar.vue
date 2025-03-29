<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <h1 class="text-lg">Mi App</h1>
    <div class="flex gap-3">
      <RouterLink to="/projects" class="px-3 py-1 rounded bg-blue-600">Projects</RouterLink>
      <RouterLink to="/projects/all" class="px-3 py-1 rounded bg-blue-600">All Projects</RouterLink>
      <RouterLink to="/create/project" class="px-3 py-1 rounded bg-green-600">Create Project</RouterLink>
      <button @click="themeStore.toggleDarkMode" class="px-3 py-1 rounded bg-gray-600 text-white">
        {{ themeStore.darkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>
      <button @click="auth.logoutUser()" class="bg-red-500 px-3 py-1 rounded">Cerrar Sesión</button>
    </div>
  </nav>
</template>
 
<script setup>
import { useAuthStore } from "@/modules/Auth/stores/auth";
import { useThemeStore } from '@/store/themeStore';
import { RouterLink } from 'vue-router';

const auth = useAuthStore();
const themeStore = useThemeStore();
</script>
