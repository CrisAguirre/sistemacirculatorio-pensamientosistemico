import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import './pages.css';

export default function Register() {
  const [form, setForm] = useState({
    documento: '',
    full_name: '',
    edad: '',
    grado: '',
    telefono: '',
    password: '',
    accessCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register({
        documento: form.documento,
        full_name: form.full_name,
        edad: form.edad ? Number(form.edad) : undefined,
        grado: form.grado || undefined,
        telefono: form.telefono || undefined,
        password: form.password,
        accessCode: form.accessCode,
      });
      login(data.user, data.token);
      navigate('/landing', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🫀</div>
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Regístrate para acceder al laboratorio</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="full_name">Nombre completo</label>
            <input id="full_name" name="full_name" type="text" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="documento">Documento (tarjeta de identidad)</label>
            <input id="documento" name="documento" type="text" value={form.documento} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="edad">Edad</label>
            <input id="edad" name="edad" type="number" min="8" max="20" value={form.edad} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label htmlFor="grado">Grado</label>
            <input id="grado" name="grado" type="text" value={form.grado} onChange={handleChange} placeholder="8°" />
          </div>
          <div className="auth-field">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input id="telefono" name="telefono" type="text" value={form.telefono} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="accessCode">Código de acceso</label>
            <input id="accessCode" name="accessCode" type="text" value={form.accessCode} onChange={handleChange} placeholder="Lo entrega tu docente" required />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
