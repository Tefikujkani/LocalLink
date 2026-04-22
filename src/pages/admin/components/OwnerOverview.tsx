import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  Briefcase, 
  Activity, 
  TrendingUp, 
  Users, 
  Plus, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const OwnerOverview: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'My Businesses', value: '3', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Interactions', value: '48', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Profile Views', value: '1.2k', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Unique Customers', value: '312', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-slate-500 text-sm mt-1">Here is what's happening with your businesses today.</p>
        </div>
        <Link 
          to="/admin/businesses"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <Sparkles className="w-4 h-4 text-slate-800 group-hover:text-slate-600 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <Link to="/admin/orders" className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest hover:underline">View All</Link>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800 group hover:border-emerald-500/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">New Booking Request</div>
                      <div className="text-[10px] text-slate-500">Customer Ardit B. • 20 mins ago</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-500 rounded-3xl p-8 relative overflow-hidden group border border-emerald-400">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-24 h-24 text-slate-950" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">Grow your reach</h3>
            <p className="text-slate-900/70 text-xs font-medium mb-6 leading-relaxed">Boost your business visibility using LocalLink AI Ads and premium placement.</p>
            <button className="bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-950/20">
              Upgrade Now
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/businesses" className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all text-center">
                <Briefcase className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">My Places</span>
              </Link>
              <Link to="/admin/orders" className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all text-center">
                <Activity className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inquiries</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
