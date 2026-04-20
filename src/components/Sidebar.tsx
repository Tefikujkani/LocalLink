import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { LucideIcon } from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, title }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">{title}</h2>
        <nav className="mt-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                location.pathname === item.path
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <item.icon className={cn(
                "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                location.pathname === item.path ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};
