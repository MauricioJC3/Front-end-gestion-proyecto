<template>
    <button
      :class="`px-4 py-2 rounded ${variant}`"
      :disabled="loading"
      @click="onClick"
    >
      <slot v-if="!loading" />
      <span v-else>Cargando...</span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    variant: { type: String, default: "bg-blue-500 text-white" },
    loading: { type: Boolean, default: false },
    onClick: Function,
  });
  </script>
  