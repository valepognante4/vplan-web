const API_BASE = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE}/api/tareas`;

// Mapea una fila del DB (snake_case español) al shape que usa el Dashboard
const mapTarea = (t) => ({
    id:          t.id,
    title:       t.titulo,
    description: t.descripcion,
    priority:    t.prioridad,
    dueDate:     t.fecha_vencimiento,
    completed:   t.completada,
    createdAt:   t.created_at,
});

// Helper para incluir el token JWT en las cabeceras
const getAuthHeaders = () => {
    const token = localStorage.getItem('vplan_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const taskService = {
    async getTasks() {
        const response = await fetch(API_URL, { 
            headers: getAuthHeaders(),
            credentials: 'include' 
        });
        if (!response.ok) throw new Error('Error al obtener las tareas');
        const data = await response.json();
        return data.map(mapTarea);
    },

    async createTask(taskData) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Error al crear la tarea');
        return mapTarea(await response.json());
    },

    async toggleTask(id) {
        const response = await fetch(`${API_URL}/${id}/toggle`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al actualizar la tarea');
        return mapTarea(await response.json());
    },

    async deleteTask(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Error al eliminar la tarea');
        return await response.json();
    },
};