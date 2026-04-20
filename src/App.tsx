import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/Dashboard';
import { MyBusinessesPage } from './pages/MyBusinesses';
import { ManageBusinesses } from './pages/admin/ManageBusinesses';
import { ManageUsers } from './pages/admin/ManageUsers';
import { SuperDashboard } from './pages/superadmin/SuperDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route element={<DashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="my-businesses" element={<MyBusinessesPage />} />
              <Route path="settings" element={<div className="p-8">Settings (Work in progress)</div>} />
            </Route>
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route element={<DashboardLayout />}>
              <Route index element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Hub</h1><p className="text-slate-400">Welcome to the control center.</p></div>} />
              <Route path="businesses" element={<ManageBusinesses />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="logs" element={<div className="p-8">System Logs</div>} />
            </Route>
          </Route>

          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route element={<DashboardLayout />}>
              <Route index element={<SuperDashboard />} />
              <Route path="admins" element={<div className="p-8">Admin Control</div>} />
              <Route path="settings" element={<div className="p-8">Global Config</div>} />
              <Route path="network" element={<div className="p-8">Network Status</div>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
