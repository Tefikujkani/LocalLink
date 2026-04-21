import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { NotificationProvider } from './context/NotificationProvider';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AIAssistant } from './components/AIAssistant';

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
import { BusinessOrders } from './pages/admin/BusinessOrders';
import { OwnerOverview } from './pages/admin/components/OwnerOverview';
import { SuperDashboard } from './pages/superadmin/SuperDashboard';
import { SuperOverview } from './pages/superadmin/components/SuperOverview';
import { AdminHub } from './pages/superadmin/components/AdminHub';
import { AdminControl } from './pages/superadmin/components/AdminControl';
import { GlobalSettings } from './pages/superadmin/components/GlobalSettings';
import { SecuritySettings } from './pages/SecuritySettings';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
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
                <Route path="settings" element={<SecuritySettings />} />
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
                <Route index element={<OwnerOverview />} />
                <Route path="businesses" element={<ManageBusinesses />} />
                <Route path="orders" element={<BusinessOrders />} />
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
              <Route element={<DashboardLayout border="emerald" />}>
                <Route element={<SuperDashboard />}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<SuperOverview />} />
                  <Route path="hub" element={<AdminHub />} />
                  <Route path="control" element={<AdminControl />} />
                  <Route path="settings" element={<GlobalSettings />} />
                  <Route path="network" element={<div className="p-8 text-white uppercase font-bold tracking-widest text-sm opacity-50">Experimental: Network Mesh Monitor</div>} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <AIAssistant />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
