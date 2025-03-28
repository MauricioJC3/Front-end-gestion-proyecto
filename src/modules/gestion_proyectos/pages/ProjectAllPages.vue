<template>
  <div class="flex flex-wrap gap-6 p-6">

<div 
  v-for="project in projectStore.projects" 
  :key="project.id" 
  class="w-full sm:w-[500px] bg-gradient-to-br from-white to-gray-100 border border-gray-300 rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
  @click="openProjectModal(project)"
>
  <!-- Imagen de encabezado -->
  <div class="h-48 w-full rounded-xl overflow-hidden mb-4">
    <img src="https://source.unsplash.com/500x300/?technology,code" alt="Project Image" class="w-full h-full object-cover">
  </div>

  <!-- Contenido -->
  <h3 class="font-bold text-2xl text-gray-800 truncate">{{ project.name }}</h3>
  <p class="text-gray-600 mt-2 text-sm line-clamp-3">{{ project.description }}</p>

  <!-- Footer con detalles adicionales -->
  <div class="mt-4 flex justify-between items-center text-gray-500 text-sm">
    <div class="flex items-center space-x-2">
      <span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
      <span>Activo</span>
    </div>
    <span class="text-xs">{{ formatDate(project.created_at) }}</span>
  </div>
</div>


    <!-- Modal de Detalles del Proyecto -->
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="selectedProject" 
          class="fixed inset-0 bg-white/30 backdrop-blur-lg flex justify-center items-center z-50 transition-opacity"
          @click.self="closeProjectModal"
        >
          <div class="bg-white p-10 rounded-2xl w-full max-w-4xl shadow-2xl relative">
            <button class="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800 transition" @click="closeProjectModal">×</button>
            
            <h2 class="text-4xl font-extrabold text-gray-800 mb-4">{{ selectedProject.name }}</h2>
            <p class="text-gray-700 mb-6">{{ selectedProject.description }}</p>

            <div class="border-t border-gray-300 pt-4">
              <h3 class="text-lg font-semibold text-gray-700">Tags y sus tareas</h3>
              <div v-for="tag in projectTags" :key="tag.id" class="mt-3">
                <div class="inline-block px-4 py-1 rounded-full text-white text-sm font-medium" :style="{ backgroundColor: tag.color || '#3B82F6' }">
                  {{ tag.name }}
                </div>

                <div class="mt-3 space-y-3">
                  <div 
                    v-for="task in tasksByTag[tag.id] || []" 
                    :key="task.id" 
                    class="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg shadow-sm"
                  >
                    <div class="flex items-center space-x-3">
                      <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)" class="w-5 h-5 accent-blue-500">
                      <span :class="{ 'line-through text-gray-500': task.completed }" class="text-gray-800">{{ task.name }}</span>
                    </div>
                    <span class="text-xs text-gray-500 italic">{{ formatDate(task.due_date) }}</span>
                  </div>
                  <p v-if="!tasksByTag[tag.id] || tasksByTag[tag.id]?.length === 0" class="text-gray-400 text-sm italic">No hay tareas para este tag.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProjectStore } from '../store/projects/projectStore';
import { useTagStore } from '../store/tags/tagStore';
import { useTaskStore } from '../store/tasks/taskStore';

const projectStore = useProjectStore();
const tagStore = useTagStore();
const taskStore = useTaskStore();

const selectedProject = ref<Project | null>(null);
const projectTasks = ref<Task[]>([]);
const projectTags = computed(() => tagStore.tags);

const tasksByTag = computed(() => {
  const taskMap: Record<number, Task[]> = {};
  for (const tag of projectTags.value) {
    taskMap[tag.id] = projectTasks.value.filter(task => task.tag_id === tag.id);
  }
  return taskMap;
});

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  return `${date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} 
          ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
};

const openProjectModal = async (project: Project) => {
  selectedProject.value = null; // Asegura que el modal se reinicie
  projectTasks.value = [];

  try {
    await tagStore.fetchTagsByProject(project.id);
    const tasks: Task[] = [];

    for (const tag of tagStore.tags) {
      const tagTasks = await taskStore.fetchTasksByTag(tag.id) || [];
      tasks.push(...tagTasks);
    }

    projectTasks.value = tasks;
    selectedProject.value = project; // Asigna el proyecto solo cuando los datos estén listos
  } catch (error) {
    console.error('Error al abrir el modal del proyecto:', error);
  }
};


const closeProjectModal = () => {
  selectedProject.value = null;
  projectTasks.value = [];
};

const toggleTaskCompletion = async (task: Task) => {
  try {
    await taskStore.completeTask(task.id);
    task.completed = !task.completed;
  } catch (error) {
    console.error('Error al cambiar el estado de la tarea', error);
  }
};

onMounted(async () => {
  await projectStore.fetchProjects();
});
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>