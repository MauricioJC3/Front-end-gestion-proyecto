export interface Task {
	id: number;
	tag_id: number;
	name: string;
	description?: string;
	due_date?: string;
	completed: boolean;
	created_at: string;
	updated_at: string;
}
