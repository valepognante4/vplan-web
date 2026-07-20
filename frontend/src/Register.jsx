import React, { useState } from 'react';
import './Register.css'; // O puedes fusionarlo con tu App.css actual

const API_URL = 'http://localhost:3000/api/auth/registro';

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

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
    // Limpiar error de API al escribir
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

      // ── Éxito: guardar token y datos del usuario ──────────────────────────
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
    <main className="login-wrapper">
      <section className="register-box">
        {/* ── Panel Izquierdo ── */}
        <div className="register-left">
          <h2 className="panel-title">Tu productividad,<br />simplificada.</h2>
          <p className="panel-subtitle">Organizá, priorizá y alcanzá tus metas diarias con VPlan.</p>

          <div className="register-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <span className="benefit-text">Gestión de tareas con prioridades</span>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📅</div>
              <span className="benefit-text">Fechas de vencimiento y recordatorios</span>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📊</div>
              <span className="benefit-text">Dashboard con métricas de productividad</span>
            </div>
          </div>
        </div>

        {/* ── Panel Derecho: Formulario ── */}
        <div className="register-right">
          <div className="logo-area">
            <h1>Crear cuenta 🚀</h1>
            <p>Completá tus datos para empezar a usar VPlan</p>
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
                <div className={`strength-bar ${passwordStrength.score >= 1 ? (passwordStrength.score === 1 ? 'weak' : passwordStrength.score === 2 ? 'medium' : 'strong') : ''}`}></div>
                <div className={`strength-bar ${passwordStrength.score >= 2 ? (passwordStrength.score === 2 ? 'medium' : 'strong') : ''}`}></div>
                <div className={`strength-bar ${passwordStrength.score === 3 ? 'strong' : ''}`}></div>
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

            {/* ── Error del servidor ── */}
            {apiError && (
              <div className="api-error-banner" role="alert">
                <span>⚠️</span> {apiError}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <footer className="register-footer">
            <p>
              ¿Ya tenés cuenta?{' '}
              <button 
                type="button" 
                onClick={() => onNavigate('login')} 
                style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: 600, padding: 0 }}
              >
                Iniciá sesión
              </button>
            </p>
          </footer>
        </div>
      </section>

      {/* ── Modal de cuenta creada ── */}
      <div className={`modal-overlay ${showModal ? 'open' : ''}`}>
        <div className="modal-box">
          <div className="success-icon">✓</div>
          <h3>¡Cuenta creada!</h3>
          <p>Tu cuenta fue creada exitosamente. Ya podés iniciar sesión y empezar a organizar tu día.</p>
          <button onClick={() => onNavigate('login')} className="btn-primary">Ir al inicio de sesión</button>
        </div>
      </div>
    </main>
  );
}