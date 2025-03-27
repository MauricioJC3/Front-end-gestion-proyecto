<!-- src/views/ProjectTagsView.vue -->
<template>
    <div class="tags-container">
      <h1 class="text-2xl font-bold mb-4">Project Tags</h1>
  
      <!-- Project Selector -->
      <div class="mb-6">
        <label class="block mb-2">Select Project</label>
        <select 
          v-model="selectedProjectId" 
          @change="fetchTagsForProject"
          class="border p-2 w-full"
        >
          <option 
            v-for="project in projectStore.projects" 
            :key="project.id" 
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
      </div>
  
      <!-- Loading State -->
      <div v-if="tagStore.loading" class="text-center">
        Loading tags...
      </div>
  
      <!-- Error State -->
      <div v-if="tagStore.error" class="bg-red-100 text-red-700 p-4 rounded">
        {{ tagStore.error }}
      </div>
  
      <!-- Create Tag Form -->
      <form @submit.prevent="createTag" class="mb-6">
        <div class="flex space-x-2">
          <input 
            v-model="newTag.name" 
            placeholder="Tag Name" 
            class="border p-2 flex-grow"
            required
          />
          <input 
            v-model="newTag.color" 
            type="color" 
            class="border p-2"
          />
          <button 
            type="submit" 
            class="bg-blue-500 text-white px-4 py-2 rounded"
            :disabled="!selectedProjectId"
          >
            Create Tag
          </button>
        </div>
      </form>
  
      <!-- Tags List -->
      <div v-if="tagStore.tags.length" class="grid gap-4">
        <div 
          v-for="tag in tagStore.tags" 
          :key="tag.id" 
          class="border p-4 rounded flex justify-between items-center"
          :style="{ backgroundColor: tag.color + '20' }"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-6 h-6 rounded-full" 
              :style="{ backgroundColor: tag.color }"
            ></div>
            <span class="font-semibold">{{ tag.name }}</span>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="editTag(tag)" 
              class="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button 
              @click="deleteTag(tag.id)" 
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
  
      <!-- No Tags State -->
      <div v-else-if="!tagStore.loading && selectedProjectId" class="text-center text-gray-500">
        No tags found for this project. Create your first tag!
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useProjectStore } from '../store/projectStore'
  import { useTagStore } from '../store/tagStore'
  import { useRouter } from 'vue-router'
  
  // Initialize stores and router
  const projectStore = useProjectStore()
  const tagStore = useTagStore()
  const router = useRouter()
  
  // Selected project and new tag data
  const selectedProjectId = ref(null)
  const newTag = ref({
    name: '',
    color: '#000000'
  })
  
  // Fetch projects on component mount
  onMounted(() => {
    projectStore.fetchProjects()
  })
  
  // Fetch tags for selected project
  const fetchTagsForProject = () => {
    if (selectedProjectId.value) {
      tagStore.fetchTagsByProject(selectedProjectId.value)
    }
  }
  
  // Create a new tag
  const createTag = async () => {
    try {
      await tagStore.createTag({
        project_id: selectedProjectId.value,
        name: newTag.value.name,
        color: newTag.value.color
      })
      // Reset form
      newTag.value.name = ''
      newTag.value.color = '#000000'
    } catch (error) {
      console.error('Failed to create tag', error)
    }
  }
  
  // Edit tag (navigate to edit page)
  const editTag = (tag) => {
    router.push(`/tags/edit/${tag.id}`)
  }
  
  // Delete tag
  const deleteTag = async (tagId) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      try {
        await tagStore.deleteTag(tagId)
      } catch (error) {
        console.error('Failed to delete tag', error)
      }
    }
  }
  </script>