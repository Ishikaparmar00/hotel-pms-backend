import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', mobileNumber: '', gender: 'Male', dateOfBirth: '',
    department: 'Front Desk', designation: '', joiningDate: '', role: 'Front Desk',
    password: '', confirmPassword: '', status: 'Active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = ["Super Admin", "Admin", "General Manager", "Front Desk", "Reservation Staff", "Housekeeping", "Restaurant Manager", "Finance", "HR"];
  const departments = ["Front Desk", "Reservations", "Housekeeping", "Restaurant", "Finance", "HR", "Sales", "Engineering", "Management"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/users', form);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Employee Account" size="xl">
      <form onSubmit={handleSubmit} className="p-5 space-y-6 text-sm">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded font-bold">{error}</div>}

        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block font-bold mb-1">Full Name *</label><input required className="w-full border p-2 rounded" value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})}/></div>
            <div><label className="block font-bold mb-1">Email *</label><input required type="email" className="w-full border p-2 rounded" value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/></div>
            <div><label className="block font-bold mb-1">Mobile Number *</label><input required className="w-full border p-2 rounded" value={form.mobileNumber} onChange={e=>setForm({...form, mobileNumber: e.target.value})}/></div>
            <div>
              <label className="block font-bold mb-1">Gender</label>
              <select className="w-full border p-2 rounded" value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div><label className="block font-bold mb-1">Date of Birth</label><input type="date" className="w-full border p-2 rounded" value={form.dateOfBirth} onChange={e=>setForm({...form, dateOfBirth: e.target.value})}/></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Employment Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Department *</label>
              <select required className="w-full border p-2 rounded" value={form.department} onChange={e=>setForm({...form, department: e.target.value})}>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div><label className="block font-bold mb-1">Designation</label><input className="w-full border p-2 rounded" value={form.designation} onChange={e=>setForm({...form, designation: e.target.value})}/></div>
            <div><label className="block font-bold mb-1">Joining Date</label><input type="date" className="w-full border p-2 rounded" value={form.joiningDate} onChange={e=>setForm({...form, joiningDate: e.target.value})}/></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Access Control</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">System Role *</label>
              <select required className="w-full border p-2 rounded" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Account Status</label>
              <select className="w-full border p-2 rounded" value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Locked">Locked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Security</h3>
          <div className="grid grid-cols-1 gap-4">
            <div><label className="block font-bold mb-1">Username *</label><input required className="w-full border p-2 rounded" value={form.username} onChange={e=>setForm({...form, username: e.target.value})}/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block font-bold mb-1">Password *</label><input required type="password" placeholder="Min 8 chars, 1 Upper, 1 Special" className="w-full border p-2 rounded" value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/></div>
            <div><label className="block font-bold mb-1">Confirm Password *</label><input required type="password" placeholder="Confirm" className="w-full border p-2 rounded" value={form.confirmPassword} onChange={e=>setForm({...form, confirmPassword: e.target.value})}/></div>
          </div>
        </div>

        <div className="flex justify-end pt-4 gap-2 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-[#003B95] text-white rounded font-bold hover:bg-blue-800 disabled:opacity-50">
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
