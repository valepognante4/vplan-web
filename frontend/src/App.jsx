import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  ListChecks,
  CalendarDays,
  CheckCircle2,
  Circle,
  TrendingUp,
  Zap,
  Shield,
  Smartphone,
  BadgeCheck,
} from 'lucide-react';
import './App.css';
import PanelPrincipal  from './Dashboard';
import Login           from './Login';
import Register        from './Register';
import ResetPassword   from './ResetPassword';
import logoVPlan       from './img/LogoVPlan.png';

/**
 * Detecta si la URL actual contiene un token de reset (/reset-password?token=...).
 * Si hay token, devuelve { view: 'reset-password', token }.
 * Si no, devuelve { view: 'landing', token: null }.
 */
function getInitialState() {
  const params = new URLSearchParams(window.location.search);
  const path   = window.location.pathname;
  const token  = params.get('token');

  if (path === '/reset-password' && token) {
    return { view: 'reset-password', token };
  }
  return { view: 'landing', token: null };
}

export default function App() {
  const initial = getInitialState();
  const [currentView, setCurrentView] = useState(initial.view);
  const [resetToken,  setResetToken]  = useState(initial.token);

  /* Navegar entre vistas — limpiamos la URL si salimos del reset */
  const handleNavigate = (view) => {
    if (view !== 'reset-password') {
      // Limpiar query-params del reset para no dejar el token en la barra
      const cleanUrl = window.location.pathname.replace('/reset-password', '/') || '/';
      window.history.replaceState({}, '', cleanUrl === '/reset-password' ? '/' : cleanUrl);
      setResetToken(null);
    }
    setCurrentView(view);
  };

  if (currentView === 'dashboard')      return <PanelPrincipal onNavigate={handleNavigate} />;
  if (currentView === 'login')          return <Login          onNavigate={handleNavigate} />;
  if (currentView === 'register')       return <Register       onNavigate={handleNavigate} />;
  if (currentView === 'reset-password') return <ResetPassword  onNavigate={handleNavigate} token={resetToken} />;

  /* ── Landing Page ──────────────────────────────────────────── */
  return (
    <div className="vplan-landing">

      <div className="landing-bg" aria-hidden="true">
        <div className="landing-grid" />
        <div className="landing-bubbles">
          <div className="lb lb-1" />
          <div className="lb lb-2" />
          <div className="lb lb-3" />
        </div>
      </div>

      <nav className="navbar">
        <div
          className="logo-container"
          onClick={() => setCurrentView('landing')}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          aria-label="Ir al inicio"
        >
          <img src={logoVPlan} alt="VPlan" className="navbar-logo" />
        </div>
        <div className="nav-buttons">
          <button className="btn-secondary" onClick={() => setCurrentView('login')}>
            Iniciar sesión
          </button>
          <button className="btn-primary" onClick={() => setCurrentView('register')}>
            Registrarse
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">
            <Sparkles size={14} strokeWidth={2.2} aria-hidden="true" />
            Tu productividad, simplificada
          </span>
          <h1>
            Organiza, prioriza<br />
            y alcanza tus <span className="hero-highlight">metas diarias</span>
          </h1>
          <p className="hero-description">
            Una plataforma diseñada para optimizar tu tiempo, gestionar tareas con prioridades
            y llevar el control de tus métricas de productividad de forma profesional.
          </p>
          <div className="hero-actions">
            <button className="btn-primary-large" onClick={() => setCurrentView('register')}>
              Empezar ahora
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button className="btn-outline" onClick={() => setCurrentView('login')}>
              Ya tengo cuenta
            </button>
          </div>

          <div className="hero-social-proof">
            <div className="proof-avatars" aria-hidden="true">
              <span className="proof-avatar">MR</span>
              <span className="proof-avatar">AL</span>
              <span className="proof-avatar">JS</span>
            </div>
            <p className="proof-text">
              <strong>500+</strong> tareas completadas por nuestra comunidad
            </p>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-glow" />

          <div className="dashboard-mockup">
            <div className="mockup-toolbar">
              <span className="mockup-dot mockup-dot-red" />
              <span className="mockup-dot mockup-dot-yellow" />
              <span className="mockup-dot mockup-dot-green" />
              <span className="mockup-title">VPlan · Panel</span>
            </div>

            <div className="mockup-body">
              <div className="mockup-stats">
                <div className="mockup-stat">
                  <span className="mockup-stat-label">Completadas</span>
                  <span className="mockup-stat-value">24</span>
                  <span className="mockup-stat-trend">
                    <TrendingUp size={12} strokeWidth={2.5} />
                    +18%
                  </span>
                </div>
                <div className="mockup-stat mockup-stat-accent">
                  <span className="mockup-stat-label">En progreso</span>
                  <span className="mockup-stat-value">8</span>
                  <div className="mockup-progress">
                    <div className="mockup-progress-fill" />
                  </div>
                </div>
              </div>

              <div className="mockup-section-label">Tareas de hoy</div>

              <ul className="mockup-tasks">
                <li className="mockup-task mockup-task-done">
                  <CheckCircle2 size={16} strokeWidth={2} className="mockup-task-icon" />
                  <span className="mockup-task-text">Revisar informe trimestral</span>
                  <span className="mockup-priority mockup-priority-high">Alta</span>
                </li>
                <li className="mockup-task">
                  <Circle size={16} strokeWidth={2} className="mockup-task-icon" />
                  <span className="mockup-task-text">Planificar sprint semanal</span>
                  <span className="mockup-priority mockup-priority-med">Media</span>
                </li>
                <li className="mockup-task">
                  <Circle size={16} strokeWidth={2} className="mockup-task-icon" />
                  <span className="mockup-task-text">Actualizar backlog</span>
                  <span className="mockup-priority mockup-priority-low">Baja</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="float-chip float-chip-1">
            <div className="float-chip-icon">
              <BarChart3 size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="float-chip-title">Métricas en vivo</p>
              <p className="float-chip-sub">Seguimiento en tiempo real</p>
            </div>
          </div>

          <div className="float-chip float-chip-2">
            <div className="float-chip-icon">
              <ListChecks size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="float-chip-title">Prioridades</p>
              <p className="float-chip-sub">Alta · Media · Baja</p>
            </div>
          </div>

          <div className="float-chip float-chip-3">
            <div className="float-chip-icon">
              <CalendarDays size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="float-chip-title">Fechas límite</p>
              <p className="float-chip-sub">Recordatorios inteligentes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-pill">
          <Zap size={15} strokeWidth={2} className="fp-icon" aria-hidden="true" />
          <span className="fp-text">Rápido de configurar</span>
        </div>
        <div className="feature-pill">
          <Shield size={15} strokeWidth={2} className="fp-icon" aria-hidden="true" />
          <span className="fp-text">Seguro y privado</span>
        </div>
        <div className="feature-pill">
          <Smartphone size={15} strokeWidth={2} className="fp-icon" aria-hidden="true" />
          <span className="fp-text">Responsive y moderno</span>
        </div>
        <div className="feature-pill">
          <BadgeCheck size={15} strokeWidth={2} className="fp-icon" aria-hidden="true" />
          <span className="fp-text">100% gratuito</span>
        </div>
      </section>
    </div>
  );
}