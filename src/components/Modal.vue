<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-5 rounded shadow-lg w-1/3">
        <slot />
        <button @click="$emit('close')" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">Cerrar</button>
      </div>
    </div>
  </template>
  