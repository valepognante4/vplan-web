import React, { useState, useEffect } from 'react';
import { 
  ListChecks, 
  LogOut, 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  X, 
  PlusCircle 
} from 'lucide-react';
import { taskService } from './taskService';
import './Dashboard.css';

export default function PanelPrincipal({ onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  // Cargar tareas desde PostgreSQL vía Node.js al montar el componente
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  // Estadísticas calculadas automáticamente desde el estado
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const doneTasks = tasks.filter(t => t.completed).length;

  // Filtrado de tareas
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'done' && task.completed) || 
      (filterStatus === 'pending' && !task.completed);
    
    const matchesPriority = 
      filterPriority === 'all' || task.priority === filterPriority;

    return matchesStatus && matchesPriority;
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await taskService.createTask({
        title,
        description,
        priority,
        dueDate
      });

      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const updatedTask = await taskService.toggleTask(id);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <div className="vplan-dashboard">
      <div className="bubble-layer" aria-hidden="true"></div>
      <div className="bubble-mid" aria-hidden="true"></div>
      <div className="bubble-sm" aria-hidden="true"></div>

      <div className="dashboard-container">
        {/* Sidebar */}
        <nav className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="logo-container">
            <img src="img/LogoVPlan (1).png" alt="Logo VPlan" className="logo-img" />
          </div>
          <ul>
            <li className="nav-item active">
              <a href="#tasks" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
                <ListChecks size={18} /> Mis Tareas
              </a>
            </li>
          </ul>

          <div className="sidebar-stats-inline">
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Total</span>
              <span className="sidebar-stat-value">{totalTasks}</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Pendientes</span>
              <span className="sidebar-stat-value sb-pending">{pendingTasks}</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Completadas</span>
              <span className="sidebar-stat-value sb-done">{doneTasks}</span>
            </div>
          </div>

          <div className="sidebar-footer">
            <button
              onClick={() => { localStorage.removeItem('vplan_user'); localStorage.removeItem('vplan_name'); onNavigate('landing'); }}
              className="btn-logout"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </div>
        </nav>

        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'sidebar-overlay--visible' : ''}`} 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>

        {/* Contenido Principal */}
        <main className="content">
          <header className="content-header">
            <button 
              className={`btn-hamburger ${isSidebarOpen ? 'is-open' : ''}`} 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Abrir menú" 
              aria-expanded={isSidebarOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1>Hola de nuevo</h1>
              <p>Organiza tu día con claridad</p>
            </div>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Nueva Tarea
            </button>
          </header>

          <section className="stats-row">
            <div className="stat-card glass-card">
              <div className="stat-icon-wrap"><Layers size={22} /></div>
              <div>
                <span className="stat-number">{totalTasks}</span>
                <p>Total</p>
              </div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon-wrap"><Clock size={22} /></div>
              <div>
                <span className="stat-number">{pendingTasks}</span>
                <p>Pendientes</p>
              </div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon-wrap"><CheckCircle2 size={22} /></div>
              <div>
                <span className="stat-number">{doneTasks}</span>
                <p>Completadas</p>
              </div>
            </div>
          </section>

          <section className="filter-bar">
            <label htmlFor="filter-status">Estado:</label>
            <select 
              id="filter-status" 
              className="glass-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="done">Completadas</option>
            </select>

            <label htmlFor="filter-priority">Prioridad:</label>
            <select 
              id="filter-priority" 
              className="glass-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </section>

          <section id="task-list" className="task-board">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <ListChecks size={52} />
                <p>No hay tareas que mostrar con estos filtros.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={`task-card ${task.completed ? 'task-done' : ''}`}>
                  <div className="task-card-header">
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                    {task.dueDate && (
                      <span className="due-date">
                        <Clock size={14} /> {task.dueDate}
                      </span>
                    )}
                  </div>
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div className="task-card-footer">
                    <button className="btn-toggle" onClick={() => handleToggleTask(task.id)}>
                      <CheckCircle2 size={16} /> {task.completed ? 'Marcar pendiente' : 'Completar'}
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>
                      <X size={16} /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>

      {/* Modal de Nueva Tarea */}
      <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) setIsModalOpen(false); }}>
        <div className="modal-box glass-card">
          <div className="modal-header">
            <h2>Nueva Tarea</h2>
            <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
          </div>
          <form onSubmit={handleAddTask}>
            <div className="input-group">
              <label htmlFor="task-title-input">Título *</label>
              <input 
                type="text" 
                id="task-title-input" 
                placeholder="¿Qué necesitas hacer?" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="task-desc-input">Descripción</label>
              <textarea 
                id="task-desc-input" 
                placeholder="Detalles opcionales..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="task-priority-input">Prioridad</label>
                <select 
                  id="task-priority-input" 
                  className="glass-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="task-due-input">Fecha límite</label>
                <input 
                  type="date" 
                  id="task-due-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary btn-full">
              <PlusCircle size={18} /> Agregar Tarea
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}