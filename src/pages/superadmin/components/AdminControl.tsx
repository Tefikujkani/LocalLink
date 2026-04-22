import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { User, UserRole } from '../../../types';
import { Users, Shield, UserX, MoreVertical, Search, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export const AdminControl: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success(`User role elevated to ${newRole}`);
        } catch (error) {
            toast.error('Role update failed');
        }
    };

    const handleDeactivate = async (userId: string) => {
        if (!confirm('Deactivate this user account?')) return;
        try {
            await adminService.deactivateUser(userId);
            toast.success('User deactivated');
            loadUsers(); // Refresh
        } catch (error) {
            toast.error('Deactivation failed');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                <Search className="w-4 h-4 text-slate-500" />
                <input 
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-slate-100 text-sm w-full placeholder-slate-600 font-medium"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50 border-b border-slate-800">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        <AnimatePresence mode="popLayout">
                            {filteredUsers.map((u) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-slate-800/20 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                                                <Users className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{u.name}</div>
                                                <div className="text-[10px] text-slate-500 font-mono tracking-tight">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={u.role}
                                            onChange={(e) => handleRoleUpdate(u.id, e.target.value as UserRole)}
                                            className="bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">SuperAdmin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(u as any).isActive ? (
                                            <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                                                <CheckCircle className="w-3 h-3" /> Active
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Deactivated</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleDeactivate(u.id)}
                                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Deactivate"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                
                {filteredUsers.length === 0 && !loading && (
                    <div className="p-12 text-center text-slate-500 text-sm font-bold uppercase tracking-widest">
                        User directory is empty or no matches found
                    </div>
                )}
            </div>
        </div>
    );
};
