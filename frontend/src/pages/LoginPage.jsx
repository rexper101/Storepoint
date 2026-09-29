import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleHome = {
  admin: '/admin',
  normal_user: '/stores',
  store_owner: '/owner',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(roleHome[user.role] || '/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not log in. Check your details and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Log in to Storepoint</h1>
        <p className="auth-subtitle">
          Rate stores, manage listings, or track your store's reputation.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span className="label">Email</span>
          <input
            className="input"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <input
            className="input"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
