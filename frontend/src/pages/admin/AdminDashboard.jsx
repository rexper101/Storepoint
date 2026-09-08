import { useEffect, useState } from 'react';
import client from '../../api/client';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {stats && (
        <div className="stat-grid">
          <StatCard label="Total users" value={stats.totalUsers} />
          <StatCard label="Total stores" value={stats.totalStores} />
          <StatCard label="Total ratings" value={stats.totalRatings} />
        </div>
      )}
    </div>
  );
}
