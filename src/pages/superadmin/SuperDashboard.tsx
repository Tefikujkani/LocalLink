import React from 'react';
import { Shield, Settings, Activity, Users, Lock, Server } from 'lucide-react';
import { motion } from 'motion/react';

export const SuperDashboard: React.FC = () => {
  const adminStats = [
    { title: 'Total Admins', value: '12', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'System Logs', value: '1.2k', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Active Sessions', value: '24', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Security Alerts', value: '0', icon: Lock, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-100 italic">SuperAdmin Console</h1>
        <p className="text-slate-400">Restricted system-wide configuration and governance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm"
          >
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-500" />
              System Status Monitor
            </h2>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-widest">Healthy</span>
          </div>
          
          <div className="p-6 space-y-6">
             {['Database', 'API Layer', 'Storage Bucket', 'Auth Service'].map(svc => (
               <div key={svc} className="flex items-center gap-4">
                 <div className="text-slate-400 text-xs font-semibold uppercase w-32 tracking-tight">{svc}</div>
                 <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 </div>
                 <div className="text-slate-500 text-[10px] font-mono">99.9%</div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
           <h2 className="font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            Global Controls
           </h2>
           <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-slate-800/50 border border-slate-800 hover:bg-slate-800 transition-all text-xs font-bold text-slate-300 uppercase tracking-tight">
                Maintenance Mode
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-slate-800/50 border border-slate-800 hover:bg-slate-800 transition-all text-xs font-bold text-slate-300 uppercase tracking-tight">
                Flush Global Cache
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-slate-800/50 border border-slate-800 hover:bg-slate-800 transition-all text-xs font-bold text-slate-300 uppercase tracking-tight">
                Export Audit Logs
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-xs font-bold text-red-400 mt-4 uppercase tracking-tight">
                Emergency Shutdown
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
