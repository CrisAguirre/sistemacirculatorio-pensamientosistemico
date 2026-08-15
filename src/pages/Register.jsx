import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import './pages.css';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '' });
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
      const data = await authApi.register(form);
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
            <label htmlFor="username">Usuario</label>
            <input id="username" name="username" type="text" value={form.username} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
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
