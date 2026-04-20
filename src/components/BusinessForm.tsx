import React, { useState } from 'react';
import { businessService } from '../services/businessService';
import { Loader2, Plus, X, MapPin, Phone, Tag, AlignLeft, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

interface BusinessFormProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({ onClose, onSuccess, userId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    phone: '',
    lat: 42.6629,
    lng: 21.1655,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await businessService.createBusiness({ ...formData, ownerId: userId });
      toast.success('Business submitted successfully! Pending approval.');
      onSuccess();
      onClose();
    } catch (e) {
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500 rounded-lg">
             <Briefcase className="w-5 h-5 text-slate-950" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Register Entity</h2>
        </div>
        <p className="text-slate-500 mb-8 text-sm font-medium">Define your professional presence on LocalLink.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Business Name</label>
            <div className="relative">
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-slate-600"
                placeholder="Tech Solutions LLC"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Category</label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border-none rounded-lg py-2.5 px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none appearance-none"
              >
                <option value="">Select</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Services">Services</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Phone</label>
              <input
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border-none rounded-lg py-2.5 px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-600"
                placeholder="+383..."
              />
            </div>
          </div>

          <div>
             <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
             <textarea 
               required
               value={formData.description}
               onChange={e => setFormData({ ...formData, description: e.target.value })}
               className="w-full bg-slate-800 border-none rounded-lg py-2.5 px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none min-h-[100px] resize-none placeholder-slate-600"
               placeholder="Briefly describe what you do..."
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Latitude</label>
              <input
                type="number" step="any" required
                value={formData.lat}
                onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 border-none rounded-lg py-2.5 px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Longitude</label>
              <input
                type="number" step="any" required
                value={formData.lng}
                onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 border-none rounded-lg py-2.5 px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-600 italic font-medium">Default location centered on Vushtrri. Update coordinates for precision.</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 shadow-lg shadow-emerald-500/20 rounded-lg transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
