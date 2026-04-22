import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Map as MapIcon, Shield, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: MapIcon },
    { name: 'Explore', path: '/explore', icon: Search },
    { name: 'Dashboards', path: user?.role === 'superadmin' ? '/superadmin' : user?.role === 'admin' ? '/admin' : '/dashboard', icon: LayoutDashboard },
    { name: 'Contact', path: '/contact', icon: User },
  ];

  if (user?.role === 'admin' || user?.role === 'superadmin') {
    navLinks.push({ name: 'Admin Hub', path: '/admin', icon: Shield });
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
      <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-xl font-display font-bold text-white tracking-tight">
              Local<span className="text-emerald-500">Link</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 relative",
                location.pathname === link.path
                  ? "text-emerald-400 bg-emerald-500/5"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-white/10">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-none mb-1">
                  {user?.role}
                </span>
                <span className="text-sm font-bold text-white leading-none">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:scale-95 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-bold px-4">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
              >
                Get Listed
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="md:hidden mt-4 mx-2"
          >
            <div className="glass rounded-2xl p-4 space-y-2 shadow-2xl scale-100">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === link.path
                      ? "bg-slate-800 text-emerald-500"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-slate-300">Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-emerald-500">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
