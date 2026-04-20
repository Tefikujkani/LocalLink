import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfos = [
    { icon: Phone, label: 'Phone', value: '+383 44 123 456', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Mail, label: 'Email', value: 'hello@locallink.io', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: MapPin, label: 'Address', value: 'Vushtrri, Kosovo', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full"></div>
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-emerald text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Support & Inquiries</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-tight"
          >
            GET IN <span className="text-glow text-emerald-500">TOUCH</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium"
          >
            Have questions about listing your business or partnering with us? Our team is here to help you scale.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-6">
            {contactInfos.map((info, idx) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="glass p-6 rounded-3xl flex items-center gap-6 shadow-sm group hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <div className={`${info.bg} ${info.color} p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform`}>
                  <info.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="text-white font-bold text-lg">{info.value}</p>
                </div>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-emerald-500 p-10 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.2)] group"
            >
               <div className="relative z-10">
                 <h3 className="text-slate-950 font-display font-bold text-3xl mb-3">Partner with us</h3>
                 <p className="text-slate-900/70 text-base font-bold mb-8 leading-snug">Join our network of 500+ businesses improving their reach in Vushtrri.</p>
                 <button className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl active:scale-95">Start Application</button>
               </div>
               <Zap className="absolute top-2 right-2 w-32 h-32 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </motion.div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-8 md:p-14 rounded-[2.5rem] shadow-2xl"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-10">Communications Payload</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Your Identity</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:bg-slate-900 outline-none placeholder-slate-700 font-medium transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Digital Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:bg-slate-900 outline-none placeholder-slate-700 font-medium transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Transmission Subject</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:bg-slate-900 outline-none placeholder-slate-700 font-medium transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Message Content</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:bg-slate-900 outline-none placeholder-slate-700 font-medium transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="md:col-span-2 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span className="uppercase tracking-widest text-sm">Initiate Transmission</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
