<!-- src/views/ProjectsView.vue -->
<template>
    <div class="projects-container">
      <h1 class="text-2xl font-bold mb-4">My Projects</h1>
  
      <!-- Loading State -->
      <div v-if="projectStore.loading" class="text-center">
        Loading projects...
      </div>
  
      <!-- Error State -->
      <div v-if="projectStore.error" class="bg-red-100 text-red-700 p-4 rounded">
        {{ projectStore.error }}
      </div>
  
      <!-- Create Project Form -->
      <form @submit.prevent="createProject" class="mb-6">
        <div class="flex space-x-2">
          <input 
            v-model="newProject.name" 
            placeholder="Project Name" 
            class="border p-2 flex-grow"
            required
          />
          <input 
            v-model="newProject.description" 
            placeholder="Description (optional)" 
            class="border p-2 flex-grow"
          />
          <button 
            type="submit" 
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Project
          </button>
        </div>
      </form>
  
      <!-- Projects List -->
      <div v-if="projectStore.projects.length" class="grid gap-4">
        <div 
          v-for="project in projectStore.projects" 
          :key="project.id" 
          class="border p-4 rounded flex justify-between items-center"
        >
          <div>
            <h2 class="text-xl font-semibold">{{ project.name }}</h2>
            <p class="text-gray-600">{{ project.description }}</p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="editProject(project)" 
              class="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button 
              @click="deleteProject(project.id)" 
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
  
      <!-- No Projects State -->
      <div v-else-if="!projectStore.loading" class="text-center text-gray-500">
        No projects found. Create your first project!
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useProjectStore } from '../store/projectStore'
  import { useRouter } from 'vue-router'
  
  // Initialize stores and router
  const projectStore = useProjectStore()
  const router = useRouter()
  
  // New project form data
  const newProject = ref({
    name: '',
    description: ''
  })
  
  // Fetch projects on component mount
  onMounted(() => {
    projectStore.fetchProjects()
  })
  
  // Create a new project
  const createProject = async () => {
    try {
      await projectStore.createProject({
        name: newProject.value.name,
        description: newProject.value.description
      })
      // Reset form
      newProject.value.name = ''
      newProject.value.description = ''
    } catch (error) {
      console.error('Failed to create project', error)
    }
  }
  
  // Edit project (navigate to edit page)
  const editProject = (project) => {
    router.push(`/projects/edit/${project.id}`)
  }
  
  // Delete project
  const deleteProject = async (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectStore.deleteProject(projectId)
      } catch (error) {
        console.error('Failed to delete project', error)
      }
    }
  }
  </script>