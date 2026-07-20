import { useState, useEffect } from 'react';
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

      {/* ── Bubbles decorativas ── */}
      <div className="landing-bubbles" aria-hidden="true">
        <div className="lb lb-1" />
        <div className="lb lb-2" />
        <div className="lb lb-3" />
        <div className="lb lb-4" />
      </div>

      {/* ── Navbar ── */}
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

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">✦ Tu productividad, simplificada</span>
          <h1>
            Organiza, prioriza<br />
            y alcanza tus <span className="hero-highlight">metas diarias</span>
          </h1>
          <p>
            Una plataforma diseñada para optimizar tu tiempo, gestionar tareas con prioridades
            y llevar el control de tus métricas de productividad de forma profesional.
          </p>
          <div className="hero-actions">
            <button className="btn-primary-large" onClick={() => setCurrentView('register')}>
              Empezar ahora
            </button>
            <button className="btn-outline" onClick={() => setCurrentView('login')}>
              Ya tengo cuenta
            </button>
          </div>

          {/* Social proof */}
          <div className="hero-social-proof">
            <div className="proof-avatars">
              <span>👤</span><span>👤</span><span>👤</span>
            </div>
            <p className="proof-text"><strong>500+</strong> tareas completadas por nuestra comunidad</p>
          </div>
        </div>

        {/* Floating visual cards */}
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="fc-icon">📊</div>
            <div>
              <p className="fc-title">Dashboard con métricas</p>
              <p className="fc-sub">Seguimiento en tiempo real</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="fc-icon">✅</div>
            <div>
              <p className="fc-title">Gestión de prioridades</p>
              <p className="fc-sub">Alta · Media · Baja</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="fc-icon">📅</div>
            <div>
              <p className="fc-title">Fechas límite</p>
              <p className="fc-sub">Recordatorios inteligentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features row ── */}
      <section className="features-section">
        <div className="feature-pill">
          <span className="fp-icon">⚡</span>
          <span className="fp-text">Rápido de configurar</span>
        </div>
        <div className="feature-pill">
          <span className="fp-icon">🔒</span>
          <span className="fp-text">Seguro y privado</span>
        </div>
        <div className="feature-pill">
          <span className="fp-icon">📱</span>
          <span className="fp-text">Responsive y moderno</span>
        </div>
        <div className="feature-pill">
          <span className="fp-icon">🆓</span>
          <span className="fp-text">100% gratuito</span>
        </div>
      </section>
    </div>
  );
}