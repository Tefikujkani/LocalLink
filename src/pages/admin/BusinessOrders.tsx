import React, { useState } from 'react';
import { ShoppingBag, Users, Clock, CheckCircle2, XCircle, MessageSquare, Briefcase, ExternalLink, Filter } from 'lucide-react';
import { motion } from 'motion';
import { cn } from '../../utils/cn';

interface Order {
  id: string;
  customerName: string;
  businessName: string;
  service: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  value: string;
}

export const BusinessOrders: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Mock data for "shoh porosit" (see orders)
  const [orders] = useState<Order[]>([
    { id: 'ORD-7721', customerName: 'Ardit Berisha', businessName: 'Prishtina Coffee', service: 'Table Reservation', date: 'Today, 14:30', status: 'pending', value: '-' },
    { id: 'ORD-7690', customerName: 'Elena Krasniqi', businessName: 'Elite Fitness', service: 'Monthly Membership', date: 'Yesterday', status: 'completed', value: '€45.00' },
    { id: 'ORD-7685', customerName: 'Lirim Gashi', businessName: 'Prishtina Coffee', service: 'Catering Inquiry', date: '2 days ago', status: 'completed', value: '€120.00' },
    { id: 'ORD-7654', customerName: 'Sara Meta', businessName: 'Elite Fitness', service: 'Personal Training', date: '3 days ago', status: 'cancelled', value: '€25.00' },
  ]);

  const stats = [
    { label: 'Total Interactions', value: '48', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Pending Requests', value: '12', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Completed Services', value: '34', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Estimated Revenue', value: '€1,240', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Interactions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage orders, reservations, and inquiries for your businesses.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
           {(['all', 'pending', 'completed'] as const).map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                 filter === f ? "bg-emerald-500 text-slate-950" : "text-slate-500 hover:text-white"
               )}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         {stats.map((stat, idx) => (
           <motion.div 
             key={idx}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="bg-slate-950 border border-slate-900 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors"
           >
              <div className={cn("absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20", stat.bg)} />
              <div className="flex items-center gap-4 relative z-10">
                 <div className={cn("p-3 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                 </div>
                 <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
           <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Recent Orders & Reservations</span>
           </div>
           <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3" /> Advanced Filtering
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Request Details</th>
                <th className="px-6 py-4">Source Business</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/20 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <span className="font-bold text-white mb-0.5">{order.customerName}</span>
                       <span className="text-[10px] text-slate-500 flex items-center gap-1.5 italic">
                          <Briefcase className="w-3 h-3" /> {order.service}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                       <span className="text-slate-400 font-medium text-xs">{order.businessName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      order.status === 'completed' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" :
                      order.status === 'pending' ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/10" :
                      "bg-red-500/5 text-red-500 border-red-500/10"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-xs font-mono">
                    {order.date}
                  </td>
                  <td className="px-6 py-5 text-right space-x-2">
                     <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition-all">
                        <MessageSquare className="w-4 h-4" />
                     </button>
                     <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-900/50 border-t border-slate-800 text-center">
           <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors">
              View All Interaction History
           </button>
        </div>
      </div>
    </div>
  );
};
