import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../../api/client';
import StarRating from '../../components/StarRating';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch(() => setError('Could not load user.'));
  }, [id]);

  if (error)
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  if (!user) return <div className="page">Loading…</div>;

