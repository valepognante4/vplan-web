const STORAGE_KEY = 'vplan_tasks';

class TaskManager {
    constructor() {
        this.tasks = this._load();
    }

    _load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    _save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    }

    _generateId() {
        return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    }

    getAll() {
        return this.tasks;
    }

    getFiltered(status, priority) {
        let filtered = this.tasks;
        if (status && status !== 'all') {
            filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
        }
        if (priority && priority !== 'all') {
            filtered = filtered.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
        }
        return filtered;
    }

    add(title, description, priority, dueDate) {
        const task = {
            id: this._generateId(),
            title,
            description,
            priority,
            dueDate,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        this.tasks.unshift(task);
        this._save();
        return task;
    }

    delete(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this._save();
    }

    toggleStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        task.status = task.status === 'pending' ? 'done' : 'pending';
        this._save();
    }

    getStats() {
        const total = this.tasks.length;
        const done = this.tasks.filter(t => t.status === 'done').length;
        const pending = total - done;
        return { total, done, pending };
    }

    getSidebarStats() {
        return this.getStats();
    }
}
