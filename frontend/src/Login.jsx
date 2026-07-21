import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Shield, Zap, AlertCircle, Mail } from 'lucide-react';
import './Login.css';
import logoVPlan from './img/LogoVPlan.png';

const API_URL        = `${import.meta.env.VITE_API_URL}/api/auth/login`;
const FORGOT_API_URL = `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onNavigate }) {
  const [formData, setFormData]           = useState({ email: '', password: '' });
  const [errors, setErrors]               = useState({});
  const [apiError, setApiError]           = useState('');
  const [isLoading, setIsLoading]         = useState(false);

  // Modal "Olvidé mi contraseña"
  const [showForgotModal, setShowForgotModal]     = useState(false);
  const [forgotStatus, setForgotStatus]           = useState('idle'); // idle | loading | success | error
  const [forgotError, setForgotError]             = useState('');

  /* ── Handler de Google Sign-In ── */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setApiError('');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'Error al autenticar con Google.');
        return;
      }

      localStorage.setItem('vplan_token', data.token);
      localStorage.setItem('vplan_user', JSON.stringify(data.usuario));
      onNavigate('dashboard');
    } catch (err) {
      setApiError('No se pudo conectar al servidor para verificar Google Sign-In.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Handlers del formulario de login ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (apiError)    setApiError('');
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

  /* ── Handler del botón "¿Olvidaste tu contraseña?" ── */
  const handleForgotClick = () => {
    // Validar que el email esté completo antes de abrir el modal
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: 'Completá tu correo electrónico primero.' }));
      return;
    }
    if (!EMAIL_REGEX.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Ingresá un correo válido antes de continuar.' }));
      return;
    }

    // Email ok → abrir modal y enviar petición
    setForgotStatus('idle');
    setForgotError('');
    setShowForgotModal(true);
    sendForgotRequest(formData.email.trim().toLowerCase());
  };

  const sendForgotRequest = async (email) => {
    setForgotStatus('loading');
    try {
      const response = await fetch(FORGOT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setForgotError(data.error || 'No se pudo enviar el correo. Intentá de nuevo.');
        setForgotStatus('error');
      } else {
        setForgotStatus('success');
      }
    } catch {
      setForgotError('No se pudo conectar al servidor. Verificá tu conexión.');
      setForgotStatus('error');
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStatus('idle');
    setForgotError('');
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
            alt="VPlan — Ir al inicio"
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
            <span className="trust-badge"><Shield size={13} strokeWidth={2.2} /> Seguro y privado</span>
            <span className="trust-badge"><Zap size={13} strokeWidth={2.2} /> Siempre disponible</span>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Form ══════════════════════════════════ */}
      <div className="auth-panel-form">
        <div className="form-inner">
          <div className="form-header">
            <span className="form-eyebrow">Acceso a VPlan</span>
            <h1>Bienvenido de nuevo</h1>
            <p>Iniciá sesión para gestionar tus tareas y métricas de productividad.</p>
          </div>

          <div className="google-login-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setApiError('Google Sign-In falló o fue cancelado.')}
              useOneTap
              theme="filled_black"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">o con correo</span>
            <div className="auth-divider-line" />
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
                <AlertCircle size={16} strokeWidth={2.2} aria-hidden="true" />
                {apiError}
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
              onClick={handleForgotClick}
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
                Registrate
              </button>
            </p>
          </footer>
        </div>
      </div>

      {/* ══ Modal contraseña olvidada ════════════════════════ */}
      <div className={`modal-overlay ${showForgotModal ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-box">

          {forgotStatus === 'loading' && (
            <>
              <div className="modal-spinner" aria-label="Enviando..." />
              <h3>Enviando correo…</h3>
              <p>Estamos procesando tu solicitud. Un momento, por favor.</p>
            </>
          )}

          {forgotStatus === 'success' && (
            <>
              <div className="modal-icon modal-icon--success"><Mail size={28} strokeWidth={1.8} /></div>
              <h3>¡Correo enviado!</h3>
              <p>
                Si <strong>{formData.email}</strong> está registrado, recibirás las
                instrucciones para restablecer tu contraseña. El enlace es válido por <strong>1 hora</strong>.
              </p>
              <button onClick={closeForgotModal} className="btn-primary">
                Aceptar
              </button>
            </>
          )}

          {forgotStatus === 'error' && (
            <>
              <div className="modal-icon modal-icon--error"><AlertCircle size={28} strokeWidth={1.8} /></div>
              <h3>Algo salió mal</h3>
              <p>{forgotError}</p>
              <button onClick={closeForgotModal} className="btn-primary">
                Cerrar
              </button>
            </>
          )}

          {forgotStatus === 'idle' && (
            <>
              <div className="modal-spinner" aria-label="Iniciando…" />
              <h3>Iniciando…</h3>
            </>
          )}

        </div>
      </div>
    </div>
  );
}