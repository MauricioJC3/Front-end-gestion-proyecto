<template>
  <div class="flex flex-wrap gap-4 p-4">
    <div 
      v-for="project in projectStore.projects" 
      :key="project.id" 
      class="border border-gray-300 rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-lg transition bg-white"
      @click="openProjectModal(project)"
    >
      <h3 class="font-semibold text-lg text-gray-800">{{ project.name }}</h3>
      <p class="text-gray-600">{{ project.description }}</p>
    </div>

    <!-- Modal de Detalles del Proyecto -->
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="selectedProject" 
          class="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50 transition-opacity"
          @click.self="closeProjectModal"
        >
          <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl relative">
            <button class="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900" @click="closeProjectModal">×</button>
            
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ selectedProject.name }}</h2>
            <p class="text-gray-600 mb-4">{{ selectedProject.description }}</p>

            <div class="border-t pt-4">
              <h3 class="text-lg font-semibold text-gray-700">Tags y sus tareas</h3>
              <div v-for="tag in projectTags" :key="tag.id" class="mt-2">
                <div class="inline-block px-3 py-1 rounded-full text-white text-sm font-medium" :style="{ backgroundColor: tag.color || '#3B82F6' }">
                  {{ tag.name }}
                </div>

                <div class="mt-2 space-y-3">
                  <div 
                    v-for="task in tasksByTag[tag.id] || []" 
                    :key="task.id" 
                    class="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm"
                  >
                    <div class="flex items-center space-x-3">
                      <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)" class="w-4 h-4">
                      <span :class="{ 'line-through text-gray-500': task.completed }" class="text-gray-700">{{ task.name }}</span>
                    </div>
                    <span class="text-sm text-gray-500 italic">{{ formatDate(task.due_date) }}</span>
                  </div>
                  <p v-if="!tasksByTag[tag.id] || tasksByTag[tag.id]?.length === 0" class="text-gray-500 text-sm italic">No hay tareas para este tag.</p>
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
import { useProjectStore } from '../store/projectStore';
import { useTagStore } from '../store/tagStore';
import { useTaskStore } from '../store/taskStore';

const projectStore = useProjectStore();
const tagStore = useTagStore();
const taskStore = useTaskStore();

const selectedProject = ref<Project | null>(null);
const projectTasks = ref<Task[]>([]);
const projectTags = computed(() => tagStore.tags);

const tasksByTag = computed(() => {
  const taskMap: Record<number, Task[]> = {};
  projectTags.value.forEach(tag => {
    taskMap[tag.id] = projectTasks.value.filter(task => task.tag_id === tag.id);
  });
  return taskMap;
});

// Función para formatear la fecha y hora
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) + 
         " " + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const openProjectModal = async (project: Project) => {
  selectedProject.value = project;
  projectTasks.value = [];

  try {
    await tagStore.fetchTagsByProject(project.id);
    const tasks: Task[] = [];
    for (const tag of tagStore.tags) {
      const tagTasks = await taskStore.fetchTasksByTag(tag.id) || [];
      tasks.push(...tagTasks);
    }
    projectTasks.value = tasks;
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
/* Transición para que el fondo y modal aparezcan con efecto suave */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
