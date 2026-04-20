import React, { useState, useEffect } from 'react';
import { businessService } from '../../services/businessService';
import { Business } from '../../types';
import { Check, X, ExternalLink, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/cn';

export const ManageBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const data = await businessService.getBusinesses();
      setBusinesses(data);
    } catch (e) {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
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

  if (loading) return <div className="p-8 flex justify-center"><Clock className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Manage Businesses</h1>
        <p className="text-slate-400">Review, approve, or reject business listings</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/30 sticky top-0">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800">
              {businesses.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No businesses found.</td></tr>
              ) : (
                businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-slate-100">
                      <div>{b.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{b.phone}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-400">{b.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                        ${b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                          b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}
                      `}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                       {b.status === 'pending' && (
                         <>
                           <button 
                            onClick={() => handleStatusChange(b.id, 'approved')}
                            className="p-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded hover:bg-emerald-500 hover:text-slate-950 transition-all font-bold text-xs"
                            title="Approve"
                           >
                             <Check className="w-4 h-4" />
                           </button>
                           <button 
                            onClick={() => handleStatusChange(b.id, 'rejected')}
                            className="p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                            title="Reject"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </>
                       )}
                       <button className="p-1.5 bg-slate-800 text-slate-500 border border-slate-700 rounded hover:bg-slate-700 hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
