const PRIORITY_LABELS = { high: 'Alta', medium: 'Media', low: 'Baja' };
const PRIORITY_COLORS = { high: '#dc2626', medium: '#d97706', low: '#16a34a' };

function renderStats(stats) {
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-done').textContent = stats.done;
    document.getElementById('stat-pending').textContent = stats.pending;
}

function renderTaskList(tasks) {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    if (tasks.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i data-lucide="clipboard-list"></i>
                <p>No hay tareas todavía. ¡Agrega una!</p>
            </div>`;
        lucide.createIcons();
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card ${task.status === 'done' ? 'task-done' : ''}`;
        card.dataset.id = task.id;

        card.innerHTML = `
            <div class="task-card-header">
                <span class="priority-badge" style="background:${PRIORITY_COLORS[task.priority]}20; color:${PRIORITY_COLORS[task.priority]}">
                    ${PRIORITY_LABELS[task.priority]}
                </span>
                ${task.dueDate ? `<span class="due-date"><i data-lucide="calendar" style="width:12px;height:12px"></i> ${formatDate(task.dueDate)}</span>` : ''}
            </div>
            <h4 class="task-title">${task.title}</h4>
            ${task.description ? `<p class="task-desc">${task.description}</p>` : ''}
            <div class="task-card-footer">
                <button class="btn-toggle" data-id="${task.id}" title="${task.status === 'done' ? 'Marcar pendiente' : 'Completar'}">
                    <i data-lucide="${task.status === 'done' ? 'rotate-ccw' : 'check-circle-2'}"></i>
                    ${task.status === 'done' ? 'Deshacer' : 'Completar'}
                </button>
                <button class="btn-delete" data-id="${task.id}" title="Eliminar tarea">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>`;

        list.appendChild(card);
    });

    lucide.createIcons();
}

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

function showModal() {
    document.getElementById('task-modal').classList.add('open');
    document.getElementById('task-title-input').focus();
}

function hideModal() {
    document.getElementById('task-modal').classList.remove('open');
    document.getElementById('task-form').reset();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}
