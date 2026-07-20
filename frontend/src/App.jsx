import { useState } from 'react';
import './App.css';
import PanelPrincipal from './Dashboard';
import Login from './Login';
import Register from './Register';
import logoVPlan from './img/LogoVPlan.png';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  if (currentView === 'dashboard') return <PanelPrincipal onNavigate={setCurrentView} />;
  if (currentView === 'login')     return <Login     onNavigate={setCurrentView} />;
  if (currentView === 'register')  return <Register  onNavigate={setCurrentView} />;

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