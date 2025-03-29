<template>
        <Navbar />
  <!-- 
    CONTENEDOR PRINCIPAL
    Este div externo controla el tema claro/oscuro y el espaciado general 
  -->
  <div 
    :class="{ 
      'bg-gray-900 text-white': themeStore.darkMode,
      'bg-gray-100 text-gray-800': !themeStore.darkMode
    }" 
    class="flex flex-wrap gap-6 p-6 min-h-screen"
  >
    <!-- 
      TARJETAS DE PROYECTOS
      Cada proyecto se muestra en una tarjeta independiente con efecto hover 
    -->
    <div 
      v-for="project in projectStore.projects" 
      :key="project.id" 
      :class="{ 
        'bg-gray-800 border-gray-700': themeStore.darkMode,
        'bg-white border-gray-300': !themeStore.darkMode
      }"
      class="w-full sm:w-[450px] border rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 max-h-80 overflow-hidden"
      @click="openProjectModal(project)"
    >
      <!-- Contenedor de imagen -->
      <div class="h-48 w-full rounded-xl overflow-hidden mb-4">
        <div 
          :class="{ 
            'bg-gray-700': themeStore.darkMode,
            'bg-gray-300': !themeStore.darkMode
          }" 
          class="w-full h-full flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="48" 
            height="48" 
            :fill="themeStore.darkMode ? '#9ca3af' : '#6b7280'"
          >
            <path d="M3 6C3 4.34315 4.34315 3 6 3H14C15.6569 3 17 4.34315 17 6V14C17 15.6569 15.6569 17 14 17H6C4.34315 17 3 15.6569 3 14V6ZM6 5C5.44772 5 5 5.44772 5 6V14C5 14.5523 5.44772 15 6 15H14C14.5523 15 15 14.5523 15 14V6C15 5.44772 14.5523 5 14 5H6ZM7 21C7 20.4477 7.44772 20 8 20H18C18.5523 20 19 19.5523 19 19V9C19 8.44772 19.4477 8 20 8C20.5523 8 21 8.44772 21 9V19C21 20.6569 19.6569 22 18 22H8C7.44772 22 7 21.5523 7 21Z" />
          </svg>
        </div>
      </div>
      
      <!-- Información del proyecto -->
      <h3 class="font-bold text-xl truncate">{{ project.name }}</h3>
      <p 
        :class="{ 
          'text-gray-400': themeStore.darkMode, 
          'text-gray-600': !themeStore.darkMode 
        }" 
        class="mt-2 text-sm line-clamp-3"
      >
        {{ project.description }}
      </p>
      
      <!-- Pie de tarjeta con estado y fecha -->
      <div class="mt-4 flex justify-between items-center text-gray-500 text-sm">
        <div class="flex items-center space-x-2">
          <span class="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>Activo</span>
        </div>
        <span class="text-xs">{{ formatDate(project.created_at) }}</span>
      </div>
    </div>

    <!-- 
      MODAL DE DETALLE DE PROYECTO
      Se muestra cuando se hace clic en un proyecto 
    -->
    <GenericModal 
      :isOpen="!!selectedProject" 
      @close="closeProjectModal" 
      :modalClass="themeStore.darkMode ? 'p-6 bg-gray-900 text-white' : 'p-6 bg-white text-gray-800'"
    >
      <!-- Encabezado del proyecto -->
      <h2 class="text-4xl font-extrabold mb-4">{{ selectedProject?.name }}</h2>
      <p 
        :class="{ 
          'text-gray-300': themeStore.darkMode, 
          'text-gray-600': !themeStore.darkMode 
        }" 
        class="mb-6"
      >
        {{ selectedProject?.description }}
      </p>
      
      <!-- Sección de Tags y Tareas -->
      <div 
        :class="{ 
          'border-gray-700': themeStore.darkMode, 
          'border-gray-300': !themeStore.darkMode 
        }" 
        class="border-t pt-4"
      >
        <h3 
          :class="{ 
            'text-gray-300': themeStore.darkMode, 
            'text-gray-700': !themeStore.darkMode 
          }" 
          class="text-lg font-semibold"
        >
          Tags y sus tareas
        </h3>
        
        <!-- Estado de carga -->
        <p v-if="loadingTasks" class="loading-text mt-3">Cargando tareas...</p>
        
        <!-- Lista de tags y tareas -->
        <div v-else>
          <div v-for="tag in projectTags" :key="tag.id" class="mt-3">
            <!-- Tag -->
            <div 
              class="inline-block px-6 py-2 rounded-full text-white font-semibold" 
              :style="{ backgroundColor: tag.color || '#3B82F6' }"
            >
              {{ tag.name }}
            </div>
            
            <!-- Tareas del tag -->
            <div class="mt-3 space-y-3">
              <div 
                v-for="task in tasksByTag[tag.id] || []" 
                :key="task.id" 
                :class="{ 
                  'bg-gray-700': themeStore.darkMode,
                  'bg-gray-200': !themeStore.darkMode
                }" 
                class="flex justify-between items-center px-4 py-3 rounded-lg shadow-sm"
              >
                <div class="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    :checked="task.completed" 
                    @change="toggleTaskCompletion(task)" 
                    class="w-5 h-5 accent-blue-500"
                  >
                  <span 
                    :class="{ 
                      'line-through text-gray-500': task.completed,
                      'text-white': !task.completed && themeStore.darkMode,
                      'text-gray-800': !task.completed && !themeStore.darkMode 
                    }"
                  >
                    {{ task.name }}
                  </span>
                </div>
                <span class="text-xs text-gray-400 italic">
                  {{ formatDate(task.due_date) }}
                </span>
              </div>
              
              <!-- Mensaje si no hay tareas -->
              <p 
                v-if="!tasksByTag[tag.id]?.length"
                :class="{ 
                  'text-gray-500': themeStore.darkMode, 
                  'text-gray-400': !themeStore.darkMode 
                }" 
                class="text-sm italic"
              >
                No hay tareas para este tag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GenericModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProjectStore } from '../store/projects/projectStore';
import { useTagStore } from '../store/tags/tagStore';
import { useTaskStore } from '../store/tasks/taskStore';
import { useThemeStore } from '@/store/themeStore';
import GenericModal from '@/components/GenericModal.vue';
import Navbar from '@/components/Navbar.vue';

// Stores
const projectStore = useProjectStore();
const tagStore = useTagStore();
const taskStore = useTaskStore();
const themeStore = useThemeStore();

// Estado local
const selectedProject = ref(null);
const projectTasks = ref([]);
const loadingTasks = ref(false);

// Datos computados
const projectTags = computed(() => tagStore.tags);
const tasksByTag = computed(() => {
  const taskMap = {};
  for (const tag of projectTags.value) {
    taskMap[tag.id] = projectTasks.value.filter(task => task.tag_id === tag.id);
  }
  return taskMap;
});

/**
 * Formatea una fecha ISO a formato localizado español
 * @param {string} dateString - Fecha en formato ISO
 * @return {string} Fecha formateada
 */
const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";
  
  return new Date(dateString).toLocaleString('es-ES', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Abre el modal de detalles de un proyecto y carga sus tags y tareas
 * @param {Object} project - Proyecto seleccionado
 */
const openProjectModal = async (project) => {
  selectedProject.value = project;
  loadingTasks.value = true;
  
  try {
    // Primero cargamos los tags del proyecto
    await tagStore.fetchTagsByProject(project.id);
    
    // Luego cargamos las tareas de cada tag y las aplanamos en un solo array
    const tagsPromises = tagStore.tags.map(tag => taskStore.fetchTasksByTag(tag.id));
    projectTasks.value = (await Promise.all(tagsPromises)).flat();
  } catch (error) {
    console.error('Error al abrir el modal del proyecto:', error);
  } finally {
    loadingTasks.value = false;
  }
};

/**
 * Cierra el modal y limpia el estado
 */
const closeProjectModal = () => {
  selectedProject.value = null;
  projectTasks.value = [];
  loadingTasks.value = false;
};

/**
 * Alterna el estado de completado de una tarea
 * @param {Object} task - Tarea a actualizar
 */
const toggleTaskCompletion = async (task) => {
  try {
    await taskStore.completeTask(task.id);
    task.completed = !task.completed;
  } catch (error) {
    console.error('Error al cambiar el estado de la tarea', error);
  }
};

// Cargar proyectos al montar el componente
onMounted(() => projectStore.fetchProjects());
</script>

<style scoped>
/* Animación de carga */
.loading-text {
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  padding: 12px 20px;
  border-radius: 10px;
  color: white;
  background: linear-gradient(90deg, #8A2BE2, #FF00FF, #DA70D6, #00FFFF);
  background-size: 300% 300%;
  animation: glowing 2.5s infinite alternate ease-in-out, pulse 1.5s infinite;
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.8), 0 0 20px rgba(255, 0, 255, 0.7);
}

@keyframes glowing {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>