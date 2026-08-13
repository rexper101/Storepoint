import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleHome = {
  admin: '/admin',
  normal_user: '/stores',
  store_owner: '/owner',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <Link to={roleHome[user.role]} className="brand">
        Storepoint
      </Link>
      <nav className="topbar-nav">
        {user.role === 'admin' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}
        {user.role === 'normal_user' && <Link to="/stores">Stores</Link>}
        {user.role === 'store_owner' && <Link to="/owner">My store</Link>}
        <Link to="/account/password">Password</Link>
      </nav>
      <div className="topbar-user">
        <span>{user.name}</span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
