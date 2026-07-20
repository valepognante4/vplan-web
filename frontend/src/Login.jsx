import React, { useState } from 'react';
import './Login.css';
import logoVPlan from './img/LogoVPlan.png';

const API_URL = 'http://localhost:3000/api/auth/login';

export default function Login({ onNavigate }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo no puede estar vacío.';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Ingresá un correo válido (ej: nombre@mail.com).';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña no puede estar vacía.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsLoading(true);
      setApiError('');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'Credenciales incorrectas. Verificá tus datos.');
        return;
      }

      localStorage.setItem('vplan_token', data.token);
      localStorage.setItem('vplan_user', JSON.stringify(data.usuario));
      onNavigate('dashboard');
    } catch (err) {
      setApiError('No se pudo conectar al servidor. Verificá que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ══ LEFT PANEL — Brand ══════════════════════════════════ */}
      <div className="auth-panel-brand">
        {/* Animated bubbles */}
        <div className="auth-bubbles" aria-hidden="true">
          <div className="auth-bubble" />
          <div className="auth-bubble" />
          <div className="auth-bubble" />
          <div className="auth-bubble" />
          <div className="auth-bubble" />
        </div>

        <div className="brand-content">
          <img
            src={logoVPlan}
            alt="VPlan"
            className="brand-logo"
            onClick={() => onNavigate('landing')}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label="Ir al inicio"
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('landing')}
          />

          <div>
            <h2 className="brand-headline">
              Tu productividad,<br />
              <em>simplificada.</em>
            </h2>
            <p className="brand-sub" style={{ marginTop: '14px' }}>
              Organiza, prioriza y alcanza tus metas diarias con una plataforma diseñada para el rendimiento real.
            </p>
          </div>

          <div className="brand-divider" />

          <div className="brand-metrics">
            <div className="brand-metric">
              <span className="metric-val">500+</span>
              <span className="metric-lbl">Tareas completadas</span>
            </div>
            <div className="brand-metric">
              <span className="metric-val">98%</span>
              <span className="metric-lbl">Satisfacción</span>
            </div>
          </div>

          <div className="brand-trust">
            <span className="trust-badge">✓ Seguro y privado</span>
            <span className="trust-badge">⚡ Siempre disponible</span>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Form ══════════════════════════════════ */}
      <div className="auth-panel-form">
        <div className="form-inner">
          <div className="form-header">
            <span className="form-eyebrow">Acceso a VPlan</span>
            <h1>Bienvenido de nuevo 👋</h1>
            <p>Iniciá sesión para gestionar tus tareas y métricas de productividad.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="nombre@ejemplo.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              <span className="error-msg">{errors.email}</span>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
              />
              <span className="error-msg">{errors.password}</span>
            </div>

            {apiError && (
              <div className="api-error-banner" role="alert">
                <span>⚠️</span> {apiError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>

          <footer className="form-footer">
            <button
              type="button"
              className="btn-link"
              onClick={() => setShowForgotModal(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <p>
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                className="btn-link-green"
                onClick={() => onNavigate('register')}
              >
                Registrate gratis
              </button>
            </p>
          </footer>
        </div>
      </div>

      {/* ══ Modal contraseña olvidada ════════════════════════ */}
      <div className={`modal-overlay ${showForgotModal ? 'open' : ''}`}>
        <div className="modal-box">
          <h3>Correo Enviado</h3>
          <p>Hemos enviado las instrucciones para restablecer tu contraseña a tu correo electrónico.</p>
          <button onClick={() => setShowForgotModal(false)} className="btn-primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}