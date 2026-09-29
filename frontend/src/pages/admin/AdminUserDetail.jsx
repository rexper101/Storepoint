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

  return (
    <div className="page">
      <Link to="/admin/users" className="back-link">
        ← Back to users
      </Link>
      <h1 className="page-title">{user.name}</h1>
      <div className="card detail-card">
        <dl className="detail-list">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{user.address || '—'}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd className="badge">{user.role}</dd>
          </div>
          {user.role === 'store_owner' && (
            <div>
              <dt>Store rating</dt>
              <dd>
                {user.rating ? (
                  <StarRating value={Number(user.rating)} readOnly />
                ) : (
                  'No ratings yet'
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
