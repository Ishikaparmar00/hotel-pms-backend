import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { api } from '../../../services/api';
import { IncidentList } from './IncidentList';
import { IncidentFormModal } from './IncidentFormModal';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  Plus,
  ShieldAlert,
  BarChart2
} from 'lucide-react';

export const IncidentDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/maintenance/incidents/dashboard');
      setStats(res as any);
    } catch (err) {
      console.error('Failed to load incident stats', err);
    }
  };

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="space-y-6 font-sans pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Incident Management</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor, assign, and resolve property incidents in real-time.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-500/30 flex items-center gap-2 transition-transform transform active:scale-95"
        >
          <Plus size={18} /> Report Incident
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Incidents</p>
              <h2 className="text-2xl font-extrabold text-gray-900">{stats?.total || 0}</h2>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Activity size={20} /></div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Open Incidents</p>
              <h2 className="text-2xl font-extrabold text-gray-900">{stats?.open || 0}</h2>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={20} /></div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600 shadow-sm bg-red-50/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-red-600 uppercase">Critical (Fire/Medical)</p>
              <h2 className="text-2xl font-extrabold text-red-700">{stats?.critical || 0}</h2>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-lg animate-pulse"><ShieldAlert size={20} /></div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">SLA Violations</p>
              <h2 className="text-2xl font-extrabold text-gray-900">{stats?.slaViolations || 0}</h2>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Clock size={20} /></div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Resolved Today</p>
              <h2 className="text-2xl font-extrabold text-gray-900">{stats?.resolvedToday || 0}</h2>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={20} /></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Incident List takes 3 columns */}
        <div className="lg:col-span-3">
          <IncidentList refreshKey={refreshKey} />
        </div>

        {/* Analytics Summary sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart2 size={16} className="text-gray-500" /> Resolution Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Avg Resolution Time</p>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{stats?.averageResolutionTime || '0h 0m'}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">↓ 15% from last week</p>
              </div>
              <div className="h-px bg-gray-100 w-full" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Top Categories</p>
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">HVAC Failure</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">34%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Plumbing/Leak</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Door Locks</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isCreateOpen && (
        <IncidentFormModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            setIsCreateOpen(false);
            triggerRefresh();
          }}
        />
      )}
    </div>
  );
};
