<template>
    <div>
      <Navbar />
      <main class="p-6">
        <h1 class="text-2xl font-bold">Bienvenido, {{ auth.user?.name }}</h1>
      </main>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from "@/modules/Auth/stores/auth";
  import Navbar from "@/components/Navbar.vue";
  
  const auth = useAuthStore();
  </script>
  