import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  Menu, 
  X, 
  Map as MapIcon, 
  BadgeCheck, 
  Users as UsersIcon,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover', path: '/', icon: MapIcon },
    { name: 'My Businesses', path: '/dashboard/my-businesses', icon: Briefcase },
    { name: 'Profile Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const adminItems = [
    { name: 'Admin Hub', path: '/admin', icon: BadgeCheck },
    { name: 'Business Queue', path: '/admin/businesses', icon: Briefcase },
    { name: 'User Directory', path: '/admin/users', icon: UsersIcon },
    { name: 'System Logs', path: '/admin/logs', icon: Settings },
  ];

  const superAdminItems = [
    { name: 'Core Console', path: '/superadmin', icon: ShieldAlert },
    { name: 'Admin Control', path: '/superadmin/admins', icon: BadgeCheck },
    { name: 'Global Settings', path: '/superadmin/settings', icon: Settings },
    { name: 'Network Monitor', path: '/superadmin/network', icon: Activity },
  ];

  const sidebarItems = user?.role === 'superadmin' ? superAdminItems : 
                      user?.role === 'admin' ? adminItems : userItems;
  
  const sidebarTitle = user?.role === 'superadmin' ? 'SYSTEM CORE' :
                       user?.role === 'admin' ? 'ADMIN PANEL' : 'USER DASHBOARD';

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar items={sidebarItems} title={sidebarTitle} />
      
      <div className="flex-1 flex flex-col">
        {/* Mobile Sidebar Trigger (Optional since Navbar handles most mobile nav) */}
        <div className="lg:hidden p-4 border-b border-slate-700 bg-slate-800">
           <div className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">{sidebarTitle}</div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
