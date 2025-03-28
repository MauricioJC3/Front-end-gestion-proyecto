<template>
    <div :class="['h-screen flex', darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900']">
      <!-- Panel principal -->
      <div class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-3xl mx-auto">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Project Management</h1>
            <button @click="toggleDarkMode" class="px-4 py-2 rounded bg-gray-700 text-white">
              {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
            </button>
          </div>
  
          <!-- Crear Proyecto -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-3">New Project</h2>
            <form @submit.prevent="createProject" class="flex gap-2 mb-6">
              <input v-model="newProject.name" placeholder="Project Name" class="border p-2 flex-1 rounded" required />
              <input v-model="newProject.description" placeholder="Description" class="border p-2 flex-1 rounded" />
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
            </form>
          </div>
  
          <!-- Crear Etiqueta -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-3">Project Tags</h2>
            <form @submit.prevent="createTag" class="flex gap-2 mb-6">
              <input v-model="newTag.name" placeholder="Tag Name" class="border p-2 flex-1 rounded" required />
              <input v-model="newTag.color" type="color" class="border p-2 rounded" />
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Create Tag</button>
            </form>
          </div>
  
          <!-- Crear Tarea -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-3">New Task</h2>
            <form @submit.prevent="createTask" class="flex gap-2 mb-6">
              <input v-model="newTask.name" placeholder="Task Name" class="border p-2 flex-1 rounded" required />
              <select v-model="newTask.tag_id" class="border p-2 rounded flex-1" required>
                <option value="" disabled>Select a tag</option>
                <option v-for="tag in projectTags" :key="tag.id" :value="tag.id">
                  {{ tag.name }}
                </option>
              </select>
              <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Add Task</button>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Vista previa alineada a la derecha -->
      <div v-if="currentProject" class="w-1/3 border-l p-6 overflow-y-auto bg-white text-black">
        <h2 class="text-2xl font-bold">{{ currentProject.name }}</h2>
        <p class="text-gray-700">{{ currentProject.description }}</p>
        <div v-for="tag in projectTags" :key="tag.id" class="mt-4">
        <h3 class="text-xl font-semibold" :style="{ color: tag.color }">{{ tag.name }}</h3>
        <ul class="list-disc ml-6">
            <li v-for="task in filteredTasks[tag.id]" :key="task.id">{{ task.name }}</li>
        </ul>
</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useProjectStore } from '../store/projects/projectStore';
  import { useTagStore } from '../store/tags/tagStore';
  import { useTaskStore } from '../store/tasks/taskStore';
  
  const projectStore = useProjectStore();
  const tagStore = useTagStore();
  const taskStore = useTaskStore();
  
  const newProject = ref({ name: '', description: '' });
  const newTag = ref({ name: '', color: '#000000' });
  const newTask = ref({ name: '', tag_id: '' });
  const darkMode = ref(false);
  const currentProjectId = ref(null);
  
  const currentProject = computed(() => projectStore.projects.find(proj => proj.id === currentProjectId.value) || null);
  const projectTags = computed(() => tagStore.tags.filter(tag => tag.project_id === currentProjectId.value));
  
  const filteredTasks = computed(() => {
  const tasksByTag = {};
  for (const tag of projectTags.value) {
    tasksByTag[tag.id] = taskStore.tasks.filter(task => task.tag_id === tag.id && task.project_id === currentProjectId.value);
  }
  return tasksByTag;
});


  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
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
      await tagStore.createTag({ ...newTag.value, project_id: currentProjectId.value });
      newTag.value = { name: '', color: '#000000' };
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
      await taskStore.createTask({ ...newTask.value, project_id: currentProjectId.value });
      newTask.value = { name: '', tag_id: '' };
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };
  </script>
  