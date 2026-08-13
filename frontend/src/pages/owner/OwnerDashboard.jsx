import { useEffect, useState } from 'react';
import client from '../../api/client';
import StarRating from '../../components/StarRating';
import DataTable from '../../components/DataTable';

const columns = [
  { key: 'name', label: 'Rater', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  {
    key: 'rating',
    label: 'Rating',
    sortable: false,
    render: (row) => <StarRating value={row.rating} readOnly size={14} />,
  },
];

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get('/store-owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Could not load your store dashboard.')
      );
  }, []);

  if (error)
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  if (!data) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h1 className="page-title">{data.store.name}</h1>
      <p className="store-address">{data.store.address}</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">
            {data.averageRating ? (
              <StarRating value={Number(data.averageRating)} readOnly />
            ) : (
              '—'
            )}
          </span>
          <span className="stat-label">Average rating ({data.averageRating || '0'})</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.raters.length}</span>
          <span className="stat-label">Total raters</span>
        </div>
      </div>

      <h2 className="section-title">Raters</h2>
      <DataTable
        columns={columns}
        rows={data.raters}
        rowKey="userId"
        emptyMessage="No one has rated your store yet."
      />
    </div>
  );
}
