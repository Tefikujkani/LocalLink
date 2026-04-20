import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Zap, Shield, Users, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { businessService } from '../services/businessService';
import { Business } from '../types';

export const HomePage: React.FC = () => {
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [stats] = useState([
    { label: 'Active Entities', value: '540+', icon: Briefcase },
    { label: 'Platform Users', value: '1,200+', icon: Users },
    { label: 'Monthly Traffic', value: '45k+', icon: Zap },
  ]);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    const data = await businessService.getBusinesses();
    const approved = data.filter(b => b.status === 'approved').slice(0, 3);
    setRecentBusinesses(approved);
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-56 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[180px] rounded-full"></div>
          <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-emerald text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-12 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Redefining Local Commerce</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-7xl md:text-[180px] font-display font-bold text-white mb-10 tracking-[-0.04em] leading-[0.85]"
          >
            Local<span className="text-glow text-emerald-500">Link</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-3xl max-w-3xl mx-auto mb-16 font-medium leading-relaxed tracking-tight"
          >
            Find your nearest place you want to discover.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-slate-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:scale-95">
              Launch Your Business
            </Link>
            <Link to="/explore" className="w-full sm:w-auto px-10 py-5 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Explore Ecosystem
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-6">Explore Your City.</h2>
            <p className="text-slate-500 text-xl font-medium">Find shops, restaurants, and services that make Vushtrri unique.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-48 h-48 text-emerald-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">Community Curation</h3>
                <p className="text-slate-400 text-lg max-w-md font-medium">We verify every listing so you can trust the quality of the barber shops, cafes, and restaurants you discover.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-emerald-500 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group shadow-[0_0_60px_rgba(16,185,129,0.2)]"
            >
              <Zap className="w-12 h-12 text-slate-950" />
              <div>
                <h3 className="text-2xl font-bold text-slate-950 mb-3">Live Presence</h3>
                <p className="text-slate-900/70 font-bold leading-tight">Instant updates on your business status and live map position.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900/50 border border-white/5 rounded-3xl p-10 flex flex-col justify-between group shadow-2xl"
            >
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-emerald-500">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Local Synergy</h3>
                <p className="text-slate-500 font-medium leading-snug">Connect with the local community. Every visit supports an entrepreneur in Vushtrri.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-transparent to-blue-500"></div>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Interactive Maps</h3>
                  <p className="text-slate-400 text-lg max-w-md font-medium">High-fidelity satellite imagery and real-time positioning for every listed entity.</p>
                </div>
                <div className="w-32 h-32 glass rounded-full flex items-center justify-center -mr-16 rotate-12 group-hover:rotate-0 transition-transform">
                  <MapPin className="w-12 h-12 text-emerald-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-950 py-32 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass text-emerald-500 mb-8 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-6xl font-display font-bold text-white mb-4 tracking-tight">{stat.value}</div>
                <div className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent ListingsSection (Cards) */}
      <section className="py-40 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl text-left">
              <div className="inline-block px-3 py-1 rounded-full glass-emerald text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-6">Directory Spotlight</div>
              <h3 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-none">The Current <br /> Vanguard.</h3>
            </div>
            <Link to="/explore" className="flex items-center gap-3 text-white font-bold group px-6 py-3 glass rounded-2xl hover:bg-white/10 transition-all">
              Launch Global Map
              <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBusinesses.map((b, idx) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-3xl overflow-hidden group hover:border-emerald-500/40 transition-all shadow-2xl"
              >
                <div className="aspect-[16/10] bg-slate-800 relative overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${b.name}/800/500`}
                    alt={b.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                  <div className="absolute top-6 right-6">
                    <span className="glass-emerald text-emerald-500 text-[9px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">Approved</span>
                  </div>
                </div>
                <div className="p-8 relative">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-white tracking-tight mb-1">{b.name}</h4>
                      <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em]">{b.category}</p>
                    </div>
                    <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/5">
                       <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                       <span className="text-white text-xs font-bold leading-none">4.9</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-base mb-8 line-clamp-2 font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{b.description}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-emerald-500/70">
                        <MapPin className="w-4 h-4" />
                       </div>
                       <span className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Vushtrri Core</span>
                    </div>
                    <Link to="/explore" className="w-10 h-10 glass rounded-full flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section (Extra Stuff) */}
      <section className="py-32 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">The LocalLink Blueprint</h2>
             <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium leading-relaxed">How we facilitate exponential growth for local businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Identity Registration', desc: 'Secure your professional profile with verified business credentials and categorization.', icon: Shield },
              { title: 'Global Exposure', desc: 'Instantly appear on our interactive live map and specialized directory indexes.', icon: MapPin },
              { title: 'Verified Trust', desc: 'Build social credit through our rigorous verification layers and customer validation.', icon: CheckCircle2 },
            ].map((step, idx) => (
              <div key={step.title} className="relative text-center">
                <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-2xl relative z-10">
                   <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">"{step.desc}"</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-slate-800 -z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">READY TO UPGRADE <br /> YOUR REACH?</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium italic">"The future of Vushtrri's commerce is interconnected. Join the hub today."</p>
          <Link to="/register" className="px-12 py-5 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/40 uppercase tracking-widest text-sm active:scale-95">
            Initialize Partnership
          </Link>
        </div>
      </section>
    </div>
  );
};
