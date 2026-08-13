import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import DataTable from '../../components/DataTable';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
];

const emptyForm = { name: '', email: '', address: '', password: '', role: 'normal_user' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  async function loadUsers() {
    try {
      const params = { sortBy, order };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await client.get('/admin/users', { params });
      setUsers(res.data.users);
    } catch {
      setError('Could not load users.');
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  function handleSort(key) {
    if (sortBy === key) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setOrder('asc');
    }
  }

  function handleFilterSubmit(e) {
    e.preventDefault();
    loadUsers();
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    try {
      await client.post('/admin/users', form);
      setForm(emptyForm);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setFormError(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          'Could not create user.'
      );
    }
  }

  const rows = users.map((u) => ({
    ...u,
    name: <Link to={`/admin/users/${u.id}`}>{u.name}</Link>,
  }));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add user'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleCreate}>
          <h2 className="card-title">New user</h2>
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="field-grid">
            <label className="field">
              <span className="label">Name</span>
              <input
                className="input"
                required
                minLength={20}
                maxLength={60}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
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
              <span className="label">Address</span>
              <input
                className="input"
                maxLength={400}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
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
            <label className="field">
              <span className="label">Role</span>
              <select
                className="input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="normal_user">Normal user</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store owner</option>
              </select>
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Create user
          </button>
        </form>
      )}

      <form className="filter-bar" onSubmit={handleFilterSubmit}>
        <input
          className="input"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          className="input"
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <select
          className="input"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="normal_user">Normal user</option>
          <option value="store_owner">Store owner</option>
        </select>
        <button className="btn btn-secondary" type="submit">
          Filter
        </button>
      </form>

      <DataTable
        columns={columns}
        rows={rows}
        sortBy={sortBy}
        order={order}
        onSort={handleSort}
        emptyMessage="No users match those filters."
      />
    </div>
  );
}
