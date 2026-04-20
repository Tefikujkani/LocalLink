import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services/businessService';
import { Business } from '../types';
import { Plus, Briefcase, CheckCircle, Clock, XCircle, TrendingUp, Users, Map as MapIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';
import { BusinessForm } from '../components/BusinessForm';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [myBusinesses, setMyBusinesses] = useState<Business[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const data = await businessService.getMyBusinesses(user!.id);
    setMyBusinesses(data);
    setStats({
      total: data.length,
      pending: data.filter(b => b.status === 'pending').length,
      approved: data.filter(b => b.status === 'approved').length,
    });
  };

  const statCards = [
    { name: 'My Businesses', value: stats.total, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome, {user?.name}</h1>
          <p className="text-slate-400">Manage your directory presence and analytics</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Business
        </button>
      </header>

      {isFormOpen && (
        <BusinessForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={loadData} 
          userId={user!.id} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{stat.name}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="font-bold text-white">Recent Applications</h2>
            <button className="text-xs font-semibold text-emerald-500 hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-800">
            {myBusinesses.length > 0 ? (
              myBusinesses.map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-100 text-sm">{b.name}</h4>
                      <p className="text-xs text-slate-500">{b.category}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    b.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" : 
                    b.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {b.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500">
                You haven't added any businesses yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <MapIcon className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Want more visibility?</h3>
          <p className="text-slate-500 text-sm max-w-xs mb-6 font-medium">
            Make sure your business details are accurate to attract more customers from the map view.
          </p>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm">
            Optimize Profile
          </button>
        </div>
      </div>
    </div>
  );
};
