import { useState } from 'react';
import './App.css';
import PanelPrincipal from './Dashboard';
// Importa tus componentes de login y registro cuando los crees, por ejemplo:
import Login from './Login';
import Register from './Register';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  // Renderizado condicional según la vista actual
  if (currentView === 'dashboard') {
    return <PanelPrincipal onNavigate={setCurrentView} />;
  }

  // Descomenta y ajusta esto cuando crees los componentes de Login y Register:
  if (currentView === 'login') {
     return <Login onNavigate={setCurrentView} />;
 }
  if (currentView === 'register') {
    return <Register onNavigate={setCurrentView} />;
 }

  return (
    <div className="vplan-landing">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo-container" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✔</span>
          <span className="logo-text">VPlan</span>
        </div>
        <div className="nav-buttons">
          {/* CAMBIO AQUÍ: Apunta a 'login' */}
          <button className="btn-secondary" onClick={() => setCurrentView('login')}>
            Iniciar sesión
          </button>
          {/* CAMBIO AQUÍ: Apunta a 'register' */}
          <button className="btn-primary" onClick={() => setCurrentView('register')}>
            Registrarse
          </button>
        </div>
      </nav>

      {/* Sección Hero / Bienvenida */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">Tu productividad, simplificada 🚀</span>
          <h1>Organiza, prioriza y alcanza tus metas diarias</h1>
          <p>
            Una plataforma diseñada para optimizar tu tiempo, gestionar tareas con prioridades
            y llevar el control de tus métricas de productividad de forma profesional.
          </p>
          <div className="hero-actions">
            {/* Aquí puedes decidir si 'Empezar ahora' lleva al registro o al dashboard */}
            <button className="btn-primary-large" onClick={() => setCurrentView('register')}>
              Empezar ahora
            </button>
            <button className="btn-outline">Conocer más</button>
          </div>
        </div>

        {/* Bloque visual / Animado */}
        <div className="hero-visual">
          <div className="floating-card card-1">
            <span>📊 Dashboard con métricas</span>
          </div>
          <div className="floating-card card-2">
            <span>✅ Gestión de prioridades</span>
          </div>
        </div>
      </section>
    </div>
  );
}