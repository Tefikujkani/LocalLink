import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Smartphone, Check, ArrowRight, Loader2, AlertCircle, Copy, RefreshCw, Key } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'recovery'>('intro');
  const [setupData, setSetupData] = useState<{ secret: string; uri: string } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);

  const startSetup = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/security/2fa/setup');
      setSetupData(data);
      setStep('setup');
    } catch (e) {
      toast.error('Failed to initiate 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/security/2fa/enable', { token: otpToken });
      setRecoveryCodes(data.recovery_codes || []);
      toast.success('Two-factor authentication enabled!');
      setStep('recovery');
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    const code = prompt('Please enter your 2FA code to confirm deactivation:');
    if (!code) return;

    setLoading(true);
    try {
      await api.post('/api/security/2fa/disable', { token: code });
      toast.success('2FA has been disabled.');
      window.location.reload();
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    toast.success('Recovery codes copied to clipboard');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & Privacy</h1>
        <p className="text-slate-400 text-sm">Protect your account with advanced authentication layers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm">Two-Factor Authentication</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add an extra layer of security by requiring a code from your mobile device when logging in. This is highly recommended for all accounts.
            </p>
          </div>
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
             <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <Check className="w-3 h-3" /> Hardware Keys Ready
             </div>
             <p className="text-xs text-slate-500">Security keys like YubiKey are supported via WebAuthn.</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <AnimatePresence mode="wait">
              {step === 'intro' && (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-inner">
                        <Shield className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Authenticator App</h4>
                        <p className="text-xs text-slate-500">Standard TOTP (Google/Authy)</p>
                      </div>
                    </div>
                    {user?.is2faEnabled ? (
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest rounded-full">
                        Status: Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest rounded-full">
                        Status: Disabled
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {user?.is2faEnabled ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                           <p className="text-xs text-emerald-500/80 leading-relaxed font-medium">
                             Your account is protected with 2FA. We'll ask for a code every time you log in from a new device.
                           </p>
                        </div>
                        <button 
                          onClick={handleDisable}
                          disabled={loading}
                          className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                          {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          Disable Authenticator
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={startSetup}
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Begin Secure Setup'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 'setup' && setupData && (
                <motion.div 
                  key="setup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 space-y-8"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-white font-bold text-lg">Scan QR Code</h3>
                    <p className="text-slate-500 text-xs px-10">Use your security app to scan the code below or enter the secret key manually.</p>
                  </div>

                  <div className="flex flex-col items-center gap-8">
                     <div className="bg-white p-4 rounded-3xl shadow-2xl">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.uri)}`}
                          alt="2FA QR Code"
                          className="w-48 h-48"
                        />
                     </div>
                     
                     <div className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-center space-y-2">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Manual Entry Key</p>
                        <code className="block text-emerald-500 font-mono text-sm tracking-wider select-all">
                          {setupData.secret}
                        </code>
                     </div>
                  </div>

                  <button 
                    onClick={() => setStep('verify')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10"
                  >
                    Finish scanned, Continue
                  </button>
                </motion.div>
              )}

              {step === 'verify' && (
                <motion.div 
                  key="verify"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8"
                >
                  <form onSubmit={handleVerify} className="space-y-8">
                    <div className="text-center space-y-2">
                      <h3 className="text-white font-bold text-lg">Confirm Verification</h3>
                      <p className="text-slate-500 text-xs px-10">Enter the 6-digit code currently visible in your app.</p>
                    </div>

                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        required
                        autoFocus
                        maxLength={6}
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-800 border-none rounded-2xl py-6 pl-12 pr-4 text-white text-4xl tracking-[0.5em] text-center font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="000000"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep('setup')}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        disabled={loading || otpToken.length !== 6}
                        className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize & Secure Account'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'recovery' && (
                <motion.div 
                  key="recovery"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 space-y-8"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                     <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <Key className="w-8 h-8 text-emerald-500" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-white font-bold text-xl">Save Your Recovery Codes</h3>
                        <p className="text-slate-400 text-xs px-10 leading-relaxed">
                          These codes are the ONLY way to access your account if you lose your phone. Keep them somewhere very safe.
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 font-mono">
                     {recoveryCodes.map((code, idx) => (
                       <div key={idx} className="text-emerald-400/80 text-[11px] p-2 bg-slate-900 border border-slate-800 rounded-lg text-center tracking-tighter">
                          {code}
                       </div>
                     ))}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={copyRecoveryCodes}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Copy All
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl text-xs"
                    >
                      I've Saved Them
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex items-center justify-between group cursor-not-allowed opacity-50">
             <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                 <Smartphone className="w-6 h-6 text-slate-500" />
               </div>
               <div>
                 <h4 className="font-bold text-white">Trust Devices</h4>
                 <p className="text-xs text-slate-500">Skip 2FA on your personal computer.</p>
               </div>
             </div>
             <div className="px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-600 uppercase tracking-widest rounded-full">Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};
