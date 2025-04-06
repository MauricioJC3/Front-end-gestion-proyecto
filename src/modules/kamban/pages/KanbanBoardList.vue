<template>
  <div class="kanban-boards-list">
    <div class="list-header">
      <h1>Mis Tableros Kanban</h1>
      <button @click="showAddBoard = true" class="btn-add">Crear Tablero</button>
    </div>

    <div v-if="loading" class="loading">
      <p>Cargando tableros...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>
    
    <div v-else-if="boards.length === 0" class="empty-state">
      <p>No hay tableros disponibles. ¡Crea uno nuevo!</p>
    </div>
    
    <div v-else class="boards-grid">
      <div v-for="board in boards" :key="board.id" class="board-card" @click="navigateToBoard(board.id)">
        <div class="board-card-content">
          <h3>{{ board.name }}</h3>
          <p v-if="board.description" class="board-description">{{ board.description }}</p>
          <div class="board-stats">
            <span>{{ getBoardColumnsCount(board) }} columnas</span>
            <span>{{ getTotalTasks(board) }} tareas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para añadir tablero -->
    <div v-if="showAddBoard" class="modal">
      <div class="modal-content">
        <h2>Nuevo Tablero</h2>
        <form @submit.prevent="createNewBoard">
          <div class="form-group">
            <label for="boardName">Nombre</label>
            <input 
              id="boardName"
              v-model="newBoard.name"
              type="text"
              required
            />
          </div>
          <div class="form-group">
            <label for="boardDescription">Descripción (opcional)</label>
            <textarea 
              id="boardDescription"
              v-model="newBoard.description"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddBoard = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '../store/boardStore';
import type { Board, BoardDetails } from '../interfaces/kanbanInterfaces';

// Router
const router = useRouter();

// Store
const boardStore = useBoardStore();

// Estado reactivo
const loading = ref(false);
const error = ref<string | null>(null);
const showAddBoard = ref(false);

// Formulario
const newBoard = ref({
  name: '',
  description: ''
});

// Propiedades computadas
const boards = computed(() => boardStore.boards);

// Métodos
const loadBoards = async () => {
  loading.value = true;
  error.value = null;
  try {
    await boardStore.fetchBoards();
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los tableros';
  } finally {
    loading.value = false;
  }
};

const navigateToBoard = (boardId: number) => {
  router.push(`/boards/${boardId}`);
};

const getBoardColumnsCount = (board: Board) => {
  // Si el board tiene información detallada, podemos tener el conteo de columnas
  if ('columns' in board && board.columns) {
    return board.columns.length;
  }
  // En caso contrario, no tenemos esta información en este nivel
  return 0;
};

const getTotalTasks = (board: Board | BoardDetails) => {
  // Verificamos si es un BoardDetails que tiene columnas
  if ('columns' in board && board.columns) {
    return board.columns.reduce((total, column) => {
      return total + (column.tasks?.length || 0);
    }, 0);
  }
  return 0;
};

const createNewBoard = async () => {
  if (!newBoard.value.name) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    await boardStore.createBoard({
      name: newBoard.value.name,
      description: newBoard.value.description || undefined
    });
    showAddBoard.value = false;
    newBoard.value = { name: '', description: '' };
  } catch (err: any) {
    error.value = err.message || 'Error al crear el tablero';
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(() => {
  loadBoards();
});
</script>

<style scoped>
.kanban-boards-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-add {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.boards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.board-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 180px;
  overflow: hidden;
}

.board-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.board-card-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.board-description {
  flex-grow: 1;
  font-size: 0.9rem;
  color: #555;
  margin: 0.5rem 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.board-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #777;
  margin-top: auto;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn-submit {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.btn-cancel {
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>