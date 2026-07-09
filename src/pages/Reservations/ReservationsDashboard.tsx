import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { api } from "../../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, ArrowUpRight, ArrowDownRight, ConciergeBell, AlertOctagon, 
  Search, CheckCircle, FileCheck, CreditCard, Bed, Sparkles, MoreVertical, 
  ChevronRight, Printer, UserPlus, FileSearch, CheckSquare, Edit, Trash2, Calendar
} from "lucide-react";
import { WalkInWizard } from "./components/WalkInWizard";
import { VerificationDesk } from "./components/VerificationDesk";

export const ReservationsDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'arrivals'|'departures'|'stayovers'|'search'>('arrivals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  // --- TANSTACK REACT QUERY (Auto-polling every 30s) ---
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['reservation-dashboard', searchQuery, activeTab],
    queryFn: async () => {
      if (activeTab === 'search' && searchQuery) {
        const [searchRes, roomsRes] = await Promise.all([
          api.get(`/reservation-desk/search?q=${searchQuery}`),
          api.get('/rooms')
        ]);
        // Also fetch KPIs just to keep them updated
        const kpis = await api.get('/reservation-desk/dashboard');
        return { searchResults: searchRes, kpis, rooms: roomsRes.filter((r:any) => r.status === 'Available') };
      }
      
      const [kpiRes, arrRes, depRes, stayRes, roomsRes] = await Promise.all([
        api.get('/reservation-desk/dashboard'),
        api.get('/reservation-desk/arrivals'),
        api.get('/reservation-desk/departures'),
        api.get('/reservation-desk/stay-overs'),
        api.get('/rooms')
      ]);
      return { kpis: kpiRes, arrivals: arrRes, departures: depRes, stayOvers: stayRes, rooms: roomsRes.filter((r:any) => r.status === 'Available') };
    },
    refetchInterval: 30000 // 30s live polling
  });

  // Keep selectedGuest updated if polling changes their status
  useEffect(() => {
    if (selectedGuest && dashboardData) {
      let updatedGuest = null;
      if (activeTab === 'arrivals') updatedGuest = dashboardData.arrivals?.find((g:any) => g.id === selectedGuest.id);
      if (activeTab === 'departures') updatedGuest = dashboardData.departures?.find((g:any) => g.id === selectedGuest.id);
      if (activeTab === 'stayovers') updatedGuest = dashboardData.stayOvers?.find((g:any) => g.id === selectedGuest.id);
      if (activeTab === 'search') updatedGuest = dashboardData.searchResults?.find((g:any) => g.id === selectedGuest.id);
      if (updatedGuest) setSelectedGuest(updatedGuest);
    }
  }, [dashboardData, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      setActiveTab('arrivals');
      return;
    }
    setActiveTab('search');
    queryClient.invalidateQueries({ queryKey: ['reservation-dashboard'] });
  };

  const handleCheckIn = async () => {
    if (!selectedGuest) return;
    try {
      await api.post(`/reservation-desk/check-in/${selectedGuest.id}`, {});
      queryClient.invalidateQueries({ queryKey: ['reservation-dashboard'] });
      alert(`Success! ${selectedGuest.guestName} is checked in.`);
    } catch (e: any) {
      alert(`Check-in failed: ${e.response?.data?.message || e.message}`);
    }
  };

  const handleExpressCheckout = async (id: number) => {
    if(!window.confirm("Are you sure you want to checkout this guest?")) return;
    try {
      await api.post(`/reservation-desk/check-out/${id}`, {});
      queryClient.invalidateQueries({ queryKey: ['reservation-dashboard'] });
      alert("Checkout successful. Housekeeping task spawned.");
    } catch (e: any) {
      alert(`Checkout failed: ${e.response?.data?.message || e.message}`);
    }
  };

  if (isLoading && !dashboardData) {
    return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Loading Live Registration Desk...</div>;
  }

  const kpis = dashboardData?.kpis || {};
  
  // Decide which list to render
  let displayList: any[] = [];
  if (activeTab === 'arrivals') displayList = dashboardData?.arrivals || [];
  if (activeTab === 'departures') displayList = dashboardData?.departures || [];
  if (activeTab === 'stayovers') displayList = dashboardData?.stayOvers || [];
  if (activeTab === 'search') displayList = dashboardData?.searchResults || [];

  const renderTable = (data: any[], type: string) => (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
            <th className="p-4 rounded-tl-lg">Guest</th>
            <th className="p-4">Reservation #</th>
            <th className="p-4">Room & Type</th>
            <th className="p-4">Dates</th>
            <th className="p-4">Payment</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                    <Calendar size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">No {activeTab} scheduled today</h3>
                  <p className="text-sm text-gray-500 mt-1">Check back later or register a new walk-in.</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item: any) => (
              <tr key={item.id} className={`hover:bg-blue-50/50 cursor-pointer transition ${selectedGuest?.id === item.id ? 'bg-blue-50 border-l-4 border-[#003B95]' : 'border-l-4 border-transparent'}`} onClick={() => setSelectedGuest(item)}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {item.guestPhotoUrl ? (
                      <img src={item.guestPhotoUrl} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#003B95] font-extrabold flex items-center justify-center text-sm">{item.guestName.charAt(0)}</div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{item.guestName}</p>
                      <p className="text-[10px] text-gray-500 font-semibold">{item.bookingSource || 'Direct'}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs text-gray-600">{item.reservationNumber}</td>
                <td className="p-4">
                  <p className="font-bold text-gray-900">{item.room?.roomNumber || 'TBA'}</p>
                  <p className="text-xs text-gray-500">{item.roomType}</p>
                </td>
                <td className="p-4 text-xs">
                  <p className="text-gray-900 font-semibold">{new Date(item.checkIn).toLocaleDateString('en-GB')}</p>
                  <p className="text-gray-500">{new Date(item.checkOut).toLocaleDateString('en-GB')}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'Checked-In' ? 'bg-blue-100 text-blue-700' : 
                    item.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                    item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{item.status}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {type === 'departures' && item.status === 'Checked-In' && (
                      <button onClick={(e)=>{e.stopPropagation(); handleExpressCheckout(item.id)}} className="text-xs bg-rose-50 text-rose-600 px-3 py-1.5 rounded font-bold hover:bg-rose-100 transition shadow-sm">Checkout</button>
                    )}
                    {type === 'arrivals' && item.status !== 'Checked-In' && (
                      <button onClick={() => setSelectedGuest(item)} className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded font-bold hover:bg-orange-700 transition shadow-sm">Select</button>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition"><MoreVertical size={16}/></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 font-sans pb-20 max-w-[1600px] mx-auto">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Registration Control Desk</h1>
          <p className="text-sm text-gray-500 mt-1">Live arrivals, check-ins, multi-step walk-ins, and identity verification.</p>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, ID, or Phone..." 
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#003B95] bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); if(!e.target.value) setActiveTab('arrivals');}}
            />
          </form>
          <button onClick={() => setIsWalkInOpen(true)} className="bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-700 transition shadow-md hover:-translate-y-0.5">
            <UserPlus size={16}/> Walk-in Guest
          </button>
        </div>
      </div>

      {/* DASHBOARD KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-5 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Arrivals</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{kpis.totalArrivals || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><ArrowDownRight size={20}/></div>
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Departures</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{kpis.totalDepartures || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500"><ArrowUpRight size={20}/></div>
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Occupancy</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{kpis.currentOccupancy || 0}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><Bed size={20}/></div>
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Walk-ins</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{kpis.walkInGuests || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><Users size={20}/></div>
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-rose-500 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">OOO / Dirty</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{kpis.outOfOrderRooms || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500"><AlertOctagon size={20}/></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* MAIN ROSTER TABLE */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
            <button onClick={() => setActiveTab('arrivals')} className={`px-5 py-2 font-bold text-sm rounded-md transition-colors ${activeTab === 'arrivals' ? 'bg-white text-[#003B95] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Today's Arrivals</button>
            <button onClick={() => setActiveTab('departures')} className={`px-5 py-2 font-bold text-sm rounded-md transition-colors ${activeTab === 'departures' ? 'bg-white text-[#003B95] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Today's Departures</button>
            <button onClick={() => setActiveTab('stayovers')} className={`px-5 py-2 font-bold text-sm rounded-md transition-colors ${activeTab === 'stayovers' ? 'bg-white text-[#003B95] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Stay-overs</button>
            {activeTab === 'search' && <button className="px-5 py-2 font-bold text-sm rounded-md bg-amber-50 text-amber-600 shadow-sm border border-amber-200">Search Results: "{searchQuery}"</button>}
          </div>

          <Card className="p-0 shadow-sm border border-gray-200 overflow-hidden">
            {renderTable(displayList, activeTab)}
          </Card>
        </div>

        {/* VERIFICATION DESK SIDEBAR */}
        <div className="xl:col-span-4 sticky top-6">
          <VerificationDesk 
            reservation={selectedGuest} 
            onVerify={() => queryClient.invalidateQueries({ queryKey: ['reservation-dashboard'] })}
            onCheckIn={handleCheckIn}
          />
        </div>
      </div>

      {/* WALK-IN WIZARD MODAL */}
      {isWalkInOpen && (
        <WalkInWizard 
          isOpen={isWalkInOpen} 
          onClose={() => setIsWalkInOpen(false)} 
          availableRooms={dashboardData?.rooms || []}
          onComplete={() => {
            setIsWalkInOpen(false);
            queryClient.invalidateQueries({ queryKey: ['reservation-dashboard'] });
          }}
        />
      )}
    </div>
  );
};
