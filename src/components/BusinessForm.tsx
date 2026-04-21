import React, { useState } from 'react';
import { businessService } from '../services/businessService';
import { Loader2, Plus, X, MapPin, Phone, Tag, AlignLeft, Briefcase, Camera, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface BusinessFormProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({ onClose, onSuccess, userId }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    phone: '',
    locationName: '',
    lat: 42.6629,
    lng: 21.1655,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = '';

      // 1. Handle S3 Upload if file exists
      if (imageFile) {
        setUploading(true);
        try {
          finalImageUrl = await businessService.uploadImage(imageFile);
          toast.success('Image uploaded to cloud vault');
        } catch (err) {
          toast.error('Image upload failed, proceeding without image');
        } finally {
          setUploading(false);
        }
      }

      // 2. Submit Business Data
      await businessService.createBusiness({ 
        ...formData, 
        imageUrl: finalImageUrl 
      });
      
      toast.success('Platform listing submitted! Pending review.');
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
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm shadow-inner" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
             <Briefcase className="w-5 h-5 text-slate-950" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Register Entity</h2>
        </div>
        <p className="text-slate-500 mb-8 text-sm font-medium">Define your professional presence on the network.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <div className="relative group">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Identity Visual</label>
            <div className={cn(
              "relative h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden",
              imagePreview ? "border-emerald-500/30" : "border-slate-800 hover:border-slate-700"
            )}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Camera className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Drop logo or <span className="text-emerald-500">browse</span></p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                 <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Business Name</label>
            <input
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800 border-none rounded-lg py-2.5 px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder-slate-600"
              placeholder="Tech Solutions LLC"
            />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Location Name</label>
              <input
                required
                value={formData.locationName}
                onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full bg-slate-800 border-none rounded-lg py-2.5 px-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-600"
                placeholder="Old Town..."
              />
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

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 shadow-xl shadow-emerald-500/20 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
