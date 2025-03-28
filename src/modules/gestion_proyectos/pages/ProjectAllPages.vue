<template>
  <div class="flex flex-wrap gap-6 p-6 bg-gray-900 min-h-screen text-white">
    <div 
      v-for="project in projectStore.projects" 
      :key="project.id" 
      class="w-full sm:w-[450px] bg-gray-800 border border-gray-700 rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-xl transition transform hover:-translate-y-1  max-h-[380px]  max-h-80 overflow-hidden"
      @click="openProjectModal(project)"
    >
      <div class="h-48 w-full rounded-xl overflow-hidden mb-4">
        <img src="https://source.unsplash.com/500x300/?technology,code" alt="Project Image" class="w-full h-full object-cover">
      </div>
      <h3 class="font-bold text-xl text-white truncate">{{ project.name }}</h3>
      <p class="text-gray-400 mt-2 text-sm line-clamp-3">{{ project.description }}</p>
      <div class="mt-4 flex justify-between items-center text-gray-500 text-sm">
        <div class="flex items-center space-x-2">
          <span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          <span>Activo</span>
        </div>
        <span class="text-xs">{{ formatDate(project.created_at) }}</span>
      </div>
    </div>

    
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="selectedProject" 
          class="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 transition-opacity"
          @click.self="closeProjectModal"
        >
          <div class="bg-gray-800 p-10 rounded-2xl w-full max-w-4xl shadow-2xl relative">
            <button class="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-200 transition" @click="closeProjectModal">×</button>
            <h2 class="text-4xl font-extrabold text-white mb-4">{{ selectedProject.name }}</h2>
            <p class="text-gray-300 mb-6">{{ selectedProject.description }}</p>
            <div class="border-t border-gray-700 pt-4">
              <h3 class="text-lg font-semibold text-gray-300">Tags y sus tareas</h3>
              
              <p v-if="loadingTasks" class="loading-text mt-3">Cargando tareas...</p>

              <div v-else>
                <div v-for="tag in projectTags" :key="tag.id" class="mt-3">
                  <div class="inline-block px-6 py-2 rounded-full text-white text-base font-semibold" 
                    :style="{ backgroundColor: tag.color || '#3B82F6' }">
                      {{ tag.name }}
                </div>

                  <div class="mt-3 space-y-3">
                    <div 
                      v-for="task in tasksByTag[tag.id] || []" 
                      :key="task.id" 
                      class="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-lg shadow-sm"
                    >
                      <div class="flex items-center space-x-3">
                        <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)" class="w-5 h-5 accent-blue-500">
                        <span :class="{ 'line-through text-gray-500': task.completed }" class="text-white">{{ task.name }}</span>
                      </div>
                      <span class="text-xs text-gray-400 italic">{{ formatDate(task.due_date) }}</span>
                    </div>
                    <p v-if="!tasksByTag[tag.id] || tasksByTag[tag.id]?.length === 0" class="text-gray-500 text-sm italic">No hay tareas para este tag.</p>
                  </div>
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
const loadingTasks = ref(false); // Estado de carga
const projectTags = computed(() => tagStore.tags);

const tasksByTag = computed(() => {
  return projectTags.value.reduce((taskMap, tag) => {
    taskMap[tag.id] = projectTasks.value.filter(task => task.tag_id === tag.id);
    return taskMap;
  }, {} as Record<number, Task[]>);
});

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  return `${date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
};

const openProjectModal = async (project: Project) => {
  selectedProject.value = project;
  projectTasks.value = [];
  loadingTasks.value = true; // Activamos la carga

  try {
    await tagStore.fetchTagsByProject(project.id);
    const tasks = await Promise.all(tagStore.tags.map(tag => taskStore.fetchTasksByTag(tag.id) || []));
    projectTasks.value = tasks.flat();
  } catch (error) {
    console.error('Error al abrir el modal del proyecto:', error);
  } finally {
    loadingTasks.value = false; // Desactivamos la carga cuando termine
  }
};

const closeProjectModal = () => {
  selectedProject.value = null;
  projectTasks.value = [];
  loadingTasks.value = false;
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


@keyframes glowing {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.loading-text {
  font-size: 1.8rem; /* Texto más grande */
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

</style>