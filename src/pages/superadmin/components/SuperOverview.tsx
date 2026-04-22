import React from 'react';
import { Shield, Activity, Users, Lock, Server } from 'lucide-react';
import { motion } from 'motion/react';

export const SuperOverview: React.FC = () => {
    const adminStats = [
        { title: 'Total Admins', value: '12', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { title: 'System Logs', value: '1.2k', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Active Sessions', value: '24', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Security Alerts', value: '0', icon: Lock, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    return (
        <div className="space-y-8 anim-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat) => (
                    <div key={stat.title} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-emerald-500/20 transition-colors">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">{stat.title}</div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shadow-inner`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg border-b-emerald-500/20 border-b-2">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
                        <h2 className="font-bold text-white flex items-center gap-2">
                            <Server className="w-5 h-5 text-emerald-500" /> System Status Monitor
                        </h2>
                        <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20 animate-pulse">Operational</span>
                    </div>
                    <div className="p-8 space-y-8">
                        {['Database Node', 'API Cluster', 'CDN Edge', 'Identity Vault'].map(svc => (
                            <div key={svc} className="group">
                                <div className="flex justify-between mb-2">
                                     <div className="text-slate-300 text-xs font-bold uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{svc}</div>
                                     <div className="text-slate-500 text-[10px] font-mono">Uptime: 99.99%</div>
                                </div>
                                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[99.9%]"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
                        <Lock className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Security Hardened v2.1</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">System-wide Row-Level Security (RLS) and Fernet encryption are active.</p>
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all border border-slate-700">
                        Rotate Security Keys
                    </button>
                </div>
            </div>
        </div>
    );
};
