import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { User as UserIcon, Shield, Trash2, ArrowUpCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';
import { cn } from '../../utils/cn';

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, role: UserRole) => {
    try {
      await userService.updateUserRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      toast.success(`User role updated to ${role}`);
    } catch (e) {
      toast.error('Failed to update role');
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Clock className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
        <p className="text-slate-400">View and manage platform users and permissions</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/30 sticky top-0">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-100">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{u.email}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                      u.role === 'superadmin' ? "bg-purple-500/10 text-purple-500" :
                      u.role === 'admin' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
                    )}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {u.role === 'user' && (
                      <button 
                        onClick={() => handleRoleChange(u.id, 'admin')}
                        className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                        title="Promote to Admin"
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
