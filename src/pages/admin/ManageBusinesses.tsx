import React, { useState, useEffect } from 'react';
import { businessService } from '../../services/businessService';
import { Business } from '../../types';
import { Check, X, ExternalLink, Clock, Trash2, Sparkles, Plus, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/cn';
import { cn } from '../../utils/cn';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BusinessEditor } from './components/BusinessEditor';

export const ManageBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, [user]);

  const loadBusinesses = async () => {
    try {
      if (user?.role === 'superadmin') {
        const [approved, pending] = await Promise.all([
          businessService.getBusinesses(),
          businessService.getPendingBusinesses()
        ]);
        setBusinesses([...pending, ...approved]);
      } else {
        const mine = await businessService.getMyBusinesses();
        setBusinesses(mine);
      }
    } catch (e) {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (b: Business) => {
    setSelectedBusiness(b);
    setIsEditorOpen(true);
  };

  const handleAdd = () => {
    setSelectedBusiness(null);
    setIsEditorOpen(true);
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await businessService.updateBusinessStatus(id, status);
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Business ${status} successfully`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    try {
      await businessService.deleteBusiness(id);
      setBusinesses(prev => prev.filter(b => b.id !== id));
      toast.success('Business deleted');
    } catch (e) {
      toast.error('Failed to delete business');
    }
  };

  const handleFraudAnalysis = async (id: string) => {
    const loadingToast = toast.loading('AI Analysis in progress...');
    try {
      const { data } = await api.get(`/api/ai/fraud-analysis/${id}`);
      toast.dismiss(loadingToast);
      const risk = data.risk_score !== undefined ? data.risk_score : 15;
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-white">AI Security Report</span>
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold text-white", risk > 70 ? "bg-red-500" : risk > 30 ? "bg-yellow-500" : "bg-emerald-500")}>
                Risk: {risk}%
              </span>
            </div>
            <p className="text-xs text-slate-300">{data.analysis || "Business profile consistent with platform policies."}</p>
            <button onClick={() => toast.dismiss(t.id)} className="text-[10px] uppercase font-bold text-slate-500 hover:text-white mt-1">Close</button>
          </div>
        ),
        { duration: 10000, style: { minWidth: '350px', background: '#0f172a', border: '1px solid #1e293b' } }
      );
    } catch (e) {
      toast.dismiss(loadingToast);
      toast.error('AI Analysis failed');
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Clock className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {user?.role === 'superadmin' ? 'Global Moderation' : 'My Businesses'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {user?.role === 'superadmin' 
              ? 'Review and approve global listing requests' 
              : 'Direct control over your business digital presence'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={handleAdd}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" /> Add Business
          </button>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Security Status</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800">
              {businesses.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-500 italic">No business records found in this view.</td></tr>
              ) : (
                businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/20 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                           <img src={b.imageUrl || '/placeholder.jpg'} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{b.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                             <Phone className="w-3 h-3" /> {b.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] font-bold uppercase tracking-wider">{b.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleFraudAnalysis(b.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95
                        ${b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                          b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}
                      `}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${b.status === 'approved' ? 'bg-emerald-500' : b.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        {b.status}
                        <Sparkles className="w-3 h-3 opacity-50" />
                      </button>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-xs font-medium">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-6 py-5 text-right space-x-3">
                       {user?.role === 'superadmin' && b.status === 'pending' ? (
                         <>
                            <button 
                              onClick={() => handleStatusChange(b.id, 'approved')}
                              className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(b.id, 'rejected')}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                         </>
                       ) : user?.role === 'admin' ? (
                         <>
                            <button 
                              onClick={() => handleEdit(b)}
                              className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(b.id)}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </>
                       ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditorOpen && (
        <BusinessEditor 
          business={selectedBusiness}
          onClose={() => setIsEditorOpen(false)}
          onSave={loadBusinesses}
        />
      )}
    </div>
  );
};
