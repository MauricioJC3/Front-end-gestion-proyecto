<template>
    <AuthLayout>
      <h2 class="text-center text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Correo" class="w-full p-2 border mb-2">
        <input v-model="password" type="password" placeholder="Contraseña" class="w-full p-2 border mb-2">
        <Button :loading="loading" @click="handleLogin">Ingresar</Button>
      </form>
    </AuthLayout>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useAuthStore } from "@/modules/Auth/stores/auth";
  import AuthLayout from "../layouts/AuthLayout.vue";
  import Button from "@/components/Button.vue";
  
  const email = ref("");
  const password = ref("");
  const loading = ref(false);
  const auth = useAuthStore();
  
  const handleLogin = async () => {
    loading.value = true;
    try {
      await auth.loginUser(email.value, password.value);
      window.location.href = "/dashboard"; // Redirigir después del login
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }
  };
  </script>
  