import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services/businessService';
import { Business } from '../types';
import { Briefcase, MapPin, Tag, Trash2, ExternalLink, Clock, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatDate } from '../utils/cn';
import toast from 'react-hot-toast';
import { BusinessForm } from '../components/BusinessForm';

export const MyBusinessesPage: React.FC = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (user) loadBusinesses();
  }, [user]);

  const loadBusinesses = async () => {
    try {
      const data = await businessService.getMyBusinesses(user!.id);
      setBusinesses(data);
    } catch (e) {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    try {
      await businessService.deleteBusiness(id);
      setBusinesses(prev => prev.filter(b => b.id !== id));
      toast.success('Business deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Businesses</h1>
          <p className="text-slate-400">Manage and track your listing applications</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Clock className="animate-spin text-emerald-500" /></div>
      ) : businesses.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-200">No businesses yet</h3>
            <p className="text-slate-500 mt-2">Submit your first business to join our network.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group shadow-sm"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className={cn(
                    "px-2 py-1 bg-slate-800 rounded text-[10px] font-bold uppercase tracking-wider",
                    b.status === 'approved' ? "text-emerald-500" :
                    b.status === 'pending' ? "text-yellow-500" : "text-red-400"
                  )}>
                    {b.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-slate-400"><ExternalLink className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 bg-slate-800 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-500 transition-colors">{b.name}</h3>
                <p className="text-xs text-emerald-500 font-semibold mb-4 flex items-center gap-1.5">
                   <Tag className="w-3 h-3" />
                   {b.category}
                </p>
                <p className="text-sm text-slate-400 line-clamp-2 mb-6 min-h-[40px]">{b.description}</p>

                <div className="space-y-2 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    Vushtrri, Kosovo
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    Submitted {formatDate(b.createdAt)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <BusinessForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={loadBusinesses} 
          userId={user!.id} 
        />
      )}
    </div>
  );
};
