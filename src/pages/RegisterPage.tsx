import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Briefcase, MapPin, Tag, Search } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    category: '',
    location: '',
  });
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    try {
      await register(formData);
    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-8">
          <div className="text-center mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
               <Search className="w-5 h-5 text-slate-950" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create LocalLink Account</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Join the premier business network in Kosovo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <h2 className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest border-b border-slate-800 pb-2">Account Governance</h2>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Business Blueprint</h2>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Entity Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="LocalLink Coffee"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Food & Drink">Food & Drink</option>
                      <option value="Technology">Technology</option>
                      <option value="Services">Services</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Primary Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Vushtrri, Kosovo"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Professional Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Existing partner?{' '}
              <Link to="/login" className="text-emerald-500 font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
