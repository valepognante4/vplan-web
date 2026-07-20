import React, { useState } from 'react';
import './Login.css';

const API_URL = 'http://localhost:3000/api/auth/login';

export default function Login({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error de API al escribir
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

    // Si hay errores de validación local, no continuar
    if (Object.keys(newErrors).length > 0) return;

    // ── Llamada a la API real ─────────────────────────────────────────────────
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
        // El backend devolvió un error (401, 400, 500...)
        setApiError(data.error || 'Credenciales incorrectas. Verificá tus datos.');
        return; // ← BLOQUEA la navegación al dashboard
      }

      // ── Éxito: guardar token y datos del usuario ──────────────────────────
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
    <main className="login-wrapper">
      <section className="login-box">
        {/* ── Panel Izquierdo ── */}
        <div className="login-left">
          <img src="img/LogoVPlan (1).png" alt="Logo VPlan" className="login-logo-panel" />
          <h2 className="panel-title">Tu productividad,<br />simplificada.</h2>
          <p className="panel-subtitle">Organiza, prioriza y alcanza tus metas diarias con VPlan.</p>
          <div className="panel-metric">
            <span className="metric-number">500+</span>
            <span className="metric-label">tareas completadas por nuestra comunidad</span>
          </div>
        </div>

        {/* ── Panel Derecho: Formulario ── */}
        <div className="login-right">
          <div className="logo-area">
            <h1>Bienvenido de nuevo 👋</h1>
            <p>Inicia sesión para gestionar tus tareas</p>
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

            {/* ── Error de autenticación del servidor ── */}
            {apiError && (
              <div className="api-error-banner" role="alert">
                <span>⚠️</span> {apiError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>

          <footer className="login-footer">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.83rem', padding: 0 }}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <p style={{ marginTop: '14px', fontSize: '0.83rem', color: '#64748b' }}>
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Registrate
              </button>
            </p>
          </footer>
        </div>
      </section>

      {/* ── Modal de contraseña olvidada ── */}
      <div className={`modal-overlay ${showForgotModal ? 'open' : ''}`}>
        <div className="modal-box">
          <h3>Correo Enviado</h3>
          <p>Hemos enviado las instrucciones para restablecer tu contraseña a tu correo electrónico.</p>
          <button onClick={() => setShowForgotModal(false)} className="btn-primary">Aceptar</button>
        </div>
      </div>
    </main>
  );
}