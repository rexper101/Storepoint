import { useEffect, useState } from 'react';
import client from '../../api/client';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  {
    key: 'avgRating',
    label: 'Rating',
    sortable: false,
    render: (row) =>
      row.avgRating ? (
        <StarRating value={Number(row.avgRating)} readOnly size={14} />
      ) : (
        'No ratings yet'
      ),
  },
];

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  async function loadStores() {
    try {
      const params = { sortBy, order };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await client.get('/admin/stores', { params });
      setStores(res.data.stores);
    } catch {
      setError('Could not load stores.');
    }
  }

  useEffect(() => {
    loadStores();
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
    loadStores();
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    try {
      const payload = { ...form };
      if (!payload.ownerId) delete payload.ownerId;
      await client.post('/admin/stores', payload);
      setForm(emptyForm);
      setShowForm(false);
      loadStores();
    } catch (err) {
      setFormError(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          'Could not create store.'
      );
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Stores</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add store'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card form-card" onSubmit={handleCreate}>
          <h2 className="card-title">New store</h2>
          {formError && <div className="alert alert-error">{formError}</div>}
          <p className="hint">
            The owner must already exist as a user with the "store owner" role — create that
            user first from the Users page.
          </p>
          <div className="field-grid">
            <label className="field">
              <span className="label">Name</span>
              <input
                className="input"
                required
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
              <span className="label">Owner user ID</span>
              <input
                className="input"
                type="number"
                min="1"
                value={form.ownerId}
                onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Create store
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
        <button className="btn btn-secondary" type="submit">
          Filter
        </button>
      </form>

      <DataTable
        columns={columns}
        rows={stores}
        sortBy={sortBy}
        order={order}
        onSort={handleSort}
        emptyMessage="No stores match those filters."
      />
    </div>
  );
}
