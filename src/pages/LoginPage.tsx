import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Lock, Search, ShieldCheck, ArrowLeft, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion';

export const LoginPage: React.FC = () => {
  // Standard login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2FA state
  const [otpToken, setOtpToken] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  const { login, verify2FA, isTwoFactorStep, resetAuthFlow, isLoading } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error: any) {
      console.error('Login diagnostic:', error);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verify2FA(otpToken);
    } catch (error: any) {
      console.error('2FA diagnostic:', error);
    }
  };

  const toggleRecovery = () => {
    setIsRecoveryMode(!isRecoveryMode);
    setOtpToken('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8 md:p-10 transition-all duration-500 overflow-hidden relative">
          
          {/* Decorative glow */}
          <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-colors duration-1000 ${isTwoFactorStep ? 'bg-blue-500/20' : 'bg-emerald-500/20'}`} />

          {/* Header */}
          <div className="text-center mb-12 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-700 ${isTwoFactorStep ? 'bg-blue-500 shadow-blue-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}>
               {isTwoFactorStep ? <ShieldCheck className="w-7 h-7 text-slate-950" /> : <Search className="w-7 h-7 text-slate-950" />}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {isTwoFactorStep ? (isRecoveryMode ? 'Account Recovery' : 'Security Check') : 'LocalLink'}
            </h1>
            <p className="text-slate-500 mt-3 text-sm font-medium px-4">
              {isTwoFactorStep 
                ? (isRecoveryMode ? 'Enter one of your 12-digit recovery codes' : 'A verification code is required to proceed') 
                : 'Elevate your business presence with AI-driven discovery'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isTwoFactorStep ? (
              /* Phase 1: Email/Password */
              <motion.form 
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleLoginSubmit} 
                className="space-y-6 relative z-10"
              >
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-slate-600 transition-all outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between px-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <button type="button" className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider hover:text-emerald-400 transition-colors">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-slate-600 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-emerald-500/10 mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In to Dashboard'}
                </button>
              </motion.form>
            ) : (
              /* Phase 2: 2FA Verification */
              <motion.form 
                key="2fa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifySubmit} 
                className="space-y-8 relative z-10"
              >
                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    {isRecoveryMode ? 'Recovery Code' : 'Authenticator Code'}
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={isRecoveryMode ? 14 : 6}
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      className={`w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-6 pl-12 pr-4 text-white text-center font-mono focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none ${isRecoveryMode ? 'text-lg tracking-widest' : 'text-4xl tracking-[0.4em]'}`}
                      placeholder={isRecoveryMode ? "XXXX-XXXX-XXXX" : "000000"}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <button 
                      type="button"
                      onClick={toggleRecovery}
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2 transition-colors"
                    >
                      <Key className="w-3 h-3" />
                      {isRecoveryMode ? 'Use Authenticator App' : 'Lost device? Use Recovery Code'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading || (isRecoveryMode ? otpToken.length < 12 : otpToken.length !== 6)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-500/10"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Identity'}
                  </button>

                  <button 
                    type="button"
                    onClick={resetAuthFlow}
                    className="w-full text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors py-2"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {!isTwoFactorStep && (
            <div className="mt-10 pt-8 border-t border-slate-800 text-center relative z-10">
              <p className="text-slate-500 text-sm">
                New to LocalLink?{' '}
                <Link to="/register" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors underline-offset-4 hover:underline">Create an account</Link>
              </p>
            </div>
          )}
        </div>
        
        {!isTwoFactorStep && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold"
          >
            Secured by LocalLink Guard System v2.1
          </motion.div>
        )}
      </div>
    </div>
  );
};
