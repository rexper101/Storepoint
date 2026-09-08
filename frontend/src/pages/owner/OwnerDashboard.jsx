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

  