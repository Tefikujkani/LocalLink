import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-xl font-bold text-white tracking-tight">LocalLink</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              The premier business directory connecting local entrepreneurs with the vibrant community of Vushtrri, Kosovo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors" title="X">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors font-medium">Home</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors font-medium">Contact Us</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors font-medium">Login</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors font-medium">Get Listed</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors font-medium">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors font-medium">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 group">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors">Vushtrri, Kosovo</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors">+383 44 123 456</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors">hello@locallink.io</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} LocalLink. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built with precision for the local economy.</p>
        </div>
      </div>
    </footer>
  );
};
