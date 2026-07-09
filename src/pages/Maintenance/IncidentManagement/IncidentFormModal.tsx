import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { api } from '../../../services/api';

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Water Leakage',
    priority: '',
    property: 'Main Tower',
    floor: '',
    roomNumber: '',
    assignedEngineerId: ''
  });
  
  const [engineers, setEngineers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch engineers from users service where role = Engineer or Maintenance
    api.get('/users?role=Maintenance').then((res: any) => setEngineers(res)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Priority is auto-detected by backend, but we can send an override if user selected
      await api.post('/maintenance/incidents', {
        ...formData,
        assignedEngineerId: formData.assignedEngineerId ? Number(formData.assignedEngineerId) : undefined
      });
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report New Incident" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Incident Title <span className="text-red-500">*</span></label>
          <input 
            required 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g. Flooding in Lobby bathroom"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#003B95]/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Incident Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <option value="Water Leakage">Water Leakage</option>
              <option value="Fire">Fire</option>
              <option value="Medical">Medical</option>
              <option value="Power Failure">Power Failure</option>
              <option value="Lift Failure">Lift Failure</option>
              <option value="HVAC Failure">HVAC Failure</option>
              <option value="Security Incident">Security Incident</option>
              <option value="Broken Furniture">Broken Furniture</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Room Number (Optional)</label>
            <input 
              name="roomNumber" 
              value={formData.roomNumber} 
              onChange={handleChange} 
              placeholder="e.g. 402"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Manual Priority Override (Optional)</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <option value="">Auto-Detect from Type</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Assign Engineer (Optional)</label>
            <select name="assignedEngineerId" value={formData.assignedEngineerId} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <option value="">-- Unassigned --</option>
              {engineers.map(e => (
                <option key={e.id} value={e.id}>{e.fullName} ({e.role})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg transition">
            {isSubmitting ? 'Reporting...' : 'Report Incident'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
