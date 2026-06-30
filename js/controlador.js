const manager = new TaskManager();

function refreshUI() {
    const stats = manager.getStats();
    renderStats(stats);
    renderSidebarStats(stats);
    renderTaskList(manager.getAll());
}

const btnAddTask = document.getElementById('btn-add-task');
if (btnAddTask) {
    btnAddTask.addEventListener('click', () => {
        showModal();
    });
}

const btnCloseModal = document.getElementById('btn-close-modal');
if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
        hideModal();
    });
}

const taskModal = document.getElementById('task-modal');
if (taskModal) {
    taskModal.addEventListener('click', (e) => {
        if (e.target === document.getElementById('task-modal')) hideModal();
    });
}

const taskForm = document.getElementById('task-form');
if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('task-title-input').value.trim();
        const description = document.getElementById('task-desc-input').value.trim();
        const priority = document.getElementById('task-priority-input').value;
        const dueDate = document.getElementById('task-due-input').value;

        if (!title) return;

        manager.add(title, description, priority, dueDate);
        hideModal();
        refreshUI();
        showToast('Tarea agregada correctamente');
    });
}

const taskList = document.getElementById('task-list');
if (taskList) {
    taskList.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.btn-toggle');
        const deleteBtn = e.target.closest('.btn-delete');

        if (toggleBtn) {
            manager.toggleStatus(toggleBtn.dataset.id);
            refreshUI();
        }

        if (deleteBtn) {
            manager.delete(deleteBtn.dataset.id);
            refreshUI();
            showToast('Tarea eliminada', 'error');
        }
    });
}

const filterStatus = document.getElementById('filter-status');
const filterPriority = document.getElementById('filter-priority');

if (filterStatus) filterStatus.addEventListener('change', () => applyFilters());
if (filterPriority) filterPriority.addEventListener('change', () => applyFilters());

function applyFilters() {
    const status = document.getElementById('filter-status').value.trim();
    const priority = document.getElementById('filter-priority').value.trim();

    const tasks = manager.getFiltered(status, priority);
    renderTaskList(tasks);
}

function renderSidebarStats(stats) {
    const elTotal = document.getElementById('sb-stat-total');
    const elPending = document.getElementById('sb-stat-pending');
    const elDone = document.getElementById('sb-stat-done');
    if (elTotal) elTotal.textContent = stats.total;
    if (elPending) elPending.textContent = stats.pending;
    if (elDone) elDone.textContent = stats.done;
}

renderSidebarStats(manager.getSidebarStats());

refreshUI();

const btnHamburger = document.getElementById('btn-hamburger');
if (btnHamburger) {
    btnHamburger.addEventListener('click', () => {
        const isOpen = toggleSidebar();   
        setHamburgerState(isOpen);        
    });
}

const sidebarOverlay = document.getElementById('sidebar-overlay');
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        closeSidebar();                   
        setHamburgerState(false);         
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        closeSidebar();
        setHamburgerState(false);
    }
});
