import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { api } from '../../../services/api';
import { Search, Filter, ShieldAlert, ArrowRight } from 'lucide-react';
import { IncidentDetails } from './IncidentDetails';

interface IncidentListProps {
  refreshKey: number;
}

export const IncidentList: React.FC<IncidentListProps> = ({ refreshKey }) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('q', search);
      if (typeFilter) query.append('type', typeFilter);
      if (priorityFilter) query.append('priority', priorityFilter);
      
      const res = await api.get(`/maintenance/incidents?${query.toString()}`);
      setIncidents(res as any);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [refreshKey, search, typeFilter, priorityFilter]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'bg-red-100 text-red-800 ring-1 ring-red-200 font-extrabold shadow-sm shadow-red-500/20';
      case 'High': return 'bg-orange-100 text-orange-800 ring-1 ring-orange-200 font-bold';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200 font-bold';
      case 'Low': return 'bg-gray-100 text-gray-800 ring-1 ring-gray-200 font-bold';
      default: return 'bg-gray-100 text-gray-800 font-bold';
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'CLOSED' || status === 'VERIFIED') return 'bg-emerald-100 text-emerald-800';
    if (status === 'RESOLVED') return 'bg-blue-100 text-blue-800';
    if (status === 'REPORTED') return 'bg-purple-100 text-purple-800';
    return 'bg-amber-100 text-amber-800 animate-pulse-soft';
  };

  return (
    <>
      <Card className="shadow-sm border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Room, or Title..." 
              className="pl-9 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Fire">Fire</option>
            <option value="Medical">Medical</option>
            <option value="Power Failure">Power Failure</option>
            <option value="HVAC Failure">HVAC Failure</option>
            <option value="Water Leakage">Water Leakage</option>
          </select>
          <select 
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Incident ID</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">Loading incidents...</td></tr>
              ) : incidents.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No incidents match your criteria.</td></tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => setSelectedIncident(inc.id)}>
                    <td className="px-4 py-4">
                      <span className="font-extrabold text-gray-900">{inc.incidentId}</span>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">
                        {new Date(inc.createdTime).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-sm text-gray-900">{inc.title}</p>
                      <p className="text-xs text-gray-500">{inc.type} • Room {inc.roomNumber || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider flex w-max items-center gap-1 ${getPriorityColor(inc.priority)}`}>
                        {inc.priority === 'Critical' && <ShieldAlert size={10} />}
                        {inc.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-gray-700">{inc.assignedEngineer?.fullName || 'Unassigned'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-[#003B95] p-2 hover:bg-blue-50 rounded-lg transition">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedIncident && (
        <IncidentDetails 
          incidentId={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
          onRefresh={() => fetchIncidents()} 
        />
      )}
    </>
  );
};
