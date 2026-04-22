import React, { useState, useEffect } from 'react';
import { settingsService, Webhook } from '../../../services/settingsService';
import { Settings, Globe, Plus, Trash2, ShieldCheck, Mail, Bell, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export const GlobalSettings: React.FC = () => {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [wData, sData] = await Promise.all([
                settingsService.getWebhooks(),
                settingsService.getSystemStats()
            ]);
            setWebhooks(wData);
            setStats(sData);
        } catch (error) {
            toast.error('Failed to load global config');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWebhook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await settingsService.createWebhook(newUrl, ['business.created', 'fraud.detected']);
            setWebhooks(prev => [...prev, data]);
            setNewUrl('');
            toast.success('System Webhook added');
        } catch (error) {
            toast.error('Failed to create webhook');
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        try {
            await settingsService.deleteWebhook(id);
            setWebhooks(prev => prev.filter(w => w.id !== id));
            toast.success('Webhook removed');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Database Engine', value: stats?.databaseSize || 'N/A', icon: HardDrive, color: 'text-blue-500' },
                    { label: 'Asset Storage', value: stats?.storageUsed || 'N/A', icon: Globe, color: 'text-purple-500' },
                    { label: 'System Health', value: stats?.systemStatus || 'Healthy', icon: ShieldCheck, color: 'text-emerald-500' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-900 p-5 rounded-2xl shadow-inner">
                        <div className="flex items-center gap-3 mb-2">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{item.value}</div>
                        <div className="h-1 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                             <div className={`h-full bg-emerald-500 w-[95%] shadow-[0_0_8px_rgba(16,185,129,0.3)]`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Webhook Management */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                           <Bell className="w-5 h-5 text-emerald-500" /> Webhook Integrations
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Configure global event dispatchers for external monitoring</p>
                    </div>
                </div>

                <form onSubmit={handleCreateWebhook} className="flex gap-4 mb-8">
                    <input 
                        type="url"
                        placeholder="Target URL (e.g., https://api.monitor.com/hooks/locallink)"
                        required
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-slate-700 font-mono"
                    />
                    <button 
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-4 h-4" /> Add Link
                    </button>
                </form>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {webhooks.map((w) => (
                            <motion.div
                                key={w.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 text-slate-500">
                                        <Globe className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <div className="text-sm font-mono text-slate-300 group-hover:text-emerald-500 transition-colors">{w.url}</div>
                                        <div className="flex gap-2 mt-1">
                                            {w.eventTypes.split(',').map(ev => (
                                                <span key={ev} className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                                                    {ev}
                                                </span>
                                            ))}
                                        </div>
                                     </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteWebhook(w.id)}
                                    className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {webhooks.length === 0 && (
                         <div className="text-center py-10 text-slate-600 text-xs font-bold uppercase tracking-tighter">No active global webhooks</div>
                    )}
                </div>
            </div>
        </div>
    );
};
