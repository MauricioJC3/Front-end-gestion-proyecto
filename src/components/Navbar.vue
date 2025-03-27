<template>
    <nav class="bg-gray-800 text-white p-4 flex justify-between">
      <h1 class="text-lg">Mi App</h1>
      <button @click="auth.logoutUser()" class="bg-red-500 px-3 py-1 rounded">Cerrar Sesión</button>
    </nav>
  </template>
  
  <script setup>
  import { useAuthStore } from "@/modules/Auth/stores/auth";
  const auth = useAuthStore();
  </script>
  