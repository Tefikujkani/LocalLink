import React, { useState, useEffect } from 'react';
import { Business } from '../../../types';
import { businessService } from '../../../services/businessService';
import { X, Upload, MapPin, Loader2, Save, Phone, Type, MessageSquare, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion';

interface BusinessEditorProps {
  business: Business | null;
  onClose: () => void;
  onSave: () => void;
}

export const BusinessEditor: React.FC<BusinessEditorProps> = ({ business, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: business?.name || '',
    category: business?.category || '',
    description: business?.description || '',
    phone: business?.phone || '',
    locationName: business?.locationName || '',
    lat: business?.lat || 42.6629, // Default Prishtina
    lng: business?.lng || 21.1655,
    imageUrl: business?.imageUrl || '',
  });

  const categories = ['Restaurant', 'Coffee Shop', 'Retail', 'Services', 'Healthcare', 'Automotive', 'Tourism'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (business) {
        await businessService.updateBusiness(business.id, formData as any); 
        toast.success('Business updated successfully (Pending review)');
      } else {
        await businessService.createBusiness(formData as any);
        toast.success('Business created! Awaiting admin approval.');
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save business');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const key = await businessService.uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: key }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }));
        toast.success('Location captured!');
      },
      () => toast.error('Could not get your location')
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white">{business ? 'Edit Business' : 'Add New Business'}</h2>
            <p className="text-xs text-slate-500">All submissions are moderated before going public.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <form id="business-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* General Info */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">General Information</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase ml-1">Business Name</label>
                   <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                        placeholder="e.g. Grandma's Kitchen"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase ml-1">Category</label>
                   <select 
                     value={formData.category}
                     onChange={e => setFormData({...formData, category: e.target.value})}
                     className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none appearance-none"
                   >
                     <option value="">Select a category</option>
                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
                <div className="relative">
                   <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                   <textarea 
                     required
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                     rows={4}
                     className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none resize-none"
                     placeholder="Tell customers what makes your business special..."
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                   <input 
                     required
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                     className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
                     placeholder="+383 4X XXX XXX"
                   />
                </div>
             </div>
          </div>

          <hr className="border-slate-800" />

          {/* Location */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-blue-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Location & Address</span>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Address / Neighborhood</label>
                <input 
                  required
                  value={formData.locationName}
                  onChange={e => setFormData({...formData, locationName: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. Lakrishtë, Prishtina"
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <input 
                        type="number" step="any"
                        value={formData.lat}
                        onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2 px-3 text-[10px] text-white font-mono"
                        placeholder="Latitude"
                      />
                   </div>
                   <div>
                      <input 
                        type="number" step="any"
                        value={formData.lng}
                        onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2 px-3 text-[10px] text-white font-mono"
                        placeholder="Longitude"
                      />
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={getCurrentLocation}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg border border-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                   <MapPin className="w-3 h-3" /> Get Current Location
                </button>
             </div>
          </div>

          <hr className="border-slate-800" />

          {/* Media */}
          <div className="space-y-6 pb-4">
             <div className="flex items-center gap-2 text-purple-500 mb-2">
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Business Image</span>
             </div>

             <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden group relative">
                   {formData.imageUrl ? (
                     <img src={formData.imageUrl.startsWith('http') ? formData.imageUrl : '/placeholder.jpg'} className="w-full h-full object-cover" />
                   ) : (
                     <Upload className="w-6 h-6 text-slate-700" />
                   )}
                   {uploading && (
                     <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                     </div>
                   )}
                </div>
                <div className="flex-1 space-y-3">
                   <p className="text-xs text-slate-500 leading-relaxed italic">
                      Upload a high-quality photo of your business. This will be the first thing customers see.
                   </p>
                   <label className="inline-block bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg cursor-pointer transition-all">
                      Choose File
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                   </label>
                </div>
             </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex gap-4">
           <button 
             type="button"
             onClick={onClose}
             className="flex-1 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
           >
             Cancel
           </button>
           <button 
             form="business-form"
             type="submit"
             disabled={loading || uploading}
             className="flex-[2] px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Save & Submit
           </button>
        </div>
      </motion.div>
    </div>
  );
};
