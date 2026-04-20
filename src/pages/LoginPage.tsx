import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Lock, Search } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-8">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
               <Search className="w-6 h-6 text-slate-950" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">LocalLink</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Elevate your business presence</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border-none rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 placeholder-slate-600 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2 px-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border-none rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:ring-1 focus:ring-emerald-500 placeholder-slate-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In to LocalLink'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-500 font-semibold hover:text-emerald-400">Join now</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-500">
           Demo roles: <span className="font-mono">super@locallink.io</span>, <span className="font-mono">admin@locallink.io</span>, <span className="font-mono">user@locallink.io</span> (Password: <span className="font-mono">password</span>)
        </div>
      </div>
    </div>
  );
};
