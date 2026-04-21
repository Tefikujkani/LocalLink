import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Business } from '../../../types';
import { CheckCircle, XCircle, Trash2, Eye, ShieldAlert, Clock, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion';
import toast from 'react-hot-toast';
import { businessService } from '../../../services/businessService';

export const AdminHub: React.FC = () => {
    const [queue, setQueue] = useState<Business[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQueue();
    }, [filter]);

    const loadQueue = async () => {
        setLoading(true);
        try {
            const data = await adminService.getModerationQueue(filter);
            setQueue(data);
        } catch (error) {
            toast.error('Failed to load businesses');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await businessService.updateBusinessStatus(id, status);
            toast.success(`Business ${status} successfully`);
            setQueue(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanent delete? This cannot be undone.')) return;
        try {
            await businessService.deleteBusiness(id);
            toast.success('Business deleted');
            setQueue(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Moderation Queue</span>
                </div>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {(['pending', 'approved', 'rejected'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Clock className="animate-spin text-emerald-500" /></div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {queue.map((biz) => (
                            <motion.div
                                key={biz.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-colors shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                                        {biz.imageUrl ? (
                                            <img src={biz.imageUrl} alt={biz.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ShieldAlert className="w-6 h-6 text-slate-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{biz.name}</h3>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                                            <span>{biz.category}</span>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                            <span>{biz.locationName || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100"><Eye className="w-4 h-4" /></button>
                                    <div className="w-px h-6 bg-slate-800 mx-1"></div>
                                    
                                    {filter === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleAction(biz.id, 'approved')}
                                                className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-sm"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(biz.id, 'rejected')}
                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 transition-all"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    
                                    <button 
                                        onClick={() => handleDelete(biz.id)}
                                        className="p-2 bg-slate-800 text-slate-500 rounded-lg hover:bg-red-500 hover:text-white transition-all ml-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {!loading && queue.length === 0 && (
                        <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                            <ShieldAlert className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No businesses in this queue</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
