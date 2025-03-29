<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from '@/store/themeStore';
const themeStore = useThemeStore();
</script>

<template>
  <div :class="{ 'dark bg-gray-900 text-white': themeStore.darkMode, 'bg-gray-100 text-gray-900': !themeStore.darkMode }"
       class="min-h-screen">
    <RouterView />
  </div>
</template>