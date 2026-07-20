import React, { useState, useEffect } from 'react';
import './ResetPassword.css';
import logoVPlan from './img/LogoVPlan.png';

const RESET_API_URL = 'http://localhost:3000/api/auth/reset-password';

const PASSWORD_RULES = [
  { test: (p) => p.length >= 8,       label: 'Mínimo 8 caracteres' },
  { test: (p) => /[A-Z]/.test(p),     label: 'Al menos 1 mayúscula' },
  { test: (p) => /[0-9]/.test(p),     label: 'Al menos 1 número' },
];

export default function ResetPassword({ token, onNavigate }) {
  const [formData, setFormData]     = useState({ password: '', confirm: '' });
  const [errors, setErrors]         = useState({});
  const [status, setStatus]         = useState('idle'); // idle | loading | success | error
  const [apiError, setApiError]     = useState('');
  const [countdown, setCountdown]   = useState(5);

  /* ── Countdown hacia login tras el éxito ── */
  useEffect(() => {
    if (status !== 'success') return;
    if (countdown <= 0) { onNavigate('login'); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, onNavigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError)     setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.password) {
      errs.password = 'La contraseña no puede estar vacía.';
    } else {
      const failing = PASSWORD_RULES.filter((r) => !r.test(formData.password));
      if (failing.length) errs.password = failing[0].label + '.';
    }
    if (!formData.confirm) {
      errs.confirm = 'Por favor confirmá tu nueva contraseña.';
    } else if (formData.password !== formData.confirm) {
      errs.confirm = 'Las contraseñas no coinciden.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setStatus('loading');
      setApiError('');

      const response = await fetch(RESET_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaPassword: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'No se pudo restablecer la contraseña.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setApiError('No se pudo conectar al servidor. Verificá tu conexión.');
      setStatus('error');
    }
  };

  /* ── Sin token en la URL ── */
  if (!token) {
    return (
      <div className="rp-page">
        <div className="rp-card rp-card--center">
          <div className="rp-result-icon rp-result-icon--error">⛔</div>
          <h1 className="rp-title">Enlace inválido</h1>
          <p className="rp-subtitle">
            No se encontró un token de recuperación válido en el enlace.
            Por favor, solicitá un nuevo correo de restablecimiento.
          </p>
          <button className="rp-btn" onClick={() => onNavigate('login')}>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  /* ── Pantalla de éxito ── */
  if (status === 'success') {
    return (
      <div className="rp-page">
        <div className="rp-card rp-card--center">
          <div className="rp-result-icon rp-result-icon--success">✅</div>
          <h1 className="rp-title">¡Contraseña restablecida!</h1>
          <p className="rp-subtitle">
            Tu contraseña fue actualizada correctamente. Serás redirigido al
            inicio de sesión en <strong>{countdown}</strong> segundos…
          </p>
          <button className="rp-btn" onClick={() => onNavigate('login')}>
            Ir al inicio de sesión ahora
          </button>
        </div>
      </div>
    );
  }

  /* ── Formulario principal ── */
  return (
    <div className="rp-page">

      {/* Bubbles decorativas */}
      <div className="rp-bubbles" aria-hidden="true">
        <div className="rp-bubble" />
        <div className="rp-bubble" />
        <div className="rp-bubble" />
        <div className="rp-bubble" />
      </div>

      <div className="rp-card">
        {/* Logo */}
        <img
          src={logoVPlan}
          alt="VPlan"
          className="rp-logo"
          onClick={() => onNavigate('landing')}
          style={{ cursor: 'pointer' }}
        />

        <div className="rp-header">
          <span className="rp-eyebrow">VPlan · Seguridad</span>
          <h1 className="rp-title">Nueva contraseña</h1>
          <p className="rp-subtitle">
            Elegí una contraseña segura para tu cuenta. Recuerda cumplir con
            los requisitos indicados.
          </p>
        </div>

        {/* Reglas de contraseña */}
        <ul className="rp-rules" aria-label="Requisitos de contraseña">
          {PASSWORD_RULES.map((rule) => {
            const ok = rule.test(formData.password);
            return (
              <li key={rule.label} className={`rp-rule ${ok ? 'rp-rule--ok' : ''}`}>
                <span className="rp-rule-icon">{ok ? '✓' : '○'}</span>
                {rule.label}
              </li>
            );
          })}
        </ul>

        <form onSubmit={handleSubmit} noValidate className="rp-form">
          {/* Nueva contraseña */}
          <div className="rp-input-group">
            <label htmlFor="rp-password">Nueva contraseña</label>
            <input
              type="password"
              id="rp-password"
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              disabled={status === 'loading'}
            />
            {errors.password && <span className="rp-error">{errors.password}</span>}
          </div>

          {/* Confirmar contraseña */}
          <div className="rp-input-group">
            <label htmlFor="rp-confirm">Confirmar contraseña</label>
            <input
              type="password"
              id="rp-confirm"
              name="confirm"
              placeholder="••••••••"
              autoComplete="new-password"
              value={formData.confirm}
              onChange={handleChange}
              className={errors.confirm ? 'input-error' : ''}
              disabled={status === 'loading'}
            />
            {errors.confirm && <span className="rp-error">{errors.confirm}</span>}
          </div>

          {/* Error de API */}
          {status === 'error' && apiError && (
            <div className="rp-api-error" role="alert">
              <span>⚠️</span> {apiError}
            </div>
          )}

          <button
            type="submit"
            className="rp-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="rp-spinner" aria-hidden="true" />
            ) : (
              'Restablecer contraseña'
            )}
          </button>
        </form>

        <button
          type="button"
          className="rp-back-link"
          onClick={() => onNavigate('login')}
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}
