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

  