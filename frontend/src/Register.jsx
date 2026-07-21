import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
  ListChecks,
  CalendarDays,
  BarChart3,
  Shield,
  BadgeCheck,
  Zap,
  AlertCircle,
  Check,
} from 'lucide-react';
import './Register.css';
import logoVPlan from './img/LogoVPlan.png';

const API_BASE = import.meta.env.VITE_API_URL || 'https://vplan-backend.onrender.com';
const API_URL = `${API_BASE}/api/auth/registro`;

export default function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [showModal, setShowModal] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ── Handler de Google Sign-In ── */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setApiError('');
      
      const response = await fetch(`${API_BASE}/api/auth/google`, {
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

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 10) score++;
    const labels = ['', 'Débil', 'Media', 'Fuerte'];
    const labelColors = ['', '#ef4444', '#f59e0b', '#16a34a'];
    return { score, label: pwd ? labels[score] : '', color: labelColors[score] };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') setPasswordStrength(getPasswordStrength(value));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'El nombre no puede estar vacío.';
    } else if (formData.fullname.length < 2) {
      newErrors.fullname = 'Ingresá tu nombre completo.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo no puede estar vacío.';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Ingresá un correo válido (ej: nombre@mail.com).';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña no puede estar vacía.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra mayúscula.';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un número.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmá tu contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
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
        body: JSON.stringify({
          nombre: formData.fullname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'Error al crear la cuenta. Intentá de nuevo.');
        return;
      }

      localStorage.setItem('vplan_token', data.token);
      localStorage.setItem('vplan_user', JSON.stringify(data.usuario));
      setShowModal(true);
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
              Empieza a organizarte<br />
              <em>de verdad.</em>
            </h2>
            <p className="brand-sub" style={{ marginTop: '14px' }}>
              Crea tu cuenta gratuita y accedé al sistema de gestión de tareas más limpio y efectivo.
            </p>
          </div>

          <div className="brand-divider" />

          <div className="brand-features">
            <div className="brand-feature">
              <div className="feature-icon"><ListChecks size={16} strokeWidth={2.2} /></div>
              <span className="feature-text">Gestión de tareas con prioridades</span>
            </div>
            <div className="brand-feature">
              <div className="feature-icon"><CalendarDays size={16} strokeWidth={2.2} /></div>
              <span className="feature-text">Fechas de vencimiento y recordatorios</span>
            </div>
            <div className="brand-feature">
              <div className="feature-icon"><BarChart3 size={16} strokeWidth={2.2} /></div>
              <span className="feature-text">Dashboard con métricas de productividad</span>
            </div>
            <div className="brand-feature">
              <div className="feature-icon"><Shield size={16} strokeWidth={2.2} /></div>
              <span className="feature-text">Datos seguros y privados</span>
            </div>
          </div>

          <div className="brand-trust">
            <span className="trust-badge"><BadgeCheck size={13} strokeWidth={2.2} /> Gratis siempre</span>
            <span className="trust-badge"><Zap size={13} strokeWidth={2.2} /> Sin tarjeta</span>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Form ══════════════════════════════════ */}
      <div className="auth-panel-form">
        <div className="form-inner">
          <div className="form-header">
            <span className="form-eyebrow">Crear cuenta</span>
            <h1>Registrate en VPlan</h1>
            <p>Completá tus datos para empezar a organizar tu día de manera profesional.</p>
          </div>

          <div className="google-login-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setApiError('Google Sign-In falló o fue cancelado.')}
              useOneTap={false}
              theme="filled_black"
              text="signup_with"
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
              <label htmlFor="fullname">Nombre completo</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Juan Pérez"
                value={formData.fullname}
                onChange={handleChange}
                className={errors.fullname ? 'input-error' : ''}
              />
              <span className="error-msg">{errors.fullname}</span>
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Correo electrónico</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              <span className="error-msg">{errors.email}</span>
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Contraseña</label>
              <input
                type="password"
                id="reg-password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
              />
              <div className="password-strength">
                <div className={`strength-bar ${passwordStrength.score >= 1 ? (passwordStrength.score === 1 ? 'weak' : passwordStrength.score === 2 ? 'medium' : 'strong') : ''}`} />
                <div className={`strength-bar ${passwordStrength.score >= 2 ? (passwordStrength.score === 2 ? 'medium' : 'strong') : ''}`} />
                <div className={`strength-bar ${passwordStrength.score === 3 ? 'strong' : ''}`} />
              </div>
              <span className="strength-label" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </span>
              <span className="error-msg">{errors.password}</span>
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirmar contraseña</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <span className="error-msg">{errors.confirmPassword}</span>
            </div>

            {apiError && (
              <div className="api-error-banner" role="alert">
                <AlertCircle size={16} strokeWidth={2.2} aria-hidden="true" />
                {apiError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <footer className="form-footer">
            <p>
              ¿Ya tenés cuenta?{' '}
              <button
                type="button"
                className="btn-link-green"
                onClick={() => onNavigate('login')}
              >
                Iniciá sesión
              </button>
            </p>
          </footer>
        </div>
      </div>

      {/* ══ Modal de cuenta creada ═══════════════════════════ */}
      <div className={`modal-overlay ${showModal ? 'open' : ''}`}>
        <div className="modal-box">
          <div className="success-icon"><Check size={28} strokeWidth={2.5} /></div>
          <h3>¡Cuenta creada!</h3>
          <p>Tu cuenta fue creada exitosamente. Ya podés iniciar sesión y empezar a organizar tu día.</p>
          <button onClick={() => onNavigate('login')} className="btn-primary">
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}