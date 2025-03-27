<!-- src/views/TasksView.vue -->
<template>
    <div class="tasks-container">
      <h1 class="text-2xl font-bold mb-4">Tasks</h1>
  
      <!-- Project and Tag Selector -->
      <div class="mb-6 flex space-x-4">
        <div class="flex-1">
          <label class="block mb-2">Select Project</label>
          <select 
            v-model="selectedProjectId" 
            @change="updateTagOptions"
            class="border p-2 w-full"
          >
            <option value="">Select a Project</option>
            <option 
              v-for="project in projectStore.projects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>
  
        <div class="flex-1">
          <label class="block mb-2">Select Tag</label>
          <select 
            v-model="selectedTagId" 
            @change="fetchTasksForTag"
            class="border p-2 w-full"
            :disabled="!selectedProjectId"
          >
            <option value="">Select a Tag</option>
            <option 
              v-for="tag in tagsForProject" 
              :key="tag.id" 
              :value="tag.id"
            >
              {{ tag.name }}
            </option>
          </select>
        </div>
      </div>
  
      <!-- Create Task Form -->
      <form 
        @submit.prevent="createTask" 
        class="mb-6 grid grid-cols-2 gap-4"
        v-if="selectedTagId"
      >
        <input 
          v-model="newTask.name" 
          placeholder="Task Name" 
          class="border p-2"
          required
        />
        <input 
          v-model="newTask.description" 
          placeholder="Description (optional)" 
          class="border p-2"
        />
        <input 
          v-model="newTask.due_date" 
          type="date" 
          class="border p-2"
        />
        <button 
          type="submit" 
          class="bg-blue-500 text-white p-2 rounded"
        >
          Create Task
        </button>
      </form>
  
      <!-- Loading State -->
      <div v-if="taskStore.loading" class="text-center">
        Loading tasks...
      </div>
  
      <!-- Error State -->
      <div v-if="taskStore.error" class="bg-red-100 text-red-700 p-4 rounded">
        {{ taskStore.error }}
      </div>
  
      <!-- Tasks List -->
      <div v-if="taskStore.tasks.length" class="space-y-4">
        <div 
          v-for="task in taskStore.tasks" 
          :key="task.id" 
          class="border p-4 rounded flex justify-between items-center"
          :class="{
            'bg-green-50': task.completed,
            'bg-white': !task.completed
          }"
        >
          <div>
            <h2 
              class="text-xl font-semibold"
              :class="{ 'line-through text-gray-500': task.completed }"
            >
              {{ task.name }}
            </h2>
            <p class="text-gray-600">{{ task.description }}</p>
            <p v-if="task.due_date" class="text-sm text-gray-500">
              Due: {{ new Date(task.due_date).toLocaleDateString() }}
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              v-if="!task.completed"
              @click="completeTask(task.id)" 
              class="bg-green-500 text-white px-3 py-1 rounded"
            >
              Complete
            </button>
            <button 
              @click="deleteTask(task.id)" 
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
  
      <!-- No Tasks State -->
      <div 
        v-else-if="!taskStore.loading && selectedTagId" 
        class="text-center text-gray-500"
      >
        No tasks found for this tag. Create your first task!
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useProjectStore } from '../store/projectStore'
  import { useTagStore } from '../store/tagStore'
  import { useTaskStore } from '../store/taskStore'
  
  // Initialize stores
  const projectStore = useProjectStore()
  const tagStore = useTagStore()
  const taskStore = useTaskStore()
  
  // Reactive variables
  const selectedProjectId = ref(null)
  const selectedTagId = ref(null)
  const newTask = ref({
    name: '',
    description: '',
    due_date: ''
  })
  
  // Computed property for tags based on selected project
  const tagsForProject = computed(() => {
    return selectedProjectId.value 
      ? tagStore.tags.filter(tag => tag.project_id === selectedProjectId.value)
      : []
  })
  
  // Fetch projects and tags on mount
  onMounted(() => {
    projectStore.fetchProjects()
  })
  
  // Update tag options when project is selected
  const updateTagOptions = () => {
    // Reset tag selection
    selectedTagId.value = null
    
    // Fetch tags for the selected project
    if (selectedProjectId.value) {
      tagStore.fetchTagsByProject(selectedProjectId.value)
    }
  }
  
  // Fetch tasks for selected tag
  const fetchTasksForTag = () => {
    if (selectedTagId.value) {
      taskStore.fetchTasksByTag(selectedTagId.value)
    }
  }
  
  // Create a new task
  const createTask = async () => {
    try {
      await taskStore.createTask({
        tag_id: selectedTagId.value,
        name: newTask.value.name,
        description: newTask.value.description,
        due_date: newTask.value.due_date
      })
      // Reset form
      newTask.value.name = ''
      newTask.value.description = ''
      newTask.value.due_date = ''
    } catch (error) {
      console.error('Failed to create task', error)
    }
  }
  
  // Complete a task
  const completeTask = async (taskId) => {
    try {
      await taskStore.completeTask(taskId)
    } catch (error) {
      console.error('Failed to complete task', error)
    }
  }
  
  // Delete a task
  const deleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskStore.deleteTask(taskId)
      } catch (error) {
        console.error('Failed to delete task', error)
      }
    }
  }
  </script>