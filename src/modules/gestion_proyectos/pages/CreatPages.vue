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
            
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="block text-sm mb-1">Start Date</label>
                <input v-model="newProject.start_date" type="datetime-local" class="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div class="flex-1">
                <label class="block text-sm mb-1">Due Date</label>
                <input v-model="newProject.due_date" type="datetime-local" class="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create</button>
          </form>
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
              
              <select v-model="newTask.priority" class="border p-2 rounded flex-1 dark:bg-gray-700 dark:border-gray-600">
                <option value="" disabled>Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div class="flex gap-2">
              <div class="flex-1">
                <label class="block text-sm mb-1">Start Date</label>
                <input v-model="newTask.start_date" type="datetime-local" class="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div class="flex-1">
                <label class="block text-sm mb-1">Due Date</label>
                <input v-model="newTask.due_date" type="datetime-local" class="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Add Task</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Vista previa alineada a la derecha -->
    <div v-if="currentProject" class="w-1/3 border-l p-6 overflow-y-auto" 
         :class="themeStore.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="sticky top-0 pb-4 bg-inherit">
        <h2 class="text-2xl font-bold mb-2">{{ currentProject.name }}</h2>
        <p :class="themeStore.darkMode ? 'text-gray-300' : 'text-gray-700'" class="mb-4">{{ currentProject.description }}</p>
        
        <div v-if="currentProject.start_date || currentProject.due_date" class="mb-4 text-sm">
          <div v-if="currentProject.start_date" class="flex items-center gap-1">
            <span class="font-semibold">Start:</span> 
            <span>{{ formatDateTime(currentProject.start_date) }}</span>
          </div>
          <div v-if="currentProject.due_date" class="flex items-center gap-1">
            <span class="font-semibold">Due:</span>
            <span :class="isDueDateSoon(currentProject.due_date) ? 'text-red-500' : ''">
              {{ formatDateTime(currentProject.due_date) }}
            </span>
          </div>
        </div>
        
        <div class="border-b border-gray-300 dark:border-gray-700"></div>
      </div>
      
      <div v-for="tag in projectTags" :key="tag.id" class="mt-6">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: tag.color }"></div>
          <h3 class="text-lg font-semibold">{{ tag.name }}</h3>
        </div>
        
        <div v-if="getTasksByTag(tag.id).length === 0" class="pl-6 text-gray-500 italic">
          No tasks yet
        </div>
        
        <ul v-else class="space-y-2 pl-4">
          <li v-for="task in getTasksByTag(tag.id)" :key="task.id" 
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex justify-between items-start">
              <div>
                <span class="block">{{ task.name }}</span>
                <span v-if="task.priority" class="text-xs px-2 py-1 rounded" 
                      :class="getPriorityClass(task.priority)">
                  {{ task.priority }}
                </span>
              </div>
              <div class="text-right">
                <span v-if="task.start_date" class="block text-sm text-gray-500">
                  Start: {{ formatDateTime(task.start_date) }}
                </span>
                <span v-if="task.due_date" 
                      :class="isDueDateSoon(task.due_date) ? 'block text-sm text-red-500' : 'block text-sm text-gray-500'">
                  Due: {{ formatDateTime(task.due_date) }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <div v-if="projectTags.length === 0" class="mt-6 text-center text-gray-500 italic">
        Add tags to organize your tasks
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProjectStore } from '../store/projects/projectStore';
import { useTagStore } from '../store/tags/tagStore';
import { useTaskStore } from '../store/tasks/taskStore';
import { useThemeStore } from '@/store/themeStore';
import Navbar from '@/components/Navbar.vue';
import { formatDateForApi, formatDateTime, isDueDateSoon } from '@/util/dateUtils';

const projectStore = useProjectStore();
const tagStore = useTagStore();
const taskStore = useTaskStore();
const themeStore = useThemeStore();

const newProject = ref({ 
  name: '', 
  description: '',
  start_date: '',
  due_date: ''
});

const newTag = ref({ name: '', color: '#3B82F6' });

const newTask = ref({ 
  name: '', 
  tag_id: '', 
  priority: '',
  start_date: '',
  due_date: ''
});

const currentProjectId = ref(null);

const currentProject = computed(() => projectStore.projects.find(proj => proj.id === currentProjectId.value) || null);
const projectTags = computed(() => tagStore.tags.filter(tag => tag.project_id === currentProjectId.value));
const projectTasks = computed(() => taskStore.tasks.filter(task => task.project_id === currentProjectId.value));

const getTasksByTag = (tagId) => {
  return taskStore.tasks.filter(task => 
    task.tag_id === tagId && 
    task.project_id === currentProjectId.value
  );
};

const getPriorityClass = (priority) => {
  switch(priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const createProject = async () => {
  if (!newProject.value.name.trim()) {
    alert('El nombre del proyecto es obligatorio.');
    return;
  }
  try {
    const projectData = {
      ...newProject.value,
      start_date: newProject.value.start_date ? formatDateForApi(newProject.value.start_date) : null,
      due_date: newProject.value.due_date ? formatDateForApi(newProject.value.due_date) : null
    };
    
    const createdProject = await projectStore.createProject(projectData);
    currentProjectId.value = createdProject.id;
    newProject.value = { name: '', description: '', start_date: '', due_date: '' };
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
    await tagStore.createTag(newTagData);
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
      project_id: currentProjectId.value,
      start_date: newTask.value.start_date ? formatDateForApi(new Date(newTask.value.start_date)) : null,
      due_date: newTask.value.due_date ? formatDateForApi(new Date(newTask.value.due_date)) : null
    };
  
    await taskStore.createTask(taskData);
    newTask.value = { name: '', tag_id: '', priority: '', start_date: '', due_date: '' };
  } catch (error) {
    console.error('Error al crear la tarea:', error);
  }
};
</script>