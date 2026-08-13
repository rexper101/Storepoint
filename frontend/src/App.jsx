import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminStores from './pages/admin/AdminStores';
import BrowseStores from './pages/user/BrowseStores';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const roleHome = {
  admin: '/admin',
  normal_user: '/stores',
  store_owner: '/owner',
};

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome[user.role] || '/login'} replace />;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="content">{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<HomeRedirect />} />

        <Route
          path="/account/password"
          element={
            <ProtectedRoute>
              <Layout>
                <UpdatePasswordPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AdminUserDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AdminStores />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stores"
          element={
            <ProtectedRoute roles={['normal_user']}>
              <Layout>
                <BrowseStores />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={['store_owner']}>
              <Layout>
                <OwnerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
