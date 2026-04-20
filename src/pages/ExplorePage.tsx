
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

import React, { useState, useEffect, useRef } from 'react';
import { businessService } from '../services/businessService';
import { Business } from '../types';
import { Search, MapPin, Phone, Tag, Filter, Star, X, Globe, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Helper component to handle map movements
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

export const ExplorePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [mapView, setMapView] = useState<{ center: [number, number], zoom: number }>({
    center: [42.8236, 20.9675],
    zoom: 14
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    let result = businesses.filter(b => b.status === 'approved');
    if (search) {
      result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      result = result.filter(b => b.category === category);
    }
    setFiltered(result);
  }, [search, category, businesses]);

  const loadBusinesses = async () => {
    try {
      const data = await businessService.getBusinesses();
      setBusinesses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (b: Business) => {
    setSelectedBusiness(b);
    setMapView({
      center: [b.lat, b.lng],
      zoom: 17
    });
  };

  const categories = Array.from(new Set(businesses.map(b => b.category)));

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Sidebar Filter / List */}
      <div className="w-full lg:w-[400px] bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 flex flex-col h-1/2 lg:h-full overflow-hidden shadow-2xl z-10 transition-all">
        <div className="p-8 border-b border-white/5 space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">Eco-System</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Discovery Mode</p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Filter entities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500/50 focus:bg-slate-800 placeholder-slate-600 font-medium transition-all"
              />
            </div>
            
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-10 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500/50 focus:bg-slate-800 appearance-none font-medium transition-all"
              >
                <option value="">All Specializations</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]"></div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Atlas...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 px-6"
            >
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No entities found in this sector.</p>
            </motion.div>
          ) : (
            filtered.map((b) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={b.id}
                onClick={() => handleCardClick(b)}
                className={`group bg-slate-900/40 border p-5 rounded-2xl transition-all cursor-pointer shadow-lg shadow-black/20 focus:ring-2 focus:ring-emerald-500/50 outline-none ${selectedBusiness?.id === b.id ? 'border-emerald-500/50 bg-slate-800/60' : 'border-white/5 hover:bg-slate-800/40 hover:border-emerald-500/30'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight text-base leading-tight">{b.name}</h3>
                  <span className="text-[9px] px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg font-bold uppercase tracking-widest border border-emerald-500/10 shrink-0 ml-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">{b.category}</span>
                </div>
                
                {b.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(b.rating!) ? 'text-emerald-500 fill-emerald-500' : 'text-slate-700'}`} />
                    ))}
                    <span className="text-[10px] text-slate-400 font-bold ml-1">{b.rating}</span>
                  </div>
                )}

                <p className="text-sm text-slate-500 line-clamp-2 mb-5 font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{b.description}"</p>
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-slate-600 group-hover:text-slate-400 tracking-[0.1em] transition-colors">
                    <Phone className="w-3 h-3 text-emerald-500/30 group-hover:text-emerald-500 transition-colors" />
                    {b.phone}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-slate-600 group-hover:text-slate-400 tracking-[0.1em] transition-colors">
                    <MapPin className="w-3 h-3 text-emerald-500/30 group-hover:text-emerald-500 transition-colors" />
                    Vushtrri
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Business Detail Overlay */}
      <AnimatePresence>
        {selectedBusiness && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute lg:right-8 lg:top-8 lg:bottom-8 inset-x-0 bottom-0 lg:inset-x-auto lg:w-[450px] z-50 bg-slate-900 shadow-2xl lg:rounded-3xl rounded-t-3xl border border-white/5 overflow-hidden flex flex-col h-[85vh] lg:h-auto"
          >
            <div className="relative h-72 w-full overflow-hidden shrink-0">
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                key={selectedBusiness.imageUrl}
                src={selectedBusiness.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'} 
                alt={selectedBusiness.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
              <button 
                onClick={() => setSelectedBusiness(null)}
                className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-8 right-8 z-10">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2 block"
                >
                  {selectedBusiness.category}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-display font-bold text-white tracking-tight leading-tight"
                >
                  {selectedBusiness.name}
                </motion.h2>
              </div>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + (i * 0.1) }}
                          key={i}
                        >
                          <Star className={`w-3.5 h-3.5 ${i < Math.floor(selectedBusiness.rating || 0) ? 'text-emerald-500 fill-emerald-500' : 'text-slate-800'}`} />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-sm font-black text-emerald-500 ml-2">{selectedBusiness.rating}</span>
                  </div>
                  <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-1">Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <span>Open Now</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <p className="text-slate-400 text-lg leading-relaxed font-medium italic border-l-2 border-emerald-500/30 pl-6 py-1">
                  "{selectedBusiness.description}"
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="p-5 glass rounded-2xl space-y-3 group hover:border-emerald-500/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Call Now</p>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{selectedBusiness.phone}</p>
                  </div>
                </div>
                <div className="p-5 glass rounded-2xl space-y-3 group hover:border-emerald-500/40 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Website</p>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">Visit Platform</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-6 pt-6 border-t border-white/5"
              >
                 <div className="flex items-center justify-between">
                    <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Contact Information</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-xl">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Physical Hub</p>
                        <p className="text-base text-white font-bold">Center, Vushtrri 42000</p>
                      </div>
                    </div>
                 </div>
              </motion.div>

              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="w-full bg-emerald-500 py-5 rounded-2xl text-slate-950 font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">Get Directions</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Section */}
      <div className="flex-1 h-1/2 lg:h-full relative z-0">
        <MapContainer
          center={mapView.center}
          zoom={mapView.zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapController center={mapView.center} zoom={mapView.zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.google.com/intl/en-GB_ALL/help/terms_maps.html">Google Maps</a>'
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          />
          {filtered.map((b) => (
            <Marker key={b.id} position={[b.lat, b.lng]}>
              <Popup>
                <div className="text-slate-100 p-3 bg-slate-900 rounded-lg max-w-[200px]">
                  <h4 className="font-bold text-lg tracking-tight mb-1">{b.name}</h4>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                    <span className="text-xs font-bold text-white">{b.rating}</span>
                  </div>
                  <button 
                    onClick={() => handleCardClick(b)}
                    className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 p-2 rounded border border-emerald-500/20 w-full hover:bg-emerald-500 hover:text-slate-950 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
