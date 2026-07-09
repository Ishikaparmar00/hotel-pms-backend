import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';
import { CreateUserModal } from './CreateUserModal';
import { Search, UserPlus, ShieldAlert, Filter, Mail, Phone, Shield, Building, Clock, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StaffDirectory: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/users?q=${searchQuery}&role=${roleFilter}&status=${statusFilter}`);
      setUsers(res as any);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, statusFilter]);

  const handleDelete = async (id: number, username: string) => {
    if (window.confirm(`Are you sure you want to delete ${username}? This action is irreversible.`)) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await api.put(`/users/${id}`, { status: newStatus });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (currentUser?.role !== 'Super Admin' && currentUser?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
        <div className="bg-red-50 p-8 rounded-full mb-6 ring-8 ring-red-50/50">
          <ShieldAlert className="text-red-500" size={64} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Access Restricted</h2>
        <p className="text-gray-500 mt-3 max-w-md">You do not have the required administrative privileges to view or manage the Staff Directory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-20 animate-fade-in">
      
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-[#003B95] to-blue-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 -mb-10 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wide uppercase mb-3 backdrop-blur-sm">
              <Shield size={14} className="text-blue-200" />
              Administrative Hub
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Staff Directory</h1>
            <p className="text-blue-100 mt-2 text-sm max-w-xl">
              Securely provision access, manage departmental roles, and oversee all registered personnel across the property.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="group relative inline-flex items-center gap-2 bg-white text-[#003B95] px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" /> 
            Create Account
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#003B95] transition-colors" />
          <input 
            type="text" 
            placeholder="Search employees by name, email, or ID..." 
            className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
        
        <div className="flex w-full md:w-auto gap-2 p-2 md:p-0">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              className="w-full appearance-none pl-9 pr-8 py-2.5 bg-gray-50 hover:bg-gray-100 border border-transparent rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003B95]/20 transition-colors cursor-pointer"
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Finance">Finance</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 md:w-48">
            <select 
              className="w-full appearance-none pl-4 pr-8 py-2.5 bg-gray-50 hover:bg-gray-100 border border-transparent rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003B95]/20 transition-colors cursor-pointer"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Locked">Locked</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#003B95] rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No staff found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map(u => (
            <div key={u.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col">
              {/* Card Header Background */}
              <div className="h-20 bg-slate-50 border-b border-gray-100 relative">
                <div className="absolute top-4 right-4">
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm ${
                    u.status === 'Active' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : 
                    u.status === 'Locked' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
                  }`}>
                    {u.status}
                  </span>
                </div>
              </div>
              
              {/* Profile Avatar */}
              <div className="px-6 flex justify-center -mt-10 mb-3 relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#003B95] to-blue-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg border-4 border-white transform group-hover:-translate-y-1 transition-transform">
                  {u.fullName.charAt(0)}
                </div>
              </div>

              {/* Profile Details */}
              <div className="px-6 pb-6 text-center flex-1">
                <h3 className="text-lg font-extrabold text-gray-900">{u.fullName}</h3>
                <p className="text-xs font-bold text-[#003B95] mt-1 uppercase tracking-wide">{u.role}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.employeeId}</p>
                
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{u.department || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{u.mobileNumber}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-2 border-t border-gray-50 bg-gray-50/50 flex gap-2 justify-between">
                {u.id !== currentUser?.id ? (
                  <>
                    <button 
                      onClick={() => handleToggleStatus(u.id, u.status)} 
                      className="flex-1 py-2.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                    >
                      Toggle Status
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id, u.username)} 
                      className="flex-1 py-2.5 text-xs font-bold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors shadow-sm"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <div className="flex-1 py-2.5 text-xs font-bold text-gray-400 bg-gray-100 rounded-xl text-center">
                    Current Session
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateUserModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchUsers();
          }} 
        />
      )}
    </div>
  );
};
