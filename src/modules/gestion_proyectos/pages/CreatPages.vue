<template>
        <Navbar />

  <div :class="['h-screen flex', themeStore.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900']">
    <!-- Panel principal -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="max-w-3xl mx-auto">
        <!-- Crear Proyecto -->
        <div class="mb-8 bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-3">New Project</h2>
          <form @submit.prevent="createProject" class="flex flex-col gap-3 mb-4">
            <input v-model="newProject.name" placeholder="Project Name" class="border p-2 rounded dark:bg-gray-700 dark:border-gray-600" required />
            <input v-model="newProject.description" placeholder="Description" class="border p-2 rounded dark:bg-gray-700 dark:border-gray-600" />
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create</button>
          </form>
          <!-- mostrar nombre del proyecto actual -->
          <!-- <div v-if="currentProject" class="mt-2 text-sm text-green-600 dark:text-green-400">
            Current project: {{ currentProject.name }}
          </div> -->
        </div>

        <!-- Crear Etiqueta -->
        <div class="mb-8 bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-3">Project Tags</h2>
          <form @submit.prevent="createTag" class="flex flex-col gap-3 mb-4">
            <div class="flex gap-2 items-center">
              <input v-model="newTag.name" placeholder="Tag Name" class="border p-2 flex-1 rounded dark:bg-gray-700 dark:border-gray-600" required />
              <input v-model="newTag.color" type="color" class="border p-2 rounded w-16 h-10" />
            </div>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create Tag</button>
          </form>
        <!-- mostrar la tag creada -->
          <!-- <div v-if="projectTags.length > 0" class="mt-2 text-sm">
            Available tags: {{ projectTags.map(t => t.name).join(', ') }}
          </div> -->
        </div>

        <!-- Crear Tarea -->
        <div class="mb-8 bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-3">New Task</h2>
          <form @submit.prevent="createTask" class="flex flex-col gap-3 mb-4">
            <input v-model="newTask.name" placeholder="Task Name" class="border p-2 rounded dark:bg-gray-700 dark:border-gray-600" required />
            <div class="flex gap-2">
              <select v-model="newTask.tag_id" class="border p-2 rounded flex-1 dark:bg-gray-700 dark:border-gray-600" required>
                <option value="" disabled>Select a tag</option>
                <option v-for="tag in projectTags" :key="tag.id" :value="tag.id">
                  {{ tag.name }}
                </option>
              </select>
              <input v-model="newTask.due_date" type="date" class="border p-2 rounded flex-1 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Add Task</button>
          </form>
          <!-- <div v-if="debugTasks.length > 0" class="mt-2 text-sm">
            Latest tasks: {{ debugTasks.map(t => t.name).join(', ') }}
          </div> -->
        </div>
      </div>
    </div>

    <!-- Vista previa alineada a la derecha -->
    <div v-if="currentProject" class="w-1/3 border-l p-6 overflow-y-auto" 
         :class="themeStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="sticky top-0 pb-4 bg-inherit">
        <h2 class="text-2xl font-bold mb-2">{{ currentProject.name }}</h2>
        <p :class="themeStore.darkMode ? 'text-gray-300' : 'text-gray-700'" class="mb-4">{{ currentProject.description }}</p>
        <div class="border-b border-gray-300 dark:border-gray-700"></div>
      </div>
      
      <div v-for="tag in projectTags" :key="tag.id" class="mt-6">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: tag.color }"></div>
          <h3 class="text-lg font-semibold">{{ tag.name }}</h3>
        </div>
        
        <div v-if="getTasksByTag(tag.id).length === 0" class="pl-6 text-gray-500 italic">
          No tasks yet (TagID: {{ tag.id }})
        </div>
        
        <ul v-else class="space-y-2 pl-4">
          <li v-for="task in getTasksByTag(tag.id)" :key="task.id" 
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex justify-between">
              <span>{{ task.name }}</span>
              <span v-if="task.due_date" :class="isDueDateSoon(task.due_date) ? 'text-red-500' : 'text-gray-500'" class="text-sm">
                {{ formatDate(task.due_date) }}
              </span>
            </div>
          </li>
        </ul>
      </div>
      
      <div v-if="projectTags.length === 0" class="mt-6 text-center text-gray-500 italic">
        Add tags to organize your tasks
      </div>

      <!-- Debug info para solucionar problemas -->
      <!-- <div class="mt-8 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs">
        <div class="font-semibold">Debug Info:</div>
        <div>Project ID: {{ currentProjectId }}</div>
        <div>Total Tasks: {{ taskStore.tasks.length }}</div>
        <div>Project Tags: {{ projectTags.length }}</div>
        <div>Tasks for this project: {{ projectTasks.length }}</div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useProjectStore } from '../store/projects/projectStore';
import { useTagStore } from '../store/tags/tagStore';
import { useTaskStore } from '../store/tasks/taskStore';
import { useThemeStore } from '@/store/themeStore';
import Navbar from '@/components/Navbar.vue';

const projectStore = useProjectStore();
const tagStore = useTagStore();
const taskStore = useTaskStore();
const themeStore = useThemeStore();

const newProject = ref({ name: '', description: '' });
const newTag = ref({ name: '', color: '#3B82F6' }); // Color azul por defecto
const newTask = ref({ name: '', tag_id: '', due_date: '' });
const currentProjectId = ref(null);

// Para debugging
// const debugTasks = ref([]);

const currentProject = computed(() => projectStore.projects.find(proj => proj.id === currentProjectId.value) || null);
const projectTags = computed(() => tagStore.tags.filter(tag => tag.project_id === currentProjectId.value));
const projectTasks = computed(() => taskStore.tasks.filter(task => task.project_id === currentProjectId.value));

// Verificar datos al montar el componente
// onMounted(() => {
//   console.log('Stores inicializados:', {
//     projects: projectStore.projects,
//     tags: tagStore.tags,
//     tasks: taskStore.tasks
//   });
// });

// Esta función se asegura de obtener correctamente las tareas para cada etiqueta
const getTasksByTag = (tagId) => {
  const filteredTasks = taskStore.tasks.filter(task => 
    task.tag_id === tagId && 
    task.project_id === currentProjectId.value
  );
  
  // console.log(`Buscando tareas para tag ${tagId}, proyecto ${currentProjectId.value}:`, filteredTasks);
  return filteredTasks;
};

const createProject = async () => {
  if (!newProject.value.name.trim()) {
    alert('El nombre del proyecto es obligatorio.');
    return;
  }
  try {
    const createdProject = await projectStore.createProject(newProject.value);
    currentProjectId.value = createdProject.id;
    newProject.value = { name: '', description: '' };
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
  }
};

const createTag = async () => {
  if (!newTag.value.name.trim()) {
    alert('El nombre de la etiqueta es obligatorio.');
    return;
  }
  if (!currentProjectId.value) {
    alert('No hay un proyecto seleccionado.');
    return;
  }
  try {
    const newTagData = { ...newTag.value, project_id: currentProjectId.value };
    const createdTag = await tagStore.createTag(newTagData);
    // console.log('Etiqueta creada:', createdTag);
    newTag.value = { name: '', color: '#3B82F6' };
  } catch (error) {
    console.error('Error al crear la etiqueta:', error);
  }
};

const createTask = async () => {
  if (!newTask.value.name.trim()) {
    alert('El nombre de la tarea es obligatorio.');
    return;
  }
  if (!newTask.value.tag_id) {
    alert('Debe seleccionar una etiqueta.');
    return;
  }
  if (!currentProjectId.value) {
    alert('No hay un proyecto seleccionado.');
    return;
  }
  try {
    const taskData = { 
      ...newTask.value, 
      project_id: currentProjectId.value 
    };
    
    // console.log('Creando tarea con datos:', taskData);
    const createdTask = await taskStore.createTask(taskData);
    
    // Guardar la tarea creada en el array de debug para verificación
    // debugTasks.value.push(createdTask);
    
    // console.log('Tarea creada:', createdTask);
    // console.log('Estado actual de tareas:', taskStore.tasks);
    
    newTask.value = { name: '', tag_id: '', due_date: '' };
  } catch (error) {
    console.error('Error al crear la tarea:', error);
  }
};

// Funciones de utilidad para fechas
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const isDueDateSoon = (dateString) => {
  const today = new Date();
  const dueDate = new Date(dateString);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
};

// Observar cambios en las tareas para depuración
</script>