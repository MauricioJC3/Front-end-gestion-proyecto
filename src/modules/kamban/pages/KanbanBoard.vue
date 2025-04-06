<template>
  <div class="kanban-board bg-gray-100 min-h-screen p-6" v-if="currentBoard">
    <div class="kanban-header mb-6">
      <h1 class="text-3xl font-bold text-gray-800">{{ currentBoard.name }}</h1>
      <p v-if="currentBoard.description" class="text-gray-600 mt-2">{{ currentBoard.description }}</p>
      <div class="kanban-actions mt-4">
        <button @click="showAddColumn = true" class="btn-add bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow transition duration-200">Añadir Columna</button>
      </div>
    </div>
    <div class="columns-container overflow-x-auto pb-4">
      <draggable
        v-model="columns"
        group="columns"
        item-key="id"
        @end="onColumnDragEnd"
        handle=".column-header"
        class="columns-list flex space-x-4"
      >
        <template #item="{ element: column }">
          <div class="column bg-white rounded-lg shadow-md min-w-[300px] max-w-[300px] flex flex-col">
            <div class="column-header p-3 bg-gray-50 rounded-t-lg border-b border-gray-200 cursor-move flex justify-between items-center">
              <h3 class="font-semibold text-gray-700">{{ column.name }}</h3>
              <div class="column-actions flex space-x-1">
                <button @click="editColumn(column)" class="btn-icon text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition">✏️</button>
                <button @click="deleteColumn(column.id)" class="btn-icon text-gray-500 hover:text-red-500 p-1 rounded hover:bg-gray-200 transition">🗑️</button>
              </div>
            </div>
            
            <draggable
              v-model="column.tasks"
              group="tasks"
              item-key="id"
              @change="(event) => onTaskChange(event, column.id)"
              class="tasks-list flex-grow overflow-y-auto p-2 max-h-[calc(100vh-240px)]"
            >
              <template #item="{ element: task }">
                <div class="task bg-white border border-gray-200 rounded-md p-3 mb-2 shadow-sm hover:shadow cursor-pointer transition" @click="editTask(task)">
                  <div class="task-header flex justify-between items-start mb-2">
                    <h4 class="font-medium text-gray-800">{{ task.title }}</h4>
                    <span v-if="task.completed" class="tag completed bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completada</span>
                  </div>
                  <p v-if="task.description" class="task-description text-gray-600 text-sm mb-2">{{ task.description }}</p>
                  <div v-if="task.due_date" class="task-due-date text-xs text-gray-500 mb-2">
                    Fecha límite: {{ formatDate(task.due_date) }}
                  </div>
                  <div v-if="task.tags && task.tags.length" class="task-tags flex flex-wrap gap-1 mt-2">
                    <span 
                      v-for="tag in task.tags" 
                      :key="tag.id" 
                      class="tag text-xs px-2 py-1 rounded-full" 
                      :style="{ backgroundColor: tag.color }"
                    >
                      {{ tag.name }}
                    </span>
                  </div>
                </div>
              </template>
            </draggable>
            
            <div class="column-footer p-3 border-t border-gray-200">
              <button @click="addTask(column.id)" class="btn-add-task w-full py-2 text-blue-500 hover:bg-blue-50 rounded-md text-sm transition">+ Añadir Tarea</button>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Modal para añadir columna -->
    <div v-if="showAddColumn" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 class="text-xl font-bold p-4 border-b border-gray-200">Nueva Columna</h2>
        <form @submit.prevent="createNewColumn" class="p-4">
          <div class="form-group mb-4">
            <label for="columnName" class="block text-gray-700 mb-2">Nombre</label>
            <input 
              id="columnName"
              v-model="newColumn.name"
              type="text"
              required
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="form-group mb-4">
            <label for="columnDescription" class="block text-gray-700 mb-2">Descripción (opcional)</label>
            <textarea 
              id="columnDescription"
              v-model="newColumn.description"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            ></textarea>
          </div>
          <div class="form-actions flex justify-end space-x-3">
            <button type="button" @click="showAddColumn = false" class="btn-cancel px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
            <button type="submit" class="btn-submit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">Guardar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal para editar columna -->
    <div v-if="showEditColumn" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 class="text-xl font-bold p-4 border-b border-gray-200">Editar Columna</h2>
        <form @submit.prevent="updateExistingColumn" class="p-4">
          <div class="form-group mb-4">
            <label for="editColumnName" class="block text-gray-700 mb-2">Nombre</label>
            <input 
              id="editColumnName"
              v-model="editingColumn.name"
              type="text"
              required
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="form-group mb-4">
            <label for="editColumnDescription" class="block text-gray-700 mb-2">Descripción (opcional)</label>
            <textarea 
              id="editColumnDescription"
              v-model="editingColumn.description"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            ></textarea>
          </div>
          <div class="form-actions flex justify-end space-x-3">
            <button type="button" @click="showEditColumn = false" class="btn-cancel px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
            <button type="submit" class="btn-submit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal para añadir/editar tarea -->
    <div v-if="showTaskModal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 class="text-xl font-bold p-4 border-b border-gray-200">{{ isEditingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
        <form @submit.prevent="saveTask" class="p-4">
          <div class="form-group mb-4">
            <label for="taskTitle" class="block text-gray-700 mb-2">Título</label>
            <input 
              id="taskTitle"
              v-model="taskForm.title"
              type="text"
              required
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="form-group mb-4">
            <label for="taskDescription" class="block text-gray-700 mb-2">Descripción (opcional)</label>
            <textarea 
              id="taskDescription"
              v-model="taskForm.description"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            ></textarea>
          </div>
          <div class="form-group mb-4">
            <label for="taskDueDate" class="block text-gray-700 mb-2">Fecha límite</label>
            <input 
              id="taskDueDate"
              v-model="taskForm.due_date"
              type="date"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="form-group mb-4">
            <label class="block text-gray-700 mb-2">Etiquetas</label>
            <div class="tags-selector flex flex-wrap gap-2">
              <div 
                v-for="tag in availableTags" 
                :key="tag.id"
                class="tag-option rounded-full px-3 py-1 text-sm cursor-pointer transition"
                :class="{ 'ring-2 ring-offset-2': isTagSelected(tag.id) }"
                @click="toggleTag(tag.id)"
                :style="{ backgroundColor: tag.color }"
              >
                {{ tag.name }}
              </div>
            </div>
          </div>
          <div class="form-group checkbox mb-4 flex items-center">
            <input 
              id="taskCompleted"
              v-model="taskForm.completed"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label for="taskCompleted" class="ml-2 text-gray-700">Completada</label>
          </div>
          <div class="form-actions flex justify-end space-x-3">
            <button type="button" @click="closeTaskModal" class="btn-cancel px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
            <button 
              v-if="isEditingTask" 
              type="button" 
              @click="confirmDeleteTask" 
              class="btn-delete bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            >
              Eliminar
            </button>
            <button type="submit" class="btn-submit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">Guardar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteConfirmation" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="modal-content confirmation bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-4">
        <h2 class="text-xl font-bold mb-3">Confirmar eliminación</h2>
        <p class="text-gray-600 mb-4">¿Estás seguro de que deseas eliminar {{ isColumnDelete ? 'esta columna' : 'esta tarea' }}? Esta acción no se puede deshacer.</p>
        <div class="form-actions flex justify-end space-x-3">
          <button @click="showDeleteConfirmation = false" class="btn-cancel px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">Cancelar</button>
          <button @click="confirmDelete" class="btn-delete bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-board flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-md">
      <p v-if="loading" class="text-gray-600">Cargando tablero...</p>
      <p v-else-if="error" class="text-red-500">Error: {{ error }}</p>
      <p v-else class="text-gray-600">No se ha seleccionado ningún tablero.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable/src/vuedraggable';

import { useBoardStore } from '../store/boardStore';
import { useColumnStore } from '../store/columnStore';
import { useKanbanTaskStore as useTaskStore } from "../store/kanbanTaskStore";
import { useKanbanTagStore as useTagStore } from "../store/kanbanTagStore";
import type { Column, KanbanTask, KanbanTag } from '../interfaces/kanbanInterfaces';

// Stores
const boardStore = useBoardStore();
const columnStore = useColumnStore();
const taskStore = useTaskStore();
const tagStore = useTagStore();

// Route params
const route = useRoute();

// Estado reactivo
const loading = ref(false);
const error = ref<string | null>(null);

// Tablero actual
const currentBoard = computed(() => boardStore.currentBoard);

// Columnas
const columns = ref<Column[]>([]);
const showAddColumn = ref(false);
const showEditColumn = ref(false);
const newColumn = ref<any>({ name: '', description: '' });
const editingColumn = ref<any>({ id: null, name: '', description: '' });
const isColumnDelete = ref(false);
const columnToDelete = ref<number | null>(null);

// Tareas
const showTaskModal = ref(false);
const isEditingTask = ref(false);
const taskForm = ref<any>({
  id: null,
  title: '',
  description: '',
  column_id: null,
  due_date: '',
  completed: false,
  tags: []
});
const taskToDelete = ref<number | null>(null);

// Tags
const availableTags = ref<KanbanTag[]>([]);

// Confirmación de eliminación
const showDeleteConfirmation = ref(false);

// Cargar datos al montar componente
onMounted(async () => {
  loading.value = true;
  try {
    // Obtener ID del tablero de la ruta
    const boardId = Number(route.params.id);
    if (isNaN(boardId)) {
      throw new Error('ID de tablero inválido');
    }
    
    // Cargar datos del tablero
    await boardStore.fetchBoardById(boardId);
    
    // Cargar columnas del tablero
    await columnStore.fetchColumns(boardId);
    columns.value = columnStore.columns.map(column => ({
      ...column,
      tasks: []
    }));
    
    // Cargar tareas
    await taskStore.fetchTasks();
    
    // Distribuir tareas en las columnas correspondientes
    for (const column of columns.value) {
      column.tasks = taskStore.tasks.filter(task => task.column_id === column.id);
    }
    
    // Cargar etiquetas disponibles
    await tagStore.fetchTags();
    availableTags.value = tagStore.tags;
    
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los datos';
  } finally {
    loading.value = false;
  }
});

// Funciones para columnas
const createNewColumn = async () => {
  if (!currentBoard.value) return;
  
  try {
    const boardId = currentBoard.value.id;
    const columnData = {
      name: newColumn.value.name,
      position: columns.value.length + 1
    };
    
    const createdColumn = await columnStore.createColumn(boardId, columnData);
    columns.value.push({
      ...createdColumn,
      tasks: []
    });
    
    // Resetear formulario y cerrar modal
    newColumn.value = { name: '', description: '' };
    showAddColumn.value = false;
  } catch (err: any) {
    error.value = err.message || 'Error al crear columna';
  }
};

const editColumn = (column: Column) => {
  editingColumn.value = { ...column };
  showEditColumn.value = true;
};

const updateExistingColumn = async () => {
  if (!currentBoard.value || !editingColumn.value.id) return;
  
  try {
    const boardId = currentBoard.value.id;
    const columnId = editingColumn.value.id;
    const columnData = {
      name: editingColumn.value.name,
      description: editingColumn.value.description
    };
    
    const updatedColumn = await columnStore.updateColumn(boardId, columnId, columnData);
    
    // Actualizar columna en estado local
    const index = columns.value.findIndex(col => col.id === columnId);
    if (index !== -1) {
      const tasks = columns.value[index].tasks;
      columns.value[index] = { ...updatedColumn, tasks };
    }
    
    // Cerrar modal
    showEditColumn.value = false;
  } catch (err: any) {
    error.value = err.message || 'Error al actualizar columna';
  }
};

const deleteColumn = (columnId: number) => {
  isColumnDelete.value = true;
  columnToDelete.value = columnId;
  showDeleteConfirmation.value = true;
};

// Funciones para tareas
const addTask = (columnId: number) => {
  isEditingTask.value = false;
  taskForm.value = {
    title: '',
    description: '',
    column_id: columnId,
    due_date: '',
    completed: false,
    tags: []
  };
  showTaskModal.value = true;
};

const editTask = (task: KanbanTask) => {
  isEditingTask.value = true;
  taskForm.value = {
    ...task,
    tags: task.tags?.map(tag => tag.id) || []
  };
  showTaskModal.value = true;
};

const saveTask = async () => {
  try {
    const taskData = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      column_id: taskForm.value.column_id,
      due_date: taskForm.value.due_date || null,
      completed: taskForm.value.completed || false
    };
    
    let savedTask;
    
    if (isEditingTask.value && taskForm.value.id) {
      // Actualizar tarea existente
      savedTask = await taskStore.updateTask(taskForm.value.id, taskData);
      
      // Actualizar tags
      if (taskForm.value.tags && taskForm.value.tags.length) {
        // Aquí iría la lógica para actualizar las etiquetas de la tarea
        // Ejemplo: await taskTagService.updateTaskTags(savedTask.id, taskForm.value.tags);
      }
      
      // Actualizar tarea en la columna
      const columnIndex = columns.value.findIndex(col => col.id === savedTask.column_id);
      if (columnIndex !== -1) {
        const taskIndex = columns.value[columnIndex].tasks.findIndex(t => t.id === savedTask.id);
        if (taskIndex !== -1) {
          columns.value[columnIndex].tasks[taskIndex] = {
            ...savedTask,
            tags: taskForm.value.tags.map((tagId: number) => availableTags.value.find(tag => tag.id === tagId))
              .filter(Boolean)
          };
        }
      }
    } else {
      // Crear nueva tarea
      savedTask = await taskStore.createTask(taskData);
      
      // Añadir tags si existen
      if (taskForm.value.tags && taskForm.value.tags.length) {
        // Aquí iría la lógica para asociar etiquetas a la nueva tarea
        // Ejemplo: await taskTagService.updateTaskTags(savedTask.id, taskForm.value.tags);
      }
      
      // Añadir tarea a la columna correspondiente
      const columnIndex = columns.value.findIndex(col => col.id === savedTask.column_id);
      if (columnIndex !== -1) {
        const newTaskWithTags = {
          ...savedTask,
          tags: taskForm.value.tags.map((tagId: number) => availableTags.value.find(tag => tag.id === tagId))
            .filter(Boolean)
        };
        columns.value[columnIndex].tasks.push(newTaskWithTags);
      }
    }
    
    closeTaskModal();
  } catch (err: any) {
    error.value = err.message || 'Error al guardar la tarea';
  }
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  taskForm.value = {
    id: null,
    title: '',
    description: '',
    column_id: null,
    due_date: '',
    completed: false,
    tags: []
  };
};

const confirmDeleteTask = () => {
  taskToDelete.value = taskForm.value.id;
  isColumnDelete.value = false;
  showDeleteConfirmation.value = true;
};

// Funciones de arrastrar y soltar (drag and drop)
const onColumnDragEnd = async (event: any) => {
  // Actualizar posiciones de columnas en backend
  try {
    if (!currentBoard.value) return;
    
    const boardId = currentBoard.value.id;
    
    // Iterar por todas las columnas y actualizar sus posiciones
    for (let i = 0; i < columns.value.length; i++) {
      const column = columns.value[i];
      if (column.position !== i + 1) {
        await columnStore.updateColumn(boardId, column.id, {
          position: i + 1
        });
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Error al reordenar columnas';
  }
};

const onTaskChange = async (event: any, columnId: number) => {
  // Esta función se llama cuando una tarea se arrastra a una nueva posición o columna
  try {
    // Si se añadió una tarea a esta columna
    if (event.added) {
      const task = event.added.element;
      const newIndex = event.added.newIndex;
      
      // Si la tarea se movió de otra columna, actualizar column_id
      if (task.column_id !== columnId) {
        // Actualizar en el backend
        await taskStore.updateTask(task.id, {
          column_id: columnId,
          position: newIndex + 1
        });
        
        // Actualizar el modelo local
        task.column_id = columnId;
      } else {
        // Solo actualizar posición
        await taskStore.updateTask(task.id, {
          position: newIndex + 1
        });
      }
    }
    
    // Si se eliminó una tarea de esta columna (por ser movida a otra)
    if (event.removed) {
      // No necesitamos hacer nada aquí, porque la lógica para mover la tarea
      // se manejan en el evento "added" de la columna de destino
    }
    
    // Si se movió una tarea dentro de la misma columna
    if (event.moved) {
      const taskId = event.moved.element.id;
      const newIndex = event.moved.newIndex;
      
      // Actualizar posición en backend
      await taskStore.updateTask(taskId, {
        position: newIndex + 1
      });
    }
    
    // Reordenar todas las tareas en la columna
    for (let i = 0; i < columns.value.length; i++) {
      const column = columns.value[i];
      
      // Reordenar todas las tareas si es la columna afectada
      if (column.id === columnId) {
        for (let j = 0; j < column.tasks.length; j++) {
          const task = column.tasks[j];
          if (task.position !== j + 1) {
            await taskStore.updateTask(task.id, {
              position: j + 1
            });
            task.position = j + 1;
          }
        }
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Error al mover tarea';
    // Recargar datos para asegurar consistencia
    const boardId = Number(route.params.id);
    if (!isNaN(boardId)) {
      await columnStore.fetchColumns(boardId);
      await taskStore.fetchTasks();
    }
  }
};

// Funciones auxiliares
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const isTagSelected = (tagId: number) => {
  return taskForm.value.tags && taskForm.value.tags.includes(tagId);
};

const toggleTag = (tagId: number) => {
  if (!taskForm.value.tags) {
    taskForm.value.tags = [];
  }
  
  const index = taskForm.value.tags.indexOf(tagId);
  if (index === -1) {
    taskForm.value.tags.push(tagId);
  } else {
    taskForm.value.tags.splice(index, 1);
  }
};

const confirmDelete = async () => {
  try {
    if (isColumnDelete.value && columnToDelete.value) {
      // Eliminar columna
      if (!currentBoard.value) return;
      
      await columnStore.deleteColumn(currentBoard.value.id, columnToDelete.value);
      
      // Eliminar columna del estado local
      const index = columns.value.findIndex(col => col.id === columnToDelete.value);
      if (index !== -1) {
        columns.value.splice(index, 1);
      }
      
      columnToDelete.value = null;
    } else if (taskToDelete.value) {
      // Eliminar tarea
      await taskStore.deleteTask(taskToDelete.value);
      
      // Eliminar tarea del estado local
      for (const column of columns.value) {
        const index = column.tasks.findIndex(task => task.id === taskToDelete.value);
        if (index !== -1) {
          column.tasks.splice(index, 1);
          break;
        }
      }
      
      taskToDelete.value = null;
      closeTaskModal();
    }
    
    showDeleteConfirmation.value = false;
  } catch (err: any) {
    error.value = err.message || 'Error al eliminar';
  }
};
</script>