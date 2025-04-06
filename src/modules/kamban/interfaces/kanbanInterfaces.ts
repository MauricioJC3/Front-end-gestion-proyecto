// interfaces/kanbanInterfaces.ts

export interface Board {
	id: number;
	user_id: number;
	name: string;
	description?: string;
	created_at: string;
	updated_at: string;
}

export interface BoardDetails extends Board {
	columns: Column[];
}

export interface Column {
	id: number;
	board_id: number;
	name: string;
	position: number;
	created_at: string;
	updated_at: string;
	tasks?: KanbanTask[]; // Opcional para cuando queramos cargar las tareas junto con las columnas
}

export interface KanbanTask {
	id: number;
	column_id: number;
	title: string;
	description?: string;
	position: number;
	completed: boolean;
	start_date?: string;
	due_date?: string;
	created_at: string;
	updated_at: string;
	users?: User[]; // Usuarios asignados a la tarea
	tags?: KanbanTag[]; // Etiquetas asignadas a la tarea
}

export interface User {
	id: number;
	name: string;
	email: string;
	// Otros campos de usuario que sean relevantes
}

export interface KanbanTag {
	id: number;
	board_id: number;
	name: string;
	color?: string;
	created_at: string;
	updated_at: string;
}
