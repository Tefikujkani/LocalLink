import React from 'react';
import { Shield, Settings, Activity, Briefcase, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export const SuperDashboard: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { id: 'overview', label: 'Monitor', icon: Activity, path: '/superadmin/overview' },
        { id: 'hub', label: 'Admin Hub', icon: Briefcase, path: '/superadmin/hub' },
        { id: 'control', label: 'Admin Control', icon: Command, path: '/superadmin/control' },
        { id: 'settings', label: 'Global Settings', icon: Settings, path: '/superadmin/settings' },
    ];

    return (
        <div className="p-8 space-y-8 min-h-screen pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                            <Shield className="w-6 h-6 text-slate-950" />
                        </div>
                        SuperAdmin Console
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">System-wide governance & infrastructure control</p>
                </div>

                <nav className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => 
                                `px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${isActive ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`
                            }
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
