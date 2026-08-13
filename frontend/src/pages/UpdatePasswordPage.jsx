import { useState } from 'react';
import client from '../api/client';

export default function UpdatePasswordPage() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      await client.put('/auth/password', form);
      setStatus({ type: 'success', message: 'Password updated.' });
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          'Could not update password.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Update password</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

        <label className="field">
          <span className="label">Current password</span>
          <input
            className="input"
            type="password"
            required
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="label">New password</span>
          <input
            className="input"
            type="password"
            required
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <span className="hint">8–16 characters, at least one uppercase letter and one of !@#$%^&amp;*</span>
        </label>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
