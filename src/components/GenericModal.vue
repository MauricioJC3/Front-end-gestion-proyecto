<template>
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="isOpen" 
          class="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 transition-opacity"
          @click.self="closeModal"
        >
          <div :class="['bg-gray-800 p-10 rounded-2xl w-full max-w-4xl shadow-2xl relative', modalClass]">
            <button class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-200 transition" @click="closeModal">×</button>
            <slot></slot>
          </div>
        </div>
      </transition>
    </teleport>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isOpen: Boolean,
    modalClass: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['close']);
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  