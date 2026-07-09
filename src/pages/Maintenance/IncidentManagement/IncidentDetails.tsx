import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { api } from '../../../services/api';
import { CheckCircle, Clock, ShieldAlert, FileText, IndianRupee, Activity } from 'lucide-react';

interface IncidentDetailsProps {
  incidentId: number;
  onClose: () => void;
  onRefresh: () => void;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incidentId, onClose, onRefresh }) => {
  const [incident, setIncident] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);

  // Resolution Form State
  const [resolutionData, setResolutionData] = useState({ immediateCause: '', rootCause: '', resolution: '', preventiveAction: '' });
  
  // Cost Form State
  const [costData, setCostData] = useState({ labourCost: 0, materialCost: 0, partsCost: 0, downtimeCost: 0 });

  useEffect(() => {
    fetchDetails();
  }, [incidentId]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/maintenance/incidents/${incidentId}`);
      setIncident(res as any);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.patch(`/maintenance/incidents/${incidentId}/status`, { status, notes: `Status manually updated to ${status}` });
      fetchDetails();
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleResolve = async () => {
    try {
      await api.post(`/maintenance/incidents/${incidentId}/resolve`, resolutionData);
      fetchDetails();
      onRefresh();
      setActiveTab('timeline');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Resolution failed');
    }
  };

  const handleAddCost = async () => {
    try {
      await api.post(`/maintenance/incidents/${incidentId}/cost`, costData);
      fetchDetails();
      onRefresh();
      setCostData({ labourCost: 0, materialCost: 0, partsCost: 0, downtimeCost: 0 });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add cost');
    }
  };

  if (loading) return <Modal isOpen={true} onClose={onClose} title="Loading Incident..."><div className="p-10 text-center text-gray-500">Loading...</div></Modal>;
  if (!incident) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title={`Incident Command Center: ${incident.incidentId}`} size="xl">
      <div className="space-y-6">
        
        {/* Top Info Banner */}
        <div className={`p-4 rounded-xl flex justify-between items-center ${incident.priority === 'Critical' ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-50 ring-1 ring-gray-200'}`}>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{incident.title}</h2>
            <p className="text-sm text-gray-600 mt-1">Type: {incident.type} • Room: {incident.roomNumber || 'N/A'}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full uppercase tracking-wider">{incident.status}</span>
            <p className="text-xs text-gray-500 mt-2 font-bold">Priority: {incident.priority}</p>
          </div>
        </div>

        {/* State Machine Action Bar */}
        {incident.status !== 'CLOSED' && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            {incident.status === 'REPORTED' && <button onClick={() => handleUpdateStatus('ACKNOWLEDGED')} className="btn-sm bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Acknowledge</button>}
            {['REPORTED', 'ACKNOWLEDGED'].includes(incident.status) && <button onClick={() => handleUpdateStatus('ASSIGNED')} className="btn-sm bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Mark Assigned</button>}
            {['ASSIGNED', 'UNDER_INVESTIGATION'].includes(incident.status) && <button onClick={() => handleUpdateStatus('IN_PROGRESS')} className="btn-sm bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Start Work</button>}
            {['IN_PROGRESS'].includes(incident.status) && <button onClick={() => handleUpdateStatus('UNDER_INVESTIGATION')} className="btn-sm bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Investigate</button>}
            {incident.status === 'RESOLVED' && <button onClick={() => handleUpdateStatus('VERIFIED')} className="btn-sm bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Verify Resolution</button>}
            {['VERIFIED'].includes(incident.status) && <button onClick={() => handleUpdateStatus('CLOSED')} className="btn-sm bg-gray-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Close Incident</button>}
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex gap-4 border-b border-gray-200">
          {[
            { id: 'timeline', icon: <Activity size={16} />, label: 'Timeline & Audits' },
            { id: 'rca', icon: <FileText size={16} />, label: 'Root Cause Analysis' },
            { id: 'cost', icon: <IndianRupee size={16} />, label: 'Cost Engine' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-2 text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === t.id ? 'border-b-2 border-[#003B95] text-[#003B95]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[50vh] overflow-y-auto pr-2">
          
          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="relative border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
                {incident.statusHistory.map((sh: any) => (
                  <div key={sh.id} className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                    <p className="text-xs font-bold text-gray-500">{new Date(sh.timestamp).toLocaleString()}</p>
                    <p className="text-sm font-bold text-gray-900">Status changed to {sh.status}</p>
                    {sh.notes && <p className="text-xs text-gray-600 mt-1">{sh.notes}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">By {sh.changedBy?.fullName || 'System'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RCA TAB */}
          {activeTab === 'rca' && (
            <div className="space-y-4">
              {incident.status === 'RESOLVED' || incident.status === 'CLOSED' || incident.status === 'VERIFIED' ? (
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                  <div><p className="text-xs font-bold text-gray-500 uppercase">Immediate Cause</p><p className="text-sm text-gray-900">{incident.immediateCause}</p></div>
                  <div><p className="text-xs font-bold text-gray-500 uppercase">Root Cause</p><p className="text-sm text-gray-900">{incident.rootCause}</p></div>
                  <div><p className="text-xs font-bold text-gray-500 uppercase">Resolution / Fix</p><p className="text-sm text-gray-900">{incident.resolution}</p></div>
                  <div><p className="text-xs font-bold text-gray-500 uppercase">Preventive Action</p><p className="text-sm text-gray-900">{incident.preventiveAction}</p></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">Complete the Root Cause Analysis (RCA) to formally resolve this incident.</p>
                  <input placeholder="Immediate Cause" value={resolutionData.immediateCause} onChange={e => setResolutionData({...resolutionData, immediateCause: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm" />
                  <input placeholder="Root Cause *" value={resolutionData.rootCause} onChange={e => setResolutionData({...resolutionData, rootCause: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm" />
                  <textarea placeholder="Resolution / Fix *" rows={3} value={resolutionData.resolution} onChange={e => setResolutionData({...resolutionData, resolution: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm" />
                  <textarea placeholder="Preventive Action" rows={2} value={resolutionData.preventiveAction} onChange={e => setResolutionData({...resolutionData, preventiveAction: e.target.value})} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm" />
                  <button onClick={handleResolve} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition">Submit RCA & Resolve Incident</button>
                </div>
              )}
            </div>
          )}

          {/* COST ENGINE TAB */}
          {activeTab === 'cost' && (
            <div className="space-y-6">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex justify-between items-center">
                <span className="font-bold text-orange-800">Total Incident Cost Aggregate</span>
                <span className="text-2xl font-extrabold text-orange-600">₹{incident.actualCost.toFixed(2)}</span>
              </div>

              {incident.status !== 'CLOSED' && (
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Labour Cost</label>
                    <input type="number" value={costData.labourCost} onChange={e => setCostData({...costData, labourCost: Number(e.target.value)})} className="w-full p-2 border rounded text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Material Cost</label>
                    <input type="number" value={costData.materialCost} onChange={e => setCostData({...costData, materialCost: Number(e.target.value)})} className="w-full p-2 border rounded text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Parts Cost</label>
                    <input type="number" value={costData.partsCost} onChange={e => setCostData({...costData, partsCost: Number(e.target.value)})} className="w-full p-2 border rounded text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Downtime Cost / Lost Revenue</label>
                    <input type="number" value={costData.downtimeCost} onChange={e => setCostData({...costData, downtimeCost: Number(e.target.value)})} className="w-full p-2 border rounded text-sm mt-1" />
                  </div>
                  <div className="col-span-2">
                    <button onClick={handleAddCost} className="w-full bg-gray-900 text-white font-bold py-2 rounded-lg text-sm">Add Cost Record</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Cost History Log</h4>
                {incident.costs.map((c: any) => (
                  <div key={c.id} className="flex justify-between items-center p-3 border-b border-gray-100 text-sm">
                    <span className="text-gray-600">{new Date(c.timestamp).toLocaleDateString()} - Labour: ₹{c.labourCost}, Mats: ₹{c.materialCost}</span>
                    <span className="font-bold text-gray-900">+ ₹{c.totalCost.toFixed(2)}</span>
                  </div>
                ))}
                {incident.costs.length === 0 && <p className="text-xs text-gray-400 italic">No costs logged yet.</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};
